"use client";

import { useQuery } from "@tanstack/react-query";
import { SponsorCard } from "./sponsor-card";

interface SearchResultsProps {
	q: string;
	town?: string;
	county?: string;
	route?: string;
	rating?: string;
	page: number;
}

async function fetchResults(params: SearchResultsProps) {
	const searchParams = new URLSearchParams();
	if (params.q) searchParams.set("q", params.q);
	if (params.town) searchParams.set("town", params.town);
	if (params.county) searchParams.set("county", params.county);
	if (params.route) searchParams.set("route", params.route);
	if (params.rating) searchParams.set("rating", params.rating);
	searchParams.set("page", String(params.page));
	searchParams.set("limit", "20");

	const res = await fetch(`/api/search?${searchParams.toString()}`);
	if (!res.ok) throw new Error("Search failed");
	return res.json();
}

export function SearchResults(props: SearchResultsProps) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["search", props],
		queryFn: () => fetchResults(props),
	});

	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={`skeleton-${i}`}
						className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
					/>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<p className="text-sm text-red-600">Search failed. Please try again.</p>
		);
	}

	if (!data?.data?.length) {
		return (
			<p className="text-sm text-gray-500">
				{props.q
					? `No sponsors found matching "${props.q}"`
					: "No sponsors found"}
			</p>
		);
	}

	return (
		<div>
			<p className="mb-4 text-sm text-gray-500">
				{data.total.toLocaleString()} sponsor{data.total !== 1 ? "s" : ""} found
			</p>
			<div className="space-y-3">
				{data.data.map(
					(sponsor: {
						id: string;
						canonicalName: string;
						town: string | null;
						county: string | null;
						rating: string | null;
						routes: string[] | null;
						status: string;
						lastSeenAt: string | null;
					}) => (
						<SponsorCard key={sponsor.id} {...sponsor} />
					),
				)}
			</div>
			{data.total > 20 && (
				<Pagination
					currentPage={props.page}
					totalPages={Math.ceil(data.total / 20)}
				/>
			)}
		</div>
	);
}

function Pagination({
	currentPage,
	totalPages,
}: {
	currentPage: number;
	totalPages: number;
}) {
	return (
		<div className="mt-6 flex items-center justify-center gap-2">
			{currentPage > 1 && (
				<a
					href={`?page=${currentPage - 1}`}
					className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
				>
					Previous
				</a>
			)}
			<span className="text-sm text-gray-500">
				Page {currentPage} of {totalPages}
			</span>
			{currentPage < totalPages && (
				<a
					href={`?page=${currentPage + 1}`}
					className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
				>
					Next
				</a>
			)}
		</div>
	);
}
