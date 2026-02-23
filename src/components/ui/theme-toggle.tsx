"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = ["light", "dark", "system"] as const;
const icons = { light: Sun, dark: Moon, system: Monitor };

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return <div className="h-9 w-9" />;
	}

	const current = (theme ?? "system") as (typeof themes)[number];
	const next = themes[(themes.indexOf(current) + 1) % themes.length];
	const Icon = icons[current];

	return (
		<button
			type="button"
			onClick={() => setTheme(next)}
			className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
			aria-label={`Switch to ${next} theme`}
		>
			<Icon className="h-4 w-4" />
		</button>
	);
}
