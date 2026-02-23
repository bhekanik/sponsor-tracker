import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
	const body = await request.text();
	const sig = request.headers.get("stripe-signature");
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

	if (!sig || !webhookSecret) {
		return NextResponse.json({ error: "Missing signature" }, { status: 400 });
	}

	let event: Stripe.Event;
	try {
		event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
	} catch {
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object;
			const userId = session.metadata?.userId;
			const plan = session.metadata?.plan;
			if (userId && plan) {
				await db
					.update(users)
					.set({
						plan,
						stripeCustomerId: session.customer as string,
						stripeSubscriptionId: session.subscription as string,
					})
					.where(eq(users.id, userId));
			}
			break;
		}

		case "customer.subscription.updated": {
			const subscription = event.data.object;
			const customerId =
				typeof subscription.customer === "string"
					? subscription.customer
					: subscription.customer.id;

			if (
				subscription.status === "canceled" ||
				subscription.status === "unpaid"
			) {
				await db
					.update(users)
					.set({ plan: "free", stripeSubscriptionId: null })
					.where(eq(users.stripeCustomerId, customerId));
			}
			break;
		}

		case "customer.subscription.deleted": {
			const sub = event.data.object;
			const custId =
				typeof sub.customer === "string" ? sub.customer : sub.customer.id;

			await db
				.update(users)
				.set({ plan: "free", stripeSubscriptionId: null })
				.where(eq(users.stripeCustomerId, custId));
			break;
		}
	}

	return NextResponse.json({ received: true });
}
