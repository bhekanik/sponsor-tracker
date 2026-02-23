import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { changesets } from "./changes";
import { users } from "./users";
import { watchlists } from "./watchlists";

export const notifications = pgTable("notifications", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	watchlistId: uuid("watchlist_id").references(() => watchlists.id),
	channel: text("channel").notNull(),
	destination: text("destination").notNull(),
	frequency: text("frequency").notNull().default("instant"),
	enabled: boolean("enabled").notNull().default(true),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deliveries = pgTable("deliveries", {
	id: uuid("id").primaryKey().defaultRandom(),
	notificationId: uuid("notification_id")
		.notNull()
		.references(() => notifications.id),
	changesetId: uuid("changeset_id")
		.notNull()
		.references(() => changesets.id),
	sentAt: timestamp("sent_at").notNull().defaultNow(),
	status: text("status").notNull(),
	error: text("error"),
});
