"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BG: Record<string, string> = {
  "dark":   "var(--c-dark)",
  "dark-2": "var(--c-dark-2)",
  "dark-3": "var(--c-dark-3)",
  "sand":   "var(--c-base)",
  "linen":  "var(--c-linen)",
  "warm":   "var(--c-warm)",
};

interface Props {
  from: keyof typeof BG;
  to:   keyof typeof BG;
  icon?: string;
}

export default function SectionSep({ from, to, icon = "✦" }: Props) {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once: true, amount: 0.5 });

  const fromBg = BG[from] ?? "var(--c-base)";
  const toBg   = BG[to]   ?? "var(--c-base)";

  // Same surface → no separator needed, render nothing
  if (from === to) return <div style={{ background: fromBg, height: 0 }} />;

  // Is the ornament on a dark or light background?
  const onDark = from.startsWith("dark") || to.startsWith("dark");
  const lineAlpha = onDark ? 0.32 : 0.18;
  const dotColor  = onDark ? "rgba(207,168,112,0.4)" : "rgba(181,137,78,0.3)";

  return (
    <div ref={ref} style={{ display: "block", margin: 0, lineHeight: 0 }}>
      {/* Upper strip — color of the section above */}
      <div style={{ background: fromBg, height: "1.75rem", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={v ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", maxWidth: 280, padding: "0 1.5rem" }}
        >
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, rgba(181,137,78,${lineAlpha}))` }} />
          <motion.span
            initial={{ opacity: 0, scale: 0.3 }}
            animate={v ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="icon-sparkle"
            style={{ fontSize: "0.58rem", color: dotColor, lineHeight: 1, display: "block" }}
          >{icon}</motion.span>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, rgba(181,137,78,${lineAlpha}))` }} />
        </motion.div>
      </div>
      {/* Lower strip — color of the section below */}
      <div style={{ background: toBg, height: "1.75rem" }} />
    </div>
  );
}
