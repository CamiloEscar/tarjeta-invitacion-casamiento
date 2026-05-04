"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { W } from "@/lib/config";

type Tab = "stats" | "mesas" | "export";

interface Guest {
  nombre: string;
  apellido: string;

  nombre2?: string;
  apellido2?: string;

  acompanantes: number;
  restricciones: string;

  slug: string;
  mesa: string;

  pago?: boolean;
  confirmado?: boolean;
}
interface Summary {
  total: number; si: number; no: number;
  totalPersonas: number; shuttle: number;
  sinMesa: number;
  porDia: { fecha: string; count: number }[];
}

// ─────────────────────────────────────────────────────────────
//  /admin — Panel de administración v2
//  Tab 1: Estadísticas de confirmaciones
//  Tab 2: Asignador de mesas
//  Tab 3: Exportar lista
// ─────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [pin,    setPin]    = useState("");
  const [authed, setAuthed] = useState(false);
  const [pinErr, setPinErr] = useState(false);
  const [tab,    setTab]    = useState<Tab>("stats");

  function checkPin() {
    if (pin === W.adminPin) { setAuthed(true); setPinErr(false); }
    else { setPinErr(true); setPin(""); }
  }

  if (!authed) return <PinScreen pin={pin} setPin={setPin} onCheck={checkPin} error={pinErr} />;
  return <Dashboard tab={tab} setTab={setTab} />;
}

// ── PIN Screen ────────────────────────────────────────────────
function PinScreen({ pin, setPin, onCheck, error }: {
  pin: string; setPin: (v: string) => void;
  onCheck: () => void; error: boolean;
}) {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--c-dark)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      // Subtle background pattern
      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(181,137,78,0.04) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(181,137,78,0.03) 0%, transparent 40%)`,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 360, textAlign: "center" }}
      >
        {/* Logo ornament */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(181,137,78,0.12) 0%, rgba(181,137,78,0.04) 100%)",
            border: "1px solid rgba(181,137,78,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            fontSize: "1.6rem",
          }}>
            🔐
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.75rem",
            maxWidth: 220,
            margin: "0 auto 0.75rem",
          }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(181,137,78,0.25))" }} />
            <span style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.48rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(181,137,78,0.4)",
              whiteSpace: "nowrap",
            }}>Panel Admin</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(181,137,78,0.25))" }} />
          </div>

          <h2 style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: "1.6rem",
            color: "var(--c-text-inv)",
            marginBottom: "0.25rem",
            lineHeight: 1.2,
          }}>
            {W.bride} &amp; {W.groom}
          </h2>
          <p style={{
            fontFamily: "var(--font-jost)",
            fontSize: "0.68rem",
            color: "rgba(154,128,104,0.35)",
            fontWeight: 300,
          }}>
            Ingresá el PIN para continuar
          </p>
        </div>

        {/* PIN input */}
        <div style={{ position: "relative", marginBottom: "0.5rem" }}>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={e => { setPin(e.target.value); }}
            onKeyDown={e => e.key === "Enter" && onCheck()}
            placeholder="····"
            maxLength={8}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${error ? "rgba(200,80,80,0.45)" : "rgba(181,137,78,0.18)"}`,
              padding: "1.1rem",
              fontFamily: "var(--font-playfair)",
              fontSize: "2.4rem",
              color: "var(--c-gold-lt)",
              textAlign: "center",
              outline: "none",
              letterSpacing: "0.5em",
              transition: "border-color 0.25s, background 0.25s",
              boxSizing: "border-box",
            }}
            onFocus={e => { e.target.style.background = "rgba(181,137,78,0.05)"; }}
            onBlur={e => { e.target.style.background = "rgba(255,255,255,0.04)"; }}
          />
          {/* Focus accent line */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            right: "10%",
            height: "2px",
            background: "linear-gradient(to right, transparent, var(--c-gold), transparent)",
            opacity: 0.3,
          }} />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.7rem",
                color: "#ef9a9a",
                marginBottom: "0.6rem",
              }}
            >
              PIN incorrecto — intentá de nuevo
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={onCheck}
          disabled={!pin}
          style={{
            width: "100%",
            background: pin ? "var(--c-wine)" : "rgba(181,137,78,0.06)",
            border: `1px solid ${pin ? "var(--c-wine-lt)" : "rgba(181,137,78,0.1)"}`,
            padding: "0.95rem",
            fontFamily: "var(--font-jost)",
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: pin ? "white" : "rgba(181,137,78,0.2)",
            cursor: pin ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            marginBottom: "1.25rem",
          }}
        >
          Ingresar
        </button>

        <a href="/" style={{
          fontFamily: "var(--font-jost)",
          fontSize: "0.52rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(154,128,104,0.28)",
          textDecoration: "none",
          transition: "color 0.2s",
        }}>
          ← Volver al sitio
        </a>
      </motion.div>
    </div>
  );
}

function getGuestDisplayName(guest: Guest) {
  const main = `${guest.nombre} ${guest.apellido}`.trim();

  if (guest.nombre2 || guest.apellido2) {
    const second = `${guest.nombre2 ?? ""} ${guest.apellido2 ?? ""}`.trim();
    return `${main} & ${second}`;
  }

  return main;
}

function getInvitationUrl(guest: Guest) {
  const params = new URLSearchParams({
    slug: guest.slug,
    nombre: guest.nombre,
    apellido: guest.apellido,
  });

  if (guest.nombre2) {
    params.append("nombre2", guest.nombre2);
  }

  if (guest.apellido2) {
    params.append("apellido2", guest.apellido2);
  }

  return `/print?${params.toString()}`;
}

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: "stats",  icon: "📊", label: "Stats"  },
    { id: "mesas",  icon: "🪑", label: "Mesas"  },
    { id: "export", icon: "📋", label: "Lista"  },
  ];

  const externalLinks = [
    { href: "/live",  icon: "🖥",  label: "Pantalla"     },
    { href: "/print", icon: "🖨️", label: "Invitaciones" },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#0d0906", fontFamily: "var(--font-jost)" }}>

      {/* ── Top bar ── */}
      <div style={{
        background: "var(--c-dark)",
        borderBottom: "1px solid rgba(181,137,78,0.08)",
        padding: "0 1.25rem",
        display: "flex",
        alignItems: "center",
        height: 52,
        gap: "1rem",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <a href="/" style={{
          fontSize: "0.52rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(181,137,78,0.32)",
          textDecoration: "none",
          flexShrink: 0,
        }}>
          ← Inicio
        </a>

        <p style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: "0.85rem",
          color: "rgba(196,168,130,0.5)",
          flex: 1,
          textAlign: "center",
        }}>
          {W.bride} &amp; {W.groom}
        </p>

        {/* External links */}
        <div style={{ display: "flex", gap: "0.2rem", flexShrink: 0, borderRight: "1px solid rgba(181,137,78,0.1)", paddingRight: "0.5rem", marginRight: "0.15rem" }}>
          {externalLinks.map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.52rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.28rem 0.55rem",
                background: "transparent",
                border: "1px solid rgba(181,137,78,0.1)",
                color: "rgba(181,137,78,0.28)",
                cursor: "pointer",
                transition: "all 0.2s",
                borderRadius: 2,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </div>

        {/* Tab pills */}
        <div style={{ display: "flex", gap: "0.2rem", flexShrink: 0 }}>
          {tabs.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.52rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.28rem 0.55rem",
                background: tab === id ? "rgba(181,137,78,0.15)" : "transparent",
                border: `1px solid ${tab === id ? "rgba(181,137,78,0.4)" : "rgba(181,137,78,0.1)"}`,
                color: tab === id ? "var(--c-gold-lt)" : "rgba(181,137,78,0.3)",
                cursor: "pointer",
                transition: "all 0.2s",
                borderRadius: 2,
              }}
            >
              <span style={{ marginRight: "0.3rem" }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>
        <AnimatePresence mode="wait">
          {tab === "stats" && (
            <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <StatsTab />
            </motion.div>
          )}
          {tab === "mesas" && (
            <motion.div key="mesas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <MesasTab />
            </motion.div>
          )}
          {tab === "export" && (
            <motion.div key="export" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <ExportTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`@keyframes adminSpin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Stats Tab ─────────────────────────────────────────────────
function StatsTab() {
  const [summary,   setSummary]   = useState<Summary | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/mesas?action=summary");
      const data = await res.json();
      setSummary(data);
      setLastFetch(new Date());
    } catch {
      setError("No se pudo obtener datos. Verificá la configuración del Apps Script.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Section header */}
      <SectionHeader
        title="Confirmaciones"
        subtitle={lastFetch ? `Actualizado ${lastFetch.toLocaleTimeString("es-AR")}` : ""}
        action={<RefreshButton onClick={load} />}
      />

      {error && <ErrorBanner message={error} />}

      {summary && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

          {/* Hero stat */}
          <div style={{
            padding: "2.5rem 2rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(181,137,78,0.18)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(to right, transparent, var(--c-wine), var(--c-gold), transparent)",
            }} />
            {/* Glow */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: "80%", height: "80%",
              background: "radial-gradient(circle, rgba(181,137,78,0.04) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.5rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(181,137,78,0.4)",
              marginBottom: "0.6rem",
            }}>
              Total de personas confirmadas
            </p>
            <motion.p
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(4rem, 14vw, 6.5rem)",
                color: "var(--c-gold-lt)",
                lineHeight: 1,
              }}
            >
              {summary.totalPersonas}
            </motion.p>
            <p style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.62rem",
              color: "rgba(154,128,104,0.3)",
              fontWeight: 300,
              marginTop: "0.4rem",
            }}>
              personas en total
            </p>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
            <StatCard emoji="✅" label="Asisten"        value={summary.si}           color="#81c784" />
            <StatCard emoji="❌" label="No asisten"     value={summary.no}           color="#ef9a9a" />
            <StatCard emoji="🚌" label="Necesitan auto" value={summary.shuttle}      color="var(--c-gold-lt)" />
            <StatCard emoji="🪑" label="Sin mesa aún"   value={summary.sinMesa ?? 0} color="rgba(207,168,112,0.55)" />
          </div>

          {/* Donut-ish progress: % asistencia */}
          {summary.total > 0 && (
            <div style={{
              padding: "1.25rem 1.5rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(181,137,78,0.1)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <p style={{ fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(181,137,78,0.38)" }}>
                  Tasa de confirmación
                </p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", color: "var(--c-gold-lt)" }}>
                  {Math.round((summary.si / summary.total) * 100)}%
                </p>
              </div>
              <div style={{ height: 6, background: "rgba(181,137,78,0.08)", overflow: "hidden", borderRadius: 3 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(summary.si / summary.total) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(to right, var(--c-wine), var(--c-gold))",
                    borderRadius: 3,
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
                <span style={{ fontSize: "0.6rem", color: "rgba(154,128,104,0.3)" }}>0</span>
                <span style={{ fontSize: "0.6rem", color: "rgba(154,128,104,0.3)" }}>{summary.total} enviadas</span>
              </div>
            </div>
          )}

          {/* Por día */}
          {(summary.porDia ?? []).length > 0 && (
            <div style={{
              padding: "1.4rem 1.5rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(181,137,78,0.1)",
            }}>
              <p style={{ fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(181,137,78,0.38)", marginBottom: "1.1rem" }}>
                Respuestas por día
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(summary.porDia ?? []).map((d, i) => {
                  const max = Math.max(...(summary.porDia ?? []).map(x => x.count));
                  const pct = max > 0 ? (d.count / max) * 100 : 0;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.62rem", color: "rgba(154,128,104,0.4)", minWidth: "4.5rem", fontWeight: 300 }}>
                        {d.fecha}
                      </span>
                      <div style={{ flex: 1, height: 4, background: "rgba(181,137,78,0.08)", overflow: "hidden", borderRadius: 2 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.1 + i * 0.04, duration: 0.5 }}
                          style={{ height: "100%", background: "var(--c-gold)", borderRadius: 2 }}
                        />
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--c-gold-lt)", minWidth: "1.5rem", textAlign: "right" }}>
                        {d.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  return (
    <div style={{
      padding: "1.25rem 1rem",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(181,137,78,0.1)",
      textAlign: "center",
    }}>
      <p style={{ fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(181,137,78,0.35)", marginBottom: "0.45rem" }}>
        {emoji} {label}
      </p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 7vw, 2.8rem)", color, lineHeight: 1 }}
      >
        {value}
      </motion.p>
    </div>
  );
}

// ── Mesas Tab ─────────────────────────────────────────────────
function MesasTab() {
  const [guests,  setGuests]  = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [saving,  setSaving]  = useState<string | null>(null);
  const [saved,   setSaved]   = useState<string | null>(null);
  const [edits,   setEdits]   = useState<Record<string, string>>({});
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<"all" | "sin-mesa" | "con-mesa">("all");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/mesas?action=getGuests");
      const data = await res.json();
      const g: Guest[] = data.guests || [];
      setGuests(g);
      const initial: Record<string, string> = {};
      g.forEach(guest => { initial[guest.slug] = guest.mesa || ""; });
      setEdits(initial);
    } catch {
      setError("No se pudieron cargar los invitados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveMesa(slug: string) {
    const mesa = (edits[slug] ?? "").trim();
    setSaving(slug);
    try {
      const res  = await fetch("/api/mesas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, mesa }),
      });
      const data = await res.json();
      if (data.status === "ok" || data.message) {
        setGuests(prev => prev.map(g => g.slug === slug ? { ...g, mesa } : g));
        setSaved(slug);
        setTimeout(() => setSaved(null), 2200);
      } else {
        setError(data.error || "Error al guardar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(null);
    }
  }

  async function deleteGuest(slug: string) {
  const ok = confirm("¿Eliminar invitado?");

  if (!ok) return;

  try {
    const res = await fetch("/api/mesas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "deleteGuest",
        slug,
      }),
    });

    const data = await res.json();

    if (data.status === "ok") {
      setGuests(prev => prev.filter(g => g.slug !== slug));
    }
  } catch {
    setError("No se pudo eliminar");
  }
}

async function toggleFlag(
  guest: Guest,
  field: "pago" | "confirmado"
) {
  const value = !guest[field];

  setGuests(prev =>
    prev.map(g =>
      g.slug === guest.slug
        ? { ...g, [field]: value }
        : g
    )
  );

  try {
    await fetch("/api/mesas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateFlags",
        slug: guest.slug,
        [field]: value,
      }),
    });
  } catch {
    setError("No se pudo actualizar");
  }
}

  async function saveAll() {
    const unsaved = guests.filter(g => (edits[g.slug] ?? "").trim() !== g.mesa);
    for (const g of unsaved) await saveMesa(g.slug);
  }

  const filtered = guests.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      getGuestDisplayName(g).toLowerCase().includes(q) ||
      g.mesa.toLowerCase().includes(q) ||
      (edits[g.slug] || "").toLowerCase().includes(q);
    const matchFilter =
      filter === "all"      ? true :
      filter === "sin-mesa" ? !g.mesa :
      Boolean(g.mesa);
    return matchSearch && matchFilter;
  });

  const totalPersonas = guests.reduce((s, g) => s + 1 + g.acompanantes, 0);
  const sinMesa = guests.filter(g => !g.mesa).length;
  const dirty   = guests.filter(g => String(edits[g.slug] ?? "").trim() !== String(g.mesa ?? "")).length;

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Asignación de mesas"
        subtitle={`${guests.length} invitados · ${totalPersonas} personas · ${sinMesa} sin mesa`}
        action={
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            {dirty > 0 && (
              <button onClick={saveAll} style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.56rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "0.38rem 0.75rem",
                background: "var(--c-wine)",
                border: "1px solid var(--c-wine-lt)",
                color: "white",
                cursor: "pointer",
              }}>
                Guardar todos ({dirty})
              </button>
            )}
            <RefreshButton onClick={load} />
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar invitado o mesa..."
          style={{
            flex: 1,
            minWidth: 160,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(181,137,78,0.15)",
            padding: "0.55rem 0.85rem",
            fontFamily: "var(--font-jost)",
            fontSize: "0.82rem",
            color: "var(--c-text-inv)",
            outline: "none",
          }}
        />
        {(["all", "sin-mesa", "con-mesa"] as const).map(f => {
          const labels = { all: "Todos", "sin-mesa": "Sin mesa", "con-mesa": "Con mesa" };
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.5rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.38rem 0.65rem",
              background: filter === f ? "rgba(181,137,78,0.12)" : "transparent",
              border: `1px solid ${filter === f ? "rgba(181,137,78,0.4)" : "rgba(181,137,78,0.12)"}`,
              color: filter === f ? "var(--c-gold-lt)" : "rgba(181,137,78,0.32)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Guest list */}
      {filtered.length === 0 && (
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(154,128,104,0.3)", padding: "3rem" }}>
          {guests.length === 0 ? "Todavía no hay invitados confirmados." : "No hay invitados que coincidan."}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {filtered.map((guest, idx) => {
          const isSaving = saving === guest.slug;
          const wasSaved = saved === guest.slug;
          const draft    = edits[guest.slug] ?? guest.mesa ?? "";
          const isDirty  = String(draft).trim() !== String(guest.mesa ?? "");

          return (
            <motion.div
              key={guest.slug}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02, duration: 0.25 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.7rem 0.85rem",
                background: isDirty ? "rgba(181,137,78,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isDirty ? "rgba(181,137,78,0.25)" : "rgba(181,137,78,0.08)"}`,
                transition: "all 0.2s",
              }}
            >
              {/* Number badge */}
              <span style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.58rem",
                color: "rgba(181,137,78,0.2)",
                minWidth: "1.5rem",
                textAlign: "right",
                flexShrink: 0,
                fontWeight: 300,
              }}>
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Guest info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: "0.9rem",
                  color: "var(--c-text-inv)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {getGuestDisplayName(guest)}
                  {guest.acompanantes > 0 && (
                    <span style={{ fontSize: "0.65rem", color: "rgba(181,137,78,0.4)", marginLeft: "0.4rem" }}>
                      +{guest.acompanantes}
                    </span>
                  )}
                </p>
                {guest.restricciones && (
                  <p style={{ fontSize: "0.6rem", color: "rgba(239,154,154,0.5)", fontWeight: 300, marginTop: "0.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    ⚠ {guest.restricciones}
                  </p>
                )}
              </div>

              <div style={{
                  display: "flex",
                  gap: "0.6rem",
                  marginTop: "0.3rem",
                  color: draft ? "var(--c-gold-lt)" : "rgba(154,128,104,0.38)",
                }}>
                  <label style={{ fontSize: "0.6rem"}}>
                    <input
                      type="checkbox"
                      checked={guest.confirmado}
                      onChange={() => toggleFlag(guest, "confirmado")}
                    />
                    Confirmó
                  </label>

                  <label style={{ fontSize: "0.6rem" }}>
                    <input
                      type="checkbox"
                      checked={guest.pago}
                      onChange={() => toggleFlag(guest, "pago")}
                    />
                    Pagó
                  </label>
                </div>

              {/* Mesa input */}
              <input
                value={draft}
                onChange={e => setEdits(prev => ({ ...prev, [guest.slug]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && saveMesa(guest.slug)}
                placeholder="Mesa #"
                style={{
                  width: "clamp(80px, 20vw, 130px)",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${isDirty ? "rgba(181,137,78,0.35)" : "rgba(181,137,78,0.12)"}`,
                  padding: "0.42rem 0.6rem",
                  fontFamily: "var(--font-jost)",
                  fontSize: "0.82rem",
                  color: draft ? "var(--c-gold-lt)" : "rgba(154,128,104,0.38)",
                  outline: "none",
                  textAlign: "center",
                  transition: "border-color 0.2s, color 0.2s",
                }}
              />
              <a
                href={getInvitationUrl(guest)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.7rem",
                  color: "var(--c-gold-lt)",
                  textDecoration: "none",
                  border: "1px solid rgba(181,137,78,0.2)",
                  padding: "0.35rem 0.55rem",
                  whiteSpace: "nowrap",
                }}
              >
                🖨 Ver
              </a>

              <button
                onClick={() => deleteGuest(guest.slug)}
                style={{
                  width: 30,
                  height: 30,
                  background: "rgba(200,50,50,0.1)",
                  border: "1px solid rgba(200,50,50,0.3)",
                  color: "#ef9a9a",
                  cursor: "pointer",
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              >
                🗑
              </button>

              {/* Save button */}
              <button
                onClick={() => saveMesa(guest.slug)}
                disabled={isSaving || !isDirty}
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: wasSaved
                    ? "rgba(76,175,80,0.15)"
                    : isDirty
                    ? "var(--c-wine)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${wasSaved ? "rgba(76,175,80,0.35)" : isDirty ? "rgba(150,40,40,0.5)" : "rgba(181,137,78,0.08)"}`,
                  cursor: isDirty && !isSaving ? "pointer" : "default",
                  opacity: !isDirty && !wasSaved ? 0.25 : 1,
                  transition: "all 0.2s",
                  borderRadius: 2,
                }}
              >
                {isSaving ? (
                  <svg style={{ animation: "adminSpin 0.7s linear infinite" }} width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="var(--c-gold)" strokeWidth="3" opacity=".2"/>
                    <path fill="var(--c-gold)" d="M4 12a8 8 0 018-8v8z" opacity=".7"/>
                  </svg>
                ) : wasSaved ? (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5l2.8 2.8 5-5" stroke="#81c784" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5h6M5.5 2.5l2 2-2 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {guests.length > 0 && (
        <p style={{
          fontSize: "0.58rem",
          color: "rgba(154,128,104,0.25)",
          textAlign: "center",
          marginTop: "1.5rem",
          lineHeight: 1.7,
        }}>
          Enter o → para guardar · Los cambios se guardan en Google Sheets
        </p>
      )}
    </div>
  );
}

// ── Export Tab ─────────────────────────────────────────────────
function ExportTab() {
  const [guests,  setGuests]  = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    fetch("/api/mesas?action=getGuests")
      .then(r => r.json())
      .then(d => { setGuests(d.guests || []); })
      .catch(() => setError("Error al cargar"))
      .finally(() => setLoading(false));
  }, []);

  function exportCSV() {
    const header = "Nombre,Acompañantes,Mesa,Restricciones";
    const rows = guests.map(g =>
      `""${getGuestDisplayName(g)}"",${g.acompanantes},"${g.mesa || "—"}","${g.restricciones || ""}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "invitados.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function copyList() {
    const text = guests.map(g => `${getGuestDisplayName(g)}${g.acompanantes > 0 ? ` +${g.acompanantes}` : ""} — ${g.mesa || "sin mesa"}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) return <Spinner />;

  // Group by mesa
  const byMesa: Record<string, Guest[]> = {};
  guests.forEach(g => {
    const key = g.mesa || "Sin mesa asignada";
    if (!byMesa[key]) byMesa[key] = [];
    byMesa[key].push(g);
  });
  const mesaKeys = Object.keys(byMesa).sort((a, b) => {
    if (a === "Sin mesa asignada") return 1;
    if (b === "Sin mesa asignada") return -1;
    return a.localeCompare(b, "es", { numeric: true });
  });

  return (
    <div>
      <SectionHeader
        title="Lista completa"
        subtitle={`${guests.length} invitados · ${mesaKeys.length} mesas`}
        action={
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button onClick={copyList} style={exportBtnStyle(copied ? "green" : "gold")}>
              {copied ? "✓ Copiado" : "📋 Copiar"}
            </button>
            <button onClick={exportCSV} style={exportBtnStyle("wine")}>
              ⬇ CSV
            </button>
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {mesaKeys.map(mesa => {
          const list = byMesa[mesa];
          const totalPersonas = list.reduce((s, g) => s + 1 + g.acompanantes, 0);
          const isSin = mesa === "Sin mesa asignada";

          return (
            <div key={mesa} style={{
              border: `1px solid ${isSin ? "rgba(200,80,80,0.15)" : "rgba(181,137,78,0.12)"}`,
              overflow: "hidden",
            }}>
              {/* Mesa header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.7rem 1rem",
                background: isSin ? "rgba(200,80,80,0.05)" : "rgba(181,137,78,0.06)",
                borderBottom: `1px solid ${isSin ? "rgba(200,80,80,0.1)" : "rgba(181,137,78,0.1)"}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "0.9rem" }}>{isSin ? "⚠️" : "🪑"}</span>
                  <span style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    color: isSin ? "rgba(239,154,154,0.7)" : "var(--c-gold-lt)",
                  }}>
                    {mesa}
                  </span>
                </div>
                <span style={{ fontSize: "0.56rem", color: "rgba(154,128,104,0.4)", letterSpacing: "0.1em" }}>
                  {totalPersonas} personas
                </span>
              </div>

              {/* Guests */}
              {list.map((g, i) => (
                <div key={g.slug} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 1rem",
                  borderBottom: i < list.length - 1 ? "1px solid rgba(181,137,78,0.05)" : "none",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}>
                  <span style={{ fontSize: "0.84rem", color: "rgba(196,168,130,0.75)" }}>
                    {getGuestDisplayName(g)}
                    {g.acompanantes > 0 && (
                      <span style={{ fontSize: "0.65rem", color: "rgba(181,137,78,0.35)", marginLeft: "0.35rem" }}>
                        +{g.acompanantes}
                      </span>
                    )}
                  </span>
                  {g.restricciones && (
                    <span style={{ fontSize: "0.58rem", color: "rgba(239,154,154,0.45)" }}>
                      ⚠ {g.restricciones}
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function exportBtnStyle(color: "gold" | "wine" | "green") {
  const colors = {
    gold:  { bg: "rgba(181,137,78,0.1)",  border: "rgba(181,137,78,0.3)",  text: "var(--c-gold-lt)" },
    wine:  { bg: "var(--c-wine)",          border: "var(--c-wine-lt)",       text: "white" },
    green: { bg: "rgba(76,175,80,0.15)",   border: "rgba(76,175,80,0.35)",   text: "#81c784" },
  };
  const c = colors[color];
  return {
    fontFamily: "var(--font-jost)",
    fontSize: "0.52rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    padding: "0.38rem 0.65rem",
    background: c.bg,
    border: `1px solid ${c.border}`,
    color: c.text,
    cursor: "pointer",
    transition: "all 0.2s",
  };
}

// ── Shared UI helpers ─────────────────────────────────────────
function SectionHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "1.25rem",
      gap: "0.75rem",
      flexWrap: "wrap",
    }}>
      <div>
        <h2 style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: "1.2rem",
          color: "var(--c-text-inv)",
          marginBottom: subtitle ? "0.2rem" : 0,
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: "0.62rem", color: "rgba(154,128,104,0.4)", fontWeight: 300 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "var(--font-jost)",
      fontSize: "0.52rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      padding: "0.38rem 0.6rem",
      background: "transparent",
      border: "1px solid rgba(181,137,78,0.15)",
      color: "rgba(181,137,78,0.38)",
      cursor: "pointer",
      transition: "all 0.2s",
    }}>
      ↻
    </button>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{
        width: 24,
        height: 24,
        border: "2px solid rgba(181,137,78,0.15)",
        borderTopColor: "var(--c-gold)",
        borderRadius: "50%",
        animation: "adminSpin 0.8s linear infinite",
        margin: "0 auto 1rem",
      }} />
      <p style={{ fontSize: "0.65rem", color: "rgba(154,128,104,0.35)", letterSpacing: "0.1em" }}>
        Cargando...
      </p>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div style={{
      padding: "0.85rem 1rem",
      background: "rgba(200,50,50,0.07)",
      border: "1px solid rgba(200,50,50,0.18)",
      marginBottom: "1rem",
      fontSize: "0.72rem",
      color: "#ef9a9a",
      lineHeight: 1.65,
    }}>
      {message}
    </div>
  );
}