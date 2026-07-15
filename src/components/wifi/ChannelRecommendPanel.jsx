import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Radio } from 'lucide-react';

function getBest(congestion, band) {
  const channels = band === '2.4GHz' ? [1, 6, 11] : [36, 40, 44, 48, 149, 153, 157, 161];
  const counts = congestion?.[band] || {};
  let best = channels[0], bestCount = Infinity;
  channels.forEach(ch => {
    const c = counts[ch] || 0;
    if (c < bestCount) { bestCount = c; best = ch; }
  });
  return { channel: best, count: bestCount };
}

function BandCard({ band, congestion, networks }) {
  const { channel, count } = getBest(congestion, band);
  const counts = congestion?.[band] || {};
  const allChannels = band === '2.4GHz' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [36, 40, 44, 48, 100, 104, 108, 112, 149, 153, 157, 161];
  const max = Math.max(...allChannels.map(c => counts[c] || 0), 1);

  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{band}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-400/10 border border-green-400/30">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400 font-medium">Use Channel {channel}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{count === 0 ? 'No congestion on recommended channel' : `${count} network${count > 1 ? 's' : ''} on recommended channel — least congested option`}</div>
      <div className="space-y-1.5">
        {allChannels.map(ch => {
          const c = counts[ch] || 0;
          const w = Math.round((c / max) * 100);
          return (
            <div key={ch} className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{ch}</span>
              <div className="flex-1 h-1.5 rounded-full bg-primary/10">
                <div className={`h-1.5 rounded-full transition-all ${ch === channel ? 'bg-green-400' : c > 2 ? 'bg-red-400' : 'bg-primary'}`} style={{ width: `${w}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-4">{c}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChannelRecommendPanel({ congestion, networks }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <BandCard band="2.4GHz" congestion={congestion} networks={networks} />
      <BandCard band="5GHz" congestion={congestion} networks={networks} />
    </motion.div>
  );
}
