import { runCommand } from "./utils";
export default async function() { await runCommand("systemctl suspend", "Suspending system"); }
