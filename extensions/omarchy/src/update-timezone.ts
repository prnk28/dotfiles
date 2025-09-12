import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e omarchy-cmd-tzupdate", "Updating timezone"); }
