import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e omarchy-setup-fingerprint", "Setting up fingerprint"); }
