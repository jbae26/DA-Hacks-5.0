import { useEffect, useMemo, useRef, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import {
  Expand,
  Layers,
  Mountain,
  Satellite,
  UsersRound,
  Route,
} from "lucide-react";
import { mobilityByZone, assessDestination } from "../mobilityData.js";
import "leaflet/dist/leaflet.css";
import "./TransitMap.css";

const NATIONAL_BOUNDS = [
  [24.8, -124.8],
  [49.6, -66.8],
];
const COLORS = { High: "#e56b5b", Medium: "#e6b34b", Low: "#42a699" };
const TERRAIN_COLORS = { High: "#bb715b", Moderate: "#cead61", Low: "#73a98a" };

function MapViewport({
  zones,
  compact,
  resetKey,
  selectedZoneId,
  destinationsEnabled,
}) {
  const map = useMap();
  const signature = zones
    .map((zone) => `${zone.id}:${zone.lat}:${zone.lng}`)
    .join("|");

  useEffect(() => {
    // Keep the national context when all zones are shown; filtered views can zoom closer.
    const selected =
      !compact &&
      destinationsEnabled &&
      zones.find((zone) => zone.id === selectedZoneId);
    const bounds = selected
      ? [
          [selected.lat, selected.lng],
          ...mobilityByZone[selected.id].destinations.map((d) => [
            d.lat,
            d.lng,
          ]),
        ]
      : zones.length > 4 || !zones.length
        ? NATIONAL_BOUNDS
        : zones.map((zone) => [Number(zone.lat), Number(zone.lng)]);
    let frame;
    const fitViewport = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // The detail panel changes the container width. Refresh Leaflet's size
        // before fitting so the selected zone stays centered in the visible map.
        map.invalidateSize({ pan: false });
        map.fitBounds(bounds, {
          paddingTopLeft: compact ? [26, 38] : selected ? [38, 76] : [52, 62],
          paddingBottomRight: compact
            ? [26, 38]
            : selected
              ? [54, 92]
              : [52, 62],
          maxZoom: selected ? 11 : 7,
          animate: false,
        });
      });
    };
    const observer = new ResizeObserver(fitViewport);
    observer.observe(map.getContainer());
    fitViewport();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [map, signature, compact, resetKey, selectedZoneId, destinationsEnabled]); // Coordinates, rather than array identity, control viewport changes.

  return null;
}

function terrainShape(zone, index) {
  const lat = Number(zone.lat);
  const lng = Number(zone.lng);
  const scale =
    zone.terrainGrade === "High"
      ? 1.1
      : zone.terrainGrade === "Moderate"
        ? 0.85
        : 0.65;
  const tilt =
    ([...zone.id].reduce((total, char) => total + char.charCodeAt(0), 0) % 3) *
    0.12;
  return [
    [lat + 0.48 * scale, lng - 0.68 * scale],
    [lat + 0.66 * scale, lng + 0.15 * scale],
    [lat + 0.16 * scale + tilt, lng + 0.83 * scale],
    [lat - 0.51 * scale, lng + 0.59 * scale],
    [lat - 0.62 * scale, lng - 0.25 * scale],
    [lat - 0.15 * scale, lng - 0.86 * scale],
  ];
}

function ZoneMarker({ zone, compact, selected, onSelectZone, youthMode }) {
  const markerRef = useRef(null);
  const color = COLORS[zone.severity] || COLORS.Medium;

  useEffect(() => {
    const marker = markerRef.current;
    const element = marker?.getElement();
    if (!element) return;
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");
    element.setAttribute(
      "aria-label",
      `${zone.name}, ${zone.stateCode || zone.state}, ${zone.severity} transit scarcity. Open zone details.`,
    );
    element.classList.toggle("is-selected", selected);
    const handleKey = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        onSelectZone?.(zone);
      }
    };
    const handleFocus = () => marker.openTooltip();
    const handleBlur = () => marker.closeTooltip();
    element.addEventListener("keydown", handleKey);
    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);
    return () => {
      element.removeEventListener("keydown", handleKey);
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
    };
  }, [zone, selected, onSelectZone]);

  return (
    <CircleMarker
      ref={markerRef}
      center={[Number(zone.lat), Number(zone.lng)]}
      radius={
        youthMode
          ? Math.max(8, Math.sqrt(mobilityByZone[zone.id].adolescents) * 0.55) +
            (selected ? 3 : 0)
          : selected
            ? 12
            : compact
              ? 7.5
              : 9
      }
      pathOptions={{
        color: "#ffffff",
        fillColor: color,
        fillOpacity: 0.95,
        weight: selected ? 3.5 : 2.5,
        className: `scarcity-zone-marker${selected ? " is-selected" : ""}`,
      }}
      eventHandlers={{ click: () => onSelectZone?.(zone) }}
    >
      <Tooltip
        key={selected ? "selected" : "default"}
        direction="top"
        offset={[0, -8]}
        className="scarcity-zone-tooltip"
      >
        <strong>{zone.name}</strong>
        <br />
        <span>
          {zone.stateCode || zone.state} · {zone.severity} scarcity
        </span>
        {youthMode && (
          <span className="map-tooltip-hint">
            {mobilityByZone[zone.id].adolescents.toLocaleString()} adolescent
            residents · ages 12–17
            <br />
            {mobilityByZone[zone.id].noIndependentYouth.toLocaleString()}{" "}
            without independent access · baseline estimate
          </span>
        )}
        <span className="map-tooltip-hint">Select to explore zone</span>
      </Tooltip>
    </CircleMarker>
  );
}

function DestinationMarker({ destination }) {
  const ref = useRef(null);
  const status = assessDestination(destination);
  const color =
    destination.type === "Nature"
      ? "#427c65"
      : destination.type === "Healthcare"
        ? "#b87570"
        : "#456d94";
  useEffect(() => {
    const marker = ref.current,
      el = marker?.getElement();
    if (!el) return;
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute(
      "aria-label",
      `${destination.name}, ${destination.type}, ${status.status}. Open sample destination.`,
    );
    const key = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        marker.openPopup();
      }
    };
    el.addEventListener("keydown", key);
    return () => el.removeEventListener("keydown", key);
  }, [destination, status.status]);
  return (
    <CircleMarker
      ref={ref}
      center={[destination.lat, destination.lng]}
      radius={7}
      pathOptions={{
        color: "#fff",
        weight: 2,
        fillColor: color,
        fillOpacity: 1,
      }}
    >
      <Tooltip>
        {destination.type} · {destination.name}
      </Tooltip>
      <Popup
        autoPanPaddingTopLeft={[20, 70]}
        autoPanPaddingBottomRight={[20, 90]}
      >
        <div className="map-destination-popup">
          <strong>{destination.name}</strong>
          <span>
            {destination.type} · {status.status}
          </span>
          <p>
            Transit:{" "}
            {destination.transitMinutes === null
              ? "No trip"
              : `${destination.transitMinutes} min`}
            <br />
            Private vehicle: {destination.carMinutes} min
            <br />
            Return trip:{" "}
            {destination.roundTripAvailable ? "Available" : "Unavailable"}
            <br />
            Service: {destination.serviceDays} days/week
          </p>
          <small>
            {status.reasons.join(" ")}
            <br />
            Default access criteria. Fictional destination; dashed connections
            are not routes.
          </small>
        </div>
      </Popup>
    </CircleMarker>
  );
}

export default function TransitMap({
  zones = [],
  onSelectZone,
  compact = false,
  selectedZoneId = null,
}) {
  const [basemap, setBasemap] = useState("street");
  const [youthMode, setYouthMode] = useState(!compact);
  const [destinationsEnabled, setDestinationsEnabled] = useState(true);
  const selectedZone = zones.find((z) => z.id === selectedZoneId);
  const [terrain, setTerrain] = useState(false);
  const [tileError, setTileError] = useState(false);
  useEffect(() => setTileError(false), [basemap]);
  const [resetKey, setResetKey] = useState(0);
  const validZones = useMemo(
    () =>
      zones.filter(
        (zone) =>
          Number.isFinite(Number(zone.lat)) &&
          Number.isFinite(Number(zone.lng)),
      ),
    [zones],
  );
  const satellite = basemap === "satellite";

  return (
    <>
      {!compact && (
        <div className="map-insight-toolbar">
          <span>Planning layers</span>
          <button
            aria-pressed={youthMode}
            onClick={() => setYouthMode((v) => !v)}
          >
            <UsersRound size={14} />
            Youth population
          </button>
          <button
            aria-pressed={destinationsEnabled}
            onClick={() => setDestinationsEnabled((v) => !v)}
          >
            <Route size={14} />
            Destination connections
          </button>
          <span className="map-insight-hint">
            {selectedZone
              ? `${selectedZone.name} · sample destinations`
              : "Select a zone to reveal urban services & nature destinations"}
          </span>
          {youthMode && (
            <small className="map-youth-note">
              Marker size = adolescent residents, ages 12–17. Aggregate sample
              zones · no household locations.
            </small>
          )}
        </div>
      )}
      <div
        className={`transit-map-shell${compact ? " is-compact" : ""}${satellite ? " is-satellite" : ""}`}
      >
        <div
          className="transit-map-canvas"
          role="region"
          aria-label="Interactive map of sample transit scarcity zones"
        >
          <MapContainer
            bounds={NATIONAL_BOUNDS}
            zoomControl={false}
            scrollWheelZoom={!compact}
            attributionControl
            minZoom={2}
            maxZoom={16}
            zoomSnap={0.25}
            zoomDelta={0.5}
          >
            <MapViewport
              zones={validZones}
              compact={compact}
              resetKey={resetKey}
              selectedZoneId={selectedZoneId}
              destinationsEnabled={destinationsEnabled}
            />
            {satellite ? (
              <TileLayer
                key="satellite"
                eventHandlers={{
                  tileerror: () => setTileError(true),
                  tileload: () => setTileError(false),
                }}
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
              />
            ) : (
              <TileLayer
                key="street"
                eventHandlers={{
                  tileerror: () => setTileError(true),
                  tileload: () => setTileError(false),
                }}
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
              />
            )}
            <ZoomControl position="bottomright" />
            {terrain &&
              validZones.map((zone, index) => (
                <Polygon
                  key={`terrain-${zone.id}`}
                  positions={terrainShape(zone, index)}
                  pathOptions={{
                    color:
                      TERRAIN_COLORS[zone.terrainGrade] ||
                      TERRAIN_COLORS.Moderate,
                    weight: 1.5,
                    opacity: 0.75,
                    fillOpacity: 0.25,
                    dashArray: "4 4",
                  }}
                  eventHandlers={{ click: () => onSelectZone?.(zone) }}
                >
                  <Tooltip sticky className="terrain-tooltip">
                    Simulated terrain difficulty:{" "}
                    {zone.terrainGrade || "Moderate"}
                    <br />
                    Illustrative pattern · {zone.name}
                  </Tooltip>
                </Polygon>
              ))}
            {!compact &&
              destinationsEnabled &&
              selectedZone &&
              mobilityByZone[selectedZone.id].destinations.map((d) => (
                <Polyline
                  key={`connection-${d.id}`}
                  positions={[
                    [selectedZone.lat, selectedZone.lng],
                    [d.lat, d.lng],
                  ]}
                  pathOptions={{
                    color: {
                      Reachable: "#4a8b6c",
                      Limited: "#bd954e",
                      Unavailable: "#b37672",
                    }[assessDestination(d).status],
                    weight: 2,
                    dashArray: "6 7",
                    opacity: 0.85,
                  }}
                >
                  <Tooltip>
                    Illustrative connection · {assessDestination(d).status}
                    <br />
                    Not a route or routing result
                  </Tooltip>
                </Polyline>
              ))}
            {!compact &&
              destinationsEnabled &&
              selectedZone &&
              mobilityByZone[selectedZone.id].destinations.map((d) => (
                <DestinationMarker key={d.id} destination={d} />
              ))}
            {validZones.map((zone) => (
              <ZoneMarker
                key={zone.id}
                zone={zone}
                compact={compact}
                selected={selectedZoneId === zone.id}
                youthMode={youthMode}
                onSelectZone={onSelectZone}
              />
            ))}
          </MapContainer>
        </div>

        <div className="map-top-controls">
          <div
            className="map-layer-switch"
            role="group"
            aria-label="Map base layer"
          >
            <button
              type="button"
              className={satellite ? "" : "is-active"}
              aria-pressed={!satellite}
              onClick={() => setBasemap("street")}
            >
              <Layers size={14} aria-hidden="true" />
              Street
            </button>
            <button
              type="button"
              className={satellite ? "is-active" : ""}
              aria-pressed={satellite}
              onClick={() => setBasemap("satellite")}
            >
              <Satellite size={14} aria-hidden="true" />
              Satellite
            </button>
          </div>
          <button
            type="button"
            className={`map-terrain-control${terrain ? " is-active" : ""}`}
            aria-pressed={terrain}
            onClick={() => setTerrain((value) => !value)}
            title="Toggle simulated skyview terrain analysis"
          >
            <Mountain size={15} aria-hidden="true" />
            <span>Terrain difficulty</span>
            <span className="map-toggle-track" aria-hidden="true">
              <span />
            </span>
          </button>
        </div>

        {terrain && (
          <div className="map-simulation-note">
            <Mountain size={13} aria-hidden="true" />
            Simulated skyview analysis · No satellite processing
          </div>
        )}

        {tileError && (
          <div className="map-network-note" role="status">
            Some map tiles could not load. Check your connection or switch the
            base layer.
          </div>
        )}

        <div className="map-legend" aria-label="Map legend">
          <span className="map-legend-title">SCARCITY LEVEL</span>
          <div className="map-legend-items">
            {Object.entries(COLORS).map(([label, color]) => (
              <span key={label}>
                <i style={{ background: color }} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
          {terrain && (
            <div className="map-terrain-legend">
              <span>Terrain difficulty</span>
              <div>
                {Object.entries(TERRAIN_COLORS).map(([label, color]) => (
                  <span key={label}>
                    <i style={{ background: color }} aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="map-reset-control"
          onClick={() => setResetKey((value) => value + 1)}
          aria-label="Reset map view"
          title="Reset map view"
        >
          <Expand size={16} aria-hidden="true" />
        </button>
        <span className="map-sample-label">Sample data</span>
        {!validZones.length && (
          <div className="map-empty-message">
            <strong>No zones match these filters</strong>
            <span>Try a different severity or region.</span>
          </div>
        )}
      </div>
    </>
  );
}
