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

	const selectClass =
		"rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

	return (
		<div className="flex flex-wrap gap-3">
			<select
				value={rating ?? ""}
				onChange={(e) => updateFilter("rating", e.target.value)}
				className={selectClass}
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
				className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
			/>

			<select
				value={route ?? ""}
				onChange={(e) => updateFilter("route", e.target.value)}
				className={selectClass}
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
