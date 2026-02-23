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
			<h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
				Rules
			</h4>

			{isLoading ? (
				<div className="h-8 animate-pulse rounded bg-surface-raised" />
			) : rules.length === 0 ? (
				<p className="text-xs text-text-muted">No rules yet.</p>
			) : (
				<div className="space-y-2">
					{rules.map((rule) => (
						<div
							key={rule.id}
							className="flex items-center justify-between rounded-md bg-surface-raised px-3 py-2 text-sm"
						>
							<span>
								<span className="mr-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
									{rule.ruleType}
								</span>
								{rule.value}
							</span>
							<button
								type="button"
								onClick={() => deleteMutation.mutate(rule.id)}
								className="text-text-muted hover:text-red-500"
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
					className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm"
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
					className="flex-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
				<button
					type="submit"
					disabled={addMutation.isPending || !value.trim()}
					className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
				>
					<Plus className="h-3.5 w-3.5" />
					Add
				</button>
			</form>
		</div>
	);
}
