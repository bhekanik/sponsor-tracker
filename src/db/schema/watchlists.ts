import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const watchlists = pgTable("watchlists", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const watchlistRules = pgTable("watchlist_rules", {
	id: uuid("id").primaryKey().defaultRandom(),
	watchlistId: uuid("watchlist_id")
		.notNull()
		.references(() => watchlists.id),
	ruleType: text("rule_type").notNull(),
	value: text("value").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
