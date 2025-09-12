import { confirmAlert, Alert } from "@vicinae/api";
import { runCommand } from "./utils";

export default async function() {
	const options: Alert.Options = {
		title: "Restart System?",
		message: "This will restart your computer. Make sure all work is saved.",
		primaryAction: {
			title: "Restart",
			style: Alert.ActionStyle.Destructive,
			onAction: async () => {
				await runCommand("systemctl reboot", "Restarting system");
			},
		},
		dismissAction: {
			title: "Cancel",
			style: Alert.ActionStyle.Cancel,
		},
	};

	await confirmAlert(options);
}
