import { NextRequest, NextResponse } from "next/server";
import { W } from "@/lib/config";

const AS = W.appsScriptUrl;

// GET /api/mesas?action=getGuests|getMesa|summary
// GET /api/mesas?action=getMesa&slug=nombre-apellido
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "";
  const slug   = searchParams.get("slug")   || "";

  if (!AS || AS.includes("TU_ID")) {
    // Demo mode — return fake data for development
    if (action === "getGuests") {
      return NextResponse.json({
        guests: [
          { nombre:"María García",    acompanantes:1, restricciones:"",           slug:"maria-garcia",    mesa:"" },
          { nombre:"Carlos Rodríguez",acompanantes:2, restricciones:"Vegetariano",slug:"carlos-rodriguez",mesa:"Mesa 3" },
          { nombre:"Ana Martínez",    acompanantes:0, restricciones:"",           slug:"ana-martinez",    mesa:"" },
        ],
      });
    }
    if (action === "summary") {
      return NextResponse.json({ total:3, si:2, no:1, totalPersonas:5, shuttle:1, sinMesa:2, porDia:[] });
    }
    return NextResponse.json({ mesa: null });
  }

  try {
    const url  = `${AS}?action=${action}${slug ? `&slug=${encodeURIComponent(slug)}` : ""}`;
    const res  = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error al conectar con el servidor" }, { status: 500 });
  }
}

// POST /api/mesas  → { action: "setMesa", slug, mesa }
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!AS || AS.includes("TU_ID")) {
    // Demo mode
    console.log("[demo] setMesa:", body);
    return NextResponse.json({ status: "ok", message: "Mesa guardada (modo demo)" });
  }

  try {
    const res  = await fetch(AS, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action: "setMesa", ...body }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
