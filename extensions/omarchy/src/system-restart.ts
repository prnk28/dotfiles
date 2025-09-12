import { runCommand } from "./utils";
export default async function() { await runCommand("systemctl reboot", "Restarting system"); }
