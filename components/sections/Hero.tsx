"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { W } from "@/lib/config";
import { useCountdown } from "@/hooks/useCountdown";

// ─────────────────────────────────────────────────────────────
//  Hero — pantalla principal con fondo de video o imagen
//
//  Mejoras v2:
//   - Barra de carga de video con progreso real (buffered)
//   - Transición suave imagen → video con crossfade
//   - Fix overflow en mobile (overflow-x hidden en section)
//   - Overlay recortado correctamente en todos los viewports
// ─────────────────────────────────────────────────────────────

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=85";

const FILTERS: Record<string, { filter: string; overlay: string }> = {
  romance: {
    filter: "brightness(0.35) saturate(0.7) sepia(0.3)",
    overlay: `
      linear-gradient(to bottom, rgba(20,8,4,0.85) 0%, rgba(44,20,10,0.2) 35%, rgba(44,20,10,0.15) 60%, rgba(20,8,4,0.88) 100%),
      radial-gradient(ellipse at 50% 40%, rgba(181,137,78,0.06) 0%, transparent 60%)
    `,
  },
  cinema: {
    filter: "brightness(0.28) contrast(1.1) saturate(0.5)",
    overlay: `linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.9) 100%)`,
  },
  soft: {
    filter: "brightness(0.45) saturate(0.6) blur(1px)",
    overlay: `linear-gradient(to bottom, rgba(20,8,4,0.7) 0%, rgba(20,8,4,0.08) 40%, rgba(20,8,4,0.06) 60%, rgba(20,8,4,0.75) 100%)`,
  },
  dark: {
    filter: "brightness(0.24) saturate(0.55)",
    overlay: `linear-gradient(to bottom, rgba(20,10,5,0.88) 0%, rgba(20,10,5,0.28) 45%, rgba(20,10,5,0.82) 100%)`,
  },
};

function CountUnit({ val, label, ready }: { val: number; label: string; ready: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        style={{
          fontFamily: "var(--font-playfair)",
          fontWeight: 400,
          fontSize: "clamp(1.6rem, 5.5vw, 3rem)",
          lineHeight: 1,
          color: "var(--c-gold-lt)",
          fontVariantNumeric: "tabular-nums",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.4s ease",
          minWidth: "2.2ch",
          textAlign: "center",
          display: "block",
        }}
      >
        {String(val).padStart(2, "0")}
      </span>
      <span
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: "clamp(0.38rem, 1vw, 0.5rem)",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(154,128,104,0.55)",
          fontWeight: 400,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Video load bar — franja horizontal integrada en bottom bar
// function VideoLoadBar({ progress, visible }: { progress: number; visible: boolean }) {
//   const [countdown, setCountdown] = useState<number | null>(null);
//   const startTimeRef = useRef<number | null>(null);

//   useEffect(() => {
//     if (!visible || progress >= 100) return;
//     if (startTimeRef.current === null && progress > 0) {
//       startTimeRef.current = Date.now();
//     }
//     if (startTimeRef.current && progress > 0 && progress < 100) {
//       const elapsed   = (Date.now() - startTimeRef.current) / 1000;
//       const rate      = progress / elapsed;
//       const remaining = rate > 0 ? (100 - progress) / rate : null;
//       setCountdown(remaining !== null ? Math.ceil(remaining) : null);
//     }
//   }, [progress, visible]);

//   const isReady = progress >= 100;

//   return (
//     <div style={{
//       display: "flex",
//       alignItems: "center",
//       gap: "clamp(0.75rem, 3vw, 1.5rem)",
//       padding: "0.6rem clamp(1rem, 4vw, 2rem) 0.9rem",
//       borderTop: "1px solid rgba(181,137,78,0.1)",
//     }}>

//       {/* Spinner / play icon */}
//       <div style={{ position: "relative", width: 22, height: 22, flexShrink: 0 }}>
//         {isReady ? (
//           <motion.div
//             initial={{ scale: 0.5, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             style={{
//               width: 22, height: 22,
//               borderRadius: "50%",
//               background: "rgba(181,137,78,0.15)",
//               border: "1px solid rgba(181,137,78,0.35)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}
//           >
//             <svg width="7" height="8" viewBox="0 0 7 8" fill="none">
//               <path d="M1 1l5 3-5 3V1z" fill="var(--c-gold)" />
//             </svg>
//           </motion.div>
//         ) : (
//           <>
//             <motion.div
//               animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
//               transition={{ duration: 1.8, repeat: Infinity }}
//               style={{
//                 position: "absolute", inset: 0,
//                 borderRadius: "50%",
//                 border: "1px solid rgba(181,137,78,0.35)",
//               }}
//             />
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
//               style={{
//                 position: "absolute", inset: 3,
//                 borderRadius: "50%",
//                 border: "1.5px solid transparent",
//                 borderTopColor: "var(--c-gold)",
//               }}
//             />
//           </>
//         )}
//       </div>

//       {/* Label + bar + countdown */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>

//         {/* Top row: label izq, countdown der */}
//         <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
//           <span style={{
//             fontFamily: "var(--font-jost)",
//             fontSize: "clamp(0.38rem, 0.9vw, 0.46rem)",
//             letterSpacing: "0.24em",
//             textTransform: "uppercase",
//             color: isReady ? "var(--c-gold-lt)" : "rgba(181,137,78,0.45)",
//           }}>
//             {isReady ? "Reproduciendo" : "Cargando video"}
//           </span>

//           {/* Countdown — aparece cuando hay estimación ≤ 30 seg */}
//           <AnimatePresence mode="wait">
//             {!isReady && countdown !== null && countdown > 0 && countdown <= 60 && (
//               <motion.div
//                 key={countdown}
//                 initial={{ opacity: 0, y: -3 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.25 }}
//                 style={{ display: "flex", alignItems: "baseline", gap: "0.18rem" }}
//               >
//                 <span style={{
//                   fontFamily: "var(--font-playfair)",
//                   fontStyle: "italic",
//                   fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
//                   color: "var(--c-gold-lt)",
//                   lineHeight: 1,
//                   fontVariantNumeric: "tabular-nums",
//                 }}>
//                   {countdown}
//                 </span>
//                 <span style={{
//                   fontFamily: "var(--font-jost)",
//                   fontSize: "clamp(0.3rem, 0.7vw, 0.38rem)",
//                   letterSpacing: "0.18em",
//                   textTransform: "uppercase",
//                   color: "rgba(154,128,104,0.38)",
//                 }}>
//                   seg
//                 </span>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Progress track */}
//         <div style={{
//           width: "100%",
//           height: 2,
//           background: "rgba(181,137,78,0.1)",
//           overflow: "hidden",
//           position: "relative",
//         }}>
//           <motion.div
//             animate={{ width: `${progress}%` }}
//             transition={{ duration: 3, ease: "linear" }}
//             style={{
//               height: "100%",
//               background: isReady
//                 ? "linear-gradient(to right, var(--c-wine), var(--c-gold))"
//                 : "linear-gradient(to right, rgba(181,137,78,0.25), var(--c-gold))",
//             }}
//           />
//           {!isReady && (
//             <motion.div
//               animate={{ x: ["-100%", "500%"] }}
//               transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
//               style={{
//                 position: "absolute", top: 0, left: 0,
//                 width: "25%", height: "100%",
//                 background: "linear-gradient(to right, transparent, rgba(255,220,150,0.5), transparent)",
//               }}
//             />
//           )}
//         </div>
//       </div>

//       {/* Percentage */}
//       <span style={{
//         fontFamily: "var(--font-jost)",
//         fontSize: "clamp(0.36rem, 0.8vw, 0.42rem)",
//         letterSpacing: "0.14em",
//         color: "rgba(154,128,104,0.28)",
//         flexShrink: 0,
//         minWidth: "2.5ch",
//         textAlign: "right",
//       }}>
//         {progress}%
//       </span>
//     </div>
//   );
// }

function VideoLoadBar({ progress }: { progress: number }) {
  return (
    <div style={{
      padding: "0.6rem clamp(1rem, 4vw, 2rem) 0.9rem",
      borderTop: "1px solid rgba(181,137,78,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
    }}>
      {/* Label + porcentaje */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{
          fontFamily: "var(--font-jost)",
          fontSize: "clamp(0.38rem, 0.9vw, 0.46rem)",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(181,137,78,0.45)",
        }}>
          Cargando video
        </span>
        <span style={{
          fontFamily: "var(--font-jost)",
          fontSize: "clamp(0.36rem, 0.8vw, 0.42rem)",
          letterSpacing: "0.14em",
          color: "rgba(154,128,104,0.4)",
        }}>
          {progress}%
        </span>
      </div>

      {/* Barra */}
      <div style={{
        width: "100%",
        height: 2,
        background: "rgba(181,137,78,0.1)",
        overflow: "hidden",
      }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2.5, ease: "linear" }}
          style={{
            height: "100%",
            background: "linear-gradient(to right, rgba(181,137,78,0.25), var(--c-gold))",
          }}
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const ref    = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY  = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const txtY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const { days, hours, minutes, seconds, ready } = useCountdown(W.weddingDate);

  const [videoReady,    setVideoReady]    = useState(false);
  const [videoError,    setVideoError]    = useState(false);
  const [loadProgress,  setLoadProgress]  = useState(0);   // 0–100
  const [showLoadBar,   setShowLoadBar]   = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const hasVideo     = Boolean(W.heroVideo);
  const bgImage      = W.heroBgImage || DEFAULT_BG;
  const filterPreset = FILTERS[W.heroFilter] ?? FILTERS.romance;

  // // Track buffered progress
  // useEffect(() => {
  //   const v = vidRef.current;
  //   if (!v || !W.heroVideo) return;

  //   // Show bar shortly after mount so user knows video is coming
  //   const showTimer = setTimeout(() => setShowLoadBar(true), 500);

  //   const updateProgress = () => {
  //     if (!v.duration) return;
  //     const buffered = v.buffered;
  //     if (buffered.length > 0) {
  //       const loaded = (buffered.end(buffered.length - 1) / v.duration) * 100;
  //       setLoadProgress(Math.min(Math.round(loaded), 100));
  //     }
  //   };

  //   const onCanPlay = () => {
  //     setLoadProgress(100);
  //     v.muted = true;
  //     v.play().catch(() => {});
  //   };

  //   const onPlaying = () => {
  //     setTimeout(() => {
  //       setVideoReady(true);
  //       setTimeout(() => setShowLoadBar(false), 8000); // luego oculta la barra
  //     }, 3000); // retrasa la transición visual
  //   };

  //   const onError = () => {
  //     setVideoError(true);
  //     setShowLoadBar(false);
  //   };

  //   v.addEventListener("progress",   updateProgress);
  //   v.addEventListener("canplay",    onCanPlay);
  //   v.addEventListener("playing",    onPlaying);
  //   v.addEventListener("error",      onError);

  //   return () => {
  //     clearTimeout(showTimer);
  //     v.removeEventListener("progress",   updateProgress);
  //     v.removeEventListener("canplay",    onCanPlay);
  //     v.removeEventListener("playing",    onPlaying);
  //     v.removeEventListener("error",      onError);
  //   };
  // }, []);

  useEffect(() => {
  const v = vidRef.current;
  if (!v || !W.heroVideo) return;

  const showTimer = setTimeout(() => setShowLoadBar(true), 500);

  const updateProgress = () => {
    if (!v.duration || !v.buffered.length) return;
    const loaded = (v.buffered.end(v.buffered.length - 1) / v.duration) * 100;
    setLoadProgress(Math.min(Math.round(loaded), 100));
  };

  const onCanPlay = () => {
    setLoadProgress(100);
    v.muted = true;
    v.play().catch(() => {});
  };

  const onPlaying = () => {
    setVideoReady(true);
    setTimeout(() => setShowLoadBar(false), 2000);
  };

  const onError = () => {
    setVideoError(true);
    setShowLoadBar(false);
  };

  v.addEventListener("progress", updateProgress);
  v.addEventListener("canplay",  onCanPlay);
  v.addEventListener("playing",  onPlaying);
  v.addEventListener("error",    onError);

  return () => {
    clearTimeout(showTimer);
    v.removeEventListener("progress", updateProgress);
    v.removeEventListener("canplay",  onCanPlay);
    v.removeEventListener("playing",  onPlaying);
    v.removeEventListener("error",    onError);
  };
}, [videoSrc]);

// Detect viewport and choose video source
useEffect(() => {
  if (!W.heroVideo) return;
  const d = window.innerWidth >= 768;
  setIsDesktop(d);
  const src = d && W.heroVideoDesktop ? W.heroVideoDesktop : W.heroVideo;
  setVideoSrc(src);
}, []);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "100svh",
        // Explicitly constrain width so nothing escapes
        maxWidth: "100vw",
        width: "100%",
      }}
    >
      {/* ── Background Layer ───────────────────────────────── */}
      <motion.div
        style={{
          overflow: "hidden",
          y: bgY,
          ...(isDesktop ? { height: "150svh" } : { bottom: 0 }),
        }}
        className="absolute left-0 right-0 top-0 -z-10"
      >
        {/* Image background — always rendered underneath */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            filter: filterPreset.filter,
            transform: "scale(1.08)",
            // Transition out when video takes over
            opacity: videoReady ? 0 : 1,
            transition: "opacity 1.2s ease",
          }}
        />

        {/* Video background — crossfades in over image */}
        {hasVideo && videoSrc && !videoError && (
          <video
            ref={vidRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 35%",
              filter: filterPreset.filter,
              opacity: videoReady ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          />
        )}

        {/* Cinematic overlay */}
        <div
          className="absolute inset-0"
          style={{ background: filterPreset.overlay }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            opacity: 0.4,
          }}
        />
      </motion.div>

      {/* ── Decorative rings ────────────────────────────────── */}
      {[500, 340].map((sz, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.25, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute pointer-events-none rounded-full"
          style={{
            width:  `clamp(${sz * 0.5}px, ${sz * 0.55}vw + 120px, ${sz}px)`,
            height: `clamp(${sz * 0.5}px, ${sz * 0.55}vw + 120px, ${sz}px)`,
            border: `1px solid rgba(181,137,78,${i === 0 ? 0.1 : 0.06})`,
            // Keep rings from overflowing on small screens
            maxWidth: "95vw",
            maxHeight: "95vw",
          }}
        />
      ))}

      {/* ── Text Content ─────────────────────────────────────── */}
      <motion.div
        style={{
          y: txtY,
          opacity: fade as any,
          // Ensure text container never overflows
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "min(640px, 92vw)",
          padding: "0 clamp(1.25rem, 5vw, 2rem)",
          boxSizing: "border-box",
        }}
      >
        {/* Eyebrow line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.55, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(0.75rem, 3vw, 1.25rem)",
            marginBottom: "clamp(1.5rem, 4vw, 2.25rem)",
            width: "100%",
            maxWidth: 280,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, var(--c-gold))" }} />
          <span
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)",
              color: "var(--c-gold-lt)",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}
          >
            Nos casamos
          </span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, var(--c-gold))" }} />
        </motion.div>

        {/* Names */}
        <div style={{ overflow: "hidden" }}>
          <motion.p
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.65, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="t-hero"
            style={{ color: "#EEE2D2", lineHeight: 0.9 }}
          >
            {W.bride}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(1.8rem, 6vw, 4rem)",
            color: "var(--c-gold)",
            lineHeight: 1,
            margin: "0.08em 0",
          }}
        >
          &amp;
        </motion.div>

        <div style={{ overflow: "hidden" }}>
          <motion.p
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.75, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="t-hero"
            style={{ color: "#EEE2D2", lineHeight: 0.9 }}
          >
            {W.groom}
          </motion.p>
        </div>

        {/* Date + location */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          style={{
            fontFamily: "var(--font-jost)",
            fontWeight: 300,
            fontSize: "clamp(0.6rem, 1.8vw, 0.82rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(196,168,130,0.7)",
            marginTop: "clamp(1rem, 3vw, 1.5rem)",
          }}
        >
          {W.weddingDateLabel} · {W.location}
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.9 }}
          style={{ marginTop: "clamp(1.75rem, 5vw, 2.5rem)", width: "100%" }}
        >
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "clamp(0.38rem, 1vw, 0.48rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(154,128,104,0.45)",
              marginBottom: "clamp(0.8rem, 2.5vw, 1.25rem)",
            }}
          >
            FALTAN
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: "clamp(0.6rem, 2.5vw, 1.75rem)",
            }}
          >
            {[
              { v: days,    l: "días"  },
              { v: hours,   l: "horas" },
              { v: minutes, l: "min"   },
              { v: seconds, l: "seg"   },
            ].map((u, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "clamp(0.6rem, 2.5vw, 1.75rem)",
                }}
              >
                <CountUnit val={u.v} label={u.l} ready={ready} />
                {i < 3 && (
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.1rem, 3.5vw, 2rem)",
                      color: "rgba(181,137,78,0.2)",
                      lineHeight: 1,
                      paddingBottom: "clamp(0.9rem, 2.5vw, 1.5rem)",
                    }}
                  >
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Ornament below countdown */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "clamp(1rem, 3vw, 1.75rem)",
              width: "100%",
              maxWidth: 280,
              margin: "clamp(1rem, 3vw, 1.75rem) auto 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(181,137,78,0.22))" }} />
            <span style={{ color: "rgba(181,137,78,0.32)", fontSize: "0.55rem" }}>✦</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(181,137,78,0.22))" }} />
          </div>
        </motion.div>

        {/* Phrase */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.85 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(0.95rem, 2.5vw, 1.3rem)",
            color: "rgba(196,168,130,0.55)",
            marginTop: "clamp(1rem, 3vw, 1.5rem)",
            maxWidth: "32ch",
            lineHeight: 1.65,
          }}
        >
          "{W.heroPhrase}"
        </motion.p>
      </motion.div>

      {/* ── Bottom bar: cuenta regresiva + scroll ────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.8 }}
        style={{
          opacity: fade as any,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: "none",
          background: "transparent",
        }}
      >
        {/* Scroll hint centrado */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "1.5rem",
          paddingBottom: "0.5rem",
        }}>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}
          >
            <div style={{ width: 1, height: 26, background: "linear-gradient(to bottom, rgba(196,168,130,0.55), transparent)" }} />
            <span style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.64rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(196,168,130,0.55)",
            }}>
              Desliza
            </span>
          </motion.div>
        </div>

        {/* Video load bar — solo visible cuando hay video cargando */}
        <AnimatePresence>
          {showLoadBar && hasVideo && videoSrc && !videoError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, transition: { delay: 0.6, duration: 0.5 } }}
              style={{ overflow: "hidden" }}
            >
              <VideoLoadBar progress={loadProgress} 
              // visible={true} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}