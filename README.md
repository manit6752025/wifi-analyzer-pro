# WiFi Analyzer Pro

Real-time WiFi diagnostic dashboard — Python backend + React frontend.

Built by @manit6752025

---

# Features

## Network Scanner

* Live WiFi network scanning
* SSID detection
* BSSID detection
* RSSI signal strength
* SNR measurement
* Channel detection
* Frequency information
* Security type detection
* Link speed monitoring

## AP Deep Scan

* Detailed per-access-point analysis
* Wireless metrics
* Signal quality analysis
* Access point comparison

## Wireless Analysis

* PHY information
* Wireless interface capabilities
* Physical layer statistics
* Bitrate information
* TX/RX link statistics
* Packet retries
* Dropped packets
* Throughput monitoring

## Network Intelligence

* Channel Congestion Analysis
* 2.4GHz and 5GHz channel analysis
* Automatic best channel recommendations
* Rogue AP Detection
* Trusted SSID/BSSID verification
* Signal history tracking
* Packet loss history
* Latency and jitter monitoring
* WiFi coverage heatmap
* Band steering analysis

## Devices

* Network device discovery
* MAC address lookup
* Device identification
* Gateway highlighting
* Connected client monitoring

## Diagnostics

* Gateway reachability testing
* DNS resolution testing
* Latency measurement
* Packet loss detection
* Jitter analysis
* Network health monitoring

## Speed Test

* Integrated internet speed test
* Download measurement
* Upload measurement
* Real-time performance monitoring

## Dashboard

* Modern glassmorphism interface
* Real-time updates
* Animated charts
* Responsive design
* CSV export
* JSON export
* Auto refresh intervals
* Demo mode

---

# Cross Platform Support

Supported platforms:

| Platform     | Live Scanning | Demo Mode |
| ------------ | ------------- | --------- |
| Linux        | ✅             | ✅         |
| Raspberry Pi | ✅             | ✅         |
| Windows 11   | ✅             | ✅         |
| macOS        | ✅             | ✅         |

---

# Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Recharts
* Framer Motion
* Lucide Icons

## Backend

* Python 3.8+
* psutil
* iw / iwconfig
* pywifi
* Linux wireless tools

---

# Requirements

## Software

* Node.js 18+
* Python 3.8+

## Permissions

Live WiFi scanning requires:

* Linux root privileges
* Windows Administrator privileges
* Supported wireless adapter

---

# Quick Start

## Raspberry Pi

Install:

```bash
sudo bash wifi_analyzer_backend/setup.sh
```

Open:

```
http://<pi-ip>:199
```

---

# Raspberry Pi ARM64 Standalone Binary

Build:

```bash
bash wifi_analyzer_backend/build_arm64_binary.sh
```

Run:

```bash
sudo bash wifi_analyzer_backend/run_arm64.sh
```

No Python installation is required on the target device after building.

---

# Windows 11

Run:

```bat
install_windows.bat
```

as Administrator.

Open:

```
http://localhost:199
```

---

# Manual Installation

Install frontend:

```bash
npm install
```

Build React application:

```bash
npm run build
```

Copy frontend:

```bash
cp -r dist wifi_analyzer_backend/dist
```

Install backend:

```bash
cd wifi_analyzer_backend
pip install -r requirements.txt
```

Start server:

```bash
sudo python3 server.py
```

Open:

```
http://localhost:199
```

---

# API Endpoints

| Endpoint           | Description                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `/api/scan`        | Live WiFi network scan with SSID, BSSID, RSSI, SNR, channel, frequency, security type, link speed and congestion analysis |
| `/api/system`      | CPU, RAM and operating system information                                                                                 |
| `/api/phy`         | Wireless PHY statistics, interface capabilities and physical layer information                                            |
| `/api/link`        | TX/RX link statistics, retries, drops and throughput monitoring                                                           |
| `/api/diagnostics` | Network diagnostics including latency, DNS resolution, gateway reachability, packet loss and jitter                       |
| `/api/devices`     | Connected device discovery with MAC information, device identification and gateway detection                              |
| `/api/speedtest`   | Integrated download and upload speed testing                                                                              |
| `/health`          | Backend health check                                                                                                      |

---

# Backend Architecture

WiFi Analyzer Pro uses:

```
React Frontend
       |
       |
       v
Python API Server
       |
       +-- WiFi Scanner
       |
       +-- PHY Statistics
       |
       +-- Link Statistics
       |
       +-- Diagnostics Engine
       |
       +-- Device Discovery
       |
       +-- Speed Test Engine
```

Backend server:

```
Port: 199
```

---

# Auto-start On Boot (Raspberry Pi systemd)

Create service:

```bash
sudo tee /etc/systemd/system/wifi-analyzer.service << EOF
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
EOF
```

Enable:

```bash
sudo systemctl enable wifi-analyzer
sudo systemctl start wifi-analyzer
```

---

# Demo Mode

WiFi Analyzer Pro includes a complete Demo Mode.

Demo Mode works without:

* WiFi hardware
* Backend server
* Root privileges

It provides:

* Realistic WiFi networks
* Dashboard previews
* Charts
* Heatmaps
* Diagnostics views

When the backend starts, the application automatically switches to live data.

---

# Pro Branding

The Pro in WiFi Analyzer Pro represents enterprise-grade wireless analysis capabilities:

* PHY layer statistics
* WPA3 detection
* Signal quality metrics
* Channel congestion analysis
* Rogue access point detection
* Packet loss monitoring
* Historical performance graphs
* Band steering analysis
* Device discovery
* AP deep scan

Features commonly found in commercial wireless analysis software.

---

# Changelog Summary

## v1.0.4

Added:

* Rogue AP Detection
* Trusted SSID/BSSID verification
* Best Channel Recommendations
* Packet Loss History graphs
* Expanded advanced WiFi diagnostics
* Device discovery improvements
* Integrated speed test backend
* Improved API integration
* Dashboard data refresh improvements

---

## v1.0.3

Added:

* Integrated Speed Test
* Download/upload measurements
* Performance improvements
* UI refinements

---

## v1.0.2

Added:

* Devices tab
* MAC vendor lookup
* Device identification
* Gateway highlighting
* Cross-platform device discovery

---

## v1.0.1

Added:

* Native macOS WiFi scanning
* system_profiler fallback for macOS 14+

---

## v1.0.0

Initial release.

---

# Security

WiFi Analyzer Pro runs locally.

No cloud account required.

Live scanning requires administrator/root permissions depending on platform.

---

# Support

WiFi Analyzer Pro is free and open source.

Author:

Manit Arora

GitHub:

https://github.com/manit6752025

HackerOne:

https://hackerone.com/irule675

Ko-fi:

https://ko-fi.com/manit6752025

---

# License

MIT License
