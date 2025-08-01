#!/bin/bash

set -eufo pipefail

echo "Installing GitHub CLI extensions..."

# List of extensions to install
extensions=(
    "mislav/gh-branch"
    "johnmanjiro13/gh-bump"
    "davidraviv/gh-clean-branches"
    "matt-bartel/gh-clone-org"
    "dlvhdr/gh-dash"
    "yuler/gh-download"
    "jrnxf/gh-eco"
    "redraw/gh-install"
    "valeriobelli/gh-milestone"
    "meiji163/gh-notify"
    "seachicken/gh-poi"
    "mona-actions/gh-repo-stats"
    "github/gh-skyline"
    "gpmtools/gh-task"
)

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first."
    exit 1
fi

# Install each extension
for extension in "${extensions[@]}"; do
    echo "Installing $extension..."
    if gh extension install "$extension" 2>/dev/null; then
        echo "✓ Successfully installed $extension"
    else
        echo "⚠ Failed to install $extension (may already be installed)"
    fi
done

echo "GitHub CLI extensions installation complete!"