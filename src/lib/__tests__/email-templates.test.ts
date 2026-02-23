import { describe, expect, it } from "vitest";
import { dailyDigestHtml, instantAlertHtml } from "../email-templates";

describe("instantAlertHtml", () => {
	it("renders watchlist name and changes", () => {
		const html = instantAlertHtml("My Watchlist", [
			{
				sponsorName: "Acme Corp",
				changeType: "added",
			},
			{
				sponsorName: "Beta Ltd",
				changeType: "updated",
				field: "rating",
				oldValue: "B",
				newValue: "A",
			},
		]);

		expect(html).toContain("My Watchlist");
		expect(html).toContain("Acme Corp");
		expect(html).toContain("added");
		expect(html).toContain("Beta Ltd");
		expect(html).toContain("rating");
		expect(html).toContain("B");
		expect(html).toContain("A");
	});

	it("handles changes without field details", () => {
		const html = instantAlertHtml("Test", [
			{ sponsorName: "Removed Co", changeType: "removed" },
		]);
		expect(html).toContain("Removed Co");
		expect(html).toContain("removed");
	});
});

describe("dailyDigestHtml", () => {
	it("renders multiple watchlists with changes", () => {
		const html = dailyDigestHtml([
			{
				watchlistName: "London Sponsors",
				items: [{ sponsorName: "New Ltd", changeType: "added" }],
			},
			{
				watchlistName: "Tech Companies",
				items: [
					{
						sponsorName: "Tech Co",
						changeType: "updated",
						field: "routes",
						oldValue: "Skilled Worker",
						newValue: "Skilled Worker, Global Business Mobility",
					},
				],
			},
		]);

		expect(html).toContain("Daily Digest");
		expect(html).toContain("London Sponsors");
		expect(html).toContain("New Ltd");
		expect(html).toContain("Tech Companies");
		expect(html).toContain("Tech Co");
	});
});
