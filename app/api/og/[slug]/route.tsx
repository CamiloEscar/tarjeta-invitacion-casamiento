import { ImageResponse } from "next/og";
import { W } from "@/lib/config";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const name = decodeURIComponent(params.slug)
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#2C1A10",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent band */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 8,
          background: "linear-gradient(to right, #6B2635, #B5894E, #6B2635)",
        }} />

        {/* Bottom accent */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(to right, transparent, #B5894E, transparent)",
        }} />

        {/* Corner ornaments */}
        {[
          { top: 24, left: 24,  borderTop: "1px solid rgba(181,137,78,0.4)", borderLeft:  "1px solid rgba(181,137,78,0.4)" },
          { top: 24, right: 24, borderTop: "1px solid rgba(181,137,78,0.4)", borderRight: "1px solid rgba(181,137,78,0.4)" },
          { bottom: 24, left: 24,  borderBottom: "1px solid rgba(181,137,78,0.4)", borderLeft:  "1px solid rgba(181,137,78,0.4)" },
          { bottom: 24, right: 24, borderBottom: "1px solid rgba(181,137,78,0.4)", borderRight: "1px solid rgba(181,137,78,0.4)" },
        ].map((s, i) => (
          <div key={i} style={{ position:"absolute", width:36, height:36, ...s }} />
        ))}

        {/* Ambient glow */}
        <div style={{
          position: "absolute",
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(107,38,53,0.25) 0%, transparent 70%)",
          bottom: -200, left: "50%", transform: "translateX(-50%)",
        }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {/* "Para" label */}
          <p style={{
            fontFamily: "serif",
            fontSize: 22, color: "rgba(181,137,78,0.55)",
            letterSpacing: "0.3em", textTransform: "uppercase",
            marginBottom: 24, fontStyle: "italic",
          }}>
            Invitación para
          </p>

          {/* Guest name */}
          <p style={{
            fontFamily: "serif", fontStyle: "italic",
            fontSize: 72, fontWeight: 400, color: "#F0E8D8",
            lineHeight: 1.1, textAlign: "center",
            maxWidth: 900,
          }}>
            {name}
          </p>

          {/* Divider */}
          <div style={{
            width: 80, height: 1,
            background: "linear-gradient(to right, transparent, #B5894E, transparent)",
            margin: "28px 0",
          }} />

          {/* Couple names */}
          <p style={{
            fontFamily: "serif", fontStyle: "italic",
            fontSize: 40, color: "#CFAA70",
          }}>
            {W.bride} &amp; {W.groom}
          </p>

          {/* Date */}
          <p style={{
            fontFamily: "sans-serif", fontSize: 22,
            color: "rgba(196,168,130,0.55)",
            letterSpacing: "0.15em", textTransform: "uppercase",
            marginTop: 16,
          }}>
            {W.weddingDateLabel} · {W.location}
          </p>
        </div>
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  );
}
