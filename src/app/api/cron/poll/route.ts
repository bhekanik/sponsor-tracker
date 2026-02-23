import { NextResponse } from "next/server";
import { ingest } from "@/lib/ingestion/ingest";
import { processChangesetNotifications } from "@/lib/ingestion/notification-pipeline";

export async function GET(request: Request) {
	// Verify cron secret
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const result = await ingest();

		if (result.status === "no_change") {
			return NextResponse.json({
				status: "no_change",
				message: "CSV unchanged, skipped processing",
			});
		}

		// Trigger notifications if there were changes
		if (result.changesetId) {
			await processChangesetNotifications(result.changesetId);
		}

		return NextResponse.json({
			status: result.status,
			fetchId: result.fetchId,
			changesetId: result.changesetId,
			rowCount: result.rowCount,
			added: result.diff?.added.length ?? 0,
			removed: result.diff?.removed.length ?? 0,
			updated: result.diff?.updated.length ?? 0,
		});
	} catch (error) {
		console.error("[Cron/Poll] Error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
