/**
 * Email client — uses Resend in production, logs to console in dev.
 */

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
}

interface SendResult {
	success: boolean;
	id?: string;
	error?: string;
}

export async function sendEmail(
	options: SendEmailOptions,
): Promise<SendResult> {
	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey || apiKey === "re_test_key") {
		console.log("[Email] Dev mode — would send:", {
			to: options.to,
			subject: options.subject,
		});
		return { success: true, id: `dev-${Date.now()}` };
	}

	try {
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from: "SponsorTracker <alerts@interviewoptimiser.com>",
				to: options.to,
				subject: options.subject,
				html: options.html,
			}),
		});

		if (!res.ok) {
			const data = await res.json();
			return { success: false, error: data.message ?? "Send failed" };
		}

		const data = await res.json();
		return { success: true, id: data.id };
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : "Unknown error",
		};
	}
}
