import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { watchlistRules, watchlists } from "@/db/schema";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
	name: z.string().min(1).max(100),
});

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;
	const [watchlist] = await db
		.select()
		.from(watchlists)
		.where(and(eq(watchlists.id, id), eq(watchlists.userId, session.user.id)));

	if (!watchlist) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const rules = await db
		.select()
		.from(watchlistRules)
		.where(eq(watchlistRules.watchlistId, id));

	return NextResponse.json({ ...watchlist, rules });
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;
	const body = await request.json();
	const parsed = updateSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	const [updated] = await db
		.update(watchlists)
		.set({ name: parsed.data.name })
		.where(and(eq(watchlists.id, id), eq(watchlists.userId, session.user.id)))
		.returning();

	if (!updated) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json(updated);
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;

	// Delete rules first (foreign key)
	await db.delete(watchlistRules).where(eq(watchlistRules.watchlistId, id));

	const [deleted] = await db
		.delete(watchlists)
		.where(and(eq(watchlists.id, id), eq(watchlists.userId, session.user.id)))
		.returning();

	if (!deleted) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json({ success: true });
}
