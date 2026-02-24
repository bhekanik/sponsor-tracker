import type { Metadata } from "next";
import { ChangeFeed } from "@/components/changes/change-feed";

export const metadata: Metadata = {
	title: "What Changed Today",
	description:
		"Daily updates from the UK Home Office Register of Licensed Sponsors. See which companies were added, removed, or updated.",
};

export default function ChangesPage() {
	return (
		<div className="flex h-[calc(100vh-4rem)] flex-col">
			<div className="shrink-0 bg-gradient-to-b from-primary-subtle/30 to-transparent">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<h1 className="font-display text-3xl text-text-primary">
						What Changed Today?
					</h1>
					<p className="mt-1 text-text-secondary">
						Daily updates from the UK Home Office Register of Licensed Sponsors.
					</p>
				</div>
			</div>
			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 sm:px-6 lg:px-8">
				<ChangeFeed />
			</div>
		</div>
	);
}
