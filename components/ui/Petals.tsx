"use client";
import { useEffect, useRef } from "react";

const COLORS = ["#B5894E","#CFAA70","#8A6530","#6B2635","#8A3347","#C4A882","#D4BC96"];

export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = 0, H = 0, raf: number;

    type P = { x:number; y:number; sz:number; col:string; vy:number; drift:number; rot:number; rs:number; wave:number; ws:number; op:number; };

    const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
    const make = (rY = false): P => ({
      x: Math.random() * W, y: rY ? Math.random() * H : -20,
      sz: Math.random() * 4.5 + 2,
      col: COLORS[Math.floor(Math.random() * COLORS.length)],
      vy: Math.random() * 0.6 + 0.2,
      drift: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * Math.PI * 2,
      rs: 0.005 + Math.random() * 0.01,
      wave: Math.random() * Math.PI * 2,
      ws: 0.01 + Math.random() * 0.016,
      op: 0.07 + Math.random() * 0.2,
    });

    resize();
    window.addEventListener("resize", resize);
    const petals: P[] = Array.from({ length: 28 }, (_, i) => make(i < 22));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of petals) {
        ctx.save();
        ctx.globalAlpha = p.op;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.sz * 0.5, p.sz * 1.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.col;
        ctx.fill();
        ctx.restore();
        p.y += p.vy; p.wave += p.ws;
        p.x += Math.sin(p.wave) * 0.45 + p.drift;
        p.rot += p.rs;
        if (p.y > H + 20) Object.assign(p, make());
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-10" aria-hidden />;
}
