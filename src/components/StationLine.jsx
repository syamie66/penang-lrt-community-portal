
import React from "react";
import { TrainFront } from "lucide-react";

// ================================================
// LRT MUTIARA LINE STATIONS
// ================================================

const stations = [
  "PSR-A",
  "Permatang Damar Laut",
  "Penang International Airport",
  "Sungai Tiram",
  "FIZ South",
  "FIZ North",
  "Jalan Tengah",
  "SPICE",
  "Bukit Jambul",
  "Sungai Nibong",
  "Sungai Dua",
  "Batu Uban",
  "Jalan Universiti",
  "Gelugor",
  "Penang Waterfront",
  "East Jelutong",
  "Sungai Pinang",
  "Bandar Sri Pinang",
  "Macallum",
];

const branches = [
  {
    destination: "KOMTAR",
    stations: ["KOMTAR"],
  },
  {
    destination: "Penang Sentral",
    stations: ["Jalan Bagan Luar", "Penang Sentral"],
  },
];

// ================================================
// STATION ROW COMPONENT
// ================================================

function StationRow({ names }) {
  return (
    <div className="flex min-w-max items-start py-3">
      {names.map((name, index) => (
        <div
          key={`${name}-${index}`}
          className="flex w-36 flex-col items-center"
        >
          {/* Station marker and rail line */}
          <div className="flex w-full items-center">
            <div className="h-1 flex-1 bg-teal" />

            <div
              className="
                h-5 w-5 shrink-0 rounded-full
                border-4 border-teal bg-white
              "
            />

            <div className="h-1 flex-1 bg-teal" />
          </div>

          {/* Station name */}
          <p className="mt-3 max-w-32 text-center text-xs font-bold text-navy">
            {name}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Station {index + 1}
          </p>
        </div>
      ))}
    </div>
  );
}

// ================================================
// MAIN STATION LINE
// ================================================

function StationLine() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

      {/* Section heading */}
      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-mint p-3 text-teal">
          <TrainFront size={26} />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-navy">
            LRT Mutiara Line Stations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explore the planned station sequence
          </p>
        </div>

      </div>

      {/* Horizontal main line */}
      <div className="panel overflow-hidden p-5">

        <p className="mb-4 text-sm font-bold text-teal">
          Main Alignment: PSR-A → Macallum
        </p>

        <div
          className="overflow-x-auto pb-4"
          role="region"
          aria-label="Main LRT station alignment"
          tabIndex={0}
        >
          <StationRow names={stations} />
        </div>

        {/* Destination branches */}
        <div className="mt-6 border-t border-slate-100 pt-5">

          <p className="mb-4 text-sm font-bold text-teal">
            Branches from Macallum
          </p>

          <div className="grid gap-5 md:grid-cols-2">

            {branches.map((branch) => (
              <div
                key={branch.destination}
                className="rounded-xl bg-slate-50 p-4"
              >
                <h3 className="text-sm font-bold text-navy">
                  Macallum → {branch.destination}
                </h3>

                <div className="mt-3 overflow-x-auto">
                  <StationRow
                    names={[
                      "Macallum",
                      ...branch.stations,
                    ]}
                  />
                </div>

              </div>
            ))}

          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Planned station sequence for demonstration.
          Scroll horizontally to see all stations.
          This diagram is not drawn to geographic scale.
        </p>

      </div>

    </section>
  );
}

export default StationLine;
