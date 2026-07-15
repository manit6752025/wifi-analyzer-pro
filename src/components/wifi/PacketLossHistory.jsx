import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

export default function PacketLossHistory({ diagnosticsHistory }) {
  const data = (diagnosticsHistory || []).map((d, i) => ({
    t: i,
    loss: d?.packet_loss_pct ?? 0,
    latency: d?.latency_ms ?? 0,
    jitter: d?.jitter_ms ?? 0,
  }));

  const latest = data[data.length - 1] || {};
  const avgLoss = data.length ? (data.reduce((s, d) => s + d.loss, 0) / data.length).toFixed(1) : 0;
  const maxLatency = data.length ? Math.max(...data.map(d => d.latency)) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <div className={`text-2xl font-bold font-mono ${(latest.loss || 0) === 0 ? 'text-green-400' : (latest.loss || 0) < 5 ? 'text-yellow-400' : 'text-red-400'}`}>{latest.loss ?? 0}%</div>
          <div className="text-xs text-muted-foreground mt-0.5">Current Loss</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-primary">{avgLoss}%</div>
          <div className="text-xs text-muted-foreground mt-0.5">Avg Loss</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-yellow-400">{maxLatency}ms</div>
          <div className="text-xs text-muted-foreground mt-0.5">Peak Latency</div>
        </div>
      </div>

      {data.length < 2 ? (
        <div className="glass rounded-xl p-8 text-center text-muted-foreground text-sm">Collecting data — check back after a few scans</div>
      ) : (
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Packet Loss Over Time</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 'auto']} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v, n) => [`${v}${n === 'loss' ? '%' : 'ms'}`, n]} contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="loss" stroke="#f87171" strokeWidth={2} dot={false} name="loss" />
              <Line type="monotone" dataKey="latency" stroke="#facc15" strokeWidth={1.5} dot={false} name="latency" />
              <Line type="monotone" dataKey="jitter" stroke="#60a5fa" strokeWidth={1.5} dot={false} name="jitter" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="text-xs text-red-400">● Loss</span>
            <span className="text-xs text-yellow-400">● Latency</span>
            <span className="text-xs text-blue-400">● Jitter</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
