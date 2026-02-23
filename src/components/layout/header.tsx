"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession, signOut } from "@/lib/auth-client";

const navLinks = [
	{ href: "/search", label: "Search" },
	{ href: "/changes", label: "Changes" },
	{ href: "/pricing", label: "Pricing" },
];

export function Header() {
	const { data: session } = useSession();
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-8">
					<Link href="/" className="flex items-center gap-1">
						<span className="font-display text-xl text-text-primary">
							Sponsor
						</span>
						<span className="font-display text-xl text-primary">Tracker</span>
					</Link>
					<nav className="hidden items-center gap-6 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm text-text-secondary transition-colors hover:text-text-primary"
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-3">
					<ThemeToggle />
					{session ? (
						<>
							<Link
								href="/dashboard"
								className="hidden text-sm text-text-secondary transition-colors hover:text-text-primary sm:block"
							>
								Dashboard
							</Link>
							<button
								type="button"
								onClick={() => signOut()}
								className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-raised sm:block"
							>
								Sign out
							</button>
						</>
					) : (
						<Link
							href="/auth/login"
							className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover sm:block"
						>
							Sign in
						</Link>
					)}
					{/* Mobile hamburger */}
					<button
						type="button"
						onClick={() => setMobileOpen(!mobileOpen)}
						className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-raised md:hidden"
						aria-label="Toggle menu"
					>
						{mobileOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{mobileOpen && (
				<div className="border-t border-border bg-surface px-4 py-4 md:hidden">
					<nav className="flex flex-col gap-1">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileOpen(false)}
								className="rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
							>
								{link.label}
							</Link>
						))}
						{session ? (
							<>
								<Link
									href="/dashboard"
									onClick={() => setMobileOpen(false)}
									className="rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
								>
									Dashboard
								</Link>
								<button
									type="button"
									onClick={() => {
										signOut();
										setMobileOpen(false);
									}}
									className="rounded-lg px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
								>
									Sign out
								</button>
							</>
						) : (
							<Link
								href="/auth/login"
								onClick={() => setMobileOpen(false)}
								className="mt-2 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-hover"
							>
								Sign in
							</Link>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}
