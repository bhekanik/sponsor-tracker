"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RuleEditor } from "./rule-editor";

interface Watchlist {
	id: string;
	name: string;
	createdAt: string;
}

export function WatchlistManager() {
	const queryClient = useQueryClient();
	const [newName, setNewName] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const { data: watchlists = [], isLoading } = useQuery<Watchlist[]>({
		queryKey: ["watchlists"],
		queryFn: () => fetch("/api/watchlists").then((r) => r.json()),
	});

	const createMutation = useMutation({
		mutationFn: async (name: string) => {
			const res = await fetch("/api/watchlists", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error ?? "Failed to create watchlist");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["watchlists"] });
			setNewName("");
			toast.success("Watchlist created");
		},
		onError: (err: Error) => {
			toast.error(err.message);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/watchlists/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["watchlists"] });
			toast.success("Watchlist deleted");
		},
	});

	function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (newName.trim()) createMutation.mutate(newName.trim());
	}

	if (isLoading) {
		return (
			<div className="space-y-3">
				{[1, 2].map((i) => (
					<div
						key={i}
						className="h-16 animate-pulse rounded-lg bg-surface-raised"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<form onSubmit={handleCreate} className="flex gap-2">
				<input
					type="text"
					placeholder="New watchlist name..."
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
				<button
					type="submit"
					disabled={createMutation.isPending || !newName.trim()}
					className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
				>
					<Plus className="h-4 w-4" />
					Create
				</button>
			</form>

			{watchlists.length === 0 ? (
				<p className="text-sm text-text-muted">
					No watchlists yet. Create one to start tracking sponsors.
				</p>
			) : (
				<div className="space-y-3">
					{watchlists.map((wl) => (
						<div
							key={wl.id}
							className="rounded-lg border border-border"
						>
							<div className="flex items-center justify-between p-4">
								<button
									type="button"
									onClick={() =>
										setExpandedId(expandedId === wl.id ? null : wl.id)
									}
									className="text-sm font-medium hover:text-primary"
								>
									{wl.name}
								</button>
								<button
									type="button"
									onClick={() => deleteMutation.mutate(wl.id)}
									className="text-text-muted hover:text-red-500"
									title="Delete watchlist"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
							{expandedId === wl.id && (
								<div className="border-t border-border p-4">
									<RuleEditor watchlistId={wl.id} />
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
