"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { W } from "@/lib/config";

function QRModal({ url, onClose }: { url:string; onClose:()=>void }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&color=2C1A10&bgcolor=F5EFE4&margin=14&qzone=1`;
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center px-4"
      style={{ background:"rgba(12,6,3,0.92)", backdropFilter:"blur(10px)" }}
      onClick={onClose}>
      <motion.div
        initial={{ scale:0.88, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }}
        transition={{ type:"spring", stiffness:300, damping:28 }}
        className="relative max-w-sm w-full p-8 text-center"
        style={{ background:"var(--c-base)" }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 t-label" style={{ color:"var(--c-text-3)", fontSize:"0.7rem" }}>✕</button>
        <p className="t-eye mb-1">Escanear con el celular</p>
        <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.35rem", color:"var(--c-text-1)", marginBottom:"0.4rem" }}>Subir fotos</h3>
        <p className="t-body mb-6" style={{ color:"var(--c-text-3)", fontSize:"0.78rem" }}>Apuntá la cámara a este QR — se abre directo el álbum</p>
        <div className="mx-auto mb-5 relative inline-block">
          {["top-0 left-0 border-t-2 border-l-2","top-0 right-0 border-t-2 border-r-2","bottom-0 left-0 border-b-2 border-l-2","bottom-0 right-0 border-b-2 border-r-2"].map((cls,i) => (
            <div key={i} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor:"var(--c-wine)" }} />
          ))}
          <img src={qr} alt="QR álbum" width={240} height={240} style={{ display:"block" }} />
        </div>
        <div className="flex items-center gap-3 my-5">
          <div style={{ flex:1, height:1, background:"var(--c-border)" }} />
          <span className="t-label" style={{ color:"var(--c-text-3)", fontSize:"0.58rem" }}>o también</span>
          <div style={{ flex:1, height:1, background:"var(--c-border)" }} />
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="t-eye inline-block pb-px" style={{ color:"var(--c-gold)", borderBottom:"1px solid var(--c-gold)" }}>
          Abrir el álbum directo →
        </a>
      </motion.div>
    </motion.div>
  );
}

export default function PhotoAlbum() {
  const ref   = useRef<HTMLDivElement>(null!);
  const v     = useInView(ref, { once:true, amount:0.2 });
  const [modal, setModal] = useState(false);
  // ← Fix: mounted guard prevents hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const url = W.photoAlbumUrl;

  const steps = [
    { icon:"📸", title:"Abrí el álbum",   desc:"Con el botón de abajo o escaneando el QR" },
    { icon:"🖼️", title:"Elegí tus fotos", desc:"Desde la galería, WhatsApp, o la cámara" },
    { icon:"🚀", title:"¡Listo!",          desc:"Se suman al álbum compartido al instante" },
  ];

  return (
    <>
      <section id="album" className="s-pad surf-sand relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:`radial-gradient(circle at 88% 8%, rgba(181,137,78,0.06) 0%, transparent 45%), radial-gradient(circle at 5% 92%, rgba(107,38,53,0.04) 0%, transparent 40%)`,
        }} />

        <div className="w-content px-6 relative" ref={ref}>
          <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>Álbum compartido</motion.p>
          <motion.h2 className="t-title mb-2" style={{ color:"var(--c-text-1)" }}
            initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}>
            Sumá tus <em style={{ fontStyle:"italic", color:"var(--c-wine)" }}>fotos</em>
          </motion.h2>
          <motion.div className="g-line" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />
          <motion.p className="t-body mb-12 max-w-prose" style={{ color:"var(--c-text-2)" }}
            initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.22 }}>
            Queremos ver el día desde tu perspectiva. Cada foto que compartís queda en nuestro álbum para siempre.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 items-start">

            {/* Action card */}
            <motion.div initial={{ opacity:0,x:-28 }} animate={v?{opacity:1,x:0}:{}}
              transition={{ delay:0.28, duration:0.8, ease:[0.22,1,0.36,1] }}>
              <div className="card-light p-8 relative overflow-hidden">
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right, var(--c-wine), transparent)" }} />
                <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.35rem", color:"var(--c-text-1)", marginBottom:"0.35rem", lineHeight:1.15 }}>
                  Álbum de {W.bride} &amp; {W.groom}
                </h3>
                <p className="t-body mb-7" style={{ color:"var(--c-text-3)", fontSize:"0.82rem" }}>
                  Fotos · videos · reels · stories ✨
                </p>

                {url ? (
                  <div className="flex flex-col gap-3">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-wine w-full justify-center">
                      <span className="flex items-center gap-2 justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        Abrir álbum y subir fotos
                      </span>
                    </a>
                    {/* Only show QR button after mount to avoid hydration mismatch */}
                    {mounted && (
                      <button onClick={() => setModal(true)} className="btn-outline-dark w-full justify-center">
                        <span className="flex items-center gap-2 justify-center">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
                            <rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/>
                          </svg>
                          Ver QR para compartir
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-5 text-center" style={{ border:"1px dashed var(--c-border)", background:"rgba(181,137,78,0.03)" }}>
                    <p className="t-label mb-1.5" style={{ color:"var(--c-text-3)", fontSize:"0.6rem" }}>Álbum no configurado aún</p>
                    <p className="t-body" style={{ color:"var(--c-text-3)", fontSize:"0.78rem", lineHeight:1.7 }}>
                      Agregá el link en<br/>
                      <code style={{ color:"var(--c-gold)", fontFamily:"monospace", fontSize:"0.72rem" }}>lib/config.ts → photoAlbumUrl</code>
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2.5 mt-5 pt-4" style={{ borderTop:"1px solid var(--c-border)" }}>
                  <div className="flex gap-1">{["🔵","🍎","📦"].map((e,i) => <span key={i} style={{ fontSize:"0.9rem" }}>{e}</span>)}</div>
                  <p className="t-body" style={{ color:"var(--c-text-3)", fontSize:"0.7rem" }}>Google Photos · iCloud · Dropbox · cualquier link</p>
                </div>
              </div>
            </motion.div>

            {/* How it works */}
            <motion.div initial={{ opacity:0,x:28 }} animate={v?{opacity:1,x:0}:{}}
              transition={{ delay:0.38, duration:0.8, ease:[0.22,1,0.36,1] }}>
              <p className="t-eye mb-5" style={{ color:"var(--c-text-3)" }}>Cómo funciona</p>
              <div className="space-y-0">
                {steps.map((s,i) => (
                  <motion.div key={i}
                    initial={{ opacity:0,x:12 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:0.46+i*0.1 }}
                    className="flex gap-4 pb-5"
                    style={{ borderBottom:i<steps.length-1?"1px solid var(--c-border)":"none", marginBottom:i<steps.length-1?"1.25rem":0 }}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ background:i===0?"var(--c-wine)":i===1?"var(--c-dark)":"var(--c-gold-dk)" }}>
                      {s.icon}
                    </div>
                    <div className="pt-0.5">
                      <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1rem", color:"var(--c-text-1)", marginBottom:"0.2rem" }}>{s.title}</p>
                      <p className="t-body" style={{ color:"var(--c-text-3)", fontSize:"0.8rem" }}>{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.75 }}
                className="mt-5 p-4" style={{ background:"rgba(181,137,78,0.05)", border:"1px solid var(--c-border)" }}>
                <p className="t-label mb-3" style={{ color:"var(--c-gold)", fontSize:"0.58rem" }}>¿Desde dónde puedo subir?</p>
                <div className="flex flex-wrap gap-2">
                  {["📱 Galería","💬 WhatsApp","📷 Cámara","💻 Computadora","☁️ Drive"].map((tip,i) => (
                    <span key={i} className="t-body inline-block px-2.5 py-1"
                      style={{ fontSize:"0.72rem", background:"var(--c-base)", color:"var(--c-text-2)", border:"1px solid var(--c-border)" }}>
                      {tip}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modal && url && <QRModal url={url} onClose={() => setModal(false)} />}
      </AnimatePresence>
    </>
  );
}
