"use client";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
			<h2 className="text-2xl font-bold">Something went wrong</h2>
			<p className="text-gray-600 dark:text-gray-400">
				{error.message || "An unexpected error occurred."}
			</p>
			<button
				type="button"
				onClick={reset}
				className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
			>
				Try again
			</button>
		</div>
	);
}
