
import React from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  Megaphone,
} from "lucide-react";

// Utility functions
import {
  formatDate,
} from "../lib/data.js";

// Reusable components
import {
  CategoryPill,
  SectionHead,
} from "../components/Common.jsx";


// =====================================================
// ANNOUNCEMENT MANAGEMENT COMPONENT
// MODULE 3: ADMINISTRATOR
// =====================================================

export default function AnnouncementManagement({
  setEditing,
  filteredAdmin,
  adminSearch,
  setAdminSearch,
  setSelectedAnnouncement,
  setDeleteTarget,
}) {

  // =====================================================
  // USER INTERFACE
  // =====================================================

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

      {/* ============================================= */}
      {/* PAGE HEADING */}
      {/* ============================================= */}

      <SectionHead
        eyebrow="Content Management"
        title="Manage Announcements"
        description="Create, edit and delete the notices shown to community members."
        action={

          <button
            type="button"
            onClick={() => setEditing(null)}
            className="primary"
          >

            <Plus size={18} />

            New Announcement

          </button>

        }
      />


      {/* ============================================= */}
      {/* MAIN ANNOUNCEMENT PANEL */}
      {/* ============================================= */}

      <div className="panel overflow-hidden">

        {/* ========================================== */}
        {/* SEARCH SECTION */}
        {/* ========================================== */}

        <div className="border-b border-slate-100 p-5">

          <div
            className="
              flex w-full max-w-md items-center gap-3
              rounded-xl border border-slate-200
              bg-white px-4
              transition
              focus-within:border-[#073b78]
              focus-within:ring-2
              focus-within:ring-blue-100
            "
          >

            {/* Search icon */}
            <Search
              size={20}
              aria-hidden="true"
              className="shrink-0 text-slate-400"
            />

            {/* Search input */}
            <input
              type="search"
              aria-label="Search managed announcements"
              placeholder="Search announcements..."
              value={adminSearch}
              onChange={(event) =>
                setAdminSearch(event.target.value)
              }
              className="
                min-w-0 w-full flex-1
                border-0 bg-transparent
                py-3 text-sm text-navy
                outline-none
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-0
              "
            />

          </div>

        </div>


        {/* ========================================== */}
        {/* ANNOUNCEMENT LIST */}
        {/* ========================================== */}

        <div className="divide-y divide-slate-100">

          {filteredAdmin.length > 0 ? (

            filteredAdmin.map((announcement) => (

              <div
                key={announcement.id}
                className="
                  flex flex-col gap-4 p-5
                  transition hover:bg-[#f4f7fc]
                  md:flex-row md:items-center
                  md:justify-between
                "
              >

                {/* ---------------------------------- */}
                {/* LEFT: ANNOUNCEMENT INFORMATION */}
                {/* ---------------------------------- */}

                <div className="min-w-0 flex-1">

                  {/* Category and featured label */}
                  <div className="flex flex-wrap items-center gap-2">

                    <CategoryPill
                      category={announcement.category}
                    />

                    {announcement.featured && (

                      <span className="text-xs font-bold text-[#e5092d]">
                        ★ Featured
                      </span>

                    )}

                  </div>


                  {/* Announcement title */}
                  <h3 className="mt-3 break-words text-base font-extrabold text-navy">

                    {announcement.title}

                  </h3>


                  {/* Location and date */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                    <MapPin
                      size={15}
                      className="shrink-0 text-[#e5092d]"
                    />

                    <span className="break-words">
                      {announcement.location}
                    </span>

                    <span>·</span>

                    <span>
                      {formatDate(announcement.date)}
                    </span>

                  </div>


                  {/* Optional description preview */}
                  {announcement.description && (

                    <p
                      className="
                        mt-3 line-clamp-2
                        break-words
                        [overflow-wrap:anywhere]
                        text-sm leading-6 text-slate-500
                      "
                    >
                      {announcement.description}
                    </p>

                  )}

                </div>


                {/* ---------------------------------- */}
                {/* RIGHT: MANAGEMENT ACTION BUTTONS */}
                {/* ---------------------------------- */}

                <div className="flex shrink-0 items-center gap-2">

                  {/* Preview announcement */}
                  <button
                    type="button"
                    aria-label={`Preview ${announcement.title}`}
                    title="Preview announcement"
                    onClick={() =>
                      setSelectedAnnouncement(announcement)
                    }
                    className="
                      inline-flex h-10 w-10 items-center
                      justify-center rounded-xl border
                      border-slate-200 bg-white
                      text-[#073b78] transition
                      hover:border-[#073b78]
                      hover:bg-[#e9f2fc]
                    "
                  >

                    <Eye size={18} />

                  </button>


                  {/* Edit announcement */}
                  <button
                    type="button"
                    aria-label={`Edit ${announcement.title}`}
                    title="Edit announcement"
                    onClick={() =>
                      setEditing(announcement)
                    }
                    className="
                      inline-flex h-10 w-10 items-center
                      justify-center rounded-xl border
                      border-slate-200 bg-white
                      text-[#073b78] transition
                      hover:border-[#073b78]
                      hover:bg-[#e9f2fc]
                    "
                  >

                    <Pencil size={18} />

                  </button>


                  {/* Delete announcement */}
                  <button
                    type="button"
                    aria-label={`Delete ${announcement.title}`}
                    title="Delete announcement"
                    onClick={() =>
                      setDeleteTarget(announcement)
                    }
                    className="
                      inline-flex h-10 w-10 items-center
                      justify-center rounded-xl border
                      border-red-100 bg-red-50
                      text-red-600 transition
                      hover:border-red-300
                      hover:bg-red-100
                    "
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            ))

          ) : (

            /* ===================================== */
            /* EMPTY SEARCH RESULTS */
            /* ===================================== */

            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#e9f2fc] text-[#073b78]">

                <Megaphone size={28} />

              </div>

              <h3 className="mt-4 text-lg font-extrabold text-navy">
                No Matching Announcements
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                No construction announcements match
                your current search.

              </p>


              {/* Clear search button */}
              <button
                type="button"
                className="secondary mt-5"
                onClick={() => setAdminSearch("")}
              >

                Clear Search

              </button>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}
