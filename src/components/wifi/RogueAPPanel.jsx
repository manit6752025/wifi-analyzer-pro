import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Plus, Trash2, AlertTriangle } from 'lucide-react';

export default function RogueAPPanel({ networks }) {
  const [trusted, setTrusted] = useState({});
  const [newSsid, setNewSsid] = useState('');
  const [newBssid, setNewBssid] = useState('');

  function addTrusted() {
    if (!newSsid || !newBssid) return;
    setTrusted(t => ({ ...t, [newSsid]: [...(t[newSsid] || []), newBssid.toUpperCase()] }));
    setNewSsid(''); setNewBssid('');
  }

  function removeTrusted(ssid, bssid) {
    setTrusted(t => {
      const updated = { ...t, [ssid]: t[ssid].filter(b => b !== bssid) };
      if (!updated[ssid].length) delete updated[ssid];
      return updated;
    });
  }

  const alerts = [];
  (networks || []).forEach(n => {
    if (trusted[n.ssid] && !trusted[n.ssid].includes(n.bssid)) {
      alerts.push(n);
    }
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-primary">{Object.keys(trusted).length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Trusted SSIDs</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className={`text-2xl font-bold font-mono ${alerts.length > 0 ? 'text-red-400' : 'text-green-400'}`}>{alerts.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Rogue APs</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl font-bold font-mono text-foreground">{(networks || []).length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Scanned APs</div>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="glass rounded-xl p-4 border border-red-400/30 bg-red-400/5 space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-2">
            <AlertTriangle className="w-4 h-4" /> Rogue AP Detected
          </div>
          {alerts.map((n, i) => (
            <div key={i} className="text-xs font-mono text-red-300">
              {n.ssid} — {n.bssid} on Ch {n.channel} ({n.band}) — {n.rssi} dBm
            </div>
          ))}
        </div>
      )}

      {alerts.length === 0 && Object.keys(trusted).length > 0 && (
        <div className="glass rounded-xl p-4 border border-green-400/30 bg-green-400/5 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">All visible APs match trusted BSSIDs</span>
        </div>
      )}

      <div className="glass rounded-xl p-4 space-y-3">
        <div className="text-sm font-semibold text-foreground">Add Trusted AP</div>
        <div className="flex gap-2">
          <input value={newSsid} onChange={e => setNewSsid(e.target.value)} placeholder="SSID" className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border text-sm text-foreground placeholder:text-muted-foreground" />
          <input value={newBssid} onChange={e => setNewBssid(e.target.value)} placeholder="BSSID (AA:BB:CC:DD:EE:FF)" className="flex-1 px-3 py-2 rounded-lg bg-background/50 border border-border text-sm text-foreground placeholder:text-muted-foreground font-mono" />
          <button onClick={addTrusted} className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground">Tip: click a network in the Networks tab to auto-fill</div>
      </div>

      {Object.entries(trusted).map(([ssid, bssids]) => (
        <div key={ssid} className="glass rounded-xl p-4 space-y-2">
          <div className="text-sm font-medium text-foreground flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> {ssid}
          </div>
          {bssids.map(b => (
            <div key={b} className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>{b}</span>
              <button onClick={() => removeTrusted(ssid, b)} className="text-red-400 hover:text-red-300">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
