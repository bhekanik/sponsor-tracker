import { AlertManager } from "@/components/alerts/alert-manager";

export default function AlertsPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Alerts</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Configure email notifications for your watchlists.
			</p>
			<div className="mt-6">
				<AlertManager />
			</div>
		</div>
	);
}
