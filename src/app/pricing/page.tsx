import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing/pricing-cards";

export const metadata: Metadata = {
	title: "Pricing",
	description:
		"Simple, transparent pricing. Start free. Upgrade when you need watchlists, alerts, or API access.",
};

export default function PricingPage() {
	return (
		<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="text-center">
				<h1 className="text-3xl font-bold">Simple, transparent pricing</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Start free. Upgrade when you need watchlists, alerts, or API access.
				</p>
			</div>
			<div className="mt-10">
				<PricingCards />
			</div>
		</div>
	);
}
