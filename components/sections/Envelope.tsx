"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { W } from "@/lib/config";
import { useCountdown } from "@/hooks/useCountdown";
import Confetti from "@/components/ui/Confetti";

// ─────────────────────────────────────────────────────────────
//  Envelope — pantalla de bienvenida antes de la invitación
//  Una sola acción: tocar el sello → sube la pantalla elegante
// ─────────────────────────────────────────────────────────────

export default function Envelope() {
  const [gone,    setGone]    = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { days, hours, minutes, seconds, ready, isToday, isPast } = useCountdown(W.weddingDate);
  const isPartyMode = W.dayMode === "party" || (W.dayMode === "auto" && (isToday || isPast));

  useEffect(() => { setMounted(true); }, []);

  function handleEnter() {
    setLeaving(true);
    setTimeout(() => setGone(true), 1000);
  }

  if (gone) return null;

  // ── WEDDING DAY MODE ────────────────────────────────────────
  if (isPartyMode) return (
    <>
      <Confetti />
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center"
        style={{ background:"var(--c-dark)" }}
        onClick={() => setGone(true)}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background:"radial-gradient(ellipse 90% 65% at 50% 110%, rgba(107,38,53,0.3) 0%, transparent 58%)",
        }} />
        <motion.div
          initial={{ opacity:0, scale:0.7 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:1, type:"spring", stiffness:180 }}
          style={{ position:"relative", zIndex:1 }}
          className="px-6"
        >
          <motion.p
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
            className="t-eye mb-5" style={{ color:"rgba(181,137,78,0.55)" }}>
            ✦ Hoy es el día ✦
          </motion.p>
          <div style={{ overflow:"hidden" }}>
            <motion.h1 initial={{ y:"100%" }} animate={{ y:0 }} transition={{ delay:0.2, duration:1.1, ease:[0.16,1,0.3,1] }}
              style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(3.5rem,14vw,9rem)", color:"#F0E8D8", lineHeight:0.88 }}>
              {W.bride}
            </motion.h1>
          </div>
          <motion.span initial={{ opacity:0, scale:0.3 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.6 }}
            style={{ display:"block", fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(2rem,7vw,5rem)", color:"var(--c-gold)", lineHeight:1.1, margin:"0.08em 0" }}>
            &amp;
          </motion.span>
          <div style={{ overflow:"hidden" }}>
            <motion.h1 initial={{ y:"100%" }} animate={{ y:0 }} transition={{ delay:0.3, duration:1.1, ease:[0.16,1,0.3,1] }}
              style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(3.5rem,14vw,9rem)", color:"#F0E8D8", lineHeight:0.88 }}>
              {W.groom}
            </motion.h1>
          </div>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
            style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1.2rem,3.5vw,2rem)", color:"rgba(207,168,112,0.7)", marginTop:"1.5rem" }}>
            ¡Hoy nos casamos! 🥂
          </motion.p>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
            className="t-eye mt-5" style={{ color:"rgba(154,128,104,0.45)" }}>
            Tocá para ver la invitación
          </motion.p>
        </motion.div>
      </div>
    </>
  );

  return (
    <motion.div
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={leaving ? { duration: 1.05, ease: [0.76, 0, 0.24, 1] } : {}}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "var(--c-dark)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 90% 65% at 50% 105%, rgba(107,38,53,0.22) 0%, transparent 58%)",
      }} />

      {/* Star field */}
      {mounted && Array.from({ length: 50 }).map((_, i) => (
        <motion.div key={i}
          animate={{ opacity: [0, Math.random() * 0.5 + 0.05, 0] }}
          transition={{ duration: 3 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5 }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${Math.random() * 2 + 0.5}px`,
            height: `${Math.random() * 2 + 0.5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: "var(--c-gold-lt)",
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center px-6"
        style={{ maxWidth: 500, width: "100%" }}
      >

        {/* Names — large, cinematic */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="t-eye mb-6" style={{ color: "rgba(181,137,78,0.45)" }}>
          El casamiento de
        </motion.p>

        <div className="overflow-hidden mb-1">
          <motion.h1
            initial={{ y: "100%" }} animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(3.5rem, 14vw, 9rem)", color: "#F0E8D8", lineHeight: 0.88,
            }}>
            {W.bride}
          </motion.h1>
        </div>

        <motion.span
          initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.7, type: "spring", stiffness: 200 }}
          style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic",
            fontSize: "clamp(2rem, 8vw, 5rem)", color: "var(--c-gold)",
            lineHeight: 1.1, display: "block", margin: "0.08em 0",
          }}>
          &amp;
        </motion.span>

        <div className="overflow-hidden mb-7">
          <motion.h1
            initial={{ y: "100%" }} animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(3.5rem, 14vw, 9rem)", color: "#F0E8D8", lineHeight: 0.88,
            }}>
            {W.groom}
          </motion.h1>
        </div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.9 }}
          className="flex items-center gap-4 mb-2"
        >
          <div style={{ width: 36, height: 1, background: "linear-gradient(to right, transparent, rgba(181,137,78,0.4))" }} />
          <p style={{
            fontFamily: "var(--font-cormorant)", fontStyle: "italic",
            fontSize: "clamp(1rem, 3.5vw, 1.7rem)", color: "rgba(196,168,130,0.7)",
          }}>{W.weddingDateLabel}</p>
          <div style={{ width: 36, height: 1, background: "linear-gradient(to left, transparent, rgba(181,137,78,0.4))" }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
          className="t-label mb-9" style={{ color: "rgba(154,128,104,0.45)", fontSize: "0.56rem" }}>
          {W.location}
        </motion.p>

        {/* Countdown — compact row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="flex items-end gap-3 mb-9"
        >
          {[{ v: days, l: "días" }, { v: hours, l: "hs" }, { v: minutes, l: "min" }, { v: seconds, l: "seg" }].map((u, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="flex flex-col items-center gap-0.5">
                <span style={{
                  fontFamily: "var(--font-playfair)", fontWeight: 400,
                  fontSize: "clamp(1.4rem, 5vw, 2rem)", lineHeight: 1,
                  color: "var(--c-gold-lt)",
                  opacity: ready ? 1 : 0, transition: "opacity 0.4s",
                  minWidth: "2ch", textAlign: "center", fontVariantNumeric: "tabular-nums",
                }}>
                  {String(u.v).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "0.42rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(154,128,104,0.4)" }}>
                  {u.l}
                </span>
              </div>
              {i < 3 && (
                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1rem,3vw,1.5rem)", color: "rgba(181,137,78,0.18)", lineHeight: 1, paddingBottom: "1rem" }}>
                  :
                </span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Wax seal button — the only CTA */}
        <motion.button
          onClick={handleEnter}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.9, type: "spring", stiffness: 180, damping: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Abrir invitación"
          style={{
            width: 110, height: 110, borderRadius: "50%", cursor: "pointer",
            background: "radial-gradient(circle at 36% 30%, var(--c-wine-lt), var(--c-wine) 52%, var(--c-wine-dk))",
            boxShadow: "0 8px 40px rgba(107,38,53,0.55), 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.1)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "0.3rem", border: "none", position: "relative",
          }}
        >
          {/* Pulse rings */}
          {[1.22, 1.45].map((scale, i) => (
            <motion.div key={i}
              animate={{ scale: [1, scale, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: "1px solid rgba(181,137,78,0.4)" }}
            />
          ))}
          <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>♡</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "0.44rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(247,240,230,0.55)", fontWeight: 400 }}>
            Abrir
          </span>
        </motion.button>

      </motion.div>
    </motion.div>
  );
}
