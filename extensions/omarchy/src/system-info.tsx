import { Detail, ActionPanel, Action } from "@vicinae/api";
import React from "react";
import { runCommand, runFloatingTerminal } from "./utils";

export default function SystemInfo() {
	const [systemInfo, setSystemInfo] = React.useState<string>("Loading system information...");

	React.useEffect(() => {
		runCommand("fastfetch", "").then(setSystemInfo).catch(() => setSystemInfo("Failed to load system info"));
	}, []);

	return (
		<Detail
			markdown={`\`\`\`\n${systemInfo}\n\`\`\``}
			actions={
				<ActionPanel>
					<Action
						title="Open in Terminal"
						onAction={async () => {
							await runFloatingTerminal("alacritty -e bash -c 'fastfetch; read -n 1 -s'", "Opening terminal");
						}}
					/>
				</ActionPanel>
			}
		/>
	);
}
