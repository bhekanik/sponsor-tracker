import type { NormalizedSponsor } from "@/lib/matching/normalize";

export interface FieldChange {
	field: string;
	oldValue: string | null;
	newValue: string | null;
}

export interface UpdatedSponsor {
	sponsor: NormalizedSponsor;
	changes: FieldChange[];
}

export interface DiffResult {
	added: NormalizedSponsor[];
	removed: NormalizedSponsor[];
	updated: UpdatedSponsor[];
}

/**
 * Create a composite key from name + town for sponsor matching.
 * The GOV.UK CSV has no stable ID, so we use this as the identity.
 */
function sponsorKey(s: NormalizedSponsor): string {
	return `${s.canonicalName}::${s.town ?? ""}`;
}

/**
 * Compare two sponsors field by field and return the differences.
 */
function diffFields(
	prev: NormalizedSponsor,
	curr: NormalizedSponsor,
): FieldChange[] {
	const changes: FieldChange[] = [];

	if (prev.rating !== curr.rating) {
		changes.push({
			field: "rating",
			oldValue: prev.rating,
			newValue: curr.rating,
		});
	}

	if (prev.sponsorType !== curr.sponsorType) {
		changes.push({
			field: "sponsorType",
			oldValue: prev.sponsorType,
			newValue: curr.sponsorType,
		});
	}

	if (prev.county !== curr.county) {
		changes.push({
			field: "county",
			oldValue: prev.county,
			newValue: curr.county,
		});
	}

	const prevRoutes = (prev.routes ?? []).sort().join(", ");
	const currRoutes = (curr.routes ?? []).sort().join(", ");
	if (prevRoutes !== currRoutes) {
		changes.push({
			field: "routes",
			oldValue: prevRoutes || null,
			newValue: currRoutes || null,
		});
	}

	return changes;
}

/**
 * Compute the diff between two sponsor lists.
 * Returns added, removed, and updated sponsors.
 */
export function computeDiff(
	previous: NormalizedSponsor[],
	current: NormalizedSponsor[],
): DiffResult {
	const prevMap = new Map<string, NormalizedSponsor>();
	for (const s of previous) {
		prevMap.set(sponsorKey(s), s);
	}

	const currMap = new Map<string, NormalizedSponsor>();
	for (const s of current) {
		currMap.set(sponsorKey(s), s);
	}

	const added: NormalizedSponsor[] = [];
	const removed: NormalizedSponsor[] = [];
	const updated: UpdatedSponsor[] = [];

	// Find added and updated
	for (const [key, curr] of currMap) {
		const prev = prevMap.get(key);
		if (!prev) {
			added.push(curr);
		} else {
			const changes = diffFields(prev, curr);
			if (changes.length > 0) {
				updated.push({ sponsor: curr, changes });
			}
		}
	}

	// Find removed
	for (const [key, prev] of prevMap) {
		if (!currMap.has(key)) {
			removed.push(prev);
		}
	}

	return { added, removed, updated };
}
