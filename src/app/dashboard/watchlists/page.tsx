import { WatchlistManager } from "@/components/watchlists/watchlist-manager";

export default function WatchlistsPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Watchlists</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Create watchlists with rules to track specific sponsors.
			</p>
			<div className="mt-6">
				<WatchlistManager />
			</div>
		</div>
	);
}
