"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { W } from "@/lib/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LINKS: Array<{href:string;label:string;external?:boolean}> = [
  { href: "#story",   label: "Historia" },
  { href: "#event",   label: "Evento"   },
  { href: "#map",    label: "Ubicación"},
  { href: "#album",   label: "Álbum"    },
  { href: "#gifts",   label: "Regalos"  },
  // { href: "/live",    label: "🖥 Pantalla", external: true },
  // { href: "/print",   label: "🖨️ Invitaciones", external: true },
  { href: "/admin",   label: "Admin",        external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        className="fixed top-0 inset-x-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-500"
        style={scrolled ? {
          background: "rgba(245,239,228,0.94)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid var(--c-border)",
          boxShadow: "0 1px 20px rgba(44,26,16,0.06)",
        } : {}}
      >
        {/* Logo — only visible when scrolled */}
        <div style={{ width: 80 }}>
          <AnimatePresence>
            {scrolled && (
              <motion.a href="#hero"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.1rem", color: "var(--c-text-1)" }}
              >
                {W.bride[0]}&amp;{W.groom[0]}
              </motion.a>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} target={l.external?"_blank":undefined} rel={l.external?"noopener noreferrer":undefined}
                className="relative group t-eye transition-colors"
                style={{ color: scrolled ? "var(--c-text-3)" : "rgba(240,232,218,0.65)" }}>
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px transition-all duration-300"
                      style={{ background: "var(--c-gold)" }} />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile burger */}
        <button className="md:hidden flex flex-col gap-1.5 p-1 ml-auto z-10" onClick={() => setOpen(v => !v)} aria-label="Menú">
          {[0,1,2].map(i => (
            <motion.span key={i}
              animate={i === 1 ? { opacity: open ? 0 : 1 } : { rotate: open ? (i === 0 ? 45 : -45) : 0, y: open ? (i === 0 ? 6 : -6) : 0 }}
              className="block w-5 h-px"
              style={{ background: scrolled ? "var(--c-text-1)" : "rgba(240,232,218,0.85)" }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22,1,0.36,1] }}
            className="fixed top-[56px] inset-x-0 z-40 overflow-hidden md:hidden"
            style={{ background: "rgba(245,239,228,0.97)", backdropFilter: "blur(18px)", borderBottom: "1px solid var(--c-border)" }}
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  if (!l.external && l.href.startsWith("#")) {
                    e.preventDefault();

                    const el = document.querySelector(l.href);
                    setOpen(false);

                    // esperar a que cierre el menú
                    setTimeout(() => {
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 350);
                  } else {
                    setOpen(false);
                  }
                }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between px-6 py-4 t-eye transition-colors hover:text-gold"
                style={{ color: "var(--c-text-3)", borderBottom: "1px solid var(--c-border)" }}
              >
                {l.label}
                <span style={{ color: "var(--c-gold)", opacity: 0.5 }}>→</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
