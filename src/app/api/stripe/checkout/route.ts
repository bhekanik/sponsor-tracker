import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getStripe, PLANS, type PlanId } from "@/lib/stripe";

const checkoutSchema = z.object({
	plan: z.enum(["pro", "business"]),
});

export async function POST(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const parsed = checkoutSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
	}

	const plan = PLANS[parsed.data.plan as PlanId];
	if (!plan.priceId) {
		return NextResponse.json({ error: "Plan not configured" }, { status: 400 });
	}

	// Get or create Stripe customer
	const [user] = await db
		.select({ stripeCustomerId: users.stripeCustomerId })
		.from(users)
		.where(eq(users.id, session.user.id));

	let customerId = user?.stripeCustomerId;

	if (!customerId) {
		const customer = await getStripe().customers.create({
			email: session.user.email,
			metadata: { userId: session.user.id },
		});
		customerId = customer.id;
		await db
			.update(users)
			.set({ stripeCustomerId: customerId })
			.where(eq(users.id, session.user.id));
	}

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
	const checkoutSession = await getStripe().checkout.sessions.create({
		customer: customerId,
		mode: "subscription",
		line_items: [{ price: plan.priceId, quantity: 1 }],
		success_url: `${siteUrl}/dashboard?upgraded=true`,
		cancel_url: `${siteUrl}/pricing`,
		metadata: { userId: session.user.id, plan: parsed.data.plan },
	});

	return NextResponse.json({ url: checkoutSession.url });
}
