import { runTiledTerminal } from "./utils";
export default async function() { await runTiledTerminal("alacritty -e omarchy-update-system-pkgs", "Updating packages"); }
