import { runFloatingTerminal } from "./utils";
export default async function() { await runFloatingTerminal("alacritty -e passwd", "Changing password"); }