

import React from "react";
import { TrainFront } from "lucide-react";

// =====================================================
// 1. STATION DATA
// =====================================================

// Top row: left to right
const topStations = [
  { code: "A01", name: "PSR-A" },
  { code: "S02", name: "Permatang Damar Laut" },
  { code: "S03", name: "Penang International Airport" },
  { code: "S04", name: "Sungai Tiram" },
  { code: "S05", name: "FIZ South" },
  { code: "S06", name: "FIZ North" },
  { code: "S07", name: "Jalan Tengah" },
  { code: "S08", name: "SPICE" },
  { code: "S09", name: "Bukit Jambul" },
  { code: "S10", name: "Sungai Nibong" },
];

// Bottom row: right to left
const bottomStations = [
  { code: "S11", name: "Sungai Dua" },
  { code: "S12", name: "Batu Uban" },
  { code: "S13", name: "Jalan Universiti" },
  { code: "S14", name: "Gelugor" },
  { code: "S15", name: "Penang Waterfront" },
  { code: "S16", name: "East Jelutong" },
  { code: "S17", name: "Sungai Pinang" },
  { code: "S18", name: "Bandar Sri Pinang" },
  { code: "S19", name: "Macallum" },
  { code: "S20", name: "KOMTAR" },
];

// Penang Sentral branch
const branchStation = {
  code: "S31",
  name: "Penang Sentral (Terminus)",
};


// =====================================================
// 2. STATION COORDINATES FOR SVG
// =====================================================

// Diagram coordinates, not geographic coordinates
const START_X = 100;
const STATION_GAP = 110;

const TOP_Y = 80;
const BOTTOM_Y = 290;

// Position top stations
const topPositions = topStations.map((station, index) => ({
  ...station,
  x: START_X + index * STATION_GAP,
  y: TOP_Y,
}));

// Position bottom stations from right to left
const bottomPositions = bottomStations.map((station, index) => ({
  ...station,
  x: START_X + (9 - index) * STATION_GAP,
  y: BOTTOM_Y,
}));


// =====================================================
// 3. STATION LABEL COMPONENT
// =====================================================

function StationMarker({
  code,
  name,
  x,
  y,
  selected = false,
  onClick,
}) {

  // Split long station names into multiple lines
  const words = name.split(" ");

  const lines = [];

  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (nextLine.length > 15 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`${code}: ${name}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
    >

      {/* Station code badge */}
      <rect
        x={x - 23}
        y={y - 49}
        width="46"
        height="22"
        rx="11"
        fill={selected ? "#0b5260" : "#e2e8f0"}
      />

      <text
        x={x}
        y={y - 34}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={selected ? "#ffffff" : "#334155"}
      >
        {code}
      </text>

      {/* Station circle */}
      <circle
        cx={x}
        cy={y}
        r={selected ? 12 : 10}
        fill="#ffffff"
        stroke={selected ? "#075985" : "#64748b"}
        strokeWidth={selected ? 4 : 2.5}
      />

      {/* Station name */}
      <text
        x={x}
        y={y + 27}
        textAnchor="middle"
        fontSize="12"
        fontWeight={selected ? "700" : "500"}
        fill="#102a43"
      >

        {lines.map((line, index) => (
          <tspan
            key={index}
            x={x}
            dy={index === 0 ? 0 : 16}
          >
            {line}
          </tspan>
        ))}

      </text>

    </g>
  );
}


// =====================================================
// 4. MAIN STATION LINE COMPONENT
// =====================================================

function StationLine() {

  const [selectedStation, setSelectedStation] =
    React.useState("S19");

  const handleStationClick = (station) => {
    setSelectedStation(station.code);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

      {/* ========================================== */}
      {/* SECTION HEADING */}
      {/* ========================================== */}

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-mint p-3 text-teal">
          <TrainFront size={26} />
        </div>

        <div>

          <h2 className="text-2xl font-extrabold text-navy">
            LRT Mutiara Line Stations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explore the planned station alignment
          </p>

        </div>

      </div>


      {/* ========================================== */}
      {/* STATION DIAGRAM CARD */}
      {/* ========================================== */}

      <div className="panel overflow-hidden p-5 sm:p-7">

        {/* Scroll container for smaller screens */}
        <div
          className="overflow-x-auto pb-4"
          role="region"
          aria-label="LRT Mutiara Line station diagram"
          tabIndex={0}
        >

          <svg
            viewBox="0 0 1200 390"
            className="min-w-[1100px] w-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Schematic diagram of the planned LRT Mutiara Line stations"
          >

            {/* ====================================== */}
            {/* MAIN RAILWAY TRACK */}
            {/* ====================================== */}

            {/* Top horizontal track */}
            <path
              d="M 100 80 H 1090"
              fill="none"
              stroke="#64748b"
              strokeWidth="3"
            />

            {/* Curved connection on the right */}
            <path
              d="
                M 1090 80
                H 1115
                Q 1160 80 1160 125
                V 245
                Q 1160 290 1115 290
                H 1090
              "
              fill="none"
              stroke="#075985"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Bottom horizontal track */}
            <path
              d="M 1090 290 H 100"
              fill="none"
              stroke="#075985"
              strokeWidth="4"
              strokeLinecap="round"
            />


            {/* ====================================== */}
            {/* PENANG SENTRAL BRANCH */}
            {/* ====================================== */}

            <path
              d="
                M 100 170
                H 140
                Q 170 170 170 200
                V 260
                Q 170 290 200 290
                H 210
              "
              fill="none"
              stroke="#075985"
              strokeWidth="4"
              strokeLinecap="round"
            />


            {/* ====================================== */}
            {/* TOP ROW STATIONS: A01 - S10 */}
            {/* ====================================== */}

            {topPositions.map((station) => (

              <StationMarker
                key={station.code}
                code={station.code}
                name={station.name}
                x={station.x}
                y={station.y}
                selected={selectedStation === station.code}
                onClick={() => handleStationClick(station)}
              />

            ))}


            {/* ====================================== */}
            {/* BOTTOM ROW STATIONS: S11 - S20 */}
            {/* ====================================== */}

            {bottomPositions.map((station) => (

              <StationMarker
                key={station.code}
                code={station.code}
                name={station.name}
                x={station.x}
                y={station.y}
                selected={selectedStation === station.code}
                onClick={() => handleStationClick(station)}
              />

            ))}


            {/* ====================================== */}
            {/* PENANG SENTRAL STATION: S31 */}
            {/* ====================================== */}

            <StationMarker
              code={branchStation.code}
              name={branchStation.name}
              x={100}
              y={170}
              selected={selectedStation === "S31"}
              onClick={() => handleStationClick(branchStation)}
            />

          </svg>

        </div>


        {/* ========================================== */}
        {/* SELECTED STATION INFORMATION */}
        {/* ========================================== */}

        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">

          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            Selected Station
          </p>

          <p className="mt-2 text-lg font-bold text-navy">

            {[
              ...topStations,
              ...bottomStations,
              branchStation,
            ].find(
              (station) =>
                station.code === selectedStation
            )?.name}

          </p>

          <p className="mt-1 text-sm text-slate-500">
            Station reference: {selectedStation}
          </p>

        </div>


        {/* ========================================== */}
        {/* INFORMATION NOTE */}
        {/* ========================================== */}

        <p className="mt-5 text-xs leading-6 text-slate-500">

          Schematic layout of the planned Penang LRT
          Mutiara Line. The diagram is not drawn to
          geographical scale and does not represent
          actual railway track geometry or construction
          progress.

        </p>

      </div>

    </section>
  );
}


// =====================================================
// EXPORT
// =====================================================

export default StationLine;
