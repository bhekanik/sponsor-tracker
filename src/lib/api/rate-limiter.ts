import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

const PLAN_LIMITS: Record<string, number> = {
	free: 100,
	pro: 1000,
	business: 10000,
};

interface RateLimitResult {
	allowed: boolean;
	limit: number;
	remaining: number;
	resetAt: Date;
}

export async function checkRateLimit(
	userId: string,
	plan: string,
): Promise<RateLimitResult> {
	const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

	const [user] = await db
		.select({
			apiRequestsToday: users.apiRequestsToday,
			apiRequestsResetAt: users.apiRequestsResetAt,
		})
		.from(users)
		.where(eq(users.id, userId));

	if (!user)
		return { allowed: false, limit, remaining: 0, resetAt: new Date() };

	const now = new Date();
	const resetAt = user.apiRequestsResetAt ?? new Date(0);

	// Reset counter if past the reset time
	if (now > resetAt) {
		const nextReset = new Date();
		nextReset.setUTCHours(24, 0, 0, 0); // midnight UTC

		await db
			.update(users)
			.set({
				apiRequestsToday: 1,
				apiRequestsResetAt: nextReset,
			})
			.where(eq(users.id, userId));

		return { allowed: true, limit, remaining: limit - 1, resetAt: nextReset };
	}

	const count = user.apiRequestsToday;
	if (count >= limit) {
		return { allowed: false, limit, remaining: 0, resetAt };
	}

	await db
		.update(users)
		.set({ apiRequestsToday: count + 1 })
		.where(eq(users.id, userId));

	return { allowed: true, limit, remaining: limit - count - 1, resetAt };
}
