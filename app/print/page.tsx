"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PrintCard from "./PrintCard";

export default function PrintPage() {
  return (
    <Suspense fallback={<div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"var(--c-base)", color:"var(--c-text-3)", fontFamily:"var(--font-jost)" }}>Cargando...</div>}>
      <PrintInner />
    </Suspense>
  );
}

function PrintInner() {
  const params = useSearchParams();
  const slug   = params.get("slug") || "";
  const name   = params.get("name") || "Invitado";
  return <PrintCard slug={slug} guestName={name} />;
}
