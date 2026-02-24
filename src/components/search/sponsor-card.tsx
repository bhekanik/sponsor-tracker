import { MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatSponsorName, formatTown } from "@/lib/format";

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
			className={`block rounded-xl bg-surface p-4 shadow-sm transition-colors hover:bg-surface-raised ${
				isActive ? "border-l-2 border-l-green-500" : ""
			} border border-border`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-medium text-text-primary">
						{formatSponsorName(canonicalName)}
					</h3>
					{(town || county) && (
						<p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
							<MapPin className="h-3.5 w-3.5" />
							{[town ? formatTown(town) : null, county ? formatTown(county) : null]
								.filter(Boolean)
								.join(", ")}
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
					<Badge variant={isActive ? "success" : "danger"}>{status}</Badge>
					{rating && (
						<Badge variant={rating.includes("A") ? "info" : "warning"}>
							{rating}
						</Badge>
					)}
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
