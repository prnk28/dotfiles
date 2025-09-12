import { runCommand } from "./utils";

import { Detail, ActionPanel, Action } from "@vicinae/api";
export default async function () {
	await runCommand("omarchy-lock-screen", "Locking screen");
}
