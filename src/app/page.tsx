import { Search } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<section className="flex flex-col items-center gap-8 py-24 text-center">
				<h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
					Track UK Visa Sponsor Changes — Instantly
				</h1>
				<p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
					The Home Office updates the sponsor register almost every business
					day. Stop refreshing the spreadsheet. Get notified when it matters.
				</p>
				<div className="flex w-full max-w-xl items-center gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search 90,000+ licensed sponsors..."
							className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900"
							readOnly
						/>
					</div>
					<Link
						href="/search"
						className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Search
					</Link>
				</div>
				<div className="flex gap-4">
					<Link
						href="/changes"
						className="text-sm text-indigo-600 hover:underline"
					>
						What changed today?
					</Link>
					<Link
						href="/pricing"
						className="text-sm text-indigo-600 hover:underline"
					>
						Set up alerts →
					</Link>
				</div>
			</section>
		</div>
	);
}
