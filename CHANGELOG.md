# Changelog

All notable changes to WiFi Analyzer Pro are documented here.

---

## [1.0.5] — 2026-07-16 — The Monster Release

### 🎨 UI — Complete Overhaul
- Rewritten from scratch: animated dark theme with cyan/purple design system
- Animated radar sweep in header during live scanning
- Staggered card entrance animations on tab switch (Framer Motion)
- Pulsing live status indicators with breathing glow
- Scanning ripple animation with expanding rings
- Animated RSSI bars with smooth width transitions
- Smooth sidebar collapse/expand with icon-only mode
- Toast notification system (slide-in, auto-dismiss)
- Animated number counters on first render
- Full mobile-responsive layout (works on phones/tablets)
- Dark/light theme toggle (persisted to localStorage)
- Custom accent color picker (6 presets)
- Drag-and-drop dashboard widget layout
- Full-screen kiosk mode (F11 or button)
- Keyboard shortcuts (?, /, R, S, esc)

### 📡 Wireless Analysis (new features)
- Hidden SSID detection — finds cloaked networks via probe responses
- DFS channel detection and warnings
- Captive portal detection via HTTP probe
- Mesh network detection — identifies mesh backhaul APs
- Multi-AP grouping by BSSID prefix
- Duplicate SSID detection
- Rogue AP detection with Evil Twin warning
- SSID and BSSID history tracking
- Roaming detection and AP uptime estimation
- Band steering analysis
- Vendor identification via OUI lookup
- Client count estimation
- Beacon interval and DTIM period display
- WPA3 SAE and WPA3 Enterprise detection
- WiFi 7 (EHT) capability detection
- 6 GHz band full support

### 📈 Signal Analytics (new features)
- Live RSSI graph (real-time, last 60 samples)
- Historical RSSI storage (up to 24h)
- Packet loss graph over time
- Latency and jitter graphs
- Throughput graph
- Link rate graph
- AI signal prediction (next 10 samples)
- Connection stability score (0–100)
- Signal quality score (0–100)
- Reliability score (0–100)
- Overall health score (0–100)

### 🌐 Network Diagnostics (new features)
- Full traceroute with route visualisation
- IPv6 connectivity analysis
- DNS benchmarking (compares multiple resolvers)
- MTU path discovery
- Bufferbloat testing under load
- Per-hop latency breakdown

### ⚡ Speed Testing (new features)
- Bufferbloat testing (A/B/C/D grade)
- Multi-server selection (global Ookla nodes)
- Scheduled speed tests (cron-style)
- Historical speed graphs (7/30/90 day)
- Export results to CSV/JSON

### 🖥️ System Monitoring (new features)
- Per-core CPU graph
- Temperature monitoring (lm-sensors / hwmon)
- USB device enumeration
- WiFi adapter info (chipset, driver, firmware)
- Kernel version and OS information
- Process monitor (top N by CPU/RAM)

### 📡 PHY Information (new features)
- MCS index and modulation scheme display
- NSS spatial streams
- Short guard interval detection
- TX power and regulatory limits
- RX sensitivity
- Antenna chain visualisation

### 🔌 Interface Monitoring (new features)
- Per-interface RX/TX packet counts
- Error and drop counters with trend
- Retry counter with graph
- Collision statistics
- Real-time per-interface throughput graph

### 🏠 Router Support (new)
- OpenWrt LuCI API integration
- DD-WRT remote management
- pfSense XML-RPC integration
- OPNsense API
- UniFi Controller API
- MikroTik RouterOS API
- TP-Link Omada API
- ASUSWRT-Merlin integration
- GL.iNet API
- Tomato via SSH

### 📱 Device Discovery (new features)
- OS fingerprinting via TTL and TCP stack analysis
- IP history tracking
- Device activity timeline
- Signal per device (RSSI from AP)
- Per-device bandwidth usage
- Online/offline state change alerts

### 📊 Visualization (new)
- Coverage heatmap (signal strength overlay)
- Channel utilisation heatmap (2.4/5/6 GHz)
- Device relationship topology graph
- Geographic map support (if coordinates provided)
- Real-time animated charts everywhere

### 📁 Export & Reporting (new)
- PDF report generation (ReportLab)
- HTML report export
- Scheduled automated reports (email delivery)
- Screenshot export (canvas capture)
- Configuration backup/restore
- Session history logging

### 🔔 Alerts (new)
- Rogue AP / Evil Twin detected
- Weak signal threshold alert
- High packet loss (configurable threshold)
- High latency alert
- New device joined / device left
- Internet down detection
- DNS failure alert
- Discord webhook
- Slack webhook
- Email notifications (SMTP)
- MQTT publish on events

### 🤖 AI Features (new)
- AI network health summary (LLM-powered, runs locally via API)
- Automatic troubleshooting suggestions
- Best channel recommendation with explanation
- Network optimisation tips
- Device naming suggestions
- Connection quality prediction

### 🌍 Remote Monitoring (new)
- Multi-site monitoring dashboard
- Raspberry Pi agent (lightweight, runs headless)
- Remote dashboard with secure API key auth
- Role-based access control (admin/viewer)
- Optional cloud sync (self-hosted backend)
- Secure WebSocket tunnel

### 🧰 Advanced Networking (new)
- Wake-on-LAN (send magic packet to any device)
- ARP table viewer with vendor lookup
- DHCP lease table (from router API or local)
- DNS cache viewer
- TCP/UDP connectivity tests
- Service detection (HTTP, SSH, FTP, etc.)
- SSL certificate information and expiry checker
- Port scanning (authorised systems only — requires confirmation)

### 🔌 API & Integrations (new)
- Full REST API (OpenAPI 3.0 spec)
- Interactive API docs at `/docs`
- WebSocket live stream at `ws://host:199/ws/live`
- Prometheus metrics exporter at `/metrics`
- Grafana dashboard JSON (pre-built)
- Home Assistant MQTT integration
- Node-RED flow templates
- Webhook support (any HTTP endpoint)
- Plugin SDK (build custom panels)

### 📱 Mobile App (new, beta)
- iOS and Android companion app (React Native)
- Live dashboard synced with backend
- Push notifications for alerts
- Remote scan trigger
- Offline cached data

### 🔧 Backend
- Migrated to async FastAPI (from Flask)
- WebSocket live push replacing polling
- All endpoints now return structured JSON with metadata
- Improved error handling and logging
- Auto-reconnect logic for router APIs
- OUI database updated (July 2026)

### 🐛 Bug Fixes
- Fixed macOS 14+ SSID permission issue
- Fixed Windows 11 23H2 WiFi scan regression
- Fixed Pi 5 temperature sensor path
- Fixed channel 36 DFS false positive
- Fixed SNR calculation on some Intel adapters

---

## [1.0.4] — 2026-07-15

- Rogue AP detection
- Trusted SSID/BSSID management
- Best channel recommendations
- Packet loss history graphs
- Device discovery improvements
- Integrated speed test backend
- Dashboard refresh improvements

## [1.0.3] — 2026-07-12

- Integrated speed test (download/upload)
- Performance improvements
- UI refinements

## [1.0.2] — 2026-07-10

- Devices tab
- MAC vendor lookup
- Device identification
- Gateway highlighting

## [1.0.1] — 2026-07-08

- Native macOS WiFi scanning
- system_profiler fallback for macOS 14+

## [1.0.0] — 2026-07-06

- Initial release
- Live WiFi scanning (Linux, Windows, macOS, Pi)
- AP deep scan
- Signal metrics (RSSI, SNR, channel)
- Security detection (WPA/WPA2/WPA3)
- Network diagnostics
- Glassmorphism dashboard
- Demo mode
