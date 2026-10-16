import test from "node:test";
import assert from "node:assert/strict";
import { zones } from "../src/data.js";
import {
  mobilityByZone,
  mobilityMetadata,
  assessDestination,
  priorityScore,
  scenarioEstimate,
} from "../src/mobilityData.js";

test("synthetic mobility profiles cover every zone with consistent population measures", () => {
  assert.deepEqual(
    Object.keys(mobilityByZone),
    zones.map((zone) => zone.id),
  );
  assert.equal(mobilityMetadata.fixtureMonth, "October 2026");
  assert.match(mobilityMetadata.source, /Synthetic/);
  for (const zone of zones) {
    const m = mobilityByZone[zone.id];
    assert.equal(m.totalPopulation, zone.population);
    assert.ok(m.adolescents > 0 && m.adolescents < m.totalPopulation);
    assert.ok(m.noIndependentYouth <= m.adolescents);
    assert.ok(m.unreliableResidents <= m.limitedServiceResidents);
    assert.ok(m.limitedServiceResidents <= m.totalPopulation);
    assert.equal(
      m.ageGroups.reduce((sum, group) => sum + group.population, 0),
      m.adolescents,
    );
    assert.deepEqual(
      m.ageGroups.map((group) => group.label),
      ["12–14", "15–17"],
    );
    assert.equal(
      m.occupationMix.reduce((sum, group) => sum + group.percent, 0),
      100,
    );
    assert.ok(["Low", "Moderate"].includes(m.evidenceConfidence));
    assert.ok(m.evidenceCoverage >= 0 && m.evidenceCoverage <= 100);
    assert.ok(m.missingData.length > 0 && m.infrastructure.length > 0);
    assert.ok(Number.isInteger(m.weeklyBoardings) && m.weeklyBoardings >= 0);
    assert.ok(Number.isFinite(m.usageTrendPercent));
    assert.equal(m.drivers.length, 5);
    assert.ok(
      m.drivers.every(
        (driver) =>
          ["Likely", "Possible", "Not indicated"].includes(driver.assessment) &&
          driver.evidence,
      ),
    );
  }
});

test("each zone has fictional health, urban, and nature destinations with coherent metrics", () => {
  const ids = new Set();
  for (const zone of zones) {
    const m = mobilityByZone[zone.id];
    assert.deepEqual(
      m.destinations.map((d) => d.type),
      ["Healthcare", "Urban service", "Nature"],
    );
    assert.equal(m.healthcareMinutesTransit, m.destinations[0].transitMinutes);
    assert.equal(m.healthcareMinutesCar, m.destinations[0].carMinutes);
    assert.equal(m.healthcareName, m.destinations[0].name);
    for (const d of m.destinations) {
      assert.ok(!ids.has(d.id));
      ids.add(d.id);
      assert.match(d.name, /\(sample\)/);
      assert.ok(Number.isFinite(d.lat) && Number.isFinite(d.lng));
      assert.ok(
        Math.abs(d.lat - zone.lat) < 0.1 && Math.abs(d.lng - zone.lng) < 0.1,
      );
      assert.ok(d.transitMinutes === null || d.transitMinutes >= 0);
      assert.ok(d.walkMinutes >= 0 && d.carMinutes > 0 && d.transfers >= 0);
      assert.ok(
        Number.isInteger(d.serviceDays) &&
          d.serviceDays >= 0 &&
          d.serviceDays <= 7,
      );
      for (const field of ["roundTripAvailable", "eveningReturn", "accessible"])
        assert.equal(typeof d[field], "boolean");
      if (zone.weeklyService === 0) assert.equal(d.transitMinutes, null);
    }
  }
});

const reachable = {
  transitMinutes: 50,
  walkMinutes: 10,
  transfers: 0,
  roundTripAvailable: true,
  serviceDays: 3,
  eveningReturn: true,
  accessible: true,
};

test("reachability distinguishes unavailable connections from limited service and valid zero durations", () => {
  assert.equal(assessDestination(reachable).status, "Reachable");
  assert.ok(assessDestination(reachable).reasons.length > 0);
  assert.equal(
    assessDestination({ ...reachable, transitMinutes: 0, walkMinutes: 0 })
      .status,
    "Reachable",
  );
  const noTransit = assessDestination({ ...reachable, transitMinutes: null });
  assert.equal(noTransit.status, "Unavailable");
  assert.match(noTransit.reasons.join(" "), /No scheduled public transit/);
  assert.equal(
    assessDestination({ ...reachable, roundTripAvailable: false }).status,
    "Unavailable",
  );
  assert.equal(
    assessDestination({ ...reachable, serviceDays: 0 }).status,
    "Unavailable",
  );
  assert.equal(
    assessDestination({ ...reachable, serviceDays: 2 }).status,
    "Limited",
  );
  assert.equal(
    assessDestination({ ...reachable, transitMinutes: 60, walkMinutes: 15 })
      .status,
    "Reachable",
  );
  assert.equal(
    assessDestination({ ...reachable, transitMinutes: 61 }).status,
    "Limited",
  );
  assert.equal(
    assessDestination({ ...reachable, walkMinutes: 16 }).status,
    "Limited",
  );
});

test("destination screening explains evening and wheelchair constraints and responds to thresholds", () => {
  const d = {
    ...reachable,
    transitMinutes: 70,
    walkMinutes: 20,
    eveningReturn: false,
    accessible: false,
  };
  const result = assessDestination(d, {
    requiresEveningReturn: true,
    requiresWheelchair: true,
  });
  assert.equal(result.status, "Limited");
  assert.equal(result.reasons.length, 4);
  assert.match(result.reasons.join(" "), /evening return/);
  assert.match(result.reasons.join(" "), /Accessible vehicle/);
  assert.equal(
    assessDestination(d, { maxMinutes: 75, maxWalkMinutes: 25 }).status,
    "Reachable",
  );
  assert.equal(
    assessDestination(d, {
      maxMinutes: 75,
      maxWalkMinutes: 25,
      requiresEveningReturn: true,
    }).status,
    "Limited",
  );
});

test("fixtures provide unavailable, reachable, and after-school-limited journeys", () => {
  const all = Object.values(mobilityByZone).flatMap((m) => m.destinations);
  assert.deepEqual(
    new Set(all.map((d) => assessDestination(d).status)),
    new Set(["Unavailable", "Limited", "Reachable"]),
  );
  assert.ok(
    all.some(
      (d) =>
        assessDestination(d).status === "Reachable" &&
        assessDestination(d, { requiresEveningReturn: true }).status ===
          "Limited",
    ),
  );
  for (const zone of zones.filter((z) => z.severity === "Low")) {
    assert.ok(
      mobilityByZone[zone.id].destinations.some(
        (d) => assessDestination(d).status === "Reachable",
      ),
    );
  }
});

test("priority scoring exposes 45/25/30 weights and uses healthcare null as full burden", () => {
  const m = {
    adolescents: 100,
    noIndependentYouth: 50,
    totalPopulation: 1000,
    unreliableResidents: 400,
    healthcareMinutesTransit: 60,
  };
  const score = priorityScore(m);
  assert.equal(score.score, 48);
  assert.deepEqual(
    score.components.map((c) => c.weight),
    [45, 25, 30],
  );
  assert.deepEqual(
    score.components.map((c) => c.value),
    [50, 40, 50],
  );
  assert.equal(
    priorityScore({ ...m, healthcareMinutesTransit: null }).score,
    63,
  );
  assert.equal(priorityScore({ ...m, healthcareMinutesTransit: 0 }).score, 33);
  assert.equal(
    priorityScore({
      ...m,
      noIndependentYouth: 100,
      unreliableResidents: 1000,
      healthcareMinutesTransit: 240,
    }).score,
    100,
  );
  assert.equal(
    priorityScore({
      adolescents: 0,
      noIndependentYouth: 0,
      totalPopulation: 0,
      unreliableResidents: 0,
      healthcareMinutesTransit: 0,
    }).score,
    0,
  );
  assert.ok(
    priorityScore({ ...m, noIndependentYouth: 75 }).score > score.score,
  );
  for (const profile of Object.values(mobilityByZone))
    assert.ok(
      priorityScore(profile).score >= 0 && priorityScore(profile).score <= 100,
    );
});

test("scenario defaults reproduce fixture costs and preserve meaningful benefit limits", () => {
  for (const m of Object.values(mobilityByZone)) {
    const estimate = scenarioEstimate(m);
    assert.equal(estimate.capitalCost, m.scenario.capitalCost);
    assert.equal(estimate.annualOperatingCost, m.scenario.annualOperatingCost);
    assert.equal(estimate.residentsBenefiting, m.scenario.residentsBenefiting);
    assert.equal(estimate.youthBenefiting, m.scenario.youthBenefiting);
    assert.equal(
      estimate.firstYearCost,
      estimate.capitalCost + estimate.annualOperatingCost,
    );
    assert.equal(
      estimate.annualCostPerResident,
      Math.round(estimate.annualOperatingCost / estimate.residentsBenefiting),
    );
    const larger = scenarioEstimate(m, m.scenario.addedWeeklyTrips * 4);
    assert.equal(
      larger.annualOperatingCost,
      m.scenario.annualOperatingCost * 4,
    );
    assert.equal(
      larger.residentsBenefiting,
      Math.min(m.limitedServiceResidents, m.scenario.residentsBenefiting * 2),
    );
    assert.equal(larger.capitalCost, estimate.capitalCost);
    const capped = scenarioEstimate(m, m.scenario.addedWeeklyTrips * 1000);
    assert.equal(capped.residentsBenefiting, m.limitedServiceResidents);
    assert.equal(capped.youthBenefiting, m.adolescents);
    assert.ok(capped.youthBenefiting <= capped.residentsBenefiting);
  }
});

test("zero, negative, or invalid added trips produce zero costs and benefits", () => {
  const m = mobilityByZone["laurel-fork"];
  for (const input of [0, -5, NaN, Infinity]) {
    const estimate = scenarioEstimate(m, input);
    assert.ok(Object.values(estimate).every((value) => value === 0));
  }
  assert.equal(scenarioEstimate(m, 10.4).weeklyTrips, 10);
  assert.ok(
    scenarioEstimate(m, 10).residentsBenefiting <
      scenarioEstimate(m, 20).residentsBenefiting,
  );
});
