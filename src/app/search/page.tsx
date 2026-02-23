import { SearchBar } from "@/components/search/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";

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
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold">Search Sponsors</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Search 90,000+ licensed UK visa sponsors.
			</p>

			<div className="mt-6 space-y-4">
				<SearchBar defaultValue={q} />
				<SearchFilters
					town={params.town}
					rating={params.rating}
					route={params.route}
				/>
			</div>

			<div className="mt-8">
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
