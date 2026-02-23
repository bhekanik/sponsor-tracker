import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { changes, changesets } from "@/db/schema";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const history = await db
			.select({
				id: changes.id,
				changeType: changes.changeType,
				field: changes.field,
				oldValue: changes.oldValue,
				newValue: changes.newValue,
				changesetId: changes.changesetId,
				createdAt: changesets.createdAt,
			})
			.from(changes)
			.innerJoin(changesets, eq(changes.changesetId, changesets.id))
			.where(eq(changes.sponsorId, id))
			.orderBy(desc(changesets.createdAt))
			.limit(100);

		return NextResponse.json(history);
	} catch (error) {
		console.error("Failed to fetch sponsor history:", error);
		return NextResponse.json(
			{ error: "Failed to fetch history" },
			{ status: 500 },
		);
	}
}
