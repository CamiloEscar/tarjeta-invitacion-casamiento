"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QRButton() {
  const [open, setOpen] = useState(false);
  const [url,  setUrl]  = useState("");
  useEffect(() => setUrl(window.location.href), []);
  const qr = url ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&color=2C1A10&bgcolor=F5EFE4&margin=12` : "";

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        style={{ background: "var(--c-wine)", boxShadow: "0 4px 20px rgba(107,38,53,0.45)" }}
        aria-label="Compartir"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(245,239,228,0.9)" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
          <rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/>
          <rect x="18" y="18" width="3" height="3"/>
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ background: "rgba(20,10,5,0.8)", backdropFilter: "blur(8px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="p-8 text-center max-w-xs w-full"
              style={{ background: "var(--c-base)" }}
              onClick={e => e.stopPropagation()}
            >
              <p className="t-eye mb-1">Compartir</p>
              <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.3rem", color: "var(--c-text-1)", marginBottom: "0.3rem" }}>Invitación</h3>
              <p className="t-body mb-5" style={{ color: "var(--c-text-3)", fontSize: "0.78rem" }}>Escaneá para abrir en otro dispositivo</p>
              <div className="mx-auto mb-5" style={{ width: 200, height: 200, background: "var(--c-linen)" }}>
                {qr ? <img src={qr} alt="QR" width={200} height={200} /> : <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--c-text-3)", fontSize: "0.75rem" }}>Generando...</div>}
              </div>
              <div className="mt-4 pt-4 space-y-2" style={{ borderTop:"1px solid var(--c-border)" }}>
                {url && (
                  <a href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Te comparto la invitación al casamiento de ${typeof window!=="undefined"?window.location.origin:""}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="t-eye flex items-center justify-center gap-1.5 py-1.5 transition-colors"
                    style={{ color:"#25D366", fontSize:"0.6rem", background:"rgba(37,211,102,0.08)", border:"1px solid rgba(37,211,102,0.2)", padding:"0.5rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.524 5.825L.057 23.852a.5.5 0 0 0 .606.638l6.264-1.638A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                    </svg>
                    Compartir por WhatsApp
                  </a>
                )}
                <a href="/live" target="_blank" rel="noopener noreferrer"
                  className="t-eye flex items-center justify-center gap-1.5 py-1 transition-colors"
                  style={{ color:"var(--c-gold)", fontSize:"0.6rem" }}>
                  🖥 Pantalla de transmisión →
                </a>
                <a href="/print" target="_blank" rel="noopener noreferrer"
                  className="t-eye flex items-center justify-center gap-1.5 py-1 transition-colors"
                  style={{ color:"rgba(181,137,78,0.55)", fontSize:"0.6rem" }}>
                  🖨️ Generar invitaciones →
                </a>
                <a href="/admin" target="_blank" rel="noopener noreferrer"
                  className="t-eye flex items-center justify-center gap-1.5 py-1 transition-colors"
                  style={{ color:"rgba(181,137,78,0.45)", fontSize:"0.6rem" }}>
                  ⚙️ Panel admin →
                </a>
              </div>
              <button onClick={() => setOpen(false)} className="t-eye mt-3 block mx-auto" style={{ color:"var(--c-text-3)" }}>✕ Cerrar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
