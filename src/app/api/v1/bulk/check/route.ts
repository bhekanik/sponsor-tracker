import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { validateApiRequest } from "@/lib/api/auth-middleware";

const bulkSchema = z.object({
	names: z.array(z.string().min(1)).min(1).max(500),
});

export async function POST(request: Request) {
	const { user, response } = await validateApiRequest(request);
	if (response) return response;

	if (user!.plan !== "business") {
		return NextResponse.json(
			{ error: "Bulk check requires Business plan" },
			{ status: 403 },
		);
	}

	const body = await request.json();
	const parsed = bulkSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	const results = await Promise.all(
		parsed.data.names.map(async (name) => {
			const [match] = await db
				.select({
					id: sponsors.id,
					canonicalName: sponsors.canonicalName,
					status: sponsors.status,
					rating: sponsors.rating,
					routes: sponsors.routes,
					town: sponsors.town,
				})
				.from(sponsors)
				.where(
					sql`similarity(${sponsors.canonicalName}, ${name.toLowerCase()}) > 0.4`,
				)
				.orderBy(
					sql`similarity(${sponsors.canonicalName}, ${name.toLowerCase()}) DESC`,
				)
				.limit(1);

			return {
				query: name,
				found: !!match,
				sponsor: match ?? null,
			};
		}),
	);

	return NextResponse.json({ data: results });
}
