import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sourceFetches = pgTable("source_fetches", {
	id: uuid("id").primaryKey().defaultRandom(),
	fetchedAt: timestamp("fetched_at").notNull().defaultNow(),
	etag: text("etag"),
	lastModified: text("last_modified"),
	contentHash: text("content_hash").notNull(),
	rowCount: integer("row_count").notNull(),
	fileSize: integer("file_size"),
	csvUrl: text("csv_url"),
});
