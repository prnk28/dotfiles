#!/bin/bash
set -euo pipefail

# Quick exit if Doppler is already installed
if command -v doppler &>/dev/null; then
  exit 0
fi

echo "Installing Doppler CLI..."

# Detect OS
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$ARCH" in
x86_64) ARCH="amd64" ;;
aarch64 | arm64) ARCH="arm64" ;;
esac

# Install based on OS
case "$OS" in
darwin)
  # macOS - use Homebrew if available
  if command -v brew &>/dev/null; then
    brew install dopplerhq/cli/doppler
  else
    # Direct download
    curl -fsSL https://cli.doppler.com/install.sh | sh
  fi
  ;;
linux)
  # Linux - use package manager or direct install
  if command -v apt-get &>/dev/null; then
    # Debian/Ubuntu
    curl -fsSL https://cli.doppler.com/install.sh | sh
  elif command -v yum &>/dev/null; then
    # RHEL/CentOS
    curl -fsSL https://cli.doppler.com/install.sh | sh
  else
    # Generic Linux
    curl -fsSL https://cli.doppler.com/install.sh | sh
  fi
  ;;
*)
  echo "Unsupported OS: $OS"
  exit 1
  ;;
esac

# Login to Doppler (this will prompt for authentication)
echo "Please authenticate with Doppler..."
doppler login
