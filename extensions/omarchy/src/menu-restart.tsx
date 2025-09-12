import {
	List,
	ActionPanel,
	Action,
	Icon,
	confirmAlert,
	Alert,
} from "@vicinae/api";
import { runFloatingTerminal } from "./utils";

interface RestartItem {
	title: string;
	icon: Icon;
	cmd: string;
	description: string;
	alertMessage: string;
}

const restartItems: RestartItem[] = [
	{
		title: "Restart Hypridle",
		icon: Icon.Clock,
		cmd: "alacritty -e omarchy-restart-hypridle",
		description: "Restart the idle management daemon",
		alertMessage:
			"This will restart the Hypridle service. Any idle timer will be reset.",
	},
	{
		title: "Restart Hyprsunset",
		icon: Icon.Moon,
		cmd: "alacritty -e omarchy-restart-hyprsunset",
		description: "Restart the sunset/nightlight service",
		alertMessage:
			"This will restart the Hyprsunset service. Your screen color temperature will be reset.",
	},
	{
		title: "Restart SwayOSD",
		icon: Icon.Airplane,
		cmd: "alacritty -e omarchy-restart-swayosd",
		description: "Restart the on-screen display service",
		alertMessage:
			"This will restart the SwayOSD service. Volume/brightness indicators will be reset.",
	},
	{
		title: "Restart Walker",
		icon: Icon.MagnifyingGlass,
		cmd: "alacritty -e omarchy-restart-walker",
		description: "Restart the application launcher",
		alertMessage:
			"This will restart the Walker launcher. The launcher will be unavailable briefly.",
	},
	{
		title: "Restart Waybar",
		icon: Icon.AppWindowSidebarLeft,
		cmd: "alacritty -e omarchy-restart-waybar",
		description: "Restart the status bar",
		alertMessage:
			"This will restart the Waybar status bar. Your status bar will disappear and reappear.",
	},
	{
		title: "Restart WiFi",
		icon: Icon.Wifi,
		cmd: "alacritty -e omarchy-restart-wifi",
		description: "Restart the WiFi service",
		alertMessage:
			"This will restart the WiFi service. Your internet connection will be temporarily interrupted.",
	},
	{
		title: "Restart Bluetooth",
		icon: Icon.Bluetooth,
		cmd: "alacritty -e omarchy-restart-bluetooth",
		description: "Restart the Bluetooth service",
		alertMessage:
			"This will restart the Bluetooth service. Connected devices will be disconnected.",
	},
];

export default function MenuRestart() {
	const handleRestart = async (item: RestartItem) => {
		const options: Alert.Options = {
			title: `Restart ${item.title.replace("Restart ", "")}?`,
			message: item.alertMessage,
			primaryAction: {
				title: "Restart",
				style: Alert.ActionStyle.Destructive,
				onAction: async () => {
					await runFloatingTerminal(item.cmd, item.title);
				},
			},
			dismissAction: {
				title: "Cancel",
				style: Alert.ActionStyle.Cancel,
			},
		};

		await confirmAlert(options);
	};

	return (
		<List searchBarPlaceholder="Search services to restart...">
			{restartItems.map((item) => (
				<List.Item
					key={item.title}
					title={item.title}
					subtitle={item.description}
					icon={item.icon}
					actions={
						<ActionPanel>
							<Action
								title="Restart Service"
								icon={Icon.RotateClockwise}
								onAction={() => handleRestart(item)}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}
