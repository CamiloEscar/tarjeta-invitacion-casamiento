"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TRIVIA } from "@/lib/config";
import { W } from "@/lib/config";

type State = "idle" | "answered";

export default function Trivia() {
  const ref   = useRef<HTMLDivElement>(null!);
  const v     = useInView(ref, { once:true, amount:0.2 });
  const [q,   setQ]      = useState(0);
  const [sel, setSel]    = useState<number|null>(null);
  const [st,  setSt]     = useState<State>("idle");
  const [score, setScore]= useState(0);
  const [done, setDone]  = useState(false);

  const current = TRIVIA[q];

  function pick(idx: number) {
    if (st === "answered") return;
    setSel(idx);
    setSt("answered");
    if (idx === current.correct) setScore(s => s+1);
  }

  function next() {
    if (q + 1 >= TRIVIA.length) { setDone(true); return; }
    setQ(q+1);
    setSel(null);
    setSt("idle");
  }

  function restart() {
    setQ(0); setSel(null); setSt("idle"); setScore(0); setDone(false);
  }

  const pct = Math.round((score / TRIVIA.length) * 100);

  return (
    <section id="trivia" className="s-pad surf-dark-2 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 60% 50% at 50% 50%, rgba(181,137,78,0.04) 0%, transparent 70%)"
      }} />

      <div className="w-narrow px-6" ref={ref}>

        {/* Header */}
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>
          Mini trivia
        </motion.p>
        <motion.h2 initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}
          style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-text-inv)", lineHeight:1.1, marginBottom:"0.25rem" }}>
          ¿Cuánto sabés de <span style={{ color:"var(--c-gold-lt)" }}>nosotros?</span>
        </motion.h2>
        <motion.div className="g-line" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />
        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.22 }}
          className="t-body mb-10" style={{ color:"var(--c-text-inv2)", fontSize:"0.85rem" }}>
          {TRIVIA.length} preguntas sobre la historia de {W.bride} y {W.groom} 💫
        </motion.p>

        <motion.div initial={{ opacity:0,y:20 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.3 }}>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={`q-${q}`}
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
                transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
              >
                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-1 overflow-hidden" style={{ background:"rgba(181,137,78,0.15)" }}>
                    <motion.div
                      animate={{ width:`${((q)/TRIVIA.length)*100}%` }}
                      transition={{ duration:0.5 }}
                      style={{ height:"100%", background:"var(--c-gold)" }}
                    />
                  </div>
                  <span className="t-label" style={{ color:"rgba(181,137,78,0.55)", fontSize:"0.55rem", whiteSpace:"nowrap" }}>
                    {q+1} / {TRIVIA.length}
                  </span>
                </div>

                {/* Question */}
                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"clamp(1.1rem,3vw,1.45rem)", color:"var(--c-text-inv)", lineHeight:1.3, marginBottom:"1.5rem" }}>
                  {current.question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5 mb-5">
                  {current.options.map((opt,i) => {
                    let cls = "trivia-opt";
                    if (st==="answered") {
                      if (i===current.correct) cls += " correct";
                      else if (i===sel) cls += " wrong";
                    }
                    return (
                      <motion.button key={i} onClick={() => pick(i)}
                        whileTap={st==="idle"?{ scale:0.98 }:{}}
                        className={cls}
                        disabled={st==="answered"}
                      >
                        <span style={{ color:"var(--c-gold)", marginRight:"0.6rem", fontSize:"0.7rem" }}>
                          {String.fromCharCode(65+i)}.
                        </span>
                        {opt}
                        {st==="answered" && i===current.correct && (
                          <span className="ml-2">✓</span>
                        )}
                        {st==="answered" && i===sel && i!==current.correct && (
                          <span className="ml-2">✗</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Fun fact after answer */}
                <AnimatePresence>
                  {st==="answered" && (
                    <motion.div
                      initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 mb-5" style={{ background:"rgba(181,137,78,0.08)", borderLeft:"2px solid var(--c-gold)" }}>
                        <p className="t-body" style={{ color:"var(--c-text-inv2)", fontSize:"0.82rem" }}>
                          {current.fun}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="t-label" style={{ color:"rgba(181,137,78,0.55)", fontSize:"0.58rem" }}>
                          Puntaje: {score} / {q + (sel===current.correct?1:0)}
                        </span>
                        <button onClick={next} className="btn-wine">
                          <span>{q+1 >= TRIVIA.length ? "Ver resultado ✓" : "Siguiente →"}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Results */
              <motion.div key="results"
                initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ type:"spring", stiffness:260, damping:20, delay:0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background:"rgba(181,137,78,0.1)", border:"1px solid var(--c-gold)", fontSize:"2.2rem" }}>
                  {pct===100?"🏆":pct>=75?"🌟":pct>=50?"💫":"💌"}
                </motion.div>

                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.8rem", color:"var(--c-gold-lt)", marginBottom:"0.5rem" }}>
                  {pct===100?"¡Perfecto!":pct>=75?"¡Muy bien!":pct>=50?"¡Nada mal!":"¡Hay que conocerlos más!"}
                </h3>
                <p className="t-body mb-2" style={{ color:"var(--c-text-inv2)" }}>
                  Acertaste <strong style={{ color:"var(--c-gold-lt)" }}>{score}</strong> de <strong style={{ color:"var(--c-gold-lt)" }}>{TRIVIA.length}</strong> preguntas
                </p>

                {/* Score bar */}
                <div className="w-48 h-2 mx-auto my-5 overflow-hidden" style={{ background:"rgba(181,137,78,0.15)" }}>
                  <motion.div
                    initial={{ width:0 }} animate={{ width:`${pct}%` }}
                    transition={{ duration:1, delay:0.3, ease:[0.22,1,0.36,1] }}
                    style={{ height:"100%", background:`linear-gradient(to right, var(--c-wine), var(--c-gold))` }}
                  />
                </div>

                <p className="t-body mb-6" style={{ color:"var(--c-text-inv2)", fontSize:"0.82rem" }}>
                  {pct===100
                    ? `¡Sos el/la fan número 1 de ${W.bride} y ${W.groom}! 🎉`
                    : `¡El día de la boda vas a enterarte de todos los detalles! 😄`}
                </p>

                <button onClick={restart} className="btn-outline-light">
                  <span>↺ Jugar de nuevo</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
