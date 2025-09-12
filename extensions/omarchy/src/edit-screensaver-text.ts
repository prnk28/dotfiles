import { runTiledTerminal } from "./utils";
export default async function() { await runTiledTerminal("alacritty -e nvim ~/.config/omarchy/branding/screensaver.txt", "Editing screensaver text"); }