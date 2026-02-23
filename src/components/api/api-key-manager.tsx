"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Key, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ApiKeyManager() {
	const queryClient = useQueryClient();
	const [showKey, setShowKey] = useState(false);

	const { data, isLoading } = useQuery<{ apiKey: string | null }>({
		queryKey: ["api-key"],
		queryFn: () => fetch("/api/keys").then((r) => r.json()),
	});

	const generateMutation = useMutation({
		mutationFn: () =>
			fetch("/api/keys", { method: "POST" }).then((r) => r.json()),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api-key"] });
			setShowKey(true);
			toast.success("API key generated");
		},
	});

	const revokeMutation = useMutation({
		mutationFn: () =>
			fetch("/api/keys", { method: "DELETE" }).then((r) => r.json()),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["api-key"] });
			setShowKey(false);
			toast.success("API key revoked");
		},
	});

	function copyKey() {
		if (data?.apiKey) {
			navigator.clipboard.writeText(data.apiKey);
			toast.success("Copied to clipboard");
		}
	}

	if (isLoading) {
		return (
			<div className="h-20 animate-pulse rounded-lg bg-surface-raised" />
		);
	}

	return (
		<div className="space-y-4">
			{data?.apiKey ? (
				<div className="space-y-3">
					<div className="flex items-center gap-2 rounded-lg border border-border p-4">
						<Key className="h-5 w-5 text-primary" />
						<code className="flex-1 text-sm">
							{showKey
								? data.apiKey
								: `${data.apiKey.slice(0, 8)}${"•".repeat(32)}`}
						</code>
						<button
							type="button"
							onClick={() => setShowKey(!showKey)}
							className="text-xs text-primary hover:underline"
						>
							{showKey ? "Hide" : "Show"}
						</button>
						<button
							type="button"
							onClick={copyKey}
							className="text-text-muted hover:text-text-secondary"
							title="Copy"
						>
							<Copy className="h-4 w-4" />
						</button>
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => generateMutation.mutate()}
							disabled={generateMutation.isPending}
							className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-text-primary hover:bg-surface-raised"
						>
							<RefreshCw className="h-3.5 w-3.5" />
							Regenerate
						</button>
						<button
							type="button"
							onClick={() => revokeMutation.mutate()}
							disabled={revokeMutation.isPending}
							className="flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
						>
							<Trash2 className="h-3.5 w-3.5" />
							Revoke
						</button>
					</div>
				</div>
			) : (
				<div className="text-center">
					<p className="mb-4 text-sm text-text-muted">
						No API key generated yet.
					</p>
					<button
						type="button"
						onClick={() => generateMutation.mutate()}
						disabled={generateMutation.isPending}
						className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
					>
						<Key className="h-4 w-4" />
						Generate API Key
					</button>
				</div>
			)}

			<div className="rounded-lg bg-surface-raised p-4 text-sm">
				<h3 className="font-medium">Usage</h3>
				<pre className="mt-2 overflow-x-auto text-xs text-text-secondary">
					{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://sponsortracker.uk/api/v1/sponsors/search?q=acme`}
				</pre>
			</div>
		</div>
	);
}
