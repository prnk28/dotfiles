import { runTiledTerminal } from "./utils";
export default async function () {
	await runTiledTerminal(
		`omarchy-launch-tui-float "chezmoi update && exec zsh"`,
		"Updating Omarchy"
	);
}
