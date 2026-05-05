"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { W } from "@/lib/config";

function Card({ type, title, time, note, address, extra, url, delay = 0 }: {
  type:string; title:string; time:string; note:string; address:string; extra:string; url:string; delay?:number;
}) {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }} animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22,1,0.36,1], delay }}
      className="card-light p-8 md:p-10 relative"
    >
      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, var(--c-wine), transparent)` }} />

      <p className="t-eye mb-4">{type}</p>
      <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--c-text-1)", marginBottom: "1.5rem", lineHeight: 1.15 }}>{title}</h3>

      <div className="space-y-4 mb-8">
        {[
          { icon:"🕕", main: time,    sub: note    },
          { icon:"📍", main: address, sub: undefined},
          { icon:"✦",  main: extra,   sub: undefined},
        ].map((d,i) => (
          <div key={i} className="flex gap-3">
            <span className="mt-0.5 flex-shrink-0 text-sm">{d.icon}</span>
            <div>
              <p className="t-body font-medium" style={{ color: "var(--c-text-1)", fontWeight: 400, fontSize: "0.87rem" }}>{d.main}</p>
              {d.sub && <p className="t-body" style={{ color: "var(--c-text-3)", fontSize: "0.78rem" }}>{d.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <a href={url} target="_blank" rel="noopener noreferrer"
         className="t-eye inline-flex items-center gap-1.5 pb-px transition-colors hover:text-wine"
         style={{ color: "var(--c-wine)", borderBottom: "1px solid currentColor" }}>
        Ver en Google Maps →
      </a>
    </motion.div>
  );
}

export default function EventInfo() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once: true, amount: 0.2 });
  return (
    <section id="event" className="s-pad surf-warm">
      <div className="w-content px-6" ref={ref}>
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>El gran día</motion.p>
        <motion.h2 className="t-title mb-2" style={{ color:"var(--c-text-1)" }} initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}}>
          Información <em style={{ fontStyle:"italic", color:"var(--c-wine)" }}>del evento</em>
        </motion.h2>
        <motion.div className="g-line" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />

        <div className="grid md:grid-cols-2 gap-px mt-6" style={{ background: "var(--c-border)" }}>
          <Card type="Ceremonia" title={W.ceremony.name} time={W.ceremony.time} note={W.ceremony.note}
            address={W.ceremony.address} extra="Ceremonia civil · duración breve" url={W.ceremony.mapsUrl} delay={0} />
          <Card type="Recepción & Fiesta" title={W.reception.name} time={W.reception.time} note={W.reception.cocktail}
            address={W.reception.address} extra="Ingreso puntual · la fiesta comienza a horario" url={W.reception.mapsUrl} delay={0.1} />
        </div>
      </div>
    </section>
  );
}
