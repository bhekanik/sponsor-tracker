import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { watchlistRules, watchlists } from "@/db/schema";
import { auth } from "@/lib/auth";

const ruleSchema = z.object({
	ruleType: z.enum(["company", "keyword", "location", "route"]),
	value: z.string().min(1).max(200),
});

async function verifyOwnership(watchlistId: string, userId: string) {
	const [row] = await db
		.select()
		.from(watchlists)
		.where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)));
	return row;
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;
	const watchlist = await verifyOwnership(id, session.user.id);
	if (!watchlist) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const rules = await db
		.select()
		.from(watchlistRules)
		.where(eq(watchlistRules.watchlistId, id));

	return NextResponse.json(rules);
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;
	const watchlist = await verifyOwnership(id, session.user.id);
	if (!watchlist) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const body = await request.json();
	const parsed = ruleSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	const [rule] = await db
		.insert(watchlistRules)
		.values({
			watchlistId: id,
			ruleType: parsed.data.ruleType,
			value: parsed.data.value,
		})
		.returning();

	return NextResponse.json(rule, { status: 201 });
}
