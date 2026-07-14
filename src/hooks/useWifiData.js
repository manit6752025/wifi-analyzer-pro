import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = window.location.port === '199'
  ? `${window.location.protocol}//${window.location.hostname}:199`
  : 'http://localhost:8765';

const MOCK_NETWORKS = [
  { ssid: 'HomeNetwork_5G', bssid: 'AA:BB:CC:DD:EE:01', rssi: -48, channel: 36, band: '5GHz', frequency: 5.18, security: 'WPA3', security_detail: 'WPA3', noise: -95, snr: 47, rsrp: -48, rsrq: -8, sinr: 44, link_speed: 867, quality: 104 },
  { ssid: 'HomeNetwork_2G', bssid: 'AA:BB:CC:DD:EE:02', rssi: -55, channel: 6, band: '2.4GHz', frequency: 2.437, security: 'WPA2', security_detail: 'WPA2', noise: -95, snr: 40, rsrp: -55, rsrq: -10, sinr: 37, link_speed: 300, quality: 90 },
  { ssid: 'Neighbor_WiFi', bssid: 'AA:BB:CC:DD:EE:03', rssi: -68, channel: 11, band: '2.4GHz', frequency: 2.462, security: 'WPA2', security_detail: 'WPA2', noise: -95, snr: 27, rsrp: -68, rsrq: -14, sinr: 24, link_speed: 72, quality: 64 },
  { ssid: 'Office_Network', bssid: 'AA:BB:CC:DD:EE:04', rssi: -72, channel: 48, band: '5GHz', frequency: 5.24, security: 'WPA2/WPA3', security_detail: 'WPA2/WPA3', noise: -95, snr: 23, rsrp: -72, rsrq: -16, sinr: 20, link_speed: 216, quality: 56 },
  { ssid: 'GuestNet', bssid: 'AA:BB:CC:DD:EE:05', rssi: -80, channel: 1, band: '2.4GHz', frequency: 2.412, security: 'Open', security_detail: 'Open', noise: -95, snr: 15, rsrp: -80, rsrq: -19, sinr: 12, link_speed: 36, quality: 40 },
  { ssid: 'Corp_Secure', bssid: 'AA:BB:CC:DD:EE:06', rssi: -63, channel: 100, band: '5GHz', frequency: 5.5, security: 'WPA2', security_detail: 'WPA2-Enterprise', noise: -95, snr: 32, rsrp: -63, rsrq: -12, sinr: 29, link_speed: 433, quality: 74 },
  { ssid: 'IoT_Hub', bssid: 'AA:BB:CC:DD:EE:07', rssi: -85, channel: 6, band: '2.4GHz', frequency: 2.437, security: 'WPA2', security_detail: 'WPA2', noise: -95, snr: 10, rsrp: -85, rsrq: -20, sinr: 7, link_speed: 11, quality: 30 },
];

export default function useWifiData(autoRefresh = true, interval = 5000) {
  const [networks, setNetworks] = useState(MOCK_NETWORKS);
  const [congestion, setCongestion] = useState({ '2.4GHz': { 1: 2, 6: 3, 11: 1 }, '5GHz': { 36: 1, 48: 1, 100: 1 } });
  const [systemInfo, setSystemInfo] = useState({ os: 'Demo Mode', cpu_percent: 12, memory_percent: 58 });
  const [phyInfo, setPhyInfo] = useState(null);
  const [linkStats, setLinkStats] = useState(null);
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [lastScan, setLastScan] = useState(new Date());
  const [history, setHistory] = useState({});
  const [devices, setDevices] = useState([]);
  const timerRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [scanRes, sysRes, phyRes, linkRes, diagRes, devRes] = await Promise.all([
        fetch(`${API_BASE}/api/scan`, { signal: AbortSignal.timeout(4000) }),
        fetch(`${API_BASE}/api/system`, { signal: AbortSignal.timeout(4000) }),
        fetch(`${API_BASE}/api/phy`, { signal: AbortSignal.timeout(4000) }),
        fetch(`${API_BASE}/api/link`, { signal: AbortSignal.timeout(4000) }),
        fetch(`${API_BASE}/api/diagnostics`, { signal: AbortSignal.timeout(15000) }),
        fetch(`${API_BASE}/api/devices`, { signal: AbortSignal.timeout(10000) }),
      ]);
      const scanData = await scanRes.json();
      const sysData = await sysRes.json();
      const phyData = await phyRes.json();
      const linkData = await linkRes.json();
      const diagData = await diagRes.json();
      const devData = await devRes.json();
      setNetworks(scanData.networks || []);
      setCongestion(scanData.congestion || {});
      setSystemInfo(sysData);
      setPhyInfo(phyData);
      setLinkStats(linkData);
      setDiagnostics(diagData);
      setDevices(devData.devices || []);
      setBackendConnected(true);
      setError(null);
      setLastScan(new Date());
      setHistory(prev => {
        const now = Date.now();
        const updated = { ...prev };
        (scanData.networks || []).forEach(net => {
          const key = net.bssid;
          if (!updated[key]) updated[key] = [];
          updated[key] = [...updated[key].slice(-29), { t: now, rssi: net.rssi }];
        });
        return updated;
      });
    } catch {
      setBackendConnected(false);
      setError('Backend not reachable. Run python wifi_analyzer.py and refresh.');
      setNetworks(prev => prev.map(n => ({ ...n, rssi: n.rssi + Math.floor(Math.random() * 5 - 2) })));
      setLastScan(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (autoRefresh) timerRef.current = setInterval(fetchData, interval);
    return () => clearInterval(timerRef.current);
  }, [fetchData, autoRefresh, interval]);

  return { networks, congestion, systemInfo, phyInfo, linkStats, diagnostics, devices, loading, error, backendConnected, lastScan, history, refresh: fetchData };
}
