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
				</div>

			{/* FAQ */}
			<section className="mt-12">
				<h2 className="font-display text-2xl text-text-primary">
					Frequently Asked Questions
				</h2>
				<dl className="mt-6 space-y-6">
					{[
						{
							q: "What is SponsorTracker?",
							a: "SponsorTracker is an independent tool that monitors the UK Home Office Register of Licensed Sponsors and alerts you when companies are added, removed, or have their details updated.",
						},
						{
							q: "Where does the data come from?",
							a: "All sponsor data comes directly from the GOV.UK Register of Licensed Sponsors: Workers, published by the UK Home Office. We do not modify or editorialize the data.",
						},
						{
							q: "How often is the data updated?",
							a: "We check for updates from GOV.UK almost every business day. When the Home Office publishes a new version of the register, we detect and record the changes automatically.",
						},
						{
							q: "Is this an official government service?",
							a: "No. SponsorTracker is not affiliated with the Home Office, GOV.UK, or any government body. It is an independent tool that makes publicly available data easier to search and monitor.",
						},
						{
							q: "What do the sponsor statuses mean?",
							a: "Sponsors on the register can have an A-rating (meets all compliance requirements) or a B-rating (has some compliance issues). Sponsors can also be listed as revoked or suspended.",
						},
						{
							q: "How does the alert system work?",
							a: "You can create watchlist rules that match sponsors by name, location, or route. When a matching sponsor is added, removed, or updated on the register, you receive a notification via email, Slack, or webhook.",
						},
					].map((faq) => (
						<div key={faq.q}>
							<dt className="text-sm font-semibold text-text-primary">
								{faq.q}
							</dt>
							<dd className="mt-1 text-sm text-text-secondary">
								{faq.a}
							</dd>
						</div>
					))}
				</dl>
			</section>

			{/* Disclaimer */}
			<p className="mt-12 text-xs text-text-muted">
				We are not affiliated with the Home Office or GOV.UK. This is an
				independent tool built to make public data more accessible.
			</p>
		</div>
	);
}
