import { runCommand } from "./utils";
export default async function() { await runCommand("pkill hyprpicker || hyprpicker -a", "Launching color picker"); }
