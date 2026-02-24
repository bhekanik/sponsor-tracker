"use client";

import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export function SearchBar() {
	const [q, setQ] = useQueryState(
		"q",
		parseAsString.withDefault("").withOptions({ throttleMs: 300 }),
	);

	return (
		<div className="relative">
			<Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
			<input
				type="text"
				value={q}
				onChange={(e) => setQ(e.target.value || null)}
				placeholder="Search sponsors by name..."
				className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-4 text-base shadow-sm transition-shadow focus:shadow-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
			/>
		</div>
	);
}
