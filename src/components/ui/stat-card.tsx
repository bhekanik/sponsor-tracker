import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	icon: LucideIcon;
	label: string;
	value: number | string;
	loading?: boolean;
}

export function StatCard({ icon: Icon, label, value, loading }: StatCardProps) {
	return (
		<div className="rounded-xl border border-border bg-surface p-5">
			<div className="flex items-center gap-3">
				<div className="rounded-lg bg-primary-subtle p-2">
					<Icon className="h-5 w-5 text-primary" />
				</div>
				<p className="text-sm font-medium text-text-muted">{label}</p>
			</div>
			{loading ? (
				<div className="mt-3 h-8 w-20 animate-pulse rounded bg-surface-raised" />
			) : (
				<p className="mt-3 font-display text-3xl text-text-primary">
					{typeof value === "number" ? value.toLocaleString() : value}
				</p>
			)}
		</div>
	);
}
