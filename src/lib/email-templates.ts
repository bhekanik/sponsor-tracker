interface ChangeItem {
	sponsorName: string;
	changeType: string;
	field?: string | null;
	oldValue?: string | null;
	newValue?: string | null;
}

export function instantAlertHtml(
	watchlistName: string,
	changes: ChangeItem[],
): string {
	const rows = changes
		.map((c) => {
			let detail = c.changeType;
			if (c.field) {
				detail = `${c.field}: ${c.oldValue ?? "—"} → ${c.newValue ?? "—"}`;
			}
			return `<tr><td style="padding:8px;border-bottom:1px solid #eee">${c.sponsorName}</td><td style="padding:8px;border-bottom:1px solid #eee">${c.changeType}</td><td style="padding:8px;border-bottom:1px solid #eee">${detail}</td></tr>`;
		})
		.join("");

	return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto">
  <h2 style="color:#4f46e5">SponsorTracker Alert</h2>
  <p>Changes detected matching your watchlist <strong>"${watchlistName}"</strong>:</p>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:#f9fafb">
        <th style="padding:8px;text-align:left">Sponsor</th>
        <th style="padding:8px;text-align:left">Type</th>
        <th style="padding:8px;text-align:left">Detail</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="margin-top:20px;font-size:12px;color:#999">
    <a href="\${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sponsortracker.uk'}/dashboard/watchlists">Manage watchlists</a>
  </p>
</body>
</html>`;
}

export function dailyDigestHtml(
	changes: { watchlistName: string; items: ChangeItem[] }[],
): string {
	const sections = changes
		.map(
			(wl) => `
      <h3 style="color:#4f46e5;margin-top:16px">${wl.watchlistName}</h3>
      <ul>${wl.items.map((c) => `<li>${c.sponsorName} — ${c.changeType}${c.field ? ` (${c.field}: ${c.oldValue ?? "—"} → ${c.newValue ?? "—"})` : ""}</li>`).join("")}</ul>
    `,
		)
		.join("");

	return `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;color:#333;max-width:600px;margin:0 auto">
  <h2 style="color:#4f46e5">SponsorTracker Daily Digest</h2>
  <p>Here's a summary of changes matching your watchlists:</p>
  ${sections}
  <p style="margin-top:20px;font-size:12px;color:#999">
    <a href="\${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sponsortracker.uk'}/dashboard/watchlists">Manage watchlists</a>
  </p>
</body>
</html>`;
}
