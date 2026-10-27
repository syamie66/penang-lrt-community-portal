
import React from "react";

import {
  TrainFront,
  ArrowRight,
  Megaphone,
  MessageSquareText,
  MapPin,
} from "lucide-react";

// Shared components
import {
  SectionHead,
  AnnouncementCard,
} from "../components/Common.jsx";

// Horizontal LRT station component
import StationLine from "../components/StationLine.jsx";

// Utility functions
import { formatDate } from "../lib/data.js";


// =====================================================
// HOME PAGE COMPONENT
// =====================================================

export default function Home({
  announcements,
  feedback,
  featured,
  goto,
  setSelectedAnnouncement,
}) {

  // Get the three most recent announcements
  const latestAnnouncements = [...announcements]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <>

      {/* ============================================= */}
      {/* SECTION 1: FEATURED ANNOUNCEMENT */}
      {/* ============================================= */}

      {featured && (
        <section className="bg-[#e9f5f2] px-5 py-12 lg:px-8">

          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">

            {/* Announcement information */}
            <div className="flex items-start gap-4">

              <div className="rounded-xl bg-teal p-3 text-white">
                <Megaphone size={25} />
              </div>

              <div>

                <p className="text-xs font-extrabold uppercase tracking-widest text-teal">
                  Featured announcement
                </p>

                <h3 className="mt-2 text-xl font-extrabold">
                  {featured.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600">

                  <MapPin
                    size={15}
                    className="mr-1 inline"
                  />

                  {featured.location}

                  <span className="mx-2">·</span>

                  {formatDate(featured.date)}

                </p>

              </div>

            </div>

            {/* View announcement button */}
            <button
              type="button"
              onClick={() => setSelectedAnnouncement(featured)}
              className="primary shrink-0"
            >
              View notice
              <ArrowRight size={17} />
            </button>

          </div>

        </section>
      )}


      {/* ============================================= */}
      {/* SECTION 2: HERO / WELCOME SECTION */}
      {/* ============================================= */}

      <section className="relative overflow-hidden bg-navy text-white">

        {/* Background decoration */}
        <div className="subtle-grid absolute inset-0 opacity-70" />

        <div className="absolute -right-28 top-5 h-96 w-96 rounded-full border-[70px] border-teal/25" />

        <div className="absolute bottom-[-220px] right-52 h-96 w-96 rounded-full border-[65px] border-white/5" />


        {/* Main hero container */}
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:py-24 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:px-8">

          {/* ----------------------------------------- */}
          {/* LEFT: WELCOME MESSAGE */}
          {/* ----------------------------------------- */}

          <div>

            {/* Hero badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-[#bbf1e8]">

              <span className="h-2 w-2 rounded-full bg-[#72dfc6]" />

              BUILDING BETTER CONNECTIONS

            </span>


            {/* Main heading */}
            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[56px]">

              Your community.
              <br />

              <span className="text-[#79dfca]">
                Your line.
              </span>

              <br />

              Your voice.

            </h1>


            {/* Introduction */}
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">

              Stay informed about construction activity,
              understand potential disruptions, and share
              your feedback — all in one community portal.

            </p>


            {/* Hero buttons */}
            <div className="mt-9 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => goto("announcements")}
                className="primary bg-[#76dfca] text-navy hover:bg-white"
              >

                <Megaphone size={18} />

                View announcements

                <ArrowRight size={17} />

              </button>


              <button
                type="button"
                onClick={() => goto("submit")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >

                <MessageSquareText size={18} />

                Share feedback

              </button>

            </div>

          </div>


          {/* ----------------------------------------- */}
          {/* RIGHT: PROJECT SNAPSHOT */}
          {/* ----------------------------------------- */}

          <div className="relative mx-auto w-full max-w-md">

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">

              {/* Snapshot heading */}
              <div className="flex items-center justify-between">

                <span className="text-xs font-bold uppercase tracking-[.18em] text-[#9de7d9]">
                  PROJECT SNAPSHOT
                </span>

                <TrainFront
                  size={22}
                  className="text-[#8ce5d5]"
                />

              </div>


              {/* Mutiara Line information card */}
              <div className="mt-7 rounded-2xl bg-white p-6 text-navy">

                <div className="flex items-center justify-between">

                  <h3 className="text-lg font-extrabold">
                    Mutiara Line
                  </h3>

                  <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-teal">
                    Penang
                  </span>

                </div>


                <p className="mt-2 text-xs leading-5 text-slate-500">

                  Community information and construction engagement

                </p>


                {/* Decorative route graphic */}
                <div className="mt-7 flex items-center justify-between gap-2">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-teal">
                    <MapPin />
                  </div>

                  <div className="h-1 flex-1 rounded-full bg-teal/25" />

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-teal">
                    <TrainFront />
                  </div>

                  <div className="h-1 flex-1 rounded-full bg-teal/25" />

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mint text-teal">
                    <MapPin />
                  </div>

                </div>


                <p className="mt-5 text-center text-xs font-semibold text-slate-500">

                  Stay updated · Report issues · Track progress

                </p>

              </div>


              {/* ------------------------------------- */}
              {/* PROJECT STATISTICS */}
              {/* ------------------------------------- */}

              <div className="mt-4 grid grid-cols-2 gap-3">

                {/* Announcement count */}
                <div className="rounded-xl bg-white/10 p-4">

                  <p className="text-3xl font-extrabold">
                    {announcements.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    Announcements
                  </p>

                </div>


                {/* Feedback count */}
                <div className="rounded-xl bg-white/10 p-4">

                  <p className="text-3xl font-extrabold">
                    {feedback.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    Demo reports
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ============================================= */}
      {/* SECTION 3: HORIZONTAL LRT STATION LINE */}
      {/* ============================================= */}

      <StationLine />


      {/* ============================================= */}
      {/* SECTION 4: LATEST CONSTRUCTION ANNOUNCEMENTS */}
      {/* ============================================= */}

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

        {/* Section heading */}
        <SectionHead
          eyebrow="Latest notices"
          title="Construction updates"
          description="Recent announcements from the demonstration dataset."
          action={
            <button
              type="button"
              onClick={() => goto("announcements")}
              className="secondary"
            >
              All announcements
              <ArrowRight size={16} />
            </button>
          }
        />


        {/* Announcement cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {latestAnnouncements.map((announcement) => (

            <AnnouncementCard
              key={announcement.id}
              item={announcement}
              onOpen={setSelectedAnnouncement}
            />

          ))}

        </div>

      </section>

    </>
  );
}
