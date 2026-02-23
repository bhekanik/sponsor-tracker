import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"SponsorTracker monitors the UK Home Office Register of Licensed Sponsors. Independent tool making public data more accessible.",
};

export default function AboutPage() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="font-display text-3xl text-text-primary">
				About SponsorTracker
			</h1>
			<p className="mt-4 max-w-2xl text-text-secondary">
				SponsorTracker monitors the UK Home Office Register of Licensed Sponsors
				and notifies you when companies you care about are added, removed, or
				updated.
			</p>
			<div className="mt-8 space-y-4 text-sm text-text-secondary">
				<p>
					<strong className="text-text-primary">Data source:</strong> GOV.UK
					Register of Licensed Sponsors: Workers
				</p>
				<p>
					<strong className="text-text-primary">Updated:</strong> Almost every
					business day
				</p>
				<p>
					<strong className="text-text-primary">Coverage:</strong> 140,000+
					licensed sponsors
				</p>
				<p className="mt-8 text-xs text-text-muted">
					We are not affiliated with the Home Office or GOV.UK. This is an
					independent tool built to make public data more accessible.
				</p>
			</div>
		</div>
	);
}
