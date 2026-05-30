"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { W } from "@/lib/config";

function CopyButton({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2200);
    });
  }

  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: "0.52rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(181,137,78,0.38)",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </p>

      <button
        onClick={copy}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 transition-all duration-200 text-left"
        style={{
          background: "rgba(181,137,78,0.06)",
          border:
            "1px solid rgba(181,137,78,0.16)",
          color: "var(--c-gold-lt)",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.84rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </span>

        <AnimatePresence mode="wait">
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.56rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              flexShrink: 0,
              color: copied
                ? "var(--c-gold-lt)"
                : "rgba(154,128,104,0.45)",
            }}
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

// ── Tipos ───────────────────────────────────────────────
interface GiftItem {
  name: string;
  price: string;
  emoji: string;
  reserved: boolean;
  url: string;
}

export default function GiftsPage() {
  const [gifts, setGifts] = useState<GiftItem[]>(() =>
    // Inicializar con static data del config (fallback si API falla)
    W.giftList.map((g) => ({ ...g, reserved: false }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gifts")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        // La API ya mergea W.giftList + regalos custom + estado reserved
        setGifts(data.items ?? []);
      })
      .catch(() => {
        // Si falla, ya tenemos el fallback del useState inicial
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--c-dark)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(181,137,78,0.06), transparent 40%)",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(12px)",
          background: "rgba(15,15,15,0.75)",
          borderBottom:
            "1px solid rgba(181,137,78,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "1rem 1.4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.58rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(181,137,78,0.45)",
              textDecoration: "none",
            }}
          >
            ← Inicio
          </Link>

          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: "1rem",
              color: "var(--c-text-inv)",
              opacity: 0.75,
            }}
          >
            {W.bride} &amp; {W.groom}
          </p>

          <div style={{ width: 52 }} />
        </div>
      </div>

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "4rem 1.5rem 6rem",
        }}
      >
        {/* Loading skeleton */}
        {loading && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{
              width: 24,
              height: 24,
              border: "2px solid rgba(181,137,78,0.15)",
              borderTopColor: "var(--c-gold)",
              borderRadius: "50%",
              animation: "giftSpin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }} />
            <p style={{ fontSize: "0.65rem", color: "rgba(154,128,104,0.35)" }}>
              Cargando regalos...
            </p>
          </div>
        )}

        {/* Gift List */}
        {!loading && gifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.7,
            }}
            style={{
              marginTop: "4rem",
              marginBottom: "3rem",
            }}
          >
            <div
              className="flex items-center gap-4 mb-7"
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "999px",
                  background:
                    "rgba(181,137,78,0.06)",
                  border:
                    "1px solid rgba(181,137,78,0.14)",
                  fontSize: "1.2rem",
                }}
              >
                🎁
              </div>

              <div>
                <h2
                  style={{
                    fontFamily:
                      "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: "1.5rem",
                    color: "var(--c-text-inv)",
                    marginBottom: "0.15rem",
                  }}
                >
                  Lista de regalos
                </h2>

                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.72rem",
                    color:
                      "rgba(154,128,104,0.45)",
                  }}
                >
                  Algunas ideas para acompañarnos en
                  esta nueva etapa
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {gifts.map((gift, index) => (
                  <motion.div
                    key={gift.name}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2 + index * 0.04,
                    }}
                    style={{
                      padding: "1rem 1.1rem",
                      background: gift.reserved
                        ? "rgba(80,80,80,0.18)"
                        : "rgba(255,255,255,0.03)",
                      border: gift.reserved
                        ? "1px solid rgba(120,120,120,0.25)"
                        : "1px solid rgba(181,137,78,0.12)",
                      filter: gift.reserved ? "grayscale(0.6)" : "none",
                      pointerEvents: gift.reserved ? "none" : undefined,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                      <div
                        className="flex items-center gap-3"
                      >
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: "999px",
                            background: gift.reserved
                              ? "rgba(120,120,120,0.15)"
                              : "rgba(181,137,78,0.05)",
                            border: gift.reserved
                              ? "1px solid rgba(120,120,120,0.2)"
                              : "1px solid rgba(181,137,78,0.1)",
                            fontSize: "1.1rem",
                            flexShrink: 0,
                            filter: gift.reserved ? "grayscale(0.6)" : "none",
                          }}
                        >
                          {gift.emoji}
                        </div>

                        <div>
                          <p
                            style={{
                              fontFamily:
                                "var(--font-jost)",
                              fontSize: "0.9rem",
                              color: gift.reserved
                                ? "rgba(200,200,200,0.45)"
                                : "var(--c-text-inv)",
                              marginBottom:
                                "0.12rem",
                            }}
                          >
                            {gift.name}
                          </p>
                          {gift.url && !gift.reserved && (
                            <a
                              href={gift.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontFamily:
                                  "var(--font-jost)",
                                fontSize: "0.55rem",
                                letterSpacing:
                                  "0.12em",
                                textTransform:
                                  "uppercase",
                                color: "var(--c-gold-lt)",
                                textDecoration:
                                  "none",
                                display:
                                  "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                opacity: 0.7,
                                transition:
                                  "opacity 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity =
                                  "1")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity =
                                  "0.7")
                              }
                            >
                              Ver producto →
                            </a>
                          )}
                          {gift.reserved && (
                            <p style={{
                              fontFamily: "var(--font-cormorant)",
                              fontStyle: "italic",
                              fontSize: "0.7rem",
                              color: "rgba(200,200,200,0.3)",
                              marginTop: "0.1rem",
                            }}>
                              Ya tiene dueño 💕
                            </p>
                          )}
                        </div>
                      </div>

                    <div
                      style={{
                        padding:
                          "0.38rem 0.65rem",
                        background: gift.reserved
                          ? "rgba(120,120,120,0.2)"
                          : "rgba(181,137,78,0.08)",
                        border: gift.reserved
                          ? "1px solid rgba(120,120,120,0.3)"
                          : "1px solid rgba(181,137,78,0.14)",
                        fontFamily:
                          "var(--font-jost)",
                        fontSize: "0.54rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: gift.reserved
                          ? "rgba(200,200,200,0.5)"
                          : "var(--c-gold-lt)",
                        flexShrink: 0,
                      }}
                    >
                      {gift.reserved
                        ? "Reservado"
                        : "Disponible"}
                    </div>
                  </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gift methods */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.28,
            duration: 0.7,
          }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border:
              "1px solid rgba(181,137,78,0.12)",
            padding: "2rem",
          }}
        >
          <div className="text-center mb-8">
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "0.56rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(181,137,78,0.38)",
                marginBottom: "0.8rem",
              }}
            >
              También pueden hacerlo mediante alias
            </p>

            <h3
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontSize: "1.5rem",
                color: "var(--c-text-inv)",
                marginBottom: "0.7rem",
              }}
            >
              Un pequeño detalle
            </h3>

            <p
              style={{
                fontFamily: "var(--font-jost)",
                color: "var(--c-text-inv2)",
                fontSize: "0.8rem",
                lineHeight: 1.8,
                maxWidth: "34ch",
                margin: "0 auto",
              }}
            >
              Si prefieren acompañarnos de esta manera,
              pueden utilizar los siguientes datos.
            </p>
          </div>

          <div className="space-y-3">
            <CopyButton
              label="Alias"
              value={W.gifts.alias}
            />

            <CopyButton
              label="CBU"
              value={W.gifts.cbu}
            />

            {/* {W.gifts.cvu && (
              <CopyButton
                label="CVU"
                value={W.gifts.cvu}
              />
            )} */}
          </div>

          <p
            className="text-center mt-5"
            style={{
              fontFamily: "var(--font-jost)",
              color: "rgba(154,128,104,0.42)",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
            }}
          >
            {W.gifts.bank}
          </p>


        </motion.div>

        {/* Footer quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(1rem,2.5vw,1.15rem)",
            color: "rgba(154,128,104,0.32)",
            textAlign: "center",
            marginTop: "3rem",
            lineHeight: 1.8,
          }}
        >
          “Todo lo que compartamos en este día
          <br />
          quedará para siempre en nuestro corazón”
        </motion.p>
      </div>

      <style>{`@keyframes giftSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}