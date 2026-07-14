import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Wifi } from 'lucide-react';
import { getSignalColor } from './SignalStrengthBar';

function getVendor(bssid) {
  const oui = bssid?.replace(/:/g, '').substring(0, 6).toUpperCase();
  const ouis = {
    'AABBCC': 'Demo Device', '00904C': 'Epigram', 'F81A67': 'Ubiquiti', 'DC9FDB': 'Apple',
    '3C5AB4': 'Google', '606BBD': 'Cisco', 'A4C3F0': 'TP-Link', '00E0FC': 'Huawei',
    'B4750E': 'Netgear', '002272': 'Linksys',
  };
  return ouis[oui] || 'Unknown Vendor';
}

export default function APDeepScanPanel({ networks }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
      {networks.map((net) => {
        const color = getSignalColor(net.rssi);
        const vendor = getVendor(net.bssid);
        const isOpen = expanded === net.bssid;
        const htCaps = net.band === '5GHz' ? 'HT40+ VHT80 Short-GI-80' : 'HT20 HT40 Short-GI-40';
        const supportedRates = net.band === '5GHz' ? '6,9,12,18,24,36,48,54 Mbps' : '1,2,5.5,11,6,9,12,18,24,36,48,54 Mbps';

        return (
          <div key={net.bssid} className="glass rounded-xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/20 transition-colors" onClick={() => setExpanded(isOpen ? null : net.bssid)}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-lg ${color.bg}/10 border ${color.border}`}>
                  <Wifi className={`w-3.5 h-3.5 ${color.text}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{net.ssid || '<Hidden SSID>'}</div>
                  <div className="text-xs font-mono text-muted-foreground">{net.bssid} · {vendor}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-sm font-mono font-bold ${color.text}`}>{net.rssi} dBm</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/50 pt-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Identity</h4>
                      <InfoRow label="SSID" value={net.ssid || '<Hidden>'} />
                      <InfoRow label="BSSID (AP MAC)" value={net.bssid} />
                      <InfoRow label="Vendor (OUI)" value={vendor} mono={false} color="text-cyan-400" />
                      <InfoRow label="Hidden Network" value={!net.ssid ? 'Yes' : 'No'} mono={false} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Security</h4>
                      <InfoRow label="Encryption" value={net.security} mono={false} color={net.security === 'Open' ? 'text-red-400' : 'text-green-400'} />
                      <InfoRow label="Detail" value={net.security_detail || net.security} mono={false} />
                      <InfoRow label="Key Mgmt" value={net.security.includes('WPA3') ? 'SAE' : net.security.includes('WPA') ? 'PSK' : 'Open'} mono={false} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Radio</h4>
                      <InfoRow label="Band" value={net.band} color="text-primary" />
                      <InfoRow label="Channel" value={net.channel} />
                      <InfoRow label="Frequency" value={`${net.frequency} GHz`} />
                      <InfoRow label="Signal (RSSI)" value={`${net.rssi} dBm`} color={color.text} />
                      <InfoRow label="RSRP" value={`${net.rsrp} dBm`} />
                      <InfoRow label="RSRQ" value={`${net.rsrq} dB`} />
                      <InfoRow label="SNR" value={`${net.snr} dB`} color="text-cyan-400" />
                      <InfoRow label="SINR" value={`${net.sinr} dB`} />
                      <InfoRow label="Noise Floor" value="-95 dBm" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Capabilities</h4>
                      <InfoRow label="HT/VHT Caps" value={htCaps} mono={false} />
                      <InfoRow label="Supported Rates" value={supportedRates} mono={false} />
                      <InfoRow label="Link Speed" value={`${net.link_speed} Mbps max`} color="text-purple" />
                      <InfoRow label="WMM / QoS" value="Yes" mono={false} color="text-green-400" />
                      <InfoRow label="802.11k/v" value="Yes / Yes" mono={false} color="text-green-400" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}

function InfoRow({ label, value, mono = true, color }) {
  return (
    <div className="flex items-start justify-between gap-2 text-xs">
      <span className="text-muted-foreground flex-shrink-0">{label}</span>
      <span className={`text-right ${mono ? 'font-mono' : ''} ${color || 'text-foreground'} break-all`}>{value ?? '—'}</span>
    </div>
  );
}
