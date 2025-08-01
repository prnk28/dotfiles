# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Chezmoi-managed dotfiles repository that manages configuration files across development environments. Chezmoi uses templates and state management to keep dotfiles synchronized across multiple machines.

## Key Commands

### Chezmoi Operations
- `chezmoi install` - Apply dotfiles to system
- `chezmoi update` - Pull and apply latest changes 
- `chezmoi uninstall` - Remove applied dotfiles
- `chezmoi apply` - Apply current state to destination
- `chezmoi diff` - Show differences between source and target
- `chezmoi add <file>` - Add file to chezmoi management
- `chezmoi edit <file>` - Edit managed file
- `chezmoi edit --apply <file>` - Edit and auto-apply on save
- `chezmoi edit --watch <file>` - Edit with live reload
- `chezmoi git pull -- --autostash --rebase && chezmoi diff` - Preview changes before applying

### Quick Setup Commands
- `curl -fsLS prad.codes/apply | sh` - Full installation on new machine
- `curl -fsLS prad.codes/oneshot | sh` - Transitory/container installation

### Development Environment Setup
- `task` (in dot_config/lazygit/) - Setup git configuration and run stow
- `task setup-git` - Configure git with user details and aliases

### Custom Scripts (Available in PATH via ~/.local/bin/)
- `tmux-sessions` - Interactive tmuxinator project selector with fzf
- `doppler-refresh` - Refresh Doppler environment configuration

## Architecture

### Template System
- Files ending in `.tmpl` are Chezmoi templates that get processed
- Templates support Go template syntax and Chezmoi data variables
- Key template data: `.chezmoi.os`, `.chezmoi.homeDir`

### Configuration Structure
- `dot_*` files map to `.*` in home directory
- `dot_config/` maps to `~/.config/`
- `executable_*` files become executable after processing
- `.chezmoiscripts/` contains installation/setup scripts:
  - `run_once_*` - Scripts that run only once (e.g., install homebrew, languages)
  - `run_onchange_*` - Scripts that run when their content changes (e.g., brew packages)

### Automation Scripts
The repository includes automated setup scripts for:
- **Package Management**: Homebrew (macOS), APT repositories (Linux)
- **Language Toolchains**: Go, Rust, Node.js tooling installation
- **Development Tools**: tmux plugins, repository fetching
- **Secret Management**: Doppler CLI setup and environment configuration

### Major Components

#### Shell Environment (`dot_zshrc.tmpl`)
- Modular shell configuration using Chezmoi templates
- Loads platform-specific configurations (Darwin/Linux)
- Integrates: golang, rust, node, python environments
- Includes Doppler secret management integration

#### Terminal & Multiplexing
- **Alacritty**: GPU-accelerated terminal with extensive theme collection
- **Tmux**: Terminal multiplexer with custom configuration
- **Starship**: Cross-shell prompt

#### Development Tools
- **Neovim**: AstroNvim v5+ configuration with custom plugins and Polish setup
- **Lazygit**: Git TUI with Taskfile automation for git setup
- **GitHub CLI**: Integrated credential management with custom aliases
- **Tmuxinator**: Session management with predefined project configurations

#### System Tools
- **Karabiner**: Keyboard customization (macOS) with complex modifications
- **SketchyBar**: Custom status bar (macOS) with widgets and helpers
- **Yazi**: Terminal file manager with plugins and custom themes
- **Television**: File/content finder with custom channels
- **AeroSpace**: Tiling window manager configuration (macOS)

#### Themes & Styling
- Extensive Base16 color scheme collection for Alacritty
- Consistent theming across tools (cyberdream, catppuccin variants)

### Secret Management
- Doppler CLI integration for environment secrets
- Auto-installation script: `.install-doppler.sh`
- Template-based environment loading

### Platform Support
- Primary: macOS (Darwin) with Homebrew
- Secondary: Linux with various package managers
- Architecture detection for arm64/amd64

## File Naming Conventions

- `dot_*` → `.*` (hidden files)
- `executable_*` → executable files  
- `*.tmpl` → processed templates
- `private_*` → files with restricted permissions

## Template Data Access

Access Chezmoi variables in templates:
- `{{ .chezmoi.homeDir }}` - Home directory path
- `{{ .chezmoi.os }}` - Operating system
- `{{ if eq .chezmoi.os "darwin" }}` - Platform conditionals
- `{{ template "shell/golang" . }}` - Include shell templates for modular configuration

## Working with This Repository

### Adding New Configurations
1. Add files using `chezmoi add <file>` to bring them under management
2. Use appropriate prefixes (`dot_`, `executable_`, `private_`) for proper handling
3. Convert to templates (`.tmpl`) when platform-specific logic is needed

### Managing Scripts
- Place one-time setup scripts in `.chezmoiscripts/run_once_*`
- Use `run_onchange_*` for scripts that should run when their content changes
- Executable scripts go in `dot_local/bin/executable_*` for PATH availability

### Shell Configuration
The modular shell configuration uses Chezmoi templates to load:
- Language environments (golang, rust, node, python)
- Interactive tools initialization
- Platform-specific configurations
- User aliases and functions