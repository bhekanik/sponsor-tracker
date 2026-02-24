"use client";

import {
	type ColumnDef,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { formatSponsorName, formatTown } from "@/lib/format";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { SponsorCard } from "./sponsor-card";

interface Sponsor {
	id: string;
	canonicalName: string;
	town: string | null;
	county: string | null;
	rating: string | null;
	routes: string[] | null;
	status: string;
	lastSeenAt: string | null;
	firstSeenAt: string | null;
}

interface SearchResponse {
	data: Sponsor[];
	total: number;
	page: number;
	pageSize: number;
}

const columns: ColumnDef<Sponsor>[] = [
	{
		accessorKey: "canonicalName",
		header: "Organisation",
		enableHiding: false,
		cell: ({ row }) => (
			<Link
				href={`/sponsor/${row.original.id}`}
				className="font-medium text-text-primary hover:text-primary transition-colors"
				onClick={(e) => e.stopPropagation()}
			>
				{formatSponsorName(row.getValue("canonicalName"))}
			</Link>
		),
	},
	{
		accessorKey: "town",
		header: "Town",
		meta: { className: "hidden lg:table-cell" },
		cell: ({ getValue }) => {
			const town = getValue<string | null>();
			return town ? formatTown(town) : "\u2014";
		},
	},
	{
		accessorKey: "county",
		header: "County",
		meta: { className: "hidden xl:table-cell" },
		cell: ({ getValue }) => {
			const county = getValue<string | null>();
			return county ? formatTown(county) : "\u2014";
		},
	},
	{
		accessorKey: "rating",
		header: "Rating",
		enableHiding: false,
		cell: ({ getValue }) => {
			const rating = getValue<string | null>();
			if (!rating) return "\u2014";
			const variant = rating.includes("A") ? "info" : "warning";
			return <Badge variant={variant}>{rating}</Badge>;
		},
	},
	{
		accessorKey: "routes",
		header: "Routes",
		enableSorting: false,
		meta: { className: "hidden lg:table-cell" },
		cell: ({ getValue }) => {
			const routes = getValue<string[] | null>();
			if (!routes?.length) return "\u2014";
			const display = routes.slice(0, 2);
			const remaining = routes.length - 2;
			return (
				<div className="flex flex-wrap gap-1">
					{display.map((r) => (
						<span
							key={r}
							className="rounded-full bg-primary-subtle px-2 py-0.5 text-xs text-primary"
						>
							{r}
						</span>
					))}
					{remaining > 0 && (
						<span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs text-text-muted">
							+{remaining}
						</span>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		enableHiding: false,
		cell: ({ getValue }) => {
			const status = getValue<string>();
			const variant = status === "active" ? "success" : "danger";
			return <Badge variant={variant}>{status}</Badge>;
		},
	},
	{
		accessorKey: "lastSeenAt",
		header: "Last Seen",
		meta: { className: "hidden md:table-cell" },
		cell: ({ getValue }) => {
			const date = getValue<string | null>();
			if (!date) return "\u2014";
			return relativeDate(new Date(date));
		},
	},
];

function relativeDate(date: Date): string {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const days = Math.floor(diff / 86400000);
	if (days === 0) return "Today";
	if (days === 1) return "Yesterday";
	if (days < 30) return `${days}d ago`;
	if (days < 365) return `${Math.floor(days / 30)}mo ago`;
	return date.toLocaleDateString();
}

export function SearchResults() {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 767px)");

	const [params, setParams] = useQueryStates({
		q: parseAsString.withDefault(""),
		page: parseAsInteger.withDefault(1),
		pageSize: parseAsInteger.withDefault(20),
		view: parseAsStringLiteral(["table", "card"] as const).withDefault("table"),
		rating: parseAsString,
		route: parseAsString,
		town: parseAsString,
		status: parseAsString,
	});

	const effectiveView = isMobile ? "card" : params.view;

	const { data, isLoading } = useQuery<SearchResponse>({
		queryKey: ["search", params],
		queryFn: async () => {
			const sp = new URLSearchParams();
			if (params.q) sp.set("q", params.q);
			if (params.town) sp.set("town", params.town);
			if (params.route) sp.set("route", params.route);
			if (params.rating) sp.set("rating", params.rating);
			if (params.status) sp.set("status", params.status);
			sp.set("page", String(params.page));
			sp.set("limit", String(params.pageSize));

			const res = await fetch(`/api/search?${sp.toString()}`);
			if (!res.ok) throw new Error("Search failed");
			return res.json();
		},
		placeholderData: keepPreviousData,
	});

	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data: data?.data ?? [],
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		manualPagination: true,
		pageCount: data ? Math.ceil(data.total / params.pageSize) : -1,
	});

	const total = data?.total ?? 0;

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<DataTableToolbar
				table={table}
				total={total}
				view={effectiveView}
				onViewChange={(v) => setParams({ view: v })}
			/>

			<div className="flex-1 overflow-y-auto">
				{effectiveView === "table" ? (
					<DataTable
						table={table}
						isLoading={isLoading}
						onRowClick={(row) => router.push(`/sponsor/${row.id}`)}
					/>
				) : (
					<CardGrid
						sponsors={data?.data ?? []}
						isLoading={isLoading}
						query={params.q}
					/>
				)}
			</div>

			<div className="shrink-0">
				<DataTablePagination
					page={params.page}
					pageSize={params.pageSize}
					total={total}
					onPageChange={(p) => setParams({ page: p })}
					onPageSizeChange={(s) => setParams({ pageSize: s, page: 1 })}
				/>
			</div>
		</div>
	);
}

function CardGrid({
	sponsors,
	isLoading,
	query,
}: {
	sponsors: Sponsor[];
	isLoading: boolean;
	query: string;
}) {
	if (isLoading) {
		return (
			<div className="grid gap-3 p-1 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={`skel-${i}`}
						className="h-32 animate-pulse rounded-xl bg-surface-raised"
					/>
				))}
			</div>
		);
	}

	if (sponsors.length === 0) {
		return (
			<div className="flex items-center justify-center py-16 text-sm text-text-muted">
				{query ? `No sponsors found matching "${query}"` : "No sponsors found"}
			</div>
		);
	}

	return (
		<div className="grid gap-3 p-1 sm:grid-cols-2 lg:grid-cols-3">
			{sponsors.map((sponsor) => (
				<SponsorCard key={sponsor.id} {...sponsor} />
			))}
		</div>
	);
}
