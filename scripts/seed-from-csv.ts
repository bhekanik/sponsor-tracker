/**
 * Seed the database from a local CSV file.
 * Usage: DATABASE_URL=... bun run scripts/seed-from-csv.ts /path/to/sponsors.csv
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { db } from "../src/db";
import { sponsors, sourceFetches, sponsorSnapshots, changesets, changes } from "../src/db/schema";
import { parseCsv } from "../src/lib/ingestion/parse-csv";

async function main() {
	const csvPath = process.argv[2] || "/tmp/sponsors.csv";
	console.log(`Reading CSV from ${csvPath}...`);
	
	const csvContent = readFileSync(csvPath, "utf-8");
	const contentHash = createHash("sha256").update(csvContent).digest("hex");
	
	console.log("Parsing CSV...");
	const rows = await parseCsv(csvContent);
	console.log(`Parsed ${rows.length} sponsors`);
	
	// Create source fetch record
	console.log("Creating source fetch record...");
	const [fetchRecord] = await db.insert(sourceFetches).values({
		etag: null,
		lastModified: null,
		contentHash,
		rowCount: rows.length,
		fileSize: csvContent.length,
		csvUrl: "https://assets.publishing.service.gov.uk/media/699c3080d2b9c6ec5b6fbb86/2026-02-23_-_Worker_and_Temporary_Worker.csv",
	}).returning();
	
	console.log(`Fetch record: ${fetchRecord.id}`);
	
	// Create changeset
	const [cs] = await db.insert(changesets).values({
		fetchId: fetchRecord.id,
		addedCount: rows.length,
		removedCount: 0,
		updatedCount: 0,
		summary: `Initial import: ${rows.length} sponsors from GOV.UK register (2026-02-23)`,
	}).returning();
	
	// Insert sponsors in batches
	const BATCH_SIZE = 500;
	let inserted = 0;
	
	for (let i = 0; i < rows.length; i += BATCH_SIZE) {
		const batch = rows.slice(i, i + BATCH_SIZE);
		
		const sponsorValues = batch.map(row => ({
			canonicalName: row.canonicalName,
			town: row.town || null,
			county: row.county || null,
			sponsorType: row.sponsorType || null,
			rating: row.rating || null,
			routes: row.routes || [],
			status: "active" as const,
			firstSeenFetchId: fetchRecord.id,
			lastSeenFetchId: fetchRecord.id,
			firstSeenAt: new Date(),
			lastSeenAt: new Date(),
		}));
		
		const insertedSponsors = await db.insert(sponsors).values(sponsorValues).returning({ id: sponsors.id });
		
		// Create change records for this batch
		const changeValues = insertedSponsors.map(s => ({
			changesetId: cs.id,
			sponsorId: s.id,
			changeType: "added" as const,
		}));
		
		if (changeValues.length > 0) {
			await db.insert(changes).values(changeValues);
		}
		
		inserted += batch.length;
		if (inserted % 5000 === 0 || inserted === rows.length) {
			console.log(`Inserted ${inserted}/${rows.length} sponsors...`);
		}
	}
	
	console.log(`\nDone! Seeded ${inserted} sponsors.`);
	process.exit(0);
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
