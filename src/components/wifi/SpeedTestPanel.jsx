import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Download, Upload, Clock, Play } from 'lucide-react';

const API_BASE = 'http://localhost:199';

export default function SpeedTestPanel() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function runTest() {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/speedtest`, { signal: AbortSignal.timeout(60000) });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError('Speed test failed. Backend required.');
    } finally {
      setRunning(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="glass rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-foreground">Internet Speed Test</div>
          <div className="text-xs text-muted-foreground mt-0.5">Tests via fast.com public endpoint</div>
        </div>
        <button
          onClick={runTest}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          {running ? 'Testing...' : 'Run Test'}
        </button>
      </div>

      {running && (
        <div className="glass rounded-xl p-8 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"
          />
          <div className="text-sm text-muted-foreground">Running speed test...</div>
        </div>
      )}

      {error && (
        <div className="glass rounded-xl p-4 text-sm text-red-400">{error}</div>
      )}

      {result && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-4 text-center">
            <Download className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold font-mono text-green-400">{result.download}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Mbps Download</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Upload className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold font-mono text-blue-400">{result.upload}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Mbps Upload</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold font-mono text-yellow-400">{result.ping}</div>
            <div className="text-xs text-muted-foreground mt-0.5">ms Ping</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
