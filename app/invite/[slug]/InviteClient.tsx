"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { W, AGENDA } from "@/lib/config";
import { useCountdown } from "@/hooks/useCountdown";

// ─────────────────────────────────────────────────────────────
//  HELPERS — reutilizables, tipados, sin magic strings
// ─────────────────────────────────────────────────────────────

export interface GuestInfo {
  nombre:    string;
  apellido:  string;
  nombre2?:  string;
  apellido2?: string;
}

/** Nombre para saludo: "Marcos" o "Marcos y Luisina" */
export function displayFirstNames(g: GuestInfo): string {
  if (g?.nombre2) return `${g?.nombre} y ${g?.nombre2}`;
  return g?.nombre;
}

/** Nombre completo: "Marcos Pérez" o "Marcos Pérez y Luisina Gómez" */
export function displayFullNames(g: GuestInfo): string {
  const p1 = `${g?.nombre} ${g?.apellido}`.trim();
  if (g?.nombre2) {
    const p2 = `${g?.nombre2} ${g?.apellido2 ?? ""}`.trim();
    return `${p1} y ${p2}`;
  }
  return p1;
}

/** Cantidad de adultos confirmados (siempre ≥ 1) */
export function countAdults(g: GuestInfo): number {
  return g?.nombre2 ? 2 : 1;
}

/** Texto WhatsApp: menciona ambos si son pareja */
export function buildWhatsAppText(g: GuestInfo, url: string): string {
  const saludo = g?.nombre2
    ? `¡Hola ${g?.nombre} y ${g?.nombre2}!`
    : `¡Hola ${g?.nombre}!`;
  return `${saludo} Les comparto su invitación al casamiento de ${W.bride} y ${W.groom} 💍\n\n${W.weddingDateLabel} · ${W.location}\n\n${url}`;
}

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────

interface Props {
  guest: GuestInfo;
  slug:  string;
}

type RSVPStatus = "idle" | "loading" | "success" | "error";

interface RSVPForm {
  asistencia:   "Si" | "No" | "";
  hijos:        string;   // "0" | "1" | "2" | "3+"
  restricciones: string;
  mensaje:       string;
}

// ─────────────────────────────────────────────────────────────
//  GALLERY SECTION — fotos que suben los novios
// ─────────────────────────────────────────────────────────────

interface GalleryPhoto {
  url:     string;
  caption?: string;
}

// function GallerySection() {
//   const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState<GalleryPhoto | null>(null);

//   useEffect(() => {
//     fetch("/api/gallery")
//       .then(r => r.json())
//       .then(d => { if (Array.isArray(d.photos)) setPhotos(d.photos); })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return (
//     <div style={{ textAlign: "center", padding: "2rem", color: "rgba(181,137,78,0.4)" }}>
//       <span style={{ fontFamily: "var(--font-jost)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
//         Cargando galería…
//       </span>
//     </div>
//   );

//   if (photos.length === 0) return (
//     <div style={{ textAlign: "center", padding: "2.5rem 1.5rem", border: "1px dashed rgba(181,137,78,0.18)", background: "rgba(255,255,255,0.02)" }}>
//       <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📷</div>
//       <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1rem", color: "rgba(196,168,130,0.45)", lineHeight: 1.6 }}>
//         Pronto compartiremos<br />nuestros momentos con ustedes
//       </p>
//     </div>
//   );

//   return (
//     <>
//       {/* Grid masonry simple */}
//       <div style={{
//         columns: "2",
//         columnGap: "0.5rem",
//         gap: "0.5rem",
//       }}>
//         {photos.map((photo, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: i * 0.07 }}
//             onClick={() => setSelected(photo)}
//             style={{
//               breakInside: "avoid",
//               marginBottom: "0.5rem",
//               cursor: "pointer",
//               position: "relative",
//               overflow: "hidden",
//               border: "1px solid rgba(181,137,78,0.12)",
//             }}
//           >
//             <img
//               src={photo.url}
//               alt={photo.caption ?? `Foto ${i + 1}`}
//               style={{
//                 width: "100%",
//                 display: "block",
//                 objectFit: "cover",
//                 transition: "transform 0.4s ease",
//                 filter: "brightness(0.88) saturate(0.85)",
//               }}
//               onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
//               onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
//             />
//             {photo.caption && (
//               <div style={{
//                 position: "absolute", bottom: 0, left: 0, right: 0,
//                 padding: "0.5rem 0.6rem",
//                 background: "linear-gradient(to top, rgba(14,8,4,0.85), transparent)",
//               }}>
//                 <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "0.78rem", color: "rgba(196,168,130,0.8)", margin: 0 }}>
//                   {photo.caption}
//                 </p>
//               </div>
//             )}
//           </motion.div>
//         ))}
//       </div>

//       {/* Lightbox */}
//       <AnimatePresence>
//         {selected && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setSelected(null)}
//             style={{
//               position: "fixed", inset: 0, zIndex: 100,
//               background: "rgba(10,5,2,0.94)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               padding: "1.5rem",
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.92, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.92, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 28 }}
//               onClick={e => e.stopPropagation()}
//               style={{ maxWidth: 600, width: "100%", position: "relative" }}
//             >
//               <img
//                 src={selected.url}
//                 alt={selected.caption}
//                 style={{ width: "100%", display: "block", border: "1px solid rgba(181,137,78,0.2)" }}
//               />
//               {selected.caption && (
//                 <p style={{
//                   fontFamily: "var(--font-cormorant)", fontStyle: "italic",
//                   fontSize: "1rem", color: "rgba(196,168,130,0.7)",
//                   textAlign: "center", marginTop: "0.75rem",
//                 }}>
//                   {selected.caption}
//                 </p>
//               )}
//               <button
//                 onClick={() => setSelected(null)}
//                 style={{
//                   position: "absolute", top: -12, right: -12,
//                   width: 32, height: 32, borderRadius: "50%",
//                   background: "var(--c-wine)", border: "none",
//                   color: "rgba(238,226,210,0.9)", fontSize: "1rem",
//                   cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//                 }}
//               >
//                 ×
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
interface GalleryPhoto {
  url: string;
  caption?: string;
}

function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
  if (!W.appsScriptUrl) return;

  fetch(W.appsScriptUrl)
    .then(r => r.json())
    .then(d => {
      if (Array.isArray(d.photos)) {
        setPhotos(d.photos);
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "rgba(181,137,78,0.45)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Cargando recuerdos...
        </p>
      </div>
    );
  }

  if (!photos.length) {
    return (
      <div
        style={{
          padding: "2.5rem 1rem",
          textAlign: "center",
          border: "1px dashed rgba(181,137,78,0.16)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>📷</div>

        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            color: "rgba(196,168,130,0.55)",
            lineHeight: 1.6,
          }}
        >
          Muy pronto vamos a compartir
          <br />
          nuestros mejores momentos ✨
        </p>
      </div>
    );
  }

  return (
    <>
      {/* GRID */}
      <div
        style={{
          columns: "2 140px",
          columnGap: "0.6rem",
        }}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(photo)}
            style={{
              breakInside: "avoid",
              marginBottom: "0.6rem",
              cursor: "pointer",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(181,137,78,0.14)",
              background: "#120d09",
            }}
          >
            <img
              src={photo.url}
              alt={photo.caption || ""}
              loading="lazy"
              style={{
                width: "100%",
                display: "block",
                objectFit: "cover",
                transition: "transform .5s ease",
                filter: "brightness(.92)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,5,2,.6), transparent 45%)",
              }}
            />

            {photo.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "0.6rem",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    fontSize: "0.78rem",
                    color: "rgba(240,225,210,0.9)",
                  }}
                >
                  {photo.caption}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              background: "rgba(7,4,2,.94)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 24,
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 700,
                position: "relative",
              }}
            >
              <img
                src={selected.url}
                alt=""
                style={{
                  width: "100%",
                  display: "block",
                  border: "1px solid rgba(181,137,78,0.18)",
                }}
              />

              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "-12px",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: "var(--c-wine)",
                  color: "#fff",
                  fontSize: "1rem",
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function InviteClient({ guest, slug }: Props) {
  const { days, hours, minutes, seconds, ready } = useCountdown(W.weddingDate);
  const [mesa, setMesa] = useState<string | null>(null);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  useEffect(() => {
    fetch(`/api/mesas?action=getMesa&slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => { if (d.mesa) setMesa(d.mesa); })
      .catch(() => {});
  }, [slug]);
  useEffect(() => {
  fetch(`/api/rsvp?action=status&slug=${encodeURIComponent(slug)}`)
    .then(r => r.json())
    .then(d => {
      if (d.confirmado) {
        setAlreadyConfirmed(true);
      }
    })
    .catch(() => {});
}, [slug]);

  const [pageUrl,  setPageUrl]  = useState("");
  const [waUrl,    setWaUrl]    = useState("");
  const [printUrl, setPrintUrl] = useState("");

  // RSVP
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>("idle");
  const [form, setForm] = useState<RSVPForm>({
    asistencia: "", hijos: "0", restricciones: "", mensaje: "",
  });
  const rsvpRef = useRef<HTMLDivElement>(null);

  const hasMp   = Boolean(W.gifts?.mpLink);
  const hasModo = Boolean(W.gifts?.modoLink);

  // Derived
  const firstNames  = displayFirstNames(guest);
  const fullNames   = displayFullNames(guest);
  const isPair      = Boolean(guest?.nombre2);

  useEffect(() => {
    const url    = window.location.href;
    const origin = window.location.origin;
    setPageUrl(url);
    setPrintUrl(
  `${origin}/print?slug=${encodeURIComponent(slug)}` +
  `&nombre=${encodeURIComponent(guest.nombre)}` +
  `&apellido=${encodeURIComponent(guest.apellido)}` +
  (guest.nombre2   ? `&nombre2=${encodeURIComponent(guest.nombre2)}`   : "") +
  (guest.apellido2 ? `&apellido2=${encodeURIComponent(guest.apellido2)}` : "")
);
    setWaUrl(`https://wa.me/?text=${encodeURIComponent(buildWhatsAppText(guest, url))}`);
  }, [slug, guest, fullNames]);

  function setF<K extends keyof RSVPForm>(k: K, v: RSVPForm[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  async function submitRSVP() {
    if (!form.asistencia) return;
    setRsvpStatus("loading");
    try {
      const adults = countAdults(guest);
      const hijos  = parseInt(form.hijos) || 0;
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre:        guest?.nombre,
          apellido:      guest.apellido,
          nombre2:       guest?.nombre2  ?? "",
          apellido2:     guest.apellido2 ?? "",
          slug,
          asistencia:    form.asistencia,
          adultos:       adults,
          hijos,
          totalPersonas: form.asistencia === "Si" ? adults + hijos : 0,
          restricciones: form.restricciones,
          mensaje:       form.mensaje,
        }),
      });
      if (!res.ok) throw new Error();
      setRsvpStatus("success");
    } catch {
      setRsvpStatus("error");
    }
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--c-dark)", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4rem 1.5rem 3rem", overflow: "hidden" }}>

        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.22) saturate(0.5)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(20,10,5,0.7) 0%, rgba(20,10,5,0.3) 50%, rgba(20,10,5,0.9) 100%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520 }}>

          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: "var(--font-jost)", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(181,137,78,0.5)", marginBottom: "1.5rem" }}>
            {isPair ? "Invitación especial para" : "Invitación especial para"}
          </motion.p>

          {/* Nombres invitados */}
          <div style={{ overflow: "hidden", marginBottom: "0.25rem" }}>
            <motion.h1 initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: isPair ? "clamp(2rem,7vw,3.6rem)" : "clamp(2.8rem,9vw,5rem)", color: "#EEE2D2", lineHeight: 1.1 }}>
              {isPair ? (
                <>
                  {`${guest?.nombre} ${guest.apellido}`}
                  <br />
                  <span style={{ fontSize: "0.7em", color: "rgba(181,137,78,0.5)" }}>&amp;</span>
                  <br />
                  {`${guest?.nombre2} ${guest.apellido2 ?? ""}`}
                </>
              ) : fullNames}
            </motion.h1>
          </div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.45, duration: 0.8 }}
            style={{ width: 56, height: 1, background: "linear-gradient(to right, transparent, var(--c-gold), transparent)", margin: "1.5rem auto" }} />

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1.1rem,3vw,1.5rem)", color: "rgba(196,168,130,0.75)", lineHeight: 1.5, marginBottom: "0.4rem" }}>
              {W.bride} y {W.groom}
            </p>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "clamp(1rem,2.5vw,1.25rem)", color: "rgba(196,168,130,0.5)" }}>
              {isPair ? "los invitan a celebrar su casamiento" : "te invita a celebrar su casamiento"}
            </p>
          </motion.div>

          {/* Mesa asignada */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              marginTop: "1.25rem",
              minHeight: 92, // tamaño compacto y fijo
              padding: "0.9rem 1rem",
              background:
                "linear-gradient(135deg, rgba(181,137,78,0.08), rgba(181,137,78,0.03))",
              border: "1px solid rgba(181,137,78,0.18)",
              position: "relative",
              overflow: "hidden",

              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                right: "-10%",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(181,137,78,0.05)",
                filter: "blur(24px)",
                pointerEvents: "none",
              }}
            />

            {/* Texto */}
            <div
              style={{
                flex: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "0.45rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(181,137,78,0.42)",
                  marginBottom: "0.2rem",
                }}
              >
                {mesa
                  ? (isPair ? "SU MESA" : "TU MESA")
                  : "MESA ASIGNADA"}
              </p>

              {mesa ? (
                <>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontStyle: "italic",
                      fontSize: "1rem",
                      color: "var(--c-gold-lt)",
                      lineHeight: 1.1,
                      marginBottom: "0.15rem",
                    }}
                  >
                    {mesa}
                  </p>

                  <p
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "0.68rem",
                      color: "rgba(154,128,104,0.55)",
                      fontWeight: 300,
                      lineHeight: 1.45,
                    }}
                  >
                    {isPair
                      ? "Sus lugares ya fueron reservados"
                      : "Tu lugar ya fue reservado"}
                  </p>
                </>
              ) : (
                <>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontStyle: "italic",
                      fontSize: "0.95rem",
                      color: "var(--c-gold-lt)",
                      lineHeight: 1.2,
                      marginBottom: "0.15rem",
                    }}
                  >
                    Próximamente disponible
                  </p>

                  <p
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "0.68rem",
                      color: "rgba(154,128,104,0.55)",
                      fontWeight: 300,
                      lineHeight: 1.45,
                    }}
                  >
                    Revisá esta invitación más adelante
                  </p>
                </>
              )}
            </div>
          </motion.div>
          {alreadyConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.2rem",
                  background: "rgba(181,137,78,0.06)",
                  border: "1px solid rgba(181,137,78,0.16)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    color: "var(--c-gold-lt)",
                    marginBottom: "0.3rem",
                  }}
                >
                  ✨ Asistencia confirmada ✨
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.72rem",
                    color: "rgba(154,128,104,0.6)",
                    lineHeight: 1.6,
                  }}
                >
                  {isPair
                    ? "Ya registramos su pago y confirmación."
                    : "Ya registramos tu pago y confirmación."}
                </p>
              </motion.div>
            )}

          {/* Fecha y lugar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", marginTop: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(1.3rem,4vw,1.9rem)", color: "var(--c-gold-lt)" }}>
              {W.weddingDateLabel}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.68rem", letterSpacing: "0.18em", color: "rgba(154,128,104,0.55)", fontWeight: 300 }}>
              {W.location}
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "0.75rem", marginTop: "2rem" }}>
            {[{ v: days, l: "días" }, { v: hours, l: "hs" }, { v: minutes, l: "min" }, { v: seconds, l: "seg" }].map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.125rem" }}>
                  <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.6rem,5vw,2.2rem)", color: "var(--c-gold-lt)", lineHeight: 1, opacity: ready ? 1 : 0, transition: "opacity 0.3s", minWidth: "2ch", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "0.42rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(154,128,104,0.45)" }}>{u.l}</span>
                </div>
                {i < 3 && <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", color: "rgba(181,137,78,0.18)", lineHeight: 1, paddingBottom: "1rem" }}>:</span>}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginTop: "2.25rem" }}>
            {!alreadyConfirmed && (
                <button
                  onClick={() => {
                    setTimeout(() =>
                      rsvpRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      }), 100);
                  }}
                  className="btn-wine"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                >
                  <span>
                    ✓ Confirmar {isPair ? "nuestra" : "mi"} asistencia
                  </span>
                </button>
              )}
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "0.85rem", background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)", color: "#5fd97a", fontFamily: "var(--font-jost)", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.524 5.825L.057 23.852a.5.5 0 0 0 .606.638l6.264-1.638A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
                Compartir esta invitación
              </a>
            )}
          </motion.div>

          {/* Scroll hint */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", marginTop: "2.5rem" }}
            className="animate-bob">
            <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(181,137,78,0.4), transparent)" }} />
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "0.48rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(154,128,104,0.4)" }}>Ver detalles</span>
          </motion.div>
        </div>
      </div>

      {/* ── EVENT DETAILS ── */}
      <div style={{ background: "var(--c-dark-2)", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(181,137,78,0.45)", marginBottom: "1.75rem", textAlign: "center" }}>
            Información del evento
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { type: "Ceremonia", name: W.ceremony.name, time: W.ceremony.time, note: W.ceremony.note, addr: W.ceremony.address, url: W.ceremony.mapsUrl },
              { type: "Recepción & Fiesta", name: W.reception.name, time: W.reception.time, note: W.reception.cocktail, addr: W.reception.address, url: W.reception.mapsUrl },
            ].map((ev, i) => (
              <div key={i} style={{ padding: "1.25rem 1.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(181,137,78,0.14)", borderLeft: "2px solid var(--c-wine)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(181,137,78,0.45)" }}>{ev.type}</p>
                  <a href={ev.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--c-gold)", borderBottom: "1px solid var(--c-gold)", paddingBottom: "1px", textDecoration: "none" }}>
                    Ver mapa →
                  </a>
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.1rem", color: "var(--c-text-inv)", marginBottom: "0.35rem" }}>{ev.name}</p>
                <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.25rem", color: "var(--c-gold-lt)", marginBottom: "0.25rem" }}>{ev.time}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.72rem", color: "rgba(154,128,104,0.55)", fontWeight: 300, marginBottom: "0.2rem" }}>{ev.addr}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.68rem", color: "rgba(154,128,104,0.4)", fontWeight: 300 }}>{ev.note}</p>
              </div>
            ))}
          </div>

          {/* Agenda */}
          <div style={{ marginTop: "1.5rem", padding: "1.25rem 1.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(181,137,78,0.1)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(181,137,78,0.4)", marginBottom: "1rem" }}>Cronograma</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {AGENDA.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.9rem", minWidth: "1.4rem", textAlign: "center" }}>{a.icon}</span>
                  <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", color: "var(--c-gold-lt)", fontSize: "0.9rem", minWidth: "3rem" }}>{a.time}</span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "0.78rem", color: "var(--c-text-inv)", fontWeight: 300 }}>{a.title}</span>
                </div>
              ))}
            </div>
          </div>
          
         

          {/* Botones de pago */}
          {!alreadyConfirmed && (hasMp || hasModo) && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ marginTop: "1rem" }}>
                 {/* Dress code / valor tarjeta */}
              <div style={{ marginTop: "0.75rem", padding: "1rem 1.5rem", background: "rgba(181,137,78,0.05)", border: "1px solid rgba(181,137,78,0.12)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.1rem" }}>💵</span>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(181,137,78,0.4)", marginBottom: "0.2rem" }}>VALOR TARJETA POR PERSONA</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.82rem", color: "var(--c-text-inv2)", fontWeight: 300 }}>{W.reception.dresscode}</p>
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(181,137,78,0.38)", marginBottom: "0.6rem" }}>
                Transferencia: abrí la app directo
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {hasMp && (
                  <a href={W.gifts.mpLink} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.9rem 1rem", background: "#009ee3", textDecoration: "none" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "0.68rem", letterSpacing: "0.1em", fontWeight: 500, color: "white" }}>Mercado Pago</span>
                  </a>
                )}
                {hasModo && (
                  <a href={W.gifts.modoLink} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, minWidth: 140, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.9rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", textDecoration: "none" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--c-text-inv)" }}>MODO</span>
                  </a>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* ── GALERÍA DE FOTOS ── */}
      <div style={{ background: "var(--c-dark)", padding: "3rem 1.5rem", borderTop: "1px solid rgba(181,137,78,0.08)" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(181,137,78,0.45)", marginBottom: "0.75rem", textAlign: "center" }}>
            Nuestra historia
          </p>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.6rem,5vw,2.2rem)", color: "var(--c-text-inv)", textAlign: "center", marginBottom: "0.5rem", lineHeight: 1.1 }}>
            Momentos que compartimos
          </h2>
          <div style={{ width: 40, height: 1, background: "linear-gradient(to right, transparent, var(--c-gold), transparent)", margin: "1.25rem auto 2rem" }} />
          <GallerySection />
        </div>
      </div>

      {/* ── RSVP ── */}
      {!alreadyConfirmed && (
        <div ref={rsvpRef} id="rsvp-section" style={{ background: "var(--c-dark-2)", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(181,137,78,0.45)", marginBottom: "0.75rem", textAlign: "center" }}>
            Confirmación
          </p>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.8rem,5vw,2.4rem)", color: "var(--c-text-inv)", textAlign: "center", marginBottom: "0.5rem", lineHeight: 1.1 }}>
            {isPair ? `${guest?.nombre} y ${guest?.nombre2}, ¿vienen?` : `${guest?.nombre}, ¿vas a venir?`}
          </h2>
          <div style={{ width: 40, height: 1, background: "linear-gradient(to right, transparent, var(--c-gold), transparent)", margin: "1.25rem auto 2rem" }} />

          {rsvpStatus === "success" ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(181,137,78,0.1)", border: "1px solid var(--c-gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.8rem" }}>
                🥂
              </div>
              <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.6rem", color: "var(--c-gold-lt)", marginBottom: "0.5rem" }}>
                ¡Gracias, {firstNames}!
              </h3>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.82rem", color: "rgba(154,128,104,0.6)", fontWeight: 300, lineHeight: 1.7 }}>
                {isPair ? "Su confirmación fue registrada." : "Tu confirmación fue registrada."}<br />
                ¡{isPair ? "Los" : "Te"} esperamos el {W.weddingDateLabel}! 🌹
              </p>
            </motion.div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* Asistencia */}
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(181,137,78,0.45)", marginBottom: "0.6rem" }}>
                  {isPair ? "¿Asisten?" : "¿Asistís?"}
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {[{ v: "Si" as const, icon: "🥂", t: isPair ? "Sí, estaremos" : "Sí, estaré" }, { v: "No" as const, icon: "💌", t: "No podremos" }].map(opt => (
                    <button key={opt.v} type="button" onClick={() => setF("asistencia", opt.v)}
                      style={{ flex: 1, padding: "0.9rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", border: `1px solid ${form.asistencia === opt.v ? "var(--c-gold)" : "rgba(181,137,78,0.18)"}`, background: form.asistencia === opt.v ? "rgba(181,137,78,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.2s" }}>
                      <span style={{ fontSize: "1.4rem" }}>{opt.icon}</span>
                      <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "0.9rem", color: form.asistencia === opt.v ? "var(--c-gold-lt)" : "var(--c-text-inv)" }}>{opt.t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info pareja */}
              {isPair && form.asistencia === "Si" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ overflow: "hidden" }}>
                  <div style={{ padding: "0.75rem 1rem", background: "rgba(181,137,78,0.05)", border: "1px solid rgba(181,137,78,0.12)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.9rem" }}>👫</span>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.72rem", color: "rgba(154,128,104,0.65)", fontWeight: 300 }}>
                      Se registran <strong style={{ color: "var(--c-gold-lt)" }}>2 adultos</strong>: {guest?.nombre} y {guest?.nombre2}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Hijos */}
              {form.asistencia === "Si" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ overflow: "hidden" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(181,137,78,0.45)", marginBottom: "0.4rem" }}>
                        Hijos que {isPair ? "traen" : "traés"}
                      </p>
                      <select value={form.hijos} onChange={e => setF("hijos", e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "none", borderBottom: "1px solid rgba(181,137,78,0.22)", padding: "0.7rem 0.25rem", fontFamily: "var(--font-jost)", fontSize: "0.88rem", color: "var(--c-text-inv)", outline: "none", WebkitAppearance: "none" }}>
                        <option value="0">Sin hijos</option>
                        <option value="1">1 hijo</option>
                        <option value="2">2 hijos</option>
                        <option value="3">3 o más</option>
                      </select>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(181,137,78,0.45)", marginBottom: "0.4rem" }}>Restricciones alimentarias</p>
                      <input value={form.restricciones} onChange={e => setF("restricciones", e.target.value)}
                        placeholder="Vegetariano, celíaco… (opcional)"
                        style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "none", borderBottom: "1px solid rgba(181,137,78,0.22)", padding: "0.7rem 0.25rem", fontFamily: "var(--font-jost)", fontSize: "0.88rem", color: "var(--c-text-inv)", outline: "none" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mensaje */}
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(181,137,78,0.45)", marginBottom: "0.4rem" }}>Un mensaje (opcional)</p>
                <textarea value={form.mensaje} onChange={e => setF("mensaje", e.target.value)}
                  placeholder="Un deseo, un recuerdo…"
                  rows={3}
                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "none", borderBottom: "1px solid rgba(181,137,78,0.22)", padding: "0.7rem 0.25rem", fontFamily: "var(--font-jost)", fontSize: "0.88rem", color: "var(--c-text-inv)", outline: "none", resize: "none" }} />
              </div>

              {rsvpStatus === "error" && (
                <p style={{ fontSize: "0.75rem", color: "#ef9a9a", padding: "0.6rem 0.75rem", background: "rgba(200,50,50,0.08)", borderLeft: "2px solid rgba(200,50,50,0.4)" }}>
                  Error al enviar. Intentá de nuevo o escribinos por WhatsApp.
                </p>
              )}

              <button onClick={submitRSVP} disabled={!form.asistencia || rsvpStatus === "loading"}
                className="btn-wine"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", opacity: form.asistencia ? 1 : 0.4 }}>
                <span>{rsvpStatus === "loading" ? "Enviando…" : `Confirmar ${isPair ? "nuestra" : "mi"} asistencia ✓`}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ background: "var(--c-dark-2)", padding: "2rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(181,137,78,0.1)" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.05rem", color: "rgba(196,168,130,0.55)", marginBottom: "1.25rem" }}>
          {W.bride} &amp; {W.groom}
        </p>
        {printUrl && (
          <a href={printUrl}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", padding: "0.7rem 1.25rem", background: "rgba(181,137,78,0.08)", border: "1px solid rgba(181,137,78,0.2)", fontFamily: "var(--font-jost)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(181,137,78,0.6)", textDecoration: "none" }}>
            🖨️ Ver tarjeta imprimible
          </a>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem" }}>
          {[{ href: "/", label: "Invitación completa" }, { href: "/gifts", label: "Lista de regalos" }].map((l, i) => (
            <a key={i} href={l.href} style={{ fontFamily: "var(--font-jost)", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(181,137,78,0.38)", borderBottom: "1px solid rgba(181,137,78,0.18)", paddingBottom: "1px", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}