import type { Variants } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  show:    { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  show:    { opacity: 1, transition: { duration: 0.75, ease: "easeOut" } },
};

export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -44 },
  show:    { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

export const slideRight: Variants = {
  hidden:  { opacity: 0, x: 44 },
  show:    { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
};

export const scaleUp: Variants = {
  hidden:  { opacity: 0, scale: 0.9 },
  show:    { opacity: 1, scale: 1, transition: { duration: 0.7, ease } },
};

export const container = (stagger = 0.11, delay = 0): Variants => ({
  hidden: {},
  show:   { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// For multi-step form slide
export const stepIn = (dir: number): Variants => ({
  hidden:  { opacity: 0, x: dir * 48 },
  show:    { opacity: 1, x: 0, transition: { duration: 0.38, ease } },
  exit:    { opacity: 0, x: dir * -48, transition: { duration: 0.28, ease } },
});
