"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { W } from "@/lib/config";
import Link from "next/link";

interface Props { slug: string; guestName: string; }

// ─────────────────────────────────────────────────────────────
//  /print?slug=nombre-apellido&name=Nombre+Apellido
//
//  Funcionalidades:
//  1. Visualización de tarjeta elegante (diseño para imprimir)
//  2. 🖨️  Imprimir (window.print + @media print CSS)
//  3. 📄  Exportar PDF (print to PDF nativo del browser)
//  4. 🖼️  Descargar imagen PNG (html2canvas)
//  5. 💬  Compartir por WhatsApp (imagen en base64 → Web Share API
//         o fallback: link con texto)
//  6. 🔗  Copiar link de invitación
//  7. ✏️  Generador de invitaciones para todos los invitados
// ─────────────────────────────────────────────────────────────

export default function PrintCard({ slug, guestName }: Props) {
  const cardRef   = useRef<HTMLDivElement>(null);
  const [qrSrc,   setQrSrc]   = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [copied,  setCopied]  = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [h2cLoaded, setH2cLoaded] = useState(false);

  const first = guestName.split(" ")[0];

  // Compute URLs and load html2canvas client-side
  useEffect(() => {
    const origin = window.location.origin;
    const url    = `${origin}/invite/${slug}`;
    setPageUrl(url);
    setQrSrc(
      `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&color=2C1A10&bgcolor=F5EFE4&margin=14&qzone=1`
    );

    // Load html2canvas from CDN
    if ((window as any).html2canvas) { setH2cLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => setH2cLoaded(true);
    document.head.appendChild(s);
  }, [slug]);

  // ── Capture card as image ──────────────────────────────────
  async function captureCard(): Promise<HTMLCanvasElement | null> {
    if (!cardRef.current || !(window as any).html2canvas) return null;
    const h2c = (window as any).html2canvas;
    const canvas: HTMLCanvasElement = await h2c(cardRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#F5EFE4",
      logging: false,
    });
    return canvas;
  }

  // ── Download PNG ───────────────────────────────────────────
  async function downloadImage() {
    setSharing(true);
    setShareMsg("Generando imagen...");
    try {
      const canvas = await captureCard();
      if (!canvas) throw new Error("No se pudo generar");
      const link = document.createElement("a");
      link.download = `invitacion-${slug}.png`;
      link.href     = canvas.toDataURL("image/png");
      link.click();
      setShareMsg("¡Imagen descargada!");
    } catch {
      setShareMsg("Error al generar imagen. Usá la opción de imprimir.");
    } finally {
      setSharing(false);
      setTimeout(() => setShareMsg(""), 3000);
    }
  }

  // ── Share via WhatsApp ─────────────────────────────────────
  // Strategy:
  //   1. Try Web Share API with image file (works on Android + iOS)
  //   2. Fallback: WhatsApp deep link with text + URL
  async function shareWhatsApp() {
    setSharing(true);
    setShareMsg("Preparando para compartir...");
    try {
      const canvas = await captureCard();
      const text = `¡Hola ${first}! 💍 Te mando tu invitación al casamiento de ${W.bride} y ${W.groom}\n\n📅 ${W.weddingDateLabel}\n📍 ${W.location}\n\n✨ Ver invitación completa: ${pageUrl}`;

      if (canvas && navigator.share && navigator.canShare) {
        // Try native share with image
        canvas.toBlob(async (blob) => {
          if (!blob) { fallbackWA(text); return; }
          const file = new File([blob], `invitacion-${first}.png`, { type: "image/png" });
          const canShareFile = navigator.canShare({ files: [file] });
          if (canShareFile) {
            try {
              await navigator.share({
                files: [file],
                title: `Invitación — ${W.bride} & ${W.groom}`,
                text,
              });
              setShareMsg("¡Compartido!");
            } catch (e: any) {
              if (e.name !== "AbortError") fallbackWA(text);
            }
          } else {
            fallbackWA(text);
          }
          setSharing(false);
          setTimeout(() => setShareMsg(""), 3000);
        }, "image/png");
      } else {
        fallbackWA(text);
        setSharing(false);
        setTimeout(() => setShareMsg(""), 3000);
      }
    } catch {
      setSharing(false);
      setShareMsg("Usá 'Descargar imagen' y enviala manualmente.");
      setTimeout(() => setShareMsg(""), 4000);
    }
  }

  function fallbackWA(text: string) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  // ── Copy link ──────────────────────────────────────────────
  function copyLink() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  // ── Print ─────────────────────────────────────────────────
  function printCard() { window.print(); }

  return (
    <div style={{ minHeight: "100dvh", background: "#EDE4D6", fontFamily: "var(--font-jost)" }}>

      {/* ── Toolbar (hidden on print) ─────────────────────── */}
      <div className="no-print" style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "var(--c-base)",
        borderBottom: "1px solid var(--c-border)",
        padding: "0.75rem 1.25rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem",
      }}>
        <Link href="/" style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-text-3)", flexShrink: 0 }}>
          ← Volver
        </Link>

        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "0.95rem", color: "var(--c-text-1)", opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {guestName}
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>

          {/* Copy link */}
          <button onClick={copyLink}
            title="Copiar link de invitación"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.8rem", background: "transparent", border: "1px solid var(--c-border)", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: copied ? "var(--c-gold)" : "var(--c-text-3)", transition: "all 0.2s" }}>
            {copied ? "✓ Copiado" : "🔗 Link"}
          </button>

          {/* Download PNG */}
          <button onClick={downloadImage} disabled={!h2cLoaded || sharing}
            title="Descargar como imagen PNG"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.8rem", background: "transparent", border: "1px solid var(--c-border)", cursor: h2cLoaded && !sharing ? "pointer" : "not-allowed", fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--c-text-3)", opacity: h2cLoaded ? 1 : 0.45, transition: "all 0.2s" }}>
            🖼 Imagen
          </button>

          {/* WhatsApp share */}
          <button onClick={shareWhatsApp} disabled={sharing}
            title="Compartir por WhatsApp"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.8rem", background: "#25D366", border: "none", cursor: sharing ? "wait" : "pointer", fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "white", opacity: sharing ? 0.6 : 1, transition: "all 0.2s" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.524 5.825L.057 23.852a.5.5 0 0 0 .606.638l6.264-1.638A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
            WhatsApp
          </button>

          {/* Print / PDF */}
          <button onClick={printCard}
            title="Imprimir o exportar como PDF"
            style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.8rem", background: "var(--c-wine)", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "white" }}>
            🖨️ Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Status message */}
      <AnimatePresence>
        {shareMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="no-print"
            style={{ position: "fixed", top: "4.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 30, background: "var(--c-dark)", color: "var(--c-gold-lt)", padding: "0.55rem 1.25rem", fontFamily: "var(--font-jost)", fontSize: "0.72rem", letterSpacing: "0.1em", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            {shareMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── The card itself ───────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2.5rem 1.5rem 3rem" }}>
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          id="print-card"
          style={{
            width: "min(540px, 100%)",
            background: "var(--c-base)",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(44,26,16,0.22), 0 4px 16px rgba(44,26,16,0.12)",
          }}
        >
          {/* Top band */}
          <div style={{ height: 5, background: "linear-gradient(to right, var(--c-wine), var(--c-gold), var(--c-wine))" }} />

          {/* Corner ornaments */}
          {[
            { top: 10, left: 10,  borderTop: "1px solid rgba(181,137,78,0.4)", borderLeft:  "1px solid rgba(181,137,78,0.4)" },
            { top: 10, right: 10, borderTop: "1px solid rgba(181,137,78,0.4)", borderRight: "1px solid rgba(181,137,78,0.4)" },
            { bottom: 10, left: 10,  borderBottom: "1px solid rgba(181,137,78,0.4)", borderLeft:  "1px solid rgba(181,137,78,0.4)" },
            { bottom: 10, right: 10, borderBottom: "1px solid rgba(181,137,78,0.4)", borderRight: "1px solid rgba(181,137,78,0.4)" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 28, height: 28, pointerEvents: "none", ...s }} />
          ))}

          <div style={{ padding: "2.5rem 2.5rem 2rem" }}>

            {/* ── Header ── */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              {/* Monogram circle */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "radial-gradient(circle at 36% 30%, var(--c-wine-lt), var(--c-wine) 52%, var(--c-wine-dk))",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.25rem",
                fontSize: "1.6rem",
                boxShadow: "0 4px 20px rgba(107,38,53,0.35)",
              }}>♡</div>

              <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: "0.6rem" }}>
                Invitación personal para
              </p>

              <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: "var(--c-text-1)", lineHeight: 1.05, marginBottom: "0.4rem" }}>
                {guestName}
              </h2>

              <div style={{ width: 48, height: 1, background: "linear-gradient(to right, transparent, var(--c-gold), transparent)", margin: "0.9rem auto" }} />

              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.25rem", color: "var(--c-text-2)" }}>
                {W.bride} &amp; {W.groom}
              </p>
            </div>

            {/* ── Date highlight ── */}
            <div style={{ textAlign: "center", padding: "0.9rem 1rem", background: "var(--c-linen)", borderTop: "1px solid var(--c-border)", borderBottom: "1px solid var(--c-border)", marginBottom: "1.75rem" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.4rem", color: "var(--c-wine)", lineHeight: 1.2 }}>
                {W.weddingDateLabel}
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--c-text-3)", marginTop: "0.25rem" }}>
                {W.location}
              </p>
            </div>

            {/* ── QR + Event info ── */}
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", marginBottom: "1.75rem" }}>

              {/* QR code */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ position: "relative", width: 120, height: 120, background: "var(--c-linen)" }}>
                  {/* QR corner marks */}
                  {[
                    { top: 0, left: 0,  borderTop: "2px solid var(--c-wine)", borderLeft:  "2px solid var(--c-wine)" },
                    { top: 0, right: 0, borderTop: "2px solid var(--c-wine)", borderRight: "2px solid var(--c-wine)" },
                    { bottom: 0, left: 0,  borderBottom: "2px solid var(--c-wine)", borderLeft:  "2px solid var(--c-wine)" },
                    { bottom: 0, right: 0, borderBottom: "2px solid var(--c-wine)", borderRight: "2px solid var(--c-wine)" },
                  ].map((s, i) => (
                    <div key={i} style={{ position: "absolute", width: 12, height: 12, ...s }} />
                  ))}
                  {qrSrc
                    ? <img src={qrSrc} alt="QR" width={120} height={120} style={{ display: "block" }} crossOrigin="anonymous" />
                    : <div style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 16, height: 16, border: "2px solid var(--c-gold)", borderTopColor: "transparent", borderRadius: "50%", animation: "pcSpin 0.8s linear infinite" }} />
                      </div>
                  }
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.48rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--c-text-3)", textAlign: "center", marginTop: "0.4rem" }}>
                  Escaneá para abrir
                </p>
              </div>

              {/* Event details */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--c-gold)", marginBottom: "0.25rem" }}>Ceremonia</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "0.92rem", color: "var(--c-text-1)", marginBottom: "0.15rem" }}>{W.ceremony.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.7rem", color: "var(--c-text-3)", fontWeight: 300 }}>{W.ceremony.time} · {W.ceremony.address.split(",")[0]}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.66rem", color: "var(--c-text-3)", fontWeight: 300, fontStyle: "italic" }}>{W.ceremony.note}</p>
                </div>
                <div style={{ width: "100%", height: 1, background: "var(--c-border)" }} />
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--c-gold)", marginBottom: "0.25rem" }}>Recepción & Fiesta</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "0.92rem", color: "var(--c-text-1)", marginBottom: "0.15rem" }}>{W.reception.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.7rem", color: "var(--c-text-3)", fontWeight: 300 }}>{W.reception.time} · {W.reception.address.split(",")[0]}</p>
                </div>
              </div>
            </div>

            {/* ── Dress code + RSVP deadline ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: "0.3rem" }}>Dress code</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.78rem", color: "var(--c-text-2)", fontWeight: 300 }}>{W.reception.dresscode}</p>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--c-border)", margin: "0 1rem", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: "0.3rem" }}>Confirmar antes del</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.78rem", color: "var(--c-text-2)", fontWeight: 300 }}>{W.rsvpDeadline}</p>
              </div>
            </div>

            {/* ── Footer phrase ── */}
            <div style={{ textAlign: "center", borderTop: "1px solid var(--c-border)", paddingTop: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "0.95rem", color: "var(--c-text-3)", lineHeight: 1.65 }}>
                "Tu presencia hará de este día algo único e irrepetible"
              </p>
            </div>
          </div>

          {/* Bottom band */}
          <div style={{ height: 3, background: "linear-gradient(to right, transparent, var(--c-gold), transparent)" }} />
        </motion.div>
      </div>

      {/* ── Generator ────────────────────────────────────────── */}
      <div className="no-print" style={{ maxWidth: 580, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
        <div style={{ borderTop: "1px solid var(--c-border)", paddingTop: "2.5rem" }}>
          <InviteGenerator />
        </div>
      </div>

      {/* Print CSS is in globals.css — removed inline style to fix hydration */}
    </div>
  );
}

// ── Invite Generator ──────────────────────────────────────────
function InviteGenerator() {
  const [name,   setName]   = useState("");
  const [list,   setList]   = useState<Array<{ name: string; url: string; wa: string }>>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [origin, setOrigin] = useState(W.baseUrl);

  useEffect(() => { setOrigin(window.location.origin); }, []);

  function generate() {
    const n = name.trim();
    if (!n) return;
    const slug = n
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const url   = `${origin}/invite/${slug}`;
    const print = `${origin}/print?slug=${slug}&name=${encodeURIComponent(n)}`;
    const wa    = `https://wa.me/?text=${encodeURIComponent(`¡Hola ${n.split(" ")[0]}! 💍 Te mando tu invitación al casamiento de ${W.bride} y ${W.groom}\n\n📅 ${W.weddingDateLabel} · ${W.location}\n\n${url}`)}`;
    setList(l => [{ name: n, url: print, wa }, ...l]);
    setName("");
  }

  function copy(i: number) {
    navigator.clipboard.writeText(list[i].url).then(() => {
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.25rem", color: "var(--c-text-1)", marginBottom: "0.4rem" }}>
        Generar invitaciones
      </h3>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.78rem", color: "var(--c-text-3)", fontWeight: 300, lineHeight: 1.65, marginBottom: "1.25rem" }}>
        Escribí el nombre del invitado → obtenés el link a su tarjeta personalizada, lista para enviar por WhatsApp o imprimir como PDF.
      </p>

      {/* Input */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generate()}
          placeholder="Ej: María García"
          style={{ flex: 1, background: "var(--c-base)", border: "1px solid var(--c-border)", padding: "0.75rem 1rem", fontFamily: "var(--font-jost)", fontSize: "0.88rem", color: "var(--c-text-1)", outline: "none" }}
        />
        <button onClick={generate} disabled={!name.trim()}
          style={{ background: "var(--c-wine)", border: "none", padding: "0.75rem 1.25rem", fontFamily: "var(--font-jost)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "white", cursor: name.trim() ? "pointer" : "not-allowed", opacity: name.trim() ? 1 : 0.4, transition: "opacity 0.2s" }}>
          Generar
        </button>
      </div>

      {/* List */}
      {list.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {list.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem 1rem", background: "var(--c-base)", border: "1px solid var(--c-border)" }}>

              {/* Name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.85rem", color: "var(--c-text-1)", fontWeight: 400, marginBottom: "0.1rem" }}>{item.name}</p>
                <p style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "var(--c-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                {/* View card */}
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", padding: "0.4rem 0.65rem", background: "transparent", border: "1px solid var(--c-border)", fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--c-text-3)", whiteSpace: "nowrap" }}>
                  Ver tarjeta
                </a>

                {/* Send via WhatsApp */}
                <a href={item.wa} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.4rem 0.65rem", background: "#25D366", border: "none", fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "white", whiteSpace: "nowrap", cursor: "pointer" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.524 5.825L.057 23.852a.5.5 0 0 0 .606.638l6.264-1.638A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                  Enviar
                </a>

                {/* Copy link */}
                <button onClick={() => copy(i)}
                  style={{ display: "flex", alignItems: "center", padding: "0.4rem 0.65rem", background: copied === i ? "rgba(181,137,78,0.12)" : "transparent", border: `1px solid ${copied === i ? "var(--c-gold)" : "var(--c-border)"}`, fontFamily: "var(--font-jost)", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: copied === i ? "var(--c-gold)" : "var(--c-text-3)", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                  {copied === i ? "✓" : "Copiar"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {list.length === 0 && (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "0.72rem", color: "var(--c-text-3)", fontStyle: "italic", textAlign: "center", padding: "1.5rem 0", opacity: 0.5 }}>
          Las invitaciones generadas aparecen acá
        </p>
      )}
    </div>
  );
}
