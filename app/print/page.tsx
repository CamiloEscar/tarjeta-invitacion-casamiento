"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PrintCard from "./PrintCard";

export default function PrintPage() {
  return (
    <Suspense
      fallback={
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "100vh", background: "var(--c-base)",
          color: "var(--c-text-3)", fontFamily: "var(--font-jost)",
        }}>
          Cargando…
        </div>
      }
    >
      <PrintInner />
    </Suspense>
  );
}

function PrintInner() {
  const params    = useSearchParams();
  const slug      = params.get("slug")      || "";
  const nombre    = params.get("nombre")    || "Invitado";
  const apellido  = params.get("apellido")  || "";
  const nombre2   = params.get("nombre2")   || undefined;
  const apellido2 = params.get("apellido2") || undefined;
  const noChildren = params.get("r") === "1";

  return (
    <PrintCard
      slug={slug}
      guest={{ nombre, apellido, nombre2, apellido2 }}
      noChildren={noChildren}
    />
  );
}