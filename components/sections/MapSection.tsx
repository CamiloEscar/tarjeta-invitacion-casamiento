"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { W } from "@/lib/config";

export default function MapSection() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="map" className="s-pad surf-linen">
      <div className="w-content px-6" ref={ref}>
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>Ubicación</motion.p>
        <motion.h2 className="t-title mb-2" style={{ color:"var(--c-text-1)" }}
          initial={{ opacity:0, y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}>
          Cómo <em style={{ fontStyle:"italic", color:"var(--c-wine)" }}>llegar</em>
        </motion.h2>
        <motion.div className="g-line" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />

        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.25 }}
          className="relative overflow-hidden mt-4"
          style={{ boxShadow:"0 16px 48px rgba(44,26,16,0.12)" }}>
          {/* Tint overlay */}
          <div className="absolute inset-0 pointer-events-none z-10"
               style={{ background:"rgba(181,137,78,0.04)", mixBlendMode:"multiply" }} />
          <iframe
            src={W.mapEmbedSrc}
            width="100%" height="420"
            style={{ border:0, display:"block", filter:"sepia(18%) contrast(0.9) brightness(1.04)" }}
            allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa del evento"
          />
        </motion.div>

        <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.4 }}
          className="flex flex-wrap gap-3 mt-5">
          <a href={W.reception.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-wine">
            <span>🗺️ Google Maps</span>
          </a>
          <a href={`https://waze.com/ul?q=${encodeURIComponent(W.reception.address)}`}
             target="_blank" rel="noopener noreferrer" className="btn-outline-dark">
            <span>🚗 Waze</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
