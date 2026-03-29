"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { W } from "@/lib/config";

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.52rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--c-text-3)", marginBottom:"0.35rem" }}>{label}</p>
      <button
        onClick={() => { navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-all duration-200"
        style={{ background:"rgba(181,137,78,0.07)", border:"1px solid rgba(181,137,78,0.22)", color:"var(--c-gold-lt)" }}>
        <span style={{ fontFamily:"monospace", fontSize:"clamp(0.82rem,2.5vw,1rem)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value}</span>
        <AnimatePresence mode="wait">
          <motion.span key={String(copied)} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
            style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", flexShrink:0, color:copied?"var(--c-gold-lt)":"rgba(154,128,104,0.4)", transition:"color 0.2s" }}>
            {copied ? "✓ Copiado" : "Copiar"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

export default function GiftsPage() {
  const hasMp   = Boolean(W.gifts.mpLink);
  const hasModo = Boolean(W.gifts.modoLink);
  const hasCVU  = Boolean(W.gifts.cvu);

  return (
    <div style={{ minHeight:"100dvh", background:"var(--c-dark)", fontFamily:"var(--font-jost)" }}>

      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:10, background:"var(--c-dark-2)", borderBottom:"1px solid rgba(181,137,78,0.1)", padding:"1rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.4)" }}>← Inicio</Link>
        <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"0.95rem", color:"var(--c-text-inv)", opacity:0.7 }}>
          {W.bride} &amp; {W.groom}
        </p>
        <div style={{ width:"3rem" }} />
      </div>

      <div style={{ maxWidth:520, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Title */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }} className="text-center mb-10">
          <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"1rem" }}>Regalos</p>
          <h1 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,6vw,2.8rem)", color:"var(--c-text-inv)", lineHeight:1.1, marginBottom:"0.75rem" }}>
            Si querés <span style={{ color:"var(--c-gold-lt)" }}>hacernos un regalo</span>
          </h1>
          <div style={{ width:44, height:1, background:"linear-gradient(to right, transparent, var(--c-gold), transparent)", margin:"1.25rem auto 1.5rem" }} />
          <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1rem,2.5vw,1.25rem)", color:"rgba(196,168,130,0.55)", lineHeight:1.75, maxWidth:"34ch", margin:"0 auto" }}>
            {W.gifts.message}
          </p>
        </motion.div>

        {/* Transfer card */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.7 }}
          style={{ marginBottom:"1rem", position:"relative", overflow:"hidden" }}>
          <div style={{ height:2, background:"linear-gradient(to right, var(--c-wine), var(--c-gold), transparent)" }} />
          <div style={{ padding:"1.5rem 1.5rem 1.25rem", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(181,137,78,0.18)", borderTop:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.85rem", marginBottom:"1.25rem" }}>
              <span style={{ fontSize:"1.4rem" }}>🏦</span>
              <div>
                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.1rem", color:"var(--c-text-inv)", marginBottom:"0.15rem" }}>
                  Transferencia bancaria
                </h3>
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.7rem", color:"rgba(154,128,104,0.45)", fontWeight:300 }}>{W.gifts.bank}</p>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              <CopyButton label="Alias" value={W.gifts.alias} />
              <CopyButton label="CBU"   value={W.gifts.cbu}   />
              {hasCVU && <CopyButton label="CVU (Mercado Pago)" value={W.gifts.cvu} />}
            </div>
          </div>
        </motion.div>

        {/* App deep links */}
        {(hasMp || hasModo) && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ marginBottom:"1rem" }}>
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.38)", marginBottom:"0.6rem" }}>
              O abrí la app directo
            </p>
            <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
              {hasMp && (
                <a href={W.gifts.mpLink} target="_blank" rel="noopener noreferrer"
                  style={{ flex:1, minWidth:140, display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"0.9rem 1rem", background:"#009ee3", textDecoration:"none" }}>
                  <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.68rem", letterSpacing:"0.1em", fontWeight:500, color:"white" }}>Mercado Pago</span>
                </a>
              )}
              {hasModo && (
                <a href={W.gifts.modoLink} target="_blank" rel="noopener noreferrer"
                  style={{ flex:1, minWidth:140, display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"0.9rem 1rem", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", textDecoration:"none" }}>
                  <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.68rem", letterSpacing:"0.1em", color:"var(--c-text-inv)" }}>MODO</span>
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Gratitude */}
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
          style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(0.95rem,2.5vw,1.1rem)", color:"rgba(154,128,104,0.32)", textAlign:"center", marginTop:"2rem", lineHeight:1.75 }}>
          "Cualquier detalle que venga del corazón<br/>ya es más que suficiente para nosotros"
        </motion.p>
      </div>
    </div>
  );
}
