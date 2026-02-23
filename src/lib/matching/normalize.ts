const STOPWORDS = new Set([
	"ltd",
	"ltd.",
	"limited",
	"llp",
	"plc",
	"inc",
	"inc.",
	"corp",
	"corp.",
	"corporation",
	"uk",
	"services",
	"group",
	"holdings",
	"international",
	"consulting",
	"consultants",
	"associates",
	"partners",
	"partnership",
	"&",
	"and",
	"the",
	"of",
	"co",
	"co.",
	"company",
]);

/**
 * Normalize a sponsor name for matching:
 * - lowercase
 * - trim whitespace
 * - remove common business suffixes (Ltd, LLP, PLC, etc.)
 * - collapse multiple spaces
 * - remove trailing punctuation
 */
export function normalizeName(name: string): string {
	if (!name || !name.trim()) return "";

	let normalized = name.toLowerCase().trim();

	// Remove trailing punctuation
	normalized = normalized.replace(/[.,;:]+$/g, "");

	// Split into words, remove stopwords (but keep at least one word)
	const words = normalized.split(/\s+/).filter(Boolean);
	const filtered = words.filter((w) => !STOPWORDS.has(w));

	// If all words are stopwords, keep the first one
	const result = filtered.length > 0 ? filtered : words.slice(0, 1);

	return result
		.join(" ")
		.replace(/[.,;:]+$/g, "")
		.trim();
}

export interface CsvRow {
	"Organisation Name": string;
	"Town/City": string;
	County: string;
	"Type & Rating": string;
	Route: string;
}

export interface NormalizedSponsor {
	canonicalName: string;
	originalName: string;
	town: string | null;
	county: string | null;
	sponsorType: string | null;
	rating: string | null;
	routes: string[];
}

/**
 * Parse the "Type & Rating" field into sponsorType and rating.
 * Format: "Worker (A rating)" → { sponsorType: "Worker", rating: "A rating" }
 */
function parseTypeAndRating(raw: string): {
	sponsorType: string | null;
	rating: string | null;
} {
	if (!raw || !raw.trim()) return { sponsorType: null, rating: null };

	const match = raw.match(/^(.+?)\s*\((.+?)\)\s*$/);
	if (match) {
		return {
			sponsorType: match[1].trim(),
			rating: match[2].trim(),
		};
	}

	return { sponsorType: raw.trim(), rating: null };
}

/**
 * Normalize a raw CSV row into structured sponsor data.
 */
export function normalizeRow(row: CsvRow): NormalizedSponsor {
	const originalName = row["Organisation Name"] || "";
	const { sponsorType, rating } = parseTypeAndRating(row["Type & Rating"]);

	const routeStr = row.Route || "";
	const routes = routeStr
		.split(";")
		.map((r) => r.trim())
		.filter(Boolean);

	const town = row["Town/City"]?.trim().toLowerCase() || null;
	const county = row.County?.trim().toLowerCase() || null;

	return {
		canonicalName: normalizeName(originalName),
		originalName,
		town: town || null,
		county: county || null,
		sponsorType,
		rating,
		routes,
	};
}
