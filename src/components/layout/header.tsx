import Link from "next/link";

export function Header() {
	return (
		<header className="border-b bg-white dark:bg-gray-950">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-8">
					<Link href="/" className="flex items-center gap-2">
						<span className="text-xl font-bold text-indigo-600">
							SponsorTracker
						</span>
					</Link>
					<nav className="hidden items-center gap-6 md:flex">
						<Link
							href="/search"
							className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
						>
							Search
						</Link>
						<Link
							href="/changes"
							className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
						>
							Changes
						</Link>
						<Link
							href="/pricing"
							className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
						>
							Pricing
						</Link>
					</nav>
				</div>
				<div className="flex items-center gap-4">
					<Link
						href="/dashboard"
						className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					>
						Dashboard
					</Link>
					<Link
						href="/auth/login"
						className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
					>
						Sign in
					</Link>
				</div>
			</div>
		</header>
	);
}
