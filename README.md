# WiFi Analyzer Pro

Real-time WiFi diagnostic dashboard — Python backend + React frontend.

Built by [@manit6752025](https://github.com/manit6752025)

---

## Features

- **Network Scanner** — live WiFi scanning with SSID, BSSID, RSSI, SNR, channel, frequency, security type and link speed
- **AP Deep Scan** — detailed per-access-point analysis and wireless metrics
- **PHY Information** — wireless interface capabilities, bitrate and physical layer statistics
- **Link Statistics** — TX/RX counters, retries, dropped packets and throughput monitoring
- **Diagnostics** — latency, DNS resolution, gateway reachability, packet loss and jitter analysis
- **Devices** — discover all devices on the network with MAC vendor lookup, device identification and gateway highlighting
- **Channel Congestion Analysis** — visualise channel usage across 2.4GHz and 5GHz bands
- **Best Channel Recommendations** — automatically recommends the least congested WiFi channel
- **Rogue AP Detection** — detect spoofed or untrusted access points using trusted SSID/BSSID verification
- **Signal History** — live rolling graph of WiFi signal strength over time
- **Packet Loss History** — historical packet loss, latency and jitter graphs from recent scans
- **Heatmap** — grid-based WiFi signal strength heatmap for coverage analysis
- **Band Steering Analysis** — compare client distribution across 2.4GHz and 5GHz bands
- **Integrated Speed Test** — measure download and upload performance directly from the dashboard
- **Responsive Modern UI** — glassmorphism interface with real-time updates and animated charts
- **Cross Platform** — Linux, Raspberry Pi, Windows 11 and macOS support
- **Demo Mode** — explore every feature using realistic mock data without requiring hardware or root privileges

---

## Quick Start

### Raspberry Pi
```bash
sudo bash wifi_analyzer_backend/setup.sh
```

Open:

```
http://<pi-ip>:199
```

### Raspberry Pi — Standalone ARM64 Binary

```bash
bash wifi_analyzer_backend/build_arm64_binary.sh
sudo bash wifi_analyzer_backend/run_arm64.sh
```

No Python installation is required on the target device after building.

### Windows 11

Run:

```bash
install_windows.bat
```

as **Administrator**, then open:

```
http://localhost:199
```

### Manual Installation

```bash
npm install
npm run build

cp -r dist wifi_analyzer_backend/dist

sudo python3 wifi_analyzer_backend/server.py
```

---

## Auto-start on Boot (Raspberry Pi systemd)

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

## API Endpoints

| Endpoint | Description |
|-----------|-------------|
| `/api/scan` | Live WiFi network scan |
| `/api/system` | CPU, RAM and operating system information |
| `/api/phy` | Wireless PHY statistics |
| `/api/link` | TX/RX link statistics |
| `/api/diagnostics` | Network diagnostics |
| `/health` | Health check |

---

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- Lucide Icons

### Backend

- Python 3.8+
- psutil
- iw / iwconfig (Linux)
- pywifi (Windows)

### Supported Platforms

- Linux
- Raspberry Pi (ARM64)
- Windows 11
- macOS

---

## Requirements

- Python 3.8+
- Node.js 18+
- Root / Administrator privileges for live WiFi scanning

---

## Platform Support

| Platform | Live Scanning | Demo Mode |
|----------|---------------|-----------|
| Linux | ✅ | ✅ |
| Raspberry Pi | ✅ | ✅ |
| Windows 11 | ✅ | ✅ |
| macOS | ✅ | ✅ |

---

## Demo Mode

WiFi Analyzer Pro includes a fully functional **Demo Mode** that works without any backend, WiFi adapter or root privileges. It generates realistic wireless data, allowing you to explore every dashboard, chart and analysis tool before deploying to real hardware. Once the backend is running, the application automatically switches to live data.

---

## Pro Branding

The **Pro** in WiFi Analyzer Pro reflects its enterprise-grade capabilities, including:

- PHY layer statistics
- WPA3 detection
- Signal quality metrics
- Channel congestion analysis
- Rogue access point detection
- Packet loss monitoring
- Historical performance graphs
- Band steering analysis
- Device discovery
- AP deep scan

Features typically found only in commercial wireless analysis software.

---

## Changelog Summary

### v1.0.4

- Added Rogue AP Detection
- Added Best Channel Recommendations
- Added Packet Loss History graphs
- Expanded advanced WiFi diagnostics

### v1.0.3

- Added integrated Speed Test
- Performance improvements and UI refinements

### v1.0.2

- Added Devices tab
- MAC vendor lookup
- Automatic device type detection
- Gateway highlighting
- Cross-platform device discovery

### v1.0.1

- Added native macOS WiFi scanning
- Added system_profiler fallback for macOS 14+

### v1.0.0

- Initial release

---

## Support

WiFi Analyzer Pro is completely **free and open source**, developed and maintained by **Manit Arora**.

If you find the project useful, consider supporting development:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/manit6752025)

---

## Author

**Manit Arora**

- GitHub: https://github.com/manit6752025
- HackerOne: https://hackerone.com/irule675
- Ko-fi: https://ko-fi.com/manit6752025
