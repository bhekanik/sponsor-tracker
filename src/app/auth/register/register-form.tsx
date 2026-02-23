"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

export function RegisterForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await signUp.email({ name, email, password });
			if (result.error) {
				setError(result.error.message ?? "Registration failed");
			} else {
				router.push("/dashboard");
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
					<h1 className="text-2xl font-bold">Create account</h1>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Create your SponsorTracker account to set up alerts and watchlists.
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
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Name
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900"
						/>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
					>
						{loading ? "Creating account..." : "Create account"}
					</button>
				</form>

				<p className="text-center text-sm text-gray-600 dark:text-gray-400">
					Already have an account?{" "}
					<Link href="/auth/login" className="text-indigo-600 hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
