
import React from "react";

import {
  MessageSquareText,
} from "lucide-react";

// Shared components
import {
  SectionHead,
  FeedbackForm,
} from "../components/Common.jsx";


// =====================================================
// FEEDBACK SUBMISSION STEPS
// =====================================================

const feedbackSteps = [
  {
    number: "01",
    title: "Submit your report",
    description: "Describe the issue and affected location.",
  },
  {
    number: "02",
    title: "Receive a tracking reference",
    description:
      "A reference number is generated using the submission date.",
  },
  {
    number: "03",
    title: "Track using your email",
    description:
      "Enter your email to find your submitted reports.",
  },
];


// =====================================================
// COMMUNITY FEEDBACK COMPONENT
// MODULE 2: FEEDBACK SUBMISSION
// =====================================================

function CommunityFeedback({ addFeedback }) {

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8">

      {/* ============================================= */}
      {/* PAGE HEADING */}
      {/* ============================================= */}

      <SectionHead
        eyebrow="We want to hear from you"
        title="Submit Community Feedback"
        description="Tell us about construction-related disruptions, pedestrian access issues or problems affecting your neighbourhood."
      />


      {/* ============================================= */}
      {/* MAIN CONTENT */}
      {/* ============================================= */}

      <div className="grid items-start gap-7 lg:grid-cols-[1fr_300px]">

        {/* ------------------------------------------- */}
        {/* LEFT: FEEDBACK SUBMISSION FORM */}
        {/* ------------------------------------------- */}

        <div>
          <FeedbackForm onSubmit={addFeedback} />
        </div>


        {/* ------------------------------------------- */}
        {/* RIGHT: INFORMATION SIDEBAR */}
        {/* ------------------------------------------- */}

        <aside className="space-y-5">

          {/* ======================================= */}
          {/* YOUR FEEDBACK MATTERS */}
          {/* ======================================= */}

          <div className="rounded-2xl bg-navy p-6 text-white">

            <MessageSquareText
              size={28}
              className="text-[#77dfc8]"
            />

            <h3 className="mt-4 text-lg font-extrabold">
              Your Feedback Matters
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Share a clear location, choose the most
              relevant category and describe the issue.

              The demonstration administrator can review
              your report and update its status.
            </p>

          </div>


          {/* ======================================= */}
          {/* WHAT HAPPENS NEXT? */}
          {/* ======================================= */}

          <div className="panel p-6">

            <h3 className="font-extrabold">
              What Happens Next?
            </h3>

            <div className="mt-5 space-y-5">

              {feedbackSteps.map((step) => (

                <div
                  key={step.number}
                  className="flex items-start gap-3"
                >

                  {/* Step number */}
                  <span className="shrink-0 rounded-lg bg-mint px-3 py-2 text-sm font-extrabold text-teal">
                    {step.number}
                  </span>


                  {/* Step information */}
                  <div>

                    <p className="text-sm font-bold text-navy">
                      {step.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {step.description}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </aside>

      </div>

    </section>
  );
}


// =====================================================
// EXPORT COMPONENT
// =====================================================

export default CommunityFeedback;
