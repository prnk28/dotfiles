import { runTiledTerminal } from "./utils";
export default async function() { await runTiledTerminal("alacritty -e nvim ~/.config/hypr/monitors.conf", "Opening monitor setup"); }
