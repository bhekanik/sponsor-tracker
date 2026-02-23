import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

export async function POST() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const [user] = await db
		.select({ stripeCustomerId: users.stripeCustomerId })
		.from(users)
		.where(eq(users.id, session.user.id));

	if (!user?.stripeCustomerId) {
		return NextResponse.json({ error: "No billing account" }, { status: 400 });
	}

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
	const portalSession = await getStripe().billingPortal.sessions.create({
		customer: user.stripeCustomerId,
		return_url: `${siteUrl}/dashboard`,
	});

	return NextResponse.json({ url: portalSession.url });
}
