import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { changes, changesets, sponsors } from "@/db/schema";
import { validateApiRequest } from "@/lib/api/auth-middleware";

export async function GET(request: Request) {
	const { response } = await validateApiRequest(request);
	if (response) return response;

	// Get the most recent changeset
	const [latestChangeset] = await db
		.select()
		.from(changesets)
		.orderBy(sql`${changesets.createdAt} DESC`)
		.limit(1);

	if (!latestChangeset) {
		return NextResponse.json({ data: [], changeset: null });
	}

	const rows = await db
		.select({
			changeType: changes.changeType,
			field: changes.field,
			oldValue: changes.oldValue,
			newValue: changes.newValue,
			sponsorId: sponsors.id,
			sponsorName: sponsors.canonicalName,
			town: sponsors.town,
		})
		.from(changes)
		.innerJoin(sponsors, eq(changes.sponsorId, sponsors.id))
		.where(eq(changes.changesetId, latestChangeset.id));

	return NextResponse.json({
		data: rows,
		changeset: {
			id: latestChangeset.id,
			createdAt: latestChangeset.createdAt,
			addedCount: latestChangeset.addedCount,
			removedCount: latestChangeset.removedCount,
			updatedCount: latestChangeset.updatedCount,
		},
	});
}
