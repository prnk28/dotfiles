import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e bash -c 'omarchy-theme-list | less'", "Listing themes"); }
