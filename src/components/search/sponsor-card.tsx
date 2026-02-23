import { MapPin } from "lucide-react";
import Link from "next/link";

interface SponsorCardProps {
	id: string;
	canonicalName: string;
	town: string | null;
	county: string | null;
	rating: string | null;
	routes: string[] | null;
	status: string;
	lastSeenAt: string | null;
}

export function SponsorCard({
	id,
	canonicalName,
	town,
	county,
	rating,
	routes,
	status,
	lastSeenAt,
}: SponsorCardProps) {
	const isActive = status === "active";

	return (
		<Link
			href={`/sponsor/${id}`}
			className={`block rounded-xl bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
				isActive ? "border-l-2 border-l-green-500" : ""
			} border border-border`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-medium text-text-primary">
						{canonicalName}
					</h3>
					{(town || county) && (
						<p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
							<MapPin className="h-3.5 w-3.5" />
							{[town, county].filter(Boolean).join(", ")}
						</p>
					)}
					{routes && routes.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1">
							{routes.map((route) => (
								<span
									key={route}
									className="rounded-full bg-primary-subtle px-2 py-0.5 text-xs text-primary"
								>
									{route}
								</span>
							))}
						</div>
					)}
				</div>
				<div className="flex flex-col items-end gap-1">
					<StatusBadge status={status} />
					{rating && <RatingBadge rating={rating} />}
				</div>
			</div>
			{lastSeenAt && (
				<p className="mt-2 text-xs text-text-muted">
					Last seen: {new Date(lastSeenAt).toLocaleDateString()}
				</p>
			)}
		</Link>
	);
}

function StatusBadge({ status }: { status: string }) {
	const colors =
		status === "active"
			? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
			: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

	return (
		<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors}`}>
			{status}
		</span>
	);
}

function RatingBadge({ rating }: { rating: string }) {
	const isA = rating.includes("A");
	const colors = isA
		? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
		: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

	return (
		<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors}`}>
			{rating}
		</span>
	);
}
