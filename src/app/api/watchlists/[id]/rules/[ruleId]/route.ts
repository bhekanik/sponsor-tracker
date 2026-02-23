import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { watchlistRules, watchlists } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string; ruleId: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id, ruleId } = await params;

	// Verify watchlist ownership
	const [watchlist] = await db
		.select()
		.from(watchlists)
		.where(and(eq(watchlists.id, id), eq(watchlists.userId, session.user.id)));

	if (!watchlist) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const [deleted] = await db
		.delete(watchlistRules)
		.where(
			and(eq(watchlistRules.id, ruleId), eq(watchlistRules.watchlistId, id)),
		)
		.returning();

	if (!deleted) {
		return NextResponse.json({ error: "Rule not found" }, { status: 404 });
	}

	return NextResponse.json({ success: true });
}
