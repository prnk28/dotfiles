import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e omarchy-pkg-aur-install", "Installing AUR package"); }
