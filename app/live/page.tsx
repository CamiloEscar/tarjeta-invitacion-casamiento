"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { W, PHOTOS, AGENDA } from "@/lib/config";

// ─────────────────────────────────────────────────────────────
//  /live — Pantalla de proyección para la fiesta
//  Fotos de fondo siempre. Slides cinematográficos que rotan.
//  QR estable para transmitir cámara del celu a la pantalla.
// ─────────────────────────────────────────────────────────────

const SLIDE_MS = 9000;
type SlideName = "welcome" | "event-agenda" | "photos" | "love-quote" | "album" | "comments";
const SLIDES: SlideName[] = ["welcome", "love-quote", "event-agenda", "comments", "photos", "album"];

// ── Photo background with Ken Burns effect ────────────────────
function PhotoBg({ dimmed }: { dimmed: boolean }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<boolean[]>(Array(PHOTOS.length).fill(false));

  useEffect(() => {
    const id = setInterval(() => {
      setCur(c => { setPrev(c); return (c + 1) % PHOTOS.length; });
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const markLoaded = (i: number) =>
    setLoaded(prev => { const n = [...prev]; n[i] = true; return n; });

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      {PHOTOS.map((p, i) => (
        <img key={p.src} src={p.src} alt=""
          onLoad={() => markLoaded(i)}
          style={{
            position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover",
            filter:`brightness(${dimmed ? 0.12 : 0.5}) saturate(0.7)`,
            opacity: (i === cur && loaded[i]) ? 1 : 0,
            transition: "opacity 1.8s ease, filter 0.8s ease",
            // Ken Burns: each photo gets a slightly different scale/position animation
            transform: i === cur ? "scale(1.06)" : "scale(1)",
            transformOrigin: i % 2 === 0 ? "center center" : "30% 40%",
          }}
        />
      ))}
      {/* Layered gradient overlay */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(20,10,5,0.1) 0%, rgba(20,10,5,0.55) 100%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(20,10,5,0.5) 0%, transparent 25%, transparent 70%, rgba(20,10,5,0.7) 100%)", pointerEvents:"none" }} />
    </div>
  );
}

function SlideEventAgenda() {
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", padding:"2rem 4rem", userSelect:"none", justifyContent:"center", gap:"2rem" }}>
      
      {/* Evento row */}
      <div style={{ display:"flex", gap:"clamp(2rem,6vw,6rem)", alignItems:"stretch", justifyContent:"center" }}>
        {[
          { type:"Ceremonia", name:W.ceremony.name, time:W.ceremony.time, addr:W.ceremony.address },
          { type:"Recepción", name:W.reception.name, time:W.reception.time, addr:W.reception.address },
        ].map((ev, i) => (
          <motion.div key={i} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1+i*0.15, duration:0.8, ease:[0.16,1,0.3,1] }}
            style={{ flex:1, textAlign:"center", maxWidth:320, display:"flex", flexDirection:"column", gap:"0.4rem" }}>
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.45rem,0.9vw,0.6rem)", letterSpacing:"0.32em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)" }}>{ev.type}</p>
            <div style={{ width:24, height:1, background:"rgba(181,137,78,0.4)", margin:"0 auto" }} />
            <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"clamp(1.2rem,2.8vw,2.1rem)", color:"var(--c-text-inv)", lineHeight:1.15 }}>{ev.name}</p>
            <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1rem,2.4vw,1.8rem)", color:"var(--c-gold-lt)" }}>{ev.time}</p>
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.55rem,1.1vw,0.72rem)", color:"rgba(154,128,104,0.5)", fontWeight:300, lineHeight:1.5 }}>{ev.addr}</p>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.4, duration:0.9 }}
        style={{ width:"min(400px,60%)", height:1, background:"linear-gradient(to right, transparent, rgba(181,137,78,0.25), transparent)", margin:"0 auto" }} />

      {/* Agenda compacta */}
      <div style={{ width:"100%", maxWidth:640, margin:"0 auto" }}>
        {AGENDA.map((a, i) => (
          <motion.div key={i} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2+i*0.08, duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ display:"flex", alignItems:"center", gap:"clamp(0.6rem,2vw,1.5rem)", padding:"0.55rem 0", borderBottom:i<AGENDA.length-1?"1px solid rgba(181,137,78,0.08)":"none" }}>
            <span style={{ fontSize:"clamp(0.9rem,2vw,1.3rem)", minWidth:"1.8rem", textAlign:"center" }}>{a.icon}</span>
            <span style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", color:"var(--c-gold-lt)", fontSize:"clamp(0.85rem,2vw,1.35rem)", minWidth:"3.8rem" }}>{a.time}</span>
            <div>
              <p style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(0.75rem,1.6vw,1.1rem)", color:"var(--c-text-inv)", fontWeight:400 }}>{a.title}</p>
              <p style={{ fontFamily:"var(--font-jost)", fontWeight:300, fontSize:"clamp(0.55rem,1.1vw,0.72rem)", color:"rgba(154,128,104,0.45)" }}>{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlidePhotos() {
  const [cur, setCur] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(Array(PHOTOS.length).fill(false));

  useEffect(() => {
    const id = setInterval(() => setCur(c => (c + 1) % PHOTOS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position:"absolute", inset:0 }}>
      {PHOTOS.map((p, i) => (
        <img key={p.src} src={p.src} alt=""
          onLoad={() => setLoaded(prev => { const n=[...prev]; n[i]=true; return n; })}
          style={{
            position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover",
            filter:"brightness(0.72) saturate(0.85)",
            opacity: i === cur && loaded[i] ? 1 : 0,
            transition:"opacity 1.8s ease",
            transform: i === cur ? "scale(1.04)" : "scale(1)",
          }}
        />
      ))}
      {/* Overlay suave con nombres */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(12,6,3,0.6) 0%, transparent 40%)", pointerEvents:"none" }} />
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:1 }}
        style={{ position:"absolute", bottom:"3.5rem", left:0, right:0, textAlign:"center", pointerEvents:"none" }}>
        <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,5vw,4rem)", color:"rgba(240,232,218,0.55)", letterSpacing:"0.04em" }}>
          {W.bride} &amp; {W.groom}
        </p>
      </motion.div>
    </div>
  );
}

// ── Slide: Welcome / Names ─────────────────────────────────────
function SlideWelcome() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", textAlign:"center", gap:0, userSelect:"none" }}>
      <motion.p initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8 }}
        style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.5rem,1.3vw,0.8rem)", letterSpacing:"0.42em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", marginBottom:"2.5rem" }}>
        BIENVENIDOS A NUESTRA BODA
      </motion.p>

      <div style={{ overflow:"hidden", lineHeight:0.85 }}>
        <motion.h1 initial={{ y:"108%" }} animate={{ y:0 }} transition={{ delay:0.15, duration:1.1, ease:[0.16,1,0.3,1] }}
          style={{ fontFamily:"var(--font-playfair)", fontWeight:400, fontSize:"clamp(6rem,20vw,17rem)", lineHeight:0.85, color:"#F0E8D8", display:"block" }}>
          {W.bride}
        </motion.h1>
      </div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7, duration:0.9 }}
        style={{ display:"flex", alignItems:"center", gap:"1.5rem", margin:"0.6rem 0" }}>
        <div style={{ width:"min(80px,8vw)", height:1, background:"linear-gradient(to right, transparent, rgba(181,137,78,0.4))" }} />
        <span style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(2.5rem,6.5vw,5.5rem)", color:"var(--c-gold)", lineHeight:1 }}>&amp;</span>
        <div style={{ width:"min(80px,8vw)", height:1, background:"linear-gradient(to left, transparent, rgba(181,137,78,0.4))" }} />
      </motion.div>

      <div style={{ overflow:"hidden", lineHeight:0.85 }}>
        <motion.h1 initial={{ y:"108%" }} animate={{ y:0 }} transition={{ delay:0.28, duration:1.1, ease:[0.16,1,0.3,1] }}
          style={{ fontFamily:"var(--font-playfair)", fontWeight:400, fontSize:"clamp(6rem,20vw,17rem)", lineHeight:0.85, color:"#F0E8D8", display:"block" }}>
          {W.groom}
        </motion.h1>
      </div>

      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1, duration:0.8 }}
        style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.5rem,1.3vw,0.8rem)", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(196,168,130,0.5)", marginTop:"2.5rem" }}>
        {W.weddingDateLabel} · {W.location}
      </motion.p>
    </div>
  );
}

// ── Slide: Love Quote ──────────────────────────────────────────
function SlideLoveQuote() {
  const quotes = [
  { text: "Al final del día, lo único que importa es que encontré a alguien con quien quejarme de todo.", author: `${W.bride} & ${W.groom}` },
  { text: "Dicen que detrás de un gran hombre hay una gran mujer. Nosotros preferimos ir de la mano.", author: `${W.bride} & ${W.groom}` },
  { text: "Te elegí a vos. Y si hubiera que volver a elegir, te elegiría de nuevo. Aunque a veces me saques.", author: `${W.bride} & ${W.groom}` },
  { text: "No sé si creer en el destino, pero algo me dice que no fue casualidad que nos pusieran en el mismo lugar.", author: `${W.bride} & ${W.groom}` },
];
  const [idx] = useState(() => Math.floor(Math.random() * quotes.length));
  const q = quotes[idx];

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", textAlign:"center", padding:"4rem 8rem", userSelect:"none" }}>
      <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.2, duration:1 }}
        style={{ width:"min(60px,6vw)", height:2, background:"var(--c-gold)", margin:"0 auto 2.5rem", opacity:0.5 }} />

      <motion.div initial={{ opacity:0 }} animate={{ opacity:0.2 }} transition={{ delay:0.1 }}
        style={{ fontFamily:"Georgia, serif", fontSize:"clamp(5rem,15vw,12rem)", color:"var(--c-gold)", lineHeight:0.6, marginBottom:"-1rem", userSelect:"none" }}>
        "
      </motion.div>

      <motion.p initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:1, ease:[0.22,1,0.36,1] }}
        style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(1.4rem,3.5vw,2.6rem)", color:"rgba(240,232,218,0.9)", lineHeight:1.5, maxWidth:"26ch", marginBottom:"2rem" }}>
        {q.text}
      </motion.p>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
        style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
        <div style={{ width:32, height:1, background:"rgba(181,137,78,0.35)" }} />
        <p style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.55rem,1.2vw,0.75rem)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)" }}>{q.author}</p>
        <div style={{ width:32, height:1, background:"rgba(181,137,78,0.35)" }} />
      </motion.div>
    </div>
  );
}

// ── Slide: Event info ──────────────────────────────────────────
function SlideEvent() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", padding:"3rem 5rem", userSelect:"none" }}>
      <div style={{ display:"flex", gap:"clamp(2rem,6vw,6rem)", alignItems:"stretch", width:"100%", maxWidth:960, justifyContent:"center" }}>
        {[
          { type:"Ceremonia", name:W.ceremony.name, time:W.ceremony.time, note:W.ceremony.note, addr:W.ceremony.address },
          { type:"Recepción", name:W.reception.name, time:W.reception.time, note:W.reception.cocktail, addr:W.reception.address },
        ].map((ev, i) => (
          <motion.div key={i} initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15+i*0.2, duration:0.9, ease:[0.16,1,0.3,1] }}
            style={{ flex:1, textAlign:"center", minWidth:200, display:"flex", flexDirection:"column", gap:"0.6rem" }}>
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.5rem,1vw,0.65rem)", letterSpacing:"0.32em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)" }}>{ev.type}</p>
            <div style={{ width:30, height:1, background:"rgba(181,137,78,0.4)", margin:"0 auto" }} />
            <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"clamp(1.5rem,3.8vw,2.8rem)", color:"var(--c-text-inv)", lineHeight:1.15 }}>{ev.name}</p>
            <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1.3rem,3.2vw,2.4rem)", color:"var(--c-gold-lt)" }}>{ev.time}</p>
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.6rem,1.3vw,0.85rem)", color:"rgba(154,128,104,0.55)", fontWeight:300, lineHeight:1.55 }}>{ev.addr}</p>
            <p style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.55rem,1.1vw,0.75rem)", color:"rgba(154,128,104,0.38)", fontWeight:300, fontStyle:"italic" }}>{ev.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Slide: Agenda ──────────────────────────────────────────────
function SlideAgenda() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", padding:"3rem 6rem", userSelect:"none" }}>
      <motion.p initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.5rem,1.2vw,0.72rem)", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"2.5rem", textAlign:"center" }}>
        CRONOGRAMA DEL DÍA
      </motion.p>
      <div style={{ width:"100%", maxWidth:680 }}>
        {AGENDA.map((a, i) => (
          <motion.div key={i} initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.12+i*0.1, duration:0.65, ease:[0.22,1,0.36,1] }}
            style={{ display:"flex", alignItems:"center", gap:"clamp(0.75rem,2.5vw,2rem)", padding:"0.8rem 0", borderBottom:i<AGENDA.length-1?"1px solid rgba(181,137,78,0.1)":"none" }}>
            <span style={{ fontSize:"clamp(1rem,2.5vw,1.6rem)", minWidth:"2.2rem", textAlign:"center" }}>{a.icon}</span>
            <span style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", color:"var(--c-gold-lt)", fontSize:"clamp(1rem,2.5vw,1.7rem)", minWidth:"4.2rem" }}>{a.time}</span>
            <div>
              <p style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(0.85rem,2vw,1.3rem)", color:"var(--c-text-inv)", fontWeight:400 }}>{a.title}</p>
              <p style={{ fontFamily:"var(--font-jost)", fontWeight:300, fontSize:"clamp(0.6rem,1.4vw,0.85rem)", color:"rgba(154,128,104,0.48)" }}>{a.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Slide: Dress code ──────────────────────────────────────────
function SlideDresscode() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", textAlign:"center", padding:"3rem", userSelect:"none" }}>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}
        style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.5rem,1.1vw,0.68rem)", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"1.5rem" }}>
        DRESS CODE
      </motion.p>
      <div style={{ overflow:"hidden" }}>
        <motion.p initial={{ y:"100%" }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.9, ease:[0.16,1,0.3,1] }}
          style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(3rem,8vw,6.5rem)", color:"var(--c-text-inv)", lineHeight:0.92 }}>
          Formal Elegante
        </motion.p>
      </div>
      <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.6, duration:0.8 }}
        style={{ width:"min(80px,8vw)", height:1, background:"linear-gradient(to right, transparent, var(--c-gold), transparent)", margin:"2rem auto" }} />
      <div style={{ display:"flex", gap:"clamp(2rem,6vw,5rem)", justifyContent:"center" }}>
        {[
          { icon:"👔", label:"Caballeros", text:"Traje oscuro · Esmoquin" },
          { icon:"👗", label:"Damas",      text:"Vestido largo · Cóctel"  },
          { icon:"🚫", label:"Evitar",     text:"Blanco · Marfil · Rojo"  },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35+i*0.12, duration:0.7 }}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.7rem" }}>
            <span style={{ fontSize:"clamp(2rem,5vw,3.8rem)" }}>{item.icon}</span>
            <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"clamp(0.85rem,2vw,1.3rem)", color:"var(--c-gold-lt)" }}>{item.label}</p>
            <p style={{ fontFamily:"var(--font-jost)", fontWeight:300, fontSize:"clamp(0.6rem,1.3vw,0.82rem)", color:"rgba(154,128,104,0.5)" }}>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlideComments({
  comments,
}: {
  comments: { name: string; message: string }[];
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!comments.length) return;

    const id = setInterval(() => {
      setIdx(i => (i + 1) % comments.length);
    }, 7000);

    return () => clearInterval(id);
  }, [comments]);

  if (!comments.length) return null;

  const current = comments[idx];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "4rem",
        textAlign: "center",
        userSelect: "none",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            maxWidth: "900px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "clamp(0.5rem,1.1vw,0.68rem)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(181,137,78,0.45)",
              marginBottom: "2rem",
            }}
          >
            MENSAJES DE NUESTROS INVITADOS
          </p>

          <div
            style={{
              fontSize: "clamp(4rem,10vw,8rem)",
              color: "rgba(181,137,78,0.15)",
              lineHeight: 0.6,
              marginBottom: "-1rem",
              fontFamily: "Georgia, serif",
            }}
          >
            "
          </div>

          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "clamp(1.4rem,3vw,2.8rem)",
              lineHeight: 1.6,
              color: "rgba(240,232,218,0.92)",
              marginBottom: "2rem",
            }}
          >
            {current.message}
          </p>

          <div
            style={{
              width: 40,
              height: 1,
              background: "rgba(181,137,78,0.35)",
              margin: "0 auto 1rem",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "clamp(0.6rem,1.2vw,0.8rem)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(181,137,78,0.55)",
            }}
          >
            {current.name}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Slide: Album QR ────────────────────────────────────────────
function SlideAlbum({ qrSrc }: { qrSrc: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", gap:"clamp(2.5rem,7vw,6rem)", padding:"3rem 5rem", userSelect:"none", flexWrap:"wrap" }}>

      {/* QR with decorative frame */}
      <motion.div initial={{ opacity:0, scale:0.75 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
        style={{ position:"relative", flexShrink:0 }}>
        {/* Outer glow */}
        <div style={{ position:"absolute", inset:-8, background:"rgba(181,137,78,0.06)", border:"1px solid rgba(181,137,78,0.15)", borderRadius:2 }} />
        {/* Corner marks */}
        {[
          { top:0, left:0, borderTop:"2px solid var(--c-wine)", borderLeft:"2px solid var(--c-wine)" },
          { top:0, right:0, borderTop:"2px solid var(--c-wine)", borderRight:"2px solid var(--c-wine)" },
          { bottom:0, left:0, borderBottom:"2px solid var(--c-wine)", borderLeft:"2px solid var(--c-wine)" },
          { bottom:0, right:0, borderBottom:"2px solid var(--c-wine)", borderRight:"2px solid var(--c-wine)" },
        ].map((s, i) => <div key={i} style={{ position:"absolute", width:24, height:24, ...s }} />)}
        {qrSrc
          ? <img src={qrSrc} alt="QR fotos" style={{ width:"clamp(180px,26vw,240px)", height:"clamp(180px,26vw,240px)", display:"block", position:"relative" }} />
          : <div style={{ width:200, height:200, background:"rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:24, height:24, border:"2px solid var(--c-gold)", borderTopColor:"transparent", borderRadius:"50%", animation:"lspin 0.8s linear infinite" }} />
            </div>
        }
      </motion.div>

      {/* Text */}
      <motion.div initial={{ opacity:0, x:32 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25, duration:0.9, ease:[0.16,1,0.3,1] }}
        style={{ maxWidth:360, textAlign:"center" }}>
        <p style={{ fontFamily:"var(--font-jost)", fontSize:"clamp(0.5rem,1.1vw,0.68rem)", letterSpacing:"0.32em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"1.25rem" }}>
          ÁLBUM DE FOTOS
        </p>
        <h2 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:400, fontSize:"clamp(2rem,5vw,3.8rem)", color:"var(--c-text-inv)", lineHeight:1.1, marginBottom:"1rem" }}>
          Compartí tus fotos
        </h2>
        <div style={{ width:36, height:1, background:"rgba(181,137,78,0.35)", margin:"0 auto 1rem" }} />
        <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(1rem,2.2vw,1.5rem)", color:"rgba(196,168,130,0.6)", lineHeight:1.7, marginBottom:"1.5rem" }}>
          Escaneá el QR y subí las fotos del día desde tu galería o WhatsApp
        </p>
        <div style={{ display:"flex", gap:"0.5rem", justifyContent:"center", flexWrap:"wrap" }}>
          {["📱 Galería","💬 WhatsApp","📷 Cámara","☁️ Drive"].map((t,i) => (
            <span key={i} style={{ fontSize:"clamp(0.55rem,1.1vw,0.72rem)", color:"rgba(154,128,104,0.4)", padding:"0.2rem 0.6rem", border:"1px solid rgba(181,137,78,0.15)" }}>{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Camera Receiver ────────────────────────────────────────────
function CamReceiver({ onStream, onClose }: {
  onStream: (stream: MediaStream) => void;
  onClose: () => void;
}) {
  const [peerJsLoaded, setLoaded] = useState(false);
  const [myId,   setMyId]   = useState("");
  const [qrSrc,  setQrSrc]  = useState("");
  const [status, setStatus] = useState<"loading"|"ready"|"receiving"|"error">("loading");
  const peerRef = useRef<any>(null);

  // Load PeerJS
  useEffect(() => {
    if ((window as any).Peer) { setLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
    s.onload = () => setLoaded(true);
    s.onerror = () => setStatus("error");
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  // Create peer with stable ID from sessionStorage
  useEffect(() => {
    if (!peerJsLoaded) return;
    // Stable ID — won't change on re-render
    let id = sessionStorage.getItem("live-receiver-id");
    if (!id) {
      id = "recv-" + Math.random().toString(36).slice(2, 9);
      sessionStorage.setItem("live-receiver-id", id);
    }
    const Peer = (window as any).Peer;
    const peer = new Peer(id, { debug: 0 });
    peerRef.current = peer;

    peer.on("open", (peerId: string) => {
      setMyId(peerId);
      setStatus("ready");
      // Generate QR only once when ID is stable
      const camUrl = `${window.location.origin}/live/cam?room=${peerId}`;
      setQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(camUrl)}&color=F5EFE4&bgcolor=2C1A10&margin=14`);
    });

    peer.on("call", (call: any) => {
      call.answer();
      setStatus("receiving");
      call.on("stream", (stream: MediaStream) => onStream(stream));
    });

    peer.on("error", () => {
      // If ID already taken (page reload), clear and let it regenerate
      sessionStorage.removeItem("live-receiver-id");
      setStatus("error");
    });

    return () => { try { peer.destroy(); } catch {} };
  }, [peerJsLoaded, onStream]);

  function resetId() {
    sessionStorage.removeItem("live-receiver-id");
    window.location.reload();
  }

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(12,6,3,0.9)", backdropFilter:"blur(8px)", padding:"1.5rem" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <motion.div initial={{ scale:0.88, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, opacity:0 }}
        transition={{ type:"spring", stiffness:300, damping:28 }}
        style={{ background:"var(--c-dark-2)", border:"1px solid rgba(181,137,78,0.2)", padding:"2rem", maxWidth:420, width:"100%", position:"relative", overflow:"hidden" }}
        onClick={e => e.stopPropagation()}>

        {/* Top accent */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(to right, var(--c-wine), var(--c-gold), transparent)" }} />

        <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(181,137,78,0.45)", marginBottom:"0.6rem", textAlign:"center" }}>
          TRANSMITIR CÁMARA
        </p>
        <h3 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.35rem", color:"var(--c-text-inv)", marginBottom:"0.5rem", textAlign:"center" }}>
          Conectar el celular
        </h3>
        <p style={{ fontFamily:"var(--font-jost)", fontSize:"0.7rem", color:"rgba(154,128,104,0.45)", marginBottom:"1.75rem", textAlign:"center", lineHeight:1.65, fontWeight:300 }}>
          Escaneá el QR con tu celular para abrir<br/>la página de transmisión con el código ya cargado
        </p>

        {status === "loading" && (
          <div style={{ textAlign:"center", padding:"2rem" }}>
            <div style={{ width:24, height:24, border:"2px solid var(--c-gold)", borderTopColor:"transparent", borderRadius:"50%", animation:"lspin 0.8s linear infinite", margin:"0 auto 1rem" }} />
            <p style={{ fontSize:"0.72rem", color:"rgba(154,128,104,0.4)" }}>Preparando conexión...</p>
          </div>
        )}

        {status === "error" && (
          <div style={{ textAlign:"center", padding:"1.5rem" }}>
            <p style={{ fontSize:"0.78rem", color:"#ef9a9a", marginBottom:"1rem" }}>Error al conectar. El ID puede estar en uso.</p>
            <button onClick={resetId}
              style={{ background:"rgba(181,137,78,0.15)", border:"1px solid rgba(181,137,78,0.3)", padding:"0.6rem 1.2rem", fontSize:"0.6rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--c-gold-lt)", cursor:"pointer" }}>
              Generar nuevo ID
            </button>
          </div>
        )}

        {(status === "ready" || status === "receiving") && (
          <>
            {/* QR — stable, won't change */}
            <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
              {qrSrc
                ? <img src={qrSrc} alt="QR cámara" style={{ width:180, height:180, display:"block", margin:"0 auto" }} />
                : <div style={{ width:180, height:180, background:"rgba(255,255,255,0.04)", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:20, height:20, border:"2px solid var(--c-gold)", borderTopColor:"transparent", borderRadius:"50%", animation:"lspin 0.8s linear infinite" }} />
                  </div>
              }
              <p style={{ fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(154,128,104,0.35)", marginTop:"0.75rem" }}>
                Abre /live/cam listo para conectar
              </p>
            </div>

            {/* ID row */}
            <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1rem" }}>
              <code style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(181,137,78,0.18)", padding:"0.6rem 0.75rem", fontSize:"0.68rem", color:"var(--c-gold-lt)", fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {myId}
              </code>
              <button onClick={() => navigator.clipboard.writeText(myId)}
                style={{ background:"rgba(181,137,78,0.1)", border:"1px solid rgba(181,137,78,0.22)", padding:"0.6rem 0.8rem", fontSize:"0.56rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(181,137,78,0.65)", cursor:"pointer" }}>
                Copiar
              </button>
            </div>

            {/* Receiving indicator */}
            {status === "receiving" && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"0.6rem", background:"rgba(76,175,80,0.1)", border:"1px solid rgba(76,175,80,0.3)", marginBottom:"1rem" }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#66bb6a", animation:"livepulse 1.5s ease-in-out infinite" }} />
                <span style={{ fontSize:"0.65rem", color:"#81c784" }}>Recibiendo transmisión en vivo</span>
              </motion.div>
            )}
          </>
        )}

        <button onClick={onClose}
          style={{ display:"block", width:"100%", background:"transparent", border:"1px solid rgba(181,137,78,0.15)", padding:"0.75rem", fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(154,128,104,0.4)", cursor:"pointer", marginTop:"0.25rem" }}>
          {status === "receiving" ? "Ocultar · cámara sigue activa" : "Cancelar"}
        </button>
      </motion.div>

      <style>{`
        @keyframes lspin { to { transform:rotate(360deg); } }
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.82)} }
      `}</style>
    </motion.div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function LivePage() {
  const [slideIdx,    setSlideIdx]    = useState(0);
  const [autoPlay,    setAutoPlay]    = useState(true);
  const [showCtrl,    setShowCtrl]    = useState(true);
  const [showReceive, setShowReceive] = useState(false);
  const [camStream,   setCamStream]   = useState<MediaStream | null>(null);
  const camVideoRef   = useRef<HTMLVideoElement>(null);
  const [albumQrSrc,  setAlbumQrSrc]  = useState("");
  const [comments, setComments] = useState<
  { name: string; message: string }[]
>([]);

  const current = SLIDES[slideIdx];

  useEffect(() => {
    const origin = window.location.origin;
    const albumUrl = W.photoAlbumUrl || `${origin}/#album`;
    setAlbumQrSrc(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(albumUrl)}&color=F5EFE4&bgcolor=2C1A10&margin=14`);
  }, []);

  useEffect(() => {
  async function loadComments() {
    try {
      const res = await fetch(
        `${W.appsScriptUrl}?action=getComments`
      );

      const data = await res.json();

      setComments(data.comments || []);
    } catch (e) {
      console.error(e);
    }
  }

  loadComments();
}, []);

  // Attach camera stream
  useEffect(() => {
    if (camVideoRef.current && camStream) {
      camVideoRef.current.srcObject = camStream;
      camVideoRef.current.play().catch(() => {});
    }
  }, [camStream]);

  // Auto-advance (not when cam is live)
  useEffect(() => {
    if (!autoPlay || camStream) return;
    const id = setInterval(() => setSlideIdx(i => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [autoPlay, camStream]);

  // Auto-hide controls
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const show = () => { setShowCtrl(true); clearTimeout(t); t = setTimeout(() => setShowCtrl(false), 4500); };
    show();
    window.addEventListener("pointermove", show);
    window.addEventListener("touchstart", show);
    return () => { clearTimeout(t); window.removeEventListener("pointermove", show); window.removeEventListener("touchstart", show); };
  }, []);

  const slideMap: Record<SlideName, React.ReactNode> = {
  welcome:       <SlideWelcome />,
  "love-quote":  <SlideLoveQuote />,
  "event-agenda":<SlideEventAgenda />,
  photos:        <SlidePhotos />,
  comments:      <SlideComments comments={comments} />,
  album:         <SlideAlbum qrSrc={albumQrSrc} />,
};

const LABELS: Record<SlideName, string> = {
  welcome:"Bienvenida", "love-quote":"Frases", "event-agenda":"Programa",
  photos:"Fotos", comments:"Mensajes", album:"Álbum",
};

  return (
    <div style={{ width:"100vw", height:"100dvh", overflow:"hidden", position:"relative", background:"var(--c-dark)" }}>

      {/* Photo background */}
      <div style={{ position:"absolute", inset:0, zIndex:0 }}>
        <PhotoBg dimmed={!!camStream} />
      </div>

      {/* Live camera feed */}
      {camStream && (
        <video ref={camVideoRef} autoPlay playsInline
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:1 }} />
      )}

      {/* Dark scrim — lighter so photos show through beautifully */}
      <div style={{ position:"absolute", inset:0, zIndex:2, background:"rgba(12,6,3,0.45)", pointerEvents:"none" }} />

      {/* Slide content */}
      {!camStream && (
        <div style={{ position:"absolute", inset:0, zIndex:3 }}>
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
              style={{ width:"100%", height:"100%" }}>
              {slideMap[current]}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* LIVE indicator */}
      {camStream && (
        <div style={{ position:"absolute", top:"1rem", left:"1.25rem", zIndex:5, display:"flex", alignItems:"center", gap:"0.4rem", background:"rgba(200,40,40,0.85)", padding:"0.3rem 0.75rem", borderRadius:2 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"white", animation:"livepulse 1s ease-in-out infinite" }} />
          <span style={{ fontSize:"0.58rem", fontWeight:500, letterSpacing:"0.12em", color:"white", fontFamily:"var(--font-jost)" }}>EN VIVO</span>
        </div>
      )}



      {/* Controls */}
      <AnimatePresence>
        {showCtrl && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
            style={{ position:"absolute", inset:0, zIndex:5, pointerEvents:"none" }}>

            {/* Top bar */}
            <div style={{ position:"absolute", top:0, left:0, right:0, background:"linear-gradient(to bottom, rgba(12,6,3,0.85), transparent)", paddingBottom:"3rem", pointerEvents:"auto" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.9rem 1.5rem", gap:"0.5rem" }}>

                <a href="/" style={{ fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.38)", flexShrink:0 }}>← Salir</a>

                {/* Slide tabs */}
                {!camStream && (
                  <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap", justifyContent:"center" }}>
                    {SLIDES.map((s, i) => {
                      const active = slideIdx === i;
                      return (
                        <button key={s} onClick={() => { setSlideIdx(i); setAutoPlay(false); }}
                          style={{ fontFamily:"var(--font-jost)", fontSize:"0.52rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.32rem 0.6rem", background:active?"rgba(181,137,78,0.22)":"rgba(255,255,255,0.04)", border:`1px solid ${active?"var(--c-gold)":"rgba(181,137,78,0.14)"}`, color:active?"var(--c-gold-lt)":"rgba(181,137,78,0.38)", cursor:"pointer", transition:"all 0.2s" }}>
                          {LABELS[s]}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Right buttons */}
                <div style={{ display:"flex", gap:"0.5rem", flexShrink:0 }}>
                  {!camStream && (
                    <button onClick={() => setAutoPlay(a => !a)} title={autoPlay?"Pausar":"Reanudar"}
                      style={{ fontFamily:"var(--font-jost)", fontSize:"0.58rem", color:"rgba(181,137,78,0.4)", cursor:"pointer", padding:"0.32rem 0.5rem", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(181,137,78,0.14)" }}>
                      {autoPlay ? "⏸" : "▶"}
                    </button>
                  )}
                  {camStream
                    ? <button onClick={() => { setCamStream(null); if (camVideoRef.current) camVideoRef.current.srcObject = null; }}
                        style={{ fontFamily:"var(--font-jost)", fontSize:"0.54rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"#ef9a9a", cursor:"pointer", background:"rgba(200,50,50,0.12)", border:"1px solid rgba(200,50,50,0.3)", padding:"0.32rem 0.7rem" }}>
                        ⏹ Detener cámara
                      </button>
                    : <button onClick={() => setShowReceive(true)}
                        style={{ fontFamily:"var(--font-jost)", fontSize:"0.54rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(181,137,78,0.5)", cursor:"pointer", background:"rgba(181,137,78,0.08)", border:"1px solid rgba(181,137,78,0.22)", padding:"0.32rem 0.7rem" }}>
                        📷 Cámara
                      </button>
                  }
                </div>
              </div>
            </div>

            {/* Watermark — only visible with controls */}
            {!camStream && (
              <div style={{ position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", zIndex:4, pointerEvents:"none", textAlign:"center", whiteSpace:"nowrap" }}>
                <p style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"clamp(0.75rem,1.8vw,1.05rem)", color:"rgba(181,137,78,0.22)", letterSpacing:"0.04em" }}>
                  {W.bride} &amp; {W.groom} · {W.weddingDateLabel}
                </p>
              </div>
            )}

          {/* Bottom dots */}
            {!camStream && (
              <div style={{ position:"absolute", bottom:"0.75rem", left:"50%", transform:"translateX(-50%)", display:"flex", gap:"0.4rem", zIndex:5, pointerEvents:"auto" }}>
                {SLIDES.map((_, i) => (
                  <motion.button key={i} onClick={() => { setSlideIdx(i); setAutoPlay(false); }}
                    animate={{ width:slideIdx===i?24:7, background:slideIdx===i?"var(--c-gold)":"rgba(181,137,78,0.22)" }}
                    transition={{ duration:0.3 }}
                    style={{ height:5, borderRadius:9999, cursor:"pointer" }} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera receiver modal */}
      <AnimatePresence>
        {showReceive && (
          <CamReceiver
            onStream={(stream) => { setCamStream(stream); setShowReceive(false); }}
            onClose={() => setShowReceive(false)}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes lspin { to { transform:rotate(360deg); } }
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.82)} }
      `}</style>
    </div>
  );
}
