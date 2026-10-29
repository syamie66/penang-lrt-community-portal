import React from "react";
import { TrainFront } from "lucide-react";

// Station locations are schematic, not geographic coordinates.
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


// Station names and codes use the portal's navy / red / white theme.
function StationMarker({ code, name, x, y }) {
  const lines = [];
  let currentLine = "";
  name.split(" ").forEach((word) => {
    const next = currentLine ? `${currentLine} ${word}` : word;
    if (next.length > 15 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = next;
    }
  });
  if (currentLine) lines.push(currentLine);

  return (
    <g aria-label={`${code}: ${name}`}>
      <rect x={x - 23} y={y - 49} width={46} height={22} rx={11} fill="#e9f2fc" />
      <text x={x} y={y - 34} textAnchor="middle" fontSize="11" fontWeight="700" fill="#073b78">
        {code}
      </text>
      <circle cx={x} cy={y} r={10} fill="#fff" stroke="#e5092d" strokeWidth={3} />
      <circle cx={x} cy={y} r={3} fill="#073b78" />
      <text x={x} y={y + 27} textAnchor="middle" fontSize="12" fontWeight="600" fill="#092b4c">
        {lines.map((line, index) => (
          <tspan key={index} x={x} dy={index === 0 ? 0 : 16}>{line}</tspan>
        ))}
      </text>
    </g>
  );
}

export default function StationLine() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0f3] text-[#e5092d]">
          <TrainFront size={25} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#092b4c]">LRT Mutiara Line Stations</h2>
          <p className="mt-1 text-sm text-slate-500">Explore the planned station alignment</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dce5f1] bg-white p-5 shadow-[0_12px_35px_rgba(7,59,120,0.08)] sm:p-7">
        <div className="overflow-x-auto pb-2" role="region" aria-label="LRT Mutiara Line station diagram" tabIndex={0}>
          <svg viewBox="0 0 1200 370" className="w-full min-w-[1100px]" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schematic diagram of the planned LRT Mutiara Line stations">
            <path d="M 100 80 H 1090" fill="none" stroke="#073b78" strokeWidth="4" strokeLinecap="round" />
            <path d="M 1090 80 H 1115 Q 1160 80 1160 125 V 245 Q 1160 290 1115 290 H 1090" fill="none" stroke="#073b78" strokeWidth="4" strokeLinecap="round" />
            <path d="M 1090 290 H 100" fill="none" stroke="#073b78" strokeWidth="4" strokeLinecap="round" />
            <path d="M 100 170 H 140 Q 170 170 170 200 V 260 Q 170 290 200 290 H 210" fill="none" stroke="#e5092d" strokeWidth="4" strokeLinecap="round" />

            {topPositions.map((station) => <StationMarker key={station.code} {...station} />)}
            {bottomPositions.map((station) => <StationMarker key={station.code} {...station} />)}
            <StationMarker {...branchStation} x={100} y={170} />
          </svg>
        </div>

        <p className="mt-3 border-t border-[#dce5f1] pt-4 text-xs leading-6 text-slate-500">
          Schematic layout of the planned Penang LRT Mutiara Line. The diagram is not drawn to geographical scale and does not represent actual railway track geometry or construction progress.
        </p>
      </div>
    </section>
  );
}
