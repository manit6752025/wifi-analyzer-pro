import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = [
  'hsl(188, 100%, 50%)',
  'hsl(263, 70%, 65%)',
  'hsl(142, 71%, 50%)',
  'hsl(45, 93%, 58%)',
  'hsl(0, 72%, 60%)',
  'hsl(199, 89%, 60%)',
  'hsl(330, 81%, 60%)',
];

export default function SignalHistoryChart({ networks, history }) {
  const top5 = networks.slice(0, 5);

  const allTimes = new Set();
  top5.forEach(net => {
    (history[net.bssid] || []).forEach(h => allTimes.add(h.t));
  });
  const sortedTimes = Array.from(allTimes).sort();

  const chartData = sortedTimes.map(t => {
    const point = { t };
    top5.forEach(net => {
      const entry = (history[net.bssid] || []).find(h => h.t === t);
      if (entry) point[net.bssid] = entry.rssi;
    });
    return point;
  });

  const demoData = top5.length > 0 ? Array.from({ length: 20 }, (_, i) => {
    const point = { t: i };
    top5.forEach(net => {
      point[net.bssid] = net.rssi + Math.floor(Math.random() * 6 - 3);
    });
    return point;
  }) : [];

  const data = chartData.length > 1 ? chartData : demoData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="glass rounded-lg p-3 text-xs border border-border space-y-1">
          {payload.map((p, i) => {
            const net = top5.find(n => n.bssid === p.dataKey);
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                <span className="text-muted-foreground">{net?.ssid || p.dataKey}:</span>
                <span className="font-mono font-medium" style={{ color: p.color }}>{p.value} dBm</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="glass rounded-xl p-4" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <XAxis dataKey="t" hide />
            <YAxis domain={[-100, -30]} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={CustomTooltip} />
            <ReferenceLine y={-55} stroke="hsl(142,71%,45%)" strokeDasharray="4 4" strokeOpacity={0.4} />
            <ReferenceLine y={-75} stroke="hsl(45,93%,58%)" strokeDasharray="4 4" strokeOpacity={0.4} />
            <ReferenceLine y={-85} stroke="hsl(0,72%,55%)" strokeDasharray="4 4" strokeOpacity={0.4} />
            {top5.map((net, i) => (
              <Line key={net.bssid} type="monotone" dataKey={net.bssid} stroke={COLORS[i]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3">
        {top5.map((net, i) => (
          <div key={net.bssid} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: COLORS[i] }} />
            <span className="text-muted-foreground truncate max-w-[80px]">{net.ssid}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
