import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

const mockSignUp = vi.fn();
vi.mock("@/lib/auth-client", () => ({
	signUp: { email: (...args: unknown[]) => mockSignUp(...args) },
}));

import RegisterPage from "../register/page";

describe("RegisterPage", () => {
	it("renders registration form with name, email, and password fields", () => {
		render(<RegisterPage />);
		expect(screen.getByLabelText("Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Create account" }),
		).toBeInTheDocument();
	});

	it("renders link to login page", () => {
		render(<RegisterPage />);
		const link = screen.getByRole("link", { name: "Sign in" });
		expect(link).toHaveAttribute("href", "/auth/login");
	});

	it("calls signUp.email on form submit", async () => {
		mockSignUp.mockResolvedValue({ data: { user: {} } });
		const user = userEvent.setup();

		render(<RegisterPage />);

		await user.type(screen.getByLabelText("Name"), "John Doe");
		await user.type(screen.getByLabelText("Email"), "john@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Create account" }));

		expect(mockSignUp).toHaveBeenCalledWith({
			name: "John Doe",
			email: "john@example.com",
			password: "password123",
		});
	});

	it("shows error message on failed registration", async () => {
		mockSignUp.mockResolvedValue({
			error: { message: "Email already registered" },
		});
		const user = userEvent.setup();

		render(<RegisterPage />);

		await user.type(screen.getByLabelText("Name"), "John");
		await user.type(screen.getByLabelText("Email"), "john@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.click(screen.getByRole("button", { name: "Create account" }));

		expect(
			await screen.findByText("Email already registered"),
		).toBeInTheDocument();
	});
});
