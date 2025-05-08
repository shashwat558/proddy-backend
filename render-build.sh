#!/usr/bin/env bash
# Exit on error
set -o errexit

# Set Puppeteer cache path
export PUPPETEER_CACHE_DIR="/opt/render/project/puppeteer"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-$HOME/.cache}"

# Install Node dependencies
npm install

# Optional: Build TS
npm run build

# Manually install Chromium
echo "Installing Chromium..."
CHROMIUM_DIR="$PUPPETEER_CACHE_DIR/chromium"
ZIP_FILE="$CHROMIUM_DIR/chromium.zip"
CHROMIUM_BIN="$CHROMIUM_DIR/chrome-linux/chrome"

if [ ! -f "$CHROMIUM_BIN" ]; then
  mkdir -p "$CHROMIUM_DIR"
  wget https://download-chromium.appspot.com/dl/Linux_x64 -O "$ZIP_FILE"
  unzip "$ZIP_FILE" -d "$CHROMIUM_DIR"
  chmod +x "$CHROMIUM_BIN"
  echo "Chromium installed at $CHROMIUM_BIN"
else
  echo "Chromium already exists."
fi
