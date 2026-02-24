"use client";

import { X } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { useCallback, useRef, useState } from "react";

const ratingOptions = [
	{ value: "", label: "All ratings" },
	{ value: "A rating", label: "A rating" },
	{ value: "B rating", label: "B rating" },
];

const routeOptions = [
	{ value: "", label: "All routes" },
	{ value: "Skilled Worker", label: "Skilled Worker" },
	{ value: "Global Business Mobility", label: "Global Business Mobility" },
	{ value: "Temporary Worker", label: "Temporary Worker" },
	{ value: "Scale-up", label: "Scale-up" },
];

const statusOptions = [
	{ value: "", label: "All statuses" },
	{ value: "active", label: "Active" },
	{ value: "removed", label: "Removed" },
];

export function SearchFilters() {
	const [params, setParams] = useQueryStates({
		rating: parseAsString,
		route: parseAsString,
		status: parseAsString,
		town: parseAsString,
		page: parseAsString,
	});

	const [townInput, setTownInput] = useState(params.town ?? "");
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const handleTownChange = useCallback(
		(value: string) => {
			setTownInput(value);
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				setParams({ town: value || null, page: "1" });
			}, 400);
		},
		[setParams],
	);

	const activeFilters: { key: string; label: string }[] = [];
	if (params.rating) activeFilters.push({ key: "rating", label: params.rating });
	if (params.route) activeFilters.push({ key: "route", label: params.route });
	if (params.status) activeFilters.push({ key: "status", label: params.status });
	if (params.town) activeFilters.push({ key: "town", label: params.town });

	const selectClass =
		"rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap gap-3">
				<select
					value={params.rating ?? ""}
					onChange={(e) =>
						setParams({ rating: e.target.value || null, page: "1" })
					}
					className={selectClass}
				>
					{ratingOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>

				<select
					value={params.route ?? ""}
					onChange={(e) =>
						setParams({ route: e.target.value || null, page: "1" })
					}
					className={selectClass}
				>
					{routeOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>

				<select
					value={params.status ?? ""}
					onChange={(e) =>
						setParams({ status: e.target.value || null, page: "1" })
					}
					className={selectClass}
				>
					{statusOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>

				<input
					type="text"
					placeholder="Filter by town..."
					value={townInput}
					onChange={(e) => handleTownChange(e.target.value)}
					className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
			</div>

			{activeFilters.length > 0 && (
				<div className="flex flex-wrap items-center gap-2">
					{activeFilters.map((f) => (
						<button
							key={f.key}
							type="button"
							onClick={() => {
								setParams({ [f.key]: null, page: "1" });
								if (f.key === "town") setTownInput("");
							}}
							className="inline-flex items-center gap-1 rounded-full bg-primary-subtle px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
						>
							{f.label}
							<X className="h-3 w-3" />
						</button>
					))}
					<button
						type="button"
						onClick={() => {
							setParams({
								rating: null,
								route: null,
								status: null,
								town: null,
								page: "1",
							});
							setTownInput("");
						}}
						className="text-xs text-text-muted transition-colors hover:text-text-primary"
					>
						Clear all
					</button>
				</div>
			)}
		</div>
	);
}
