/**
 * ═══════════════════════════════════════════════════
 *  GOOGLE APPS SCRIPT — RSVP + Mesas Backend
 *  Casamiento Leo & Paola
 *
 *  Columnas de la hoja "Confirmaciones":
 *   A  Nombre       B  Apellido     C  Email
 *   D  Teléfono     E  Asistencia   F  Acomp.
 *   G  Transfer     H  Restricciones I  Mensaje
 *   J  Fecha        K  Slug         L  Mesa
 * ═══════════════════════════════════════════════════
 */

const SPREADSHEET_ID = "TU_SPREADSHEET_ID_AQUI";
const SHEET_NAME     = "Confirmaciones";
const NOTIFY_EMAIL   = "tucorreo@gmail.com";

// ── POST: guardar RSVP o actualizar mesa ──────────────────────
function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = data.action || "rsvp";

    if (action === "setMesa") return setMesa(data);
    if (action === "rsvp")    { save(data); notify(data); return ok("Confirmación registrada"); }

    return err_("Acción desconocida");
  } catch(err) {
    Logger.log(err);
    return err_("Error: " + err.message);
  }
}

// ── GET: resumen, mesa de un invitado, o lista de invitados ───
function doGet(e) {
  const action = e.parameter.action || "";
  const cors   = { "Access-Control-Allow-Origin": "*" }; // needed for browser calls

  try {
    let result;
    if (action === "summary")   result = getSummary();
    else if (action === "getMesa") result = getMesaBySlug(e.parameter.slug || "");
    else if (action === "getGuests") result = getGuests();
    else result = { status: "ok", message: "Endpoint activo ✓" };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Save RSVP ────────────────────────────────────────────────
function save(data) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet   = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { sheet = ss.insertSheet(SHEET_NAME); initHeaders(sheet); }
  else if (sheet.getLastRow() === 0) { initHeaders(sheet); }

  // Build slug from name
  const fullName = ((data.nombre || "") + " " + (data.apellido || "")).trim();
  const slug = fullName.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  sheet.appendRow([
    data.nombre         || "",
    data.apellido       || "",
    data.email          || "",
    data.telefono       || "",
    data.asistencia     || "",
    data.acompanantes   || "0",
    data.shuttle        || "No",
    data.restricciones  || "",
    data.mensaje        || "",
    new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
    slug,                          // col K — slug for lookup
    "",                            // col L — mesa (set later by admin)
  ]);

  const row   = sheet.getLastRow();
  const color = data.asistencia === "Si" ? "#e8f5e9" : "#fce4ec";
  sheet.getRange(row, 1, 1, 12).setBackground(color);
}

// ── Set mesa for a guest by slug ─────────────────────────────
function setMesa(data) {
  const slug = (data.slug || "").trim();
  const mesa = (data.mesa || "").trim();
  if (!slug) return err_("slug requerido");

  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return err_("Hoja no encontrada");

  const values = sheet.getDataRange().getValues();
  // col K (index 10) = slug
  for (let i = 1; i < values.length; i++) {
    if (values[i][10] === slug) {
      sheet.getRange(i + 1, 12).setValue(mesa); // col L = mesa
      return ok("Mesa actualizada");
    }
  }
  return err_("Invitado no encontrado: " + slug);
}

// ── Get mesa for one guest by slug ───────────────────────────
function getMesaBySlug(slug) {
  if (!slug) return { mesa: null };
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return { mesa: null };

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][10] === slug) {
      return { mesa: values[i][11] || null };
    }
  }
  return { mesa: null };
}

// ── Get all confirmed guests (for admin table manager) ────────
function getGuests() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) return { guests: [] };

  const rows   = sheet.getDataRange().getValues().slice(1);
  const guests = rows
    .filter(r => r[4] === "Si") // only attending
    .map(r => ({
      nombre:      (r[0] + " " + r[1]).trim(),
      acompanantes: parseInt(r[5]) || 0,
      restricciones: r[7] || "",
      slug:        r[10] || "",
      mesa:        r[11] || "",
    }));

  return { guests };
}

// ── Summary for /admin ────────────────────────────────────────
function getSummary() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) {
    return { total:0, si:0, no:0, totalPersonas:0, shuttle:0, sinMesa:0, porDia:[] };
  }

  const rows = sheet.getDataRange().getValues().slice(1);
  let si=0, no=0, totalPersonas=0, shuttle=0, sinMesa=0;
  const diaCount = {};

  rows.forEach(r => {
    const asistencia   = r[4];
    const acompanantes = parseInt(r[5]) || 0;
    const shuttleVal   = r[6];
    const fecha        = r[9];
    const mesa         = r[11];

    if (asistencia === "Si") {
      si++;
      totalPersonas += 1 + acompanantes;
      if (shuttleVal === "Sí") shuttle += 1 + acompanantes;
      if (!mesa) sinMesa++;
    } else { no++; }

    const dia = typeof fecha === "string"
      ? fecha.split(",")[0]
      : Utilities.formatDate(new Date(fecha), "America/Argentina/Buenos_Aires", "dd/MM");
    diaCount[dia] = (diaCount[dia] || 0) + 1;
  });

  const porDia = Object.entries(diaCount)
    .map(([fecha, count]) => ({ fecha, count }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-14);

  return { total:rows.length, si, no, totalPersonas, shuttle, sinMesa, porDia };
}

// ── Init headers (11 columns now) ────────────────────────────
function initHeaders(sheet) {
  const h = ["Nombre","Apellido","Email","Teléfono","Asistencia","Acomp.","Transfer","Restricciones","Mensaje","Fecha","Slug","Mesa"];
  sheet.appendRow(h);
  const r = sheet.getRange(1,1,1,h.length);
  r.setBackground("#2C1A10").setFontColor("#CFAA70").setFontWeight("bold");
  sheet.setFrozenRows(1);
  [120,120,200,140,90,70,80,180,260,160,120,100].forEach((w,i) => sheet.setColumnWidth(i+1,w));
}

function notify(data) {
  if (!NOTIFY_EMAIL || !data.asistencia) return;
  const asiste = data.asistencia === "Si" ? "✅ SÍ" : "❌ NO";
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `💌 RSVP: ${data.nombre} ${data.apellido} — ${asiste}`,
    body: `Nueva confirmación:\n\n${data.nombre} ${data.apellido}\nAsistencia: ${data.asistencia}\nAcompañantes: ${data.acompanantes || 0}\nTransfer: ${data.shuttle || "No"}\nRestricciones: ${data.restricciones || "—"}\nMensaje: ${data.mensaje || "—"}`,
  });
}

function ok(msg)   { return ContentService.createTextOutput(JSON.stringify({status:"ok",message:msg})).setMimeType(ContentService.MimeType.JSON); }
function err_(msg) { return ContentService.createTextOutput(JSON.stringify({status:"error",message:msg})).setMimeType(ContentService.MimeType.JSON); }



















/**
 * ═══════════════════════════════════════════════════
 *  GOOGLE APPS SCRIPT — RSVP + Mesas Backend
 *  Casamiento — v2 con soporte de parejas
 *
 *  Columnas de la hoja "Confirmaciones":
 *   A  Nombre      B  Apellido    C  Nombre2     D  Apellido2
 *   E  Email       F  Teléfono    G  Asistencia  H  Adultos
 *   I  Hijos       J  TotalPersonas K  Restricciones L  Mensaje
 *   M  Fecha       N  Slug        O  Mesa
 * ═══════════════════════════════════════════════════
 */

const SPREADSHEET_ID = "TU_SPREADSHEET_ID_AQUI";
const SHEET_NAME     = "Confirmaciones";
const NOTIFY_EMAIL   = "tucorreo@gmail.com";

// ── Índices de columnas (0-based, para getValues()) ──────────
const COL = {
  NOMBRE:        0,
  APELLIDO:      1,
  NOMBRE2:       2,
  APELLIDO2:     3,
  EMAIL:         4,
  TELEFONO:      5,
  ASISTENCIA:    6,
  ADULTOS:       7,
  HIJOS:         8,
  TOTAL_PERSONAS: 9,
  RESTRICCIONES: 10,
  MENSAJE:       11,
  FECHA:         12,
  SLUG:          13,
  MESA:          14,
};

const TOTAL_COLS = 15; // A–O

// ── Helpers ──────────────────────────────────────────────────

/**
 * Genera un slug limpio desde nombre + apellido (y opcionalmente nombre2 + apellido2).
 * Ej: "Marcos", "Pérez", "Luisina", "Gómez" → "marcos-perez-luisina-gomez"
 * Compatible con invitados individuales.
 */
function buildSlug(nombre, apellido, nombre2, apellido2) {
  const parts = [nombre, apellido, nombre2, apellido2]
    .map(s => (s || "").trim())
    .filter(Boolean);

  return parts
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Nombre para mostrar en emails/notificaciones */
function displayName(nombre, nombre2) {
  return nombre2 ? `${nombre} y ${nombre2}` : nombre;
}

/** Abre (o crea si no existe) la hoja de confirmaciones */
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    initHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    initHeaders(sheet);
  }
  return sheet;
}

// ── POST handler ─────────────────────────────────────────────
function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = data.action || "rsvp";

    if (action === "setMesa") return setMesa(data);
    if (action === "rsvp")    { saveRSVP(data); notifyRSVP(data); return ok("Confirmación registrada"); }

    return err_("Acción desconocida: " + action);
  } catch (err) {
    Logger.log(err);
    return err_("Error: " + err.message);
  }
}

// ── GET handler ──────────────────────────────────────────────
function doGet(e) {
  const action = (e.parameter.action || "").trim();

  try {
    let result;
    if      (action === "summary")    result = getSummary();
    else if (action === "getMesa")    result = getMesaBySlug(e.parameter.slug || "");
    else if (action === "getGuests")  result = getGuests();
    else                              result = { status: "ok", message: "Endpoint activo ✓" };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Guardar RSVP ─────────────────────────────────────────────
function saveRSVP(data) {
  const sheet = getOrCreateSheet();

  const slug = buildSlug(
    data.nombre, data.apellido,
    data.nombre2, data.apellido2
  );

  const adultos       = parseInt(data.adultos)       || (data.nombre2 ? 2 : 1);
  const hijos         = parseInt(data.hijos)         || 0;
  const totalPersonas = parseInt(data.totalPersonas) || (data.asistencia === "Si" ? adultos + hijos : 0);

  const row = [
    data.nombre        || "",                        // A NOMBRE
    data.apellido      || "",                        // B APELLIDO
    data.nombre2       || "",                        // C NOMBRE2
    data.apellido2     || "",                        // D APELLIDO2
    data.email         || "",                        // E EMAIL
    data.telefono      || "",                        // F TELÉFONO
    data.asistencia    || "",                        // G ASISTENCIA
    adultos,                                         // H ADULTOS
    hijos,                                           // I HIJOS
    totalPersonas,                                   // J TOTAL_PERSONAS
    data.restricciones || "",                        // K RESTRICCIONES
    data.mensaje       || "",                        // L MENSAJE
    new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires"
    }),                                              // M FECHA
    slug,                                            // N SLUG
    "",                                              // O MESA (se asigna luego desde admin)
  ];

  sheet.appendRow(row);

  const lastRow = sheet.getLastRow();
  const bgColor = data.asistencia === "Si" ? "#e8f5e9" : "#fce4ec";
  sheet.getRange(lastRow, 1, 1, TOTAL_COLS).setBackground(bgColor);
}

// ── Asignar mesa a invitado por slug ─────────────────────────
function setMesa(data) {
  const slug = (data.slug || "").trim();
  const mesa = (data.mesa || "").trim();
  if (!slug) return err_("slug requerido");

  const sheet  = getOrCreateSheet();
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][COL.SLUG] === slug) {
      sheet.getRange(i + 1, COL.MESA + 1).setValue(mesa);
      return ok("Mesa actualizada");
    }
  }
  return err_("Invitado no encontrado: " + slug);
}

// ── Obtener mesa de un invitado por slug ─────────────────────
function getMesaBySlug(slug) {
  if (!slug) return { mesa: null };

  const sheet  = getOrCreateSheet();
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][COL.SLUG] === slug) {
      return { mesa: values[i][COL.MESA] || null };
    }
  }
  return { mesa: null };
}

// ── Lista de invitados confirmados (para admin / mesas) ──────
function getGuests() {
  const sheet = getOrCreateSheet();
  if (sheet.getLastRow() <= 1) return { guests: [] };

  const rows   = sheet.getDataRange().getValues().slice(1);
  const guests = rows
    .filter(r => r[COL.ASISTENCIA] === "Si")
    .map(r => {
      const nombre2   = r[COL.NOMBRE2]   || "";
      const apellido2 = r[COL.APELLIDO2] || "";
      const fullName  = nombre2
        ? `${r[COL.NOMBRE]} ${r[COL.APELLIDO]} & ${nombre2} ${apellido2}`.trim()
        : `${r[COL.NOMBRE]} ${r[COL.APELLIDO]}`.trim();

      return {
        nombre:        r[COL.NOMBRE],
        apellido:      r[COL.APELLIDO],
        nombre2:       nombre2,
        apellido2:     apellido2,
        fullName,
        adultos:       parseInt(r[COL.ADULTOS])        || 1,
        hijos:         parseInt(r[COL.HIJOS])           || 0,
        totalPersonas: parseInt(r[COL.TOTAL_PERSONAS])  || 1,
        restricciones: r[COL.RESTRICCIONES] || "",
        slug:          r[COL.SLUG]          || "",
        mesa:          r[COL.MESA]          || "",
      };
    });

  return { guests };
}

// ── Resumen para /admin ──────────────────────────────────────
function getSummary() {
  const sheet = getOrCreateSheet();
  if (sheet.getLastRow() <= 1) {
    return { total: 0, si: 0, no: 0, totalPersonas: 0, sinMesa: 0, porDia: [] };
  }

  const rows = sheet.getDataRange().getValues().slice(1);

  let si = 0, no = 0, totalPersonas = 0, sinMesa = 0;
  const diaCount = {};

  rows.forEach(r => {
    const asistencia = r[COL.ASISTENCIA];
    const personas   = parseInt(r[COL.TOTAL_PERSONAS]) || 0;
    const fecha      = r[COL.FECHA];
    const mesa       = r[COL.MESA];

    if (asistencia === "Si") {
      si++;
      totalPersonas += personas;
      if (!mesa) sinMesa++;
    } else {
      no++;
    }

    const dia = typeof fecha === "string"
      ? fecha.split(",")[0]
      : Utilities.formatDate(
          new Date(fecha),
          "America/Argentina/Buenos_Aires",
          "dd/MM"
        );
    diaCount[dia] = (diaCount[dia] || 0) + 1;
  });

  const porDia = Object.entries(diaCount)
    .map(([fecha, count]) => ({ fecha, count }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-14);

  return { total: rows.length, si, no, totalPersonas, sinMesa, porDia };
}

// ── Inicializar cabeceras ────────────────────────────────────
function initHeaders(sheet) {
  const headers = [
    "Nombre", "Apellido", "Nombre2", "Apellido2",
    "Email", "Teléfono",
    "Asistencia", "Adultos", "Hijos", "Total Personas",
    "Restricciones", "Mensaje", "Fecha", "Slug", "Mesa",
  ];
  sheet.appendRow(headers);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground("#2C1A10")
    .setFontColor("#CFAA70")
    .setFontWeight("bold");

  sheet.setFrozenRows(1);

  const colWidths = [120, 120, 120, 120, 200, 140, 90, 70, 70, 100, 180, 260, 160, 160, 100];
  colWidths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
}

// ── Notificación por email ───────────────────────────────────
function notifyRSVP(data) {
  if (!NOTIFY_EMAIL || !data.asistencia) return;

  const asiste    = data.asistencia === "Si" ? "✅ SÍ" : "❌ NO";
  const nombre    = displayName(data.nombre, data.nombre2);
  const apellidos = [data.apellido, data.apellido2].filter(Boolean).join(" / ");
  const adultos   = parseInt(data.adultos) || 1;
  const hijos     = parseInt(data.hijos)   || 0;

  MailApp.sendEmail({
    to:      NOTIFY_EMAIL,
    subject: `💌 RSVP: ${nombre} — ${asiste}`,
    body: [
      `Nueva confirmación:\n`,
      `Nombre:        ${nombre}`,
      `Apellido/s:    ${apellidos}`,
      `Asistencia:    ${data.asistencia}`,
      `Adultos:       ${adultos}`,
      `Hijos:         ${hijos}`,
      `Total personas:${adultos + hijos}`,
      `Restricciones: ${data.restricciones || "—"}`,
      `Mensaje:       ${data.mensaje       || "—"}`,
    ].join("\n"),
  });
}

// ── Helpers de respuesta ─────────────────────────────────────
function ok(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

function err_(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}