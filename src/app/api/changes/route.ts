import { and, eq, gte, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { changes, changesets, sponsors } from "@/db/schema";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const since = searchParams.get("since");
	const type = searchParams.get("type");
	const limit = Math.min(Number(searchParams.get("limit") ?? "50"), 200);

	const conditions = [];
	if (since) {
		conditions.push(gte(changesets.createdAt, new Date(since)));
	}
	if (type) {
		conditions.push(eq(changes.changeType, type));
	}

	const rows = await db
		.select({
			id: changes.id,
			changeType: changes.changeType,
			field: changes.field,
			oldValue: changes.oldValue,
			newValue: changes.newValue,
			sponsorId: sponsors.id,
			sponsorName: sponsors.canonicalName,
			town: sponsors.town,
			changesetId: changesets.id,
			createdAt: changesets.createdAt,
		})
		.from(changes)
		.innerJoin(changesets, eq(changes.changesetId, changesets.id))
		.innerJoin(sponsors, eq(changes.sponsorId, sponsors.id))
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(sql`${changesets.createdAt} DESC`)
		.limit(limit);

	return NextResponse.json(rows);
}
