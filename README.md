# WiFi Analyzer Pro

Real-time WiFi diagnostic dashboard — Python backend + React frontend.

Built by [@manit6752025](https://github.com/manit6752025)

---

## Features

- **Network Scanner** — live scan with SSID, BSSID, RSSI, channel, band, security type, SNR, link speed
- **AP Deep Scan** — per-access-point breakdown and analysis
- **PHY Info** — physical layer stats from the wireless interface
- **Link Stats** — TX/RX counters, retries, dropped packets
- **Diagnostics** — latency, DNS resolution, gateway reachability
- **Channel Chart** — visualise channel congestion across 2.4GHz and 5GHz
- **Signal History** — live rolling chart of signal strength over time
- **Heatmap** — grid-based signal heatmap
- **Band Steering** — analysis panel for 2.4GHz vs 5GHz client distribution
- **Demo Mode** — works without root/hardware using mock data

---

## Quick Start

### Raspberry Pi
```bash
sudo bash wifi_analyzer_backend/setup.sh
```
Open `http://<pi-ip>:199`

### Raspberry Pi — Standalone ARM64 Binary
```bash
bash wifi_analyzer_backend/build_arm64_binary.sh
sudo bash wifi_analyzer_backend/run_arm64.sh
```
No Python needed on the target device after build.

### Windows 11
Run `install_windows.bat` as Administrator, then open `http://localhost:199`

### Manual
```bash
npm install && npm run build
cp -r dist wifi_analyzer_backend/dist
sudo python3 wifi_analyzer_backend/server.py
```

---

## Auto-start on Boot (Pi systemd)

```bash
sudo tee /etc/systemd/system/wifi-analyzer.service << EOF2
[Unit]
Description=WiFi Analyzer Pro
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/wifi-analyzer-pro/wifi_analyzer_backend/server.py
WorkingDirectory=/home/pi/wifi-analyzer-pro/wifi_analyzer_backend
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF2

sudo systemctl enable wifi-analyzer
sudo systemctl start wifi-analyzer
```

---

## API Endpoints (port 199)

| Endpoint | Description |
|---|---|
| `/api/scan` | WiFi network scan |
| `/api/system` | CPU/RAM/OS info |
| `/api/phy` | PHY layer stats |
| `/api/link` | TX/RX counters |
| `/api/diagnostics` | Latency/DNS/gateway |
| `/health` | Health check |

---

## Stack

- **Frontend** — React, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide
- **Backend** — Python 3.8+, psutil, iw/iwconfig (Linux), pywifi (Windows)
- **Platforms** — Linux, Raspberry Pi (ARM64), Windows 11

---

## Requirements

- Python 3.8+
- Node.js 18+
- Root/Administrator privileges for live WiFi scanning

## Platform Notes

| Platform | Live Scanning | Demo Mode |
|---|---|---|
| Linux / Raspberry Pi | ✅ | ✅ |
| Windows 11 | ✅ | ✅ |
| macOS | ❌ (no iw) | ✅ |
