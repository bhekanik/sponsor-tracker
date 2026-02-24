"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const plans = [
	{
		id: "free",
		name: "Free",
		price: "\u00a30",
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
		price: "\u00a36",
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
		price: "\u00a349",
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
				<div key={plan.id}>
					{plan.highlighted ? (
						<div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-px">
							<div className="relative rounded-2xl bg-surface p-8">
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-gray-900">
									Most popular
								</span>
								<PlanContent
									plan={plan}
									loading={loading}
									onSubscribe={handleSubscribe}
								/>
							</div>
						</div>
					) : (
						<div className="rounded-2xl border border-border bg-surface p-8">
							<PlanContent
								plan={plan}
								loading={loading}
								onSubscribe={handleSubscribe}
							/>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

function PlanContent({
	plan,
	loading,
	onSubscribe,
}: {
	plan: (typeof plans)[number];
	loading: string | null;
	onSubscribe: (id: string) => void;
}) {
	return (
		<>
			<h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
			<div className="mt-2">
				<span className="font-display text-5xl text-text-primary">
					{plan.price}
				</span>
				<span className="text-sm text-text-secondary">{plan.period}</span>
			</div>
			<ul className="mt-6 space-y-3">
				{plan.features.map((feature) => (
					<li
						key={feature}
						className="flex items-start gap-2 text-sm text-text-secondary"
					>
						<Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
						{feature}
					</li>
				))}
			</ul>
			<button
				type="button"
				onClick={() => onSubscribe(plan.id)}
				disabled={loading === plan.id}
				className={`mt-6 w-full rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
					plan.highlighted
						? "bg-primary text-white hover:bg-primary-hover"
						: "border border-border text-text-primary hover:bg-surface-raised"
				} disabled:opacity-50`}
			>
				{loading === plan.id ? "Redirecting..." : plan.cta}
			</button>
		</>
	);
}
