import { eq } from "drizzle-orm";
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
import { instantAlertHtml } from "@/lib/email-templates";
import { matchesRule, type SponsorData } from "./rule-matcher";

interface ChangeWithSponsor {
	changeType: string;
	field: string | null;
	oldValue: string | null;
	newValue: string | null;
	sponsor: SponsorData & { id: string };
}

/**
 * Process a changeset: match rules, queue notifications, send instant alerts.
 */
export async function processChangesetNotifications(changesetId: string) {
	// 1. Get all changes in this changeset with sponsor data
	const changeRows = await db
		.select({
			changeType: changes.changeType,
			field: changes.field,
			oldValue: changes.oldValue,
			newValue: changes.newValue,
			sponsorId: sponsors.id,
			canonicalName: sponsors.canonicalName,
			town: sponsors.town,
			routes: sponsors.routes,
		})
		.from(changes)
		.innerJoin(sponsors, eq(changes.sponsorId, sponsors.id))
		.where(eq(changes.changesetId, changesetId));

	if (changeRows.length === 0) return;

	const changesWithSponsors: ChangeWithSponsor[] = changeRows.map((r) => ({
		changeType: r.changeType,
		field: r.field,
		oldValue: r.oldValue,
		newValue: r.newValue,
		sponsor: {
			id: r.sponsorId,
			canonicalName: r.canonicalName,
			town: r.town,
			routes: r.routes,
		},
	}));

	// 2. Get all watchlists with their rules and notification configs
	const allWatchlists = await db.select().from(watchlists);

	for (const wl of allWatchlists) {
		const rules = await db
			.select()
			.from(watchlistRules)
			.where(eq(watchlistRules.watchlistId, wl.id));

		if (rules.length === 0) continue;

		// 3. Find changes that match any rule in this watchlist
		const matchedChanges = changesWithSponsors.filter((change) =>
			rules.some((rule) => matchesRule(change.sponsor, rule)),
		);

		if (matchedChanges.length === 0) continue;

		// 4. Get notification configs for this watchlist
		const notifConfigs = await db
			.select()
			.from(notifications)
			.where(eq(notifications.watchlistId, wl.id));

		for (const config of notifConfigs) {
			if (!config.enabled) continue;

			if (config.frequency === "instant" && config.channel === "email") {
				const html = instantAlertHtml(
					wl.name,
					matchedChanges.map((c) => ({
						sponsorName: c.sponsor.canonicalName,
						changeType: c.changeType,
						field: c.field,
						oldValue: c.oldValue,
						newValue: c.newValue,
					})),
				);

				const result = await sendEmail({
					to: config.destination,
					subject: `SponsorTracker: ${matchedChanges.length} change${matchedChanges.length > 1 ? "s" : ""} in "${wl.name}"`,
					html,
				});

				await db.insert(deliveries).values({
					notificationId: config.id,
					changesetId,
					status: result.success ? "sent" : "failed",
					error: result.error ?? null,
				});
			} else if (config.frequency === "digest") {
				// For digest, just record as pending — the digest job picks these up
				await db.insert(deliveries).values({
					notificationId: config.id,
					changesetId,
					status: "pending",
				});
			}
		}
	}
}
