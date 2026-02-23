import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SponsorTracker — Track UK Visa Sponsor Changes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(135deg, #0F4C75 0%, #0A3A5C 50%, #073047 100%)",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "12px",
						marginBottom: "32px",
					}}
				>
					<div
						style={{
							width: "56px",
							height: "56px",
							borderRadius: "14px",
							background: "white",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "28px",
							fontWeight: 800,
							color: "#0F4C75",
						}}
					>
						ST
					</div>
					<span
						style={{
							fontSize: "32px",
							fontWeight: 600,
							color: "white",
						}}
					>
						SponsorTracker
					</span>
				</div>
				<h1
					style={{
						fontSize: "56px",
						fontWeight: 700,
						color: "white",
						textAlign: "center",
						lineHeight: 1.2,
						maxWidth: "800px",
						margin: 0,
					}}
				>
					Track UK Visa Sponsor Changes
				</h1>
				<p
					style={{
						fontSize: "24px",
						color: "rgba(255,255,255,0.7)",
						marginTop: "20px",
						textAlign: "center",
						maxWidth: "600px",
					}}
				>
					Monitor 140,000+ sponsors. Get notified when it matters.
				</p>
				<div
					style={{
						display: "flex",
						gap: "24px",
						marginTop: "40px",
						fontSize: "16px",
						color: "rgba(255,255,255,0.5)",
					}}
				>
					<span>Data from GOV.UK</span>
					<span>&bull;</span>
					<span>Updated daily</span>
					<span>&bull;</span>
					<span>140,000+ sponsors</span>
				</div>
			</div>
		),
		{ ...size },
	);
}
