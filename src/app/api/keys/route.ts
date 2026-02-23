import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createApiKey, revokeApiKey } from "@/lib/api/api-keys";
import { auth } from "@/lib/auth";

export async function GET() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const [user] = await db
		.select({ apiKey: users.apiKey })
		.from(users)
		.where(eq(users.id, session.user.id));

	return NextResponse.json({ apiKey: user?.apiKey ?? null });
}

export async function POST() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const key = await createApiKey(session.user.id);
	return NextResponse.json({ apiKey: key }, { status: 201 });
}

export async function DELETE() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await revokeApiKey(session.user.id);
	return NextResponse.json({ success: true });
}
