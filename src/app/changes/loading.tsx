export default function ChangesLoading() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="h-8 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
			<div className="mt-2 h-5 w-80 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
			<div className="mt-6 space-y-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="h-20 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
					/>
				))}
			</div>
		</div>
	);
}
