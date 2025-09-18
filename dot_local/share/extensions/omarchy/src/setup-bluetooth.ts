import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e bash -c 'rfkill unblock bluetooth && blueberry'", "Opening Bluetooth setup"); }
