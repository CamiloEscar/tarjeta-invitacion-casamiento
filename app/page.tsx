import Envelope      from "@/components/sections/Envelope";
import Petals        from "@/components/ui/Petals";
import Navbar        from "@/components/ui/Navbar";
import Sep           from "@/components/ui/SectionSep";
import Hero          from "@/components/sections/Hero";
import Intro         from "@/components/sections/Intro";
import Story         from "@/components/sections/Story";
import EventInfo     from "@/components/sections/EventInfo";
import Timeline      from "@/components/sections/Timeline";
import MapSection    from "@/components/sections/MapSection";
import RSVP          from "@/components/sections/RSVP";
import MusicRequest  from "@/components/sections/MusicRequest";
import PhotoCarousel from "@/components/sections/PhotoCarousel";
import Trivia        from "@/components/sections/Trivia";
import PhotoAlbum    from "@/components/sections/PhotoAlbum";
import Gifts         from "@/components/sections/Gifts";
import DressCode     from "@/components/sections/DressCode";
import CalendarAdd   from "@/components/sections/CalendarAdd";
import Contact       from "@/components/sections/Contact";
import Footer        from "@/components/sections/Footer";
import QRButton      from "@/components/ui/QRButton";
import Logistics     from "@/components/sections/Logistics";

export default function Page() {
  return (
    <>
      <Envelope />
      <Petals />
      <Navbar />
      <main>
        {/* Hero (dark bg image) → flows directly into Intro (dark) — NO separator, same surface */}
        <Hero />
        <Intro />
        {/* dark → linen */}
        <Sep from="dark" to="linen" />

        {/* Story (linen) → EventInfo (warm) */}
        <Story />
        <Sep from="linen" to="warm" />

        {/* EventInfo (warm) → Timeline (dark) */}
        <EventInfo />
        <Sep from="warm" to="dark" />

        {/* Timeline (dark) → Map (linen) */}
        <Timeline />
        <Sep from="dark" to="linen" />

        {/* Map (linen) → Logistics (warm) */}
        <MapSection />
        <Sep from="linen" to="warm" />

        {/* Logistics (warm) → RSVP (dark) */}
        <Logistics />
        <Sep from="warm" to="dark" />

        {/* RSVP (dark) → Music (linen) */}
        <RSVP />
        <Sep from="dark" to="linen" />

        {/* Music (linen) → PhotoCarousel (dark) */}
        <MusicRequest />
        <Sep from="linen" to="dark" />

        {/* PhotoCarousel (dark) → Trivia (dark-2) */}
        <PhotoCarousel />
        <Sep from="dark" to="dark-2" />

        {/* Trivia (dark-2) → PhotoAlbum (sand) */}
        <Trivia />
        <Sep from="dark-2" to="sand" />

        {/* PhotoAlbum (sand) → Gifts (dark-2) */}
        <PhotoAlbum />
        <Sep from="sand" to="dark-2" />

        {/* Gifts (dark-2) → DressCode (sand) */}
        <Gifts />
        <Sep from="dark-2" to="sand" />

        {/* DressCode (sand) → CalendarAdd (warm) */}
        <DressCode />
        <Sep from="sand" to="warm" />

        {/* CalendarAdd (warm) → Contact (dark) */}
        <CalendarAdd />
        <Sep from="warm" to="dark" />

        {/* Contact (dark) → Footer (dark) — same surface, no separator */}
        <Contact />
      </main>
      <Footer />
      {/* <QRButton /> */}
    </>
  );
}
