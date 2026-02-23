import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { changes, changesets } from "@/db/schema";
import { validateApiRequest } from "@/lib/api/auth-middleware";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { response } = await validateApiRequest(request);
	if (response) return response;

	const { id } = await params;
	const rows = await db
		.select({
			changeType: changes.changeType,
			field: changes.field,
			oldValue: changes.oldValue,
			newValue: changes.newValue,
			createdAt: changesets.createdAt,
		})
		.from(changes)
		.innerJoin(changesets, eq(changes.changesetId, changesets.id))
		.where(eq(changes.sponsorId, id));

	return NextResponse.json(rows);
}
