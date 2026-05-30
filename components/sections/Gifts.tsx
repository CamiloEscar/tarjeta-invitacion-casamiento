"use client";

import { useState, useRef } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { W } from "@/lib/config";

function CopyRow({
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
          color: "rgba(196,168,130,0.42)",
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </p>

      <button
        onClick={copy}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-all duration-200"
        style={{
          background: "rgba(181,137,78,0.05)",
          border: "1px solid rgba(181,137,78,0.14)",
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
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 70% 50%, rgba(181,137,78,0.05) 0%, transparent 70%)",
        }}
      />

      <div
        ref={ref}
        className="w-content px-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="t-eye mb-3">
            Regalos
          </p>

          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2rem,5vw,3.1rem)",
              color: "var(--c-text-inv)",
              lineHeight: 1.1,
              marginBottom: "0.6rem",
            }}
          >
            Para nuestro próximo{" "}
            <span
              style={{
                color: "var(--c-gold-lt)",
              }}
            >
              capítulo
            </span>
          </h2>

          <div className="g-line mx-auto" />

          <p
            className="t-body"
            style={{
              color: "var(--c-text-inv2)",
              fontSize: "0.92rem",
              lineHeight: 1.9,
              maxWidth: "42ch",
              margin: "0 auto",
            }}
          >
            Su presencia en este día tan importante ya es
            el mejor regalo para nosotros.
            <br />
            <br />
            Pero si además desean acompañarnos con un
            detalle para esta nueva etapa, preparamos una
            pequeña lista de regalos y también la
            posibilidad de hacerlo mediante alias.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.12,
            duration: 0.8,
          }}
          className="max-w-3xl mx-auto mt-12 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.035)",
            border:
              "1px solid rgba(181,137,78,0.14)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Top line */}
          <div
            style={{
              height: 2,
              background:
                "linear-gradient(to right, transparent, var(--c-gold), transparent)",
            }}
          />

          <div className="p-7 md:p-10">
            {/* Icon */}
            <div className="flex justify-center mb-7">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "999px",
                  background:
                    "rgba(181,137,78,0.08)",
                  border:
                    "1px solid rgba(181,137,78,0.16)",
                  fontSize: "1.6rem",
                }}
              >
                ✨
              </div>
            </div>

            {/* Wishlist CTA */}
            <div className="text-center mb-10">
              <h3
                style={{
                  fontFamily:
                    "var(--font-playfair)",
                  fontStyle: "italic",
                  fontSize: "1.7rem",
                  color: "var(--c-text-inv)",
                  marginBottom: "0.7rem",
                }}
              >
                Lista de regalos
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  color: "var(--c-text-inv2)",
                  fontSize: "0.82rem",
                  lineHeight: 1.8,
                  maxWidth: "36ch",
                  margin: "0 auto 1.6rem",
                }}
              >
                Algunas ideas y pequeños detalles para
                acompañarnos en esta nueva etapa.
              </p>

              <a
                href="/gifts"
                className="inline-flex items-center gap-3 px-6 py-3 transition-all duration-300"
                style={{
                  background:
                    "rgba(181,137,78,0.08)",
                  border:
                    "1px solid rgba(181,137,78,0.18)",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  🎁
                </span>

                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--c-text-inv)",
                  }}
                >
                  Ver lista de regalos
                </span>
              </a>
            </div>

            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background:
                  "linear-gradient(to right, transparent, rgba(181,137,78,0.16), transparent)",
                marginBottom: "2rem",
              }}
            />

            {/* Alias section */}
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-6">
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(181,137,78,0.42)",
                    marginBottom: "0.8rem",
                  }}
                >
                  También pueden hacerlo mediante alias
                </p>

                <p
                  style={{
                    fontFamily:
                      "var(--font-cormorant)",
                    fontStyle: "italic",
                    color:
                      "rgba(196,168,130,0.62)",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                  }}
                >
                  Cualquier detalle que venga del corazón
                  ya es más que suficiente para nosotros
                </p>
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

                {/* {W.gifts.cvu && (
                  <CopyRow
                    label="CVU"
                    value={W.gifts.cvu}
                  />
                )} */}
              </div>

              <p
                className="text-center mt-5"
                style={{
                  fontFamily: "var(--font-jost)",
                  color:
                    "rgba(154,128,104,0.42)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                }}
              >
                {W.gifts.bank}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}