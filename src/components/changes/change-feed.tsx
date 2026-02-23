"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Minus, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Change {
	id: string;
	changeType: string;
	field: string | null;
	oldValue: string | null;
	newValue: string | null;
	sponsorId: string;
	sponsorName: string;
	town: string | null;
	createdAt: string;
}

const TYPE_CONFIG: Record<
	string,
	{ icon: typeof Plus; label: string; color: string; border: string }
> = {
	added: {
		icon: Plus,
		label: "Added",
		color: "text-green-600 bg-green-50 dark:bg-green-900/20",
		border: "border-l-green-500",
	},
	removed: {
		icon: Minus,
		label: "Removed",
		color: "text-red-600 bg-red-50 dark:bg-red-900/20",
		border: "border-l-red-500",
	},
	updated: {
		icon: RefreshCw,
		label: "Updated",
		color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
		border: "border-l-amber-500",
	},
};

const filterOptions = [
	{ value: "", label: "All" },
	{ value: "added", label: "Added" },
	{ value: "removed", label: "Removed" },
	{ value: "updated", label: "Updated" },
];

export function ChangeFeed() {
	const [filter, setFilter] = useState<string>("");

	const { data: changes = [], isLoading } = useQuery<Change[]>({
		queryKey: ["changes", filter],
		queryFn: () => {
			const params = new URLSearchParams();
			if (filter) params.set("type", filter);
			return fetch(`/api/changes?${params}`).then((r) => r.json());
		},
	});

	return (
		<div className="space-y-4">
			{/* Segmented control */}
			<div className="inline-flex rounded-lg bg-surface-raised p-1 shadow-sm">
				{filterOptions.map((opt) => (
					<button
						key={opt.value}
						type="button"
						onClick={() => setFilter(opt.value)}
						className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
							filter === opt.value
								? "bg-surface text-text-primary shadow-sm"
								: "text-text-secondary hover:text-text-primary"
						}`}
					>
						{opt.label}
					</button>
				))}
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-16 animate-pulse rounded-lg bg-surface-raised"
						/>
					))}
				</div>
			) : changes.length === 0 ? (
				<p className="py-8 text-center text-sm text-text-muted">
					No changes recorded yet. Changes will appear here after the next CSV
					poll.
				</p>
			) : (
				<div className="space-y-2">
					{changes.map((change, i) => {
						const config =
							TYPE_CONFIG[change.changeType] ?? TYPE_CONFIG.updated;
						const Icon = config.icon;
						return (
							<div
								key={change.id}
								className={`flex items-start gap-3 rounded-lg border border-border border-l-2 ${config.border} bg-surface p-3 animate-fade-up`}
								style={{ animationDelay: `${i * 50}ms` }}
							>
								<div className={`mt-0.5 rounded-full p-1.5 ${config.color}`}>
									<Icon className="h-3.5 w-3.5" />
								</div>
								<div className="min-w-0 flex-1">
									<Link
										href={`/sponsor/${change.sponsorId}`}
										className="text-sm font-medium text-text-primary transition-colors hover:text-primary"
									>
										{change.sponsorName}
									</Link>
									{change.town && (
										<span className="ml-2 text-xs text-text-muted">
											{change.town}
										</span>
									)}
									<p className="text-xs text-text-secondary">
										{config.label}
										{change.field && (
											<>
												{" \u2014 "}
												{change.field}:{" "}
												<span className="text-red-500">
													{change.oldValue ?? "\u2014"}
												</span>
												<ArrowRight className="mx-1 inline h-3 w-3" />
												<span className="text-green-600">
													{change.newValue ?? "\u2014"}
												</span>
											</>
										)}
									</p>
								</div>
								<time className="shrink-0 text-xs text-text-muted">
									{new Date(change.createdAt).toLocaleDateString()}
								</time>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
