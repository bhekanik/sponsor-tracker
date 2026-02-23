import { normalizeName } from "./normalize";

export interface SearchQueryParams {
	searchTerm: string;
	similarityThreshold: number;
}

/**
 * Build search query parameters for pg_trgm fuzzy matching.
 */
export function buildSearchQuery(query: string): SearchQueryParams {
	const searchTerm = normalizeName(query);
	return {
		searchTerm,
		similarityThreshold: 0.3,
	};
}
