import { W } from "@/lib/config";
import InviteClient, { type GuestInfo } from "./InviteClient";

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

function buildGuestFromParams(
  slug: string,
  sp?: { [key: string]: string | string[] | undefined }
): GuestInfo {
  const get = (key: string) =>
    sp ? (Array.isArray(sp[key]) ? sp[key][0] : sp[key] ?? "") : "";

  const n  = get("nombre");
  const a  = get("apellido");
  const n2 = get("nombre2");
  const a2 = get("apellido2");

  if (n && a) {
    return {
      nombre: n,
      apellido: a,
      nombre2: n2 || undefined,
      apellido2: a2 || undefined,
    };
  }

  const parts = decodeURIComponent(slug)
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1));

  // pareja simple
  if (parts.length === 4) {
    return {
      nombre: parts[0],
      apellido: parts[1],
      nombre2: parts[2],
      apellido2: parts[3],
    };
  }

  // individual
  return {
    nombre: parts[0] ?? "Invitado",
    apellido: parts.slice(1).join(" ") ?? "",
  };
}

export default function InvitePage({
  params,
  searchParams,
}: PageProps) {
  const guest = buildGuestFromParams(
    params.slug,
    searchParams
  );

  return (
    <InviteClient
      guest={guest}
      slug={params.slug}
    />
  );
}

export function generateMetadata({
  params,
  searchParams,
}: PageProps) {
  const guest = buildGuestFromParams(
    params.slug,
    searchParams
  );

  const displayName = guest.nombre2
    ? `${guest.nombre} ${guest.apellido} y ${guest.nombre2} ${guest.apellido2 ?? ""}`.trim()
    : `${guest.nombre} ${guest.apellido}`.trim();

  const title = `${displayName} — Invitación al casamiento de ${W.bride} & ${W.groom}`;

  const desc = `${W.bride} y ${W.groom} te invitan a su casamiento el ${W.weddingDateLabel} en ${W.location}.`;

  const ogImage = `${W.baseUrl}/api/og/${params.slug}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
  };
}