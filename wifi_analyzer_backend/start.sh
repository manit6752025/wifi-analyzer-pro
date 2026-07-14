#!/bin/bash
# WiFi Analyzer Pro - Start script (run after setup.sh)
# Usage: sudo bash start.sh
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$EUID" -ne 0 ]; then
  echo "[*] Re-running with sudo..."
  exec sudo bash "$0" "$@"
fi

echo "[✓] Starting WiFi Analyzer Pro on port 199..."
sudo python3 "$SCRIPT_DIR/server.py"
