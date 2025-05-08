#!/usr/bin/env bash
# exit on error
set -o errexit

# Set Puppeteer cache path (Render-specific)
export PUPPETEER_CACHE_DIR="/opt/render/project/puppeteer"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-$HOME/.cache}"

# Install Node dependencies
npm install

# OPTIONAL: Run build step if using TypeScript
npm run build

# Manually install Chromium
echo "Installing Chromium..."
CHROMIUM_DIR="/opt/render/project/puppeteer/chromium"

# Download Chromium if not already installed
if [ ! -d "$CHROMIUM_DIR" ]; then
  echo "Chromium not found, downloading..."
  mkdir -p "$CHROMIUM_DIR"
  
  # Download the latest stable release of Chromium (Linux version)
  wget https://download-chromium.appspot.com/dl/Linux_x64 --no-check-certificate -O chromium.tar.gz

  # Extract Chromium into the appropriate directory
  tar -xzvf chromium.tar.gz -C "$CHROMIUM_DIR"
  rm chromium.tar.gz
else
  echo "Chromium is already installed."
fi

# Check if Chromium binary exists
if [ ! -f "$CHROMIUM_DIR/chrome" ]; then
  echo "Chromium installation failed or binary not found!"
  exit 1
fi

# Set environment variable for Puppeteer to use the correct Chromium path
export PUPPETEER_EXECUTABLE_PATH="$CHROMIUM_DIR/chrome"

# Cache Puppeteer binary


if [[ ! -d $PUPPETEER_CACHE_DIR]]; then
  echo "Caching Puppeteer Chromium..."
  mkdir -p "$PUPPETEER_CACHE_DIR"
  cp -R "$XDG_CACHE_HOME/puppeteer/"* "$PUPPETEER_CACHE_DIR"
else
  echo "No Puppeteer cache found to save."
fi
