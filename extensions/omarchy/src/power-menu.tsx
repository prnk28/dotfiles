import {
	List,
	ActionPanel,
	Action,
	showToast,
	Icon,
	Toast,
	open,
} from "@vicinae/api";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runCommand(cmd: string, title?: string) {
	try {
		await showToast({
			title: title || "Executing command...",
			style: Toast.Style.Animated,
		});
		const { stdout, stderr } = await execAsync(cmd);
		if (stderr) {
			await showToast({
				title: "Warning",
				message: stderr,
				style: Toast.Style.Failure,
			});
		}
		if (title) {
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

type MenuItem = {
	name: string;
	cmd?: string;
	icon?: string;
	keywords?: string[];
	submenu?: MenuItem[];
	action?: () => Promise<void>;
};

// Main menu structure based on omarchy-menu
const mainMenu: MenuItem[] = [
	{
		name: "Learn",
		icon: "󰧑",
		keywords: ["help", "documentation", "keybindings"],
		submenu: [
			{ name: "Keybindings", icon: "", cmd: "omarchy-menu-keybindings" },
			{
				name: "Omarchy Manual",
				icon: "",
				cmd: "omarchy-launch-webapp 'https://learn.omacom.io/2/the-omarchy-manual'",
			},
			{
				name: "Hyprland Wiki",
				icon: "",
				cmd: "omarchy-launch-webapp 'https://wiki.hypr.land/'",
			},
			{
				name: "Arch Wiki",
				icon: "󰣇",
				cmd: "omarchy-launch-webapp 'https://wiki.archlinux.org/'",
			},
			{
				name: "Bash Guide",
				icon: "󱆃",
				cmd: "omarchy-launch-webapp 'https://devhints.io/bash'",
			},
			{
				name: "Neovim",
				icon: "",
				cmd: "omarchy-launch-webapp 'https://www.lazyvim.org/keymaps'",
			},
		],
	},
	{
		name: "Capture",
		icon: "",
		keywords: ["screenshot", "screenrecord", "recording", "color"],
		submenu: [
			{
				name: "Screenshot",
				icon: "",
				submenu: [
					{ name: "Region", icon: "", cmd: "omarchy-cmd-screenshot" },
					{ name: "Window", icon: "", cmd: "omarchy-cmd-screenshot window" },
					{ name: "Display", icon: "", cmd: "omarchy-cmd-screenshot output" },
				],
			},
			{
				name: "Screenrecord",
				icon: "",
				submenu: [
					{ name: "Region", icon: "", cmd: "omarchy-cmd-screenrecord" },
					{
						name: "Region + Audio",
						icon: "",
						cmd: "omarchy-cmd-screenrecord region audio",
					},
					{ name: "Display", icon: "", cmd: "omarchy-cmd-screenrecord output" },
					{
						name: "Display + Audio",
						icon: "",
						cmd: "omarchy-cmd-screenrecord output audio",
					},
				],
			},
			{
				name: "Color Picker",
				icon: "󰃉",
				cmd: "pkill hyprpicker || hyprpicker -a",
			},
		],
	},
	{
		name: "Toggle",
		icon: "󰔎",
		keywords: ["switch", "enable", "disable"],
		submenu: [
			{ name: "Screensaver", icon: "󱄄", cmd: "omarchy-toggle-screensaver" },
			{ name: "Nightlight", icon: "󰔎", cmd: "omarchy-toggle-nightlight" },
			{ name: "Idle Lock", icon: "󱫖", cmd: "omarchy-toggle-idle" },
			{ name: "Top Bar", icon: "󰍜", cmd: "omarchy-toggle-waybar" },
		],
	},
	{
		name: "Style",
		icon: "",
		keywords: ["theme", "appearance", "font", "background"],
		submenu: [
			{ name: "Theme", icon: "󰸌", cmd: "omarchy-menu theme" },
			{ name: "Font", icon: "", cmd: "omarchy-menu font" },
			{ name: "Background", icon: "", cmd: "omarchy-theme-bg-next" },
			{
				name: "Screensaver Text",
				icon: "󱄄",
				cmd: "alacritty -e nvim ~/.config/omarchy/branding/screensaver.txt",
			},
			{
				name: "About Text",
				icon: "",
				cmd: "alacritty -e nvim ~/.config/omarchy/branding/about.txt",
			},
		],
	},
	{
		name: "Setup",
		icon: "",
		keywords: ["configure", "settings", "preferences"],
		submenu: [
			{ name: "Audio", icon: "", cmd: "alacritty --class=Wiremix -e wiremix" },
			{
				name: "WiFi",
				icon: "",
				cmd: "rfkill unblock wifi && alacritty --class=Impala -e impala",
			},
			{
				name: "Bluetooth",
				icon: "󰂯",
				cmd: "rfkill unblock bluetooth && blueberry",
			},
			{ name: "Power Profile", icon: "󱐋", cmd: "omarchy-menu power" },
			{
				name: "Monitors",
				icon: "󰍹",
				cmd: "alacritty -e nvim ~/.config/hypr/monitors.conf",
			},
			{ name: "DNS", icon: "󰱔", cmd: "omarchy-setup-dns" },
			{ name: "Fingerprint", icon: "󰈷", cmd: "omarchy-setup-fingerprint" },
			{ name: "Fido2", icon: "", cmd: "omarchy-setup-fido2" },
		],
	},
	{
		name: "Install",
		icon: "󰉉",
		keywords: ["add", "download", "get"],
		submenu: [
			{ name: "Package", icon: "󰣇", cmd: "alacritty -e omarchy-pkg-install" },
			{
				name: "AUR Package",
				icon: "󰣇",
				cmd: "alacritty -e omarchy-pkg-aur-install",
			},
			{ name: "Web App", icon: "", cmd: "omarchy-webapp-install" },
			{ name: "TUI App", icon: "", cmd: "omarchy-tui-install" },
			{
				name: "Development",
				icon: "󰵮",
				submenu: [
					{
						name: "Ruby on Rails",
						icon: "󰫏",
						cmd: "omarchy-install-dev-env ruby",
					},
					{ name: "Docker DBs", icon: "", cmd: "omarchy-install-docker-dbs" },
					{ name: "Node.js", icon: "", cmd: "omarchy-install-dev-env node" },
					{ name: "Bun", icon: "", cmd: "omarchy-install-dev-env bun" },
					{ name: "Deno", icon: "", cmd: "omarchy-install-dev-env deno" },
					{ name: "Go", icon: "", cmd: "omarchy-install-dev-env go" },
					{ name: "PHP", icon: "", cmd: "omarchy-install-dev-env php" },
					{ name: "Python", icon: "", cmd: "omarchy-install-dev-env python" },
					{ name: "Elixir", icon: "", cmd: "omarchy-install-dev-env elixir" },
					{ name: "Rust", icon: "", cmd: "omarchy-install-dev-env rust" },
					{ name: "Java", icon: "", cmd: "omarchy-install-dev-env java" },
					{ name: ".NET", icon: "", cmd: "omarchy-install-dev-env dotnet" },
				],
			},
			{
				name: "Editors",
				icon: "",
				submenu: [
					{
						name: "VSCode",
						icon: "",
						cmd: "sudo pacman -S --noconfirm visual-studio-code-bin",
					},
					{ name: "Cursor", icon: "", cmd: "yay -S --noconfirm cursor-bin" },
					{ name: "Zed", icon: "", cmd: "sudo pacman -S --noconfirm zed" },
					{
						name: "Sublime Text",
						icon: "",
						cmd: "yay -S --noconfirm sublime-text-4",
					},
					{ name: "Helix", icon: "", cmd: "sudo pacman -S --noconfirm helix" },
					{
						name: "Emacs",
						icon: "",
						cmd: "sudo pacman -S --noconfirm emacs-wayland",
					},
				],
			},
			{
				name: "AI Tools",
				icon: "󱚤",
				submenu: [
					{
						name: "Claude Code",
						icon: "󱚤",
						cmd: "sudo pacman -S --noconfirm claude-code",
					},
					{
						name: "LM Studio",
						icon: "󱚤",
						cmd: "sudo pacman -S --noconfirm lmstudio",
					},
					{
						name: "Ollama",
						icon: "󱚤",
						cmd: "sudo pacman -S --noconfirm ollama",
					},
				],
			},
		],
	},
	{
		name: "Remove",
		icon: "󰭌",
		keywords: ["uninstall", "delete"],
		submenu: [
			{ name: "Package", icon: "󰣇", cmd: "alacritty -e omarchy-pkg-remove" },
			{ name: "Web App", icon: "", cmd: "omarchy-webapp-remove" },
			{ name: "TUI App", icon: "", cmd: "omarchy-tui-remove" },
			{ name: "Theme", icon: "󰸌", cmd: "omarchy-theme-remove" },
			{
				name: "Fingerprint",
				icon: "󰈷",
				cmd: "omarchy-setup-fingerprint --remove",
			},
			{ name: "Fido2", icon: "", cmd: "omarchy-setup-fido2 --remove" },
		],
	},
	{
		name: "Update",
		icon: "",
		keywords: ["upgrade", "refresh"],
		submenu: [
			{ name: "Omarchy", icon: "", cmd: "omarchy-update" },
			{ name: "System Packages", icon: "", cmd: "omarchy-update-system-pkgs" },
			{ name: "Themes", icon: "󰸌", cmd: "omarchy-theme-update" },
			{
				name: "Restart Services",
				icon: "",
				submenu: [
					{ name: "Hypridle", icon: "", cmd: "omarchy-restart-hypridle" },
					{ name: "Hyprsunset", icon: "", cmd: "omarchy-restart-hyprsunset" },
					{ name: "Swayosd", icon: "", cmd: "omarchy-restart-swayosd" },
					{ name: "Walker", icon: "󰌧", cmd: "omarchy-restart-walker" },
					{ name: "Waybar", icon: "󰍜", cmd: "omarchy-restart-waybar" },
					{ name: "WiFi", icon: "󱚾", cmd: "omarchy-restart-wifi" },
					{ name: "Bluetooth", icon: "󰂯", cmd: "omarchy-restart-bluetooth" },
				],
			},
			{ name: "Timezone", icon: "", cmd: "omarchy-cmd-tzupdate" },
			{ name: "User Password", icon: "", cmd: "alacritty -e passwd" },
		],
	},
	{
		name: "About",
		icon: "",
		keywords: ["info", "system", "version"],
		cmd: "alacritty --class Omarchy -o font.size=9 -e bash -c 'fastfetch; read -n 1 -s'",
	},
	{
		name: "System",
		icon: "",
		keywords: ["power", "shutdown", "restart", "lock"],
		submenu: [
			{ name: "Lock", icon: "", cmd: "omarchy-lock-screen" },
			{
				name: "Screensaver",
				icon: "󱄄",
				cmd: "omarchy-launch-screensaver force",
			},
			{ name: "Suspend", icon: "󰤄", cmd: "systemctl suspend" },
			{ name: "Relaunch Session", icon: "", cmd: "uwsm stop" },
			{ name: "Restart", icon: "󰜉", cmd: "systemctl reboot" },
			{ name: "Shutdown", icon: "󰐥", cmd: "systemctl poweroff" },
		],
	},
];

// Component for Learn submenu
function LearnMenu() {
	const learnItems: MenuItem[] = [
		{ name: "Keybindings", icon: "", cmd: "omarchy-menu-keybindings" },
		{
			name: "Omarchy Manual",
			icon: "",
			action: async () => {
				await open("https://learn.omacom.io/2/the-omarchy-manual");
			},
		},
		{
			name: "Hyprland Wiki",
			icon: "",
			action: async () => {
				await open("https://wiki.hypr.land/");
			},
		},
		{
			name: "Arch Wiki",
			icon: "󰣇",
			action: async () => {
				await open("https://wiki.archlinux.org/");
			},
		},
		{
			name: "Bash Guide",
			icon: "󱆃",
			action: async () => {
				await open("https://devhints.io/bash");
			},
		},
		{
			name: "Neovim",
			icon: "",
			action: async () => {
				await open("https://www.lazyvim.org/keymaps");
			},
		},
	];

	return (
		<List searchBarPlaceholder="Search learn resources...">
			{learnItems.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							{item.cmd ? (
								<Action
									title="Execute"
									icon={Icon.Terminal}
									onAction={async () => {
										await runCommand(item.cmd!, item.name);
									}}
								/>
							) : item.action ? (
								<Action title="Open" icon={Icon.Globe} onAction={item.action} />
							) : null}
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for Capture submenu
function CaptureMenu() {
	return (
		<List searchBarPlaceholder="Search capture tools...">
			<List.Item
				title="Screenshot"
				icon=""
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Screenshot Options"
							icon={Icon.ArrowRight}
							target={<ScreenshotMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Screenrecord"
				icon=""
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Screenrecord Options"
							icon={Icon.ArrowRight}
							target={<ScreenrecordMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Color Picker"
				icon="󰃉"
				actions={
					<ActionPanel>
						<Action
							title="Launch Color Picker"
							icon={Icon.Terminal}
							onAction={async () => {
								await runCommand(
									"pkill hyprpicker || hyprpicker -a",
									"Color Picker",
								);
							}}
						/>
					</ActionPanel>
				}
			/>
		</List>
	);
}

// Component for Screenshot submenu
function ScreenshotMenu() {
	const items = [
		{ name: "Region", icon: "", cmd: "omarchy-cmd-screenshot" },
		{ name: "Window", icon: "", cmd: "omarchy-cmd-screenshot window" },
		{ name: "Display", icon: "", cmd: "omarchy-cmd-screenshot output" },
	];

	return (
		<List searchBarPlaceholder="Select screenshot type...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Take Screenshot"
								icon={Icon.Camera}
								onAction={async () => {
									await runCommand(item.cmd, `Screenshot ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for Screenrecord submenu
function ScreenrecordMenu() {
	const items = [
		{ name: "Region", icon: "", cmd: "omarchy-cmd-screenrecord" },
		{
			name: "Region + Audio",
			icon: "",
			cmd: "omarchy-cmd-screenrecord region audio",
		},
		{ name: "Display", icon: "", cmd: "omarchy-cmd-screenrecord output" },
		{
			name: "Display + Audio",
			icon: "",
			cmd: "omarchy-cmd-screenrecord output audio",
		},
	];

	return (
		<List searchBarPlaceholder="Select recording type...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Start Recording"
								icon={Icon.Video}
								onAction={async () => {
									await runCommand(item.cmd, `Recording ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for Toggle submenu
function ToggleMenu() {
	const items = [
		{ name: "Screensaver", icon: "󱄄", cmd: "omarchy-toggle-screensaver" },
		{ name: "Nightlight", icon: "󰔎", cmd: "omarchy-toggle-nightlight" },
		{ name: "Idle Lock", icon: "󱫖", cmd: "omarchy-toggle-idle" },
		{ name: "Top Bar", icon: "󰍜", cmd: "omarchy-toggle-waybar" },
	];

	return (
		<List searchBarPlaceholder="Search toggles...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Toggle"
								icon={Icon.Switch}
								onAction={async () => {
									await runCommand(item.cmd, `Toggle ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for Style submenu
function StyleMenu() {
	const items = [
		{ name: "Theme", icon: "󰸌", cmd: "omarchy-menu theme" },
		{ name: "Font", icon: "", cmd: "omarchy-menu font" },
		{ name: "Background", icon: "", cmd: "omarchy-theme-bg-next" },
		{
			name: "Screensaver Text",
			icon: "󱄄",
			cmd: "alacritty -e nvim ~/.config/omarchy/branding/screensaver.txt",
		},
		{
			name: "About Text",
			icon: "",
			cmd: "alacritty -e nvim ~/.config/omarchy/branding/about.txt",
		},
	];

	return (
		<List searchBarPlaceholder="Search style options...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Open"
								icon={Icon.Paintbrush}
								onAction={async () => {
									await runCommand(item.cmd, item.name);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for Setup submenu
function SetupMenu() {
	const items = [
		{ name: "Audio", icon: "", cmd: "alacritty --class=Wiremix -e wiremix" },
		{
			name: "WiFi",
			icon: "",
			cmd: "rfkill unblock wifi && alacritty --class=Impala -e impala",
		},
		{
			name: "Bluetooth",
			icon: "󰂯",
			cmd: "rfkill unblock bluetooth && blueberry",
		},
		{ name: "Power Profile", icon: "󱐋", cmd: "omarchy-menu power" },
		{
			name: "Monitors",
			icon: "󰍹",
			cmd: "alacritty -e nvim ~/.config/hypr/monitors.conf",
		},
		{ name: "DNS", icon: "󰱔", cmd: "omarchy-setup-dns" },
		{ name: "Fingerprint", icon: "󰈷", cmd: "omarchy-setup-fingerprint" },
		{ name: "Fido2", icon: "", cmd: "omarchy-setup-fido2" },
	];

	return (
		<List searchBarPlaceholder="Search setup options...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Configure"
								icon={Icon.Gear}
								onAction={async () => {
									await runCommand(item.cmd, `Setup ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for System submenu
function SystemMenu() {
	const items = [
		{ name: "Lock", icon: "", cmd: "omarchy-lock-screen" },
		{ name: "Screensaver", icon: "󱄄", cmd: "omarchy-launch-screensaver force" },
		{ name: "Suspend", icon: "󰤄", cmd: "systemctl suspend" },
		{ name: "Relaunch Session", icon: "", cmd: "uwsm stop" },
		{ name: "Restart", icon: "󰜉", cmd: "systemctl reboot" },
		{ name: "Shutdown", icon: "󰐥", cmd: "systemctl poweroff" },
	];

	return (
		<List searchBarPlaceholder="Search system actions...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Execute"
								icon={Icon.Power}
								onAction={async () => {
									await runCommand(item.cmd, item.name);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Main Power Menu component
export default function PowerMenu() {
	return (
		<List searchBarPlaceholder="Search power menu...">
			<List.Item
				title="Learn"
				icon="󰧑"
				keywords={["help", "documentation", "keybindings"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Learn Menu"
							icon={Icon.ArrowRight}
							target={<LearnMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Capture"
				icon=""
				keywords={["screenshot", "screenrecord", "recording", "color"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Capture Menu"
							icon={Icon.ArrowRight}
							target={<CaptureMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Toggle"
				icon="󰔎"
				keywords={["switch", "enable", "disable"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Toggle Menu"
							icon={Icon.ArrowRight}
							target={<ToggleMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Style"
				icon=""
				keywords={["theme", "appearance", "font", "background"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Style Menu"
							icon={Icon.ArrowRight}
							target={<StyleMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Setup"
				icon=""
				keywords={["configure", "settings", "preferences"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Setup Menu"
							icon={Icon.ArrowRight}
							target={<SetupMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Install"
				icon="󰉉"
				keywords={["add", "download", "get"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Install Menu"
							icon={Icon.ArrowRight}
							target={<InstallMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Remove"
				icon="󰭌"
				keywords={["uninstall", "delete"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Remove Menu"
							icon={Icon.ArrowRight}
							target={<RemoveMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Update"
				icon=""
				keywords={["upgrade", "refresh"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Update Menu"
							icon={Icon.ArrowRight}
							target={<UpdateMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="About"
				icon=""
				keywords={["info", "system", "version"]}
				actions={
					<ActionPanel>
						<Action
							title="Show System Info"
							icon={Icon.Info}
							onAction={async () => {
								await runCommand(
									"alacritty --class Omarchy -o font.size=9 -e bash -c 'fastfetch; read -n 1 -s'",
									"About",
								);
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="System"
				icon=""
				keywords={["power", "shutdown", "restart", "lock"]}
				actions={
					<ActionPanel>
						<Action.Push
							title="Open System Menu"
							icon={Icon.ArrowRight}
							target={<SystemMenu />}
						/>
					</ActionPanel>
				}
			/>
		</List>
	);
}

// Additional menus that were referenced but need implementation

// Component for Install submenu
function InstallMenu() {
	return (
		<List searchBarPlaceholder="Search install options...">
			<List.Item
				title="Package"
				icon="󰣇"
				actions={
					<ActionPanel>
						<Action
							title="Install Package"
							icon={Icon.Download}
							onAction={async () => {
								await runCommand(
									"alacritty -e omarchy-pkg-install",
									"Install Package",
								);
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="AUR Package"
				icon="󰣇"
				actions={
					<ActionPanel>
						<Action
							title="Install AUR Package"
							icon={Icon.Download}
							onAction={async () => {
								await runCommand(
									"alacritty -e omarchy-pkg-aur-install",
									"Install AUR Package",
								);
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Web App"
				icon=""
				actions={
					<ActionPanel>
						<Action
							title="Install Web App"
							icon={Icon.Download}
							onAction={async () => {
								await runCommand("omarchy-webapp-install", "Install Web App");
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="TUI App"
				icon=""
				actions={
					<ActionPanel>
						<Action
							title="Install TUI App"
							icon={Icon.Download}
							onAction={async () => {
								await runCommand("omarchy-tui-install", "Install TUI App");
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Development"
				icon="󰵮"
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Development Menu"
							icon={Icon.ArrowRight}
							target={<DevelopmentMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Editors"
				icon=""
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Editors Menu"
							icon={Icon.ArrowRight}
							target={<EditorsMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="AI Tools"
				icon="󱚤"
				actions={
					<ActionPanel>
						<Action.Push
							title="Open AI Tools Menu"
							icon={Icon.ArrowRight}
							target={<AIToolsMenu />}
						/>
					</ActionPanel>
				}
			/>
		</List>
	);
}

// Component for Development submenu
function DevelopmentMenu() {
	const items = [
		{ name: "Ruby on Rails", icon: "󰫏", cmd: "omarchy-install-dev-env ruby" },
		{ name: "Docker DBs", icon: "", cmd: "omarchy-install-docker-dbs" },
		{ name: "Node.js", icon: "", cmd: "omarchy-install-dev-env node" },
		{ name: "Bun", icon: "", cmd: "omarchy-install-dev-env bun" },
		{ name: "Deno", icon: "", cmd: "omarchy-install-dev-env deno" },
		{ name: "Go", icon: "", cmd: "omarchy-install-dev-env go" },
		{ name: "PHP", icon: "", cmd: "omarchy-install-dev-env php" },
		{ name: "Python", icon: "", cmd: "omarchy-install-dev-env python" },
		{ name: "Elixir", icon: "", cmd: "omarchy-install-dev-env elixir" },
		{ name: "Rust", icon: "", cmd: "omarchy-install-dev-env rust" },
		{ name: "Java", icon: "", cmd: "omarchy-install-dev-env java" },
		{ name: ".NET", icon: "", cmd: "omarchy-install-dev-env dotnet" },
	];

	return (
		<List searchBarPlaceholder="Search development environments...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Install"
								icon={Icon.Download}
								onAction={async () => {
									await runCommand(item.cmd, `Install ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for Editors submenu
function EditorsMenu() {
	const items = [
		{
			name: "VSCode",
			icon: "",
			cmd: "sudo pacman -S --noconfirm visual-studio-code-bin",
		},
		{ name: "Cursor", icon: "", cmd: "yay -S --noconfirm cursor-bin" },
		{ name: "Zed", icon: "", cmd: "sudo pacman -S --noconfirm zed" },
		{
			name: "Sublime Text",
			icon: "",
			cmd: "yay -S --noconfirm sublime-text-4",
		},
		{ name: "Helix", icon: "", cmd: "sudo pacman -S --noconfirm helix" },
		{
			name: "Emacs",
			icon: "",
			cmd: "sudo pacman -S --noconfirm emacs-wayland",
		},
	];

	return (
		<List searchBarPlaceholder="Search editors...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Install"
								icon={Icon.Download}
								onAction={async () => {
									await runCommand(item.cmd, `Install ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for AI Tools submenu
function AIToolsMenu() {
	const items = [
		{
			name: "Claude Code",
			icon: "󱚤",
			cmd: "sudo pacman -S --noconfirm claude-code",
		},
		{
			name: "LM Studio",
			icon: "󱚤",
			cmd: "sudo pacman -S --noconfirm lmstudio",
		},
		{ name: "Ollama", icon: "󱚤", cmd: "sudo pacman -S --noconfirm ollama" },
	];

	return (
		<List searchBarPlaceholder="Search AI tools...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Install"
								icon={Icon.Download}
								onAction={async () => {
									await runCommand(item.cmd, `Install ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for Remove submenu
function RemoveMenu() {
	const items = [
		{ name: "Package", icon: "󰣇", cmd: "alacritty -e omarchy-pkg-remove" },
		{ name: "Web App", icon: "", cmd: "omarchy-webapp-remove" },
		{ name: "TUI App", icon: "", cmd: "omarchy-tui-remove" },
		{ name: "Theme", icon: "󰸌", cmd: "omarchy-theme-remove" },
		{
			name: "Fingerprint",
			icon: "󰈷",
			cmd: "omarchy-setup-fingerprint --remove",
		},
		{ name: "Fido2", icon: "", cmd: "omarchy-setup-fido2 --remove" },
	];

	return (
		<List searchBarPlaceholder="Search remove options...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Remove"
								icon={Icon.Trash}
								onAction={async () => {
									await runCommand(item.cmd, `Remove ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

// Component for Update submenu
function UpdateMenu() {
	return (
		<List searchBarPlaceholder="Search update options...">
			<List.Item
				title="Omarchy"
				icon=""
				actions={
					<ActionPanel>
						<Action
							title="Update"
							icon={Icon.Download}
							onAction={async () => {
								await runCommand("omarchy-update", "Update Omarchy");
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="System Packages"
				icon=""
				actions={
					<ActionPanel>
						<Action
							title="Update"
							icon={Icon.Download}
							onAction={async () => {
								await runCommand(
									"omarchy-update-system-pkgs",
									"Update System Packages",
								);
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Themes"
				icon="󰸌"
				actions={
					<ActionPanel>
						<Action
							title="Update"
							icon={Icon.Download}
							onAction={async () => {
								await runCommand("omarchy-theme-update", "Update Themes");
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Restart Services"
				icon=""
				actions={
					<ActionPanel>
						<Action.Push
							title="Open Restart Services Menu"
							icon={Icon.ArrowRight}
							target={<RestartServicesMenu />}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="Timezone"
				icon=""
				actions={
					<ActionPanel>
						<Action
							title="Update"
							icon={Icon.Download}
							onAction={async () => {
								await runCommand("omarchy-cmd-tzupdate", "Update Timezone");
							}}
						/>
					</ActionPanel>
				}
			/>
			<List.Item
				title="User Password"
				icon=""
				actions={
					<ActionPanel>
						<Action
							title="Change Password"
							icon={Icon.Key}
							onAction={async () => {
								await runCommand("alacritty -e passwd", "Change Password");
							}}
						/>
					</ActionPanel>
				}
			/>
		</List>
	);
}

// Component for Restart Services submenu
function RestartServicesMenu() {
	const items = [
		{ name: "Hypridle", icon: "", cmd: "omarchy-restart-hypridle" },
		{ name: "Hyprsunset", icon: "", cmd: "omarchy-restart-hyprsunset" },
		{ name: "Swayosd", icon: "", cmd: "omarchy-restart-swayosd" },
		{ name: "Walker", icon: "󰌧", cmd: "omarchy-restart-walker" },
		{ name: "Waybar", icon: "󰍜", cmd: "omarchy-restart-waybar" },
		{ name: "WiFi", icon: "󱚾", cmd: "omarchy-restart-wifi" },
		{ name: "Bluetooth", icon: "󰂯", cmd: "omarchy-restart-bluetooth" },
	];

	return (
		<List searchBarPlaceholder="Search services...">
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					actions={
						<ActionPanel>
							<Action
								title="Restart"
								icon={Icon.RotateClockwise}
								onAction={async () => {
									await runCommand(item.cmd, `Restart ${item.name}`);
								}}
							/>
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}
