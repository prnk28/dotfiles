import { showToast, Toast, closeMainWindow } from "@vicinae/api";
import { runCommand } from "./utils";
export default async function() {
  const current = await runCommand("omarchy-font-current", "");
  await showToast({
    title: "Current Font",
    message: current.trim(),
    style: Toast.Style.Success,
  });
  await closeMainWindow();
}
