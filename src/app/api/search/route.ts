import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { normalizeName } from "@/lib/matching/normalize";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl;
		const q = searchParams.get("q") ?? "";
		const town = searchParams.get("town");
		const county = searchParams.get("county");
		const route = searchParams.get("route");
		const rating = searchParams.get("rating");
		const status = searchParams.get("status") ?? "active";
		const page = Math.max(1, Number(searchParams.get("page") ?? 1));
		const limit = Math.min(
			100,
			Math.max(1, Number(searchParams.get("limit") ?? 20)),
		);
		const offset = (page - 1) * limit;

		const conditions = [];

		if (status) {
			conditions.push(eq(sponsors.status, status));
		}

		if (town) {
			conditions.push(ilike(sponsors.town, `%${town}%`));
		}

		if (county) {
			conditions.push(ilike(sponsors.county, `%${county}%`));
		}

		if (rating) {
			conditions.push(ilike(sponsors.rating, `%${rating}%`));
		}

		if (route) {
			// Check if any route in the array matches
			conditions.push(
				sql`EXISTS (SELECT 1 FROM unnest(${sponsors.routes}) AS r WHERE r ILIKE ${`%${route}%`})`,
			);
		}

		// Build the query based on whether there's a search term
		if (q) {
			const normalized = normalizeName(q);

			// Use pg_trgm similarity for fuzzy matching + ILIKE for contains
			const searchCondition = or(
				ilike(sponsors.canonicalName, `%${normalized}%`),
				sql`similarity(${sponsors.canonicalName}, ${normalized}) > 0.3`,
			);
			conditions.push(searchCondition!);

			const where = conditions.length > 0 ? and(...conditions) : undefined;

			const [data, [{ total }]] = await Promise.all([
				db
					.select({
						id: sponsors.id,
						canonicalName: sponsors.canonicalName,
						town: sponsors.town,
						county: sponsors.county,
						sponsorType: sponsors.sponsorType,
						rating: sponsors.rating,
						routes: sponsors.routes,
						status: sponsors.status,
						firstSeenAt: sponsors.firstSeenAt,
						lastSeenAt: sponsors.lastSeenAt,
						similarity:
							sql<number>`similarity(${sponsors.canonicalName}, ${normalized})`.as(
								"similarity",
							),
					})
					.from(sponsors)
					.where(where)
					.orderBy(
						desc(sql`similarity(${sponsors.canonicalName}, ${normalized})`),
					)
					.limit(limit)
					.offset(offset),
				db.select({ total: count() }).from(sponsors).where(where),
			]);

			return NextResponse.json({ data, total, page, pageSize: limit });
		}

		// No search term — return all with filters
		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const [data, [{ total }]] = await Promise.all([
			db
				.select({
					id: sponsors.id,
					canonicalName: sponsors.canonicalName,
					town: sponsors.town,
					county: sponsors.county,
					sponsorType: sponsors.sponsorType,
					rating: sponsors.rating,
					routes: sponsors.routes,
					status: sponsors.status,
					firstSeenAt: sponsors.firstSeenAt,
					lastSeenAt: sponsors.lastSeenAt,
				})
				.from(sponsors)
				.where(where)
				.orderBy(sponsors.canonicalName)
				.limit(limit)
				.offset(offset),
			db.select({ total: count() }).from(sponsors).where(where),
		]);

		return NextResponse.json({ data, total, page, pageSize: limit });
	} catch (error) {
		console.error("Search failed:", error);
		return NextResponse.json({ error: "Search failed" }, { status: 500 });
	}
}
