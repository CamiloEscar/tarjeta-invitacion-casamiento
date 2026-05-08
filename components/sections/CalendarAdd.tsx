"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { W } from "@/lib/config";

const ICS = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "DTSTART:20261017T003000Z",
  "DTEND:20261018T090000Z",
  `SUMMARY:Casamiento ${W.bride} & ${W.groom}`,
  `DESCRIPTION:Fiesta 21:30hs`,
  `LOCATION:${W.location}`,
  "END:VEVENT",
  "END:VCALENDAR",
].join("\n");

const BTNS = [
  {
    label:"Google Calendar", icon:"📅",
    href: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Casamiento ${W.bride} & ${W.groom}`)}&dates=20261018T003000Z/20261018T090000Z&location=${encodeURIComponent(W.location)}&details=${encodeURIComponent("Ceremonia 18hs · Fiesta 20:30hs")}`,
    download: undefined,
  },
  {
    label:"Apple Calendar", icon:"🍎",
    href: `data:text/calendar;charset=utf8,${encodeURIComponent(ICS)}`,
    download: `boda-${W.bride.toLowerCase()}-${W.groom.toLowerCase()}.ics`,
  },
  {
    label:"Outlook", icon:"🗓️",
    href: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(`Casamiento ${W.bride} & ${W.groom}`)}&startdt=2026-10-17T21:30:00&enddt=2026-10-18T06:00:00&location=${encodeURIComponent(W.location)}`,
    download: undefined,
  },
];

export default function CalendarAdd() {
  const ref = useRef<HTMLDivElement>(null!);
  const v   = useInView(ref, { once:true, amount:0.25 });

  return (
    <section id="calendar" className="s-pad-sm surf-warm text-center">
      <div className="w-narrow px-6" ref={ref}>
        <motion.p className="t-eye mb-3" initial={{ opacity:0 }} animate={v?{opacity:1}:{}}>No te olvides</motion.p>
        <motion.h2 className="t-title mb-2" style={{ color:"var(--c-text-1)" }}
          initial={{ opacity:0,y:18 }} animate={v?{opacity:1,y:0}:{}} transition={{ delay:0.08 }}>
          Guardalo en tu <em style={{ fontStyle:"italic", color:"var(--c-wine)" }}>calendario</em>
        </motion.h2>
        <motion.div className="g-line g-line-c" initial={{ scaleX:0 }} animate={v?{scaleX:1}:{}} transition={{ delay:0.15, duration:0.7 }} />
        <motion.p initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.22 }}
          className="t-body mb-8" style={{ color:"var(--c-text-2)", fontSize:"0.85rem" }}>
          {W.weddingDateLabel} — para que no se te pase entre los días 🗓️
        </motion.p>
        <motion.div initial={{ opacity:0 }} animate={v?{opacity:1}:{}} transition={{ delay:0.3 }}
          className="flex flex-wrap gap-3 justify-center">
          {BTNS.map(b => (
            <a key={b.label} href={b.href} download={b.download}
               target={b.download?undefined:"_blank"} rel="noopener noreferrer"
               className="btn-outline-dark">
              <span>{b.icon} {b.label}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
