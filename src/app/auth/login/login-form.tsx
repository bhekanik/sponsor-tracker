"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await signIn.email({ email, password });
			if (result.error) {
				setError(result.error.message ?? "Sign in failed");
			} else {
				router.push(callbackUrl);
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<div className="w-full max-w-sm space-y-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Sign in</h1>
					<p className="mt-2 text-sm text-text-secondary">
						Sign in to your SponsorTracker account.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{error && (
						<p className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">
							{error}
						</p>
					)}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-text-primary"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-text-primary"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
					>
						{loading ? "Signing in..." : "Sign in"}
					</button>
				</form>

				<p className="text-center text-sm text-text-secondary">
					Don't have an account?{" "}
					<Link
						href="/auth/register"
						className="text-primary hover:underline"
					>
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}
