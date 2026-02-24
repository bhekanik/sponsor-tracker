import { capitalCase } from "change-case";

export function formatSponsorName(name: string): string {
	return capitalCase(name);
}

export function formatTown(town: string): string {
	return capitalCase(town);
}
