import React, { useEffect, useRef } from 'react';

export default function RadarSweep({ networks, scanning }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 8;

    const dots = networks.slice(0, 12).map((net, i) => {
      const angle = (i / Math.max(networks.length, 1)) * Math.PI * 2;
      const dist = Math.max(0.2, Math.min(0.95, (net.rssi + 100) / 70));
      return { x: cx + Math.cos(angle) * dist * r, y: cy + Math.sin(angle) * dist * r, rssi: net.rssi, visible: false, alpha: 0, angle };
    });

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1].forEach(scale => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * scale, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.06)';
      ctx.beginPath();
      ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
      ctx.stroke();

      if (scanning) {
        angleRef.current = (angleRef.current + 0.025) % (Math.PI * 2);
        const sweepAngle = angleRef.current;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, sweepAngle - 1.2, sweepAngle);
        ctx.closePath();
        const grad = ctx.createLinearGradient(cx, cy, cx + r, cy);
        grad.addColorStop(0, 'rgba(0, 212, 255, 0)');
        grad.addColorStop(1, 'rgba(0, 212, 255, 0.15)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r);
        ctx.stroke();
        dots.forEach(dot => {
          const angleDiff = ((sweepAngle - dot.angle) + Math.PI * 4) % (Math.PI * 2);
          if (angleDiff < 0.15) { dot.visible = true; dot.alpha = 1; }
        });
      }

      dots.forEach(dot => {
        if (!dot.visible) return;
        dot.alpha = Math.max(0, dot.alpha - 0.005);
        let color;
        if (dot.rssi >= -55) color = `rgba(74, 222, 128, ${dot.alpha})`;
        else if (dot.rssi >= -65) color = `rgba(0, 212, 255, ${dot.alpha})`;
        else if (dot.rssi >= -75) color = `rgba(250, 204, 21, ${dot.alpha})`;
        else color = `rgba(248, 113, 113, ${dot.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [networks, scanning]);

  return <canvas ref={canvasRef} width={220} height={220} className="rounded-full" style={{ imageRendering: 'crisp-edges' }} />;
}
