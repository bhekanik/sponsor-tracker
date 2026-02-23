import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { auth } from "@/lib/auth";

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
			{/* Mobile horizontal nav */}
			<div className="mb-6 md:hidden">
				<SidebarNav orientation="horizontal" />
			</div>
			<div className="flex gap-8">
				{/* Desktop sidebar */}
				<div className="hidden w-48 shrink-0 md:block">
					<SidebarNav />
				</div>
				<div className="min-w-0 flex-1">{children}</div>
			</div>
		</div>
	);
}
