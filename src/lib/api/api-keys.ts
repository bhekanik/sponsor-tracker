import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

const API_KEY_PREFIX = "st_";

export function generateApiKey(): string {
	return `${API_KEY_PREFIX}${randomBytes(24).toString("hex")}`;
}

export async function createApiKey(userId: string): Promise<string> {
	const key = generateApiKey();
	await db.update(users).set({ apiKey: key }).where(eq(users.id, userId));
	return key;
}

export async function revokeApiKey(userId: string): Promise<void> {
	await db.update(users).set({ apiKey: null }).where(eq(users.id, userId));
}

export async function getUserByApiKey(apiKey: string) {
	const [user] = await db.select().from(users).where(eq(users.apiKey, apiKey));
	return user ?? null;
}
