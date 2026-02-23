import { describe, expect, it } from "vitest";
import {
	findMatchingRules,
	matchesRule,
	type Rule,
	type SponsorData,
} from "../rule-matcher";

const sponsor: SponsorData = {
	canonicalName: "acme technologies",
	town: "London",
	routes: ["Skilled Worker", "Global Business Mobility"],
};

describe("matchesRule", () => {
	it("matches company rule (exact, case-insensitive)", () => {
		expect(
			matchesRule(sponsor, { ruleType: "company", value: "Acme Technologies" }),
		).toBe(true);
	});

	it("rejects company rule that does not match", () => {
		expect(
			matchesRule(sponsor, { ruleType: "company", value: "Acme Corp" }),
		).toBe(false);
	});

	it("matches keyword rule (substring)", () => {
		expect(matchesRule(sponsor, { ruleType: "keyword", value: "acme" })).toBe(
			true,
		);
	});

	it("rejects keyword rule that does not match", () => {
		expect(
			matchesRule(sponsor, { ruleType: "keyword", value: "quantum" }),
		).toBe(false);
	});

	it("matches location rule (case-insensitive)", () => {
		expect(
			matchesRule(sponsor, { ruleType: "location", value: "london" }),
		).toBe(true);
	});

	it("rejects location rule that does not match", () => {
		expect(
			matchesRule(sponsor, { ruleType: "location", value: "Manchester" }),
		).toBe(false);
	});

	it("matches route rule", () => {
		expect(
			matchesRule(sponsor, { ruleType: "route", value: "Skilled Worker" }),
		).toBe(true);
	});

	it("rejects route rule that does not match", () => {
		expect(
			matchesRule(sponsor, { ruleType: "route", value: "Temporary Worker" }),
		).toBe(false);
	});

	it("handles sponsor with null town for location rule", () => {
		const s: SponsorData = { canonicalName: "test", town: null, routes: [] };
		expect(matchesRule(s, { ruleType: "location", value: "London" })).toBe(
			false,
		);
	});

	it("handles sponsor with null routes for route rule", () => {
		const s: SponsorData = { canonicalName: "test", routes: null };
		expect(matchesRule(s, { ruleType: "route", value: "Skilled Worker" })).toBe(
			false,
		);
	});

	it("returns false for unknown rule type", () => {
		expect(matchesRule(sponsor, { ruleType: "unknown", value: "test" })).toBe(
			false,
		);
	});
});

describe("findMatchingRules", () => {
	it("returns all rules that match the sponsor", () => {
		const rules: Rule[] = [
			{ ruleType: "company", value: "Acme Technologies" },
			{ ruleType: "keyword", value: "tech" },
			{ ruleType: "location", value: "Manchester" },
			{ ruleType: "route", value: "Skilled Worker" },
		];
		const matched = findMatchingRules(sponsor, rules);
		expect(matched).toHaveLength(3);
		expect(matched.map((r) => r.ruleType)).toEqual([
			"company",
			"keyword",
			"route",
		]);
	});

	it("returns empty array when no rules match", () => {
		const rules: Rule[] = [
			{ ruleType: "company", value: "no match" },
			{ ruleType: "location", value: "Mars" },
		];
		expect(findMatchingRules(sponsor, rules)).toHaveLength(0);
	});
});
