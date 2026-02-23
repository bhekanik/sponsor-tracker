import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sponsors } from "@/db/schema";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const [sponsor] = await db
			.select()
			.from(sponsors)
			.where(eq(sponsors.id, id));

		if (!sponsor) {
			return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
		}

		return NextResponse.json(sponsor);
	} catch (error) {
		console.error("Failed to fetch sponsor:", error);
		return NextResponse.json(
			{ error: "Failed to fetch sponsor" },
			{ status: 500 },
		);
	}
}
