"use client";
import { useState, useEffect } from "react";

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number;
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calc(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return ZERO;
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)     / 1_000),
  };
}

export function useCountdown(target: string) {
  const [t,       setT]       = useState<TimeLeft>(ZERO);
  const [ready,   setReady]   = useState(false);
  // true if target date is today (same calendar day)
  const [isToday, setIsToday] = useState(false);
  // true if target date is in the past
  const [isPast,  setIsPast]  = useState(false);

  useEffect(() => {
    const update = () => {
      const now    = new Date();
      const target_d = new Date(target);
      const diff   = target_d.getTime() - now.getTime();

      setT(calc(target));
      setReady(true);
      setIsPast(diff < 0);
      setIsToday(
        now.getFullYear() === target_d.getFullYear() &&
        now.getMonth()    === target_d.getMonth()    &&
        now.getDate()     === target_d.getDate()
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  return { ...t, ready, isToday, isPast };
}
