import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Printer, Tv, Cpu, HelpCircle, Wifi } from 'lucide-react';

function deviceIcon(vendor) {
  const v = (vendor || '').toLowerCase();
  if (v.includes('apple') || v.includes('samsung') || v.includes('xiaomi') || v.includes('google') || v.includes('oneplus') || v.includes('oppo')) return Smartphone;
  if (v.includes('intel') || v.includes('dell') || v.includes('hp') || v.includes('lenovo') || v.includes('asus') || v.includes('acer')) return Monitor;
  if (v.includes('canon') || v.includes('epson') || v.includes('brother')) return Printer;
  if (v.includes('sony') || v.includes('tcl')) return Tv;
  if (v.includes('raspberry') || v.includes('espressif') || v.includes('arduino')) return Cpu;
  return HelpCircle;
}

function DeviceRow({ device, index }) {
  const Icon = deviceIcon(device.vendor);
  const isGateway = device.flags && device.flags.includes('C');
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass rounded-xl p-3 flex items-center gap-3"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isGateway ? 'bg-cyan-400/10 border border-cyan-400/30' : 'bg-primary/10 border border-primary/20'}`}>
        {isGateway ? <Wifi className="w-4 h-4 text-cyan-400" /> : <Icon className="w-4 h-4 text-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground font-mono">{device.ip}</span>
          {isGateway && <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">Gateway</span>}
        </div>
        <div className="text-xs text-muted-foreground font-mono truncate">{device.mac}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xs text-foreground">{device.vendor || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground">{device.hostname || ''}</div>
      </div>
    </motion.div>
  );
}

export default function DeviceDiscoveryPanel({ devices, loading }) {
  if (loading) return <div className="text-center py-8 text-muted-foreground text-sm">Scanning network devices...</div>;
  if (!devices || devices.length === 0) return <div className="text-center py-8 text-muted-foreground text-sm">No devices found. Backend required.</div>;

  const vendors = {};
  devices.forEach(d => { const v = d.vendor || 'Unknown'; vendors[v] = (vendors[v] || 0) + 1; });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-primary">{devices.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Devices Found</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-cyan-400">{Object.keys(vendors).length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Unique Vendors</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-green-400">{devices.filter(d => d.flags && d.flags.includes('C')).length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Reachable</div>
        </div>
      </div>
      <div className="space-y-2">
        {devices.map((device, i) => (
          <DeviceRow key={device.mac + device.ip} device={device} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
