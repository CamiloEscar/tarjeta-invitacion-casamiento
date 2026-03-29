import { W } from "@/lib/config";
import InviteClient from "./InviteClient";

export default function InvitePage({ params }: { params: { slug: string } }) {
  const name = decodeURIComponent(params.slug)
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return <InviteClient guestName={name} slug={params.slug} />;
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const name = decodeURIComponent(params.slug)
    .split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const title = `${name} — Invitación al casamiento de ${W.bride} & ${W.groom}`;
  const desc  = `${W.bride} y ${W.groom} te invitan a su casamiento el ${W.weddingDateLabel} en ${W.location}. ¡Confirmá tu asistencia!`;

  // Use the server-generated OG image
  const ogImage = `${W.baseUrl}/api/og/${params.slug}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}
