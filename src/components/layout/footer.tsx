import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t border-border bg-surface-raised">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<p className="text-sm text-text-muted">
						Data from{" "}
						<a
							href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary transition-colors hover:text-primary-hover hover:underline"
						>
							GOV.UK Register of Licensed Sponsors
						</a>
						. Not affiliated with the Home Office.
					</p>
					<div className="flex gap-6">
						<Link
							href="/about"
							className="text-sm text-text-muted transition-colors hover:text-text-primary"
						>
							About
						</Link>
						<Link
							href="/docs/api"
							className="text-sm text-text-muted transition-colors hover:text-text-primary"
						>
							API
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
