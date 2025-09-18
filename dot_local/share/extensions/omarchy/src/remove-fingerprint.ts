import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e omarchy-setup-fingerprint --remove", "Removing fingerprint"); }
