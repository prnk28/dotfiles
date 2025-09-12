import { runCommand } from "./utils";
export default async function() { await runCommand("systemctl poweroff", "Shutting down"); }
