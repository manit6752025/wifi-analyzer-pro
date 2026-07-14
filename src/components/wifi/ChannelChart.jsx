import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const CHANNELS_24 = Array.from({ length: 13 }, (_, i) => i + 1);
const CHANNELS_5 = [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 132, 136, 140, 149, 153, 157, 161, 165];

function getCongestionColor(count) {
  if (count === 0) return '#1e293b';
  if (count === 1) return 'hsl(188, 100%, 50%)';
  if (count === 2) return 'hsl(45, 93%, 58%)';
  return 'hsl(0, 72%, 55%)';
}

export default function ChannelChart({ networks, congestion }) {
  const band24Data = CHANNELS_24.map(ch => ({
    channel: ch,
    count: networks.filter(n => n.band === '2.4GHz' && n.channel === ch).length,
    congestion: (congestion?.['2.4GHz']?.[ch] || 0),
  }));

  const band5Data = CHANNELS_5.map(ch => ({
    channel: ch,
    count: networks.filter(n => n.band === '5GHz' && n.channel === ch).length,
    congestion: (congestion?.['5GHz']?.[ch] || 0),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="glass rounded-lg p-3 text-xs border border-border">
          <p className="font-medium text-foreground">Channel {label}</p>
          <p className="text-primary mt-1">Networks: {payload[0]?.value}</p>
          {payload[0]?.payload?.congestion > 0 && (
            <p className="text-yellow-400">Congestion: {payload[0]?.payload?.congestion}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <BandChart title="2.4 GHz Band" data={band24Data} tooltip={CustomTooltip} />
      <BandChart title="5 GHz Band" data={band5Data} tooltip={CustomTooltip} compact />
    </div>
  );
}

function BandChart({ title, data, tooltip, compact }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <div className="glass rounded-xl p-4" style={{ height: compact ? 140 : 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis dataKey="channel" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={tooltip} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.count === 0 ? 'hsl(222, 35%, 14%)' : getCongestionColor(entry.congestion)} opacity={entry.count === 0 ? 0.3 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Low</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> High congestion</span>
      </div>
    </motion.div>
  );
}
