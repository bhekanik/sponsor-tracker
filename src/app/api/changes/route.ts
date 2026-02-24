import { and, count, eq, gte, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { changes, changesets, sponsors } from "@/db/schema";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const since = searchParams.get("since");
	const type = searchParams.get("type");
	const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
	const pageSize = Math.min(Math.max(1, Number(searchParams.get("pageSize") ?? "20")), 200);

	const conditions = [];
	if (since) {
		conditions.push(gte(changesets.createdAt, new Date(since)));
	}
	if (type) {
		conditions.push(eq(changes.changeType, type));
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const baseQuery = db
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
		.innerJoin(sponsors, eq(changes.sponsorId, sponsors.id));

	const countQuery = db
		.select({ total: count() })
		.from(changes)
		.innerJoin(changesets, eq(changes.changesetId, changesets.id))
		.innerJoin(sponsors, eq(changes.sponsorId, sponsors.id));

	const [rows, [{ total }]] = await Promise.all([
		baseQuery
			.where(where)
			.orderBy(sql`${changesets.createdAt} DESC`)
			.limit(pageSize)
			.offset((page - 1) * pageSize),
		countQuery.where(where),
	]);

	return NextResponse.json({ data: rows, total, page, pageSize });
}
