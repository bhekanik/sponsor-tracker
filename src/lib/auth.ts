import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
			user: schema.users,
			session: schema.sessions,
			account: schema.accounts,
			verification: schema.verifications,
		},
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			plan: {
				type: "string",
				required: false,
				defaultValue: "free",
				input: false,
			},
			stripeCustomerId: {
				type: "string",
				required: false,
				input: false,
			},
			stripeSubscriptionId: {
				type: "string",
				required: false,
				input: false,
			},
			apiKey: {
				type: "string",
				required: false,
				input: false,
			},
			apiRequestsToday: {
				type: "number",
				required: false,
				defaultValue: 0,
				input: false,
			},
			apiRequestsResetAt: {
				type: "date",
				required: false,
				input: false,
			},
		},
	},
	plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
