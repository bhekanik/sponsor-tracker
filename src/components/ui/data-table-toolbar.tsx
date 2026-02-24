"use client";

import type { Table } from "@tanstack/react-table";
import { LayoutGrid, Table2 } from "lucide-react";
import { useRef, useState } from "react";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	total: number;
	view: "table" | "card";
	onViewChange: (view: "table" | "card") => void;
}

export function DataTableToolbar<TData>({
	table,
	total,
	view,
	onViewChange,
}: DataTableToolbarProps<TData>) {
	const [columnsOpen, setColumnsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const hideableColumns = table
		.getAllColumns()
		.filter((col) => col.getCanHide());

	return (
		<div className="flex items-center justify-between px-1 py-2">
			<p className="text-sm text-text-muted">
				{total.toLocaleString()} result{total !== 1 ? "s" : ""}
			</p>

			<div className="flex items-center gap-2">
				{/* Column visibility */}
				{hideableColumns.length > 0 && view === "table" && (
					<div className="relative" ref={dropdownRef}>
						<button
							type="button"
							onClick={() => setColumnsOpen(!columnsOpen)}
							className="rounded-md border border-border px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-raised"
						>
							Columns
						</button>
						{columnsOpen && (
							<>
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: click-away handler */}
								<div
									className="fixed inset-0 z-20"
									onClick={() => setColumnsOpen(false)}
								/>
								<div className="absolute right-0 top-full z-30 mt-1 min-w-[160px] rounded-lg border border-border bg-surface p-2 shadow-lg">
									{hideableColumns.map((col) => (
										<label
											key={col.id}
											className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-text-primary hover:bg-surface-raised cursor-pointer"
										>
											<input
												type="checkbox"
												checked={col.getIsVisible()}
												onChange={col.getToggleVisibilityHandler()}
												className="rounded border-border"
											/>
											{typeof col.columnDef.header === "string"
												? col.columnDef.header
												: col.id}
										</label>
									))}
								</div>
							</>
						)}
					</div>
				)}

				{/* View toggle */}
				<div className="inline-flex rounded-lg border border-border p-0.5">
					<button
						type="button"
						onClick={() => onViewChange("table")}
						className={`rounded-md p-1.5 transition-colors ${
							view === "table"
								? "bg-surface-raised text-text-primary"
								: "text-text-muted hover:text-text-primary"
						}`}
						aria-label="Table view"
					>
						<Table2 className="h-4 w-4" />
					</button>
					<button
						type="button"
						onClick={() => onViewChange("card")}
						className={`rounded-md p-1.5 transition-colors ${
							view === "card"
								? "bg-surface-raised text-text-primary"
								: "text-text-muted hover:text-text-primary"
						}`}
						aria-label="Card view"
					>
						<LayoutGrid className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
