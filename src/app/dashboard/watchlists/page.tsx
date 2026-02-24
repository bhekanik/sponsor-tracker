import { WatchlistManager } from "@/components/watchlists/watchlist-manager";

export default function WatchlistsPage() {
	return (
		<div>
			<h1 className="font-display text-2xl text-text-primary">Watchlists</h1>
			<p className="mt-1 text-text-secondary">
				Create watchlists with rules to track specific sponsors.
			</p>
			<div className="mt-6">
				<WatchlistManager />
			</div>
		</div>
	);
}
