"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { W } from "@/lib/config";

const WA = `https://wa.me/${W.whatsapp}?text=${encodeURIComponent(`Hola! Tengo una consulta sobre el casamiento de ${W.bride} y ${W.groom} 💌`)}`;

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once:true, amount:0.3 });

  return (
    <section id="contact" className="s-pad-sm surf-dark text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse 50% 60% at 50% 50%, rgba(107,38,53,0.1) 0%, transparent 70%)" }} />
      <div className="w-narrow px-6 relative" ref={ref}>
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>¿Consultas?</motion.p>
        <motion.h2 initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}
          style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-text-inv)", lineHeight:1.1, marginBottom:"0.25rem" }}>
          Contacto <span style={{ color:"var(--c-gold-lt)" }}>directo</span>
        </motion.h2>
        <motion.div className="g-line g-line-c" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />
        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.22 }}
          className="t-body mb-8 mx-auto max-w-xs" style={{ color:"var(--c-text-inv2)", fontSize:"0.85rem" }}>
          ¿Alguna pregunta sobre el evento, la ubicación o el dress code? Escribinos.
        </motion.p>
        <motion.a href={WA} target="_blank" rel="noopener noreferrer"
          initial={{ opacity:0,y:12 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.32 }}
          className="inline-flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
          style={{ background:"#25D366", color:"white", padding:"1rem 2.2rem", fontFamily:"var(--font-jost)", fontSize:"0.68rem", letterSpacing:"0.22em", textTransform:"uppercase", fontWeight:500, boxShadow:"0 4px 20px rgba(37,211,102,0.3)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.524 5.825L.057 23.852a.5.5 0 0 0 .606.638l6.264-1.638A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
          Escribinos por WhatsApp
        </motion.a>
      </div>
    </section>
  );
}
