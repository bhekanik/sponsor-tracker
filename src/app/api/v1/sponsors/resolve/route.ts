import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { validateApiRequest } from "@/lib/api/auth-middleware";

const resolveSchema = z.object({
	names: z.array(z.string().min(1)).min(1).max(500),
});

export async function POST(request: Request) {
	const { user, response } = await validateApiRequest(request);
	if (response) return response;

	// Bulk endpoints require business plan
	if (user!.plan !== "business" && user!.plan !== "pro") {
		return NextResponse.json(
			{ error: "Bulk resolve requires Pro or Business plan" },
			{ status: 403 },
		);
	}

	const body = await request.json();
	const parsed = resolveSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	const results = await Promise.all(
		parsed.data.names.map(async (name) => {
			const matches = await db
				.select()
				.from(sponsors)
				.where(
					sql`similarity(${sponsors.canonicalName}, ${name.toLowerCase()}) > 0.3`,
				)
				.orderBy(
					sql`similarity(${sponsors.canonicalName}, ${name.toLowerCase()}) DESC`,
				)
				.limit(3);

			return { query: name, matches };
		}),
	);

	return NextResponse.json({ data: results });
}
