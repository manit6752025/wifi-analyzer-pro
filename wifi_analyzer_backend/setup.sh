#!/bin/bash
# WiFi Analyzer Pro - One-shot setup & launch for Raspberry Pi
# Usage: sudo bash setup.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   WiFi Analyzer Pro - Setup Script   ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── 1. Node.js ────────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "[*] Installing Node.js 18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
else
  echo "[✓] Node.js $(node -v) found"
fi

# ── 2. npm deps + build frontend ─────────────────────────────────────────────
echo "[*] Installing npm dependencies..."
cd "$ROOT_DIR"
npm install

echo "[*] Building frontend..."
npm run build

echo "[*] Copying dist/ to backend folder..."
rm -rf "$SCRIPT_DIR/dist"
cp -r "$ROOT_DIR/dist" "$SCRIPT_DIR/dist"

# ── 3. Python deps ────────────────────────────────────────────────────────────
echo "[*] Installing Python dependencies..."
pip3 install psutil --quiet

# ── 4. Launch ─────────────────────────────────────────────────────────────────
echo ""
echo "[✓] Setup complete!"
echo "[✓] Starting WiFi Analyzer Pro on http://0.0.0.0:199 ..."
echo "[✓] Open in browser: http://$(hostname -I | awk '{print $1}'):199"
echo ""
sudo python3 "$SCRIPT_DIR/server.py"
