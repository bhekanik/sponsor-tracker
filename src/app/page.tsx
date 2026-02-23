import { Activity, Bell, History } from "lucide-react";
import Link from "next/link";
import { HeroSearch } from "@/components/home/hero-search";

export default function HomePage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "SponsorTracker",
		url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sponsortracker.uk",
		description:
			"Monitor 140,000+ companies on the UK Home Office Register of Licensed Sponsors.",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://sponsortracker.uk"}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<div>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: structured data, not user input
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-dot-grid opacity-40" />
				<div className="absolute inset-0 bg-gradient-to-b from-primary-subtle/50 via-transparent to-transparent" />
				<div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
					{/* Trust badge */}
					<div className="animate-fade-in flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 shadow-sm">
						<span
							className="h-2 w-2 rounded-full bg-green-500"
							style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
						/>
						<span className="text-sm text-text-secondary">
							Updated daily from GOV.UK
						</span>
					</div>

					<h1
						className="max-w-3xl font-display text-5xl tracking-tight text-text-primary sm:text-6xl lg:text-7xl animate-fade-up"
						style={{ animationDelay: "100ms" }}
					>
						Track UK Visa Sponsor Changes
					</h1>
					<p
						className="max-w-2xl text-lg text-text-secondary animate-fade-up"
						style={{ animationDelay: "200ms" }}
					>
						The Home Office updates the sponsor register almost every business
						day. Stop refreshing the spreadsheet. Get notified when it matters.
					</p>

					<div
						className="w-full flex justify-center animate-fade-up"
						style={{ animationDelay: "300ms" }}
					>
						<HeroSearch />
					</div>

					<div
						className="flex gap-4 animate-fade-up"
						style={{ animationDelay: "400ms" }}
					>
						<Link
							href="/changes"
							className="text-sm text-primary transition-colors hover:text-primary-hover hover:underline"
						>
							What changed today?
						</Link>
						<Link
							href="/pricing"
							className="text-sm text-primary transition-colors hover:text-primary-hover hover:underline"
						>
							Set up alerts &rarr;
						</Link>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
				<div className="grid gap-6 md:grid-cols-3">
					{[
						{
							icon: Activity,
							title: "Daily monitoring",
							description:
								"We poll the GOV.UK register every business day and detect every addition, removal, and update automatically.",
						},
						{
							icon: Bell,
							title: "Instant alerts",
							description:
								"Set rules for the sponsors you care about. Get email, Slack, or webhook notifications the moment something changes.",
						},
						{
							icon: History,
							title: "Full history",
							description:
								"See the complete change timeline for any sponsor. When they were added, when their rating changed, and more.",
						},
					].map((feature, i) => (
						<div
							key={feature.title}
							className="rounded-2xl border border-border bg-surface p-6 animate-fade-up"
							style={{ animationDelay: `${i * 100}ms` }}
						>
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle">
								<feature.icon className="h-5 w-5 text-primary" />
							</div>
							<h3 className="mt-4 font-semibold text-text-primary">
								{feature.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-text-secondary">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Trust signals */}
			<section className="border-y border-border bg-surface-raised">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-4 py-8 text-sm text-text-secondary sm:flex-row sm:gap-12 sm:px-6 lg:px-8">
					<span>Data from GOV.UK</span>
					<span className="hidden h-4 w-px bg-border sm:block" />
					<span>Updated every business day</span>
					<span className="hidden h-4 w-px bg-border sm:block" />
					<span>140,000+ sponsors tracked</span>
				</div>
			</section>

			{/* CTA */}
			<section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
				<div className="rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-12 text-center text-white">
					<h2 className="font-display text-3xl sm:text-4xl">
						Stop refreshing spreadsheets
					</h2>
					<p className="mx-auto mt-4 max-w-lg text-white/80">
						Join immigration professionals who track sponsor changes
						automatically instead of manually checking GOV.UK.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Link
							href="/auth/register"
							className="rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-white/90"
						>
							Get started free
						</Link>
						<Link
							href="/pricing"
							className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
						>
							View pricing
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
