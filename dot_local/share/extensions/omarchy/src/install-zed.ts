import { runTiledTerminal } from "./utils";
export default async function() { await runTiledTerminal("sudo pacman -S --noconfirm zed", "Installing Zed"); }
