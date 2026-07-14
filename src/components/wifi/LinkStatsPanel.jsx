import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, AlertTriangle, Activity } from 'lucide-react';

function StatCard({ label, value, sub, color = 'text-foreground', icon: Icon }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function formatBytes(b) {
  if (b > 1e9) return `${(b / 1e9).toFixed(2)} GB`;
  if (b > 1e6) return `${(b / 1e6).toFixed(1)} MB`;
  if (b > 1e3) return `${(b / 1e3).toFixed(0)} KB`;
  return `${b} B`;
}

export default function LinkStatsPanel({ link, loading }) {
  if (loading) return <div className="text-center py-8 text-muted-foreground text-sm">Loading link stats...</div>;

  const errorRate = link?.tx_packets ? ((link.tx_retries / link.tx_packets) * 100).toFixed(2) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="TX Packets" value={(link?.tx_packets || 0).toLocaleString()} icon={ArrowUp} color="text-cyan-400" />
        <StatCard label="RX Packets" value={(link?.rx_packets || 0).toLocaleString()} icon={ArrowDown} color="text-purple" />
        <StatCard label="TX Data" value={formatBytes(link?.tx_bytes || 0)} icon={ArrowUp} color="text-cyan-400" />
        <StatCard label="RX Data" value={formatBytes(link?.rx_bytes || 0)} icon={ArrowDown} color="text-purple" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="TX Errors" value={link?.tx_errors ?? 0} color={link?.tx_errors > 0 ? 'text-orange-400' : 'text-green-400'} icon={AlertTriangle} />
        <StatCard label="RX Errors" value={link?.rx_errors ?? 0} color={link?.rx_errors > 0 ? 'text-orange-400' : 'text-green-400'} icon={AlertTriangle} />
        <StatCard label="TX Dropped" value={link?.tx_dropped ?? 0} color={link?.tx_dropped > 0 ? 'text-yellow-400' : 'text-green-400'} />
        <StatCard label="RX Dropped" value={link?.rx_dropped ?? 0} color={link?.rx_dropped > 0 ? 'text-yellow-400' : 'text-green-400'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="TX Retries" value={(link?.tx_retries || 0).toLocaleString()} sub={`${errorRate}% retry rate`} color="text-yellow-400" icon={Activity} />
        <StatCard label="TX Failed" value={link?.tx_failed ?? 0} color={link?.tx_failed > 0 ? 'text-red-400' : 'text-green-400'} icon={AlertTriangle} />
        <StatCard label="Missed Beacons" value={link?.missed_beacons ?? 0} color={link?.missed_beacons > 5 ? 'text-orange-400' : 'text-green-400'} />
      </div>

      <div className="glass rounded-xl p-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Link Quality</div>
          <div className="text-2xl font-bold font-mono text-primary">
            {link?.link_quality ?? 68}<span className="text-sm text-muted-foreground">/{link?.link_quality_max ?? 70}</span>
          </div>
          <div className="h-2 bg-muted/40 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${((link?.link_quality || 68) / (link?.link_quality_max || 70)) * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Invalid / Misc</div>
          <div className="text-2xl font-bold font-mono text-foreground">{link?.invalid_misc ?? 0}</div>
          <div className="text-xs text-muted-foreground mt-1">Malformed frames</div>
        </div>
      </div>
    </motion.div>
  );
}
