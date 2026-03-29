"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { W } from "@/lib/config";

export default function Intro() {
  const ref    = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [text, setText]   = useState("");
  const [done, setDone]   = useState(false);
  const full = W.introText;

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      setText(full.slice(0, ++i));
      if (i >= full.length) { clearInterval(id); setDone(true); }
    }, 36);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section id="intro" className="s-pad-sm surf-dark relative overflow-hidden">
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(107,38,53,0.12) 0%, transparent 70%)" }} />

      <div className="w-narrow px-6 text-center" ref={ref}>
        {/* Star ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.9 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          {[60,0,60].map((w,i) =>
            i === 1
              ? <span key={i} style={{ color: "var(--c-gold)", fontSize: "0.9rem", opacity: 0.7 }}>✦</span>
              : <div key={i} style={{ width: w, height: 1, background: `linear-gradient(${i===0?"to right":"to left"}, transparent, var(--c-gold))`, opacity: 0.45 }} />
          )}
        </motion.div>

        {/* Typewriter */}
        <div style={{ minHeight: "8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p className="t-subtitle" style={{ color: "var(--c-text-inv2)", maxWidth: "30ch" }}>
            {text}
            {!done && <span className="cursor-blink inline-block w-0.5 h-5 ml-0.5 translate-y-0.5" style={{ background: "var(--c-gold)" }} />}
          </p>
        </div>

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-3 mt-8"
        >
          <div style={{ width: 32, height: 1, background: "var(--c-gold)", opacity: 0.35 }} />
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.25rem", color: "var(--c-gold-lt)" }}>
            {W.bride} &amp; {W.groom}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
