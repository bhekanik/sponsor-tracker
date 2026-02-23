import { createHash } from "node:crypto";

const GOVUK_PAGE_URL =
	"https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers";

export interface FetchResult {
	csv: string;
	etag: string | null;
	lastModified: string | null;
	contentHash: string;
	fileSize: number;
	csvUrl: string;
	notModified: false;
}

export interface NotModifiedResult {
	notModified: true;
}

export type CsvFetchResult = FetchResult | NotModifiedResult;

/**
 * Discover the current CSV download URL from the GOV.UK publications page.
 * The URL changes with each update (contains date in filename).
 */
export async function discoverCsvUrl(): Promise<string> {
	const response = await fetch(GOVUK_PAGE_URL);
	const html = await response.text();

	// Look for the CSV download link in the page
	const csvMatch = html.match(
		/href="(https:\/\/assets\.publishing\.service\.gov\.uk\/media\/[^"]+\.csv)"/,
	);
	if (!csvMatch) {
		throw new Error("Could not find CSV download URL on GOV.UK page");
	}

	return csvMatch[1];
}

/**
 * Fetch the sponsor register CSV with conditional request support.
 * Returns the CSV content and metadata, or NotModifiedResult if unchanged.
 */
export async function fetchCsv(
	csvUrl: string,
	previousEtag?: string | null,
	previousLastModified?: string | null,
): Promise<CsvFetchResult> {
	const headers: Record<string, string> = {};

	if (previousEtag) {
		headers["If-None-Match"] = previousEtag;
	}
	if (previousLastModified) {
		headers["If-Modified-Since"] = previousLastModified;
	}

	const response = await fetch(csvUrl, { headers });

	if (response.status === 304) {
		return { notModified: true };
	}

	if (!response.ok) {
		throw new Error(
			`Failed to fetch CSV: ${response.status} ${response.statusText}`,
		);
	}

	const csv = await response.text();
	const contentHash = createHash("sha256").update(csv).digest("hex");
	const etag = response.headers.get("etag");
	const lastModified = response.headers.get("last-modified");

	return {
		csv,
		etag,
		lastModified,
		contentHash,
		fileSize: csv.length,
		csvUrl,
		notModified: false,
	};
}
