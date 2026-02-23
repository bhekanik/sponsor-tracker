import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { auth } from "@/lib/auth";

const updateSchema = z.object({
	enabled: z.boolean().optional(),
	frequency: z.enum(["instant", "digest"]).optional(),
	destination: z.string().min(1).optional(),
});

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
		.update(notifications)
		.set(parsed.data)
		.where(
			and(eq(notifications.id, id), eq(notifications.userId, session.user.id)),
		)
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
	const [deleted] = await db
		.delete(notifications)
		.where(
			and(eq(notifications.id, id), eq(notifications.userId, session.user.id)),
		)
		.returning();

	if (!deleted) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json({ success: true });
}
