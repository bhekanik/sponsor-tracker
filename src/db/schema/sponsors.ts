import { sql } from "drizzle-orm";
import {
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { sourceFetches } from "./source-fetches";

export const sponsors = pgTable(
	"sponsors",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		canonicalName: text("canonical_name").notNull(),
		town: text("town"),
		county: text("county"),
		sponsorType: text("sponsor_type"),
		rating: text("rating"),
		routes: text("routes").array(),
		status: text("status").notNull().default("active"),
		firstSeenFetchId: uuid("first_seen_fetch_id").references(
			() => sourceFetches.id,
		),
		lastSeenFetchId: uuid("last_seen_fetch_id").references(
			() => sourceFetches.id,
		),
		firstSeenAt: timestamp("first_seen_at"),
		lastSeenAt: timestamp("last_seen_at"),
		removedAt: timestamp("removed_at"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		index("sponsors_name_idx").on(table.canonicalName),
		index("sponsors_town_idx").on(table.town),
		index("sponsors_status_idx").on(table.status),
		index("sponsors_name_trgm_idx").using(
			"gin",
			sql`${table.canonicalName} gin_trgm_ops`,
		),
	],
);

export const sponsorAliases = pgTable("sponsor_aliases", {
	id: uuid("id").primaryKey().defaultRandom(),
	sponsorId: uuid("sponsor_id")
		.notNull()
		.references(() => sponsors.id),
	alias: text("alias").notNull(),
	source: text("source").notNull().default("auto"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sponsorSnapshots = pgTable(
	"sponsor_snapshots",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		fetchId: uuid("fetch_id")
			.notNull()
			.references(() => sourceFetches.id),
		sponsorId: uuid("sponsor_id")
			.notNull()
			.references(() => sponsors.id),
		rawRow: jsonb("raw_row").notNull(),
		normalizedName: text("normalized_name").notNull(),
	},
	(table) => [
		uniqueIndex("snapshots_fetch_sponsor_idx").on(
			table.fetchId,
			table.sponsorId,
		),
	],
);
