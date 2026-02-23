import { eq } from "drizzle-orm";
import { ImageResponse } from "next/og";
import { db } from "@/db";
import { sponsors } from "@/db/schema";

export const runtime = "edge";
export const alt = "Sponsor Details";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function SponsorOGImage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [sponsor] = await db
		.select({
			canonicalName: sponsors.canonicalName,
			status: sponsors.status,
			town: sponsors.town,
			county: sponsors.county,
			rating: sponsors.rating,
		})
		.from(sponsors)
		.where(eq(sponsors.id, id));

	const name = sponsor?.canonicalName ?? "Sponsor Not Found";
	const status = sponsor?.status ?? "unknown";
	const location = sponsor
		? [sponsor.town, sponsor.county].filter(Boolean).join(", ")
		: "";

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "80px",
					background: "linear-gradient(135deg, #0F4C75 0%, #0A3A5C 50%, #073047 100%)",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						marginBottom: "40px",
						fontSize: "20px",
						color: "rgba(255,255,255,0.5)",
					}}
				>
					<span
						style={{
							width: "32px",
							height: "32px",
							borderRadius: "8px",
							background: "white",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "16px",
							fontWeight: 800,
							color: "#0F4C75",
						}}
					>
						ST
					</span>
					SponsorTracker
				</div>
				<h1
					style={{
						fontSize: "52px",
						fontWeight: 700,
						color: "white",
						lineHeight: 1.2,
						margin: 0,
						maxWidth: "900px",
					}}
				>
					{name}
				</h1>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
						marginTop: "24px",
					}}
				>
					<span
						style={{
							padding: "6px 16px",
							borderRadius: "20px",
							fontSize: "18px",
							fontWeight: 600,
							background:
								status === "active"
									? "rgba(34,197,94,0.2)"
									: "rgba(239,68,68,0.2)",
							color: status === "active" ? "#86efac" : "#fca5a5",
						}}
					>
						{status}
					</span>
					{sponsor?.rating && (
						<span
							style={{
								padding: "6px 16px",
								borderRadius: "20px",
								fontSize: "18px",
								fontWeight: 600,
								background: "rgba(255,255,255,0.1)",
								color: "rgba(255,255,255,0.8)",
							}}
						>
							{sponsor.rating}
						</span>
					)}
				</div>
				{location && (
					<p
						style={{
							fontSize: "22px",
							color: "rgba(255,255,255,0.6)",
							marginTop: "16px",
						}}
					>
						{location}
					</p>
				)}
			</div>
		),
		{ ...size },
	);
}
