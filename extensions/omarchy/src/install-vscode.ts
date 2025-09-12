import { runTiledTerminal } from "./utils";
export default async function() { await runTiledTerminal("sudo pacman -S --noconfirm visual-studio-code-bin", "Installing VSCode"); }
