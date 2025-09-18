import { confirmAlert, Alert } from "@vicinae/api";
import { runCommand } from "./utils";

export default async function () {
	const options: Alert.Options = {
		title: "Relaunch Session?",
		message:
			"This will restart your desktop session. All open applications will be closed.",
		primaryAction: {
			title: "Relaunch",
			style: Alert.ActionStyle.Destructive,
			onAction: async () => {
				await runCommand("uwsm stop", "Relaunching session");
			},
		},
		dismissAction: {
			title: "Cancel",
			style: Alert.ActionStyle.Cancel,
		},
	};

	await confirmAlert(options);
}
