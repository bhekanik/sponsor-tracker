import type { Metadata } from "next";
import { SearchBar } from "@/components/search/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";

export const metadata: Metadata = {
	title: "Search Sponsors",
	description:
		"Search 140,000+ licensed UK visa sponsors. Filter by town, route, and rating.",
};

interface SearchPageProps {
	searchParams: Promise<{
		q?: string;
		town?: string;
		county?: string;
		route?: string;
		rating?: string;
		page?: string;
	}>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const params = await searchParams;
	const q = params.q ?? "";
	const page = Math.max(1, Number(params.page ?? 1));

	return (
		<div>
			<div className="bg-gradient-to-b from-primary-subtle/30 to-transparent">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<h1 className="font-display text-3xl text-text-primary">
						Search Sponsors
					</h1>
					<p className="mt-2 text-text-secondary">
						Search 140,000+ licensed UK visa sponsors.
					</p>

					<div className="mt-6 space-y-4">
						<SearchBar defaultValue={q} />
						<SearchFilters
							town={params.town}
							rating={params.rating}
							route={params.route}
						/>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<SearchResults
					q={q}
					town={params.town}
					county={params.county}
					route={params.route}
					rating={params.rating}
					page={page}
				/>
			</div>
		</div>
	);
}
