"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const COLORS = [
  "#1F1F1F",
  "#D9CABB",
  "#EFE7DD",
  "#7A8471",
  "#8C6A4A",
];

const DETAILS = [
  {
    title: "Formal elegante",
    text: "Nos encantaría que nos acompañes con un look elegante y acorde a una noche especial.",
  },
  {
    title: "Celebración",
    text: "El evento será al aire libre y en salón, ideal para disfrutar cómodos toda la noche.",
  },
  {
    title: "Estilo",
    text: "Tonos neutros, cálidos y sofisticados acompañarán la estética de la celebración.",
  },
];

export default function DressCode() {
  const ref = useRef<HTMLDivElement>(null!);
  const v = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="dresscode"
      className="s-pad relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #f8f5f1 0%, #f3eee8 100%)",
      }}
    >
      {/* soft glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top, rgba(107,38,53,0.05), transparent 45%)",
        }}
      />

      <div className="w-content px-6 relative z-10" ref={ref}>
        {/* heading */}
        <motion.p
          className="t-eye mb-3"
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          style={{ letterSpacing: "0.22em" }}
        >
          VESTIMENTA
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08 }}
          className="mb-5"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.7rem,6vw,4.8rem)",
            color: "var(--c-text-1)",
            lineHeight: 1,
            fontWeight: 500,
          }}
        >
          Dress{" "}
          <em
            style={{
              fontStyle: "italic",
              color: "var(--c-wine)",
              fontWeight: 400,
            }}
          >
            code
          </em>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={v ? { scaleX: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="origin-left mb-8"
          style={{
            width: "90px",
            height: "1px",
            background: "rgba(107,38,53,0.35)",
          }}
        />

        {/* intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.22 }}
          className="max-w-2xl mb-14"
          style={{
            color: "var(--c-text-2)",
            fontSize: "1rem",
            lineHeight: 1.9,
          }}
        >
          Queremos compartir una noche elegante, relajada y llena de
          celebración. Elegí un look con el que te sientas cómodo/a y listo/a
          para disfrutar.
        </motion.p>

        {/* cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {DETAILS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={v ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.1, duration: 0.7 }}
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(107,38,53,0.08)",
                borderRadius: "22px",
                padding: "2rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "1px",
                  background: "var(--c-wine)",
                  marginBottom: "1rem",
                  opacity: 0.5,
                }}
              />

              <h3
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.15rem",
                  color: "var(--c-text-1)",
                  marginBottom: "0.7rem",
                  fontStyle: "italic",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "var(--c-text-3)",
                  fontSize: "0.92rem",
                  lineHeight: 1.8,
                }}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* palette */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={v ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45 }}
          className="mb-12"
        >
          <p
            style={{
              letterSpacing: "0.18em",
              fontSize: "0.72rem",
              color: "var(--c-text-3)",
              marginBottom: "1rem",
            }}
          >
            TONOS SUGERIDOS
          </p>

          <div className="flex gap-4 flex-wrap items-center">
            {COLORS.map((color, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "999px",
                  background: color,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={v ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
          style={{
            borderTop: "1px solid rgba(107,38,53,0.1)",
            paddingTop: "1.4rem",
            maxWidth: "700px",
          }}
        >
          <p
            style={{
              color: "var(--c-text-2)",
              fontSize: "0.9rem",
              lineHeight: 1.8,
            }}
          >
            Sugerimos evitar tonos blancos o rojo intenso.
          </p>
        </motion.div>
      </div>
    </section>
  );
}