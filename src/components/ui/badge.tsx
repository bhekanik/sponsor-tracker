import { clsx } from "clsx";

const variants = {
	success:
		"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	warning:
		"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	neutral:
		"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
} as const;

interface BadgeProps {
	variant: keyof typeof variants;
	children: React.ReactNode;
	className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
	return (
		<span
			className={clsx(
				"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
				variants[variant],
				className,
			)}
		>
			{children}
		</span>
	);
}
