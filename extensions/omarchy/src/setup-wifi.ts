import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e bash -c 'rfkill unblock wifi && impala'", "Opening WiFi setup"); }
