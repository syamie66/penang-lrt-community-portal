import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  Polyline,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PENANG_CENTER = [5.35, 100.30];

function validPoint(value) {
  return Array.isArray(value) && value.length >= 2 &&
    Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1])) &&
    Number(value[0]) >= -90 && Number(value[0]) <= 90 &&
    Number(value[1]) >= -180 && Number(value[1]) <= 180;
}

function normalizePoints(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(validPoint).map(([lat, lng]) => [Number(lat), Number(lng)]);
}

function parseLegacyPoints(value) {
  const lines = String(value ?? "").trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const points = [];
  for (const line of lines) {
    const cells = line.split(",").map((cell) => cell.trim());
    if (cells.length !== 2 || cells.some((cell) => cell === "")) return [];
    const point = cells.map(Number);
    if (!validPoint(point)) return [];
    points.push(point);
  }
  return points;
}

function MapClickHandler({ enabled, onMapClick }) {
  useMapEvents({
    click(event) {
      if (!enabled || !onMapClick) return;
      onMapClick([
        Number(event.latlng.lat.toFixed(6)),
        Number(event.latlng.lng.toFixed(6)),
      ]);
    },
  });
  return null;
}

function FitMapToData({ coordinates, fitKey }) {
  const map = useMap();

  useEffect(() => {
    const points = normalizePoints(coordinates);
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 16 });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    }
    const frame = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(frame);
  }, [map, fitKey, coordinates]);

  return null;
}

/**
 * Construction location map for the community portal.
 * It searches by place name and lets administrators outline a closure area.
 * It intentionally does not calculate routes; administrators enter an
 * approved diversion description and optional Google Maps URL in Common.jsx.
 */
export default function ConstructionMap({
  title = "Construction location",
  location = "",
  affectedAreas = "",
  mapData,
  onChange,
  editable = false,
  // Legacy props retained so older announcements continue to render.
  latitude,
  longitude,
  affectedRoadPoints,
}) {
  const legacyLat = String(latitude ?? "").trim();
  const legacyLng = String(longitude ?? "").trim();
  const legacySitePoint = legacyLat !== "" && legacyLng !== "" &&
    validPoint([Number(legacyLat), Number(legacyLng)])
    ? [Number(legacyLat), Number(legacyLng)]
    : null;

  const savedSitePoint = validPoint(mapData?.sitePoint)
    ? normalizePoints([mapData.sitePoint])[0]
    : null;
  const sitePoint = savedSitePoint || legacySitePoint;
  const siteLabel = mapData?.siteLabel || "";
  const closurePolygon = normalizePoints(mapData?.closurePolygon);
  const legacyAffectedLine = parseLegacyPoints(affectedRoadPoints);

  const [editMode, setEditMode] = useState(false);
  const [draftClosure, setDraftClosure] = useState(closurePolygon);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fitKey, setFitKey] = useState(0);

  useEffect(() => {
    setDraftClosure(closurePolygon);
    // Load the saved outline when switching announcements or editing an existing one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapData?.closurePolygon]);

  const currentMapData = useMemo(() => ({
    ...(mapData || {}),
    sitePoint,
    siteLabel,
    closurePolygon,
  }), [mapData, sitePoint, siteLabel, closurePolygon]);

  const updateMapData = (changes) => {
    if (onChange) onChange({ ...currentMapData, ...changes });
  };

  const handleMapClick = (point) => {
    setError("");
    setDraftClosure((previous) => [...previous, point]);
    setMessage("Point added. Mark at least three corners around the closure, then finish the area.");
  };

  const locateConstructionArea = async () => {
    if (!String(location).trim()) {
      setError("Enter the affected location above before searching the map.");
      return;
    }

    setSearching(true);
    setError("");
    setMessage("");

    try {
      const query = `${location.trim()}, Penang, Malaysia`;
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=my&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, { headers: { "Accept-Language": "en" } });
      if (!response.ok) throw new Error("The map search service could not be reached. Please try again.");
      const results = await response.json();
      if (!Array.isArray(results) || !results.length) {
        throw new Error("No matching place was found. Try a more specific road name or nearby landmark.");
      }

      const result = results[0];
      const point = [Number(result.lat), Number(result.lon)];
      if (!validPoint(point)) throw new Error("The map service returned an invalid location.");

      updateMapData({ sitePoint: point, siteLabel: result.display_name || location.trim() });
      setFitKey((value) => value + 1);
      setMessage(`Location found: ${result.display_name || location.trim()}. Check the marker and outline the exact construction area if needed.`);
    } catch (searchError) {
      setError(searchError.message || "Unable to find this location.");
    } finally {
      setSearching(false);
    }
  };

  const finishClosureArea = () => {
    if (draftClosure.length < 3) {
      setError("Mark at least three points around the construction area before finishing it.");
      return;
    }
    updateMapData({ closurePolygon: draftClosure });
    setEditMode(false);
    setError("");
    setMessage("Construction area saved. Enter the approved alternative-road instructions and optional map link in the form.");
  };

  const clearClosureArea = () => {
    setDraftClosure([]);
    updateMapData({ closurePolygon: [] });
    setEditMode(false);
    setError("");
    setMessage("Construction-area outline cleared.");
  };

  const visibleClosure = editMode ? draftClosure : closurePolygon;
  const allPoints = [
    ...(sitePoint ? [sitePoint] : []),
    ...visibleClosure,
    ...legacyAffectedLine,
  ];
  const initialCenter = sitePoint || visibleClosure[0] || legacyAffectedLine[0] || PENANG_CENTER;

  if (!editable && allPoints.length === 0) {
    return (
      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-600">Map location is not available.</p>
        <p className="mt-2 text-xs text-slate-500">
          The administrator has not located the construction area or marked a closure outline for this announcement.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-[#dce5f1] bg-white">
      <div className="border-b border-slate-100 p-4 sm:p-5">
        <h3 className="text-base font-bold text-[#073b78]">Construction Area Map</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          The map shows the located construction site and any closure area marked by the administrator. Alternative-road instructions are provided separately and are not calculated automatically.
        </p>

        {editable && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={locateConstructionArea} disabled={searching} className="primary disabled:opacity-60">
              {searching ? "Searching map…" : "Find construction location"}
            </button>
            <button type="button" onClick={() => {
              setDraftClosure([]);
              setEditMode(true);
              setError("");
              setMessage("Click at least three points around the construction-area boundary on the map.");
            }} className={editMode ? "primary" : "secondary"}>
              Mark construction area
            </button>
            {editMode && (
              <button type="button" onClick={finishClosureArea} className="secondary">
                Finish construction area ({draftClosure.length} points)
              </button>
            )}
            <button type="button" onClick={clearClosureArea} className="secondary">
              Clear outline
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
          {(visibleClosure.length >= 2 || legacyAffectedLine.length >= 2) && (
            <span className="inline-flex items-center gap-2 text-[#e5092d]">
              <span className="h-1 w-7 rounded-full bg-[#e5092d]" /> Construction closure area
            </span>
          )}
          {sitePoint && <span className="text-slate-600">● Located construction site</span>}
        </div>
      </div>

      {(message || error) && (
        <div className={`mx-4 mt-4 rounded-lg p-3 text-xs leading-5 ${error ? "bg-red-50 text-red-700" : "bg-[#e9f2fc] text-[#073b78]"}`} role={error ? "alert" : "status"}>
          {error || message}
        </div>
      )}

      {siteLabel && (
        <p className="px-4 pt-3 text-xs text-slate-500">Located place: {siteLabel}</p>
      )}

      <MapContainer
        center={initialCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: editable ? "390px" : "350px", width: "100%", cursor: editable && editMode ? "crosshair" : "grab" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitMapToData coordinates={allPoints} fitKey={fitKey} />
        {editable && <MapClickHandler enabled={editMode} onMapClick={handleMapClick} />}

        {visibleClosure.length >= 3 ? (
          <Polygon positions={visibleClosure} pathOptions={{ color: "#e5092d", weight: 3, opacity: 0.95, fillColor: "#e5092d", fillOpacity: 0.22 }}>
            <Popup>Construction / road closure area</Popup>
          </Polygon>
        ) : visibleClosure.length >= 2 ? (
          <Polyline positions={visibleClosure} pathOptions={{ color: "#e5092d", weight: 4, dashArray: "7 6" }}>
            <Popup>Construction-area outline in progress</Popup>
          </Polyline>
        ) : null}

        {legacyAffectedLine.length >= 2 && closurePolygon.length < 3 && (
          <Polyline positions={legacyAffectedLine} pathOptions={{ color: "#e5092d", weight: 5, opacity: 0.9 }}>
            <Popup>Previously saved affected road line</Popup>
          </Polyline>
        )}

        {sitePoint && (
          <CircleMarker center={sitePoint} radius={8} pathOptions={{ color: "#073b78", fillColor: "#ffffff", fillOpacity: 1, weight: 3 }}>
            <Popup>
              <strong>{title || "Construction location"}</strong>
              {location && <p>Location: {location}</p>}
              {affectedAreas && <p>Affected areas: {affectedAreas}</p>}
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      <p className="border-t border-slate-100 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
        Map data © OpenStreetMap contributors. The map does not provide live closure information or calculate alternative routes. Follow approved diversion instructions and official on-site signs.
      </p>
    </section>
  );
}
