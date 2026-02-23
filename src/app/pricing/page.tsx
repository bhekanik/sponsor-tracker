import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing/pricing-cards";

export const metadata: Metadata = {
	title: "Pricing",
	description:
		"Simple, transparent pricing. Start free. Upgrade when you need watchlists, alerts, or API access.",
};

export default function PricingPage() {
	return (
		<div>
			<div className="bg-gradient-to-b from-primary-subtle/30 to-transparent">
				<div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8">
					<h1 className="font-display text-4xl text-text-primary">
						Simple, transparent pricing
					</h1>
					<p className="mt-2 text-text-secondary">
						Start free. Upgrade when you need watchlists, alerts, or API access.
					</p>
				</div>
			</div>
			<div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
				<PricingCards />
			</div>
		</div>
	);
}
