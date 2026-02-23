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
	{ icon: typeof Plus; label: string; color: string }
> = {
	added: {
		icon: Plus,
		label: "Added",
		color: "text-green-600 bg-green-50 dark:bg-green-900/20",
	},
	removed: {
		icon: Minus,
		label: "Removed",
		color: "text-red-600 bg-red-50 dark:bg-red-900/20",
	},
	updated: {
		icon: RefreshCw,
		label: "Updated",
		color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
	},
};

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
			<div className="flex gap-2">
				{["", "added", "removed", "updated"].map((type) => (
					<button
						key={type}
						type="button"
						onClick={() => setFilter(type)}
						className={`rounded-full px-3 py-1 text-sm ${
							filter === type
								? "bg-indigo-600 text-white"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
						}`}
					>
						{type || "All"}
					</button>
				))}
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
						/>
					))}
				</div>
			) : changes.length === 0 ? (
				<p className="py-8 text-center text-sm text-gray-500">
					No changes recorded yet. Changes will appear here after the next CSV
					poll.
				</p>
			) : (
				<div className="space-y-2">
					{changes.map((change) => {
						const config =
							TYPE_CONFIG[change.changeType] ?? TYPE_CONFIG.updated;
						const Icon = config.icon;
						return (
							<div
								key={change.id}
								className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
							>
								<div className={`mt-0.5 rounded-full p-1.5 ${config.color}`}>
									<Icon className="h-3.5 w-3.5" />
								</div>
								<div className="min-w-0 flex-1">
									<Link
										href={`/sponsor/${change.sponsorId}`}
										className="text-sm font-medium hover:text-indigo-600"
									>
										{change.sponsorName}
									</Link>
									{change.town && (
										<span className="ml-2 text-xs text-gray-500">
											{change.town}
										</span>
									)}
									<p className="text-xs text-gray-500">
										{config.label}
										{change.field && (
											<>
												{" — "}
												{change.field}:{" "}
												<span className="text-red-500">
													{change.oldValue ?? "—"}
												</span>
												<ArrowRight className="mx-1 inline h-3 w-3" />
												<span className="text-green-600">
													{change.newValue ?? "—"}
												</span>
											</>
										)}
									</p>
								</div>
								<time className="shrink-0 text-xs text-gray-400">
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
