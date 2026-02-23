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
	return (
		<Link
			href={`/sponsor/${id}`}
			className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-indigo-700 dark:hover:bg-gray-900"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-medium text-gray-900 dark:text-white">
						{canonicalName}
					</h3>
					{(town || county) && (
						<p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
							<MapPin className="h-3.5 w-3.5" />
							{[town, county].filter(Boolean).join(", ")}
						</p>
					)}
					{routes && routes.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1">
							{routes.map((route) => (
								<span
									key={route}
									className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
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
				<p className="mt-2 text-xs text-gray-400">
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
