import { describe, expect, it } from "vitest";
import { normalizeName, normalizeRow } from "../normalize";

describe("normalizeName", () => {
	it("lowercases and trims", () => {
		expect(normalizeName("  ACME Technologies  ")).toBe("acme technologies");
	});

	it("removes common suffixes", () => {
		expect(normalizeName("Acme Limited")).toBe("acme");
		expect(normalizeName("Acme Ltd")).toBe("acme");
		expect(normalizeName("Acme Ltd.")).toBe("acme");
		expect(normalizeName("Acme LLP")).toBe("acme");
		expect(normalizeName("Acme PLC")).toBe("acme");
	});

	it("removes multiple stopwords", () => {
		expect(normalizeName("Acme Services Group Limited")).toBe("acme");
	});

	it("collapses multiple spaces", () => {
		expect(normalizeName("Acme   Technologies   Solutions")).toBe(
			"acme technologies solutions",
		);
	});

	it("handles names that are entirely stopwords", () => {
		expect(normalizeName("Services Limited")).toBe("services");
	});

	it("handles empty strings", () => {
		expect(normalizeName("")).toBe("");
		expect(normalizeName("  ")).toBe("");
	});

	it("removes trailing punctuation", () => {
		expect(normalizeName("Acme, Inc.")).toBe("acme");
	});
});

describe("normalizeRow", () => {
	it("normalizes a CSV row into structured sponsor data", () => {
		const row = {
			"Organisation Name": "ACME Corp Ltd",
			"Town/City": "London",
			County: "Greater London",
			"Type & Rating": "Worker (A rating)",
			Route: "Skilled Worker",
		};

		const result = normalizeRow(row);

		expect(result.canonicalName).toBe("acme");
		expect(result.originalName).toBe("ACME Corp Ltd");
		expect(result.town).toBe("london");
		expect(result.county).toBe("greater london");
		expect(result.sponsorType).toBe("Worker");
		expect(result.rating).toBe("A rating");
		expect(result.routes).toEqual(["Skilled Worker"]);
	});

	it("handles multiple routes separated by semicolons", () => {
		const row = {
			"Organisation Name": "Deloitte LLP",
			"Town/City": "London",
			County: "",
			"Type & Rating": "Worker (A rating)",
			Route:
				"Skilled Worker; Global Business Mobility - Senior or Specialist Worker",
		};

		const result = normalizeRow(row);
		expect(result.routes).toEqual([
			"Skilled Worker",
			"Global Business Mobility - Senior or Specialist Worker",
		]);
	});

	it("handles missing/empty fields gracefully", () => {
		const row = {
			"Organisation Name": "Test Co",
			"Town/City": "",
			County: "",
			"Type & Rating": "",
			Route: "",
		};

		const result = normalizeRow(row);
		expect(result.town).toBeNull();
		expect(result.county).toBeNull();
		expect(result.sponsorType).toBeNull();
		expect(result.rating).toBeNull();
		expect(result.routes).toEqual([]);
	});
});
