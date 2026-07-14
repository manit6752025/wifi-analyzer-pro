#!/bin/bash
# WiFi Analyzer Pro - Build standalone ARM64 binary using PyInstaller
# Run this on your Raspberry Pi (arm64) or any Linux arm64 machine.
# After building, copy 'dist/server' to any arm64 device and run:
#   sudo ./server
# No Python required on the target machine.

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  WiFi Analyzer Pro - ARM64 Builder   ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── 1. Check arch ─────────────────────────────────────────────────────────────
ARCH="$(uname -m)"
echo "[i] Architecture: $ARCH"
if [[ "$ARCH" != "aarch64" && "$ARCH" != "arm64" ]]; then
  echo "[!] Warning: Not running on arm64 ($ARCH). Binary will match host arch."
fi

# ── 2. Install PyInstaller ────────────────────────────────────────────────────
echo "[*] Installing PyInstaller and dependencies..."
pip3 install pyinstaller psutil --quiet

# ── 3. Build standalone binary ────────────────────────────────────────────────
echo "[*] Compiling server.py into standalone binary..."
cd "$SCRIPT_DIR"
pyinstaller --onefile --name server server.py

# ── 4. Copy dist folder next to binary ───────────────────────────────────────
if [ -d "$SCRIPT_DIR/dist_web" ]; then
  echo "[*] Copying web dist into binary dist folder..."
  cp -r "$SCRIPT_DIR/dist_web" "$SCRIPT_DIR/dist/dist"
fi

echo ""
echo "[✓] Binary built at: $SCRIPT_DIR/dist/server"
echo "[✓] Copy the entire dist/ folder to your ARM64 device and run:"
echo "      sudo ./server"
echo ""
echo "[i] Tip: place your compiled React app (npm run build output) as dist/dist/ next to the binary."
echo ""
