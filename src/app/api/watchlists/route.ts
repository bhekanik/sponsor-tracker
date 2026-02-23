import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { watchlists } from "@/db/schema";
import { auth } from "@/lib/auth";

const PLAN_LIMITS: Record<string, number> = {
	free: 0,
	pro: 10,
	business: Number.POSITIVE_INFINITY,
};

const createSchema = z.object({
	name: z.string().min(1).max(100),
});

export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const rows = await db
		.select()
		.from(watchlists)
		.where(eq(watchlists.userId, session.user.id));

	return NextResponse.json(rows);
}

export async function POST(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const parsed = createSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	const plan = (session.user as { plan?: string }).plan ?? "free";
	const limit = PLAN_LIMITS[plan] ?? 0;

	const existing = await db
		.select()
		.from(watchlists)
		.where(eq(watchlists.userId, session.user.id));

	if (existing.length >= limit) {
		return NextResponse.json(
			{
				error: `Plan limit reached. ${plan} plan allows ${limit === 0 ? "no" : limit} watchlist${limit === 1 ? "" : "s"}.`,
			},
			{ status: 403 },
		);
	}

	const [row] = await db
		.insert(watchlists)
		.values({ userId: session.user.id, name: parsed.data.name })
		.returning();

	return NextResponse.json(row, { status: 201 });
}
