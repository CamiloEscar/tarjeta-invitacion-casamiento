// ════════════════════════════════════════════════════════
//  /api/gifts — GET / POST para estado de regalos
//  Proxy hacia Google Apps Script (hoja "Gifts")
// ════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { W } from "@/lib/config";

const AS = W.appsScriptUrl;

// ── Tipos ───────────────────────────────────────────────
interface GiftItem {
  name: string;
  price: string;
  emoji: string;
  url: string;
  reserved: boolean;
}

// ── GET ─────────────────────────────────────────────────
//  Mergea data estática (W.giftList) + estado de GAS
//  + regalos custom creados desde admin
export async function GET() {
  try {
    let apiItems: GiftItem[] = [];

    if (AS && !AS.includes("TU_ID")) {
      const res = await fetch(`${AS}?action=getGifts`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        apiItems = (data.items ?? []).map((i: { name: string; emoji?: string; price?: string; url?: string; reserved: boolean }) => ({
          name: i.name,
          emoji: i.emoji || "",
          price: i.price || "",
          url: i.url || "",
          reserved: i.reserved,
        }));
      }
    }

    // Si GAS devuelve vacío, auto-seed
    if (apiItems.length === 0 && W.giftList.length > 0) {
      await seedGifts();
      apiItems = W.giftList.map((g) => ({ ...g, reserved: false }));
    }

    // Merge: si GAS devuelve datos, GAS es source of truth (qué items existen)
    // Config solo aporta metadata (emoji, price, url)
    let merged: GiftItem[] = [];
    if (apiItems.length > 0) {
      for (const a of apiItems) {
        const configMatch = W.giftList.find((g) => g.name === a.name);
        merged.push({
          name: a.name,
          emoji: configMatch?.emoji || a.emoji || "🎁",
          price: configMatch?.price || a.price || "",
          url: configMatch?.url || a.url || "",
          reserved: a.reserved,
        });
      }
    } else {
      // Fallback: GAS no devolvió nada — mostramos todos los items del config
      merged = W.giftList.map((g) => ({ ...g, reserved: false }));
    }

    return NextResponse.json({ items: merged });
  } catch (error) {
    console.error("[gifts:GET]", error);
    return NextResponse.json({
      items: W.giftList.map((g) => ({ ...g, reserved: false })),
    });
  }
}

// ── POST ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, name, reserved, emoji, price, url } = body;

    if (action === "addGift") {
      if (!name) {
        return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });
      }
      if (!AS || AS.includes("TU_ID")) {
        return NextResponse.json({ status: "ok", name, emoji: emoji || "", price: price || "", url: url || "" });
      }
      const res = await fetch(AS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addGift", name, emoji, price, url }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { status: "ok" }; }
      return NextResponse.json(data);
    }

    if (action === "editGift") {
      const { oldName, name, emoji, price, url } = body;
      if (!oldName || !name) {
        return NextResponse.json({ error: "oldName y name son requeridos" }, { status: 400 });
      }
      if (!AS || AS.includes("TU_ID")) {
        return NextResponse.json({ status: "ok" });
      }
      const res = await fetch(AS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "editGift", oldName, name, emoji, price, url }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { status: "ok" }; }
      return NextResponse.json(data);
    }

    if (action === "deleteGift") {
      const { name } = body;
      if (!name) {
        return NextResponse.json({ error: "name es requerido" }, { status: 400 });
      }
      if (!AS || AS.includes("TU_ID")) {
        return NextResponse.json({ status: "ok" });
      }
      const res = await fetch(AS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteGift", name }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { status: "ok" }; }
      return NextResponse.json(data);
    }

    // toggleGift (default)
    if (!name || typeof reserved !== "boolean") {
      return NextResponse.json(
        { error: "Se requiere 'name' (string) y 'reserved' (boolean)" },
        { status: 400 }
      );
    }

    if (!AS || AS.includes("TU_ID")) {
      console.log("[demo] toggleGift:", { name, reserved });
      return NextResponse.json({ status: "ok", name, reserved });
    }

    const res = await fetch(AS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleGift", name, reserved }),
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { status: "ok", name, reserved }; }
    return NextResponse.json(data);
  } catch (error) {
    console.error("[gifts:POST]", error);
    return NextResponse.json({ status: "ok", name: "", reserved: false });
  }
}

// ── Helper: seed inicial ──────────────────────────────────
async function seedGifts() {
  if (!AS || AS.includes("TU_ID")) return;
  try {
    await fetch(AS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "initGifts",
        gifts: W.giftList.map((g) => g.name),
      }),
    });
  } catch (err) {
    console.warn("[gifts] seed failed:", err);
  }
}
