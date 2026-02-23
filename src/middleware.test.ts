import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "./middleware";

function createRequest(path: string, hasCookie = false): NextRequest {
	const url = new URL(path, "http://localhost:3000");
	const req = new NextRequest(url);
	if (hasCookie) {
		req.cookies.set("better-auth.session_token", "test-token");
	}
	return req;
}

describe("middleware", () => {
	it("allows public routes without auth", () => {
		const publicPaths = [
			"/",
			"/search",
			"/search?q=test",
			"/sponsor/123",
			"/changes",
			"/pricing",
			"/about",
			"/auth/login",
			"/auth/register",
			"/api/auth/session",
			"/api/search",
			"/api/sponsors/123",
			"/api/changes",
			"/docs/api",
		];

		for (const path of publicPaths) {
			const res = middleware(createRequest(path));
			expect(res.status).not.toBe(307);
		}
	});

	it("redirects unauthenticated users on protected routes", () => {
		const protectedPaths = [
			"/dashboard",
			"/dashboard/watchlists",
			"/dashboard/alerts",
			"/dashboard/api",
		];

		for (const path of protectedPaths) {
			const res = middleware(createRequest(path));
			expect(res.status).toBe(307);
			const location = res.headers.get("location");
			expect(location).toContain("/auth/login");
			expect(location).toContain(`callbackUrl=${encodeURIComponent(path)}`);
		}
	});

	it("allows authenticated users on protected routes", () => {
		const res = middleware(createRequest("/dashboard", true));
		expect(res.status).not.toBe(307);
	});

	it("includes callbackUrl in redirect", () => {
		const res = middleware(createRequest("/dashboard/watchlists"));
		const location = res.headers.get("location")!;
		expect(location).toContain("callbackUrl=%2Fdashboard%2Fwatchlists");
	});
});
