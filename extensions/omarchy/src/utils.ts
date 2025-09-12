import { showToast, Toast, closeMainWindow } from "@vicinae/api";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runCommand(cmd: string, title?: string, shouldCloseWindow: boolean = false): Promise<string> {
	try {
		await showToast({
			title: title || "Executing command...",
			style: Toast.Style.Animated,
		});
		
		// Close Vicinae window before launching terminal apps
		if (shouldCloseWindow) {
			await closeMainWindow();
		}
		
		const { stdout, stderr } = await execAsync(cmd);
		if (stderr && !stderr.includes("WARNING")) {
			await showToast({
				title: "Warning",
				message: stderr,
				style: Toast.Style.Failure,
			});
		}
		if (title && !shouldCloseWindow) {
			await showToast({
				title: `${title} completed`,
				style: Toast.Style.Success,
			});
		}
		return stdout;
	} catch (error) {
		await showToast({
			title: "Command failed",
			message: error instanceof Error ? error.message : "Unknown error",
			style: Toast.Style.Failure,
		});
		throw error;
	}
}

export async function runTerminalCommand(cmd: string, title?: string, windowClass: "TUI.float" | "TUI.tile" = "TUI.tile"): Promise<string> {
	// For commands that open in alacritty, always close Vicinae and focus the new window
	// Use the appropriate window class
	const focusedCmd = cmd.includes("alacritty") 
		? cmd.replace("alacritty", `alacritty --class=${windowClass}`)
		: cmd;
	
	return runCommand(focusedCmd, title, true);
}

// Convenience functions for specific window types
export async function runFloatingTerminal(cmd: string, title?: string): Promise<string> {
	return runTerminalCommand(cmd, title, "TUI.float");
}

export async function runTiledTerminal(cmd: string, title?: string): Promise<string> {
	return runTerminalCommand(cmd, title, "TUI.tile");
}