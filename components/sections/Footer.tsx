"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { W } from "@/lib/config";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once:true, amount:0.2 });

  return (
    <footer className="surf-dark relative overflow-hidden">
      {/* Decorative top border */}
      <div style={{ height:1, background:"linear-gradient(to right, transparent, var(--c-gold), transparent)", opacity:0.3 }} />

      <div className="w-narrow px-6 py-24 text-center" ref={ref}>
        {/* Ornament */}
        <motion.div initial={{ opacity:0, scaleX:0 }} animate={v?{opacity:1,scaleX:1}:{}} transition={{ duration:0.9 }}
          className="flex items-center justify-center gap-4 mb-8">
          <div style={{ flex:1, maxWidth:70, height:1, background:"linear-gradient(to right, transparent, var(--c-gold))", opacity:0.4 }} />
          <span style={{ color:"var(--c-gold)", fontSize:"1rem", opacity:0.6 }}>✦</span>
          <div style={{ flex:1, maxWidth:70, height:1, background:"linear-gradient(to left, transparent, var(--c-gold))", opacity:0.4 }} />
        </motion.div>

        {/* Names */}
        <div className="overflow-hidden mb-1">
          <motion.h2
            initial={{ y:"100%" }} animate={v?{y:0}:{}}
            transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
            style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(3rem,8vw,5.5rem)", color:"var(--c-text-inv)", opacity:0.88, lineHeight:0.95 }}
          >
            {W.bride}
          </motion.h2>
        </div>
        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.2 }}
          style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1.2rem,3vw,1.8rem)", color:"var(--c-gold)", lineHeight:1.1, margin:"0.1em 0" }}>
          &amp;
        </motion.p>
        <div className="overflow-hidden mb-6">
          <motion.h2
            initial={{ y:"100%" }} animate={v?{y:0}:{}}
            transition={{ duration:0.9, ease:[0.22,1,0.36,1], delay:0.08 }}
            style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(3rem,8vw,5.5rem)", color:"var(--c-text-inv)", opacity:0.88, lineHeight:0.95 }}
          >
            {W.groom}
          </motion.h2>
        </div>

        <motion.div className="g-line g-line-c" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.28, duration:0.7 }} />

        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.38 }}
          className="t-subtitle mx-auto" style={{ color:"rgba(154,128,104,0.6)", maxWidth:"36ch", fontSize:"1rem", marginTop:"0.5rem" }}>
          "{W.footerMessage}"
        </motion.p>

        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.5 }}
          className="t-label mt-8" style={{ color:"rgba(181,137,78,0.45)", fontSize:"0.55rem" }}>
          {W.weddingDateLabel} — {W.location}
        </motion.p>

        {/* Back to top */}
        <motion.a href="#hero" initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.6 }}
          className="inline-flex flex-col items-center gap-2 mt-10 group">
          <div style={{ width:1, height:32, background:"linear-gradient(to top, rgba(181,137,78,0.5), transparent)", transition:"height 0.3s" }} className="group-hover:h-10" />
          <span className="t-label" style={{ color:"rgba(154,128,104,0.5)", fontSize:"0.54rem" }}>Volver al inicio</span>
        </motion.a>
      </div>
    </footer>
  );
}
