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

        {/* Gift list */}
        {W.giftList?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{
              marginTop: "2rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.7rem",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🎁</span>

              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: "1.15rem",
                    color: "var(--c-text-inv)",
                    marginBottom: "0.15rem",
                  }}
                >
                  Lista de regalos
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.7rem",
                    color: "rgba(154,128,104,0.45)",
                  }}
                >
                  Algunas ideas para ayudarnos a comenzar nuestro hogar
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.7rem",
              }}
            >
              {W.giftList.map((gift, index) => (
                <motion.div
                  key={gift.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 + index * 0.04 }}
                  style={{
                    padding: "1rem",
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(181,137,78,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>
                      {gift.emoji}
                    </span>

                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-jost)",
                          fontSize: "0.86rem",
                          color: "var(--c-text-inv)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {gift.name}
                      </p>

                      <p
                        style={{
                          fontFamily: "var(--font-jost)",
                          fontSize: "0.72rem",
                          color: "rgba(196,168,130,0.55)",
                        }}
                      >
                        {gift.price}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "0.35rem 0.55rem",
                      background: gift.reserved
                        ? "rgba(107,38,53,0.22)"
                        : "rgba(181,137,78,0.08)",
                      border: gift.reserved
                        ? "1px solid rgba(107,38,53,0.4)"
                        : "1px solid rgba(181,137,78,0.16)",
                      fontFamily: "var(--font-jost)",
                      fontSize: "0.56rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: gift.reserved
                        ? "rgba(255,210,210,0.75)"
                        : "var(--c-gold-lt)",
                      flexShrink: 0,
                    }}
                  >
                    {gift.reserved ? "Reservado" : "Disponible"}
                  </div>
                </motion.div>
              ))}
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
