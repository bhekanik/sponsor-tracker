import { ApiKeyManager } from "@/components/api/api-key-manager";

export default function ApiKeysPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold">API Keys</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Generate and manage API keys for programmatic access.
			</p>
			<div className="mt-6">
				<ApiKeyManager />
			</div>
		</div>
	);
}
