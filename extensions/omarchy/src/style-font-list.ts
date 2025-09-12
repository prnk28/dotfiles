import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e bash -c 'omarchy-font-list | less'", "Listing fonts"); }
