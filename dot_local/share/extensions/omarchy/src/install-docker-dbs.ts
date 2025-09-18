import { runTiledTerminal } from "./utils";
export default async function() { await runTiledTerminal("alacritty -e omarchy-install-docker-dbs", "Installing Docker databases"); }