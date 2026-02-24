import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomePage from "../page";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

describe("HomePage", () => {
	it("renders the heading", () => {
		render(<HomePage />);
		expect(
			screen.getByText("Track UK Visa Sponsor Changes"),
		).toBeInTheDocument();
	});

	it("renders the search placeholder", () => {
		render(<HomePage />);
		expect(
			screen.getByPlaceholderText("Search 140,000+ licensed sponsors..."),
		).toBeInTheDocument();
	});

	it("renders navigation links", () => {
		render(<HomePage />);
		expect(screen.getByText("What changed today?")).toBeInTheDocument();
		expect(screen.getByText(/Set up alerts/)).toBeInTheDocument();
	});
});
