import type { Metadata } from "next";
import { ChangeFeed } from "@/components/changes/change-feed";

export const metadata: Metadata = {
	title: "What Changed Today",
	description:
		"Daily updates from the UK Home Office Register of Licensed Sponsors. See which companies were added, removed, or updated.",
};

export default function ChangesPage() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold">What Changed Today?</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Daily updates from the UK Home Office Register of Licensed Sponsors.
			</p>
			<div className="mt-6">
				<ChangeFeed />
			</div>
		</div>
	);
}
