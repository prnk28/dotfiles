import { closeMainWindow } from "@vicinae/api";
import { runCommand } from "./utils";
export default async function() {
  await runCommand("swww img \"$(find ~/wallpapers -type f | shuf -n 1)\" --transition-type random", "Changing wallpaper");
  await closeMainWindow();
}