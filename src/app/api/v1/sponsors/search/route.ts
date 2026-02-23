import { and, eq, ilike, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { validateApiRequest } from "@/lib/api/auth-middleware";

export async function GET(request: NextRequest) {
	const { response } = await validateApiRequest(request);
	if (response) return response;

	const { searchParams } = request.nextUrl;
	const q = searchParams.get("q") ?? "";
	const town = searchParams.get("town");
	const route = searchParams.get("route");
	const rating = searchParams.get("rating");
	const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
	const offset = Number(searchParams.get("offset") ?? "0");

	const conditions = [];
	if (q) {
		conditions.push(
			sql`(similarity(${sponsors.canonicalName}, ${q}) > 0.3 OR ${sponsors.canonicalName} ILIKE ${`%${q}%`})`,
		);
	}
	if (town) conditions.push(ilike(sponsors.town, `%${town}%`));
	if (route) conditions.push(sql`${route} = ANY(${sponsors.routes})`);
	if (rating) conditions.push(eq(sponsors.rating, rating));

	const rows = await db
		.select()
		.from(sponsors)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.limit(limit)
		.offset(offset);

	return NextResponse.json({ data: rows, count: rows.length, limit, offset });
}
