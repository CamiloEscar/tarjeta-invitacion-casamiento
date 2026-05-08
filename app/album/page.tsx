"use client";

import { W } from "@/lib/config";

function AlbumCard({ qrSrc }: { qrSrc: string }) {
  return (
    <div
      className="album-card"
      style={{
        width: "100%",
        maxWidth: 340,
        height: 520,
        background: "#fff",
        border: "1px solid #d8c7ae",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.8rem 1.4rem",
      }}
    >
      {/* glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top, rgba(181,137,78,0.05), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      {/* content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* top */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.5rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#1a1a1a",
              marginBottom: "0.8rem",
            }}
          >
            Álbum del evento
          </p>

          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "2rem",
              lineHeight: 1.05,
              color: "#1a1a1a",
              marginBottom: "0.7rem",
            }}
          >
            Compartí
            <br />
            tus fotos
          </h1>

          <div
            style={{
              width: 36,
              height: 1,
              background: "rgba(181,137,78,0.4)",
              margin: "0 auto",
            }}
          />
        </div>

        {/* qr */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(181,137,78,0.2)",
            }}
          >
            {[
              {
                top: 0,
                left: 0,
                borderTop: "2px solid var(--c-wine)",
                borderLeft: "2px solid var(--c-wine)",
              },
              {
                top: 0,
                right: 0,
                borderTop: "2px solid var(--c-wine)",
                borderRight: "2px solid var(--c-wine)",
              },
              {
                bottom: 0,
                left: 0,
                borderBottom: "2px solid var(--c-wine)",
                borderLeft: "2px solid var(--c-wine)",
              },
              {
                bottom: 0,
                right: 0,
                borderBottom: "2px solid var(--c-wine)",
                borderRight: "2px solid var(--c-wine)",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 18,
                  height: 18,
                  ...s,
                }}
              />
            ))}

            <img
              src={qrSrc}
              alt="QR álbum"
              style={{
                width: 190,
                height: 190,
                display: "block",
                background: "white",
              }}
            />
          </div>
        </div>

        {/* bottom */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "1rem",
              lineHeight: 1.55,
              color: "#3a3128",
              marginBottom: "1rem",
            }}
          >
            Escaneá el QR y subí las fotos del día
          </p>

          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.4rem",
              flexWrap: "wrap",
              marginBottom: "1.1rem",
            }}
          >
            {["📱 Galería", "📷 Cámara"].map((t, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "0.5rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8b6b47",
                  border: "1px solid rgba(139,107,71,0.22)",
                  padding: "0.28rem 0.5rem",
                }}
              >
                {t}
              </span>
            ))}
          </div> */}

          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "0.52rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#9b7a52",
            }}
          >
            {W.bride} & {W.groom}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AlbumPage() {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
  W.photoAlbumUrl
)}&color=2C1A10&bgcolor=FFFFFF&margin=14&qzone=1`;

  return (
    <main
        className="print-root"
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "2rem",
      }}
    >
      <style>{`
  @page {
    size: A4;
    margin: 10mm;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  @media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
    html,
    body {
      background: white !important;
      width: 100%;
      height: auto;
      overflow: visible !important;
    }

    body * {
      visibility: hidden;
    }

    .print-root,
    .print-root * {
      visibility: visible;
    }

    .print-root {
      position: absolute;
      inset: 0;
      padding: 0 !important;
      margin: 0 !important;
      background: white !important;
    }

    .print-grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10mm !important;
      align-items: start;
    }

    .album-card {
      display: flex !important;
      visibility: visible !important;
      break-inside: avoid;
      page-break-inside: avoid;
      width: 100% !important;
      max-width: none !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`}</style>

      <div
        className="print-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <AlbumCard key={i} qrSrc={qrSrc} />
        ))}
      </div>
    </main>
  );
}