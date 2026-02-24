import { AlertManager } from "@/components/alerts/alert-manager";

export default function AlertsPage() {
	return (
		<div>
			<h1 className="font-display text-2xl text-text-primary">Alerts</h1>
			<p className="mt-1 text-text-secondary">
				Configure email notifications for your watchlists.
			</p>
			<div className="mt-6">
				<AlertManager />
			</div>
		</div>
	);
}
