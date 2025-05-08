#!/usr/bin/env bash
# exit on error
set -o errexit

# Set Puppeteer cache path
export PUPPETEER_CACHE_DIR="/opt/render/project/puppeteer"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-$HOME/.cache}"

# Install Node dependencies
npm install

# Optional: Build TypeScript
npm run build

# Manually install Chromium
echo "Installing Chromium..."
CHROMIUM_DIR="/opt/render/project/puppeteer/chromium"
CHROMIUM_BIN="$CHROMIUM_DIR/chrome"

# Download Chromium binary
if [ ! -f "$CHROMIUM_BIN" ]; then
  echo "Downloading Chromium binary..."
  mkdir -p "$CHROMIUM_DIR"
  wget https://download-chromium.appspot.com/dl/Linux_x64 -O "$CHROMIUM_BIN"
  chmod +x "$CHROMIUM_BIN"
else
  echo "Chromium binary already exists."
fi

# Set path for Puppeteer to use this binary
export PUPPETEER_EXECUTABLE_PATH="$CHROMIUM_BIN"
