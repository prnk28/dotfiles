import {
	List,
	ActionPanel,
	Action,
	showToast,
	Icon,
	Toast,
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
		name: "Apps",
		icon: "󰀻",
		cmd: "walker -p 'Launch…'",
		keywords: ["applications", "launch", "programs"],
	},
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

function MenuList({
	items,
	onBack,
}: {
	items: MenuItem[];
	onBack?: () => void;
}) {
	return (
		<List searchBarPlaceholder="Search menu items...">
			{onBack && (
				<List.Item
					title="← Back"
					icon={Icon.ArrowLeft}
					actions={
						<ActionPanel>
							<Action title="Go Back" onAction={onBack} />
						</ActionPanel>
					}
				/>
			)}
			{items.map((item) => (
				<List.Item
					key={item.name}
					title={item.name}
					icon={item.icon || Icon.Circle}
					keywords={item.keywords}
					actions={
						<ActionPanel>
							{item.submenu ? (
								<Action.Push
									title="Open Submenu"
									icon={Icon.ArrowRight}
									target={<MenuList items={item.submenu} onBack={() => {}} />}
								/>
							) : item.cmd ? (
								<Action
									title="Execute"
									icon={Icon.Terminal}
									onAction={async () => {
										await runCommand(item.cmd!, item.name);
									}}
								/>
							) : item.action ? (
								<Action
									title="Execute"
									icon={Icon.Terminal}
									onAction={item.action}
								/>
							) : null}
						</ActionPanel>
					}
				/>
			))}
		</List>
	);
}

export default function PowerMenu() {
	return <MenuList items={mainMenu} />;
}
