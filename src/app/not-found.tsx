import Link from "next/link";

export default function NotFound() {
	return (
		<div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
			<span className="font-display text-7xl text-primary">404</span>
			<h2 className="text-lg font-semibold text-text-primary">Page not found</h2>
			<p className="text-text-secondary">
				The page you&#39;re looking for doesn&#39;t exist.
			</p>
			<Link
				href="/"
				className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
			>
				Go home
			</Link>
		</div>
	);
}
