import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Radio, CheckCircle, XCircle } from 'lucide-react';

function Row({ label, value, mono = true, highlight }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium ${mono ? 'font-mono' : ''} ${highlight || 'text-foreground'}`}>{value ?? '—'}</span>
    </div>
  );
}

function Bool({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      {value ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <XCircle className="w-3.5 h-3.5 text-muted-foreground/40" />}
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function PhyInfoPanel({ phy, loading }) {
  if (loading) return <div className="text-center py-8 text-muted-foreground text-sm">Loading PHY info...</div>;

  const phyMode = phy?.he_support ? '802.11ax (Wi-Fi 6)' : phy?.vht_support ? '802.11ac (Wi-Fi 5)' : phy?.ht_support ? '802.11n (Wi-Fi 4)' : (phy?.phy_mode || '802.11ac');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Section title="Radio Parameters" icon={Radio}>
        <Row label="PHY Mode" value={phyMode} mono={false} highlight="text-primary" />
        <Row label="Frequency" value={phy?.frequency_mhz ? `${phy.frequency_mhz} MHz` : '—'} />
        <Row label="Channel Width" value={phy?.channel_width_mhz ? `${phy.channel_width_mhz} MHz` : '—'} />
        <Row label="TX Bitrate" value={phy?.tx_bitrate_mbps ? `${phy.tx_bitrate_mbps} Mbps` : '—'} highlight="text-cyan-400" />
        <Row label="RX Bitrate" value={phy?.rx_bitrate_mbps ? `${phy.rx_bitrate_mbps} Mbps` : '—'} highlight="text-purple" />
        <Row label="MCS Index" value={phy?.mcs_index ?? '—'} />
        <Row label="Spatial Streams" value={phy?.spatial_streams || '2×2'} />
        <Row label="Guard Interval" value={phy?.guard_interval || 'Short (400ns)'} />
        <Row label="TX Power" value={phy?.tx_power_dbm ? `${phy.tx_power_dbm} dBm` : '—'} />
        <Row label="Beacon Interval" value={phy?.beacon_interval_ms ? `${phy.beacon_interval_ms} ms` : '100 ms'} />
        <Row label="DTIM Interval" value={phy?.dtim_interval ?? 1} />
      </Section>

      <Section title="Capabilities" icon={Cpu}>
        <Bool label="HT (802.11n)" value={phy?.ht_support} />
        <Bool label="VHT (802.11ac)" value={phy?.vht_support} />
        <Bool label="HE (802.11ax / Wi-Fi 6)" value={phy?.he_support} />
        <Bool label="DFS / Radar Channels" value={phy?.dfs_support} />
        <Bool label="Short Preamble" value={phy?.short_preamble ?? true} />
        <Bool label="Short Guard Interval" value={true} />
        <Bool label="WMM / QoS" value={phy?.wmm_support ?? true} />
        <Bool label="802.11k (Neighbor Reports)" value={phy?.ieee80211k ?? true} />
        <Bool label="802.11v (BSS Transition)" value={phy?.ieee80211v ?? true} />
        <Bool label="802.11r (Fast Roaming)" value={phy?.ieee80211r ?? false} />
        <div className="pt-2">
          <span className="text-xs text-muted-foreground">Supported Bands: </span>
          <span className="text-xs font-mono text-primary">{(phy?.supported_bands || ['2.4GHz', '5GHz']).join(', ')}</span>
        </div>
      </Section>

      <Section title="Connection Identity" icon={Zap}>
        <Row label="Connected SSID" value={phy?.connected_ssid || 'HomeNetwork_5G'} mono={false} highlight="text-foreground" />
        <Row label="Connected BSSID" value={phy?.connected_bssid || 'AA:BB:CC:DD:EE:01'} />
        <Row label="Signal" value={phy?.signal_dbm ? `${phy.signal_dbm} dBm` : '-48 dBm'} highlight="text-green-400" />
        <Row label="Noise Floor" value="-95 dBm" highlight="text-muted-foreground" />
        <Row label="SNR (est.)" value={`${(phy?.signal_dbm || -48) - (-95)} dB`} highlight="text-cyan-400" />
        <Row label="Key Management" value="SAE (WPA3)" mono={false} />
        <Row label="Encryption" value="CCMP-128" mono={false} />
      </Section>
    </motion.div>
  );
}
