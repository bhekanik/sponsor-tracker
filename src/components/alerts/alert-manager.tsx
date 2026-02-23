"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Notification {
	id: string;
	watchlistId: string;
	channel: string;
	destination: string;
	frequency: string;
	enabled: boolean;
}

interface Watchlist {
	id: string;
	name: string;
}

export function AlertManager() {
	const queryClient = useQueryClient();
	const [watchlistId, setWatchlistId] = useState("");
	const [destination, setDestination] = useState("");
	const [frequency, setFrequency] = useState("instant");

	const { data: watchlists = [] } = useQuery<Watchlist[]>({
		queryKey: ["watchlists"],
		queryFn: () => fetch("/api/watchlists").then((r) => r.json()),
	});

	const { data: alerts = [], isLoading } = useQuery<Notification[]>({
		queryKey: ["notifications"],
		queryFn: () => fetch("/api/notifications").then((r) => r.json()),
	});

	const createMutation = useMutation({
		mutationFn: async (data: {
			watchlistId: string;
			destination: string;
			frequency: string;
		}) => {
			const res = await fetch("/api/notifications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, channel: "email" }),
			});
			if (!res.ok) throw new Error("Failed to create alert");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			setDestination("");
			toast.success("Alert created");
		},
	});

	const toggleMutation = useMutation({
		mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
			const res = await fetch(`/api/notifications/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ enabled }),
			});
			if (!res.ok) throw new Error("Failed to update");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/notifications/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			toast.success("Alert deleted");
		},
	});

	function handleCreate(e: React.FormEvent) {
		e.preventDefault();
		if (watchlistId && destination.trim()) {
			createMutation.mutate({
				watchlistId,
				destination: destination.trim(),
				frequency,
			});
		}
	}

	const wlMap = new Map(watchlists.map((w) => [w.id, w.name]));

	if (isLoading) {
		return (
			<div className="space-y-3">
				{[1, 2].map((i) => (
					<div
						key={i}
						className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<form onSubmit={handleCreate} className="space-y-3">
				<div className="flex gap-2">
					<select
						value={watchlistId}
						onChange={(e) => setWatchlistId(e.target.value)}
						className="rounded-md border border-gray-300 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
					>
						<option value="">Select watchlist...</option>
						{watchlists.map((w) => (
							<option key={w.id} value={w.id}>
								{w.name}
							</option>
						))}
					</select>
					<input
						type="email"
						placeholder="Email address..."
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900"
					/>
				</div>
				<div className="flex items-center gap-3">
					<label className="flex items-center gap-2 text-sm">
						<input
							type="radio"
							name="frequency"
							value="instant"
							checked={frequency === "instant"}
							onChange={() => setFrequency("instant")}
						/>
						Instant
					</label>
					<label className="flex items-center gap-2 text-sm">
						<input
							type="radio"
							name="frequency"
							value="digest"
							checked={frequency === "digest"}
							onChange={() => setFrequency("digest")}
						/>
						Daily digest
					</label>
					<button
						type="submit"
						disabled={
							createMutation.isPending || !watchlistId || !destination.trim()
						}
						className="ml-auto flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
					>
						<Plus className="h-4 w-4" />
						Create alert
					</button>
				</div>
			</form>

			{alerts.length === 0 ? (
				<p className="text-sm text-gray-500 dark:text-gray-400">
					No alerts configured. Create one to get notified about sponsor
					changes.
				</p>
			) : (
				<div className="space-y-3">
					{alerts.map((alert) => (
						<div
							key={alert.id}
							className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
						>
							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={() =>
										toggleMutation.mutate({
											id: alert.id,
											enabled: !alert.enabled,
										})
									}
									className={
										alert.enabled ? "text-indigo-600" : "text-gray-400"
									}
								>
									{alert.enabled ? (
										<Bell className="h-5 w-5" />
									) : (
										<BellOff className="h-5 w-5" />
									)}
								</button>
								<div>
									<p className="text-sm font-medium">
										{wlMap.get(alert.watchlistId) ?? "Unknown watchlist"}
									</p>
									<p className="text-xs text-gray-500">
										{alert.destination} · {alert.frequency}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => deleteMutation.mutate(alert.id)}
								className="text-gray-400 hover:text-red-500"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
