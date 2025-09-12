import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e omarchy-setup-fido2 --remove", "Removing Fido2"); }
