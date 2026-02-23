import { describe, expect, it } from "vitest";
import type { NormalizedSponsor } from "@/lib/matching/normalize";
import { computeDiff } from "../diff-engine";

function makeSponsor(
	overrides: Partial<NormalizedSponsor> & { canonicalName: string },
): NormalizedSponsor {
	return {
		originalName: overrides.canonicalName.toUpperCase(),
		town: null,
		county: null,
		sponsorType: "Worker",
		rating: "A rating",
		routes: ["Skilled Worker"],
		...overrides,
	};
}

describe("computeDiff", () => {
	it("detects added sponsors", () => {
		const previous: NormalizedSponsor[] = [
			makeSponsor({ canonicalName: "acme" }),
		];
		const current: NormalizedSponsor[] = [
			makeSponsor({ canonicalName: "acme" }),
			makeSponsor({ canonicalName: "beta" }),
		];

		const diff = computeDiff(previous, current);
		expect(diff.added).toHaveLength(1);
		expect(diff.added[0].canonicalName).toBe("beta");
		expect(diff.removed).toHaveLength(0);
		expect(diff.updated).toHaveLength(0);
	});

	it("detects removed sponsors", () => {
		const previous: NormalizedSponsor[] = [
			makeSponsor({ canonicalName: "acme" }),
			makeSponsor({ canonicalName: "beta" }),
		];
		const current: NormalizedSponsor[] = [
			makeSponsor({ canonicalName: "acme" }),
		];

		const diff = computeDiff(previous, current);
		expect(diff.removed).toHaveLength(1);
		expect(diff.removed[0].canonicalName).toBe("beta");
		expect(diff.added).toHaveLength(0);
	});

	it("detects updated sponsors (rating change)", () => {
		const previous: NormalizedSponsor[] = [
			makeSponsor({
				canonicalName: "acme",
				town: "london",
				rating: "A rating",
			}),
		];
		const current: NormalizedSponsor[] = [
			makeSponsor({
				canonicalName: "acme",
				town: "london",
				rating: "B rating",
			}),
		];

		const diff = computeDiff(previous, current);
		expect(diff.updated).toHaveLength(1);
		expect(diff.updated[0].sponsor.canonicalName).toBe("acme");
		expect(diff.updated[0].changes).toContainEqual({
			field: "rating",
			oldValue: "A rating",
			newValue: "B rating",
		});
	});

	it("detects updated sponsors (route change)", () => {
		const previous: NormalizedSponsor[] = [
			makeSponsor({
				canonicalName: "acme",
				town: "london",
				routes: ["Skilled Worker"],
			}),
		];
		const current: NormalizedSponsor[] = [
			makeSponsor({
				canonicalName: "acme",
				town: "london",
				routes: ["Skilled Worker", "Global Business Mobility"],
			}),
		];

		const diff = computeDiff(previous, current);
		expect(diff.updated).toHaveLength(1);
		expect(diff.updated[0].changes).toContainEqual({
			field: "routes",
			oldValue: "Skilled Worker",
			newValue: "Global Business Mobility, Skilled Worker",
		});
	});

	it("uses name+town as composite key", () => {
		const previous: NormalizedSponsor[] = [
			makeSponsor({ canonicalName: "acme", town: "london" }),
			makeSponsor({ canonicalName: "acme", town: "manchester" }),
		];
		const current: NormalizedSponsor[] = [
			makeSponsor({ canonicalName: "acme", town: "london" }),
		];

		const diff = computeDiff(previous, current);
		expect(diff.removed).toHaveLength(1);
		expect(diff.removed[0].town).toBe("manchester");
	});

	it("returns empty diff for identical lists", () => {
		const sponsors: NormalizedSponsor[] = [
			makeSponsor({ canonicalName: "acme", town: "london" }),
		];

		const diff = computeDiff(sponsors, sponsors);
		expect(diff.added).toHaveLength(0);
		expect(diff.removed).toHaveLength(0);
		expect(diff.updated).toHaveLength(0);
	});
});
