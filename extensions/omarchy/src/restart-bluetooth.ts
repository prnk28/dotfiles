import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e omarchy-restart-bluetooth", "Restarting Bluetooth"); }
