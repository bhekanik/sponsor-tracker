import { describe, expect, it } from "vitest";
import { buildSearchQuery } from "../fuzzy-match";

describe("buildSearchQuery", () => {
	it("returns SQL components for a search term", () => {
		const result = buildSearchQuery("deloitte");
		expect(result.searchTerm).toBe("deloitte");
		expect(result.similarityThreshold).toBe(0.3);
	});

	it("normalizes the search term", () => {
		const result = buildSearchQuery("  DELOITTE LTD  ");
		expect(result.searchTerm).toBe("deloitte");
	});

	it("handles empty search term", () => {
		const result = buildSearchQuery("");
		expect(result.searchTerm).toBe("");
	});
});
