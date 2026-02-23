import { NextResponse } from "next/server";
import { getUserByApiKey } from "./api-keys";
import { checkRateLimit } from "./rate-limiter";

interface ApiUser {
	id: string;
	plan: string;
}

interface AuthResult {
	user: ApiUser | null;
	response: NextResponse | null;
}

/**
 * Validate API key from Authorization header, enforce rate limits.
 * Returns user on success or an error NextResponse on failure.
 */
export async function validateApiRequest(
	request: Request,
): Promise<AuthResult> {
	const authHeader = request.headers.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return {
			user: null,
			response: NextResponse.json(
				{
					error:
						"Missing or invalid Authorization header. Use: Bearer <api_key>",
				},
				{ status: 401 },
			),
		};
	}

	const apiKey = authHeader.slice(7);
	const user = await getUserByApiKey(apiKey);

	if (!user) {
		return {
			user: null,
			response: NextResponse.json(
				{ error: "Invalid API key" },
				{ status: 401 },
			),
		};
	}

	const rateLimit = await checkRateLimit(user.id, user.plan);
	if (!rateLimit.allowed) {
		return {
			user: null,
			response: NextResponse.json(
				{
					error: "Rate limit exceeded",
					limit: rateLimit.limit,
					resetAt: rateLimit.resetAt,
				},
				{
					status: 429,
					headers: {
						"X-RateLimit-Limit": String(rateLimit.limit),
						"X-RateLimit-Remaining": "0",
						"X-RateLimit-Reset": rateLimit.resetAt.toISOString(),
					},
				},
			),
		};
	}

	return {
		user: { id: user.id, plan: user.plan },
		response: null,
	};
}
