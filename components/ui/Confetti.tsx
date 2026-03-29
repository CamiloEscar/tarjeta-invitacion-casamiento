"use client";
import { useEffect, useRef } from "react";

// Lightweight confetti using Canvas — no external lib needed
export default function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    if (!ctx) return;

    let W_px = canvas.width  = window.innerWidth;
    let H_px = canvas.height = window.innerHeight;

    const resize = () => {
      W_px = canvas.width  = window.innerWidth;
      H_px = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Colors matching the wedding palette
    const COLORS = [
      "#CFAA70","#B5894E","#8A3347","#6B2635",
      "#F0E8DA","#EDE4D6","#C4A882","#8A6530",
    ];

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      r: number; color: string; rot: number; vrot: number;
      shape: "rect" | "circle";
    };

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x:     Math.random() * W_px,
      y:     Math.random() * H_px * -1, // start above screen
      vx:    (Math.random() - 0.5) * 2.5,
      vy:    Math.random() * 3 + 1.5,
      r:     Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot:   Math.random() * Math.PI * 2,
      vrot:  (Math.random() - 0.5) * 0.12,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    let raf: number;
    let opacity = 1;

    function draw() {
      ctx!.clearRect(0, 0, W_px, H_px);
      ctx!.globalAlpha = opacity;

      particles.forEach(p => {
        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.vrot;
        p.vy  += 0.04; // gravity

        // Reset when off-screen (only for the first 8s)
        if (p.y > H_px + 20) {
          p.y  = -20;
          p.x  = Math.random() * W_px;
          p.vy = Math.random() * 3 + 1.5;
        }

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rot);
        ctx!.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx!.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        } else {
          ctx!.beginPath();
          ctx!.arc(0, 0, p.r * 0.6, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();
      });

      // Fade out after 6s
      if (opacity > 0) raf = requestAnimationFrame(draw);
    }

    draw();

    // Start fading after 5s, fully gone after 8s
    const fadeTimer = setTimeout(() => {
      const fadeInterval = setInterval(() => {
        opacity -= 0.015;
        if (opacity <= 0) {
          opacity = 0;
          clearInterval(fadeInterval);
          cancelAnimationFrame(raf);
          canvas.style.display = "none";
        }
      }, 50);
    }, 5000);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position:"fixed", inset:0, zIndex:8888, pointerEvents:"none" }}
    />
  );
}
