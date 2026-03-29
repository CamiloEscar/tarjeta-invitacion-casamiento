import { NextRequest, NextResponse } from "next/server";
import { W } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nombre || !body.email || !body.asistencia)
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

    // Format companions as readable string
    const companionsText = Array.isArray(body.companions) && body.companions.length > 0
      ? body.companions
          .map((c: { name: string; dietary: string }, i: number) =>
            `${i+1}. ${c.name || "Sin nombre"}${c.dietary ? ` (${c.dietary})` : ""}`
          )
          .join(" | ")
      : "Ninguno";

    const payload = {
      nombre:        body.nombre,
      apellido:      body.apellido      || "",
      email:         body.email,
      telefono:      body.telefono      || "",
      asistencia:    body.asistencia,
      acompanantes:  body.acompanantes  || "0",
      acompanantes_detalle: companionsText,
      restricciones: body.restricciones || "",
      mensaje:       body.mensaje       || "",
      fecha: new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
    };

    const res = await fetch(W.appsScriptUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Apps Script ${res.status}`);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
