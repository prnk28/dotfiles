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
    "Start all configured Devbox services (databases, caches, background workers, etc.). This brings up the development environment's service dependencies.",
  args: {},
  async execute() {
    try {
      const result = await $`devbox services up`;
      return `Devbox services started successfully\n\n${sanitizeOutput(result.stdout.toString())}`;
    } catch (error: any) {
      return formatError("services up", error);
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
