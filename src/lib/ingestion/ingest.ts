import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
	changes,
	changesets,
	sourceFetches,
	sponsorSnapshots,
	sponsors,
} from "@/db/schema";
import type { NormalizedSponsor } from "@/lib/matching/normalize";
import { computeDiff, type DiffResult } from "./diff-engine";
import { discoverCsvUrl, type FetchResult, fetchCsv } from "./fetch-csv";
import { parseCsv } from "./parse-csv";

/**
 * Get the most recent source fetch record for conditional requests.
 */
async function getLastFetch() {
	const [last] = await db
		.select()
		.from(sourceFetches)
		.orderBy(sourceFetches.fetchedAt)
		.limit(1);
	return last ?? null;
}

/**
 * Get all currently active sponsors from the database.
 */
async function getActiveSponsorMap(): Promise<
	Map<string, typeof sponsors.$inferSelect>
> {
	const active = await db
		.select()
		.from(sponsors)
		.where(eq(sponsors.status, "active"));

	const map = new Map<string, typeof sponsors.$inferSelect>();
	for (const s of active) {
		const key = `${s.canonicalName}::${s.town ?? ""}`;
		map.set(key, s);
	}
	return map;
}

/**
 * Store a new source fetch record.
 */
async function storeFetchRecord(result: FetchResult, rowCount: number) {
	const [record] = await db
		.insert(sourceFetches)
		.values({
			etag: result.etag,
			lastModified: result.lastModified,
			contentHash: result.contentHash,
			rowCount,
			fileSize: result.fileSize,
			csvUrl: result.csvUrl,
		})
		.returning();
	return record;
}

/**
 * Create or update sponsor records based on the current CSV data.
 * Returns a map of canonical_name::town → sponsor_id.
 */
async function upsertSponsors(
	rows: NormalizedSponsor[],
	fetchId: string,
	existingMap: Map<string, typeof sponsors.$inferSelect>,
): Promise<Map<string, string>> {
	const idMap = new Map<string, string>();

	for (const row of rows) {
		const key = `${row.canonicalName}::${row.town ?? ""}`;
		const existing = existingMap.get(key);

		if (existing) {
			// Update existing sponsor
			await db
				.update(sponsors)
				.set({
					rating: row.rating,
					sponsorType: row.sponsorType,
					routes: row.routes,
					county: row.county,
					status: "active",
					lastSeenFetchId: fetchId,
					lastSeenAt: new Date(),
					removedAt: null,
					updatedAt: new Date(),
				})
				.where(eq(sponsors.id, existing.id));
			idMap.set(key, existing.id);
		} else {
			// Insert new sponsor
			const [created] = await db
				.insert(sponsors)
				.values({
					canonicalName: row.canonicalName,
					town: row.town,
					county: row.county,
					sponsorType: row.sponsorType,
					rating: row.rating,
					routes: row.routes,
					status: "active",
					firstSeenFetchId: fetchId,
					lastSeenFetchId: fetchId,
					firstSeenAt: new Date(),
					lastSeenAt: new Date(),
				})
				.returning();
			idMap.set(key, created.id);
		}
	}

	return idMap;
}

/**
 * Mark sponsors as removed if they're no longer in the CSV.
 */
async function markRemoved(
	removedSponsors: NormalizedSponsor[],
	existingMap: Map<string, typeof sponsors.$inferSelect>,
) {
	for (const r of removedSponsors) {
		const key = `${r.canonicalName}::${r.town ?? ""}`;
		const existing = existingMap.get(key);
		if (existing) {
			await db
				.update(sponsors)
				.set({
					status: "removed",
					removedAt: new Date(),
					updatedAt: new Date(),
				})
				.where(eq(sponsors.id, existing.id));
		}
	}
}

/**
 * Store the changeset and individual change records.
 */
async function storeChangeset(
	fetchId: string,
	diff: DiffResult,
	sponsorIdMap: Map<string, string>,
	existingMap: Map<string, typeof sponsors.$inferSelect>,
) {
	const [changeset] = await db
		.insert(changesets)
		.values({
			fetchId,
			addedCount: diff.added.length,
			removedCount: diff.removed.length,
			updatedCount: diff.updated.length,
			summary: `${diff.added.length} added, ${diff.removed.length} removed, ${diff.updated.length} updated`,
		})
		.returning();

	const changeRecords: (typeof changes.$inferInsert)[] = [];

	for (const s of diff.added) {
		const key = `${s.canonicalName}::${s.town ?? ""}`;
		const sponsorId = sponsorIdMap.get(key);
		if (sponsorId) {
			changeRecords.push({
				changesetId: changeset.id,
				sponsorId,
				changeType: "added",
			});
		}
	}

	for (const s of diff.removed) {
		const key = `${s.canonicalName}::${s.town ?? ""}`;
		const existing = existingMap.get(key);
		if (existing) {
			changeRecords.push({
				changesetId: changeset.id,
				sponsorId: existing.id,
				changeType: "removed",
			});
		}
	}

	for (const u of diff.updated) {
		const key = `${u.sponsor.canonicalName}::${u.sponsor.town ?? ""}`;
		const sponsorId = sponsorIdMap.get(key);
		if (sponsorId) {
			for (const c of u.changes) {
				changeRecords.push({
					changesetId: changeset.id,
					sponsorId,
					changeType: "updated",
					field: c.field,
					oldValue: c.oldValue,
					newValue: c.newValue,
				});
			}
		}
	}

	if (changeRecords.length > 0) {
		// Insert in batches to avoid max params limit
		const BATCH_SIZE = 500;
		for (let i = 0; i < changeRecords.length; i += BATCH_SIZE) {
			await db.insert(changes).values(changeRecords.slice(i, i + BATCH_SIZE));
		}
	}

	return changeset;
}

/**
 * Store raw snapshots for audit trail.
 */
async function storeSnapshots(
	rows: NormalizedSponsor[],
	fetchId: string,
	sponsorIdMap: Map<string, string>,
) {
	const BATCH_SIZE = 500;
	const snapshots: (typeof sponsorSnapshots.$inferInsert)[] = [];

	for (const row of rows) {
		const key = `${row.canonicalName}::${row.town ?? ""}`;
		const sponsorId = sponsorIdMap.get(key);
		if (sponsorId) {
			snapshots.push({
				fetchId,
				sponsorId,
				rawRow: row as unknown as Record<string, unknown>,
				normalizedName: row.canonicalName,
			});
		}
	}

	for (let i = 0; i < snapshots.length; i += BATCH_SIZE) {
		await db
			.insert(sponsorSnapshots)
			.values(snapshots.slice(i, i + BATCH_SIZE));
	}
}

export interface IngestResult {
	status: "no_change" | "first_import" | "updated";
	fetchId?: string;
	changesetId?: string;
	rowCount: number;
	diff?: DiffResult;
}

/**
 * Main ingestion pipeline: fetch CSV → parse → diff → store.
 */
export async function ingest(): Promise<IngestResult> {
	// 1. Discover current CSV URL
	const csvUrl = await discoverCsvUrl();

	// 2. Get last fetch for conditional requests
	const lastFetch = await getLastFetch();

	// 3. Fetch CSV
	const result = await fetchCsv(
		csvUrl,
		lastFetch?.etag,
		lastFetch?.lastModified,
	);

	if (result.notModified) {
		return { status: "no_change", rowCount: 0 };
	}

	// 4. Check content hash — skip if identical
	if (lastFetch && lastFetch.contentHash === result.contentHash) {
		return { status: "no_change", rowCount: 0 };
	}

	// 5. Parse CSV
	const rows = parseCsv(result.csv);

	// 6. Store fetch record
	const fetchRecord = await storeFetchRecord(result, rows.length);

	// 7. Get existing sponsors
	const existingMap = await getActiveSponsorMap();

	// 8. Convert existing DB sponsors to NormalizedSponsor format for diffing
	const previousRows: NormalizedSponsor[] = Array.from(
		existingMap.values(),
	).map((s) => ({
		canonicalName: s.canonicalName,
		originalName: s.canonicalName,
		town: s.town,
		county: s.county,
		sponsorType: s.sponsorType,
		rating: s.rating,
		routes: s.routes ?? [],
		status: s.status,
	}));

	const isFirstImport = existingMap.size === 0;

	// 9. Compute diff
	const diff = computeDiff(previousRows, rows);

	// 10. Upsert sponsors
	const sponsorIdMap = await upsertSponsors(rows, fetchRecord.id, existingMap);

	// 11. Mark removed sponsors
	await markRemoved(diff.removed, existingMap);

	// 12. Store changeset (if there are changes)
	let changesetId: string | undefined;
	if (
		diff.added.length > 0 ||
		diff.removed.length > 0 ||
		diff.updated.length > 0
	) {
		const changeset = await storeChangeset(
			fetchRecord.id,
			diff,
			sponsorIdMap,
			existingMap,
		);
		changesetId = changeset.id;
	}

	// 13. Store snapshots
	await storeSnapshots(rows, fetchRecord.id, sponsorIdMap);

	return {
		status: isFirstImport ? "first_import" : "updated",
		fetchId: fetchRecord.id,
		changesetId,
		rowCount: rows.length,
		diff,
	};
}
