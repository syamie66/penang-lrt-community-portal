
import React from "react";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  ANNOUNCEMENT_CATEGORIES,
} from "../lib/data.js";

import {
  Empty,
  SectionHead,
  AnnouncementCard,
} from "../components/Common.jsx";


// =====================================================
// CONSTRUCTION ANNOUNCEMENTS
// MODULE 1: PUBLIC USER VIEW
// =====================================================

export default function ConstructionAnnouncements({
  filteredAnnouncements,
  announcementSearch,
  setAnnouncementSearch,
  announcementCategory,
  setAnnouncementCategory,
  setSelectedAnnouncement,
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

      {/* PAGE HEADING */}
      <SectionHead
        eyebrow="Stay informed"
        title="Construction Announcements"
        description="Browse notices by category or search for a location, title or construction topic."
      />

      {/* SEARCH AND CATEGORY FILTER */}
      <div className="panel mb-8 grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_240px]">

        {/* SEARCH INPUT */}
        <div
          className="
            flex min-w-0 w-full items-center gap-3
            rounded-xl border border-slate-200
            bg-white px-4
            transition
            focus-within:border-[#073b78]
            focus-within:ring-2
            focus-within:ring-blue-100
          "
        >
          <Search
            size={20}
            aria-hidden="true"
            className="shrink-0 text-slate-400"
          />

          <input
            type="search"
            aria-label="Search announcements"
            placeholder="Search announcements or locations..."
            value={announcementSearch}
            onChange={(event) =>
              setAnnouncementSearch(event.target.value)
            }
            className="
              block min-w-0 w-full flex-1
              border-0 bg-transparent
              py-3 text-sm text-navy
              outline-none
              placeholder:text-slate-400
              focus:border-0
              focus:outline-none
              focus:ring-0
            "
          />
        </div>

        {/* CATEGORY FILTER */}
        <select
          aria-label="Filter announcements by category"
          className="field min-w-0 w-full"
          value={announcementCategory}
          onChange={(event) =>
            setAnnouncementCategory(event.target.value)
          }
        >
          <option value="All categories">
            All categories
          </option>

          {ANNOUNCEMENT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* RESULTS COUNT */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500">
        <span>
          {filteredAnnouncements.length} announcement(s) found
        </span>

        <span className="flex items-center gap-1">
          <SlidersHorizontal size={14} />
          Filtered results
        </span>
      </div>

      {/* ANNOUNCEMENT CARDS */}
      {filteredAnnouncements.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              item={announcement}
              onOpen={setSelectedAnnouncement}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No announcements found"
          description="Try another search term or select a different category."
        />
      )}

    </section>
  );
}
