import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, Radio, BarChart2, Map, ArrowRightLeft, Terminal, Circle, Cpu, Activity, Globe, Search, Network, Zap, Download, ShieldAlert } from 'lucide-react';
import useWifiData from '../hooks/useWifiData';
import StatsBar from '../components/wifi/StatsBar';
import NetworkCard from '../components/wifi/NetworkCard';
import ChannelChart from '../components/wifi/ChannelChart';
import SignalHistoryChart from '../components/wifi/SignalHistoryChart';
import RadarSweep from '../components/wifi/RadarSweep';
import HeatmapGrid from '../components/wifi/HeatmapGrid';
import BandSteeringPanel from '../components/wifi/BandSteeringPanel';
import PhyInfoPanel from '../components/wifi/PhyInfoPanel';
import LinkStatsPanel from '../components/wifi/LinkStatsPanel';
import DiagnosticsPanel from '../components/wifi/DiagnosticsPanel';
import APDeepScanPanel from '../components/wifi/APDeepScanPanel';
import DeviceDiscoveryPanel from '../components/wifi/DeviceDiscoveryPanel';
import SpeedTestPanel from '../components/wifi/SpeedTestPanel';
import RogueAPPanel from '../components/wifi/RogueAPPanel';
import ChannelRecommendPanel from '../components/wifi/ChannelRecommendPanel';
import PacketLossHistory from '../components/wifi/PacketLossHistory';

const TABS = [
  { id: 'networks', label: 'Networks', icon: Wifi },
  { id: 'apscan', label: 'AP Deep Scan', icon: Search },
  { id: 'phy', label: 'PHY Info', icon: Cpu },
  { id: 'link', label: 'Link Stats', icon: Activity },
  { id: 'diagnostics', label: 'Diagnostics', icon: Globe },
  { id: 'channels', label: 'Channels', icon: BarChart2 },
  { id: 'history', label: 'Signal History', icon: Radio },
  { id: 'heatmap', label: 'Heatmap', icon: Map },
  { id: 'band', label: 'Band Steering', icon: ArrowRightLeft },
  { id: 'devices', label: 'Devices', icon: Network },
  { id: 'speedtest', label: 'Speed Test', icon: Zap },
  { id: 'rogue', label: 'Rogue AP', icon: ShieldAlert },
  { id: 'recommend', label: 'Best Channel', icon: Radio },
  { id: 'losshist', label: 'Loss History', icon: Activity },
];

export default function WiFiAnalyzer() {
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [diagHistory, setDiagHistory] = useState([]);
  const { networks, congestion, systemInfo, phyInfo, linkStats, diagnostics, devices, loading, error, backendConnected, lastScan, history, refresh } = useWifiData(true, refreshInterval);
  React.useEffect(() => {
    if (diagnostics) setDiagHistory(h => [...h.slice(-59), diagnostics]);
  }, [diagnostics]);
  const [activeTab, setActiveTab] = useState('networks');

  function exportData(fmt) {
    const data = { timestamp: new Date().toISOString(), networks, devices };
    const str = fmt === 'json' ? JSON.stringify(data, null, 2) : Object.keys(networks[0] || {}).join(',') + '\n' + networks.map(n => Object.values(n).join(',')).join('\n');
    const blob = new Blob([str], { type: fmt === 'json' ? 'application/json' : 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `wifi-scan-${Date.now()}.${fmt}`; a.click();
  }
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [sortBy, setSortBy] = useState('rssi');

  const sorted = [...networks].sort((a, b) => {
    if (sortBy === 'rssi') return b.rssi - a.rssi;
    if (sortBy === 'ssid') return (a.ssid || '').localeCompare(b.ssid || '');
    if (sortBy === 'channel') return a.channel - b.channel;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background grid-pattern font-inter">
      <div className="border-b border-border glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan">
                <Wifi className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">WiFi Analyzer Pro</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Circle className={`w-2 h-2 fill-current ${backendConnected ? 'text-green-400' : 'text-yellow-400'} pulse-signal`} />
                  {backendConnected ? `Live · ${systemInfo?.os || 'Connected'}` : 'Demo Mode · Start backend for live data'}
                  {lastScan && <span>· {lastScan.toLocaleTimeString()}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-3 py-1.5">
                  <Terminal className="w-3 h-3" />
                  Run: python wifi_analyzer.py
                </div>
              )}
              <select value={refreshInterval} onChange={e => setRefreshInterval(Number(e.target.value))} className="px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
                <option value={0}>Manual</option>
              </select>
              <button onClick={() => exportData('csv')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
              <button onClick={() => exportData('json')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
                <Download className="w-3.5 h-3.5" /> JSON
              </button>
              <button onClick={refresh} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all disabled:opacity-50">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{loading ? 'Scanning...' : 'Scan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <StatsBar networks={networks} systemInfo={systemInfo} backendConnected={backendConnected} lastScan={lastScan} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr,340px] gap-6">
          <div className="space-y-4">
            <div className="flex gap-1 p-1 glass rounded-xl overflow-x-auto">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeTab === tab.id ? 'bg-primary/10 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground'
                }`}>
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {activeTab === 'networks' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Sort:</span>
                      {['rssi', 'ssid', 'channel'].map(s => (
                        <button key={s} onClick={() => setSortBy(s)} className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          sortBy === s ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:border-primary/20'
                        }`}>
                          {s === 'rssi' ? 'Signal' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {sorted.map((net, i) => (
                        <NetworkCard key={net.bssid} network={net} index={i} isSelected={selectedNetwork?.bssid === net.bssid} onClick={() => setSelectedNetwork(prev => prev?.bssid === net.bssid ? null : net)} />
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'apscan' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">AP Deep Scan — All Nearby Networks</h2>
                    <APDeepScanPanel networks={sorted} />
                  </div>
                )}
                {activeTab === 'phy' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">PHY Layer Info — Connected Interface</h2>
                    <PhyInfoPanel phy={phyInfo} loading={loading && !phyInfo} />
                  </div>
                )}
                {activeTab === 'link' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Link Statistics — TX/RX Counters</h2>
                    <LinkStatsPanel link={linkStats} loading={loading && !linkStats} />
                  </div>
                )}
                {activeTab === 'diagnostics' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Network Diagnostics — Latency, DNS, Gateway</h2>
                    <DiagnosticsPanel diag={diagnostics} loading={loading && !diagnostics} />
                  </div>
                )}
                {activeTab === 'channels' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Channel Congestion Analysis</h2>
                    <ChannelChart networks={networks} congestion={congestion} />
                  </div>
                )}
                {activeTab === 'history' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Signal Strength History (Top 5)</h2>
                    <SignalHistoryChart networks={sorted.slice(0, 5)} history={history} />
                  </div>
                )}
                {activeTab === 'heatmap' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-2">Signal Heatmap</h2>
                    <p className="text-xs text-muted-foreground mb-4">Relative signal distribution of detected networks</p>
                    <HeatmapGrid networks={networks} />
                  </div>
                )}
                {activeTab === 'band' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Band Steering Analysis</h2>
                    <BandSteeringPanel networks={networks} />
                  </div>
                )}
                {activeTab === 'devices' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Device Discovery — ARP Table</h2>
                    <DeviceDiscoveryPanel devices={devices} loading={loading && !devices} />
                  </div>
                )}
                {activeTab === 'speedtest' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Speed Test</h2>
                    <SpeedTestPanel />
                  </div>
                )}
                {activeTab === 'rogue' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Rogue AP Detection</h2>
                    <RogueAPPanel networks={networks} />
                  </div>
                )}
                {activeTab === 'recommend' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Channel Recommendation</h2>
                    <ChannelRecommendPanel congestion={congestion} networks={networks} />
                  </div>
                )}
                {activeTab === 'losshist' && (
                  <div className="glass rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Packet Loss History</h2>
                    <PacketLossHistory diagnosticsHistory={diagHistory} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-5 flex flex-col items-center">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4 self-start">Radar Scan</h2>
              <RadarSweep networks={networks} scanning={true} />
              <div className="mt-3 text-xs text-muted-foreground text-center">
                {networks.length} network{networks.length !== 1 ? 's' : ''} detected
              </div>
            </div>

            <div className="glass rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">Strongest Signals</h2>
              {sorted.slice(0, 5).map(net => {
                const quality = Math.max(0, Math.min(100, 2 * (net.rssi + 100)));
                const color = net.rssi >= -55 ? 'bg-green-400' : net.rssi >= -65 ? 'bg-cyan-400' : net.rssi >= -75 ? 'bg-yellow-400' : 'bg-red-400';
                return (
                  <div key={net.bssid} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground font-medium truncate max-w-[140px]">{net.ssid || '<Hidden>'}</span>
                      <span className="font-mono text-muted-foreground">{net.rssi} dBm</span>
                    </div>
                    <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                      <motion.div className={`h-full ${color} rounded-full`} initial={{ width: 0 }} animate={{ width: `${quality}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {!backendConnected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-4 border border-yellow-400/20">
                <div className="flex items-start gap-3">
                  <Terminal className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">Enable Live Data</p>
                    <p className="text-xs text-muted-foreground">Run the Python backend to see your real WiFi networks:</p>
                    <code className="text-xs font-mono bg-secondary/80 rounded-lg px-3 py-2 block text-primary mt-2">
                      cd wifi_analyzer_backend<br />
                      python wifi_analyzer.py
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">Requires Python 3.8+ · Auto-installs dependencies</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
