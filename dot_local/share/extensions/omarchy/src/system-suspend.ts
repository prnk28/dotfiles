import { confirmAlert, Alert } from "@vicinae/api";
import { runCommand } from "./utils";

export default async function() {
	const options: Alert.Options = {
		title: "Suspend System?",
		message: "This will put your computer to sleep. You can wake it by pressing the power button.",
		primaryAction: {
			title: "Suspend",
			style: Alert.ActionStyle.Destructive,
			onAction: async () => {
				await runCommand("systemctl suspend", "Suspending system");
			},
		},
		dismissAction: {
			title: "Cancel",
			style: Alert.ActionStyle.Cancel,
		},
	};

	await confirmAlert(options);
}
