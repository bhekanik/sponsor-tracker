import { parse } from "csv-parse/sync";
import {
	type CsvRow,
	type NormalizedSponsor,
	normalizeRow,
} from "@/lib/matching/normalize";

/**
 * Parse a CSV string from the GOV.UK sponsor register into normalized sponsor data.
 */
export function parseCsv(csvContent: string): NormalizedSponsor[] {
	const records: CsvRow[] = parse(csvContent, {
		columns: true,
		skip_empty_lines: true,
		trim: true,
		relax_quotes: true,
		relax_column_count: true,
	});

	return records.map(normalizeRow);
}
