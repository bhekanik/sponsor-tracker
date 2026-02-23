import Link from "next/link";

export default function NotFound() {
	return (
		<div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
			<h2 className="text-4xl font-bold">404</h2>
			<p className="text-gray-600 dark:text-gray-400">
				The page you&#39;re looking for doesn&#39;t exist.
			</p>
			<Link
				href="/"
				className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
			>
				Go home
			</Link>
		</div>
	);
}
