export default function SponsorLoading() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
			<div className="mt-6 rounded-xl border border-gray-200 p-6 dark:border-gray-800">
				<div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
				<div className="mt-2 h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
				<div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i}>
							<div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
							<div className="mt-2 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
