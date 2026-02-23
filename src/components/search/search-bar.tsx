"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
	const router = useRouter();
	const [value, setValue] = useState(defaultValue);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setValue(newValue);

			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				const params = new URLSearchParams(window.location.search);
				if (newValue) {
					params.set("q", newValue);
				} else {
					params.delete("q");
				}
				params.set("page", "1");
				router.push(`/search?${params.toString()}`);
			}, 300);
		},
		[router],
	);

	return (
		<div className="relative">
			<Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
			<input
				type="text"
				value={value}
				onChange={handleChange}
				placeholder="Search sponsors by name..."
				className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-4 text-base shadow-sm transition-shadow focus:shadow-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
			/>
		</div>
	);
}
