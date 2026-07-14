import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, CheckCircle, Info } from 'lucide-react';
import { getSignalColor } from './SignalStrengthBar';

export default function BandSteeringPanel({ networks }) {
  const bySSID = {};
  networks.forEach(net => {
    if (!bySSID[net.ssid]) bySSID[net.ssid] = [];
    bySSID[net.ssid].push(net);
  });

  const dualBand = Object.entries(bySSID).filter(([, nets]) => {
    const has24 = nets.some(n => n.band === '2.4GHz');
    const has5 = nets.some(n => n.band === '5GHz');
    return has24 && has5;
  });

  const singleBand = Object.entries(bySSID).filter(([, nets]) => {
    const has24 = nets.some(n => n.band === '2.4GHz');
    const has5 = nets.some(n => n.band === '5GHz');
    return !(has24 && has5);
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {dualBand.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-primary" />
            Dual-Band APs (Band Steering Capable)
          </h3>
          <div className="space-y-3">
            {dualBand.map(([ssid, nets]) => {
              const net24 = nets.find(n => n.band === '2.4GHz');
              const net5 = nets.find(n => n.band === '5GHz');
              const recommended = net5 && net5.rssi >= -70 ? '5GHz' : '2.4GHz';
              const color24 = getSignalColor(net24?.rssi || -100);
              const color5 = getSignalColor(net5?.rssi || -100);
              return (
                <div key={ssid} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold truncate">{ssid || '<Hidden>'}</span>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                      recommended === '5GHz' ? 'bg-green-400/10 text-green-400 border border-green-400/30' : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30'
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                      Use {recommended}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-lg p-3 border ${color24.border} bg-secondary/30`}>
                      <div className="text-xs text-muted-foreground mb-1">2.4 GHz</div>
                      <div className={`font-mono font-bold text-sm ${color24.text}`}>{net24?.rssi} dBm</div>
                      <div className="text-xs text-muted-foreground">Ch {net24?.channel} · {net24?.link_speed} Mbps</div>
                    </div>
                    <div className={`rounded-lg p-3 border ${color5.border} bg-secondary/30`}>
                      <div className="text-xs text-muted-foreground mb-1">5 GHz</div>
                      <div className={`font-mono font-bold text-sm ${color5.text}`}>{net5?.rssi} dBm</div>
                      <div className="text-xs text-muted-foreground">Ch {net5?.channel} · {net5?.link_speed} Mbps</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {singleBand.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Single-Band Networks
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {singleBand.map(([ssid, nets]) => {
              const net = nets[0];
              const color = getSignalColor(net.rssi);
              return (
                <div key={ssid} className="glass rounded-lg p-3">
                  <div className="font-medium text-sm truncate">{ssid || '<Hidden>'}</div>
                  <div className={`text-xs font-mono ${color.text}`}>{net.band} · {net.rssi} dBm</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {networks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">No networks detected yet. Run a scan first.</div>
      )}
    </motion.div>
  );
}
