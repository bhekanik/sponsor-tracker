/**
 * Matches watchlist rules against sponsor changes.
 *
 * Rule types:
 * - "company"  — exact or fuzzy match on sponsor canonical name
 * - "keyword"  — substring match on sponsor name
 * - "location" — match on town (case-insensitive)
 * - "route"    — match on any of the sponsor's routes
 */

export interface Rule {
	ruleType: string;
	value: string;
}

export interface SponsorData {
	canonicalName: string;
	town?: string | null;
	routes?: string[] | null;
}

export function matchesRule(sponsor: SponsorData, rule: Rule): boolean {
	const name = sponsor.canonicalName.toLowerCase();
	const val = rule.value.toLowerCase();

	switch (rule.ruleType) {
		case "company":
			return name === val;
		case "keyword":
			return name.includes(val);
		case "location":
			return (sponsor.town ?? "").toLowerCase() === val;
		case "route":
			return (sponsor.routes ?? []).some((r) => r.toLowerCase() === val);
		default:
			return false;
	}
}

export function findMatchingRules(sponsor: SponsorData, rules: Rule[]): Rule[] {
	return rules.filter((rule) => matchesRule(sponsor, rule));
}
