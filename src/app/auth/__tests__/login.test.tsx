import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
	useSearchParams: () => new URLSearchParams(),
}));

const mockSignIn = vi.fn();
vi.mock("@/lib/auth-client", () => ({
	signIn: { email: (...args: unknown[]) => mockSignIn(...args) },
}));

import LoginPage from "../login/page";

describe("LoginPage", () => {
	it("renders login form with email and password fields", () => {
		render(<LoginPage />);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
	});

	it("renders link to register page", () => {
		render(<LoginPage />);
		const link = screen.getByRole("link", { name: "Create one" });
		expect(link).toHaveAttribute("href", "/auth/register");
	});

	it("calls signIn.email on form submit", async () => {
		mockSignIn.mockResolvedValue({ data: { session: {} } });
		const user = userEvent.setup();

		render(<LoginPage />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Sign in" }));

		expect(mockSignIn).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password123",
		});
	});

	it("shows error message on failed sign in", async () => {
		mockSignIn.mockResolvedValue({
			error: { message: "Invalid credentials" },
		});
		const user = userEvent.setup();

		render(<LoginPage />);

		await user.type(screen.getByLabelText("Email"), "test@example.com");
		await user.type(screen.getByLabelText("Password"), "wrong");
		await user.click(screen.getByRole("button", { name: "Sign in" }));

		expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
	});
});
