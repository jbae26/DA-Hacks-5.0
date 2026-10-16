import test from "node:test";
import assert from "node:assert/strict";
import { zones, initialReports, regions } from "../src/data.js";
import { REPORT_CATEGORIES } from "../src/reportLogic.js";

const zoneStatuses = new Set([
  "Needs assessment",
  "Under review",
  "Planning underway",
]);
const reportStatuses = new Set(["Pending", "Approved", "Filtered", "Rejected"]);
const programIds = new Set(["5311", "intercity", "tribal"]);
const zoneById = new Map(zones.map((zone) => [zone.id, zone]));

test("seed contains twelve uniquely identifiable zones covering all four planning regions", () => {
  assert.equal(zones.length, 12);
  assert.equal(zoneById.size, zones.length);
  assert.deepEqual(new Set(zones.map((zone) => zone.region)), new Set(regions));
  assert.equal(regions.length, 4);
  assert.deepEqual(
    Object.fromEntries(
      ["High", "Medium", "Low"].map((severity) => [
        severity,
        zones.filter((zone) => zone.severity === severity).length,
      ]),
    ),
    { High: 6, Medium: 4, Low: 2 },
  );
});

test("map positions and sample zone populations are finite and plausible for the contiguous U.S.", () => {
  for (const zone of zones) {
    assert.match(zone.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(
      Number.isFinite(zone.lat) && zone.lat >= 24 && zone.lat <= 50,
      `${zone.id}: invalid latitude`,
    );
    assert.ok(
      Number.isFinite(zone.lng) && zone.lng >= -125 && zone.lng <= -66,
      `${zone.id}: invalid longitude`,
    );
    // These are fictional zone populations, not measured county populations.
    assert.ok(
      Number.isInteger(zone.population) &&
        zone.population > 0 &&
        zone.population < 50_000,
      `${zone.id}: invalid zone population`,
    );
    assert.match(zone.stateCode, /^[A-Z]{2}$/);
    for (const field of [
      "name",
      "state",
      "county",
      "landscape",
      "elevation",
      "slope",
      "nearestStop",
    ]) {
      assert.ok(
        typeof zone[field] === "string" && zone[field].trim().length > 0,
        `${zone.id}: missing ${field}`,
      );
    }
  }
});

test("service, terrain, and planning values support dashboard filters and zone detail views", () => {
  for (const zone of zones) {
    assert.ok(
      Number.isFinite(zone.distance) && zone.distance >= 0,
      `${zone.id}: invalid distance`,
    );
    assert.ok(
      Number.isInteger(zone.weeklyService) && zone.weeklyService >= 0,
      `${zone.id}: invalid service count`,
    );
    assert.ok(
      ["High", "Moderate", "Low"].includes(zone.terrainGrade),
      `${zone.id}: invalid terrain grade`,
    );
    assert.ok(
      zoneStatuses.has(zone.status),
      `${zone.id}: invalid planning status`,
    );
    assert.ok(
      Array.isArray(zone.causes) && zone.causes.length > 0,
      `${zone.id}: missing root causes`,
    );
    assert.ok(
      Array.isArray(zone.measures) && zone.measures.length > 0,
      `${zone.id}: missing measures`,
    );
    assert.ok(
      [...zone.causes, ...zone.measures].every(
        (text) => typeof text === "string" && text.trim(),
      ),
    );
  }
  assert.ok(
    zones.some((zone) => zone.distance > 10),
    "No out-of-reach transit examples",
  );
  assert.ok(
    zones.some((zone) => zone.weeklyService === 0),
    "No zero-service examples",
  );
});

test("program mappings use supported IDs and reserve tribal scenarios for tribal planning areas", () => {
  for (const zone of zones) {
    assert.ok(
      Array.isArray(zone.programs) && zone.programs.length > 0,
      `${zone.id}: missing programs`,
    );
    assert.equal(
      new Set(zone.programs).size,
      zone.programs.length,
      `${zone.id}: duplicate programs`,
    );
    assert.ok(
      zone.programs.every((program) => programIds.has(program)),
      `${zone.id}: unsupported program`,
    );
    assert.equal(
      zone.programs.includes("tribal"),
      zone.region === "Tribal Lands",
      `${zone.id}: tribal mapping mismatch`,
    );
  }
  assert.deepEqual(new Set(zones.flatMap((zone) => zone.programs)), programIds);
});

test("citizen reports have unique IDs, valid categories and statuses, and consistent zone references", () => {
  assert.ok(initialReports.length >= 8);
  assert.equal(
    new Set(initialReports.map((report) => report.id)).size,
    initialReports.length,
  );
  for (const report of initialReports) {
    const zone = zoneById.get(report.zoneId);
    assert.ok(zone, `${report.id}: linked zone does not exist`);
    assert.equal(
      report.county,
      zone.county,
      `${report.id}: county differs from linked zone`,
    );
    assert.equal(
      report.state,
      zone.state,
      `${report.id}: state differs from linked zone`,
    );
    assert.ok(
      REPORT_CATEGORIES.includes(report.category),
      `${report.id}: unsupported issue category`,
    );
    assert.ok(
      reportStatuses.has(report.status),
      `${report.id}: unsupported review status`,
    );
    assert.ok(
      typeof report.description === "string" && report.description.length > 0,
    );
    assert.equal(typeof report.contact, "string");
    assert.ok(Array.isArray(report.filterReasons));
    assert.ok(
      Number.isFinite(Date.parse(report.createdAt)),
      `${report.id}: invalid date`,
    );
    assert.match(report.createdAt, /^2026-10-/);
    if (report.status === "Filtered")
      assert.ok(
        report.filterReasons.length > 0,
        `${report.id}: filtered report needs an explanation`,
      );
  }
  assert.deepEqual(
    new Set(initialReports.map((report) => report.status)),
    reportStatuses,
  );
});
