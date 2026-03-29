"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STORY, POLAROIDS } from "@/lib/config";
import { fadeUp, slideLeft, slideRight, container } from "@/lib/variants";

function useReveal(amount = 0.25) {
  const ref = useRef<HTMLDivElement>(null!);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

export default function Story() {
  const hdr = useReveal(0.3);

  return (
    <section id="story" className="s-pad surf-linen">
      <div className="w-content px-6">

        {/* Header */}
        <div ref={hdr.ref}>
          <motion.p className="t-eye mb-3" variants={fadeUp} initial="hidden" animate={hdr.inView ? "show" : "hidden"}>
            Nuestra historia
          </motion.p>
          <motion.h2 className="t-title" style={{ color: "var(--c-text-1)" }} variants={fadeUp} initial="hidden" animate={hdr.inView ? "show" : "hidden"} transition={{ delay: 0.08 }}>
            Cómo llegamos <em style={{ fontStyle: "italic", color: "var(--c-wine)" }}>hasta aquí</em>
          </motion.h2>
          <motion.div className="g-line" variants={fadeUp} initial="hidden" animate={hdr.inView ? "show" : "hidden"} transition={{ delay: 0.15 }} />
        </div>

        {/* Polaroids */}
        <div className="grid grid-cols-3 gap-5 md:gap-8 mb-20 mt-4 px-2 md:px-6">
          {POLAROIDS.map((p, i) => <PolaroidCard key={i} photo={p} index={i} />)}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 hidden sm:block"
               style={{ background: "linear-gradient(to bottom, transparent, var(--c-gold) 12%, var(--c-gold) 88%, transparent)", opacity: 0.28 }} />
          {STORY.map((item, i) => <StoryItem key={i} item={item} index={i} />)}
        </div>

      </div>
    </section>
  );
}

function PolaroidCard({ photo, index }: { photo: typeof POLAROIDS[number]; index: number }) {
  const { ref, inView } = useReveal(0.2);
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40, rotate: photo.rot * 1.8, scale: 0.88 }}
      animate={inView ? { opacity: 1, y: 0, rotate: photo.rot, scale: 1 } : {}}
      transition={{ duration: 0.85, ease: [0.22,1,0.36,1], delay: index * 0.12 }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, transition: { duration: 0.3 } }}
      className="polaroid"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
        <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover"
             style={{ filter: "sepia(12%) contrast(0.96)" }} />
      </div>
      <p style={{ position: "absolute", bottom: "0.55rem", left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "0.85rem", color: "#7A6A5A" }}>
        {photo.caption}
      </p>
    </motion.div>
  );
}

function StoryItem({ item, index }: { item: typeof STORY[number]; index: number }) {
  const { ref, inView } = useReveal(0.3);
  const isLeft = item.side === "left";

  return (
    <div ref={ref} className="grid grid-cols-[1fr_48px_1fr] gap-x-6 mb-14 items-start">
      {/* Left */}
      <motion.div variants={isLeft ? slideLeft : fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
        className={isLeft ? "text-right pr-2" : "opacity-0 pointer-events-none"}>
        {isLeft && <TLContent item={item} />}
      </motion.div>

      {/* Dot */}
      <div className="flex justify-center pt-1">
        <motion.div
          initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg z-10 relative"
          style={{ background: "var(--c-linen)", border: "1.5px solid var(--c-gold)", boxShadow: "0 0 0 4px rgba(181,137,78,0.1)" }}
        >
          {item.emoji}
        </motion.div>
      </div>

      {/* Right */}
      <motion.div variants={!isLeft ? slideRight : fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
        className={!isLeft ? "pl-2" : "opacity-0 pointer-events-none"}>
        {!isLeft && <TLContent item={item} />}
      </motion.div>
    </div>
  );
}

function TLContent({ item }: { item: typeof STORY[number] }) {
  return (
    <>
      <p className="t-eye mb-1.5">{item.year}</p>
      <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.2rem", color: "var(--c-text-1)", marginBottom: "0.5rem", lineHeight: 1.2 }}>{item.title}</h3>
      <p className="t-body" style={{ color: "var(--c-text-3)", fontSize: "0.85rem" }}>{item.text}</p>
    </>
  );
}
