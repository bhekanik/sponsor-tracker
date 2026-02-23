import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
	if (!_stripe) {
		_stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
			apiVersion: "2026-01-28.clover",
		});
	}
	return _stripe;
}

export const PLANS = {
	free: {
		name: "Free",
		price: "£0",
		priceId: null,
		features: [
			"Search & company pages",
			'"Last seen" date',
			"Last 1 change",
			"Changes feed",
		],
	},
	pro: {
		name: "Pro",
		price: "£6/mo",
		priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
		features: [
			"10 watchlists, 50 rules",
			"Instant + daily email alerts",
			"Full change history",
			"CSV export",
			"1,000 API requests/day",
		],
	},
	business: {
		name: "Business",
		price: "£49/mo",
		priceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? "",
		features: [
			"Unlimited watchlists",
			"Bulk check (5,000 names/mo)",
			"Slack & webhook alerts",
			"10,000 API requests/day",
			"Delivery logs",
		],
	},
} as const;

export type PlanId = keyof typeof PLANS;
