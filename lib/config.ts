// ═══════════════════════════════════════════════════
//  CONFIGURACIÓN — editá solo este archivo
// ═══════════════════════════════════════════════════

export const W = {
  bride:           "Pao",
  groom:           "Leo",
  weddingDate:     "2026-10-17T18:00:00-03:00",
  weddingDateLabel:"17 de Octubre, 2026",
  rsvpDeadline:    "17 de septiembre de 2026",
  heroPhrase:      "Dos almas que se encuentran y deciden no separarse jamás",
  introText:       "Con inmensa alegría queremos invitarte a celebrar nuestro matrimonio",
  footerMessage:   "Gracias por acompañarnos en uno de los días más importantes de nuestra vida. Su presencia hace aún más especial este momento que soñamos y esperamos con tanto amor.",
  location:        "Concepción del Uruguay, Entre Ríos",
  baseUrl:         "https://leo-paola.vercel.app", // ← cambiá por tu dominio real

  ceremony: {
    name:    "Centro Civico",
    address: "Bv. De los Constituyentes 52, Concepción del Uruguay (Terminal de omnibus)",
    time:    "16/10/2026 10:00 hs",
    note:    "",
    mapsUrl: "https://maps.app.goo.gl/yUB9QuVCkznjQtsF6",
  },
  reception: {
    name:     "Il Palatium",
    address:  "Barrio hipodromo loteo cacho silva, E3260 Concepción del Uruguay, Entre Ríos",
    time:     "17/10/2026 21:30 hs",
    cocktail: "",
    dresscode:"$45000",
    mapsUrl:  "https://maps.app.goo.gl/i8FE4fa4iCsofHmr6",
  },

  mapEmbedSrc:     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4342.022412335781!2d-58.32569542335288!3d-32.50055614949931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95afd91f2444def5%3A0x9209bc52896b0637!2sil%20palatium!5e1!3m2!1ses!2sar!4v1777662359464!5m2!1ses!2sar",
  // ── Regalos (Argentina) ────────────────────────────────
gifts: {
    alias:        "LEO.PAOLA.BODA",
    cbu:          "0000000000000000000000",
    bank:         "Banco Galicia",
    listUrl:      "#",
    honeymoonUrl: "#",
    cvu:      "ABC",          // CVU de Mercado Pago si tienen
    mpLink:   "CDA",          // Link de cobro Mercado Pago: https://mpago.la/...
    modoLink: "ASDF",          // Link de MODO: https://transferencias.modo.com.ar/...
    message: "Tu presencia es el mejor regalo para nosotros 💛. Pero, si además querés hacernos un obsequio, te dejamos algunas opciones: podés realizar una transferencia o elegir algo de nuestra lista de regalos.",
    extra: {
      icon: "🎁",
      title: "Regalos",
      description: "Si querés hacernos un regalo adicional, podés verlo acá.",
      buttonText: "Ver regalo",
      url: "/gifts",
    },
  },

  giftList: [
  {
    name: "Juego de vajilla",
    price: "$85.000",
    emoji: "🍽️",
    reserved: false,
  },
  {
    name: "Cafetera",
    price: "$120.000",
    emoji: "☕",
    reserved: false,
  },
  {
    name: "Juego de sábanas",
    price: "$65.000",
    emoji: "🛏️",
    reserved: false,
  },
  {
    name: "Freidora de aire",
    price: "$140.000",
    emoji: "🍟",
    reserved: false,
  },
],
  

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
  whatsappMessage: "¡Hola! Tengo una consulta sobre el casamiento",

  // ── Media ──────────────────────────────────────────────
  photoAlbumUrl:   "https://photos.app.goo.gl/sS3YiuNvKkYFiAdB8",
  googleDriveFolder:
  "https://drive.google.com/drive/folders/10mLwcHSG_zEArnxtQBhg-XItQ29d73fE?usp=sharing",
  appsScriptUrl:   "https://script.google.com/macros/s/AKfycbyS15ITkCllfiorfeLwC7RYMREMbqy4FgrIO9bQZK6nbP6laIwkgWkYRYyvLkxW2elVEQ/exec",
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
  {
    time: "21:30",
    title: "Recepción",
    desc: "Llegada de invitados, música y primeros brindis",
    icon: "🥂",
  },
  {
    time: "22:00",
    title: "Entrada de los novios",
    desc: "El momento más esperado de la noche",
    icon: "💍",
  },
  {
    time: "22:30",
    title: "Cena",
    desc: "Compartimos la mesa, charlas y muchas risas",
    icon: "🍽️",
  },
  {
    time: "23:45",
    title: "Brindis y torta",
    desc: "Palabras, copas arriba y algo dulce para celebrar",
    icon: "🍰",
  },
  {
  time: "00:15",
  title: "JODAAAAAA",
  desc: "Se termina la formalidad y empiezan los prohibidos 💃🕺",
  icon: "🔥",
  },
  {
    time: "00:30",
    title: "Pista explotada",
    desc: "Se afloja la corbata, salen los prohibidos y no responde nadie 😎",
    icon: "🎉",
  },
  {
    time: "02:00",
    title: "Un respiro... ponele",
    desc: "Algo dulce y de vuelta a la pista porque esto sigue 💃💃💃",
    icon: "🍰",
  },
  {
    time: "02:30",
    title: "Arranca el descontrol",
    desc: "Cumbia, cachengue, cuarteto y temazos que cantamos todos",
    icon: "🎶",
  },
] as const;

export const STORY = [
  {
    year: "2015",
    title: "Una historia inesperada",
    text:
      "Leo esperaba a la profesora de química como cualquier otro día… hasta que apareció Pao. Entre pasillos, miradas y casualidades, comenzó algo sin que ninguno lo imaginara.",
    emoji: "📚",
    side: "left" as const,
  },

  {
    year: "2019",
    title: "La primera salida",
    text:
      "Después de años cruzándose, llegó la primera cena. Nervios, risas y un beso que cambió todo para siempre.",
    emoji: "🍷",
    side: "right" as const,
  },

  {
    year: "2019",
    title: "El comienzo oficial",
    text:
      "El 21 de diciembre de 2019, Pao le preguntó a Leo si quería ser su novio. Desde ese momento, nunca más se soltaron de la mano.",
    emoji: "💞",
    side: "left" as const,
  },

  {
    year: "2020",
    title: "Compañeros de vida",
    text:
      "Entre mates, viajes, charlas interminables y miles de momentos compartidos, fueron construyendo algo mucho más grande que una historia de amor: un hogar.",
    emoji: "🧉",
    side: "right" as const,
  },

  {
    year: "2026",
    title: "La propuesta",
    text:
      "El 14 de febrero, Leo hizo la gran pregunta. Hubo lágrimas, abrazos y un “sí” que selló esta historia para siempre.",
    emoji: "💍",
    side: "left" as const,
  },

  {
    year: "2026",
    title: "Nuestro gran día",
    text:
      "Hoy, rodeados de nuestra familia y amigos, celebramos el comienzo de una nueva etapa. Gracias por acompañarnos en uno de los días más importantes de nuestra vida.",
    emoji: "🌹",
    side: "right" as const,
  },
] as const;

export const PHOTOS = [
  { src:"/1.png", alt:"Leo & Paola",      wide:true  },
  { src:"/2.png",  alt:"Retrato",          wide:false },
  { src:"/3.jpeg",  alt:"Momento especial", wide:false },
  { src:"/4.png",  alt:"Celebración",      wide:false },
  { src:"/viaje.png",  alt:"Detalles",         wide:false },
  { src:"/juntos.png",  alt:"TITULO",     wide:false },
  { src:"/juntos2.png",  alt:"TITULO",     wide:false },
  { src:"/juntos3.png",  alt:"TITULO",     wide:false },
  { src:"/juntos4.png",  alt:"TITULO",     wide:false },
  { src:"/juntos5.png",  alt:"TITULO",     wide:false },
  { src:"/juntos6.png",  alt:"TITULO",     wide:false },
  { src:"/juntos7.png",  alt:"TITULO",     wide:false },
  { src:"/moto1.png",  alt:"TITULO",     wide:false },
  { src:"/moto2.png",  alt:"TITULO",     wide:false },
  { src:"/moto3.png",  alt:"TITULO",     wide:false },
  { src:"/moto4.png",  alt:"TITULO",     wide:false },
  { src:"/playa.png",  alt:"TITULO",     wide:false },
  { src:"/viaje2.png",  alt:"TITULO",     wide:false },
  { src:"/viaje3.png",  alt:"TITULO",     wide:false },
] as const;

export const POLAROIDS = [
  { src:"/conocimos.png", caption:"Así nos conocimos", rot:-3.5 },
  { src:"/viaje.png", caption:"Primer viaje",       rot: 2.2 },
  { src:"/4.png", caption:"La propuesta 💍",   rot:-1.8 },
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

