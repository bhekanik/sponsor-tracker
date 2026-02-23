import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { auth } from "@/lib/auth";

const createSchema = z.object({
	watchlistId: z.string().uuid(),
	channel: z.enum(["email"]),
	destination: z.string().min(1),
	frequency: z.enum(["instant", "digest"]).default("instant"),
});

export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const rows = await db
		.select()
		.from(notifications)
		.where(eq(notifications.userId, session.user.id));

	return NextResponse.json(rows);
}

export async function POST(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const parsed = createSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten().fieldErrors },
			{ status: 400 },
		);
	}

	const [row] = await db
		.insert(notifications)
		.values({
			userId: session.user.id,
			watchlistId: parsed.data.watchlistId,
			channel: parsed.data.channel,
			destination: parsed.data.destination,
			frequency: parsed.data.frequency,
		})
		.returning();

	return NextResponse.json(row, { status: 201 });
}
