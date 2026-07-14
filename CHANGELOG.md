# Changelog

## [1.0.0] - 2026-07-14

### Added
- Live WiFi network scanner (SSID, BSSID, RSSI, channel, band, security, SNR, link speed)
- AP Deep Scan panel
- PHY layer info panel
- Link stats panel (TX/RX counters, retries, drops)
- Diagnostics panel (latency, DNS, gateway checks)
- Channel congestion chart (2.4GHz + 5GHz)
- Signal history rolling chart
- Signal heatmap grid
- Band steering analysis panel
- Radar sweep visualisation
- Demo mode (mock data when no backend/root available)
- Standalone ARM64 binary build via PyInstaller (no Python on target)
- Windows 11 support via pywifi
- Auto-installer for Windows (install_windows.bat)
- systemd service support for Raspberry Pi auto-start
- REST API on port 199
