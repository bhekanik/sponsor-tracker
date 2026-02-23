import { describe, expect, it } from "vitest";
import { generateApiKey } from "../api-keys";

describe("generateApiKey", () => {
	it("generates a key with st_ prefix", () => {
		const key = generateApiKey();
		expect(key).toMatch(/^st_[a-f0-9]{48}$/);
	});

	it("generates unique keys", () => {
		const key1 = generateApiKey();
		const key2 = generateApiKey();
		expect(key1).not.toBe(key2);
	});
});
