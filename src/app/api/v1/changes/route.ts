import { and, eq, gte, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { changes, changesets, sponsors } from "@/db/schema";
import { validateApiRequest } from "@/lib/api/auth-middleware";

export async function GET(request: NextRequest) {
	const { response } = await validateApiRequest(request);
	if (response) return response;

	const { searchParams } = request.nextUrl;
	const since = searchParams.get("since");
	const limit = Math.min(Number(searchParams.get("limit") ?? "50"), 200);

	const conditions = [];
	if (since) {
		conditions.push(gte(changesets.createdAt, new Date(since)));
	}

	const rows = await db
		.select({
			changeType: changes.changeType,
			field: changes.field,
			oldValue: changes.oldValue,
			newValue: changes.newValue,
			sponsorId: sponsors.id,
			sponsorName: sponsors.canonicalName,
			town: sponsors.town,
			createdAt: changesets.createdAt,
		})
		.from(changes)
		.innerJoin(changesets, eq(changes.changesetId, changesets.id))
		.innerJoin(sponsors, eq(changes.sponsorId, sponsors.id))
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(sql`${changesets.createdAt} DESC`)
		.limit(limit);

	return NextResponse.json({ data: rows, count: rows.length });
}
