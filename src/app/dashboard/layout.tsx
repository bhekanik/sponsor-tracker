import { Bell, Eye, Key, LayoutDashboard } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const navItems = [
	{ href: "/dashboard", label: "Overview", icon: LayoutDashboard },
	{ href: "/dashboard/watchlists", label: "Watchlists", icon: Eye },
	{ href: "/dashboard/alerts", label: "Alerts", icon: Bell },
	{ href: "/dashboard/api", label: "API Keys", icon: Key },
];

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/auth/login?callbackUrl=/dashboard");
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="flex gap-8">
				<nav className="hidden w-48 shrink-0 space-y-1 md:block">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
						>
							<item.icon className="h-4 w-4" />
							{item.label}
						</Link>
					))}
				</nav>
				<div className="min-w-0 flex-1">{children}</div>
			</div>
		</div>
	);
}
