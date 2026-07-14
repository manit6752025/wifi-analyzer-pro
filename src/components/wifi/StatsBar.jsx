import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Shield, ShieldOff, Activity, Cpu } from 'lucide-react';
import { getSignalColor } from './SignalStrengthBar';

export default function StatsBar({ networks, systemInfo, backendConnected, lastScan }) {
  const best = networks.reduce((a, b) => (a.rssi > b.rssi ? a : b), networks[0] || { rssi: -100 });
  const bands5 = networks.filter(n => n.band === '5GHz').length;
  const bands24 = networks.filter(n => n.band === '2.4GHz').length;
  const open = networks.filter(n => n.security === 'Open').length;
  const bestColor = getSignalColor(best?.rssi || -100);

  const stats = [
    { label: 'Networks Found', value: networks.length, icon: Wifi, color: 'text-primary' },
    { label: 'Best Signal', value: best ? `${best.rssi} dBm` : 'N/A', icon: Activity, color: bestColor.text },
    { label: '5 GHz', value: bands5, icon: Activity, color: 'text-purple' },
    { label: '2.4 GHz', value: bands24, icon: Activity, color: 'text-cyan-400' },
    { label: 'Open (Unsecured)', value: open, icon: open > 0 ? ShieldOff : Shield, color: open > 0 ? 'text-red-400' : 'text-green-400' },
  ];

  if (systemInfo?.cpu_percent !== undefined) {
    stats.push({ label: 'CPU', value: `${systemInfo.cpu_percent}%`, icon: Cpu, color: 'text-muted-foreground' });
    stats.push({ label: 'RAM', value: `${systemInfo.memory_percent}%`, icon: Cpu, color: 'text-muted-foreground' });
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="glass rounded-xl p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
            <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
          </div>
          <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
