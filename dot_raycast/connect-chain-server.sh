#!/bin/bash

# Raycast Script Command Template
#
# Duplicate this file and remove ".template." from the filename to get started.
# See full documentation here: https://github.com/raycast/script-commands
#
# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Connect to Chain Server
# @raycast.mode silent
#
# Optional parameters:
# @raycast.icon 📡
# @raycast.packageName Raycast Scripts

echo "Connecting to chain server..."
alacritty --config-file ~/.config/alacritty/alacritty.chain-server.toml
