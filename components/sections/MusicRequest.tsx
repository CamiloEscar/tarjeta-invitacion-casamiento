"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { W, SUGGESTED_SONGS } from "@/lib/config";

type Song = { title:string; artist:string };

export default function MusicRequest() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once:true, amount:0.2 });
  const [title,  setTitle]  = useState("");
  const [artist, setArtist] = useState("");
  const [songs,  setSongs]  = useState<Song[]>([]);
  const [sent,   setSent]   = useState(false);

  function add() {
    if (!title.trim()) return;
    setSongs(s => [...s, { title: title.trim(), artist: artist.trim() }]);
    setTitle("");
    setArtist("");
  }

  function remove(i: number) {
    setSongs(s => s.filter((_,idx) => idx!==i));
  }

  function suggest(song: typeof SUGGESTED_SONGS[number]) {
    if (!songs.find(s => s.title===song.title)) {
      setSongs(s => [...s, { title:song.title, artist:song.artist }]);
    }
  }

  async function send() {
    // Would POST to RSVP endpoint with songs
    setSent(true);
  }

  return (
    <section id="music-request" className="s-pad surf-linen">
      <div className="w-content px-6" ref={ref}>
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>Música</motion.p>
        <motion.h2 className="t-title mb-2" style={{ color:"var(--c-text-1)" }}
          initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}>
          Recomendá una <em style={{ fontStyle:"italic", color:"var(--c-wine)" }}>canción</em>
        </motion.h2>
        <motion.div className="g-line" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />
        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.22 }}
          className="t-body mb-10 max-w-prose" style={{ color:"var(--c-text-2)" }}>
          ¿Qué canción no puede faltar en la fiesta? Sugerila y la tendremos en cuenta para la playlist ✨
        </motion.p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left — input */}
          <motion.div initial={{ opacity:0,x:-24 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:0.3 }}>

            {/* Spotify embed */}
            <div className="mb-6 overflow-hidden" style={{ borderRadius:4, boxShadow:"0 8px 32px rgba(44,26,16,0.1)" }}>
              <iframe src={W.spotifyEmbedSrc} style={{ borderRadius:4 }}
                width="100%" height="220" frameBorder="0" allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy" title="Playlist de Leo & Paola" />
            </div>

            {/* Add song form */}
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form">
                  <div className="card-light p-6">
                    <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1rem", color:"var(--c-text-1)", marginBottom:"1rem" }}>
                      Agregá tu canción 🎵
                    </p>

                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="t-label" style={{ color:"var(--c-text-3)", fontSize:"0.58rem", display:"block", marginBottom:"0.35rem" }}>Nombre de la canción</label>
                        <input
                          value={title} onChange={e => setTitle(e.target.value)}
                          onKeyDown={e => e.key==="Enter" && add()}
                          placeholder="Ej: Perfect"
                          className="w-full px-3 py-2.5 t-body outline-none transition-all"
                          style={{ background:"var(--c-linen)", border:"1px solid var(--c-border)", color:"var(--c-text-1)", fontSize:"0.88rem", borderRadius:0 }}
                        />
                      </div>
                      <div>
                        <label className="t-label" style={{ color:"var(--c-text-3)", fontSize:"0.58rem", display:"block", marginBottom:"0.35rem" }}>Artista (opcional)</label>
                        <input
                          value={artist} onChange={e => setArtist(e.target.value)}
                          onKeyDown={e => e.key==="Enter" && add()}
                          placeholder="Ej: Ed Sheeran"
                          className="w-full px-3 py-2.5 t-body outline-none transition-all"
                          style={{ background:"var(--c-linen)", border:"1px solid var(--c-border)", color:"var(--c-text-1)", fontSize:"0.88rem", borderRadius:0 }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={add} disabled={!title.trim()} className="btn-outline-dark flex-1 justify-center disabled:opacity-30">
                        <span>+ Agregar</span>
                      </button>
                      {songs.length > 0 && (
                        <button onClick={send} className="btn-wine">
                          <span>Enviar {songs.length > 1 ? `(${songs.length})` : ""}</span>
                        </button>
                      )}
                    </div>

                    {/* Added songs list */}
                    <AnimatePresence>
                      {songs.length > 0 && (
                        <motion.div initial={{ height:0,opacity:0 }} animate={{ height:"auto",opacity:1 }} exit={{ height:0,opacity:0 }}
                          className="overflow-hidden mt-4">
                          <p className="t-eye mb-2" style={{ color:"var(--c-text-3)", fontSize:"0.58rem" }}>Tu lista:</p>
                          <div className="space-y-1.5">
                            {songs.map((s,i) => (
                              <motion.div key={i}
                                initial={{ opacity:0,x:-12 }} animate={{ opacity:1,x:0 }}
                                className="flex items-center justify-between px-3 py-2"
                                style={{ background:"var(--c-linen)", border:"1px solid var(--c-border)" }}>
                                <div>
                                  <p className="t-body" style={{ fontSize:"0.82rem", color:"var(--c-text-1)" }}>🎵 {s.title}</p>
                                  {s.artist && <p className="t-body" style={{ fontSize:"0.72rem", color:"var(--c-text-3)" }}>{s.artist}</p>}
                                </div>
                                <button onClick={() => remove(i)} style={{ color:"var(--c-text-3)", fontSize:"0.75rem", opacity:0.6 }}>✕</button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="sent" initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }}
                  className="card-light p-6 text-center">
                  <div className="text-3xl mb-3">🎶</div>
                  <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"1.1rem", color:"var(--c-text-1)", marginBottom:"0.4rem" }}>
                    ¡Gracias!
                  </p>
                  <p className="t-body" style={{ color:"var(--c-text-3)", fontSize:"0.82rem" }}>
                    {songs.length > 0 ? `Recibimos tus ${songs.length} canciones` : "Recibimos tu sugerencia"}. Las tendremos en cuenta 🎵
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right — suggestions */}
          <motion.div initial={{ opacity:0,x:24 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:0.38 }}>
            <p className="t-eye mb-4" style={{ color:"var(--c-text-3)" }}>Ideas para inspirarte</p>
            <div className="space-y-2">
              {SUGGESTED_SONGS.map((s,i) => (
                <motion.button key={i}
                  initial={{ opacity:0,x:16 }} animate={v?{opacity:1,x:0}:{}} transition={{ delay:0.42+i*0.07 }}
                  onClick={() => suggest(s)}
                  disabled={!!songs.find(x => x.title===s.title)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 disabled:opacity-40"
                  style={{ border:"1px solid var(--c-border)", background:"transparent" }}>
                  <span style={{ fontSize:"1.3rem" }}>{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="t-body" style={{ fontSize:"0.88rem", color:"var(--c-text-1)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</p>
                    <p className="t-body" style={{ fontSize:"0.75rem", color:"var(--c-text-3)" }}>{s.artist}</p>
                  </div>
                  <span style={{ color:"var(--c-gold)", fontSize:"0.75rem", flexShrink:0 }}>
                    {songs.find(x => x.title===s.title) ? "✓ Agregada" : "+ Sugerir"}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Animated music note icons */}
            <div className="flex gap-4 mt-8 justify-center">
              {["🎵","🎶","🎸","🎹","🎺"].map((icon,i) => (
                <span key={i} style={{ fontSize:"1.3rem", animationDelay:`${i*0.3}s` }} className="icon-float inline-block">
                  {icon}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
