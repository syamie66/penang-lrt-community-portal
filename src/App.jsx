
import React, { useEffect, useMemo, useState } from "react";

import {
  TrainFront,
  Menu,
  X,
  Megaphone,
  MessageSquareText,
  ClipboardList,
  LayoutDashboard,
  Inbox,
  ShieldCheck,
} from "lucide-react";

// Data and utility functions
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_FEEDBACK,
  readStored,
  makeId,
} from "./lib/data.js";

// Shared reusable components
import {
  AnnouncementDetails,
  FeedbackDetails,
  Modal,
  AnnouncementForm,
} from "./components/Common.jsx";

// Main pages
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Module components
import ConstructionAnnouncements from "./modules/ConstructionAnnouncements.jsx";
import CommunityFeedback from "./modules/CommunityFeedback.jsx";
import FeedbackTracking from "./modules/FeedbackTracking.jsx";
import AnnouncementManagement from "./modules/AnnouncementManagement.jsx";
import FeedbackManagement from "./modules/FeedbackManagement.jsx";


// =====================================================
// LOCAL STORAGE KEYS
// =====================================================

const ANNOUNCEMENT_KEY = "mutiara-announcements-v1";
const FEEDBACK_KEY = "mutiara-feedback-v1";


// =====================================================
// MAIN APPLICATION
// =====================================================

function App() {

  // ---------------------------------------------------
  // 1. DATA STATE
  // ---------------------------------------------------

  // Store construction announcements
  const [announcements, setAnnouncements] = useState(() =>
    readStored(ANNOUNCEMENT_KEY, INITIAL_ANNOUNCEMENTS)
  );

  // Store community feedback
  const [feedback, setFeedback] = useState(() =>
    readStored(FEEDBACK_KEY, INITIAL_FEEDBACK)
  );


  // ---------------------------------------------------
  // 2. NAVIGATION STATE
  // ---------------------------------------------------

  const [tab, setTab] = useState("home");

  const [admin, setAdmin] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);


  // ---------------------------------------------------
  // 3. MODAL STATE
  // ---------------------------------------------------

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState(null);

  const [selectedFeedback, setSelectedFeedback] =
    useState(null);

  // undefined = closed
  // null = create announcement
  // object = edit announcement
  const [editing, setEditing] = useState(undefined);

  const [deleteTarget, setDeleteTarget] = useState(null);


  // ---------------------------------------------------
  // 4. ANNOUNCEMENT SEARCH AND FILTER STATE
  // ---------------------------------------------------

  const [announcementSearch, setAnnouncementSearch] =
    useState("");

  const [announcementCategory, setAnnouncementCategory] =
    useState("All categories");

  const [adminSearch, setAdminSearch] = useState("");


  // ---------------------------------------------------
  // 5. FEEDBACK SEARCH AND FILTER STATE
  // ---------------------------------------------------

  const [feedbackSearch, setFeedbackSearch] = useState("");

  const [feedbackStatus, setFeedbackStatus] =
    useState("All statuses");


  // ---------------------------------------------------
  // 6. FEEDBACK TRACKING STATE
  // ---------------------------------------------------

  const [trackRef, setTrackRef] = useState("");

  const [trackEmail, setTrackEmail] = useState("");

  const [trackAttempted, setTrackAttempted] = useState(false);

  const [historyEmail, setHistoryEmail] = useState("");

  const [historyShown, setHistoryShown] = useState(false);


  // =====================================================
  // LOCAL STORAGE PERSISTENCE
  // =====================================================

  // Save announcements when announcement data changes
  useEffect(() => {

    localStorage.setItem(
      ANNOUNCEMENT_KEY,
      JSON.stringify(announcements)
    );

  }, [announcements]);


  // Save feedback when feedback data changes
  useEffect(() => {

    localStorage.setItem(
      FEEDBACK_KEY,
      JSON.stringify(feedback)
    );

  }, [feedback]);


  // =====================================================
  // NAVIGATION FUNCTIONS
  // =====================================================

  // Navigate between pages
  const goto = (page) => {

    setTab(page);

    setMobileMenu(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // Switch between public and administrator views
  const roleChange = () => {

    setAdmin(!admin);

    if (admin) {
      goto("home");
    } else {
      goto("dashboard");
    }

  };


  // =====================================================
  // MODULE 2: COMMUNITY FEEDBACK
  // =====================================================

  // Submit new feedback
  const addFeedback = (form) => {

    const currentDate = new Date();

    const timestamp = currentDate.toISOString();

    const id = `FB-${currentDate.getFullYear()}-${makeId("R")
      .slice(-8)
      .toUpperCase()}`;

    const newFeedback = {

      ...form,

      name: form.name.trim(),

      email: form.email.trim().toLowerCase(),

      location: form.location.trim(),

      description: form.description.trim(),

      id: id,

      status: "Submitted",

      createdAt: timestamp,

      updatedAt: timestamp,

      adminNote: "",

    };

    // Add new feedback to the beginning of the list
    setFeedback((previousFeedback) => [
      newFeedback,
      ...previousFeedback,
    ]);

    // Return reference number for tracking
    return id;

  };


  // =====================================================
  // MODULE 3: ANNOUNCEMENT MANAGEMENT
  // =====================================================

  // Create or update an announcement
  const saveAnnouncement = (form) => {

    if (editing) {

      // Update existing announcement
      setAnnouncements((previousAnnouncements) =>
        previousAnnouncements.map((announcement) => {

          if (announcement.id === editing.id) {

            return {
              ...form,
              id: announcement.id,
            };

          }

          return announcement;

        })
      );

    } else {

      // Create a new announcement
      const newAnnouncement = {

        ...form,

        id: makeId("ann"),

      };

      setAnnouncements((previousAnnouncements) => [
        newAnnouncement,
        ...previousAnnouncements,
      ]);

    }

    // Close announcement form
    setEditing(undefined);

  };


  // Delete an announcement
  const deleteAnnouncement = () => {

    if (!deleteTarget) {
      return;
    }

    setAnnouncements((previousAnnouncements) =>
      previousAnnouncements.filter(
        (announcement) =>
          announcement.id !== deleteTarget.id
      )
    );

    // Close confirmation modal
    setDeleteTarget(null);

  };


  // =====================================================
  // MODULE 4: FEEDBACK MANAGEMENT
  // =====================================================

  // Update feedback status or administrator note
  const updateFeedback = (id, data) => {

    setFeedback((previousFeedback) =>
      previousFeedback.map((item) => {

        if (item.id === id) {

          return {

            ...item,

            ...data,

            updatedAt: new Date().toISOString(),

          };

        }

        return item;

      })
    );

  };


  // =====================================================
  // ANNOUNCEMENT FILTERING
  // =====================================================

  // Filter announcements for public users
  const filteredAnnouncements = useMemo(() => {

    return announcements

      .filter((announcement) => {

        const matchesCategory =
          announcementCategory === "All categories" ||
          announcement.category === announcementCategory;

        const searchableText = `
          ${announcement.title}
          ${announcement.description}
          ${announcement.location}
        `.toLowerCase();

        const matchesSearch = searchableText.includes(
          announcementSearch.toLowerCase()
        );

        return matchesCategory && matchesSearch;

      })

      .sort((a, b) => b.date.localeCompare(a.date));

  }, [
    announcements,
    announcementCategory,
    announcementSearch,
  ]);


  // Filter announcements for administrators
  const filteredAdmin = useMemo(() => {

    return announcements

      .filter((announcement) => {

        const searchableText = `
          ${announcement.title}
          ${announcement.location}
          ${announcement.category}
        `.toLowerCase();

        return searchableText.includes(
          adminSearch.toLowerCase()
        );

      })

      .sort((a, b) => b.date.localeCompare(a.date));

  }, [announcements, adminSearch]);


  // =====================================================
  // FEEDBACK FILTERING
  // =====================================================

  const filteredFeedback = useMemo(() => {

    return feedback

      .filter((item) => {

        const matchesStatus =
          feedbackStatus === "All statuses" ||
          item.status === feedbackStatus;

        const searchableText = `
          ${item.id}
          ${item.category}
          ${item.location}
          ${item.name}
        `.toLowerCase();

        const matchesSearch = searchableText.includes(
          feedbackSearch.toLowerCase()
        );

        return matchesStatus && matchesSearch;

      })

      .sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );

  }, [
    feedback,
    feedbackStatus,
    feedbackSearch,
  ]);


  // =====================================================
  // FEEDBACK TRACKING
  // =====================================================

  // Find feedback matching reference and email
  const tracked = feedback.find((item) => {

    const matchesReference =
      item.id.toLowerCase() ===
      trackRef.trim().toLowerCase();

    const matchesEmail =
      item.email.toLowerCase() ===
      trackEmail.trim().toLowerCase();

    return matchesReference && matchesEmail;

  });


  // =====================================================
  // FEATURED ANNOUNCEMENT
  // =====================================================

  const featured =

    [...announcements]
      .filter((announcement) => announcement.featured)
      .sort((a, b) => b.date.localeCompare(a.date))[0]

    ||

    [...announcements]
      .sort((a, b) => b.date.localeCompare(a.date))[0];


  // =====================================================
  // NAVIGATION MENU ITEMS
  // =====================================================

  const navItems = admin

    ? [

        ["dashboard", "Dashboard", LayoutDashboard],

        ["manage-announcements", "Announcements", Megaphone],

        ["manage-feedback", "Feedback inbox", Inbox],

      ]

    : [

        ["home", "Home", LayoutDashboard],

        ["announcements", "Announcements", Megaphone],

        ["submit", "Submit feedback", MessageSquareText],

        ["track", "Track feedback", ClipboardList],

      ];


  // =====================================================
  // USER INTERFACE
  // =====================================================

  return (

    <div className="min-h-screen bg-[#f6f9fa] text-navy">

      {/* ============================================= */}
      {/* DEMONSTRATION NOTICE */}
      {/* ============================================= */}

      <div className="bg-navy px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-white/85">

        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber" />

        DEMONSTRATION PORTAL — Sample construction information,
        not an official source

      </div>


      {/* ============================================= */}
      {/* HEADER AND NAVIGATION */}
      {/* ============================================= */}

      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-8">

          {/* Website logo */}

          <button
            className="flex min-w-0 items-center gap-3 text-left"
            onClick={() => goto(admin ? "dashboard" : "home")}
          >

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white">

              <TrainFront size={25} />

            </span>

            <span className="min-w-0">

              <span className="block truncate font-extrabold tracking-tight">

                PENANG <span className="text-teal">LRT</span>

              </span>

              <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-slate-500">

                Mutiara Line · Community Portal

              </span>

            </span>

          </button>


          {/* Desktop navigation */}

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >

            {navItems.map(([id, label]) => (

              <button
                key={id}
                onClick={() => goto(id)}
                className={`
                  navlink
                  ${
                    tab === id
                      ? "bg-mint text-teal"
                      : "text-slate-600 hover:bg-slate-50 hover:text-teal"
                  }
                `}
              >

                {label}

              </button>

            ))}

          </nav>


          {/* Admin switch and mobile menu */}

          <div className="flex items-center gap-2">

            <button
              onClick={roleChange}
              aria-label={
                admin
                  ? "Switch to public view"
                  : "Switch to administrator demo"
              }
              className={`
                hidden items-center gap-2 rounded-xl border
                px-4 py-2.5 text-xs font-bold sm:flex
                ${
                  admin
                    ? "border-teal bg-mint text-teal"
                    : "border-slate-200 bg-white text-slate-700 hover:border-teal"
                }
              `}
            >

              <ShieldCheck size={16} />

              {admin ? "Public view" : "Admin demo"}

            </button>


            <button
              className="rounded-lg p-2 lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu(!mobileMenu)}
            >

              {mobileMenu ? <X /> : <Menu />}

            </button>

          </div>

        </div>


        {/* Mobile navigation */}

        {mobileMenu && (

          <nav
            className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden"
            aria-label="Mobile navigation"
          >

            {navItems.map(([id, label, Icon]) => (

              <button
                key={id}
                onClick={() => goto(id)}
                className={`
                  flex w-full items-center gap-3 rounded-xl
                  px-4 py-3 text-left text-sm font-bold
                  ${
                    tab === id
                      ? "bg-mint text-teal"
                      : "text-slate-600"
                  }
                `}
              >

                <Icon size={18} />

                {label}

              </button>

            ))}


            <button
              className="mt-2 flex w-full items-center gap-3 rounded-xl bg-navy px-4 py-3 text-sm font-bold text-white"
              onClick={roleChange}
            >

              <ShieldCheck size={18} />

              {admin
                ? "Switch to public view"
                : "Switch to admin demo"}

            </button>

          </nav>

        )}

      </header>


      {/* ============================================= */}
      {/* MAIN APPLICATION CONTENT */}
      {/* ============================================= */}

      <main>

        {/* HOME PAGE - PUBLIC */}

        {tab === "home" && !admin && (

          <Home
            announcements={announcements}
            feedback={feedback}
            featured={featured}
            goto={goto}
            setSelectedAnnouncement={setSelectedAnnouncement}
          />

        )}


        {/* MODULE 1: CONSTRUCTION ANNOUNCEMENTS */}

        {tab === "announcements" && !admin && (

          <ConstructionAnnouncements
            filteredAnnouncements={filteredAnnouncements}
            announcementSearch={announcementSearch}
            setAnnouncementSearch={setAnnouncementSearch}
            announcementCategory={announcementCategory}
            setAnnouncementCategory={setAnnouncementCategory}
            setSelectedAnnouncement={setSelectedAnnouncement}
          />

        )}


        {/* MODULE 2: COMMUNITY FEEDBACK */}

        {tab === "submit" && !admin && (

          <CommunityFeedback
            addFeedback={addFeedback}
          />

        )}


        {/* PUBLIC FEEDBACK TRACKING */}

        {tab === "track" && !admin && (

          <FeedbackTracking
            trackRef={trackRef}
            setTrackRef={setTrackRef}
            trackEmail={trackEmail}
            setTrackEmail={setTrackEmail}
            trackAttempted={trackAttempted}
            setTrackAttempted={setTrackAttempted}
            tracked={tracked}
            historyEmail={historyEmail}
            setHistoryEmail={setHistoryEmail}
            historyShown={historyShown}
            setHistoryShown={setHistoryShown}
            feedback={feedback}
            setSelectedFeedback={setSelectedFeedback}
          />

        )}


        {/* ADMIN DASHBOARD */}

        {tab === "dashboard" && admin && (

          <Dashboard
            announcements={announcements}
            feedback={feedback}
            goto={goto}
            setEditing={setEditing}
            setSelectedFeedback={setSelectedFeedback}
          />

        )}


        {/* MODULE 3: ANNOUNCEMENT MANAGEMENT */}

        {tab === "manage-announcements" && admin && (

          <AnnouncementManagement
            setEditing={setEditing}
            filteredAdmin={filteredAdmin}
            adminSearch={adminSearch}
            setAdminSearch={setAdminSearch}
            setSelectedAnnouncement={setSelectedAnnouncement}
            setDeleteTarget={setDeleteTarget}
          />

        )}


        {/* MODULE 4: FEEDBACK MANAGEMENT */}

        {tab === "manage-feedback" && admin && (

          <FeedbackManagement
            filteredFeedback={filteredFeedback}
            feedbackSearch={feedbackSearch}
            setFeedbackSearch={setFeedbackSearch}
            feedbackStatus={feedbackStatus}
            setFeedbackStatus={setFeedbackStatus}
            setSelectedFeedback={setSelectedFeedback}
          />

        )}

      </main>


      {/* ============================================= */}
      {/* FOOTER */}
      {/* ============================================= */}

      <footer className="mt-16 bg-navy text-white">

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1.2fr_1fr] lg:px-8">

          {/* Website information */}

          <div>

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-teal p-2">

                <TrainFront size={23} />

              </div>

              <div>

                <p className="font-extrabold">
                  PENANG LRT
                </p>

                <p className="text-xs text-slate-400">
                  Mutiara Line Community Portal
                </p>

              </div>

            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">

              A frontend demonstration for sharing construction
              information and gathering community feedback.

              Not affiliated with or endorsed by official
              project authorities.

            </p>

          </div>


          {/* Quick links */}

          <div className="md:justify-self-end">

            <p className="font-extrabold">
              Quick access
            </p>

            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-300">

              <button
                className="hover:text-white"
                onClick={() => {
                  setAdmin(false);
                  goto("announcements");
                }}
              >
                Construction announcements
              </button>

              <button
                className="hover:text-white"
                onClick={() => {
                  setAdmin(false);
                  goto("submit");
                }}
              >
                Submit feedback
              </button>

              <button
                className="hover:text-white"
                onClick={() => {
                  setAdmin(false);
                  goto("track");
                }}
              >
                Track a report
              </button>

            </div>

          </div>

        </div>


        {/* Copyright */}

        <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-400">

          © {new Date().getFullYear()} Mutiara Line Community Portal

          {" · "}Academic / demonstration use only

          {" · "}Data stored locally

        </div>

      </footer>


      {/* ============================================= */}
      {/* ANNOUNCEMENT DETAILS MODAL */}
      {/* ============================================= */}

      {selectedAnnouncement && (

        <AnnouncementDetails
          item={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />

      )}


      {/* ============================================= */}
      {/* FEEDBACK DETAILS MODAL */}
      {/* ============================================= */}

      {selectedFeedback && (

        <FeedbackDetails
          key={selectedFeedback.id}
          item={
            feedback.find(
              (item) => item.id === selectedFeedback.id
            ) || selectedFeedback
          }
          isAdmin={admin}
          onUpdate={updateFeedback}
          onClose={() => setSelectedFeedback(null)}
        />

      )}


      {/* ============================================= */}
      {/* CREATE / EDIT ANNOUNCEMENT MODAL */}
      {/* ============================================= */}

      {editing !== undefined && (

        <Modal
          title={
            editing
              ? "Edit announcement"
              : "Create announcement"
          }
          wide
          onClose={() => setEditing(undefined)}
        >

          <AnnouncementForm
            initial={editing || undefined}
            onCancel={() => setEditing(undefined)}
            onSave={saveAnnouncement}
          />

        </Modal>

      )}


      {/* ============================================= */}
      {/* DELETE ANNOUNCEMENT CONFIRMATION */}
      {/* ============================================= */}

      {deleteTarget && (

        <Modal
          title="Delete announcement?"
          onClose={() => setDeleteTarget(null)}
        >

          <p className="text-sm leading-7 text-slate-600">

            Are you sure you want to remove{" "}

            <b>{deleteTarget.title}</b>?

            This deletes the announcement from this browser
            and cannot be undone.

          </p>


          <div className="mt-7 flex justify-end gap-3">

            <button
              className="secondary"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>

            <button
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
              onClick={deleteAnnouncement}
            >
              Delete announcement
            </button>

          </div>

        </Modal>

      )}

    </div>

  );

}

export default App;