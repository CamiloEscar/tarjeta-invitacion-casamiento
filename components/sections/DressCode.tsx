"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CARDS = [
  { icon:"👔", title:"Caballeros", text:"Traje oscuro o esmoquin. Corbata o moño. Zapatos de cuero." },
  { icon:"👗", title:"Damas",      text:"Vestido largo o de cóctel. Tacones o sandalias elegantes." },
  { icon:"🎨", title:"Paleta",     text:"Tierras, vino, verde oliva, dorado, nude, azul medianoche." },
];

const SWATCHES = [
  { hex:"#F5EFE4", name:"Marfil"   },
  { hex:"#B5894E", name:"Dorado"   },
  { hex:"#6B2635", name:"Vino"     },
  { hex:"#4A2C1C", name:"Caoba"    },
  { hex:"#7D8C6E", name:"Salvia"   },
  { hex:"#C8B49A", name:"Nude"     },
];

export default function DressCode() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once:true, amount:0.2 });

  return (
    <section id="dresscode" className="s-pad surf-sand">
      <div className="w-content px-6" ref={ref}>
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>Vestimenta</motion.p>
        <motion.h2 className="t-title mb-2" style={{ color:"var(--c-text-1)" }}
          initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}>
          Dress <em style={{ fontStyle:"italic", color:"var(--c-wine)" }}>code</em>
        </motion.h2>
        <motion.div className="g-line" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />
        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.22 }}
          className="t-body mb-10 max-w-prose" style={{ color:"var(--c-text-2)" }}>
          Formal elegante. El evento será al aire libre y en salón. Te recomendamos vestimenta acorde al clima de octubre en Buenos Aires.
        </motion.p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {CARDS.map((c,i) => (
            <motion.div key={i} initial={{ opacity:0,y:20 }} animate={v?{opacity:1,y:0}:{}}
              transition={{ delay:0.12+i*0.1, duration:0.7 }}
              className="card-light p-6 text-center">
              <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>{c.icon}</div>
              <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.1rem", color:"var(--c-text-1)", marginBottom:"0.5rem" }}>{c.title}</h3>
              <p className="t-body" style={{ color:"var(--c-text-3)", fontSize:"0.82rem" }}>{c.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Swatches */}
        <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.45 }}>
          <p className="t-label mb-4" style={{ color:"var(--c-text-3)", fontSize:"0.58rem" }}>Colores sugeridos</p>
          <div className="flex gap-4 flex-wrap">
            {SWATCHES.map((s,i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full" style={{ background:s.hex, border:"1px solid rgba(0,0,0,0.08)", boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }} />
                <span className="t-label" style={{ color:"var(--c-text-3)", fontSize:"0.56rem" }}>{s.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Note */}
        <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.55 }}
          className="mt-8 px-4 py-3.5 t-body" style={{ borderLeft:"2px solid var(--c-wine)", background:"rgba(107,38,53,0.04)", color:"var(--c-text-2)", fontSize:"0.82rem" }}>
          <strong style={{ color:"var(--c-text-1)", fontWeight:500 }}>Por favor evitar: </strong>
          blanco o marfil (reservado para la novia) y rojo intenso.
        </motion.div>
      </div>
    </section>
  );
}
