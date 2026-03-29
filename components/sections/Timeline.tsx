"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AGENDA } from "@/lib/config";

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="timeline" className="s-pad surf-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none" style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(107,38,53,0.1) 0%, transparent 65%)" }} />
      <div className="w-narrow px-6" ref={ref}>
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>El día</motion.p>
        <motion.h2 initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}
          style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-text-inv)", lineHeight:1.1, marginBottom:"0.5rem" }}>
          Agenda del <span style={{ color:"var(--c-gold-lt)" }}>evento</span>
        </motion.h2>
        <motion.div className="g-line" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />

        <div className="relative mt-8">
          {/* Vertical connector */}
          <div className="absolute left-[1.5rem] top-6 bottom-6 w-px" style={{ background:"linear-gradient(to bottom, transparent, rgba(181,137,78,0.35) 10%, rgba(181,137,78,0.35) 90%, transparent)" }} />

          {AGENDA.map((item, i) => <TLRow key={i} item={item} index={i} total={AGENDA.length} />)}
        </div>
      </div>
    </section>
  );
}

function TLRow({ item, index, total }: { item:typeof AGENDA[number]; index:number; total:number }) {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once: true, amount: 0.5 });
  const isFirst = index === 0, isLast = index === total - 1;

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, x:-24 }} animate={v?{opacity:1,x:0}:{}}
      transition={{ duration:0.65, ease:[0.22,1,0.36,1], delay: index * 0.07 }}
      className="flex gap-5 mb-5 relative"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl z-10"
           style={{ background: isFirst||isLast ? "var(--c-wine)" : "var(--c-dark-3)", border:"1.5px solid var(--c-gold)", boxShadow:"0 0 0 3px rgba(181,137,78,0.08)" }}>
        {item.icon}
      </div>

      {/* Content */}
      <div className="pt-0.5 pb-4">
        <span style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"1rem", color:"var(--c-gold-lt)" }}>{item.time}</span>
        <h4 style={{ fontFamily:"var(--font-playfair)", fontSize:"1.05rem", fontWeight:400, color:"var(--c-text-inv)", marginTop:"0.1rem", marginBottom:"0.2rem" }}>{item.title}</h4>
        <p className="t-body" style={{ color:"var(--c-text-inv2)", fontSize:"0.8rem" }}>{item.desc}</p>
      </div>
    </motion.div>
  );
}
