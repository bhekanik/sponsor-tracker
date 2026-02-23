import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "SponsorTracker",
		short_name: "SponsorTracker",
		description:
			"Monitor 140,000+ companies on the UK Home Office Register of Licensed Sponsors.",
		start_url: "/",
		display: "standalone",
		background_color: "#F8FAFB",
		theme_color: "#0F4C75",
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
