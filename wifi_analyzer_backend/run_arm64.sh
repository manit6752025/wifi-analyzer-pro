#!/bin/bash
# WiFi Analyzer Pro - Run pre-built ARM64 binary
# Usage: sudo bash run_arm64.sh
# This script runs the pre-compiled standalone binary.
# Build it first with:  bash build_arm64_binary.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BINARY="$SCRIPT_DIR/dist/server"

if [ "$EUID" -ne 0 ]; then
  echo "[*] Re-running with sudo..."
  exec sudo bash "$0" "$@"
fi

if [ ! -f "$BINARY" ]; then
  echo "[!] Binary not found at $BINARY"
  echo "[!] Run build_arm64_binary.sh first to compile the binary."
  exit 1
fi

echo "[✓] Starting WiFi Analyzer Pro (ARM64 binary) on port 199..."
exec "$BINARY"
