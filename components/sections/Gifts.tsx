"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { W } from "@/lib/config";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <div className="mb-3 last:mb-0">
      <p
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: "0.56rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(196,168,130,0.45)",
          marginBottom: "0.3rem",
        }}
      >
        {label}
      </p>

      <button
        onClick={copy}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 transition-all duration-200 text-left group"
        style={{
          background: "rgba(181,137,78,0.06)",
          border: "1px solid rgba(181,137,78,0.18)",
          color: "var(--c-gold-lt)",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.85rem",
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
              fontSize: "0.58rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              flexShrink: 0,
              color: copied
                ? "var(--c-gold-lt)"
                : "rgba(154,128,104,0.5)",
            }}
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

export default function Gifts() {
  const ref = useRef<HTMLDivElement>(null!);

  const v = useInView(ref, {
    once: true,
    amount: 0.15,
  });

  return (
    <section
      id="gifts"
      className="s-pad surf-dark-2 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 75% 50%, rgba(181,137,78,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="w-content px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="t-eye mb-3">Regalos</p>

          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2rem,5vw,3rem)",
              color: "var(--c-text-inv)",
              lineHeight: 1.1,
              marginBottom: "0.25rem",
            }}
          >
            Lista de{" "}
            <span style={{ color: "var(--c-gold-lt)" }}>
              regalos
            </span>
          </h2>

          <div className="g-line" />

          <p
            className="t-body mb-10 max-w-prose"
            style={{
              color: "var(--c-text-inv2)",
              fontSize: "0.88rem",
            }}
          >
            {W.gifts.message}
          </p>
        </motion.div>

        {/* Layout */}
        <div className="grid md:grid-cols-5 gap-4">
          {/* Transferencia */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={v ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12, duration: 0.75 }}
            className="md:col-span-3 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(181,137,78,0.18)",
            }}
          >
            <div
              style={{
                height: 2,
                background:
                  "linear-gradient(to right, var(--c-wine), var(--c-gold), transparent)",
              }}
            />

            <div className="p-7">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(107,38,53,0.35)",
                    border: "1px solid rgba(107,38,53,0.5)",
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>
                    🏦
                  </span>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontStyle: "italic",
                      fontSize: "1.25rem",
                      color: "var(--c-text-inv)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Transferencia bancaria
                  </h3>

                  <p
                    className="t-body"
                    style={{
                      color: "var(--c-text-inv2)",
                      fontSize: "0.78rem",
                    }}
                  >
                    La forma más directa de hacernos un regalo
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <CopyRow
                  label="Alias"
                  value={W.gifts.alias}
                />

                <CopyRow
                  label="CBU"
                  value={W.gifts.cbu}
                />

                {W.gifts.cvu && (
                  <CopyRow
                    label="CVU"
                    value={W.gifts.cvu}
                  />
                )}
              </div>

              <p
                className="t-body mt-4"
                style={{
                  color: "rgba(154,128,104,0.45)",
                  fontSize: "0.72rem",
                }}
              >
                {W.gifts.bank}
              </p>

              {/* Botones */}
              <div className="flex flex-wrap gap-3 mt-6">
                <a href={W.gifts.mpLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 flex-1 min-w-[140px] justify-center"
                  style={{ padding:"0.85rem 1rem", background:"#009ee3", border:"none", cursor:"pointer" }}>
                  {/* Mercado Pago logo simplified */}
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="white" opacity="0.15"/>
                    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">MP</text>
                  </svg>
                  <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.7rem", letterSpacing:"0.1em", fontWeight:500, color:"white" }}>Mercado Pago</span>
                </a>

                <a href={W.gifts.modoLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 flex-1 min-w-[140px] justify-center"
                  style={{ padding:"0.85rem 1rem", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer" }}>
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="white" opacity="0.1"/>
                    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">MODO</text>
                  </svg>
                  <span style={{ fontFamily:"var(--font-jost)", fontSize:"0.7rem", letterSpacing:"0.1em", fontWeight:400, color:"var(--c-text-inv)" }}>MODO</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          {/* Right column */}
            <div className="md:col-span-2 flex flex-col gap-4">

              {/* Gift options */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={v ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.22, duration: 0.75 }}
                className="p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(181,137,78,0.13)",
                }}
              >
                <div className="text-2xl mb-3">🎁</div>

                <h3
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: "1.15rem",
                    color: "var(--c-text-inv)",
                    marginBottom: "0.6rem",
                  }}
                >
                  Opciones de regalos
                </h3>

                <p
                  className="t-body mb-5"
                  style={{
                    color: "var(--c-text-inv2)",
                    fontSize: "0.78rem",
                    lineHeight: 1.7,
                  }}
                >
                  Podés ver nuestra lista de regalos, elegir un regalo especial
                  o enviarnos un obsequio mediante transferencia, Mercado Pago o MODO.
                </p>

                <div className="flex flex-col gap-3">

                  {/* Lista */}
                  <a
                    href="/gifts"
                    className="group flex items-center justify-between px-4 py-3 transition-all duration-200"
                    style={{
                      background: "rgba(181,137,78,0.06)",
                      border: "1px solid rgba(181,137,78,0.16)",
                      textDecoration: "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: "1.05rem" }}>📦</span>

                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-jost)",
                            fontSize: "0.78rem",
                            color: "var(--c-text-inv)",
                            marginBottom: "0.1rem",
                          }}
                        >
                          Lista de regalos
                        </p>

                        <p
                          style={{
                            fontFamily: "var(--font-jost)",
                            fontSize: "0.64rem",
                            color: "rgba(154,128,104,0.5)",
                          }}
                        >
                          Ver regalos sugeridos
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        color: "var(--c-gold-lt)",
                        fontSize: "0.8rem",
                      }}
                    >
                      →
                    </span>
                  </a>

                  {/* Especial */}
                  {/* <a
                    href={W.gifts.extra.url}
                    className="group flex items-center justify-between px-4 py-3 transition-all duration-200"
                    style={{
                      background: "rgba(181,137,78,0.06)",
                      border: "1px solid rgba(181,137,78,0.16)",
                      textDecoration: "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: "1.05rem" }}>
                        {W.gifts.extra.icon}
                      </span>

                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-jost)",
                            fontSize: "0.78rem",
                            color: "var(--c-text-inv)",
                            marginBottom: "0.1rem",
                          }}
                        >
                          {W.gifts.extra.title}
                        </p>

                        <p
                          style={{
                            fontFamily: "var(--font-jost)",
                            fontSize: "0.64rem",
                            color: "rgba(154,128,104,0.5)",
                          }}
                        >
                          {W.gifts.extra.description}
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        color: "var(--c-gold-lt)",
                        fontSize: "0.8rem",
                      }}
                    >
                      →
                    </span>
                  </a> */}

                </div>
              </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
}