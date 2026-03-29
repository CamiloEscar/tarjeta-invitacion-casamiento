"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { W } from "@/lib/config";

type Status = "idle" | "loading" | "success" | "error";

interface Form {
  nombre: string;
  asistencia: "Si" | "No" | "";
  acompanantes: string;
  shuttle: boolean;
  restricciones: string;
  mensaje: string;
}

const EMPTY: Form = {
  nombre:"", asistencia:"", acompanantes:"0",
  shuttle: false, restricciones:"", mensaje:"",
};

export default function RSVP() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once:true, amount:0.1 });

  const [form,   setForm]   = useState<Form>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");

  const set = (k: keyof Form, val: any) => setForm(p => ({ ...p, [k]: val }));

  async function submit() {
    if (!form.asistencia || !form.nombre.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre:      form.nombre.split(" ")[0],
          apellido:    form.nombre.split(" ").slice(1).join(" "),
          email:       `${form.nombre.toLowerCase().replace(/\s/g,"-")}@invitado.com`,
          asistencia:  form.asistencia,
          acompanantes:form.acompanantes,
          shuttle:     form.shuttle ? "Sí" : "No",
          restricciones:form.restricciones,
          mensaje:     form.mensaje,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const canSubmit = form.nombre.trim().length >= 2 && form.asistencia !== "";

  return (
    <section id="rsvp" className="s-pad surf-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{
        background:"radial-gradient(ellipse 70% 80% at 100% 50%, rgba(107,38,53,0.1) 0%, transparent 65%)",
      }} />

      <div className="w-narrow px-6" ref={ref}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:24 }} animate={v?{opacity:1,y:0}:{}} transition={{ duration:0.8 }}>
          <p className="t-eye mb-3">Confirmación</p>
          <h2 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-text-inv)", lineHeight:1.1, marginBottom:"0.25rem" }}>
            ¿Venís a <span style={{ color:"var(--c-wine-lt)" }}>la boda?</span>
          </h2>
          <div className="g-line" />
          <p className="t-body mt-4 mb-9" style={{ color:"var(--c-text-inv2)", fontSize:"0.85rem" }}>
            Avisanos antes del <strong style={{ color:"var(--c-gold-lt)", fontWeight:400 }}>{W.rsvpDeadline}</strong> así podemos organizar bien todo.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* SUCCESS */}
          {status === "success" && (
            <motion.div key="ok"
              initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }}
              className="text-center py-12">
              <motion.div
                initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ type:"spring", stiffness:280, damping:22, delay:0.1 }}
                style={{ width:72, height:72, borderRadius:"50%", background:"rgba(181,137,78,0.1)", border:"1px solid var(--c-gold)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem", fontSize:"2rem" }}>
                {form.asistencia === "Si" ? "🥂" : "💌"}
              </motion.div>
              <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.9rem", color:"var(--c-gold-lt)", marginBottom:"0.6rem" }}>
                ¡Gracias{form.nombre ? `, ${form.nombre.split(" ")[0]}` : ""}!
              </h3>
              <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.85rem", color:"var(--c-text-inv2)", lineHeight:1.75, fontWeight:300 }}>
                {form.asistencia === "Si"
                  ? `¡Nos re-alegra que vengas! Te esperamos el ${W.weddingDateLabel} 🌹`
                  : "Entendemos. Te vamos a extrañar ese día, pero te mandamos todo el amor 💌"
                }
              </p>
              <button onClick={() => { setStatus("idle"); setForm(EMPTY); }}
                className="mt-8 t-eye transition-colors"
                style={{ color:"rgba(154,128,104,0.45)", fontSize:"0.6rem" }}>
                ↩ Modificar
              </button>
            </motion.div>
          )}

          {/* FORM */}
          {status !== "success" && (
            <motion.div key="form" initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.25 }}>

              {/* Nombre */}
              <div className="mb-5">
                <label style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", display:"block", marginBottom:"0.5rem" }}>
                  Tu nombre
                </label>
                <input
                  value={form.nombre}
                  onChange={e => set("nombre", e.target.value)}
                  placeholder="Nombre y apellido"
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderBottom:"1px solid rgba(181,137,78,0.25)", padding:"0.75rem 0.25rem", fontFamily:"var(--font-jost)", fontSize:"1rem", color:"var(--c-text-inv)", outline:"none", transition:"border-color 0.2s" }}
                  onFocus={e => (e.target.style.borderBottomColor = "var(--c-gold)")}
                  onBlur={e  => (e.target.style.borderBottomColor = "rgba(181,137,78,0.25)")}
                />
              </div>

              {/* ¿Venís? */}
              <div className="mb-6">
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", marginBottom:"0.75rem" }}>
                  ¿Vas a venir?
                </p>
                <div className="flex gap-3">
                  {[
                    { v:"Si" as const, icon:"🥂", label:"¡Sí, ahí estoy!" },
                    { v:"No" as const, icon:"💌", label:"No puedo ir" },
                  ].map(opt => {
                    const active = form.asistencia === opt.v;
                    return (
                      <motion.button key={opt.v} type="button" onClick={() => set("asistencia", opt.v)}
                        whileTap={{ scale:0.97 }}
                        className="flex-1 flex flex-col items-center gap-2 py-4 px-3 transition-all duration-200"
                        style={{ border:`1px solid ${active?"var(--c-gold)":"rgba(181,137,78,0.18)"}`, background:active?"rgba(181,137,78,0.09)":"rgba(255,255,255,0.03)", cursor:"pointer" }}>
                        <span style={{ fontSize:"1.6rem" }}>{opt.icon}</span>
                        <span style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"0.95rem", color:active?"var(--c-gold-lt)":"var(--c-text-inv)" }}>{opt.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Details — only if attending */}
              <AnimatePresence>
                {form.asistencia === "Si" && (
                  <motion.div key="details"
                    initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                    style={{ overflow:"hidden" }}>
                    <div className="flex flex-col gap-5 pt-1 pb-5">

                      {/* Acompañantes */}
                      <div>
                        <label style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", display:"block", marginBottom:"0.5rem" }}>
                          ¿Vas con alguien?
                        </label>
                        <select value={form.acompanantes} onChange={e => set("acompanantes", e.target.value)}
                          style={{ width:"100%", background:"var(--c-dark-2)", border:"none", borderBottom:"1px solid rgba(181,137,78,0.25)", padding:"0.75rem 0.25rem", fontFamily:"var(--font-jost)", fontSize:"0.9rem", color:"var(--c-text-inv)", outline:"none", WebkitAppearance:"none", cursor:"pointer" }}>
                          <option value="0">Solo/a</option>
                          <option value="1">Con 1 persona</option>
                          <option value="2">Con 2 personas</option>
                          <option value="3">Con 3 personas</option>
                          <option value="4">Con 4 o más</option>
                        </select>
                      </div>

                      {/* Shuttle */}
                      {W.logistics.shuttle.available && (
                        <div>
                          <label style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", display:"block", marginBottom:"0.5rem" }}>
                            Auto gratuito (iglesia → salón)
                          </label>
                          <div className="flex gap-3">
                            {[{ v:true, l:"Sí, me sumo" },{ v:false, l:"Voy por mi cuenta" }].map(opt => (
                              <button key={String(opt.v)} type="button" onClick={() => set("shuttle", opt.v)}
                                style={{ flex:1, padding:"0.65rem", fontFamily:"var(--font-jost)", fontSize:"0.78rem", cursor:"pointer", border:`1px solid ${form.shuttle===opt.v?"var(--c-gold)":"rgba(181,137,78,0.18)"}`, background:form.shuttle===opt.v?"rgba(181,137,78,0.08)":"rgba(255,255,255,0.02)", color:form.shuttle===opt.v?"var(--c-gold-lt)":"var(--c-text-inv2)", transition:"all 0.2s" }}>
                                {opt.l}
                              </button>
                            ))}
                          </div>
                          <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.65rem", color:"rgba(154,128,104,0.4)", marginTop:"0.4rem", fontWeight:300 }}>
                            {W.logistics.shuttle.info}
                          </p>
                        </div>
                      )}

                      {/* Restricciones */}
                      <div>
                        <label style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", display:"block", marginBottom:"0.5rem" }}>
                          ¿Tenés alguna restricción alimentaria?
                        </label>
                        <input
                          value={form.restricciones}
                          onChange={e => set("restricciones", e.target.value)}
                          placeholder="Vegetariano, celíaco, alergias... (opcional)"
                          style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderBottom:"1px solid rgba(181,137,78,0.25)", padding:"0.75rem 0.25rem", fontFamily:"var(--font-jost)", fontSize:"0.9rem", color:"var(--c-text-inv)", outline:"none" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mensaje opcional */}
              <div className="mb-6">
                <label style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", display:"block", marginBottom:"0.5rem" }}>
                  Un mensaje para nosotros (opcional)
                </label>
                <textarea
                  value={form.mensaje}
                  onChange={e => set("mensaje", e.target.value)}
                  placeholder="Lo que quieras contarnos ✨"
                  rows={3}
                  style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderBottom:"1px solid rgba(181,137,78,0.25)", padding:"0.75rem 0.25rem", fontFamily:"var(--font-jost)", fontSize:"0.9rem", color:"var(--c-text-inv)", outline:"none", resize:"none" }}
                />
              </div>

              {status === "error" && (
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.78rem", color:"#ef9a9a", padding:"0.6rem 0.75rem", background:"rgba(200,50,50,0.08)", borderLeft:"2px solid rgba(200,50,50,0.4)", marginBottom:"1rem", lineHeight:1.6 }}>
                  Algo salió mal. Intentá de nuevo o avisanos por WhatsApp.
                </p>
              )}

              {/* Submit */}
              <button
                onClick={submit}
                disabled={!canSubmit || status === "loading"}
                className="btn-wine w-full justify-center disabled:opacity-30 disabled:pointer-events-none">
                <span>
                  {status === "loading"
                    ? <span className="flex items-center gap-2">
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".25"/>
                          <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" opacity=".75"/>
                        </svg>
                        Enviando...
                      </span>
                    : "Avisarles que voy ✓"
                  }
                </span>
              </button>

              {!canSubmit && (
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.65rem", color:"rgba(154,128,104,0.35)", textAlign:"center", marginTop:"0.6rem" }}>
                  Escribí tu nombre y elegí si venís
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
