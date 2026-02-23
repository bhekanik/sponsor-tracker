import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { sourceFetches } from "./source-fetches";
import { sponsors } from "./sponsors";

export const changesets = pgTable("changesets", {
	id: uuid("id").primaryKey().defaultRandom(),
	fetchId: uuid("fetch_id")
		.notNull()
		.references(() => sourceFetches.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	addedCount: integer("added_count").notNull().default(0),
	removedCount: integer("removed_count").notNull().default(0),
	updatedCount: integer("updated_count").notNull().default(0),
	summary: text("summary"),
});

export const changes = pgTable(
	"changes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		changesetId: uuid("changeset_id")
			.notNull()
			.references(() => changesets.id),
		sponsorId: uuid("sponsor_id")
			.notNull()
			.references(() => sponsors.id),
		changeType: text("change_type").notNull(),
		field: text("field"),
		oldValue: text("old_value"),
		newValue: text("new_value"),
	},
	(table) => [
		index("changes_changeset_idx").on(table.changesetId),
		index("changes_sponsor_idx").on(table.sponsorId),
	],
);
