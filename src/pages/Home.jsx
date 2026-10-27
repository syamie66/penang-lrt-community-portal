import React from "react";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Construction,
  MapPin,
  Megaphone,
  MessageSquareText,
  Route,
  TrainFront,
  Users,
} from "lucide-react";

import { AnnouncementCard, SectionHead } from "../components/Common.jsx";
import StationLine from "../components/StationLine.jsx";
import { formatDate } from "../lib/data.js";

// =====================================================
// HOMEPAGE IMAGE ASSETS
// Add matching photographs under public/images/.
// =====================================================
const IMAGES = {
  hero: "/images/penang-lrt-hero.jpg",
  construction: "/images/lrt-construction.jpg",
  station: "/images/lrt-station.jpg",
  line: "/images/lrt-track.jpg",
};

const SERVICES = [
  {
    id: "announcements",
    title: "Announcements",
    description: "Get construction notices, road closures, and important updates.",
    image: IMAGES.construction,
    icon: Megaphone,
    color: "red",
    destination: "announcements",
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Report disruptions and share concerns about your neighbourhood.",
    image: IMAGES.station,
    icon: MessageSquareText,
    color: "blue",
    destination: "submit",
  },
  {
    id: "tracking",
    title: "Track Feedback",
    description: "Check your submitted feedback and administrator updates by email.",
    image: IMAGES.line,
    icon: ClipboardList,
    color: "red",
    destination: "track",
  },
];

// =====================================================
// MAGAZINE-STYLE SERVICE CARD
// =====================================================
function ServiceCard({ service, goto }) {
  const Icon = service.icon;
  const isRed = service.color === "red";
  const panelColor = isRed ? "bg-[#d91d36]" : "bg-[#073b78]";
  const iconColor = isRed ? "text-[#d91d36]" : "text-[#073b78]";

  return (
    <button
      type="button"
      onClick={() => goto(service.destination)}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-white text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#073b78]"
    >
      <div className="h-48 w-full overflow-hidden bg-slate-200 sm:h-56">
        <img
          src={service.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className={`relative flex min-h-56 flex-1 flex-col items-center px-6 pb-8 pt-14 text-center text-white ${panelColor}`}>
        <span className="absolute -top-10 flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-white bg-white shadow-md">
          <Icon size={32} className={iconColor} aria-hidden="true" />
        </span>

        <h3 className="text-2xl font-extrabold">{service.title}</h3>
        <p className="mt-3 max-w-xs text-sm leading-6 text-white/90">
          {service.description}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold">
          Explore <ArrowRight size={17} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}

// =====================================================
// QUICK-ACCESS TILE
// =====================================================
function QuickAccessTile({ icon: Icon, title, subtitle, destination, goto, blue = false }) {
  return (
    <button
      type="button"
      onClick={() => goto(destination)}
      className={`group flex min-w-0 items-center gap-4 rounded-lg border-b-4 p-5 text-left transition hover:-translate-y-1 hover:shadow-md ${
        blue
          ? "border-[#0758ad] bg-[#eaf4ff]"
          : "border-[#d91d36] bg-[#fff1f3]"
      }`}
    >
      <Icon
        size={36}
        aria-hidden="true"
        className={`shrink-0 ${blue ? "text-[#0758ad]" : "text-[#d91d36]"}`}
      />
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold text-[#092b4c]">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-600">{subtitle}</span>
      </span>
      <ArrowRight
        size={19}
        aria-hidden="true"
        className={`shrink-0 ${blue ? "text-[#0758ad]" : "text-[#d91d36]"}`}
      />
    </button>
  );
}

// =====================================================
// HOME PAGE
// =====================================================
export default function Home({
  announcements = [],
  feedback = [],
  featured,
  goto,
  setSelectedAnnouncement,
}) {
  const latestAnnouncements = [...announcements]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 3);

  const roadNotice = announcements.find((item) =>
    /alternative.*(road|walking|route)|road.*diversion|walking.*route/i.test(
      `${item.title} ${item.category}`
    )
  );

  const openRoadNotice = () => {
    if (roadNotice) {
      setSelectedAnnouncement(roadNotice);
    } else {
      goto("announcements");
    }
  };

  return (
    <>
      {/* 1. FEATURED ANNOUNCEMENT - remain above the hero */}
      { (roadNotice || featured) && (
        <section className="border-b border-red-100 bg-[#fff1f3] px-5 py-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-start gap-4">
              <span className="rounded-xl bg-[#d91d36] p-3 text-white">
                <Megaphone size={24} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#c41630]">
                  Featured Announcement
                </p>
                <h2 className="mt-2 break-words text-lg font-extrabold text-[#092b4c] sm:text-xl">
                  Alternative Road & Walking Route Information
                </h2>
                {roadNotice ? (
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={15} aria-hidden="true" /> {roadNotice.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={15} aria-hidden="true" /> {formatDate(roadNotice.date)}
                    </span>
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">
                    View announcements for available access and diversion notices.
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={openRoadNotice}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#d91d36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b81029]"
            >
              View Notice <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      {/* 2. HERO: add the hero photo to public/images */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-[#073b78] text-white lg:min-h-[650px]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url('${IMAGES.hero}')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071d39]/95 via-[#073b78]/80 to-[#073b78]/30" />

        <div className="mx-auto w-full max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border-l-4 border-[#ee2947] bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
              <TrainFront size={19} aria-hidden="true" /> Penang Rail Transit
            </div>
            <h1 className="mt-8 text-5xl font-black uppercase leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              PENANG <span className="text-[#ff354e]">LRT</span>
            </h1>
            <p className="mt-3 text-xl font-bold uppercase tracking-[0.28em] sm:text-3xl">
              Mutiara Line
            </p>
            <span className="mt-7 inline-block -skew-x-12 bg-[#d91d36] px-7 py-3 text-sm font-bold uppercase tracking-[0.18em]">
              <span className="block skew-x-12">Community Portal</span>
            </span>
            <p className="mt-8 max-w-xl text-base leading-8 text-slate-100">
              Your community. Your line. Your voice. Stay informed about construction
              activities, understand access changes, and share feedback in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goto("announcements")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#d91d36] px-5 py-3 text-sm font-bold text-white hover:bg-[#b81029]"
              >
                <Megaphone size={18} aria-hidden="true" /> View Announcements
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goto("submit")}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-5 py-3 text-sm font-bold text-white hover:bg-white hover:text-[#073b78]"
              >
                <MessageSquareText size={18} aria-hidden="true" /> Share Feedback
              </button>
            </div>
            <p className="mt-8 text-xs text-white/75">
              Academic demonstration portal · Not an official project website
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-[#d91d36] via-white to-[#0758ad]" />
      </section>

      {/* 3. THREE MAGAZINE-STYLE COMMUNITY SERVICE CARDS */}
      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#0758ad]">
              Community Services
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              <span className="text-[#073b78]">Connected </span>
              <span className="text-[#d91d36]">Communities</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Construction updates, community feedback and feedback tracking
              for the Penang LRT Mutiara Line.
            </p>
            <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
              <span className="h-1 w-10 bg-[#0758ad]" />
              <span className="h-1 w-10 bg-[#d91d36]" />
              <span className="h-1 w-10 bg-[#0758ad]" />
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} goto={goto} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMMUNITY ENGAGEMENT STRIP */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0758ad] to-[#052c61] px-5 py-20 text-center text-white lg:px-8">
        <div className="pointer-events-none absolute -left-28 -top-24 h-72 w-72 rounded-full border-[45px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-36 -right-24 h-80 w-80 rounded-full border-[50px] border-white/5" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
            Community Engagement
          </p>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
            Together for a Better <span className="text-[#ff5067]">Penang</span>
          </h2>
          <div className="mx-auto mt-6 h-1 w-24 bg-[#ff5067]" />
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-blue-100">
            Open dialogue, shared progress, and a more connected future
            during construction of the Mutiara Line.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-6 text-sm text-white/85">
            <span>{announcements.length} announcements</span>
            <span>{feedback.length} demo reports in this browser</span>
          </div>
        </div>
      </section>

      {/* 5. EXISTING HORIZONTAL STATION DIAGRAM */}
      <div className="bg-[#f4f8fc] py-4">
        <StationLine />
      </div>

      {/* 6. EXISTING LATEST ANNOUNCEMENT CARDS */}
      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHead
            eyebrow="Latest Notices"
            title="Construction Updates"
            description="Recent construction notices from the demonstration dataset."
            action={
              <button
                type="button"
                onClick={() => goto("announcements")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#073b78] px-5 py-3 text-sm font-bold text-white hover:bg-[#0758ad]"
              >
                All Announcements <ArrowRight size={17} aria-hidden="true" />
              </button>
            }
          />
          {latestAnnouncements.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {latestAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  item={announcement}
                  onOpen={setSelectedAnnouncement}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-slate-50 p-10 text-center text-slate-600">
              No announcements have been published yet.
            </p>
          )}
        </div>
      </section>

      {/* 7. QUICK ACCESS TILES */}
      <section className="bg-[#f4f8fc] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-[#073b78] sm:text-3xl">
            Explore More
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            <QuickAccessTile
              icon={Construction}
              title="Construction Updates"
              subtitle="Read construction and road access notices"
              destination="announcements"
              goto={goto}
            />
            <QuickAccessTile
              icon={Users}
              title="Community Voice"
              subtitle="Submit feedback about construction impacts"
              destination="submit"
              goto={goto}
              blue
            />
            <QuickAccessTile
              icon={Route}
              title="Track Your Feedback"
              subtitle="Find your reports using your email address"
              destination="track"
              goto={goto}
            />
          </div>
          <p className="mt-12 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            People · Connections · Brighter Tomorrows
          </p>
        </div>
      </section>
    </>
  );
}
