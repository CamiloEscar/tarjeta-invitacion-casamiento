// ═══════════════════════════════════════════════════
//  CONFIGURACIÓN — editá solo este archivo
// ═══════════════════════════════════════════════════

export const W = {
  bride:           "Pao",
  groom:           "Leo",
  weddingDate:     "2026-10-12T18:00:00-03:00",
  weddingDateLabel:"12 de Octubre, 2026",
  rsvpDeadline:    "12 de septiembre de 2026",
  heroPhrase:      "Dos almas que se encuentran y deciden no separarse jamás",
  introText:       "Con alegría enorme queremos que seas parte del día más lindo de nuestras vidas",
  footerMessage:   "Gracias por acompañarnos. Que estés acá significa todo para nosotros.",
  location:        "Concepción del Uruguay, Entre Ríos",
  baseUrl:         "https://6bda-190-225-197-25.ngrok-free.app",

  ceremony: {
    name:    "Nombre IGLESIA",
    address: "Galarza 130, Concepción del Uruguay",
    time:    "18:00 hs",
    note:    "Se ruega llegar a las 17:30 hs",
    mapsUrl: "https://maps.google.com/?q=Basilica+Inmaculada+Concepcion+Galarza+130+Concepcion+del+Uruguay",
  },
  reception: {
    name:     "Salon NOMBRE",
    address:  "Ruta 39 — Concepción del Uruguay",
    time:     "20:30 hs",
    cocktail: "Cocktail desde las 20:00 hs",
    dresscode:"Formal elegante · sin blanco, por favor 🙏",
    mapsUrl:  "https://maps.google.com/?q=Concepcion+del+Uruguay+Entre+Rios",
  },

  mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26876.26!2d-58.2416!3d-32.4826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95afefaef7a9a16d%3A0xd9a0a4f3c8e8a1e0!2sConcepci%C3%B3n+del+Uruguay%2C+Entre+R%C3%ADos!5e0!3m2!1ses!2sar!4v1700000000000",

  // ── Regalos (Argentina) ────────────────────────────────
  gifts: {
    alias:    "LEO.PAOLA.BODA",
    cbu:      "0000000000000000000000",
    bank:     "Banco Galicia",
    cvu:      "ABC",          // CVU de Mercado Pago si tienen
    mpLink:   "CDA",          // Link de cobro Mercado Pago: https://mpago.la/...
    modoLink: "ASDF",          // Link de MODO: https://transferencias.modo.com.ar/...
    message:  "Si querés hacernos un regalo, la forma más fácil es una transferencia. ¡Con lo que puedas ya es más que suficiente para nosotros!",
  },

  // ── Logística ──────────────────────────────────────────
  logistics: {
    show: true,   // false = oculta la sección
    distanceKm: 8, // km entre iglesia y salón
    shuttle: {
      available: true,
      info: "Si necesitas movilidad habrá un auto gratuito desde al salón a las 19:30 hs. Anotate en el formulario de confirmación.",
    },
    parking: {
      available: true,
      info: "Estacionamiento en el salón. Capacidad para 80 autos.",
    },
    hotels: [
      { name: "Gran Hotel CDU",     stars: 4, url: "https://maps.google.com/?q=Gran+Hotel+Concepcion+del+Uruguay", distance: "5 min del centro" },
      { name: "Hotel Palatino",     stars: 3, url: "https://maps.google.com/?q=Hotel+Palatino+Concepcion+del+Uruguay", distance: "frente a la plaza" },
      { name: "Complejo Rivadavia", stars: 3, url: "https://maps.google.com/?q=Complejo+Rivadavia+Concepcion+del+Uruguay", distance: "sobre el río" },
    ],
    remis: [
      { name: "Remis Servi Mas", tel: "+5434427777" },
      { name: "Remiseria Voy!",   tel: "+543442322000" },
    ],
    fromBsAs: "El trayecto desde Buenos Aires es aprox. 4 hs en auto por Ruta 14. También hay ómnibus directos desde Retiro (empresa Flecha Bus, aprox. 4.5 hs).",
    fromRosario: "Desde Rosario son aprox. 3 hs en auto por la Ruta 18.",
  },

  // ── Modo día del casamiento ────────────────────────────
  // "auto"   → detecta automáticamente cuando llegue la fecha
  // "party"  → forzar modo fiesta (para testear)
  // "normal" → siempre modo normal
  dayMode: "auto" as "auto" | "party" | "normal",

  // ── PIN admin (para /admin) ────────────────────────────
  // Cambiar por un número de 4+ dígitos. No es seguridad bancaria,
  // solo evita que un invitado entre sin querer.
  adminPin: "1012",  // ← cambiar por mes+día de la boda u otro número fácil de recordar

  // ── WhatsApp y contacto ────────────────────────────────
  whatsapp:        "5493442000000",
  whatsappMessage: "¡Hola! Tengo una consulta sobre el casamiento de Paola y Leo 💌",

  // ── Media ──────────────────────────────────────────────
  photoAlbumUrl:   "https://photos.app.goo.gl/sS3YiuNvKkYFiAdB8",
  appsScriptUrl:   "https://script.google.com/macros/s/AKfycbyK0JKAeMu_IZxjppLtfXdp6Jx7liQSP98hkPYmbI72V2OtD_2lHrO7q3fMaXXeDVvf_A/exec",
  spotifyEmbedSrc: "https://open.spotify.com/embed/playlist/37i9dQZF1DX2sUQwD7tbmL?utm_source=generator&theme=0",

  heroVideo:    "/boda.mp4" as string,
  heroBgImage:  "" as string,
  heroFilter:   "romance" as "romance" | "cinema" | "soft" | "dark",
} as const;

// ── Tema de color ──────────────────────────────────────────────
export type ThemeName = "gold-wine" | "sage-ivory" | "dusty-rose" | "navy-champagne" | "emerald-gold";
export const THEME: ThemeName = "gold-wine";

// ── Agenda ────────────────────────────────────────────────────
export const AGENDA = [
  { time:"18:00", title:"Ceremonia",   desc:"Basílica de la Inmaculada",        icon:"⛪" },
  { time:"19:00", title:"Fotos",       desc:"Jardines de la estancia",           icon:"📸" },
  { time:"20:00", title:"Cocktail",    desc:"Espumante, canapés y música",       icon:"🥂" },
  { time:"20:30", title:"Cena",        desc:"Menú de 4 pasos · opciones veggie", icon:"🍽️" },
  { time:"22:30", title:"Fiesta",      desc:"DJ · cumbia, pop, electrónica",     icon:"🎶" },
  { time:"00:00", title:"Barra libre", desc:"Brindis, torta y sorpresas ✨",      icon:"🍾" },
] as const;

export const STORY = [
  { year:"2018", title:"Un encuentro inesperado", text:"Una noche de verano en una reunión de amigos. Nadie lo planeó, pero el destino tenía sus propios planes.", emoji:"☕", side:"left"  as const },
  { year:"2020", title:"Nuestro primer viaje",    text:"Patagonia. Cerro Torre. Mates al amanecer y ese frío que hace que te abraces más fuerte.",               emoji:"✈️", side:"right" as const },
  { year:"2023", title:"La propuesta",            text:"Él tenía el anillo escondido desde hacía tres meses. Ella dijo que sí antes de que terminara la pregunta.", emoji:"💍", side:"left" as const },
  { year:"2026", title:"El gran día",             text:"Rodeados de las personas que más queremos, comenzamos el capítulo más hermoso de nuestra historia.",       emoji:"🌹", side:"right" as const },
] as const;

export const PHOTOS = [
  { src:"/1.jpeg", alt:"Leo & Paola",      wide:true  },
  { src:"/2.jpeg",  alt:"Retrato",          wide:false },
  { src:"/3.jpeg",  alt:"Momento especial", wide:false },
  { src:"/4.jpeg",  alt:"Celebración",      wide:false },
  { src:"/1.jpeg",  alt:"Detalles",         wide:false },
  { src:"/2.jpeg",  alt:"Primer baile",     wide:false },
] as const;

export const POLAROIDS = [
  { src:"/2.jpeg", caption:"Así nos conocimos", rot:-3.5 },
  { src:"/3.jpeg", caption:"Primer viaje",       rot: 2.2 },
  { src:"/4.jpeg", caption:"La propuesta 💍",   rot:-1.8 },
] as const;

export const TRIVIA = [
  { question:"¿Dónde se conocieron Leo y Paola?", options:["En el trabajo","En una reunión de amigos","En un viaje","En la universidad"], correct:1, fun:"¡Fue en una reunión de amigos en común! Ninguno lo planeó 💫" },
  { question:"¿A qué destino fue su primer viaje?", options:["Brasil","Bariloche","Patagonia","Mendoza"], correct:2, fun:"¡Patagonia! Cerro Torre, mates y ese frío que acerca ❤️" },
  { question:"¿Cuánto tiempo tuvo Leo el anillo antes de proponer?", options:["1 semana","1 mes","3 meses","6 meses"], correct:2, fun:"¡3 meses guardando el secreto! Tremendo poker face 💍" },
  { question:"¿En qué año empieza la historia de Leo y Paola?", options:["2016","2017","2018","2019"], correct:2, fun:"¡2018! El año que cambió todo para ellos 🌟" },
] as const;

export const SUGGESTED_SONGS = [
  { title:"Perfect",           artist:"Ed Sheeran",      emoji:"🎵" },
  { title:"Thinking Out Loud", artist:"Ed Sheeran",      emoji:"🎶" },
  { title:"A Thousand Years",  artist:"Christina Perri", emoji:"💕" },
  { title:"Can't Help Falling",artist:"Elvis Presley",   emoji:"🎸" },
  { title:"Bésame Mucho",      artist:"Tradicional",     emoji:"🌹" },
] as const;
