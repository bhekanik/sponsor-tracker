import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-display",
	display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-body",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_SITE_URL ?? "https://sponsortracker.uk",
	),
	title: {
		default: "SponsorTracker — Track UK Visa Sponsor Changes",
		template: "%s | SponsorTracker",
	},
	description:
		"Monitor 140,000+ companies on the UK Home Office Register of Licensed Sponsors. Get notified when sponsors are added, removed, or updated.",
	keywords: [
		"UK visa sponsor",
		"sponsor licence",
		"Home Office register",
		"skilled worker visa",
		"sponsor tracker",
		"UK immigration",
		"sponsor changes",
		"licensed sponsors",
	],
	openGraph: {
		title: "SponsorTracker — Track UK Visa Sponsor Changes",
		description:
			"Monitor 140,000+ companies on the UK Home Office Register of Licensed Sponsors. Get notified when sponsors are added, removed, or updated.",
		siteName: "SponsorTracker",
		type: "website",
		locale: "en_GB",
	},
	twitter: {
		card: "summary_large_image",
		title: "SponsorTracker — Track UK Visa Sponsor Changes",
		description:
			"Monitor 140,000+ UK visa sponsors. Get notified when it matters.",
	},
	alternates: {
		canonical: "/",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${instrumentSerif.variable} ${plusJakartaSans.variable}`}
			suppressHydrationWarning
		>
			<body className="flex min-h-screen flex-col font-sans">
				<NextTopLoader color="#0F4C75" showSpinner={false} />
				<Providers>
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
