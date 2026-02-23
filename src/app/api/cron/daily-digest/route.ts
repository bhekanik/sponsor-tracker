import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
	changes,
	deliveries,
	notifications,
	sponsors,
	watchlistRules,
	watchlists,
} from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { dailyDigestHtml } from "@/lib/email-templates";
import { matchesRule } from "@/lib/ingestion/rule-matcher";

export async function GET(request: Request) {
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// Find all pending digest deliveries
		const pendingDeliveries = await db
			.select()
			.from(deliveries)
			.innerJoin(notifications, eq(deliveries.notificationId, notifications.id))
			.where(
				and(
					eq(deliveries.status, "pending"),
					eq(notifications.frequency, "digest"),
				),
			);

		if (pendingDeliveries.length === 0) {
			return NextResponse.json({ status: "no_pending", sent: 0 });
		}

		// Group by user/notification
		const grouped = new Map<
			string,
			{
				notification: (typeof pendingDeliveries)[0]["notifications"];
				deliveryIds: string[];
				changesetIds: string[];
			}
		>();

		for (const row of pendingDeliveries) {
			const key = row.notifications.id;
			if (!grouped.has(key)) {
				grouped.set(key, {
					notification: row.notifications,
					deliveryIds: [],
					changesetIds: [],
				});
			}
			const entry = grouped.get(key)!;
			entry.deliveryIds.push(row.deliveries.id);
			entry.changesetIds.push(row.deliveries.changesetId);
		}

		let sent = 0;

		for (const [, group] of grouped) {
			const notif = group.notification;

			// Get watchlist and rules
			if (!notif.watchlistId) continue;
			const [wl] = await db
				.select()
				.from(watchlists)
				.where(eq(watchlists.id, notif.watchlistId));
			if (!wl) continue;

			const rules = await db
				.select()
				.from(watchlistRules)
				.where(eq(watchlistRules.watchlistId, wl.id));

			// Get changes from all pending changesets
			const allChanges = [];
			for (const csId of [...new Set(group.changesetIds)]) {
				const changeRows = await db
					.select({
						changeType: changes.changeType,
						field: changes.field,
						oldValue: changes.oldValue,
						newValue: changes.newValue,
						sponsorName: sponsors.canonicalName,
						town: sponsors.town,
						routes: sponsors.routes,
					})
					.from(changes)
					.innerJoin(sponsors, eq(changes.sponsorId, sponsors.id))
					.where(eq(changes.changesetId, csId));

				// Filter to matching changes
				const matched = changeRows.filter((c) =>
					rules.some((r) =>
						matchesRule(
							{
								canonicalName: c.sponsorName,
								town: c.town,
								routes: c.routes,
							},
							r,
						),
					),
				);
				allChanges.push(...matched);
			}

			if (allChanges.length === 0) {
				// Mark as sent (nothing to report)
				for (const dId of group.deliveryIds) {
					await db
						.update(deliveries)
						.set({ status: "sent" })
						.where(eq(deliveries.id, dId));
				}
				continue;
			}

			const html = dailyDigestHtml([
				{
					watchlistName: wl.name,
					items: allChanges.map((c) => ({
						sponsorName: c.sponsorName,
						changeType: c.changeType,
						field: c.field,
						oldValue: c.oldValue,
						newValue: c.newValue,
					})),
				},
			]);

			const result = await sendEmail({
				to: notif.destination,
				subject: `SponsorTracker Daily Digest: ${allChanges.length} changes in "${wl.name}"`,
				html,
			});

			const status = result.success ? "sent" : "failed";
			for (const dId of group.deliveryIds) {
				await db
					.update(deliveries)
					.set({ status, error: result.error ?? null })
					.where(eq(deliveries.id, dId));
			}

			if (result.success) sent++;
		}

		return NextResponse.json({ status: "ok", sent });
	} catch (error) {
		console.error("[Cron/Digest] Error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
