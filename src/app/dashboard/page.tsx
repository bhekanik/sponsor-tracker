"use client";

import { useQuery } from "@tanstack/react-query";
import {
	ArrowRight,
	Bell,
	Eye,
	Key,
	Minus,
	Plus,
	RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { formatSponsorName } from "@/lib/format";

interface Change {
	id: string;
	changeType: string;
	field: string | null;
	sponsorId: string;
	sponsorName: string;
	createdAt: string;
}

const quickLinks = [
	{
		href: "/dashboard/watchlists",
		icon: Eye,
		label: "Watchlists",
		description: "Track specific sponsors",
	},
	{
		href: "/dashboard/alerts",
		icon: Bell,
		label: "Alerts",
		description: "Email notifications",
	},
	{
		href: "/dashboard/api",
		icon: Key,
		label: "API Keys",
		description: "Programmatic access",
	},
];

export default function DashboardPage() {
	const sevenDaysAgo = new Date(
		Date.now() - 7 * 24 * 60 * 60 * 1000,
	).toISOString();

	const { data: watchlists, isLoading: wlLoading } = useQuery<unknown[]>({
		queryKey: ["watchlists"],
		queryFn: () => fetch("/api/watchlists").then((r) => (r.ok ? r.json() : [])),
	});

	const { data: alerts, isLoading: alertLoading } = useQuery<unknown[]>({
		queryKey: ["notifications"],
		queryFn: () =>
			fetch("/api/notifications").then((r) => (r.ok ? r.json() : [])),
	});

	const { data: recentChanges, isLoading: changesLoading } = useQuery<
		Change[]
	>({
		queryKey: ["changes-7d"],
		queryFn: async () => {
			const res = await fetch(`/api/changes?since=${sevenDaysAgo}&pageSize=50`);
			const json = await res.json();
			return json.data;
		},
	});

	return (
		<div>
			<h1 className="font-display text-2xl text-text-primary">Overview</h1>
			<p className="mt-1 text-text-secondary">
				Your sponsor tracking dashboard.
			</p>

			{/* Stats */}
			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<StatCard
					icon={Eye}
					label="Watchlists"
					value={watchlists?.length ?? 0}
					loading={wlLoading}
				/>
				<StatCard
					icon={Bell}
					label="Active Alerts"
					value={alerts?.length ?? 0}
					loading={alertLoading}
				/>
				<StatCard
					icon={RefreshCw}
					label="Changes (7d)"
					value={recentChanges?.length ?? 0}
					loading={changesLoading}
				/>
			</div>

			{/* Recent changes */}
			<div className="mt-8">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
						Recent Changes
					</h2>
					<Link
						href="/changes"
						className="inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary-hover"
					>
						View all
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</div>

				{changesLoading ? (
					<div className="mt-3 space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={`skel-${i}`}
								className="h-12 animate-pulse rounded-lg bg-surface-raised"
							/>
						))}
					</div>
				) : !recentChanges?.length ? (
					<p className="mt-3 text-sm text-text-muted">
						No changes in the last 7 days.
					</p>
				) : (
					<div className="mt-3 space-y-2">
						{recentChanges.slice(0, 5).map((change) => (
							<Link
								key={change.id}
								href={`/sponsor/${change.sponsorId}`}
								className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-surface-raised"
							>
								<ChangeIcon type={change.changeType} />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-text-primary">
										{formatSponsorName(change.sponsorName)}
									</p>
									<p className="text-xs text-text-muted">
										{changeLabel(change.changeType, change.field)}
									</p>
								</div>
								<time className="shrink-0 text-xs text-text-muted">
									{new Date(change.createdAt).toLocaleDateString()}
								</time>
							</Link>
						))}
					</div>
				)}
			</div>

			{/* Quick links */}
			<div className="mt-8">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
					Quick Links
				</h2>
				<div className="mt-3 grid gap-3 sm:grid-cols-3">
					{quickLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-surface-raised"
						>
							<div className="rounded-lg bg-primary-subtle p-2">
								<link.icon className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium text-text-primary">
									{link.label}
								</p>
								<p className="text-xs text-text-muted">{link.description}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

function ChangeIcon({ type }: { type: string }) {
	const configs: Record<string, { icon: typeof Plus; className: string }> = {
		added: {
			icon: Plus,
			className: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
		},
		removed: {
			icon: Minus,
			className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
		},
		updated: {
			icon: RefreshCw,
			className:
				"bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
		},
	};
	const config = configs[type] ?? configs.updated;
	const Icon = config.icon;
	return (
		<div className={`shrink-0 rounded-full p-1.5 ${config.className}`}>
			<Icon className="h-3.5 w-3.5" />
		</div>
	);
}

function changeLabel(type: string, field: string | null): string {
	switch (type) {
		case "added":
			return "Added to register";
		case "removed":
			return "Removed from register";
		case "updated":
			return field ? `${field} changed` : "Updated";
		default:
			return type;
	}
}
