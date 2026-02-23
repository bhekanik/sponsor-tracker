import { describe, expect, it, vi } from "vitest";
import { sendEmail } from "../email";

describe("sendEmail", () => {
	it("logs to console in dev mode (no API key)", async () => {
		const spy = vi.spyOn(console, "log").mockImplementation(() => {});
		const result = await sendEmail({
			to: "test@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(result.success).toBe(true);
		expect(result.id).toMatch(/^dev-/);
		expect(spy).toHaveBeenCalledWith(
			expect.stringContaining("[Email]"),
			expect.objectContaining({ to: "test@example.com" }),
		);
		spy.mockRestore();
	});
});
