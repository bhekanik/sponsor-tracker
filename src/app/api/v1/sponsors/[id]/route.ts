import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors } from "@/db/schema";
import { validateApiRequest } from "@/lib/api/auth-middleware";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { response } = await validateApiRequest(request);
	if (response) return response;

	const { id } = await params;
	const [sponsor] = await db.select().from(sponsors).where(eq(sponsors.id, id));

	if (!sponsor) {
		return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
	}

	return NextResponse.json(sponsor);
}
