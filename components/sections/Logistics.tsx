"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { W } from "@/lib/config";

export default function Logistics() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once:true, amount:0.1 });

  if (!W.logistics.show) return null;

  const { shuttle, parking, hotels, remis, fromBsAs, fromRosario, distanceKm } = W.logistics;

  return (
    <section id="logistics" className="s-pad surf-warm relative overflow-hidden">
      <div className="w-content px-6" ref={ref}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:0.7 }}>
          <p className="t-eye mb-3">Cómo llegar</p>
          <h2 className="t-title mb-2" style={{ color:"var(--c-text-1)" }}>
            Info <em style={{ fontStyle:"italic", color:"var(--c-wine)" }}>práctica</em>
          </h2>
          <div className="g-line" />
          <p className="t-body mt-4 mb-10" style={{ color:"var(--c-text-2)", maxWidth:"44ch" }}>
            Todo lo que necesitás saber para llegar sin problemas y disfrutar el día.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">

          {/* Transfer gratuito */}
          {shuttle.available && (
            <motion.div initial={{ opacity:0, x:-20 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:0.1, duration:0.7 }}
              className="card-light p-6 relative overflow-hidden">
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right, var(--c-wine), transparent)" }} />
              <div className="flex items-start gap-3 mb-3">
                <span style={{ fontSize:"1.5rem", flexShrink:0 }}>🚌</span>
                <div>
                  <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.05rem", color:"var(--c-text-1)", marginBottom:"0.2rem" }}>
                    Auto gratuito
                  </h3>
                  <p className="t-eye" style={{ fontSize:"0.55rem", color:"var(--c-wine)" }}>Iglesia → Salón · {distanceKm} km</p>
                </div>
              </div>
              <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.8rem", color:"var(--c-text-2)", lineHeight:1.7, fontWeight:300 }}>
                {shuttle.info}
              </p>
            </motion.div>
          )}

          {/* Estacionamiento */}
          {parking.available && (
            <motion.div initial={{ opacity:0, x:20 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:0.15, duration:0.7 }}
              className="card-light p-6">
              <div className="flex items-start gap-3 mb-3">
                <span style={{ fontSize:"1.5rem", flexShrink:0 }}>🅿️</span>
                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.05rem", color:"var(--c-text-1)", paddingTop:"0.15rem" }}>
                  Estacionamiento
                </h3>
              </div>
              <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.8rem", color:"var(--c-text-2)", lineHeight:1.7, fontWeight:300 }}>
                {parking.info}
              </p>
            </motion.div>
          )}

          {/* Cómo llegar desde BsAs / Rosario */}
          {(fromBsAs || fromRosario) && (
            <motion.div initial={{ opacity:0, x:-20 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:0.2, duration:0.7 }}
              className="card-light p-6">
              <div className="flex items-start gap-3 mb-3">
                <span style={{ fontSize:"1.5rem", flexShrink:0 }}>🗺️</span>
                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.05rem", color:"var(--c-text-1)", paddingTop:"0.15rem" }}>
                  Cómo llegar
                </h3>
              </div>
              {fromBsAs && (
                <div className="mb-3">
                  <p className="t-eye mb-1" style={{ fontSize:"0.54rem" }}>Desde Buenos Aires</p>
                  <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.78rem", color:"var(--c-text-2)", lineHeight:1.65, fontWeight:300 }}>{fromBsAs}</p>
                </div>
              )}
              {fromRosario && (
                <div>
                  <p className="t-eye mb-1" style={{ fontSize:"0.54rem" }}>Desde Rosario</p>
                  <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.78rem", color:"var(--c-text-2)", lineHeight:1.65, fontWeight:300 }}>{fromRosario}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Remises */}
          {remis.length > 0 && (
            <motion.div initial={{ opacity:0, x:20 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:0.25, duration:0.7 }}
              className="card-light p-6">
              <div className="flex items-start gap-3 mb-3">
                <span style={{ fontSize:"1.5rem", flexShrink:0 }}>🚕</span>
                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.05rem", color:"var(--c-text-1)", paddingTop:"0.15rem" }}>
                  Remises en CDU
                </h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {remis.map((r, i) => (
                  <a key={i} href={`tel:${r.tel}`}
                    className="flex items-center justify-between transition-all"
                    style={{ padding:"0.6rem 0.75rem", background:"var(--c-linen)", border:"1px solid var(--c-border)" }}>
                    <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.82rem", color:"var(--c-text-1)", fontWeight:400 }}>{r.name}</span>
                    <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.75rem", color:"var(--c-wine)", fontWeight:400 }}>{r.tel}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

        </div>

        {/* Hotels */}
        {hotels.length > 0 && (
          <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.3, duration:0.7 }} className="mt-4">
            <div className="card-light p-6">
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize:"1.4rem" }}>🏨</span>
                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.05rem", color:"var(--c-text-1)" }}>
                  Dónde alojarse en CDU
                </h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {hotels.map((h, i) => (
                  <a key={i} href={h.url} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col gap-1.5 p-3.5 transition-all"
                    style={{ background:"var(--c-linen)", border:"1px solid var(--c-border)", textDecoration:"none" }}>
                    <div className="flex items-center gap-1.5">
                      <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"0.9rem", color:"var(--c-text-1)", flex:1 }}>{h.name}</p>
                      <span style={{ fontSize:"0.65rem", color:"var(--c-gold)", letterSpacing:"0.05em" }}>
                        {"★".repeat(h.stars)}
                      </span>
                    </div>
                    <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.68rem", color:"var(--c-text-3)", fontWeight:300 }}>
                      {h.distance}
                    </p>
                    <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--c-gold)", borderBottom:"1px solid var(--c-gold)", paddingBottom:"1px", alignSelf:"flex-start" }}>
                      Ver ubicación →
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
