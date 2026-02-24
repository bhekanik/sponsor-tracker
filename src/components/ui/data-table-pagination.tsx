"use client";

import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps {
	page: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export function DataTablePagination({
	page,
	pageSize,
	total,
	onPageChange,
	onPageSizeChange,
}: DataTablePaginationProps) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
	const end = Math.min(page * pageSize, total);

	const btnClass =
		"rounded-md border border-border p-1.5 text-text-secondary transition-colors hover:bg-surface-raised disabled:opacity-40 disabled:pointer-events-none";

	return (
		<div className="flex items-center justify-between border-t border-border bg-surface px-4 py-3">
			<p className="text-sm text-text-muted">
				Showing {start.toLocaleString()}&ndash;{end.toLocaleString()} of{" "}
				{total.toLocaleString()}
			</p>

			<div className="flex items-center gap-2">
				<select
					value={pageSize}
					onChange={(e) => onPageSizeChange(Number(e.target.value))}
					className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-text-primary"
				>
					{[20, 50, 100].map((size) => (
						<option key={size} value={size}>
							{size} / page
						</option>
					))}
				</select>

				<div className="flex items-center gap-1">
					<button
						type="button"
						className={btnClass}
						disabled={page <= 1}
						onClick={() => onPageChange(1)}
						aria-label="First page"
					>
						<ChevronsLeft className="h-4 w-4" />
					</button>
					<button
						type="button"
						className={btnClass}
						disabled={page <= 1}
						onClick={() => onPageChange(page - 1)}
						aria-label="Previous page"
					>
						<ChevronLeft className="h-4 w-4" />
					</button>

					<span className="px-2 text-sm text-text-secondary">
						{page} / {totalPages}
					</span>

					<button
						type="button"
						className={btnClass}
						disabled={page >= totalPages}
						onClick={() => onPageChange(page + 1)}
						aria-label="Next page"
					>
						<ChevronRight className="h-4 w-4" />
					</button>
					<button
						type="button"
						className={btnClass}
						disabled={page >= totalPages}
						onClick={() => onPageChange(totalPages)}
						aria-label="Last page"
					>
						<ChevronsRight className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
