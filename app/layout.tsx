import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { W, THEME } from "@/lib/config";

const playfair  = Playfair_Display({ subsets:["latin"], weight:["400","500","700"], style:["normal","italic"], variable:"--font-playfair", display:"swap" });
const cormorant = Cormorant_Garamond({ subsets:["latin"], weight:["300","400","500"], style:["normal","italic"], variable:"--font-cormorant", display:"swap" });
const jost      = Jost({ subsets:["latin"], weight:["200","300","400","500"], variable:"--font-jost", display:"swap" });

export const viewport: Viewport = {
  width:           "device-width",
  initialScale:    1,
  viewportFit:     "cover",
  themeColor:      "#2C1A10",
};

export const metadata: Metadata = {
  title:       `${W.bride} & ${W.groom} — ${W.weddingDateLabel}`,
  description: `Estás invitado al casamiento de ${W.bride} y ${W.groom}. ${W.weddingDateLabel} en ${W.location}.`,
  manifest:    "/manifest.json",
  appleWebApp: {
    capable:           true,
    statusBarStyle:    "black-translucent",
    title:             `${W.bride} & ${W.groom}`,
  },
  openGraph: {
    title:       `${W.bride} & ${W.groom} — Nos casamos`,
    description: `El gran día es el ${W.weddingDateLabel}. ¡Estás invitado!`,
    type:        "website",
    images:      [{ url:`${W.baseUrl}/og-invite.jpg`, width:1200, height:630 }],
  },
  icons: {
    icon:   [{ url:"/1.jpeg", sizes:"192x192", type:"image/png" }],
    apple:  [{ url:"/2.jpeg", sizes:"512x512", type:"image/png" }],
  },
};

const dataTheme = THEME === "gold-wine" ? undefined : THEME;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${cormorant.variable} ${jost.variable}`}
      {...(dataTheme ? { "data-theme": dataTheme } : {})}
    >
      <body>{children}</body>
    </html>
  );
}
