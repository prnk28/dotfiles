import { confirmAlert, Alert } from "@vicinae/api";
import { runCommand } from "./utils";

export default async function() {
	const options: Alert.Options = {
		title: "Shutdown System?",
		message: "This will power off your computer. Make sure all work is saved.",
		primaryAction: {
			title: "Shutdown",
			style: Alert.ActionStyle.Destructive,
			onAction: async () => {
				await runCommand("systemctl poweroff", "Shutting down");
			},
		},
		dismissAction: {
			title: "Cancel",
			style: Alert.ActionStyle.Cancel,
		},
	};

	await confirmAlert(options);
}
