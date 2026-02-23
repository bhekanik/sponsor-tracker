import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "API Documentation",
	description:
		"SponsorTracker REST API. Search sponsors, track changes, and integrate with your applications.",
};

export default function ApiDocsPage() {
	const endpoints = [
		{
			method: "GET",
			path: "/api/v1/sponsors/search",
			params: "q, town, route, rating, limit, offset",
			description: "Search sponsors with fuzzy matching",
		},
		{
			method: "GET",
			path: "/api/v1/sponsors/:id",
			params: "",
			description: "Get sponsor details by ID",
		},
		{
			method: "GET",
			path: "/api/v1/sponsors/:id/history",
			params: "",
			description: "Get change history for a sponsor",
		},
		{
			method: "POST",
			path: "/api/v1/sponsors/resolve",
			params: "Body: { names: string[] }",
			description: "Bulk fuzzy match names to sponsor records (Pro+)",
		},
		{
			method: "GET",
			path: "/api/v1/changes",
			params: "since (ISO date), limit",
			description: "Get changes since a date",
		},
		{
			method: "GET",
			path: "/api/v1/changes/latest",
			params: "",
			description: "Get the most recent changeset",
		},
		{
			method: "POST",
			path: "/api/v1/bulk/check",
			params: "Body: { names: string[] }",
			description: "Bulk check sponsor status (Business only)",
		},
	];

	return (
		<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold">API Documentation</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				RESTful API for searching sponsors, checking status, and streaming
				changes. All endpoints require an API key.
			</p>

			<div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
				<h2 className="text-sm font-semibold">Authentication</h2>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Include your API key in the Authorization header:
				</p>
				<pre className="mt-2 overflow-x-auto text-xs">
					Authorization: Bearer st_your_api_key_here
				</pre>
			</div>

			<div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
				<h2 className="text-sm font-semibold">Rate Limits</h2>
				<ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
					<li>Free: 100 requests/day</li>
					<li>Pro: 1,000 requests/day</li>
					<li>Business: 10,000 requests/day + bulk endpoints</li>
				</ul>
			</div>

			<h2 className="mt-8 text-lg font-bold">Endpoints</h2>
			<div className="mt-4 space-y-4">
				{endpoints.map((ep) => (
					<div
						key={`${ep.method}-${ep.path}`}
						className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
					>
						<div className="flex items-center gap-2">
							<span
								className={`rounded px-2 py-0.5 text-xs font-bold ${
									ep.method === "GET"
										? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
										: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
								}`}
							>
								{ep.method}
							</span>
							<code className="text-sm">{ep.path}</code>
						</div>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							{ep.description}
						</p>
						{ep.params && (
							<p className="mt-1 text-xs text-gray-500">
								Parameters: {ep.params}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
