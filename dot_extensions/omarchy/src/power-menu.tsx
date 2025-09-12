import React from "react";
import { List, ActionPanel, Action, showToast, Icon } from "@vicinae/api";

export default function SimpleList() {
	return (
		<List searchBarPlaceholder="Search fruits...">
			<List.Section title={"Fruits"}>
				{fruits.map((fruit) => (
					<List.Item
						key={fruit.name}
						title={fruit.name}
						icon={fruit.icon}
						keywords={fruit.keywords}
						actions={
							<ActionPanel>
								<Action
									title="Custom action"
									icon={Icon.Cog}
									onAction={() =>
										showToast({ title: "Hello from custom action" })
									}
								/>
							</ActionPanel>
						}
					/>
				))}
			</List.Section>
		</List>
	);
}

type MenuItem = {
	cmd: string;
	icon?: string;
	name: string;
};

const fruits: MenuItem[] = [
	{
		icon: "🔒",
		cmd: "omarchy-lock-screen",
		name: "Lock",
	},
	{
		name: "Screensaver",
		cmd: "omarchy-cmd-screensaver",
		icon: "🎮",
	},
	{
		name: "Suspend",
		cmd: "omarchy-cmd-suspend",
		icon: "💤",
	},
	{
		name: "Relaunch",
		cmd: "omarchy-cmd-relaunch",
		icon: "🔄",
	},
	{
		name: "Shutdown",
		cmd: "omarchy-cmd-notifications",
		icon: "🔔",
	},
	{
		name: "Sleep",
		cmd: "omarchy-cmd-sleep",
		icon: "😴",
	},
];
