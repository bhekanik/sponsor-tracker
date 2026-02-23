"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Minus, Plus } from "lucide-react";

interface ChangeEvent {
	id: string;
	changeType: string;
	field: string | null;
	oldValue: string | null;
	newValue: string | null;
	createdAt: string;
}

export function ChangeTimeline({ sponsorId }: { sponsorId: string }) {
	const { data, isLoading } = useQuery({
		queryKey: ["sponsor-history", sponsorId],
		queryFn: async () => {
			const res = await fetch(`/api/sponsors/${sponsorId}/history`);
			if (!res.ok) throw new Error("Failed to fetch history");
			return res.json() as Promise<ChangeEvent[]>;
		},
	});

	if (isLoading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={`skeleton-${i}`}
						className="h-12 animate-pulse rounded bg-surface-raised"
					/>
				))}
			</div>
		);
	}

	if (!data?.length) {
		return (
			<p className="text-sm text-text-muted">No change history recorded yet.</p>
		);
	}

	return (
		<div className="relative space-y-3 pl-4">
			{/* Vertical connecting line */}
			<div className="absolute left-[1.1rem] top-2 bottom-2 w-px bg-border-muted" />
			{data.map((event, i) => (
				<div
					key={event.id}
					className="relative flex items-start gap-3 rounded-lg border border-border bg-surface p-3 animate-fade-up"
					style={{ animationDelay: `${i * 75}ms` }}
				>
					<ChangeIcon type={event.changeType} />
					<div className="min-w-0 flex-1">
						<p className="text-sm font-medium text-text-primary">
							{changeLabel(event)}
						</p>
						{event.field && (
							<p className="mt-0.5 text-xs text-text-secondary">
								{event.field}: {event.oldValue ?? "\u2014"}{" "}
								<ArrowRight className="inline h-3 w-3" />{" "}
								{event.newValue ?? "\u2014"}
							</p>
						)}
						<p className="mt-1 text-xs text-text-muted">
							{new Date(event.createdAt).toLocaleDateString()}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

function ChangeIcon({ type }: { type: string }) {
	switch (type) {
		case "added":
			return (
				<div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900/30">
					<Plus className="h-3 w-3 text-green-600 dark:text-green-400" />
				</div>
			);
		case "removed":
			return (
				<div className="rounded-full bg-red-100 p-1.5 dark:bg-red-900/30">
					<Minus className="h-3 w-3 text-red-600 dark:text-red-400" />
				</div>
			);
		default:
			return (
				<div className="rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/30">
					<ArrowRight className="h-3 w-3 text-amber-600 dark:text-amber-400" />
				</div>
			);
	}
}

function changeLabel(event: ChangeEvent): string {
	switch (event.changeType) {
		case "added":
			return "Added to sponsor register";
		case "removed":
			return "Removed from sponsor register";
		case "updated":
			return `${event.field} changed`;
		default:
			return event.changeType;
	}
}
