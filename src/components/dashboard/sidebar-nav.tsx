"use client";

import { Bell, Eye, Key, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/dashboard", label: "Overview", icon: LayoutDashboard },
	{ href: "/dashboard/watchlists", label: "Watchlists", icon: Eye },
	{ href: "/dashboard/alerts", label: "Alerts", icon: Bell },
	{ href: "/dashboard/api", label: "API Keys", icon: Key },
];

export function SidebarNav({
	orientation = "vertical",
}: {
	orientation?: "vertical" | "horizontal";
}) {
	const pathname = usePathname();

	if (orientation === "horizontal") {
		return (
			<nav className="flex gap-1 overflow-x-auto rounded-xl bg-surface-raised p-1">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors ${
								isActive
									? "bg-primary/10 font-medium text-primary"
									: "text-text-secondary hover:bg-surface hover:text-text-primary"
							}`}
						>
							<item.icon className="h-4 w-4" />
							{item.label}
						</Link>
					);
				})}
			</nav>
		);
	}

	return (
		<nav className="rounded-xl bg-surface-raised p-3 space-y-1">
			{navItems.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.href}
						href={item.href}
						className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
							isActive
								? "bg-primary/10 font-medium text-primary"
								: "text-text-secondary hover:bg-surface hover:text-text-primary"
						}`}
					>
						<item.icon className="h-4 w-4" />
						{item.label}
					</Link>
				);
			})}
		</nav>
	);
}
