import { useEffect, useRef, useState } from "react";
import { Circle, CircleMarker, Popup, Tooltip } from "react-leaflet";
import {
  ArrowUpRight,
  Crosshair,
  LoaderCircle,
  LocateFixed,
  X,
} from "lucide-react";
import {
  closestSampleZone,
  isValidLocation,
  locationErrorMessage,
} from "../locationLogic.js";

const EMPTY = { position: null, status: "idle", message: "" };

export function useDeviceLocation() {
  const [state, setState] = useState(EMPTY);
  const requestId = useRef(0);
  useEffect(
    () => () => {
      requestId.current += 1;
    },
    [],
  );

  const clear = () => {
    requestId.current += 1;
    setState(EMPTY);
  };
  const locate = () => {
    const id = ++requestId.current;
    const fail = (message) => {
      if (id === requestId.current)
        setState({ position: null, status: "error", message });
    };
    if (!window.isSecureContext) {
      fail(
        "Location needs a secure connection. Open the HTTPS site or use localhost.",
      );
      return;
    }
    if (!navigator.geolocation) {
      fail(
        "This browser does not support device location. You can still explore the sample zones.",
      );
      return;
    }
    setState({
      position: null,
      status: "requesting",
      message: "Allow location access in your browser to center the map.",
    });
    try {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          if (id !== requestId.current) return;
          const position = {
            lat: coords.latitude,
            lng: coords.longitude,
            accuracy: coords.accuracy,
          };
          if (!isValidLocation(position)) {
            fail(
              "Your browser returned an invalid position. Please try again.",
            );
            return;
          }
          setState({
            position,
            status: "ready",
            message: "Your device location is shown in blue.",
          });
        },
        (error) => fail(locationErrorMessage(error)),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
      );
    } catch (error) {
      fail(locationErrorMessage(error));
    }
  };
  return { ...state, locate, clear };
}

function accuracyLabel(meters) {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.ceil(meters)} m`;
}

export function DeviceLocationControls({
  location,
  zones,
  onRecenter,
  onSelectZone,
}) {
  const nearest = location.position
    ? closestSampleZone(location.position, zones)
    : null;
  const requesting = location.status === "requesting";
  return (
    <section className="device-location-controls" aria-label="Your location">
      <div className="device-location-actions">
        <button
          className="device-locate-button"
          onClick={location.locate}
          disabled={requesting}
        >
          {requesting ? (
            <LoaderCircle size={16} className="location-spinner" />
          ) : (
            <LocateFixed size={16} />
          )}
          {requesting
            ? "Locating…"
            : location.position
              ? "Update location"
              : "Locate me"}
        </button>
        {location.position && (
          <button onClick={onRecenter}>
            <Crosshair size={14} />
            Recenter
          </button>
        )}
        {location.status !== "idle" && (
          <button
            onClick={location.clear}
            aria-label={
              requesting ? "Cancel location request" : "Clear location"
            }
          >
            <X size={14} />
            {requesting ? "Cancel" : "Clear"}
          </button>
        )}
      </div>
      <div className="device-location-copy">
        <p
          role="status"
          aria-live="polite"
          className={location.status === "error" ? "location-error" : ""}
        >
          {location.message ||
            "See your current position alongside the sample planning zones."}
          {location.position && (
            <>
              {" "}
              Approximate accuracy: ±{accuracyLabel(location.position.accuracy)}
              .
            </>
          )}
        </p>
        <small>
          Requested only when you click. Not saved by TSTS. Map tiles load from
          the selected map provider.
        </small>
        {nearest && (
          <div className="nearest-sample-zone">
            <span>
              Closest visible sample zone: <strong>{nearest.zone.name}</strong>{" "}
              ·{" "}
              {nearest.distanceMiles < 0.1
                ? "<0.1"
                : nearest.distanceMiles.toLocaleString("en-US", {
                    maximumFractionDigits: 1,
                  })}{" "}
              mi straight-line
            </span>
            <button onClick={() => onSelectZone(nearest.zone)}>
              View zone <ArrowUpRight size={13} />
            </button>
            <small>
              Fictional zone center; this distance does not measure nearby
              transit availability.
            </small>
          </div>
        )}
        {location.position && !nearest && (
          <p>
            No sample zones match your filters. Your location is still shown.
          </p>
        )}
      </div>
    </section>
  );
}

export function DeviceLocationMarker({ position }) {
  const ref = useRef(null);
  useEffect(() => {
    const marker = ref.current;
    const element = marker?.getElement();
    if (!element) return;
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");
    element.setAttribute(
      "aria-label",
      "Your current location. Open location accuracy details.",
    );
    const onKey = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        marker.openPopup();
      }
    };
    element.addEventListener("keydown", onKey);
    return () => element.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <Circle
        center={[position.lat, position.lng]}
        radius={position.accuracy}
        interactive={false}
        pathOptions={{
          color: "#2563eb",
          weight: 1,
          fillColor: "#3b82f6",
          fillOpacity: 0.12,
        }}
      />
      <CircleMarker
        ref={ref}
        center={[position.lat, position.lng]}
        radius={9}
        pathOptions={{
          color: "white",
          weight: 3,
          fillColor: "#2563eb",
          fillOpacity: 1,
          className: "device-location-marker",
        }}
      >
        <Tooltip permanent direction="top" offset={[0, -10]}>
          Your location
        </Tooltip>
        <Popup
          autoPanPaddingTopLeft={[20, 70]}
          autoPanPaddingBottomRight={[20, 90]}
        >
          <div className="map-destination-popup">
            <strong>Your device location</strong>
            <p>
              Approximate accuracy: ±{accuracyLabel(position.accuracy)}.<br />
              The blue circle shows the reported accuracy radius.
            </p>
            <small>
              This is your device position, not sample data. TSTS keeps it only
              while this map is open. Use Clear to remove it.
            </small>
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
