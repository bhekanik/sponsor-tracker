import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	name: text("name").notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	plan: text("plan").notNull().default("free"),
	stripeCustomerId: text("stripe_customer_id"),
	stripeSubscriptionId: text("stripe_subscription_id"),
	apiKey: text("api_key").unique(),
	apiRequestsToday: integer("api_requests_today").notNull().default(0),
	apiRequestsResetAt: timestamp("api_requests_reset_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
