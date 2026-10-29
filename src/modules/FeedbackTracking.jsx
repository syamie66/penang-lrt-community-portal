import React, { useState } from "react";

import {
  Search,
  Mail,
  MapPin,
  CalendarDays,
  Eye,
  ClipboardList,
} from "lucide-react";

import {
  SectionHead,
  StatusPill,
} from "../components/Common.jsx";

import { formatDate } from "../lib/data.js";

// =====================================================
// FEEDBACK TRACKING - EMAIL-ONLY LOOKUP
// =====================================================

function FeedbackTracking({ feedback, setSelectedFeedback }) {
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Search for reports submitted using the entered email.
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchedEmail(email.trim().toLowerCase());
    setHasSearched(true);
  };

  // Create a sorted copy without mutating the feedback prop.
  const matchingFeedback = hasSearched
    ? feedback
        .filter(
          (item) =>
            item.email?.trim().toLowerCase() === searchedEmail
        )
        .sort((a, b) =>
          String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""))
        )
    : [];

  return (
    <section className="mx-auto w-full min-w-0 max-w-5xl px-5 py-12 lg:px-8">
      {/* PAGE HEADING */}
      <SectionHead
        eyebrow="Community Feedback Tracking"
        title="Track Your Feedback"
        description="Enter your email address to view your submitted feedback and check its status."
      />

      {/* EMAIL SEARCH */}
      <div className="panel min-w-0 p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-mint p-3 text-teal">
            <Mail size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold">Find Your Feedback</h3>
            <p className="mt-1 text-sm text-slate-500">
              Search using your email address.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1">
            <label htmlFor="feedback-email" className="field-label">
              Email Address
            </label>
            <input
              id="feedback-email"
              type="email"
              required
              autoComplete="email"
              className="field w-full min-w-0"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setHasSearched(false);
              }}
            />
          </div>

          <button type="submit" className="primary justify-center">
            <Search size={18} />
            View My Feedback
          </button>
        </form>
      </div>

      {/* MATCHING REPORTS */}
      {hasSearched && (
        <div className="mt-8 min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-extrabold">Your Feedback History</h3>
            <span className="rounded-full bg-mint px-4 py-2 text-xs font-bold text-teal">
              {matchingFeedback.length} Reports
            </span>
          </div>

          {matchingFeedback.length > 0 ? (
            <div className="min-w-0 space-y-4">
              {matchingFeedback.map((item) => (
                <article
                  key={item.id}
                  className="panel min-w-0 max-w-full overflow-hidden p-6"
                >
                  {/* TRACKING REFERENCE AND STATUS */}
                  <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Tracking Reference
                      </p>
                      <p className="mt-1 break-all font-mono text-sm font-extrabold text-teal">
                        {item.id}
                      </p>
                    </div>
                    <StatusPill status={item.status} />
                  </div>

                  <h4 className="mt-5 break-words text-lg font-extrabold [overflow-wrap:anywhere]">
                    {item.category}
                  </h4>

                  <p className="mt-3 flex min-w-0 items-start gap-2 text-sm text-slate-600">
                    <MapPin size={17} className="shrink-0 text-teal" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                      {item.location}
                    </span>
                  </p>

                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays size={17} className="shrink-0 text-teal" />
                    <span>Submitted: {formatDate(item.createdAt)}</span>
                  </p>

                  {/* ISSUE DESCRIPTION - WRAPS LONG UNBROKEN TEXT */}
                  <div className="mt-5 min-w-0 max-w-full rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Issue Description
                    </p>
                    <p className="mt-2 max-w-full whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
                      {item.description}
                    </p>
                  </div>

                  {/* ADMINISTRATOR UPDATE */}
                  {item.adminNote && (
                    <div className="mt-4 min-w-0 max-w-full rounded-xl bg-mint/50 p-4">
                      <p className="text-sm font-bold text-teal">
                        Administrator Update
                      </p>
                      <p className="mt-2 max-w-full whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
                        {item.adminNote}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    className="secondary mt-5"
                    onClick={() => setSelectedFeedback(item)}
                  >
                    <Eye size={17} />
                    View Details
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="panel p-10 text-center">
              <ClipboardList size={35} className="mx-auto text-slate-400" />
              <h3 className="mt-4 text-lg font-bold">No Feedback Found</h3>
              <p className="mt-2 text-sm text-slate-500">
                No feedback records were found for this email address in this browser.
              </p>
            </div>
          )}
        </div>
      )}

    </section>
  );
}

export default FeedbackTracking;
