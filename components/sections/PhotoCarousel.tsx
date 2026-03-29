"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PHOTOS } from "@/lib/config";

export default function PhotoCarousel() {
  const ref    = useRef<HTMLDivElement>(null!);
  const v      = useInView(ref, { once:true, amount:0.2 });
  const [cur,  setCur]  = useState(0);
  const [lb,   setLb]   = useState<number|null>(null);
  const [dir,  setDir]  = useState(1);
  const len = PHOTOS.length;

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => slide(1), 4500);
    return () => clearInterval(id);
  }, [cur]);

  function slide(d: number) {
    setDir(d);
    setCur(c => (c + d + len) % len);
  }

  return (
    <section id="carousel" className="s-pad surf-dark relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 70% 50% at 50% 100%, rgba(107,38,53,0.12) 0%, transparent 65%)"
      }} />

      <div className="w-content px-6" ref={ref}>
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>Nuestra galería</motion.p>
        <motion.h2 initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}
          style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-text-inv)", lineHeight:1.1, marginBottom:"0.25rem" }}>
          Momentos que <span style={{ color:"var(--c-gold-lt)" }}>atesoramos</span>
        </motion.h2>
        <motion.div className="g-line" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />

        {/* Main carousel */}
        <motion.div initial={{ opacity:0,y:24 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.28 }}
          className="relative mt-6">

          {/* Main image */}
          <div className="relative overflow-hidden cursor-pointer"
               style={{ aspectRatio:"16/9", maxHeight:520 }}
               onClick={() => setLb(cur)}>
            <AnimatePresence custom={dir} mode="wait">
              <motion.div key={cur}
                custom={dir}
                initial={{ opacity:0, x: dir * 60 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x: dir * -60 }}
                transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
                className="absolute inset-0"
              >
                <Image
                  src={PHOTOS[cur].src} alt={PHOTOS[cur].alt} fill
                  className="object-cover" style={{ filter:"sepia(8%) contrast(0.97)" }}
                  sizes="(max-width:900px) 100vw, 900px"
                  priority={cur===0}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(12,6,3,0.5) 0%, transparent 50%)" }} />
                {/* Caption */}
                <div className="absolute bottom-4 left-5">
                  <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"1rem", color:"rgba(240,232,218,0.85)" }}>
                    {PHOTOS[cur].alt}
                  </p>
                </div>
                {/* Zoom hint */}
                <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
                  <span style={{ color:"rgba(240,232,218,0.7)", fontSize:"1.2rem" }}>⊕</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next */}
          {(["prev","next"] as const).map(btn => (
            <button key={btn}
              onClick={() => slide(btn==="prev"?-1:1)}
              className="absolute top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                [btn==="prev"?"left":"right"]: "0.75rem",
                background:"rgba(20,10,5,0.6)",
                border:"1px solid rgba(181,137,78,0.25)",
                color:"rgba(240,232,218,0.8)",
                backdropFilter:"blur(4px)",
              }}>
              {btn==="prev" ? "‹" : "›"}
            </button>
          ))}
        </motion.div>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {PHOTOS.map((p,i) => (
            <button key={i} onClick={() => { setDir(i>cur?1:-1); setCur(i); }}
              className="flex-shrink-0 relative overflow-hidden transition-all duration-300"
              style={{
                width:64, height:48,
                outline: i===cur ? "2px solid var(--c-gold)" : "2px solid transparent",
                outlineOffset:2,
                opacity: i===cur ? 1 : 0.5,
              }}>
              <Image src={p.src} alt={p.alt} fill className="object-cover"
                     style={{ filter:"sepia(15%)" }} sizes="64px" />
            </button>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {PHOTOS.map((_,i) => (
            <button key={i} onClick={() => { setDir(i>cur?1:-1); setCur(i); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i===cur ? 20 : 6, height:6,
                background: i===cur ? "var(--c-gold)" : "rgba(181,137,78,0.25)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lb!==null && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{ background:"rgba(8,4,2,0.97)" }}
            onClick={() => setLb(null)}>
            <button className="absolute top-5 right-5 text-2xl transition-colors"
              style={{ color:"rgba(240,232,218,0.4)" }}
              onClick={() => setLb(null)}>✕</button>
            {/* Prev/Next in lightbox */}
            <button onClick={e => { e.stopPropagation(); setLb(l => l!==null ? (l-1+len)%len : null); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl transition-colors"
              style={{ color:"rgba(240,232,218,0.4)" }}>‹</button>
            <button onClick={e => { e.stopPropagation(); setLb(l => l!==null ? (l+1)%len : null); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl transition-colors"
              style={{ color:"rgba(240,232,218,0.4)" }}>›</button>
            <motion.img
              key={lb}
              initial={{ scale:0.88, opacity:0 }}
              animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.9, opacity:0 }}
              transition={{ type:"spring", stiffness:300, damping:30 }}
              src={PHOTOS[lb].src} alt={PHOTOS[lb].alt}
              className="max-w-full max-h-[88vh] object-contain"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
