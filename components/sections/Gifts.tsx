"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { W } from "@/lib/config";

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }
  return (
    <div>
      <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.52rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(196,168,130,0.45)", marginBottom:"0.3rem" }}>{label}</p>
      <button onClick={copy}
        className="w-full flex items-center justify-between gap-3 transition-all duration-200 group"
        style={{ background:"rgba(181,137,78,0.07)", border:"1px solid rgba(181,137,78,0.22)", padding:"0.9rem 1rem", color:"var(--c-gold-lt)" }}>
        <span style={{ fontFamily:"monospace", fontSize:"clamp(0.82rem,2vw,1rem)", letterSpacing:"0.05em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {value}
        </span>
        <AnimatePresence mode="wait">
          <motion.span key={String(copied)}
            initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
            style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, color:copied?"var(--c-gold-lt)":"rgba(154,128,104,0.45)" }}>
            {copied ? "✓ Copiado" : "Copiar"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

export default function Gifts() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once:true, amount:0.15 });

  const hasMp   = Boolean(W.gifts.mpLink);
  const hasModo = Boolean(W.gifts.modoLink);
  const hasCVU  = Boolean(W.gifts.cvu);

  return (
    <section id="gifts" className="s-pad surf-dark-2 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 55% 50% at 75% 50%, rgba(181,137,78,0.05) 0%, transparent 65%)",
      }} />

      <div className="w-narrow px-6" ref={ref}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:0.7 }} className="mb-10">
          <p className="t-eye mb-3">Regalos</p>
          <h2 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-text-inv)", lineHeight:1.1, marginBottom:"0.5rem" }}>
            Si querés <span style={{ color:"var(--c-gold-lt)" }}>hacernos un regalo</span>
          </h2>
          <div className="g-line" />
          <p className="t-body mt-4" style={{ color:"var(--c-text-inv2)", fontSize:"0.88rem", lineHeight:1.75, maxWidth:"42ch" }}>
            {W.gifts.message}
          </p>
        </motion.div>

        {/* Main transfer card */}
        <motion.div initial={{ opacity:0, y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.1, duration:0.7 }}
          className="relative overflow-hidden mb-4"
          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(181,137,78,0.2)" }}>
          <div style={{ height:2, background:"linear-gradient(to right, var(--c-wine), var(--c-gold), transparent)" }} />

          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <span style={{ fontSize:"1.5rem" }}>🏦</span>
              <div>
                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.15rem", color:"var(--c-text-inv)", lineHeight:1.2 }}>Transferencia bancaria</h3>
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.7rem", color:"rgba(154,128,104,0.5)", fontWeight:300 }}>{W.gifts.bank}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <CopyButton label="Alias" value={W.gifts.alias} />
              <CopyButton label="CBU"   value={W.gifts.cbu}   />
              {hasCVU && <CopyButton label="CVU (Mercado Pago)" value={W.gifts.cvu} />}
            </div>
          </div>
        </motion.div>

        {/* App deep links — only shown if configured */}
        {(hasMp || hasModo) && (
          <motion.div initial={{ opacity:0, y:16 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.18, duration:0.7 }}
            className="mb-4">
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.4)", marginBottom:"0.6rem" }}>
              O pagá directo desde la app
            </p>
            <div className="flex gap-3 flex-wrap">
              {hasMp && (
                <a href={W.gifts.mpLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 flex-1 min-w-[140px] justify-center"
                  style={{ padding:"0.85rem 1rem", background:"#009ee3", border:"none", cursor:"pointer" }}>
                  {/* Mercado Pago logo simplified */}
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="white" opacity="0.15"/>
                    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">MP</text>
                  </svg>
                  <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.7rem", letterSpacing:"0.1em", fontWeight:500, color:"white" }}>Mercado Pago</span>
                </a>
              )}
              {hasModo && (
                <a href={W.gifts.modoLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 flex-1 min-w-[140px] justify-center"
                  style={{ padding:"0.85rem 1rem", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer" }}>
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="white" opacity="0.1"/>
                    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">MODO</text>
                  </svg>
                  <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.7rem", letterSpacing:"0.1em", fontWeight:400, color:"var(--c-text-inv)" }}>MODO</span>
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Gratitude note */}
        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.3 }}
          style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(0.95rem,2.5vw,1.15rem)", color:"rgba(154,128,104,0.38)", textAlign:"center", marginTop:"1.5rem", lineHeight:1.7 }}>
          "Cualquier detalle que venga del corazón ya es más que suficiente"
        </motion.p>
      </div>
    </section>
  );
}
