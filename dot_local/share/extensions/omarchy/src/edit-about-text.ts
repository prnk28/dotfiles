import { runTiledTerminal } from "./utils";
export default async function() { await runTiledTerminal("alacritty -e nvim ~/.config/omarchy/branding/about.txt", "Editing about text"); }