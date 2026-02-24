import { eq } from "drizzle-orm";
import { ArrowLeft, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ChangeTimeline } from "@/components/sponsor/change-timeline";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { formatSponsorName, formatTown } from "@/lib/format";

interface SponsorPageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: SponsorPageProps): Promise<Metadata> {
	const { id } = await params;
	const [sponsor] = await db
		.select({ canonicalName: sponsors.canonicalName })
		.from(sponsors)
		.where(eq(sponsors.id, id));
	if (!sponsor) return { title: "Sponsor Not Found" };
	const name = formatSponsorName(sponsor.canonicalName);
	const siteUrl =
		process.env.NEXT_PUBLIC_SITE_URL ?? "https://sponsortracker.uk";
	return {
		title: name,
		description: `View sponsorship details and change history for ${name}. UK Home Office Register of Licensed Sponsors.`,
		alternates: {
			canonical: `${siteUrl}/sponsor/${id}`,
		},
	};
}

export default async function SponsorPage({ params }: SponsorPageProps) {
	const { id } = await params;

	const [sponsor] = await db.select().from(sponsors).where(eq(sponsors.id, id));

	if (!sponsor) {
		notFound();
	}

	const isActive = sponsor.status === "active";
	const name = formatSponsorName(sponsor.canonicalName);
	const location = [
		sponsor.town ? formatTown(sponsor.town) : null,
		sponsor.county ? formatTown(sponsor.county) : null,
	]
		.filter(Boolean)
		.join(", ");

	const daysOnRegister = sponsor.firstSeenAt
		? Math.floor(
				((sponsor.removedAt ?? new Date()).getTime() -
					sponsor.firstSeenAt.getTime()) /
					86400000,
			)
		: null;

	// JSON-LD structured data built from DB fields (not user input)
	const jsonLd = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		name: sponsor.canonicalName,
		...(sponsor.town && {
			address: {
				"@type": "PostalAddress",
				addressLocality: sponsor.town,
				...(sponsor.county && { addressRegion: sponsor.county }),
				addressCountry: "GB",
			},
		}),
	});

	return (
		<div>
			<script type="application/ld+json">{jsonLd}</script>

			{/* Gradient header */}
			<div className="bg-gradient-to-b from-primary-subtle/30 to-transparent">
				<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
					<Link
						href="/search"
						className="mb-4 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to search
					</Link>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<h1 className="font-display text-3xl text-text-primary">
								{name}
							</h1>
							{location && (
								<p className="mt-1 flex items-center gap-1 text-text-secondary">
									<MapPin className="h-4 w-4" />
									{location}
								</p>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant={isActive ? "success" : "danger"}
								className="px-3 py-1 text-sm"
							>
								{sponsor.status}
							</Badge>
							{sponsor.rating && (
								<Badge
									variant={sponsor.rating.includes("A") ? "info" : "warning"}
									className="px-3 py-1 text-sm"
								>
									{sponsor.rating}
								</Badge>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Main column */}
					<div className="space-y-6 lg:col-span-2">
						{/* Details card */}
						<div className="rounded-xl border border-border bg-surface p-6">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
								Details
							</h2>
							<dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
								{sponsor.sponsorType && (
									<div>
										<dt className="text-xs font-medium text-text-muted">
											Sponsor Type
										</dt>
										<dd className="mt-1 text-sm text-text-primary">
											{sponsor.sponsorType}
										</dd>
									</div>
								)}
								{sponsor.routes && sponsor.routes.length > 0 && (
									<div className="sm:col-span-2">
										<dt className="text-xs font-medium text-text-muted">
											Routes
										</dt>
										<dd className="mt-1 flex flex-wrap gap-1">
											{sponsor.routes.map((route) => (
												<span
													key={route}
													className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-medium text-primary"
												>
													{route}
												</span>
											))}
										</dd>
									</div>
								)}
							</dl>
						</div>

						{/* Change history */}
						<div>
							<h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
								Change History
							</h2>
							<ChangeTimeline sponsorId={id} />
						</div>
					</div>

					{/* Sidebar */}
					<div>
						<div className="rounded-xl border border-border bg-surface p-6">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
								Quick Facts
							</h2>
							<dl className="mt-4 space-y-4">
								{sponsor.firstSeenAt && (
									<div>
										<dt className="text-xs font-medium text-text-muted">
											First seen
										</dt>
										<dd className="mt-0.5 text-sm text-text-primary">
											{sponsor.firstSeenAt.toLocaleDateString()}
										</dd>
									</div>
								)}
								{sponsor.lastSeenAt && (
									<div>
										<dt className="text-xs font-medium text-text-muted">
											Last seen
										</dt>
										<dd className="mt-0.5 text-sm text-text-primary">
											{sponsor.lastSeenAt.toLocaleDateString()}
										</dd>
									</div>
								)}
								{daysOnRegister !== null && (
									<div>
										<dt className="text-xs font-medium text-text-muted">
											Days on register
										</dt>
										<dd className="mt-0.5 text-sm text-text-primary">
											{daysOnRegister.toLocaleString()}
										</dd>
									</div>
								)}
								<div>
									<dt className="text-xs font-medium text-text-muted">
										Status
									</dt>
									<dd className="mt-0.5">
										<Badge variant={isActive ? "success" : "danger"}>
											{sponsor.status}
										</Badge>
									</dd>
								</div>
								{sponsor.sponsorType && (
									<div>
										<dt className="text-xs font-medium text-text-muted">
											Type
										</dt>
										<dd className="mt-0.5 text-sm text-text-primary">
											{sponsor.sponsorType}
										</dd>
									</div>
								)}
							</dl>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
