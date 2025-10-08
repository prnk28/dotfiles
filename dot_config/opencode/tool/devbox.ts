import { tool } from "@opencode-ai/plugin";
import { $ } from "bun";

const MAX_OUTPUT_LENGTH = 5000;

function sanitizeOutput(output: string, isTest: boolean = false): string {
  // Strip ANSI codes
  let cleaned = output.replace(/\x1b\[[0-9;]*m/g, "");

  if (isTest) {
    // Filter out noise from test output
    const lines = cleaned.split("\n");
    const filtered = lines.filter((line) => {
      const trimmed = line.trim();
      // Skip empty lines, package manager noise, and "no test files" lines
      return (
        trimmed &&
        !trimmed.includes("[no test files]") &&
        !trimmed.startsWith("?") &&
        !trimmed.includes("Lockfile is up to date") &&
        !trimmed.includes("Already up to date") &&
        !trimmed.includes("Scope: all") &&
        !trimmed.includes("╔═════════╗") &&
        !trimmed.includes("╚═════════╝") &&
        !trimmed.includes("║ Install ║") &&
        !trimmed.includes("╭ Warning") &&
        !trimmed.includes("╮") &&
        !trimmed.includes("┃") &&
        !trimmed.includes("─────────") &&
        // Keep only meaningful test results
        (trimmed.startsWith("FAIL") ||
          trimmed.startsWith("PASS") ||
          trimmed.includes("Tests:") ||
          trimmed.includes("Test Suites:") ||
          trimmed.includes("✅") ||
          trimmed.includes("❌") ||
          trimmed.includes("Error:") ||
          trimmed.includes("Failed") ||
          trimmed.includes("passed") ||
          trimmed.includes("coverage") ||
          // Keep final summaries
          trimmed.match(/^\d+\s+(passing|failing|pending)/) ||
          // Keep go test failures
          trimmed.startsWith("--- FAIL") ||
          trimmed.startsWith("FAIL\t"))
      );
    });
    cleaned = filtered.join("\n");
  }

  // Truncate if still too long
  return cleaned.length > MAX_OUTPUT_LENGTH
    ? cleaned.slice(0, MAX_OUTPUT_LENGTH) + "\n... (output truncated)"
    : cleaned;
}

function formatError(
  command: string,
  error: any,
  isTest: boolean = false
): string {
  const exitCode = error.exitCode ?? "unknown";
  const stdout = sanitizeOutput(error.stdout?.toString() || "", isTest);
  const stderr = sanitizeOutput(error.stderr?.toString() || "", isTest);

  let message = `Command failed for ${command}\nExit code: ${exitCode}`;

  if (stdout) {
    message += `\n\nOutput:\n${stdout}`;
  }

  if (stderr) {
    message += `\n\nErrors:\n${stderr}`;
  }

  return message;
}

export const build = tool({
  description:
    "Build a specific module or package using devbox build scripts. Executes 'devbox run build:<module>' to compile code, bundle assets, or perform build tasks for the specified module.",
  args: {
    command: tool.schema
      .string()
      .describe(
        "The name of the module or package to build (e.g., 'frontend', 'api', 'all')"
      ),
  },
  async execute(args) {
    try {
      const result = await $`devbox run build:${args.command}`;
      return `Build successful for ${args.command}\n\n${sanitizeOutput(result.stdout.toString())}`;
    } catch (error: any) {
      return formatError(`build:${args.command}`, error);
    }
  },
});

export const test = tool({
  description:
    "Run tests for a specific module using devbox test scripts. Executes 'devbox run test:<module>' to run unit tests, integration tests, or test suites for the specified module.",
  args: {
    command: tool.schema
      .string()
      .describe(
        "The name of the module to test (e.g., 'unit', 'integration', 'e2e', 'all')"
      ),
  },
  async execute(args) {
    try {
      const result = await $`devbox run test:${args.command}`;
      const output = sanitizeOutput(result.stdout.toString(), true);
      return `Tests passed for ${args.command}\n\n${output}`;
    } catch (error: any) {
      return formatError(`test:${args.command}`, error, true);
    }
  },
});

export const snapshot = tool({
  description:
    "Update or verify test snapshots for a specific module using devbox snapshot scripts. Executes 'devbox run snapshot:<module>' to regenerate snapshot files or compare current output against saved snapshots.",
  args: {
    command: tool.schema
      .string()
      .describe(
        "The name of the module to snapshot (e.g., 'update', 'verify', or specific test suite name)"
      ),
  },
  async execute(args) {
    try {
      const result = await $`devbox run snapshot:${args.command}`;
      return `Snapshot operation completed for ${args.command}\n\n${sanitizeOutput(result.stdout.toString())}`;
    } catch (error: any) {
      return formatError(`snapshot:${args.command}`, error);
    }
  },
});

export const up = tool({
  description:
    "Start all configured Devbox services in background/daemon mode (databases, caches, background workers, etc.). Services continue running after the command completes. Use devbox_attach to view logs.",
  args: {},
  async execute() {
    try {
      const result = await $`devbox services up -b`;
      return `Devbox services started in background mode\n\n${sanitizeOutput(result.stdout.toString())}`;
    } catch (error: any) {
      return formatError("services up -b", error);
    }
  },
});

export const down = tool({
  description:
    "Stop all running Devbox services (databases, caches, background workers, etc.). This shuts down the development environment's service dependencies cleanly.",
  args: {},
  async execute() {
    try {
      const result = await $`devbox services down`;
      return `Devbox services stopped successfully\n\n${sanitizeOutput(result.stdout.toString())}`;
    } catch (error: any) {
      return formatError("services down", error);
    }
  },
});

export const attach = tool({
  description:
    "Attach to the process-compose TUI to view logs and manage running Devbox services. Use this after starting services with devbox_up to monitor service output, view logs in real-time, and interact with background services. Press F10 to detach.",
  args: {},
  async execute() {
    return `To view service logs interactively, run: devbox services attach

This will open the process-compose TUI where you can:
- View real-time logs from all services
- Press F5 to toggle log auto-scroll
- Press F4 to toggle full/half screen logs
- Press F6 to toggle log line wrapping
- Press F7/F9 to start/stop processes
- Press Ctrl-R to restart a process
- Press F10 to quit and return

Note: This is an interactive TUI command that should be run directly in your terminal, not through this tool.`;
  },
});

export const ls = tool({
  description:
    "List all available Devbox services and their current status (running, stopped, etc.). Shows which services are configured and whether process-compose is currently managing them.",
  args: {},
  async execute() {
    try {
      const result = await $`devbox services ls`;
      return `Devbox services status:\n\n${sanitizeOutput(result.stdout.toString())}`;
    } catch (error: any) {
      return formatError("services ls", error);
    }
  },
});

export const restart = tool({
  description:
    "Restart specific Devbox services or all services. Useful for applying configuration changes or recovering from service failures.",
  args: {
    service: tool.schema
      .string()
      .optional()
      .describe(
        "The name of the specific service to restart (e.g., 'postgres', 'redis'). Leave empty to restart all services."
      ),
  },
  async execute(args) {
    try {
      const result = args.service
        ? await $`devbox services restart ${args.service}`
        : await $`devbox services restart`;
      const target = args.service || "all services";
      return `Restarted ${target} successfully\n\n${sanitizeOutput(result.stdout.toString())}`;
    } catch (error: any) {
      const target = args.service || "all services";
      return formatError(`restart ${target}`, error);
    }
  },
});
