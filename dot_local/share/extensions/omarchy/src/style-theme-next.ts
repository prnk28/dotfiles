import { closeMainWindow } from "@vicinae/api";
import { runCommand } from "./utils";
export default async function() {
  await runCommand("omarchy-theme-next", "Switching to next theme");
  await closeMainWindow();
}
