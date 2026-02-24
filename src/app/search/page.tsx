import type { Metadata } from "next";
import { SearchBar } from "@/components/search/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";

export const metadata: Metadata = {
	title: "Search Sponsors",
	description:
		"Search 140,000+ licensed UK visa sponsors. Filter by town, route, and rating.",
};

export default function SearchPage() {
	return (
		<div className="flex h-[calc(100vh-4rem)] flex-col">
			<div className="shrink-0 bg-gradient-to-b from-primary-subtle/30 to-transparent">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<h1 className="font-display text-3xl text-text-primary">
						Search Sponsors
					</h1>
					<p className="mt-1 text-text-secondary">
						Search 140,000+ licensed UK visa sponsors.
					</p>

					<div className="mt-4 space-y-3">
						<SearchBar />
						<SearchFilters />
					</div>
				</div>
			</div>

			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 sm:px-6 lg:px-8">
				<SearchResults />
			</div>
		</div>
	);
}
