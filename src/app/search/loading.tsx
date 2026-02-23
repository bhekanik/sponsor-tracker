export default function SearchLoading() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="h-8 w-48 animate-pulse rounded bg-surface-raised" />
			<div className="mt-2 h-5 w-72 animate-pulse rounded bg-surface-raised" />
			<div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-surface-raised" />
			<div className="mt-8 space-y-3">
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className="h-16 w-full animate-pulse rounded-xl bg-surface-raised"
					/>
				))}
			</div>
		</div>
	);
}
