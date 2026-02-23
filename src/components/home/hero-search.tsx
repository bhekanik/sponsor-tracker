"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSearch() {
	const router = useRouter();
	const [value, setValue] = useState("");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (value.trim()) {
			router.push(`/search?q=${encodeURIComponent(value.trim())}`);
		} else {
			router.push("/search");
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex w-full max-w-xl items-center gap-2">
			<div className="relative flex-1">
				<Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
				<input
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="Search 140,000+ licensed sponsors..."
					className="w-full rounded-xl border border-border bg-surface py-3.5 pl-11 pr-4 text-base shadow-sm transition-shadow focus:shadow-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
			</div>
			<button
				type="submit"
				className="rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
			>
				Search
			</button>
		</form>
	);
}
