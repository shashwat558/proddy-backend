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

# Force install Chromium using Puppeteer
echo "Installing Chromium..."
npx puppeteer install --chrome-executable-const=chromium

# Check if Chromium was installed successfully
if ! command -v chromium &> /dev/null; then
  echo "Chromium could not be installed or is missing"
  exit 1
fi

# Save Puppeteer cache (Render persists build cache dirs)
if [ -d "$XDG_CACHE_HOME/puppeteer" ]; then
  echo "Caching Puppeteer Chromium..."
  mkdir -p "$PUPPETEER_CACHE_DIR"
  cp -R "$XDG_CACHE_HOME/puppeteer/"* "$PUPPETEER_CACHE_DIR"
else
  echo "No Puppeteer cache found to save."
fi
