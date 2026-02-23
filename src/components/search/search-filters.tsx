"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface SearchFiltersProps {
	town?: string;
	rating?: string;
	route?: string;
}

export function SearchFilters({ town, rating, route }: SearchFiltersProps) {
	const router = useRouter();

	const updateFilter = useCallback(
		(key: string, value: string) => {
			const params = new URLSearchParams(window.location.search);
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
			params.set("page", "1");
			router.push(`/search?${params.toString()}`);
		},
		[router],
	);

	return (
		<div className="flex flex-wrap gap-3">
			<select
				value={rating ?? ""}
				onChange={(e) => updateFilter("rating", e.target.value)}
				className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
			>
				<option value="">All ratings</option>
				<option value="A rating">A rating</option>
				<option value="B rating">B rating</option>
			</select>

			<input
				type="text"
				placeholder="Filter by town..."
				defaultValue={town ?? ""}
				onBlur={(e) => updateFilter("town", e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						updateFilter("town", e.currentTarget.value);
					}
				}}
				className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
			/>

			<select
				value={route ?? ""}
				onChange={(e) => updateFilter("route", e.target.value)}
				className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
			>
				<option value="">All routes</option>
				<option value="Skilled Worker">Skilled Worker</option>
				<option value="Global Business Mobility">
					Global Business Mobility
				</option>
				<option value="Temporary Worker">Temporary Worker</option>
				<option value="Scale-up">Scale-up</option>
			</select>
		</div>
	);
}
