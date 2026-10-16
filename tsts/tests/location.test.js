import test from "node:test";
import assert from "node:assert/strict";
import {
  isValidLocation,
  closestSampleZone,
  locationErrorMessage,
} from "../src/locationLogic.js";

test("location validation accepts coordinate boundaries and zero accuracy", () => {
  for (const location of [
    { lat: 0, lng: 0 },
    { lat: 90, lng: 180, accuracy: 0 },
    { lat: -90, lng: -180, accuracy: 150 },
  ]) {
    assert.equal(isValidLocation(location), true);
  }
});

test("location validation rejects missing, nonnumeric, nonfinite, and out-of-range values", () => {
  for (const location of [
    null,
    undefined,
    {},
    { lat: "37", lng: -122 },
    { lat: 37, lng: "-122" },
    { lat: NaN, lng: 0 },
    { lat: 0, lng: Infinity },
    { lat: 90.001, lng: 0 },
    { lat: -90.001, lng: 0 },
    { lat: 0, lng: 180.001 },
    { lat: 0, lng: -180.001 },
    { lat: 0, lng: 0, accuracy: -1 },
    { lat: 0, lng: 0, accuracy: null },
    { lat: 0, lng: 0, accuracy: NaN },
    { lat: 0, lng: 0, accuracy: Infinity },
  ]) {
    assert.equal(isValidLocation(location), false);
  }
});

test("nearest-zone selection only considers supplied valid zones without changing their order", () => {
  const near = { id: "near", lat: 0, lng: 1 };
  const far = { id: "far", lat: 0, lng: 5 };
  const supplied = [far, null, { lat: 0, lng: 999 }, near];
  const snapshot = [...supplied];
  const result = closestSampleZone({ lat: 0, lng: 0 }, supplied);
  assert.equal(result.zone, near);
  assert.ok(result.distanceMiles > 69 && result.distanceMiles < 70);
  assert.deepEqual(supplied, snapshot);
  assert.equal(closestSampleZone({ lat: 0, lng: 0 }, [far]).zone, far);
});

test("great-circle distances handle identical, quarter-earth, antipodal, and antimeridian coordinates", () => {
  const distance = (from, to) => closestSampleZone(from, [to]).distanceMiles;
  assert.equal(distance({ lat: 37, lng: -122 }, { lat: 37, lng: -122 }), 0);
  const quarterEarth = distance({ lat: 0, lng: 0 }, { lat: 0, lng: 90 });
  assert.ok(quarterEarth > 6215 && quarterEarth < 6222);
  const antipodal = distance({ lat: 37, lng: -122 }, { lat: -37, lng: 58 });
  assert.ok(Number.isFinite(antipodal));
  assert.ok(antipodal > 12430 && antipodal < 12444);
  const acrossDateLine = distance(
    { lat: 0, lng: 179.9 },
    { lat: 0, lng: -179.9 },
  );
  assert.ok(acrossDateLine > 13 && acrossDateLine < 15);
  assert.equal(distance({ lat: 0, lng: 180 }, { lat: 0, lng: -180 }), 0);
});

test("nearest-zone selection returns null when no valid comparison is possible", () => {
  assert.equal(closestSampleZone(null, [{ lat: 0, lng: 0 }]), null);
  assert.equal(
    closestSampleZone({ lat: 100, lng: 0 }, [{ lat: 0, lng: 0 }]),
    null,
  );
  assert.equal(closestSampleZone({ lat: 0, lng: 0 }, []), null);
  assert.equal(closestSampleZone({ lat: 0, lng: 0 }, [null, {}]), null);
  assert.equal(closestSampleZone({ lat: 0, lng: 0 }, undefined), null);
});

test("browser location errors provide actionable messages without exposing raw errors", () => {
  assert.match(
    locationErrorMessage({ code: 1 }),
    /permission.*denied.*browser settings/i,
  );
  assert.match(
    locationErrorMessage({ code: 2 }),
    /unavailable.*location services/i,
  );
  assert.match(locationErrorMessage({ code: 3 }), /timed out.*try again/i);
  const generic = locationErrorMessage();
  assert.match(generic, /could not be determined.*try again/i);
  assert.equal(
    locationErrorMessage({ code: 99, message: "Sensitive diagnostic" }),
    generic,
  );
});
