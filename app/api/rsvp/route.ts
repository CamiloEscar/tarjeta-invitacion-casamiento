import { NextRequest, NextResponse } from "next/server";
import { W } from "@/lib/config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const action = searchParams.get("action");
  const slug = searchParams.get("slug");

  if (action === "status") {

  if (!slug) {
    return NextResponse.json(
      { error: "Slug requerido" },
      { status: 400 }
    );
  }

  const url =
    `${W.appsScriptUrl}?action=status&slug=${encodeURIComponent(slug)}`;

  const res = await fetch(url);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error consultando estado" },
      { status: 500 }
    );
  }

  const data = await res.json();

  return NextResponse.json(data);
}
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── UPDATE RSVP (editar mensaje, restricciones, hijos) ──
    if (body.action === "update") {
      if (!body.slug) {
        return NextResponse.json({ error: "slug requerido" }, { status: 400 });
      }

      const payload = {
        action:        "updateRSVP",
        slug:          body.slug,
        mensaje:       body.mensaje       ?? "",
        restricciones: body.restricciones ?? "",
        hijos:         body.hijos         ?? 0,
      };

      const res = await fetch(W.appsScriptUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Apps Script respondió ${res.status}`);
      return NextResponse.json({ success: true });
    }

    // ── NUEVO RSVP ──
    // Validación mínima
    if (!body.nombre || !body.apellido || !body.asistencia)
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });

    const adultos       = Number(body.adultos)       || (body.nombre2 ? 2 : 1);
    const hijos         = Number(body.hijos)         || 0;
    const totalPersonas = body.asistencia === "Si" ? adultos + hijos : 0;

    const payload = {
      action:        "rsvp",
      nombre:        body.nombre,
      apellido:      body.apellido,
      nombre2:       body.nombre2       ?? "",
      apellido2:     body.apellido2     ?? "",
      email:         body.email         ?? "",
      telefono:      body.telefono      ?? "",
      asistencia:    body.asistencia,
      adultos,
      hijos,
      totalPersonas,
      restricciones: body.restricciones ?? "",
      mensaje:       body.mensaje       ?? "",
    };

    const res = await fetch(W.appsScriptUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Apps Script respondió ${res.status}`);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[rsvp]", e);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}