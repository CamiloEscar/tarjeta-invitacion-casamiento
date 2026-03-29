"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { W, AGENDA } from "@/lib/config";

// Mesa is loaded dynamically from the API (set by admin in /admin)
import { useCountdown } from "@/hooks/useCountdown";

// ─────────────────────────────────────────────────────────────
//  /invite/[nombre] — Invitación personalizada
//  Sin animación de sobre. Directo al contenido elegante.
//  RSVP inline. Compartir por WhatsApp = comparte la URL
//  con preview OG (WhatsApp lee los meta tags automáticamente).
// ─────────────────────────────────────────────────────────────

interface Props { guestName: string; slug: string; }

type RSVPStatus = "idle" | "loading" | "success" | "error";
interface RSVPForm {
  asistencia: "Si" | "No" | "";
  acompanantes: string;
  restricciones: string;
  mensaje: string;
}

export default function InviteClient({ guestName, slug }: Props) {
  const { days, hours, minutes, seconds, ready } = useCountdown(W.weddingDate);
  const [mesa, setMesa] = useState<string | null>(null);

  useEffect(() => {
    // Fetch assigned table from API (set by admin in /admin → Mesas tab)
    fetch(`/api/mesas?action=getMesa&slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => { if (d.mesa) setMesa(d.mesa); })
      .catch(() => {}); // silent fail — mesa is optional
  }, [slug]);
  const [pageUrl,  setPageUrl]  = useState("");
  const [waUrl,    setWaUrl]    = useState("");
  const [printUrl, setPrintUrl] = useState("");

  // RSVP state
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>("idle");
  const [form, setForm] = useState<RSVPForm>({ asistencia:"", acompanantes:"0", restricciones:"", mensaje:"" });
  const rsvpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url    = window.location.href;
    const origin = window.location.origin;
    setPageUrl(url);
    setPrintUrl(`${origin}/print?slug=${encodeURIComponent(slug)}&name=${encodeURIComponent(guestName)}`);
    const text = `¡Hola! Te comparto tu invitación al casamiento de ${W.bride} y ${W.groom} 💍\n\n${W.weddingDateLabel} · ${W.location}\n\n${url}`;
    setWaUrl(`https://wa.me/?text=${encodeURIComponent(text)}`);
  }, [slug, guestName]);

  function setF(k: keyof RSVPForm, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submitRSVP() {
    if (!form.asistencia) return;
    setRsvpStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: guestName.split(" ")[0], apellido: guestName.split(" ").slice(1).join(" "), email: `${slug}@invitado.com`, ...form }),
      });
      if (!res.ok) throw new Error();
      setRsvpStatus("success");
    } catch { setRsvpStatus("error"); }
  }

  const first = guestName.split(" ")[0];

  return (
    <div style={{ minHeight:"100dvh", background:"var(--c-dark)", overflowX:"hidden" }}>

      {/* ── HERO — nombres + sello + countdown ── */}
      <div style={{ position:"relative", minHeight:"100svh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"4rem 1.5rem 3rem", overflow:"hidden" }}>

        {/* BG photo */}
        <div style={{ position:"absolute", inset:0, zIndex:0 }}>
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" alt=""
            style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.22) saturate(0.5)" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(20,10,5,0.7) 0%, rgba(20,10,5,0.3) 50%, rgba(20,10,5,0.9) 100%)" }} />
        </div>

        <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:520 }}>

          {/* Personal greeting */}
          <motion.p initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ fontFamily:"var(--font-jost)", fontSize:"0.6rem", letterSpacing:"0.32em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", marginBottom:"1.5rem" }}>
            Invitación especial para
          </motion.p>

          {/* Guest name */}
          <div style={{ overflow:"hidden", marginBottom:"0.25rem" }}>
            <motion.h1 initial={{ y:"100%" }} animate={{ y:0 }} transition={{ delay:0.15, duration:0.9, ease:[0.22,1,0.36,1] }}
              style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2.8rem,9vw,5rem)", color:"#EEE2D2", lineHeight:1.05 }}>
              {guestName}
            </motion.h1>
          </div>

          {/* Divider ornament */}
          <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.45, duration:0.8 }}
            style={{ width:56, height:1, background:"linear-gradient(to right, transparent, var(--c-gold), transparent)", margin:"1.5rem auto" }} />

          {/* Couple names */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}>
            <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1.1rem,3vw,1.5rem)", color:"rgba(196,168,130,0.75)", lineHeight:1.5, marginBottom:"0.4rem" }}>
              {W.bride} y {W.groom}
            </p>
            <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1rem,2.5vw,1.25rem)", color:"rgba(196,168,130,0.5)" }}>
              te invitan a celebrar su casamiento
            </p>
          </motion.div>

          {/* Mesa asignada */}
          {mesa && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.8 }}
              className="flex items-center gap-2.5 mt-5"
              style={{ padding:"0.6rem 1.25rem", background:"rgba(181,137,78,0.08)", border:"1px solid rgba(181,137,78,0.22)" }}>
              <span style={{ fontSize:"1rem" }}>🪑</span>
              <div>
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.5rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", marginBottom:"0.1rem" }}>Tu lugar</p>
                <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"0.95rem", color:"var(--c-gold-lt)" }}>
                  {mesa}
                </p>
              </div>
            </motion.div>
          )}

          {/* Date & Location */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
            className="flex flex-col items-center gap-1.5 mt-6">
            <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"clamp(1.3rem,4vw,1.9rem)", color:"var(--c-gold-lt)" }}>
              {W.weddingDateLabel}
            </p>
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.68rem", letterSpacing:"0.18em", color:"rgba(154,128,104,0.55)", fontWeight:300 }}>
              {W.location}
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.85 }}
            className="flex items-end justify-center gap-3 mt-8">
            {[{v:days,l:"días"},{v:hours,l:"hs"},{v:minutes,l:"min"},{v:seconds,l:"seg"}].map((u,i) => (
              <div key={i} className="flex items-end gap-3">
                <div className="flex flex-col items-center gap-0.5">
                  <span style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(1.6rem,5vw,2.2rem)", color:"var(--c-gold-lt)", lineHeight:1, opacity:ready?1:0, transition:"opacity 0.3s", minWidth:"2ch", textAlign:"center", fontVariantNumeric:"tabular-nums" }}>
                    {String(u.v).padStart(2,"0")}
                  </span>
                  <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.42rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(154,128,104,0.45)" }}>{u.l}</span>
                </div>
                {i<3 && <span style={{ fontFamily:"var(--font-cormorant)", fontSize:"1.3rem", color:"rgba(181,137,78,0.18)", lineHeight:1, paddingBottom:"1rem" }}>:</span>}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }}
            className="flex flex-col gap-2.5 mt-9">
            <button onClick={() => { setRsvpOpen(true); setTimeout(() => rsvpRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100); }}
              className="btn-wine" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem" }}>
              <span>✓ Confirmar mi asistencia</span>
            </button>
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.6rem", padding:"0.85rem", background:"rgba(37,211,102,0.12)", border:"1px solid rgba(37,211,102,0.3)", color:"#5fd97a", fontFamily:"var(--font-jost)", fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.524 5.825L.057 23.852a.5.5 0 0 0 .606.638l6.264-1.638A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
                Compartir esta invitación
              </a>
            )}
          </motion.div>

          {/* Scroll hint */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
            className="flex flex-col items-center gap-1.5 mt-10 animate-bob">
            <div style={{ width:1, height:32, background:"linear-gradient(to bottom, rgba(181,137,78,0.4), transparent)" }} />
            <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.48rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(154,128,104,0.4)" }}>Ver detalles</span>
          </motion.div>
        </div>
      </div>

      {/* ── EVENT DETAILS ── */}
      <div style={{ background:"var(--c-dark-2)", padding:"3rem 1.5rem" }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>

          <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"1.75rem", textAlign:"center" }}>
            Información del evento
          </p>

          <div className="grid grid-cols-1 gap-3">
            {[
              { type:"Ceremonia", name:W.ceremony.name, time:W.ceremony.time, note:W.ceremony.note, addr:W.ceremony.address, url:W.ceremony.mapsUrl },
              { type:"Recepción & Fiesta", name:W.reception.name, time:W.reception.time, note:W.reception.cocktail, addr:W.reception.address, url:W.reception.mapsUrl },
            ].map((ev,i) => (
              <div key={i} style={{ padding:"1.25rem 1.5rem", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(181,137,78,0.14)", borderLeft:"2px solid var(--c-wine)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem" }}>
                  <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)" }}>{ev.type}</p>
                  <a href={ev.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--c-gold)", borderBottom:"1px solid var(--c-gold)", paddingBottom:"1px" }}>
                    Ver mapa →
                  </a>
                </div>
                <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.1rem", color:"var(--c-text-inv)", marginBottom:"0.35rem" }}>{ev.name}</p>
                <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"1.25rem", color:"var(--c-gold-lt)", marginBottom:"0.25rem" }}>{ev.time}</p>
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.72rem", color:"rgba(154,128,104,0.55)", fontWeight:300, marginBottom:"0.2rem" }}>{ev.addr}</p>
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.68rem", color:"rgba(154,128,104,0.4)", fontWeight:300 }}>{ev.note}</p>
              </div>
            ))}
          </div>

          {/* Agenda compact */}
          <div style={{ marginTop:"1.5rem", padding:"1.25rem 1.5rem", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(181,137,78,0.1)" }}>
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(181,137,78,0.4)", marginBottom:"1rem" }}>Cronograma</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              {AGENDA.map((a,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                  <span style={{ fontSize:"0.9rem", minWidth:"1.4rem", textAlign:"center" }}>{a.icon}</span>
                  <span style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", color:"var(--c-gold-lt)", fontSize:"0.9rem", minWidth:"3rem" }}>{a.time}</span>
                  <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.78rem", color:"var(--c-text-inv)", fontWeight:300 }}>{a.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dress code */}
          <div style={{ marginTop:"0.75rem", padding:"1rem 1.5rem", background:"rgba(181,137,78,0.05)", border:"1px solid rgba(181,137,78,0.12)", display:"flex", alignItems:"center", gap:"0.75rem" }}>
            <span style={{ fontSize:"1.1rem" }}>👔</span>
            <div>
              <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.4)", marginBottom:"0.2rem" }}>Dress code</p>
              <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.82rem", color:"var(--c-text-inv2)", fontWeight:300 }}>{W.reception.dresscode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RSVP SECTION ── */}
      <div ref={rsvpRef} id="rsvp-section" style={{ background:"var(--c-dark)", padding:"3rem 1.5rem" }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"0.75rem", textAlign:"center" }}>
            Confirmación
          </p>
          <h2 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(1.8rem,5vw,2.4rem)", color:"var(--c-text-inv)", textAlign:"center", marginBottom:"0.5rem", lineHeight:1.1 }}>
            {first}, ¿vas a venir?
          </h2>
          <div style={{ width:40, height:1, background:"linear-gradient(to right, transparent, var(--c-gold), transparent)", margin:"1.25rem auto 2rem" }} />

          {rsvpStatus === "success" ? (
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
              style={{ textAlign:"center", padding:"2.5rem 1.5rem" }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(181,137,78,0.1)", border:"1px solid var(--c-gold)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.25rem", fontSize:"1.8rem" }}>
                🥂
              </div>
              <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.6rem", color:"var(--c-gold-lt)", marginBottom:"0.5rem" }}>¡Gracias, {first}!</h3>
              <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.82rem", color:"rgba(154,128,104,0.6)", fontWeight:300, lineHeight:1.7 }}>
                Tu confirmación fue registrada.<br/>¡Nos vemos el {W.weddingDateLabel}! 🌹
              </p>
            </motion.div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {/* Attendance */}
              <div>
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"0.6rem" }}>¿Asistís?</p>
                <div className="flex gap-3">
                  {[{v:"Si",icon:"🥂",t:"Sí, estaré"},{v:"No",icon:"💌",t:"No podré"}].map(opt => (
                    <button key={opt.v} type="button" onClick={() => setF("asistencia", opt.v)}
                      style={{ flex:1, padding:"0.9rem", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.4rem", border:`1px solid ${form.asistencia===opt.v?"var(--c-gold)":"rgba(181,137,78,0.18)"}`, background:form.asistencia===opt.v?"rgba(181,137,78,0.1)":"rgba(255,255,255,0.03)", cursor:"pointer", transition:"all 0.2s" }}>
                      <span style={{ fontSize:"1.4rem" }}>{opt.icon}</span>
                      <span style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"0.9rem", color:form.asistencia===opt.v?"var(--c-gold-lt)":"var(--c-text-inv)" }}>{opt.t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Companions - only if attending */}
              {form.asistencia === "Si" && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} style={{ overflow:"hidden" }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                    <div>
                      <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"0.4rem" }}>Acompañantes</p>
                      <select value={form.acompanantes} onChange={e => setF("acompanantes", e.target.value)}
                        style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderBottom:"1px solid rgba(181,137,78,0.22)", padding:"0.7rem 0.25rem", fontFamily:"var(--font-jost)", fontSize:"0.88rem", color:"var(--c-text-inv)", outline:"none", WebkitAppearance:"none" }}>
                        <option value="0">Solo/a</option>
                        <option value="1">1 acompañante</option>
                        <option value="2">2 acompañantes</option>
                        <option value="3">3 o más</option>
                      </select>
                    </div>
                    <div>
                      <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"0.4rem" }}>Restricciones alimentarias</p>
                      <input value={form.restricciones} onChange={e => setF("restricciones", e.target.value)}
                        placeholder="Vegetariano, celíaco... (opcional)"
                        style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderBottom:"1px solid rgba(181,137,78,0.22)", padding:"0.7rem 0.25rem", fontFamily:"var(--font-jost)", fontSize:"0.88rem", color:"var(--c-text-inv)", outline:"none" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Message */}
              <div>
                <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"0.4rem" }}>Un mensaje (opcional)</p>
                <textarea value={form.mensaje} onChange={e => setF("mensaje", e.target.value)}
                  placeholder="Un deseo, un recuerdo..."
                  rows={3} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderBottom:"1px solid rgba(181,137,78,0.22)", padding:"0.7rem 0.25rem", fontFamily:"var(--font-jost)", fontSize:"0.88rem", color:"var(--c-text-inv)", outline:"none", resize:"none" }} />
              </div>

              {rsvpStatus === "error" && (
                <p style={{ fontSize:"0.75rem", color:"#ef9a9a", padding:"0.6rem 0.75rem", background:"rgba(200,50,50,0.08)", borderLeft:"2px solid rgba(200,50,50,0.4)" }}>
                  Error al enviar. Intentá de nuevo o escribinos por WhatsApp.
                </p>
              )}

              <button onClick={submitRSVP} disabled={!form.asistencia || rsvpStatus==="loading"}
                className="btn-wine" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", opacity:form.asistencia?1:0.4 }}>
                <span>{rsvpStatus==="loading" ? "Enviando..." : "Confirmar asistencia ✓"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background:"var(--c-dark-2)", padding:"2rem 1.5rem", textAlign:"center", borderTop:"1px solid rgba(181,137,78,0.1)" }}>
        <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.05rem", color:"rgba(196,168,130,0.55)", marginBottom:"1.25rem" }}>
          {W.bride} &amp; {W.groom}
        </p>

        {/* Print card link — prominent */}
        {printUrl && (
          <a href={printUrl}
            style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem", padding:"0.7rem 1.25rem", background:"rgba(181,137,78,0.08)", border:"1px solid rgba(181,137,78,0.2)", fontFamily:"var(--font-jost)", fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.6)" }}>
            🖨️ Ver tarjeta imprimible
          </a>
        )}

        <div style={{ display:"flex", justifyContent:"center", gap:"1.25rem" }}>
          {[{ href:"/", label:"Invitación completa" },{ href:"/gifts", label:"Lista de regalos" }].map((l,i) => (
            <a key={i} href={l.href} style={{ fontFamily:"var(--font-jost)", fontSize:"0.6rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(181,137,78,0.38)", borderBottom:"1px solid rgba(181,137,78,0.18)", paddingBottom:"1px" }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
