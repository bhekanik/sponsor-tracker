"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const plans = [
	{
		id: "free",
		name: "Free",
		price: "£0",
		period: "forever",
		features: [
			"Search & company pages",
			'"Last seen" date',
			"Last 1 change visible",
			"Changes feed",
		],
		cta: "Get started",
		href: "/auth/register",
		highlighted: false,
	},
	{
		id: "pro",
		name: "Pro",
		price: "£6",
		period: "/month",
		features: [
			"10 watchlists, 50 rules",
			"Instant + daily email alerts",
			"Full change history",
			"CSV export",
			"1,000 API requests/day",
		],
		cta: "Subscribe",
		highlighted: true,
	},
	{
		id: "business",
		name: "Business",
		price: "£49",
		period: "/month",
		features: [
			"Unlimited watchlists",
			"Bulk check (5,000 names/mo)",
			"Slack & webhook alerts",
			"10,000 API requests/day",
			"Delivery logs",
		],
		cta: "Subscribe",
		highlighted: false,
	},
];

export function PricingCards() {
	const router = useRouter();
	const [loading, setLoading] = useState<string | null>(null);

	async function handleSubscribe(planId: string) {
		if (planId === "free") {
			router.push("/auth/register");
			return;
		}

		setLoading(planId);
		try {
			const res = await fetch("/api/stripe/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ plan: planId }),
			});

			if (!res.ok) {
				const data = await res.json();
				if (res.status === 401) {
					router.push("/auth/login?callbackUrl=/pricing");
					return;
				}
				throw new Error(data.error ?? "Failed to start checkout");
			}

			const { url } = await res.json();
			if (url) window.location.href = url;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(null);
		}
	}

	return (
		<div className="grid gap-6 md:grid-cols-3">
			{plans.map((plan) => (
				<div
					key={plan.id}
					className={`rounded-xl border p-6 ${
						plan.highlighted
							? "border-indigo-600 ring-2 ring-indigo-600"
							: "border-gray-200 dark:border-gray-700"
					}`}
				>
					<h3 className="text-lg font-bold">{plan.name}</h3>
					<div className="mt-2">
						<span className="text-3xl font-bold">{plan.price}</span>
						<span className="text-sm text-gray-500">{plan.period}</span>
					</div>
					<ul className="mt-6 space-y-3">
						{plan.features.map((feature) => (
							<li key={feature} className="flex items-start gap-2 text-sm">
								<Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
								{feature}
							</li>
						))}
					</ul>
					<button
						type="button"
						onClick={() => handleSubscribe(plan.id)}
						disabled={loading === plan.id}
						className={`mt-6 w-full rounded-md px-4 py-2 text-sm font-medium ${
							plan.highlighted
								? "bg-indigo-600 text-white hover:bg-indigo-500"
								: "border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
						} disabled:opacity-50`}
					>
						{loading === plan.id
							? "Redirecting..."
							: plan.href
								? plan.cta
								: plan.cta}
					</button>
				</div>
			))}
		</div>
	);
}
