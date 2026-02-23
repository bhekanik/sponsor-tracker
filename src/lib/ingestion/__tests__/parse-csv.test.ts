import { describe, expect, it } from "vitest";
import { parseCsv } from "../parse-csv";

const SAMPLE_CSV = `"Organisation Name","Town/City","County","Type & Rating","Route"
"Acme Corp Ltd","London","Greater London","Worker (A rating)","Skilled Worker"
"Beta Holdings LLP","Manchester","Greater Manchester","Worker (B rating)","Skilled Worker; Global Business Mobility - Senior or Specialist Worker"
"Gamma Services","","","Worker (A rating)","Temporary Worker - Charity Worker"`;

describe("parseCsv", () => {
	it("parses CSV string into normalized sponsor rows", async () => {
		const rows = await parseCsv(SAMPLE_CSV);
		expect(rows).toHaveLength(3);
	});

	it("normalizes names correctly", async () => {
		const rows = await parseCsv(SAMPLE_CSV);
		expect(rows[0].canonicalName).toBe("acme");
		expect(rows[0].originalName).toBe("Acme Corp Ltd");
	});

	it("extracts type and rating", async () => {
		const rows = await parseCsv(SAMPLE_CSV);
		expect(rows[0].sponsorType).toBe("Worker");
		expect(rows[0].rating).toBe("A rating");
		expect(rows[1].rating).toBe("B rating");
	});

	it("parses multiple routes", async () => {
		const rows = await parseCsv(SAMPLE_CSV);
		expect(rows[1].routes).toEqual([
			"Skilled Worker",
			"Global Business Mobility - Senior or Specialist Worker",
		]);
	});

	it("handles empty town/county", async () => {
		const rows = await parseCsv(SAMPLE_CSV);
		expect(rows[2].town).toBeNull();
		expect(rows[2].county).toBeNull();
	});
});
