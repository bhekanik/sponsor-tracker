"use client";

import type { Table as TanstackTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface DataTableProps<TData> {
	table: TanstackTable<TData>;
	onRowClick?: (row: TData) => void;
	isLoading?: boolean;
}

export function DataTable<TData>({
	table,
	onRowClick,
	isLoading,
}: DataTableProps<TData>) {
	if (isLoading) {
		return (
			<table className="w-full">
				<thead>
					<tr>
						{Array.from({ length: 5 }).map((_, i) => (
							<th
								key={`skel-h-${i}`}
								className="sticky top-0 z-10 bg-surface border-b border-border px-4 py-3"
							>
								<div className="h-4 w-20 animate-pulse rounded bg-surface-raised" />
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: 10 }).map((_, i) => (
						<tr key={`skel-r-${i}`}>
							{Array.from({ length: 5 }).map((_, j) => (
								<td
									key={`skel-c-${i}-${j}`}
									className="border-b border-border px-4 py-3"
								>
									<div className="h-4 w-full animate-pulse rounded bg-surface-raised" />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		);
	}

	if (table.getRowModel().rows.length === 0) {
		return (
			<div className="flex items-center justify-center py-16 text-sm text-text-muted">
				No results found.
			</div>
		);
	}

	return (
		<table className="w-full">
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							const meta = header.column.columnDef.meta as
								| { className?: string }
								| undefined;
							return (
								<th
									key={header.id}
									className={`sticky top-0 z-10 bg-surface border-b border-border px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted ${meta?.className ?? ""}`}
									style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
								>
									{header.isPlaceholder ? null : header.column.getCanSort() ? (
										<button
											type="button"
											className="inline-flex items-center gap-1 hover:text-text-primary transition-colors"
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
											<SortIcon direction={header.column.getIsSorted()} />
										</button>
									) : (
										flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)
									)}
								</th>
							);
						})}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr
						key={row.id}
						className={`border-b border-border transition-colors hover:bg-surface-raised ${onRowClick ? "cursor-pointer" : ""}`}
						onClick={() => onRowClick?.(row.original)}
					>
						{row.getVisibleCells().map((cell) => {
							const meta = cell.column.columnDef.meta as
								| { className?: string }
								| undefined;
							return (
								<td
									key={cell.id}
									className={`px-4 py-3 text-sm text-text-primary ${meta?.className ?? ""}`}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
	if (direction === "asc") return <ArrowUp className="h-3.5 w-3.5" />;
	if (direction === "desc") return <ArrowDown className="h-3.5 w-3.5" />;
	return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
}
