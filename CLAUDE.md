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

### Development Environment Setup
- `task` (in dot_config/lazygit/) - Setup git configuration and run stow
- `task setup-git` - Configure git with user details and aliases

## Architecture

### Template System
- Files ending in `.tmpl` are Chezmoi templates that get processed
- Templates support Go template syntax and Chezmoi data variables
- Key template data: `.chezmoi.os`, `.chezmoi.homeDir`

### Configuration Structure
- `dot_*` files map to `.*` in home directory
- `dot_config/` maps to `~/.config/`
- `executable_*` files become executable after processing

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
- **Neovim**: AstroNvim v5+ configuration
- **Lazygit**: Git TUI with Taskfile automation
- **GitHub CLI**: Integrated credential management

#### System Tools
- **Karabiner**: Keyboard customization (macOS)
- **SketchyBar**: Custom status bar (macOS) 
- **Yazi**: Terminal file manager
- **Television**: File/content finder

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