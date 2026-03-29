"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
//  /live/cam — Camera broadcaster
//
//  FLOW:
//  1. /live opens "📷 Cámara" modal → shows ITS peer ID + QR
//  2. QR encodes: /live/cam?room=<live-peer-id>
//  3. This page opens on the phone with room= pre-loaded
//  4. Phone starts camera, calls the live page's peer ID
//  5. Live page receives the call and shows it fullscreen
// ─────────────────────────────────────────────────────────────

type Status = "idle" | "requesting" | "streaming" | "error" | "done";

export default function CamPage() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef   = useRef<any>(null);
  const callRef   = useRef<any>(null);

  const [status,  setStatus]  = useState<Status>("idle");
  const [roomId,  setRoomId]  = useState(""); // the /live receiver's peer ID
  const [facing,  setFacing]  = useState<"user" | "environment">("environment");
  const [muted,   setMuted]   = useState(false);
  const [errMsg,  setErrMsg]  = useState("");
  const [loaded,  setLoaded]  = useState(false);
  const [connected, setConnected] = useState(false);

  // Load PeerJS from CDN
  useEffect(() => {
    if ((window as any).Peer) { setLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";
    s.onload = () => setLoaded(true);
    s.onerror = () => setErrMsg("No se pudo cargar. Verificá tu conexión a internet.");
    document.head.appendChild(s);
  }, []);

  // Read room= from URL
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("room");
    if (r) setRoomId(r);
  }, []);

  async function startStream() {
    if (!loaded) return;
    setStatus("requesting");
    setErrMsg("");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
    } catch (e: any) {
      const msg = e.name === "NotAllowedError"
        ? "Permiso de cámara denegado. Habilitalo en la configuración del celu."
        : `No se pudo acceder a la cámara: ${e.message}`;
      setErrMsg(msg);
      setStatus("error");
      return;
    }

    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
    }

    // Create a fresh peer (random ID — the cam side doesn't need stable ID)
    const Peer = (window as any).Peer;
    const peer = new Peer({ debug: 0 });
    peerRef.current = peer;

    peer.on("open", () => {
      setStatus("streaming");
      // If we already have the room ID, call immediately
      if (roomId.trim()) {
        doCall(peer, stream, roomId.trim());
      }
    });

    peer.on("error", (e: any) => {
      setErrMsg(`Error de conexión: ${e.type || e.message}`);
      setStatus("error");
    });
  }

  function doCall(peer: any, stream: MediaStream, targetId: string) {
    // Close any existing call
    if (callRef.current) {
      try { callRef.current.close(); } catch {}
    }
    const call = peer.call(targetId, stream);
    callRef.current = call;
    call.on("stream", () => setConnected(true));
    call.on("close", () => setConnected(false));
    call.on("error", () => setErrMsg("La conexión con la pantalla se cortó."));
  }

  function connect() {
    if (!peerRef.current || !streamRef.current || !roomId.trim()) return;
    doCall(peerRef.current, streamRef.current, roomId.trim());
  }

  async function flipCamera() {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    if (status !== "streaming" || !streamRef.current) return;

    streamRef.current.getTracks().forEach(t => t.stop());
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = newStream;
      if (videoRef.current) videoRef.current.srcObject = newStream;
      if (roomId.trim() && peerRef.current) doCall(peerRef.current, newStream, roomId.trim());
    } catch {}
  }

  function toggleMute() {
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setMuted(m => !m);
  }

  function stop() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    try { peerRef.current?.destroy(); } catch {}
    streamRef.current = null;
    peerRef.current   = null;
    callRef.current   = null;
    setStatus("done");
    setConnected(false);
  }

  return (
    <div style={{ minHeight:"100dvh", background:"#080503", color:"#EEE2D2", fontFamily:"var(--font-jost)", display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1rem 1.25rem", borderBottom:"1px solid rgba(181,137,78,0.1)" }}>
        <a href="/live" style={{ fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.4)" }}>← Pantalla</a>
        <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontSize:"0.92rem", color:"rgba(240,232,218,0.6)" }}>
          Transmitir cámara
        </p>
        <div style={{ width:"3rem" }} />
      </div>

      <div style={{ flex:1, padding:"1.5rem 1.25rem", maxWidth:480, width:"100%", margin:"0 auto", display:"flex", flexDirection:"column", gap:"1rem" }}>

        {/* Status badge */}
        <div style={{ display:"flex", justifyContent:"center" }}>
          <span style={{
            fontFamily:"var(--font-jost)", fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase",
            padding:"0.28rem 0.85rem", borderRadius:9999,
            background: connected?"rgba(76,175,80,0.12)":status==="streaming"?"rgba(181,137,78,0.1)":status==="error"?"rgba(200,50,50,0.1)":"rgba(255,255,255,0.05)",
            border:`1px solid ${connected?"rgba(76,175,80,0.35)":status==="streaming"?"rgba(181,137,78,0.25)":status==="error"?"rgba(200,50,50,0.35)":"rgba(181,137,78,0.15)"}`,
            color: connected?"#81c784":status==="streaming"?"rgba(181,137,78,0.7)":status==="error"?"#ef9a9a":"rgba(181,137,78,0.5)",
            display:"flex", alignItems:"center", gap:"0.45rem",
          }}>
            {connected && <span style={{ width:6, height:6, borderRadius:"50%", background:"#66bb6a", animation:"livepulse 1.5s ease-in-out infinite" }} />}
            {status==="idle"      && "Listo para transmitir"}
            {status==="requesting"&& "Solicitando permisos..."}
            {status==="streaming" && !connected && "Transmitiendo — esperando pantalla"}
            {status==="streaming" && connected  && "Conectado a la pantalla ✓"}
            {status==="error"     && "Error"}
            {status==="done"      && "Transmisión finalizada"}
          </span>
        </div>

        {/* Preview */}
        <div style={{ position:"relative", background:"#0E0805", aspectRatio:"16/9", overflow:"hidden", border:"1px solid rgba(181,137,78,0.1)" }}>
          <video ref={videoRef} autoPlay playsInline muted
            style={{ width:"100%", height:"100%", objectFit:"cover", display:status==="streaming"?"block":"none" }} />
          {status !== "streaming" && (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.5rem" }}>
              <span style={{ fontSize:"2.2rem", opacity:0.15 }}>📷</span>
              <span style={{ fontSize:"0.66rem", color:"rgba(154,128,104,0.3)", letterSpacing:"0.12em" }}>Vista previa</span>
            </div>
          )}
          {status==="streaming" && (
            <div style={{ position:"absolute", top:"0.6rem", left:"0.6rem", display:"flex", alignItems:"center", gap:"0.35rem", background:"rgba(200,40,40,0.85)", padding:"0.2rem 0.55rem", borderRadius:2 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"white", animation:"livepulse 1s ease-in-out infinite" }} />
              <span style={{ fontSize:"0.5rem", fontWeight:500, letterSpacing:"0.1em", color:"white" }}>LIVE</span>
            </div>
          )}
        </div>

        {/* Room ID input */}
        <div>
          <p style={{ fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.4)", marginBottom:"0.45rem" }}>
            ID de la pantalla (/live)
          </p>
          <div style={{ display:"flex", gap:"0.5rem" }}>
            <input value={roomId} onChange={e => setRoomId(e.target.value)}
              placeholder="Se carga automático al escanear el QR"
              style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(181,137,78,0.18)", padding:"0.7rem 0.75rem", fontSize:"0.8rem", color:"var(--c-text-inv)", fontFamily:"var(--font-jost)", outline:"none" }} />
            {status==="streaming" && roomId.trim() && !connected && (
              <button onClick={connect}
                style={{ background:"rgba(181,137,78,0.15)", border:"1px solid rgba(181,137,78,0.3)", padding:"0.7rem 0.85rem", fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--c-gold-lt)", cursor:"pointer", whiteSpace:"nowrap" }}>
                Conectar
              </button>
            )}
          </div>
          <p style={{ fontSize:"0.62rem", color:"rgba(154,128,104,0.35)", marginTop:"0.35rem", lineHeight:1.55 }}>
            {roomId ? "ID cargado desde el QR ✓" : "Abrí esta página escaneando el QR de /live para que se complete solo"}
          </p>
        </div>

        {/* Error */}
        {errMsg && (
          <div style={{ padding:"0.75rem 1rem", background:"rgba(200,50,50,0.08)", borderLeft:"2px solid rgba(200,50,50,0.4)", fontSize:"0.76rem", color:"#ef9a9a", lineHeight:1.6 }}>
            {errMsg}
          </div>
        )}

        {/* Actions */}
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {(status==="idle"||status==="error"||status==="done") && (
            <button onClick={startStream} disabled={!loaded}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", background:"var(--c-wine)", border:"none", padding:"1rem", fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--c-text-inv)", cursor:loaded?"pointer":"not-allowed", opacity:loaded?1:0.5 }}>
              📷 {status==="done"?"Transmitir de nuevo":"Iniciar transmisión"}
            </button>
          )}

          {status==="streaming" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.55rem" }}>
              <button onClick={toggleMute}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem", background:muted?"rgba(200,50,50,0.12)":"rgba(255,255,255,0.04)", border:`1px solid ${muted?"rgba(200,80,80,0.38)":"rgba(181,137,78,0.16)"}`, padding:"0.82rem", fontSize:"0.6rem", letterSpacing:"0.14em", textTransform:"uppercase", color:muted?"#ef9a9a":"rgba(181,137,78,0.65)", cursor:"pointer" }}>
                {muted?"🔇 Silenciado":"🎙 Audio activo"}
              </button>
              <button onClick={flipCamera}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(181,137,78,0.16)", padding:"0.82rem", fontSize:"0.6rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(181,137,78,0.65)", cursor:"pointer" }}>
                🔄 Rotar cámara
              </button>
            </div>
          )}

          {status==="streaming" && (
            <button onClick={stop}
              style={{ background:"rgba(200,50,50,0.1)", border:"1px solid rgba(200,50,50,0.25)", padding:"0.82rem", fontSize:"0.6rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"#ef9a9a", cursor:"pointer" }}>
              ⏹ Detener transmisión
            </button>
          )}
        </div>

        {/* How-to */}
        <div style={{ padding:"1rem 1.25rem", background:"rgba(181,137,78,0.04)", border:"1px solid rgba(181,137,78,0.1)", marginTop:"0.5rem" }}>
          <p style={{ fontSize:"0.56rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(181,137,78,0.38)", marginBottom:"0.65rem" }}>Cómo funciona</p>
          <ol style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"0.45rem" }}>
            {[
              "En la pantalla grande (/live), hacé clic en '📷 Cámara'",
              "Aparece un QR — escanealo con este celu",
              "Esta página se abre con el ID ya cargado",
              "Tocá 'Iniciar transmisión' y concedé permisos de cámara",
              "Tu imagen aparece en la pantalla grande al instante",
            ].map((s,i) => (
              <li key={i} style={{ display:"flex", gap:"0.65rem", fontSize:"0.7rem", color:"rgba(154,128,104,0.5)", lineHeight:1.55 }}>
                <span style={{ color:"rgba(181,137,78,0.45)", minWidth:"1.1rem" }}>{i+1}.</span>{s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.82)} }
      `}</style>
    </div>
  );
}
