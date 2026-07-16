<div align="center">

```
██╗    ██╗██╗███████╗██╗     ███████╗    ███╗   ██╗███████╗████████╗
██║    ██║██║██╔════╝██║     ██╔════╝    ████╗  ██║██╔════╝╚══██╔══╝
██║ █╗ ██║██║█████╗  ██║     ███████╗    ██╔██╗ ██║█████╗     ██║
██║███╗██║██║██╔══╝  ██║     ╚════██║    ██║╚██╗██║██╔══╝     ██║
╚███╔███╔╝██║██║     ██║     ███████║    ██║ ╚████║███████╗   ██║
 ╚══╝╚══╝ ╚═╝╚═╝     ╚═╝     ╚══════╝    ╚═╝  ╚═══╝╚══════╝   ╚═╝
                                                              PRO
```

# WiFi Analyzer Pro

**The most advanced open-source WiFi diagnostic platform**

[![Version](https://img.shields.io/badge/version-1.0.5-00d4ff?style=for-the-badge&logoColor=white)](https://github.com/manit6752025/wifi-analyzer-pro/releases)
[![License](https://img.shields.io/badge/license-MIT-a855f7?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Linux%20%7C%20Windows%20%7C%20macOS%20%7C%20Pi-22c55e?style=for-the-badge)](README.md)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![Python](https://img.shields.io/badge/Python-3.8%2B-f59e0b?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![HackerOne](https://img.shields.io/badge/HackerOne-irule675-ef4444?style=for-the-badge)](https://hackerone.com/irule675)

*Real-time WiFi diagnostic dashboard — Python backend + React frontend*

**Built by [@manit6752025](https://github.com/manit6752025)** · [HackerOne](https://hackerone.com/irule675) · [Ko-fi](https://ko-fi.com/manit6752025)

</div>

---

## What's New in v1.0.5 — The Monster Release

> This release adds **17 major feature categories**, a completely rewritten UI with animations, mobile app, and more. This is the biggest update in the project's history.

| Category | Features Added |
|---|---|
| 📡 Wireless Analysis | Live scan, AP deep scan, hidden SSID, rogue AP, Evil Twin, captive portal, mesh detection, 2.4/5/6GHz, WiFi 6/6E/7 |
| 📈 Signal Analytics | Live RSSI graph, SNR history, packet loss, jitter, link rate, signal prediction, stability/health scores |
| 🌐 Network Diagnostics | Traceroute, route viz, IPv4/v6, DNS bench, MTU test, gateway health, bufferbloat |
| ⚡ Speed Testing | Download, upload, ping, jitter, bufferbloat, multi-server, scheduled tests, history |
| 🖥️ System Monitor | CPU, RAM, temp, disk, processes, USB devices, WiFi adapter, driver, kernel info |
| 📡 PHY Info | MCS index, NSS, channel width, guard interval, bitrate, TX power, antenna chains |
| 🔌 Interface Monitor | RX/TX packets, errors, drops, retries, collisions, per-interface throughput |
| 🏠 Router Support | OpenWrt, DD-WRT, pfSense, OPNsense, UniFi, MikroTik, Omada, ASUS, GL.iNet |
| 📱 Device Discovery | MAC vendor, device type, OS fingerprint, IP history, bandwidth per device |
| 📊 Visualization | Heatmaps, coverage maps, channel graphs, topology graph, geographic maps |
| 📁 Export & Reports | CSV, JSON, PDF, HTML, scheduled reports, screenshots, config backup |
| 🔔 Alerts | Rogue AP, weak signal, packet loss, email, Discord, Slack, MQTT |
| 🤖 AI Features | AI health summary, auto troubleshooting, channel recommendation, optimization tips |
| 🌍 Remote Monitor | Multi-site, Pi agent, remote dashboard, RBAC, cloud sync, self-hosted |
| 🧰 Advanced Networking | WoL, ARP table, DHCP leases, DNS cache, port scan, TCP/UDP tests, SSL certs |
| 🔌 API & Integrations | REST API, WebSocket, MQTT, Prometheus, Grafana, Home Assistant, Node-RED |
| 📱 Mobile App | iOS + Android companion app (v1.0.5 beta) |

---

## Feature Showcase

### 📡 Wireless Analysis

```
SSID                  Band    Ch    Security  Wi-Fi   RSSI    SNR    Clients  Flags
────────────────────────────────────────────────────────────────────────────────────
ManitNet-AX3600       5GHz    36    WPA3      Wi-Fi 6 -42dBm  45dB   8
ManitNet-6GHz         6GHz    37    WPA3      Wi-Fi6E -45dBm  42dB   2
Optus_5G_Home         2.4GHz  6     WPA2      Wi-Fi 5 -58dBm  28dB   3
(hidden network)      2.4GHz  1     Open      Wi-Fi 4 -71dBm  14dB   0        ROGUE ⚠️
```

- **Live WiFi scanning** with auto-refresh
- **Hidden SSID detection** — finds cloaked networks
- **Evil Twin / Rogue AP warning** — Evil Twin detector with BSSID comparison
- **WPA/WPA2/WPA3 detection** with encryption details
- **WiFi 4/5/6/6E/7 capability detection**
- **2.4 / 5 / 6 GHz** full band support
- **Best channel recommendation** via congestion analysis
- **Captive portal detection**, **mesh network detection**, **band steering analysis**

### 📈 Signal Analytics

```
Signal Quality      ████████████████████░  94/100
Connection Stability ████████████████████░  88/100
Reliability         ████████████████████░  91/100
Overall Health      ████████████████████░  91/100
```

Live RSSI / SNR graphs, packet loss, latency, jitter, throughput, and link rate — all charted in real time.

### ⚡ Speed Test

```
Download   ████████████████████  924 Mbps
Upload     ████████████████░░░░  421 Mbps
Ping                             8ms
Jitter                           1.2ms
Bufferbloat                      A+
```

### 🤖 AI Network Health Summary

> *"Your network is generally healthy with 1 critical alert. ManitNet-AX3600 (5GHz) shows excellent signal at -42 dBm with WPA3 security. Your 6GHz band is underutilised — only 2 clients on ManitNet-6GHz despite 160MHz capability. **Immediate action required:** a rogue AP is mimicking your SSID. Your AdGuard Home at 172.19.137.189 is responding with 2ms DNS latency — excellent."*

---

## Platform Support

| Platform | Live Scanning | Demo Mode | Router API | Mobile App |
|---|---|---|---|---|
| Linux | ✅ | ✅ | ✅ | ✅ |
| Raspberry Pi | ✅ | ✅ | ✅ | ✅ |
| Windows 11 | ✅ | ✅ | ✅ | ✅ |
| macOS | ✅ | ✅ | ✅ | ✅ |
| iOS (v1.0.5 beta) | ✅ | ✅ | ✅ | — |
| Android (v1.0.5 beta) | ✅ | ✅ | ✅ | — |

---

## Quick Start

### Raspberry Pi (recommended)

```bash
sudo bash wifi_analyzer_backend/setup.sh
```

Open `http://<pi-ip>:199`

### Linux / macOS

```bash
npm install
npm run build
cd wifi_analyzer_backend && pip install -r requirements.txt
sudo python3 server.py
```

Open `http://localhost:199`

### Windows 11

Run `install_windows.bat` as Administrator, then open `http://localhost:199`

### Demo Mode (no hardware needed)

```bash
npm install && npm run dev
```

Works without backend — realistic fake data, all charts, all dashboards.

---

## Architecture

```
React Frontend  ←→  Python API (port 199)
     │                    │
     │          ┌─────────┼──────────┐
     │          │         │          │
  Recharts   WiFi       PHY      Diagnostics
  Framer     Scanner   Stats     Engine
  Motion     (iw/iwconfig/pywifi)
     │
  Tailwind CSS
  Vite build
```

## API Reference

| Endpoint | Description |
|---|---|
| `GET /api/scan` | Live WiFi scan — SSID, BSSID, RSSI, SNR, channel, security, clients |
| `GET /api/system` | CPU, RAM, temperature, disk, OS info |
| `GET /api/phy` | PHY stats, MCS, bitrate, antenna chains |
| `GET /api/link` | TX/RX packets, errors, drops, retries, throughput |
| `GET /api/diagnostics` | Ping, DNS, traceroute, MTU, packet loss |
| `GET /api/devices` | Connected devices, MAC vendor, gateway detection |
| `GET /api/speedtest` | Download/upload/ping speed test |
| `GET /api/alerts` | Active alerts feed |
| `WS /ws/live` | WebSocket live stream (new in v1.0.5) |
| `GET /health` | Backend health check |

Full interactive API docs at `http://localhost:199/docs` (new in v1.0.5).

---

## Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS · Recharts · Framer Motion · Lucide Icons

**Backend:** Python 3.8+ · psutil · iw / iwconfig · pywifi · speedtest-cli · scapy (optional)

**Integrations:** OpenWrt LuCI API · UniFi API · MikroTik RouterOS API · Prometheus · MQTT

---

## Roadmap

- [x] v1.0.0 — Initial release
- [x] v1.0.1 — macOS scanning
- [x] v1.0.2 — Device discovery
- [x] v1.0.3 — Speed test
- [x] v1.0.4 — Rogue AP, channel recommendations
- [x] v1.0.5 — **17 feature categories, animated UI, mobile app, AI features, REST API, WebSocket**
- [ ] v1.1.0 — Plugin SDK, multi-user remote, pcap capture
- [ ] v2.0.0 — Electron desktop app, cloud dashboard

---

## Author

**Manit Arora** — Sydney AU

- GitHub: [@manit6752025](https://github.com/manit6752025)
- HackerOne: [irule675](https://hackerone.com/irule675)
- Ko-fi: [manit6752025](https://ko-fi.com/manit6752025)

---

## License

MIT — see [LICENSE](LICENSE) for details.
