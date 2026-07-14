import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeatmapGrid({ networks }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'hsl(222, 47%, 5%)';
    ctx.fillRect(0, 0, W, H);

    if (networks.length === 0) return;

    const points = networks.map((net, i) => {
      const hash = net.bssid.split(':').reduce((a, b) => a + parseInt(b, 16), 0);
      return { x: ((hash * 137 + i * 61) % W), y: ((hash * 89 + i * 43) % H), strength: Math.max(0, Math.min(1, (net.rssi + 100) / 70)), rssi: net.rssi };
    });

    points.forEach(p => {
      const r = p.strength * 120 + 40;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      let colorStr;
      if (p.rssi >= -55) colorStr = '74, 222, 128';
      else if (p.rssi >= -65) colorStr = '0, 212, 255';
      else if (p.rssi >= -75) colorStr = '250, 204, 21';
      else if (p.rssi >= -85) colorStr = '251, 146, 60';
      else colorStr = '248, 113, 113';
      gradient.addColorStop(0, `rgba(${colorStr}, 0.4)`);
      gradient.addColorStop(0.5, `rgba(${colorStr}, 0.1)`);
      gradient.addColorStop(1, `rgba(${colorStr}, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fill();
    });
  }, [networks]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="glass rounded-xl overflow-hidden">
        <canvas ref={canvasRef} width={600} height={280} className="w-full" style={{ height: 280 }} />
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground justify-center flex-wrap">
        {[
          { color: 'bg-green-400', label: 'Excellent (-55+)' },
          { color: 'bg-cyan-400', label: 'Good (-65+)' },
          { color: 'bg-yellow-400', label: 'Fair (-75+)' },
          { color: 'bg-orange-400', label: 'Weak (-85+)' },
          { color: 'bg-red-400', label: 'Poor' },
        ].map(item => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            {item.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
