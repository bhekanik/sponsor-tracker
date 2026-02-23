import { describe, expect, it, vi } from "vitest";

// Mock stripe before importing PLANS
vi.mock("stripe", () => ({
	default: class {
		constructor() {}
	},
}));

import { getStripe, PLANS } from "../stripe";

describe("PLANS config", () => {
	it("defines free, pro, and business tiers", () => {
		expect(PLANS.free).toBeDefined();
		expect(PLANS.pro).toBeDefined();
		expect(PLANS.business).toBeDefined();
	});

	it("free plan has no priceId", () => {
		expect(PLANS.free.priceId).toBeNull();
	});

	it("paid plans have features listed", () => {
		expect(PLANS.pro.features.length).toBeGreaterThan(0);
		expect(PLANS.business.features.length).toBeGreaterThan(0);
	});
});
