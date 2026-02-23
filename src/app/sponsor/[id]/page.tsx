import { eq } from "drizzle-orm";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChangeTimeline } from "@/components/sponsor/change-timeline";
import { db } from "@/db";
import { sponsors } from "@/db/schema";

interface SponsorPageProps {
	params: Promise<{ id: string }>;
}

export default async function SponsorPage({ params }: SponsorPageProps) {
	const { id } = await params;

	const [sponsor] = await db.select().from(sponsors).where(eq(sponsors.id, id));

	if (!sponsor) {
		notFound();
	}

	const isActive = sponsor.status === "active";
	const isArating = sponsor.rating?.includes("A");

	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<Link
				href="/search"
				className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to search
			</Link>

			<div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							{sponsor.canonicalName}
						</h1>
						{(sponsor.town || sponsor.county) && (
							<p className="mt-1 flex items-center gap-1 text-gray-500">
								<MapPin className="h-4 w-4" />
								{[sponsor.town, sponsor.county].filter(Boolean).join(", ")}
							</p>
						)}
					</div>
					<div className="flex flex-col items-end gap-2">
						<span
							className={`rounded-full px-3 py-1 text-sm font-medium ${
								isActive
									? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
									: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
							}`}
						>
							{sponsor.status}
						</span>
						{sponsor.rating && (
							<span
								className={`rounded-full px-3 py-1 text-sm font-medium ${
									isArating
										? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
										: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
								}`}
							>
								{sponsor.rating}
							</span>
						)}
					</div>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
					{sponsor.sponsorType && (
						<div>
							<p className="text-xs font-medium uppercase text-gray-500">
								Type
							</p>
							<p className="mt-1 text-sm">{sponsor.sponsorType}</p>
						</div>
					)}
					{sponsor.routes && sponsor.routes.length > 0 && (
						<div>
							<p className="text-xs font-medium uppercase text-gray-500">
								Routes
							</p>
							<div className="mt-1 flex flex-wrap gap-1">
								{sponsor.routes.map((route) => (
									<span
										key={route}
										className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
									>
										{route}
									</span>
								))}
							</div>
						</div>
					)}
					{sponsor.firstSeenAt && (
						<div>
							<p className="text-xs font-medium uppercase text-gray-500">
								First seen
							</p>
							<p className="mt-1 text-sm">
								{new Date(sponsor.firstSeenAt).toLocaleDateString()}
							</p>
						</div>
					)}
					{sponsor.lastSeenAt && (
						<div>
							<p className="text-xs font-medium uppercase text-gray-500">
								Last seen
							</p>
							<p className="mt-1 text-sm">
								{new Date(sponsor.lastSeenAt).toLocaleDateString()}
							</p>
						</div>
					)}
				</div>
			</div>

			<div className="mt-8">
				<h2 className="mb-4 text-lg font-semibold">Change History</h2>
				<ChangeTimeline sponsorId={id} />
			</div>
		</div>
	);
}
