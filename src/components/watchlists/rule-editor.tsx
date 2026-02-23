"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WatchlistRule {
	id: string;
	ruleType: string;
	value: string;
}

const RULE_TYPES = [
	{ value: "company", label: "Company (exact match)" },
	{ value: "keyword", label: "Keyword (contains)" },
	{ value: "location", label: "Location (town)" },
	{ value: "route", label: "Route" },
];

export function RuleEditor({ watchlistId }: { watchlistId: string }) {
	const queryClient = useQueryClient();
	const [ruleType, setRuleType] = useState("company");
	const [value, setValue] = useState("");

	const { data: rules = [], isLoading } = useQuery<WatchlistRule[]>({
		queryKey: ["watchlist-rules", watchlistId],
		queryFn: () =>
			fetch(`/api/watchlists/${watchlistId}/rules`).then((r) => r.json()),
	});

	const addMutation = useMutation({
		mutationFn: async (rule: { ruleType: string; value: string }) => {
			const res = await fetch(`/api/watchlists/${watchlistId}/rules`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(rule),
			});
			if (!res.ok) throw new Error("Failed to add rule");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["watchlist-rules", watchlistId],
			});
			setValue("");
			toast.success("Rule added");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (ruleId: string) => {
			const res = await fetch(
				`/api/watchlists/${watchlistId}/rules/${ruleId}`,
				{ method: "DELETE" },
			);
			if (!res.ok) throw new Error("Failed to delete rule");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["watchlist-rules", watchlistId],
			});
		},
	});

	function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		if (value.trim()) addMutation.mutate({ ruleType, value: value.trim() });
	}

	return (
		<div className="space-y-4">
			<h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
				Rules
			</h4>

			{isLoading ? (
				<div className="h-8 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
			) : rules.length === 0 ? (
				<p className="text-xs text-gray-400">No rules yet.</p>
			) : (
				<div className="space-y-2">
					{rules.map((rule) => (
						<div
							key={rule.id}
							className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
						>
							<span>
								<span className="mr-2 rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
									{rule.ruleType}
								</span>
								{rule.value}
							</span>
							<button
								type="button"
								onClick={() => deleteMutation.mutate(rule.id)}
								className="text-gray-400 hover:text-red-500"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</div>
					))}
				</div>
			)}

			<form onSubmit={handleAdd} className="flex gap-2">
				<select
					value={ruleType}
					onChange={(e) => setRuleType(e.target.value)}
					className="rounded-md border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900"
				>
					{RULE_TYPES.map((t) => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</select>
				<input
					type="text"
					placeholder="Value..."
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900"
				/>
				<button
					type="submit"
					disabled={addMutation.isPending || !value.trim()}
					className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
				>
					<Plus className="h-3.5 w-3.5" />
					Add
				</button>
			</form>
		</div>
	);
}
