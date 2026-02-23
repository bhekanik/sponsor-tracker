import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "../page";

describe("HomePage", () => {
	it("renders the heading", () => {
		render(<HomePage />);
		expect(
			screen.getByText("Track UK Visa Sponsor Changes — Instantly"),
		).toBeInTheDocument();
	});

	it("renders the search placeholder", () => {
		render(<HomePage />);
		expect(
			screen.getByPlaceholderText("Search 90,000+ licensed sponsors..."),
		).toBeInTheDocument();
	});

	it("renders navigation links", () => {
		render(<HomePage />);
		expect(screen.getByText("What changed today?")).toBeInTheDocument();
		expect(screen.getByText("Set up alerts →")).toBeInTheDocument();
	});
});
