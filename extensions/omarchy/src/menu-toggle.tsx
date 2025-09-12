import { List, ActionPanel, Action, Icon } from "@vicinae/api";
import { runCommand, runFloatingTerminal } from "./utils";

interface ToggleItem {
	title: string;
	icon: Icon;
	cmd: string;
	description: string;
}

const toggleItems: ToggleItem[] = [
	{
		title: "Toggle Idle Lock",
		icon: Icon.Lock,
		cmd: "omarchy-toggle-idle",
		description: "Enable or disable automatic screen locking on idle",
	},
	{
		title: "Toggle Nightlight",
		icon: Icon.Moon,
		cmd: "omarchy-toggle-nightlight",
		description: "Enable or disable blue light filter",
	},
	{
		title: "Toggle Screensaver",
		icon: Icon.Desktop,
		cmd: "omarchy-toggle-screensaver",
		description: "Enable or disable the screensaver",
	},
	{
		title: "Toggle Waybar",
		icon: Icon.AppWindowSidebarLeft,
		cmd: "omarchy-toggle-waybar",
		description: "Show or hide the top status bar",
	},
];

export default function MenuToggle() {
	return (
		<List searchBarPlaceholder="Search toggles...">
			{toggleItems.map((item) => (
				<List.Item
					key={item.title}
					title={item.title}
					subtitle={item.description}
					icon={item.icon}
					actions={
						<ActionPanel>
							<Action
								title="Toggle"
								icon={Icon.Switch}
								onAction={async () => {
									await runCommand(item.cmd, item.title);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}
