
import React, { useEffect, useState } from "react";
import ConstructionMap from "./ConstructionMap.jsx";

import {
  X,
  ArrowRight,
  Megaphone,
  MapPin,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Construction,
  Route,
  Users,
  Inbox,
  Send,
  CircleHelp,
  Footprints,
  Store,
} from "lucide-react";

import {
  ANNOUNCEMENT_CATEGORIES,
  FEEDBACK_CATEGORIES,
  FEEDBACK_STATUSES,
  formatDate,
  categoryStyles,
  statusStyles,
} from "../lib/data.js";


// =====================================================
// 1. CATEGORY PILL
// =====================================================

function CategoryPill({ category }) {
  const style =
    categoryStyles[category] ||
    "bg-slate-100 text-slate-700";

  return (
    <span className={`tag ${style}`}>
      {category}
    </span>
  );
}


// =====================================================
// 2. STATUS PILL
// =====================================================

function StatusPill({ status }) {
  const style =
    statusStyles[status] ||
    "bg-slate-100 text-slate-700";

  return (
    <span className={`tag ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}


// =====================================================
// 3. EMPTY STATE
// =====================================================

function Empty({
  title = "No results found",
  description = "Try changing your search or filters.",
}) {
  return (
    <div className="panel flex flex-col items-center px-5 py-16 text-center">

      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
        <Inbox size={30} />
      </div>

      <h3 className="mt-5 font-extrabold">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
}


// =====================================================
// 4. SECTION HEADER
// =====================================================

function SectionHead({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

      <div>

        <p className="mb-2 text-xs font-extrabold uppercase tracking-[.2em] text-teal">
          {eyebrow}
        </p>

        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}


// =====================================================
// 5. ANNOUNCEMENT CARD
// =====================================================

// Different icons for each announcement category
const iconMap = {
  "Construction Update": Construction,
  "Road Closure": Route,
  "Pedestrian Access": Users,
  "Traffic Advisory": AlertTriangle,
  "Community Notice": Megaphone,
};

function AnnouncementCard({ item, onOpen }) {
  const Icon = iconMap[item.category] || Megaphone;

  return (
    <article className="panel group flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl">

      {/* Category icon and badge */}
      <div className="flex items-start justify-between gap-3 px-6 pt-6">

        <div className="rounded-xl bg-mint p-3 text-teal">
          <Icon size={23} />
        </div>

        <CategoryPill category={item.category} />

      </div>

      {/* Announcement content */}
      <div className="flex flex-1 flex-col px-6 pb-6">

        <p className="mt-6 text-xs font-semibold text-slate-400">
          {formatDate(item.date)}

          {item.endDate && item.endDate !== item.date
            ? ` – ${formatDate(item.endDate)}`
            : ""}
        </p>

        <h3 className="mt-2 text-lg font-extrabold leading-7 group-hover:text-teal">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
          {item.description}
        </p>

        {/* Affected location */}
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">

          <MapPin
            size={16}
            className="shrink-0 text-teal"
          />

          {item.location}

        </div>

        {/* Open announcement */}
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="mt-5 flex items-center gap-2 self-start text-sm font-bold text-teal hover:underline"
        >
          Read details
          <ArrowRight size={16} />
        </button>

      </div>

    </article>
  );
}


// =====================================================
// 6. REUSABLE MODAL COMPONENT
// =====================================================

function Modal({
  title,
  onClose,
  children,
  wide = false,
}) {
  // Close modal using Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#061827]/70 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          max-h-[90vh] w-full overflow-y-auto rounded-2xl
          bg-white p-6 shadow-2xl sm:p-8
          ${wide ? "max-w-3xl" : "max-w-xl"}
        `}
      >

        {/* Modal header */}
        <div className="mb-6 flex items-start justify-between gap-5">

          <h2 className="text-xl font-extrabold">
            {title}
          </h2>

          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Modal content */}
        {children}

      </section>

    </div>
  );
}


// =====================================================
// 7. REUSABLE FORM FIELD
// =====================================================

function Field({
  label,
  required,
  children,
}) {
  return (
    <label className="block">

      <span className="field-label">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}

    </label>
  );
}


// =====================================================
// 8. CONSTRUCTION ACCESS INFORMATION
// MODULE 1: PUBLIC ANNOUNCEMENT DETAILS
// =====================================================

function ConstructionAccessInfo({ item }) {
  return (
    <div className="mt-6 space-y-4">

      {/* ------------------------------------------ */}
      {/* FUNCTION 1: VIEW AFFECTED LOCATIONS */}
      {/* ------------------------------------------ */}

      <section className="rounded-xl bg-slate-50 p-5">

        <div className="flex items-center gap-2">

          <MapPin
            size={20}
            className="text-teal"
          />

          <h3 className="font-bold">
            Affected Locations
          </h3>

        </div>

        <p className="mt-3 text-sm text-slate-600">
          {item.location}
        </p>

        {item.affectedAreas && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
            {item.affectedAreas}
          </p>
        )}

      </section>


      {/* ------------------------------------------ */}
      {/* FUNCTION 2: PEDESTRIAN ACCESS UPDATES */}
      {/* ------------------------------------------ */}

      <section className="rounded-xl bg-slate-50 p-5">

        <div className="flex items-center gap-2">

          <Footprints
            size={20}
            className="text-teal"
          />

          <h3 className="font-bold">
            Pedestrian Access Updates
          </h3>

        </div>

        <p className="mt-3 text-sm font-semibold">
          Status: {item.pedestrianStatus || "Not specified"}
        </p>

        {item.pedestrianDetails && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
            {item.pedestrianDetails}
          </p>
        )}

        {item.alternativeWalkingRoute && (
          <div className="mt-3 rounded-lg bg-white p-3">

            <p className="text-sm font-bold">
              Alternative Walking Route
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
              {item.alternativeWalkingRoute}
            </p>

          </div>
        )}

      </section>


      {/* ------------------------------------------ */}
      {/* FUNCTION 3: BUSINESS ACCESS INFORMATION */}
      {/* ------------------------------------------ */}

      <section className="rounded-xl bg-slate-50 p-5">

        <div className="flex items-center gap-2">

          <Store
            size={20}
            className="text-teal"
          />

          <h3 className="font-bold">
            Business Access Information
          </h3>

        </div>

        <p className="mt-3 text-sm font-semibold">
          Status: {item.businessStatus || "Not specified"}
        </p>

        {item.affectedBusinesses && (
          <div className="mt-3">

            <p className="text-sm font-bold">
              Affected Business Premises
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
              {item.affectedBusinesses}
            </p>

          </div>
        )}

        {item.alternativeBusinessAccess && (
          <div className="mt-3 rounded-lg bg-white p-3">

            <p className="text-sm font-bold">
              Alternative Business Access
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
              {item.alternativeBusinessAccess}
            </p>

          </div>
        )}

      </section>

    </div>
  );
}


// =====================================================
// 9. ANNOUNCEMENT DETAILS
// MODULE 1: PUBLIC USER VIEW
// =====================================================

function AnnouncementDetails({ item, onClose }) {
  return (
    <Modal
      title="Construction announcement"
      onClose={onClose}
      wide
    >

      {/* Announcement category */}
      <CategoryPill category={item.category} />

      {/* Announcement title */}
      <h3 className="mt-5 text-2xl font-extrabold">
        {item.title}
      </h3>

      {/* Date and location */}
      <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">

        <p className="flex gap-3">

          <CalendarDays
            size={18}
            className="shrink-0 text-teal"
          />

          <span>
            <b>Schedule: </b>

            {formatDate(item.date)}

            {item.endDate && item.endDate !== item.date
              ? ` – ${formatDate(item.endDate)}`
              : ""}
          </span>

        </p>

        <p className="flex gap-3">

          <MapPin
            size={18}
            className="shrink-0 text-teal"
          />

          <span>
            <b>Affected location: </b>
            {item.location}
          </span>

        </p>

      </div>

      {/* Construction description */}
      <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-600">
        {item.description}
      </p>

      {/* Three additional construction functions */}
      <ConstructionAccessInfo item={item} />

      {/* Interactive map: displays administrator-provided coordinates */}
      <ConstructionMap
        latitude={item.latitude}
        longitude={item.longitude}
        title={item.title}
        location={item.location}
        affectedAreas={item.affectedAreas}
      />

      <p className="mt-7 text-xs text-slate-400">
        Please follow verified on-site instructions
        for current arrangements.
      </p>

    </Modal>
  );
}


// =====================================================
// 10. BLANK ANNOUNCEMENT DATA
// MODULE 3: ADMINISTRATOR
// =====================================================

const blankAnnouncement = {
  title: "",
  description: "",
  date: "",
  endDate: "",
  location: "",
  category: "Construction Update",
  featured: false,

  // Affected locations and map marker coordinates
  affectedAreas: "",
  latitude: "",
  longitude: "",

  // Pedestrian access
  pedestrianStatus: "Open",
  pedestrianDetails: "",
  alternativeWalkingRoute: "",

  // Business access
  businessStatus: "Normal Access",
  affectedBusinesses: "",
  alternativeBusinessAccess: "",
};


// =====================================================
// 11. ANNOUNCEMENT FORM
// MODULE 3: ADD / EDIT ANNOUNCEMENT
// =====================================================

function AnnouncementForm({
  initial,
  onSave,
  onCancel,
}) {
  // Initialize form data
  const [form, setForm] = useState({
    ...blankAnnouncement,
    ...(initial || {}),
  });

  // Update individual form fields
  const update = (key, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [key]: value,
    }));
  };

  // Validate date range and optional geographic coordinates
  const invalidDate = Boolean(
    form.endDate && form.date && form.endDate < form.date
  );

  const latitude = String(form.latitude ?? "").trim();
  const longitude = String(form.longitude ?? "").trim();
  const hasLatitude = latitude !== "";
  const hasLongitude = longitude !== "";

  // Coordinates are optional, but must be supplied as a valid pair.
  const invalidCoordinates =
    hasLatitude !== hasLongitude ||
    (hasLatitude &&
      (!Number.isFinite(Number(latitude)) ||
        !Number.isFinite(Number(longitude)) ||
        Number(latitude) < -90 ||
        Number(latitude) > 90 ||
        Number(longitude) < -180 ||
        Number(longitude) > 180));

  // Submit announcement
  const handleSubmit = (event) => {
    event.preventDefault();

    if (invalidDate || invalidCoordinates) {
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      latitude,
      longitude,
      affectedAreas: form.affectedAreas.trim(),
      pedestrianDetails: form.pedestrianDetails.trim(),
      alternativeWalkingRoute:
        form.alternativeWalkingRoute.trim(),
      affectedBusinesses: form.affectedBusinesses.trim(),
      alternativeBusinessAccess:
        form.alternativeBusinessAccess.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* ------------------------------------------ */}
      {/* BASIC ANNOUNCEMENT INFORMATION */}
      {/* ------------------------------------------ */}

      <h3 className="text-lg font-bold">
        Basic Announcement Information
      </h3>

      <Field label="Announcement title" required>
        <input
          required
          maxLength={120}
          className="field"
          value={form.title}
          onChange={(event) =>
            update("title", event.target.value)
          }
          placeholder="e.g. Upcoming utility diversion works"
        />
      </Field>

      <Field label="Description" required>
        <textarea
          required
          rows={5}
          maxLength={3000}
          className="field resize-y"
          value={form.description}
          onChange={(event) =>
            update("description", event.target.value)
          }
          placeholder="Describe the construction activities"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">

        <Field label="Category" required>
          <select
            className="field"
            value={form.category}
            onChange={(event) =>
              update("category", event.target.value)
            }
          >
            {ANNOUNCEMENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Affected location" required>
          <input
            required
            maxLength={120}
            className="field"
            value={form.location}
            onChange={(event) =>
              update("location", event.target.value)
            }
            placeholder="e.g. Gelugor"
          />
        </Field>

        <Field label="Start date" required>
          <input
            required
            type="date"
            className="field"
            value={form.date}
            onChange={(event) =>
              update("date", event.target.value)
            }
          />
        </Field>

        <Field label="End date (optional)">
          <input
            type="date"
            className="field"
            min={form.date}
            value={form.endDate}
            onChange={(event) =>
              update("endDate", event.target.value)
            }
          />
        </Field>

      </div>

      {invalidDate && (
        <p role="alert" className="text-sm text-red-600">
          End date cannot be earlier than the start date.
        </p>
      )}


      {/* ------------------------------------------ */}
      {/* FUNCTION 1: AFFECTED LOCATIONS */}
      {/* ------------------------------------------ */}

      <div className="border-t border-slate-200 pt-5">

        <h3 className="mb-4 text-lg font-bold">
          Affected Locations
        </h3>

        <Field label="Affected Areas">
          <textarea
            rows={3}
            maxLength={1000}
            className="field"
            value={form.affectedAreas}
            onChange={(event) =>
              update("affectedAreas", event.target.value)
            }
            placeholder="Describe affected roads, areas or landmarks"
          />
        </Field>

        {/* Optional coordinates for the interactive map */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Latitude (optional)">
            <input
              type="number"
              step="any"
              min="-90"
              max="90"
              className="field"
              value={form.latitude ?? ""}
              onChange={(event) =>
                update("latitude", event.target.value)
              }
              placeholder="e.g. 5.3500"
            />
          </Field>

          <Field label="Longitude (optional)">
            <input
              type="number"
              step="any"
              min="-180"
              max="180"
              className="field"
              value={form.longitude ?? ""}
              onChange={(event) =>
                update("longitude", event.target.value)
              }
              placeholder="e.g. 100.3000"
            />
          </Field>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Enter both coordinates for the map marker. Only use verified
          construction locations; otherwise leave both fields blank.
        </p>

        {invalidCoordinates && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            Enter a valid latitude and longitude together, or leave both blank.
          </p>
        )}

      </div>


      {/* ------------------------------------------ */}
      {/* FUNCTION 2: PEDESTRIAN ACCESS */}
      {/* ------------------------------------------ */}

      <div className="border-t border-slate-200 pt-5">

        <h3 className="mb-4 text-lg font-bold">
          Pedestrian Access Information
        </h3>

        <div className="space-y-4">

          <Field label="Pedestrian Access Status">
            <select
              className="field"
              value={form.pedestrianStatus}
              onChange={(event) =>
                update(
                  "pedestrianStatus",
                  event.target.value
                )
              }
            >
              <option value="Open">Open</option>

              <option value="Restricted">
                Restricted
              </option>

              <option value="Temporarily Closed">
                Temporarily Closed
              </option>

              <option value="Diversion Required">
                Diversion Required
              </option>
            </select>
          </Field>

          <Field label="Pedestrian Access Details">
            <textarea
              rows={3}
              maxLength={1000}
              className="field"
              value={form.pedestrianDetails}
              onChange={(event) =>
                update(
                  "pedestrianDetails",
                  event.target.value
                )
              }
              placeholder="Describe temporary pedestrian restrictions"
            />
          </Field>

          <Field label="Alternative Walking Route">
            <textarea
              rows={3}
              maxLength={1000}
              className="field"
              value={form.alternativeWalkingRoute}
              onChange={(event) =>
                update(
                  "alternativeWalkingRoute",
                  event.target.value
                )
              }
              placeholder="Describe an approved pedestrian diversion"
            />
          </Field>

        </div>

      </div>


      {/* ------------------------------------------ */}
      {/* FUNCTION 3: BUSINESS ACCESS */}
      {/* ------------------------------------------ */}

      <div className="border-t border-slate-200 pt-5">

        <h3 className="mb-4 text-lg font-bold">
          Business Access Information
        </h3>

        <div className="space-y-4">

          <Field label="Business Access Status">
            <select
              className="field"
              value={form.businessStatus}
              onChange={(event) =>
                update(
                  "businessStatus",
                  event.target.value
                )
              }
            >
              <option value="Normal Access">
                Normal Access
              </option>

              <option value="Limited Access">
                Limited Access
              </option>

              <option value="Temporarily Restricted">
                Temporarily Restricted
              </option>

              <option value="Alternative Access Available">
                Alternative Access Available
              </option>
            </select>
          </Field>

          <Field label="Affected Business Premises">
            <textarea
              rows={3}
              maxLength={1000}
              className="field"
              value={form.affectedBusinesses}
              onChange={(event) =>
                update(
                  "affectedBusinesses",
                  event.target.value
                )
              }
              placeholder="List affected shops or business areas"
            />
          </Field>

          <Field label="Alternative Business Access">
            <textarea
              rows={3}
              maxLength={1000}
              className="field"
              value={form.alternativeBusinessAccess}
              onChange={(event) =>
                update(
                  "alternativeBusinessAccess",
                  event.target.value
                )
              }
              placeholder="Describe alternative customer or delivery access"
            />
          </Field>

        </div>

      </div>


      {/* ------------------------------------------ */}
      {/* FEATURED ANNOUNCEMENT */}
      {/* ------------------------------------------ */}

      <label className="flex items-center gap-3 text-sm text-slate-700">

        <input
          type="checkbox"
          className="h-4 w-4 accent-teal"
          checked={!!form.featured}
          onChange={(event) =>
            update("featured", event.target.checked)
          }
        />

        Feature this announcement on the home page

      </label>


      {/* ------------------------------------------ */}
      {/* FORM BUTTONS */}
      {/* ------------------------------------------ */}

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">

        <button
          type="button"
          onClick={onCancel}
          className="secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={invalidDate || invalidCoordinates}
          className="primary"
        >
          {initial ? "Save changes" : "Publish announcement"}
        </button>

      </div>

    </form>
  );
}


// =====================================================
// 12. FEEDBACK FORM
// MODULE 2: COMMUNITY FEEDBACK
// =====================================================

const initialFeedback = {
  name: "",
  email: "",
  category: "Noise & Vibration",
  location: "",
  description: "",
};

function FeedbackForm({ onSubmit }) {
  const [form, setForm] = useState(initialFeedback);

  const [submitted, setSubmitted] = useState(null);

  // Update feedback fields
  const update = (key, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [key]: value,
    }));
  };

  // Submit feedback
  const handleSubmit = (event) => {
    event.preventDefault();

    const id = onSubmit(form);

    setSubmitted(id);
  };

  // Reset feedback form
  const resetForm = () => {
    setForm(initialFeedback);
    setSubmitted(null);
  };


  // ---------------------------------------------
  // FEEDBACK SUBMISSION SUCCESS
  // ---------------------------------------------

  if (submitted) {
    return (
      <div className="panel p-8 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={34} />
        </div>

        <h3 className="mt-5 text-xl font-extrabold">
          Feedback submitted
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Your report is saved in this browser.
          Keep this reference to check its status here.
        </p>

        <div className="mx-auto mt-5 max-w-xs rounded-xl bg-slate-50 p-4">

          <p className="text-xs uppercase tracking-wider text-slate-500">
            Tracking reference
          </p>

          <p className="mt-1 font-mono text-lg font-extrabold text-teal">
            {submitted}
          </p>

        </div>

        <button
          type="button"
          className="secondary mt-6"
          onClick={resetForm}
        >
          Submit another report
        </button>

      </div>
    );
  }


  // ---------------------------------------------
  // FEEDBACK INPUT FORM
  // ---------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="panel space-y-5 p-6 sm:p-8"
    >

      <div className="grid gap-5 sm:grid-cols-2">

        <Field label="Full name" required>
          <input
            required
            maxLength={100}
            autoComplete="name"
            className="field"
            placeholder="Your name"
            value={form.name}
            onChange={(event) =>
              update("name", event.target.value)
            }
          />
        </Field>

        <Field label="Email address" required>
          <input
            required
            type="email"
            maxLength={150}
            autoComplete="email"
            className="field"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) =>
              update("email", event.target.value)
            }
          />
        </Field>

      </div>

      <Field label="Feedback category" required>
        <select
          className="field"
          value={form.category}
          onChange={(event) =>
            update("category", event.target.value)
          }
        >
          {FEEDBACK_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Affected location" required>
        <input
          required
          maxLength={150}
          className="field"
          placeholder="Street, neighbourhood or nearby landmark"
          value={form.location}
          onChange={(event) =>
            update("location", event.target.value)
          }
        />
      </Field>

      <Field label="Describe the issue" required>
        <textarea
          required
          minLength={10}
          maxLength={3000}
          rows={6}
          className="field"
          placeholder="Explain what happened and how it affects you"
          value={form.description}
          onChange={(event) =>
            update("description", event.target.value)
          }
        />
      </Field>

      <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">

        <CircleHelp
          className="mt-0.5 shrink-0"
          size={16}
        />

        This is a demonstration portal.
        Do not submit sensitive personal information
        or urgent safety reports.
        Entries are saved only to this browser.

      </p>

      <button
        className="primary w-full"
        type="submit"
      >
        <Send size={17} />
        Submit feedback
      </button>

    </form>
  );
}


// =====================================================
// 13. FEEDBACK DETAILS
// MODULE 4: FEEDBACK MANAGEMENT AND TRACKING
// =====================================================

function FeedbackDetails({
  item,
  onClose,
  isAdmin = false,
  onUpdate,
}) {
  const [status, setStatus] = useState(item.status);

  const [note, setNote] = useState(
    item.adminNote || ""
  );

  // Save administrator updates
  const handleUpdate = (event) => {
    event.preventDefault();

    onUpdate(item.id, {
      status: status,
      adminNote: note.trim(),
    });

    onClose();
  };

  return (
    <Modal
      title="Feedback details"
      onClose={onClose}
    >

      {/* Feedback reference and status */}
      <div className="flex flex-wrap items-center justify-between gap-2">

        <span className="font-mono text-sm font-bold text-teal">
          {item.id}
        </span>

        <StatusPill status={item.status} />

      </div>


      {/* Feedback category */}
      <h3 className="mt-5 text-xl font-extrabold">
        {item.category}
      </h3>


      {/* Feedback information */}
      <div className="mt-4 space-y-2 text-sm text-slate-600">

        <p>
          <b>Location:</b> {item.location}
        </p>

        <p>
          <b>Submitted:</b> {formatDate(item.createdAt)}
        </p>

        <p>
          <b>Last updated:</b> {formatDate(item.updatedAt)}
        </p>

        {/* Reporter information visible to administrators */}
        {isAdmin && (
          <>
            <p>
              <b>Submitted by:</b> {item.name}
            </p>

            <p>
              <b>Email:</b> {item.email}
            </p>
          </>
        )}

      </div>


      {/* Issue description */}
      <div className="mt-5 rounded-xl bg-slate-50 p-5">

        <p className="mb-2 text-xs font-bold uppercase text-slate-500">
          Issue description
        </p>

        <p className="whitespace-pre-wrap text-sm leading-7">
          {item.description}
        </p>

      </div>


      {/* ------------------------------------------ */}
      {/* PUBLIC USER: VIEW STATUS UPDATE */}
      {/* ------------------------------------------ */}

      {!isAdmin && item.adminNote && (
        <div className="mt-4 rounded-xl border border-teal/15 bg-mint/40 p-4 text-sm">

          <b>Latest administrator update</b>

          <p className="mt-1 whitespace-pre-wrap text-slate-600">
            {item.adminNote}
          </p>

        </div>
      )}


      {/* ------------------------------------------ */}
      {/* ADMINISTRATOR: UPDATE FEEDBACK */}
      {/* ------------------------------------------ */}

      {isAdmin && (
        <form
          className="mt-6 space-y-4"
          onSubmit={handleUpdate}
        >

          <Field label="Update status">
            <select
              className="field"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              {FEEDBACK_STATUSES.map((feedbackStatus) => (
                <option
                  key={feedbackStatus}
                  value={feedbackStatus}
                >
                  {feedbackStatus}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Update note (visible in tracking)">
            <textarea
              rows={3}
              maxLength={1000}
              className="field"
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
            />
          </Field>

          <button
            className="primary w-full"
            type="submit"
          >
            Save feedback update
          </button>

        </form>
      )}

    </Modal>
  );
}


// =====================================================
// 14. EXPORT COMPONENTS
// =====================================================

export {
  CategoryPill,
  StatusPill,
  Empty,
  SectionHead,
  AnnouncementCard,
  Modal,
  AnnouncementDetails,
  Field,
  AnnouncementForm,
  FeedbackForm,
  FeedbackDetails,
};
