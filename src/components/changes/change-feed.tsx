"use client";

import {
	type ColumnDef,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowRight, Minus, Plus, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { formatSponsorName, formatTown } from "@/lib/format";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

interface Change {
	id: string;
	changeType: string;
	field: string | null;
	oldValue: string | null;
	newValue: string | null;
	sponsorId: string;
	sponsorName: string;
	town: string | null;
	createdAt: string;
}

interface ChangesResponse {
	data: Change[];
	total: number;
	page: number;
	pageSize: number;
}

const TYPE_CONFIG: Record<
	string,
	{ icon: typeof Plus; label: string; color: string; border: string; variant: "success" | "danger" | "warning" }
> = {
	added: {
		icon: Plus,
		label: "Added",
		color: "text-green-600 bg-green-50 dark:bg-green-900/20",
		border: "border-l-green-500",
		variant: "success",
	},
	removed: {
		icon: Minus,
		label: "Removed",
		color: "text-red-600 bg-red-50 dark:bg-red-900/20",
		border: "border-l-red-500",
		variant: "danger",
	},
	updated: {
		icon: RefreshCw,
		label: "Updated",
		color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
		border: "border-l-amber-500",
		variant: "warning",
	},
};

const filterOptions = [
	{ value: "", label: "All" },
	{ value: "added", label: "Added" },
	{ value: "removed", label: "Removed" },
	{ value: "updated", label: "Updated" },
];

const columns: ColumnDef<Change>[] = [
	{
		accessorKey: "sponsorName",
		header: "Sponsor",
		enableHiding: false,
		cell: ({ row }) => (
			<Link
				href={`/sponsor/${row.original.sponsorId}`}
				className="font-medium text-text-primary hover:text-primary transition-colors"
			>
				{formatSponsorName(row.getValue("sponsorName"))}
			</Link>
		),
	},
	{
		accessorKey: "changeType",
		header: "Type",
		enableHiding: false,
		cell: ({ getValue }) => {
			const type = getValue<string>();
			const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.updated;
			return <Badge variant={config.variant}>{config.label}</Badge>;
		},
	},
	{
		accessorKey: "field",
		header: "Field",
		meta: { className: "hidden md:table-cell" },
		cell: ({ getValue }) => getValue<string | null>() ?? "\u2014",
	},
	{
		id: "values",
		header: "Change",
		enableSorting: false,
		meta: { className: "hidden lg:table-cell" },
		cell: ({ row }) => {
			if (!row.original.field) return "\u2014";
			return (
				<span className="text-xs">
					<span className="text-red-500">{row.original.oldValue ?? "\u2014"}</span>
					<ArrowRight className="mx-1 inline h-3 w-3 text-text-muted" />
					<span className="text-green-600">{row.original.newValue ?? "\u2014"}</span>
				</span>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ getValue }) =>
			new Date(getValue<string>()).toLocaleDateString(),
	},
];

export function ChangeFeed() {
	const isMobile = useMediaQuery("(max-width: 767px)");

	const [params, setParams] = useQueryStates({
		type: parseAsString,
		page: parseAsInteger.withDefault(1),
		pageSize: parseAsInteger.withDefault(20),
		view: parseAsStringLiteral(["table", "card"] as const).withDefault("card"),
	});

	const effectiveView = isMobile ? "card" : params.view;

	const { data, isLoading } = useQuery<ChangesResponse>({
		queryKey: ["changes", params],
		queryFn: async () => {
			const sp = new URLSearchParams();
			if (params.type) sp.set("type", params.type);
			sp.set("page", String(params.page));
			sp.set("pageSize", String(params.pageSize));
			const res = await fetch(`/api/changes?${sp.toString()}`);
			if (!res.ok) throw new Error("Failed to fetch changes");
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
			{/* Filter bar + toolbar */}
			<div className="shrink-0 space-y-2">
				<div className="flex items-center gap-3 flex-wrap">
					{/* Segmented control */}
					<div className="inline-flex rounded-lg bg-surface-raised p-1 shadow-sm">
						{filterOptions.map((opt) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => setParams({ type: opt.value || null, page: 1 })}
								className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
									(params.type ?? "") === opt.value
										? "bg-surface text-text-primary shadow-sm"
										: "text-text-secondary hover:text-text-primary"
								}`}
							>
								{opt.label}
							</button>
						))}
					</div>

					{/* Active filter chip */}
					{params.type && (
						<button
							type="button"
							onClick={() => setParams({ type: null, page: 1 })}
							className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-raised"
						>
							Type: {params.type}
							<X className="h-3 w-3" />
						</button>
					)}
				</div>

				<DataTableToolbar
					table={table}
					total={total}
					view={effectiveView}
					onViewChange={(v) => setParams({ view: v })}
				/>
			</div>

			{/* Scrollable data area */}
			<div className="flex-1 overflow-y-auto">
				{effectiveView === "table" ? (
					<DataTable table={table} isLoading={isLoading} />
				) : (
					<CardGrid changes={data?.data ?? []} isLoading={isLoading} />
				)}
			</div>

			{/* Pagination footer */}
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
	changes,
	isLoading,
}: {
	changes: Change[];
	isLoading: boolean;
}) {
	if (isLoading) {
		return (
			<div className="space-y-2 p-1">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-16 animate-pulse rounded-lg bg-surface-raised"
					/>
				))}
			</div>
		);
	}

	if (changes.length === 0) {
		return (
			<div className="flex items-center justify-center py-16 text-sm text-text-muted">
				No changes recorded yet. Changes will appear here after the next CSV poll.
			</div>
		);
	}

	return (
		<div className="space-y-2 p-1">
			{changes.map((change) => {
				const config = TYPE_CONFIG[change.changeType] ?? TYPE_CONFIG.updated;
				const Icon = config.icon;
				return (
					<div
						key={change.id}
						className={`flex items-start gap-3 rounded-lg border border-border border-l-2 ${config.border} bg-surface p-3`}
					>
						<div className={`mt-0.5 rounded-full p-1.5 ${config.color}`}>
							<Icon className="h-3.5 w-3.5" />
						</div>
						<div className="min-w-0 flex-1">
							<Link
								href={`/sponsor/${change.sponsorId}`}
								className="text-sm font-medium text-text-primary transition-colors hover:text-primary"
							>
								{formatSponsorName(change.sponsorName)}
							</Link>
							{change.town && (
								<span className="ml-2 text-xs text-text-muted">
									{formatTown(change.town)}
								</span>
							)}
							<p className="text-xs text-text-secondary">
								{config.label}
								{change.field && (
									<>
										{" \u2014 "}
										{change.field}:{" "}
										<span className="text-red-500">
											{change.oldValue ?? "\u2014"}
										</span>
										<ArrowRight className="mx-1 inline h-3 w-3" />
										<span className="text-green-600">
											{change.newValue ?? "\u2014"}
										</span>
									</>
								)}
							</p>
						</div>
						<time className="shrink-0 text-xs text-text-muted">
							{new Date(change.createdAt).toLocaleDateString()}
						</time>
					</div>
				);
			})}
		</div>
	);
}
