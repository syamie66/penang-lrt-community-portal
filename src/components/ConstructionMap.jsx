
import React from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


// =====================================================
// CONSTRUCTION MAP COMPONENT
// =====================================================

function ConstructionMap({
  latitude,
  longitude,
  title,
  location,
  affectedAreas,
}) {

  // ---------------------------------------------------
  // 1. VALIDATE LOCATION COORDINATES
  // ---------------------------------------------------

  // Convert coordinates into numbers
  const lat = Number(latitude);
  const lng = Number(longitude);

  // Check whether valid coordinates were provided
  const isValidLocation =
    latitude !== undefined &&
    latitude !== null &&
    latitude !== "" &&
    longitude !== undefined &&
    longitude !== null &&
    longitude !== "" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  // Show message if location is unavailable
  if (!isValidLocation) {
    return (
      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">

        <p className="text-sm font-semibold text-slate-600">
          Map location is not available.
        </p>

        <p className="mt-2 text-xs text-slate-500">
          No valid construction location coordinates
          have been provided for this announcement.
        </p>

      </div>
    );
  }


  // ---------------------------------------------------
  // 2. MAP CONFIGURATION
  // ---------------------------------------------------

  const position = [lat, lng];

  const mapZoom = 15;


  // ---------------------------------------------------
  // 3. RENDER INTERACTIVE MAP
  // ---------------------------------------------------

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">

      {/* Map heading */}
      <div className="border-b border-slate-100 p-4">

        <h3 className="text-base font-bold text-slate-800">
          Construction Location Map
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Explore the affected construction location.
        </p>

      </div>


      {/* Interactive OpenStreetMap */}
      <MapContainer
        key={`${lat}-${lng}`}
        center={position}
        zoom={mapZoom}
        scrollWheelZoom={false}
        style={{
          height: "350px",
          width: "100%",
        }}
      >

        {/* Map background */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* Construction location marker */}
        <CircleMarker
          center={position}
          radius={10}
          pathOptions={{
            color: "#0f766e",
            fillColor: "#14b8a6",
            fillOpacity: 0.85,
            weight: 3,
          }}
        >

          {/* Marker popup */}
          <Popup>

            <div>

              <h4 className="font-bold">
                {title || "Construction Location"}
              </h4>

              {location && (
                <p>
                  <strong>Location:</strong> {location}
                </p>
              )}

              {affectedAreas && (
                <p>
                  <strong>Affected Areas:</strong> {affectedAreas}
                </p>
              )}

            </div>

          </Popup>

        </CircleMarker>

      </MapContainer>


      {/* Map footer */}
      <div className="border-t border-slate-100 bg-slate-50 p-3">

        <p className="text-xs text-slate-500">
          Marker indicates an administrator-provided
          construction location. Follow verified on-site
          instructions for access arrangements.
        </p>

      </div>

    </div>
  );
}


// =====================================================
// EXPORT COMPONENT
// =====================================================

export default ConstructionMap;
