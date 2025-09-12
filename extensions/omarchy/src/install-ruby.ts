import { runTiledTerminal } from "./utils";
export default async function() { await runTiledTerminal("alacritty -e omarchy-install-dev-env ruby", "Installing Ruby on Rails"); }