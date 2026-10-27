
import React from "react";

import {
  Search,
  ChevronRight,
  Inbox,
} from "lucide-react";

// Data and utility functions
import {
  FEEDBACK_STATUSES,
  formatDate,
} from "../lib/data.js";

// Shared components
import {
  SectionHead,
  StatusPill,
} from "../components/Common.jsx";


// =====================================================
// FEEDBACK MANAGEMENT COMPONENT
// MODULE 4: ADMINISTRATOR
// =====================================================

export default function FeedbackManagement({
  filteredFeedback,
  feedbackSearch,
  setFeedbackSearch,
  feedbackStatus,
  setFeedbackStatus,
  setSelectedFeedback,
}) {

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

      {/* ============================================= */}
      {/* PAGE HEADING */}
      {/* ============================================= */}

      <SectionHead
        eyebrow="Community Engagement"
        title="Feedback Management"
        description="Review submitted concerns, change their status and leave visible tracking updates."
      />


      {/* ============================================= */}
      {/* MAIN FEEDBACK PANEL */}
      {/* ============================================= */}

      <div className="panel overflow-hidden">

        {/* ========================================== */}
        {/* SEARCH AND FILTER SECTION */}
        {/* ========================================== */}

        <div className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-[minmax(0,1fr)_220px]">

          {/* ---------------------------------------- */}
          {/* SEARCH INPUT - FIXED */}
          {/* ---------------------------------------- */}

          <div
            className="
              flex min-w-0 items-center gap-3
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
              aria-label="Search submitted feedback"
              placeholder="Search reference, reporter or location..."
              value={feedbackSearch}
              onChange={(event) =>
                setFeedbackSearch(event.target.value)
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


          {/* ---------------------------------------- */}
          {/* STATUS FILTER */}
          {/* ---------------------------------------- */}

          <select
            aria-label="Filter feedback by status"
            className="field"
            value={feedbackStatus}
            onChange={(event) =>
              setFeedbackStatus(event.target.value)
            }
          >

            <option value="All statuses">
              All statuses
            </option>

            {FEEDBACK_STATUSES.map((status) => (

              <option
                key={status}
                value={status}
              >
                {status}
              </option>

            ))}

          </select>

        </div>


        {/* ========================================== */}
        {/* FEEDBACK REPORT LIST */}
        {/* ========================================== */}

        <div className="divide-y divide-slate-100">

          {filteredFeedback.length > 0 ? (

            filteredFeedback.map((item) => (

              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedFeedback(item)}
                className="
                  flex w-full flex-col gap-4 p-5 text-left
                  transition hover:bg-[#f4f7fc]
                  sm:flex-row sm:items-center
                  sm:justify-between
                "
              >

                {/* ---------------------------------- */}
                {/* LEFT: FEEDBACK INFORMATION */}
                {/* ---------------------------------- */}

                <div className="min-w-0 flex-1">

                  {/* Tracking reference */}
                  <p className="break-all font-mono text-xs font-extrabold text-teal">
                    {item.id}
                  </p>


                  {/* Feedback category */}
                  <h3 className="mt-2 break-words text-base font-extrabold text-navy">
                    {item.category}
                  </h3>


                  {/* Reporter, location and date */}
                  <p className="mt-2 break-words text-xs leading-5 text-slate-500">

                    {item.location}

                    <span className="mx-2">·</span>

                    {item.name}

                    <span className="mx-2">·</span>

                    {formatDate(item.createdAt)}

                  </p>


                  {/* Issue description preview */}
                  <p
                    className="
                      mt-2 line-clamp-2
                      break-words
                      [overflow-wrap:anywhere]
                      text-sm leading-6
                      text-slate-500
                    "
                  >
                    {item.description}
                  </p>

                </div>


                {/* ---------------------------------- */}
                {/* RIGHT: STATUS AND ACTION ICON */}
                {/* ---------------------------------- */}

                <div className="flex shrink-0 items-center gap-3">

                  {/* Feedback status */}
                  <StatusPill status={item.status} />

                  {/* View details indicator */}
                  <ChevronRight
                    size={18}
                    className="text-slate-400"
                  />

                </div>

              </button>

            ))

          ) : (

            /* ===================================== */
            /* EMPTY SEARCH RESULTS */
            /* ===================================== */

            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#e9f2fc] text-[#073b78]">

                <Inbox size={28} />

              </div>

              <h3 className="mt-4 text-lg font-extrabold text-navy">
                No Matching Feedback
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No feedback reports match your current
                search or selected status.
              </p>

              {/* Clear filters button */}
              <button
                type="button"
                className="secondary mt-5"
                onClick={() => {
                  setFeedbackSearch("");
                  setFeedbackStatus("All statuses");
                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}
