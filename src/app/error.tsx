"use client";

import Link from "next/link";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
				<span className="text-2xl">!</span>
			</div>
			<h2 className="font-display text-2xl text-text-primary">
				Something went wrong
			</h2>
			<p className="text-text-secondary">
				{error.message || "An unexpected error occurred."}
			</p>
			<div className="flex gap-3">
				<button
					type="button"
					onClick={reset}
					className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
				>
					Try again
				</button>
				<Link
					href="/"
					className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-raised"
				>
					Go home
				</Link>
			</div>
		</div>
	);
}
