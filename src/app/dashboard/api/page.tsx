import { ApiKeyManager } from "@/components/api/api-key-manager";

export default function ApiKeysPage() {
	return (
		<div>
			<h1 className="font-display text-2xl text-text-primary">API Keys</h1>
			<p className="mt-1 text-text-secondary">
				Generate and manage API keys for programmatic access.
			</p>
			<div className="mt-6">
				<ApiKeyManager />
			</div>
		</div>
	);
}
