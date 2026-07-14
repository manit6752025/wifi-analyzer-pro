import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Network, CheckCircle, AlertCircle } from 'lucide-react';

function Row({ label, value, mono = true, color }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium ${mono ? 'font-mono' : ''} ${color || 'text-foreground'}`}>{value ?? '—'}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, unit, color, status }) {
  const statusColor = status === 'good' ? 'text-green-400' : status === 'warn' ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="glass rounded-xl p-3 text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-bold font-mono ${color || statusColor}`}>{value}</div>
      {unit && <div className="text-xs text-muted-foreground">{unit}</div>}
    </div>
  );
}

export default function DiagnosticsPanel({ diag, loading }) {
  if (loading) return <div className="text-center py-8 text-muted-foreground text-sm">Running diagnostics...</div>;

  const latStatus = (diag?.latency_ms || 0) < 10 ? 'good' : (diag?.latency_ms || 0) < 50 ? 'warn' : 'bad';
  const jitterStatus = (diag?.jitter_ms || 0) < 5 ? 'good' : (diag?.jitter_ms || 0) < 20 ? 'warn' : 'bad';
  const lossStatus = (diag?.packet_loss_pct || 0) === 0 ? 'good' : (diag?.packet_loss_pct || 0) < 5 ? 'warn' : 'bad';
  const dnsStatus = (diag?.dns_resolution_ms || 0) < 50 ? 'good' : 'warn';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Latency" value={diag?.latency_ms ?? '—'} unit="ms" status={latStatus} />
        <MetricCard label="Jitter" value={diag?.jitter_ms ?? '—'} unit="ms" status={jitterStatus} />
        <MetricCard label="Packet Loss" value={`${diag?.packet_loss_pct ?? 0}%`} status={lossStatus} />
        <MetricCard label="DNS Resolve" value={diag?.dns_resolution_ms ?? '—'} unit="ms" status={dnsStatus} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Min Latency" value={diag?.latency_min_ms ?? '—'} unit="ms" color="text-green-400" />
        <MetricCard label="Max Latency" value={diag?.latency_max_ms ?? '—'} unit="ms" color="text-orange-400" />
        <MetricCard label="Route Hops" value={diag?.route_hops ?? '—'} color="text-cyan-400" />
        <MetricCard label="MTU" value={diag?.mtu ?? 1500} color="text-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Network Interface" icon={Network}>
          <Row label="Local IP" value={diag?.local_ip} color="text-primary" />
          <Row label="Subnet Mask" value={diag?.subnet_mask} />
          <Row label="Default Gateway" value={diag?.gateway} color="text-cyan-400" />
          <Row label="Gateway MAC" value={diag?.gateway_mac || 'N/A'} />
          <Row label="MTU" value={diag?.mtu ?? 1500} />
        </Section>

        <Section title="DNS Servers" icon={Server}>
          {(diag?.dns_servers || ['8.8.8.8', '8.8.4.4']).map((dns, i) => (
            <Row key={i} label={`DNS ${i + 1}`} value={dns} color="text-purple" />
          ))}
          <Row label="Resolution Time" value={`${diag?.dns_resolution_ms ?? '—'} ms`} color={dnsStatus === 'good' ? 'text-green-400' : 'text-yellow-400'} />
        </Section>
      </div>

      <Section title="Connection Quality Summary" icon={Globe}>
        <div className="grid grid-cols-3 gap-3 mt-1">
          {[
            { label: 'Latency', ok: latStatus === 'good', detail: `${diag?.latency_ms ?? '?'} ms` },
            { label: 'Jitter', ok: jitterStatus === 'good', detail: `${diag?.jitter_ms ?? '?'} ms` },
            { label: 'Packet Loss', ok: lossStatus === 'good', detail: `${diag?.packet_loss_pct ?? 0}%` },
            { label: 'DNS', ok: dnsStatus === 'good', detail: `${diag?.dns_resolution_ms ?? '?'} ms` },
            { label: 'Gateway', ok: !!diag?.gateway, detail: diag?.gateway || 'N/A' },
            { label: 'Route', ok: (diag?.route_hops || 0) < 15, detail: `${diag?.route_hops ?? '?'} hops` },
          ].map(item => (
            <div key={item.label} className="bg-secondary/40 rounded-lg p-2 flex items-center gap-2">
              {item.ok ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
              <div>
                <div className="text-xs font-medium text-foreground">{item.label}</div>
                <div className="text-xs font-mono text-muted-foreground">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}
