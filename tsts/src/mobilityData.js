import { zones } from "./data.js";

// All values below are synthetic planning fixtures, not measured community data.
// Destinations are fictional, offset from broad planning-zone centers for display.
// No records identify actual young people, households, schools, or providers.
export const mobilityMetadata = {
  fixtureMonth: "October 2026",
  source:
    "Synthetic demonstration fixtures; no survey, Census, GTFS, or satellite feed is connected.",
  locationNote:
    "Aggregate planning zones and fictional destinations only. Map offsets are illustrative, not routed trips or locations of individual adolescents.",
  estimateNote:
    "Illustrative service scenarios, not predicted ridership, engineering costs, or funding commitments.",
  workforceNote:
    "Occupation shares describe a fictional employed adult workforce; adolescent counts describe ages 12–17.",
};

const occupations = {
  mountain: [
    { label: "Services & care", percent: 38 },
    { label: "Trades & production", percent: 29 },
    { label: "Agriculture & forestry", percent: 16 },
    { label: "Other employment", percent: 17 },
  ],
  plains: [
    { label: "Agriculture & ranching", percent: 39 },
    { label: "Services & care", percent: 31 },
    { label: "Trades & production", percent: 18 },
    { label: "Other employment", percent: 12 },
  ],
  community: [
    { label: "Services & care", percent: 42 },
    { label: "Public & community services", percent: 25 },
    { label: "Trades & agriculture", percent: 19 },
    { label: "Other employment", percent: 14 },
  ],
};

// Trip entries: [transit minutes, walk minutes, transfers, return available,
// operating days/week, evening return, accessible vehicle/boarding, car minutes].
// null means no scheduled transit connection. Zero is a valid numeric measure.
const profiles = [
  {
    id: "laurel-fork",
    adolescents: 590,
    noIndependentYouth: 510,
    unreliableResidents: 2980,
    limitedServiceResidents: 5440,
    healthcareName: "Laurel Junction Family Clinic (sample)",
    weeklyBoardings: 0,
    usageTrendPercent: 0,
    evidenceConfidence: "Low",
    evidenceCoverage: 34,
    missingData: [
      "Provider timetable coverage",
      "Household travel needs survey",
      "Accessible stop audit",
    ],
    occupation: "mountain",
    alternatives: "Possible",
    demand: "Not indicated",
    infrastructure: [
      "Narrow bridges restrict vehicle size.",
      "Steep shoulders provide few level boarding locations.",
      "Creek flooding can sever the only valley access road.",
    ],
    names: [
      "Laurel Junction Family Clinic",
      "Laurel Junction library & learning center",
      "Fork Valley nature trail",
    ],
    trips: [
      [null, 35, 0, false, 0, false, false, 48],
      [null, 32, 0, false, 0, false, false, 42],
      [null, 24, 0, false, 0, false, false, 25],
    ],
    scenario: {
      serviceName: "Valley youth & clinic connector",
      capitalCost: 285000,
      annualOperatingCost: 238000,
      residentsBenefiting: 1260,
      youthBenefiting: 310,
      addedWeeklyTrips: 20,
    },
  },
  {
    id: "elk-ridge",
    adolescents: 438,
    noIndependentYouth: 350,
    unreliableResidents: 2110,
    limitedServiceResidents: 3990,
    healthcareName: "Ridge Hollow Community Clinic (sample)",
    weeklyBoardings: 24,
    usageTrendPercent: -9,
    evidenceConfidence: "Low",
    evidenceCoverage: 42,
    missingData: [
      "After-school trip requests",
      "Flood disruption records",
      "Cross-provider transfers",
    ],
    occupation: "mountain",
    alternatives: "Possible",
    demand: "Not indicated",
    infrastructure: [
      "Sharp ridge-road curves limit large buses.",
      "Creek crossings lack dependable flood detours.",
      "Several pickup locations lack accessible surfaces.",
    ],
    names: [
      "Ridge Hollow Community Clinic",
      "Elk Junction skills & library center",
      "Ridge Hollow forest trail",
    ],
    trips: [
      [92, 21, 1, true, 1, false, true, 38],
      [74, 19, 1, false, 1, false, true, 31],
      [null, 22, 0, false, 0, false, false, 23],
    ],
    scenario: {
      serviceName: "Accessible ridge flex-route",
      capitalCost: 245000,
      annualOperatingCost: 198000,
      residentsBenefiting: 1020,
      youthBenefiting: 245,
      addedWeeklyTrips: 16,
    },
  },
  {
    id: "greenbrier-headwaters",
    adolescents: 244,
    noIndependentYouth: 144,
    unreliableResidents: 940,
    limitedServiceResidents: 1870,
    healthcareName: "Headwaters General Clinic (sample)",
    weeklyBoardings: 68,
    usageTrendPercent: -4,
    evidenceConfidence: "Moderate",
    evidenceCoverage: 65,
    missingData: [
      "Winter cancellation history",
      "Youth recreation trip survey",
    ],
    occupation: "mountain",
    alternatives: "Likely",
    demand: "Possible",
    infrastructure: [
      "Mountain passes create winter reliability gaps.",
      "Limited road shoulders complicate trailhead pickups.",
      "Regional transfers use separate dispatch systems.",
    ],
    names: [
      "Headwaters General Clinic",
      "Headwaters town library & job center",
      "Upper River nature reserve",
    ],
    trips: [
      [66, 12, 1, true, 3, false, true, 29],
      [48, 10, 1, true, 3, false, true, 22],
      [52, 18, 0, true, 2, false, false, 21],
    ],
    scenario: {
      serviceName: "Timed valley & trail connector",
      capitalCost: 195000,
      annualOperatingCost: 156000,
      residentsBenefiting: 720,
      youthBenefiting: 120,
      addedWeeklyTrips: 12,
    },
  },
  {
    id: "clearwater-highlands",
    adolescents: 272,
    noIndependentYouth: 242,
    unreliableResidents: 1720,
    limitedServiceResidents: 2910,
    healthcareName: "Highland Junction Primary Care (sample)",
    weeklyBoardings: 0,
    usageTrendPercent: 0,
    evidenceConfidence: "Low",
    evidenceCoverage: 28,
    missingData: [
      "Regional provider coverage",
      "Seasonal road availability",
      "Youth and household trip demand",
    ],
    occupation: "mountain",
    alternatives: "Possible",
    demand: "Possible",
    infrastructure: [
      "Single canyon access road creates long detours.",
      "Winter pass closures require seasonal operating plans.",
      "Long deadhead distances increase vehicle and driver hours.",
    ],
    names: [
      "Highland Junction Primary Care",
      "Highland regional learning & services hub",
      "Canyon Pines recreation area",
    ],
    trips: [
      [null, 48, 0, false, 0, false, false, 76],
      [null, 40, 0, false, 0, false, false, 68],
      [null, 28, 0, false, 0, false, false, 34],
    ],
    scenario: {
      serviceName: "Mountain regional connector",
      capitalCost: 340000,
      annualOperatingCost: 292000,
      residentsBenefiting: 810,
      youthBenefiting: 180,
      addedWeeklyTrips: 12,
    },
  },
  {
    id: "huerfano-valley",
    adolescents: 226,
    noIndependentYouth: 140,
    unreliableResidents: 890,
    limitedServiceResidents: 1820,
    healthcareName: "Upper Valley Health Center (sample)",
    weeklyBoardings: 52,
    usageTrendPercent: 3,
    evidenceConfidence: "Moderate",
    evidenceCoverage: 59,
    missingData: [
      "First-mile pickup access",
      "Cross-county fare compatibility",
      "After-school return demand",
    ],
    occupation: "mountain",
    alternatives: "Likely",
    demand: "Possible",
    infrastructure: [
      "Unpaved side roads are vulnerable to snow and mud.",
      "County boundaries interrupt coordinated dispatch.",
      "Few level roadside stops serve remote settlements.",
    ],
    names: [
      "Upper Valley Health Center",
      "Valley Junction training & library hub",
      "Foothill Meadows open space",
    ],
    trips: [
      [71, 17, 1, true, 2, false, true, 34],
      [55, 14, 1, true, 2, false, true, 28],
      [43, 11, 0, false, 2, false, true, 18],
    ],
    scenario: {
      serviceName: "Coordinated foothill flex service",
      capitalCost: 210000,
      annualOperatingCost: 168000,
      residentsBenefiting: 650,
      youthBenefiting: 110,
      addedWeeklyTrips: 12,
    },
  },
  {
    id: "high-desert-basin",
    adolescents: 290,
    noIndependentYouth: 185,
    unreliableResidents: 1260,
    limitedServiceResidents: 2490,
    healthcareName: "Basin Regional Primary Care (sample)",
    weeklyBoardings: 39,
    usageTrendPercent: -6,
    evidenceConfidence: "Low",
    evidenceCoverage: 47,
    missingData: [
      "Intercounty transfer data",
      "Remote household survey",
      "Wind and snow disruption logs",
    ],
    occupation: "plains",
    alternatives: "Likely",
    demand: "Possible",
    infrastructure: [
      "Exposed highways are vulnerable to drifting snow.",
      "Long gaps between settlements increase route distances.",
      "Medical transfers cross service-contract boundaries.",
    ],
    names: [
      "Basin Regional Primary Care",
      "Basin town library & vocational center",
      "Juniper Basin nature preserve",
    ],
    trips: [
      [104, 16, 1, true, 2, false, true, 53],
      [82, 13, 1, true, 2, false, true, 44],
      [null, 20, 0, false, 0, false, false, 31],
    ],
    scenario: {
      serviceName: "Basin shared regional shuttle",
      capitalCost: 265000,
      annualOperatingCost: 224000,
      residentsBenefiting: 860,
      youthBenefiting: 145,
      addedWeeklyTrips: 14,
    },
  },
  {
    id: "prairie-divide",
    adolescents: 161,
    noIndependentYouth: 144,
    unreliableResidents: 1020,
    limitedServiceResidents: 1690,
    healthcareName: "Prairie Crossing Health Center (sample)",
    weeklyBoardings: 0,
    usageTrendPercent: 0,
    evidenceConfidence: "Low",
    evidenceCoverage: 31,
    missingData: [
      "Farmstead travel needs",
      "Available driver workforce",
      "Intercity transfer options",
    ],
    occupation: "plains",
    alternatives: "Likely",
    demand: "Possible",
    infrastructure: [
      "Long gravel approaches separate homes from highways.",
      "Blizzards can close exposed county roads.",
      "Driver and maintenance facilities are distant.",
    ],
    names: [
      "Prairie Crossing Health Center",
      "Prairie Crossing library & learning center",
      "Prairie Grasslands recreation area",
    ],
    trips: [
      [null, 45, 0, false, 0, false, false, 64],
      [null, 37, 0, false, 0, false, false, 51],
      [null, 29, 0, false, 0, false, false, 36],
    ],
    scenario: {
      serviceName: "Prairie reservation-based van",
      capitalCost: 175000,
      annualOperatingCost: 157000,
      residentsBenefiting: 470,
      youthBenefiting: 105,
      addedWeeklyTrips: 10,
    },
  },
  {
    id: "smokey-hill-west",
    adolescents: 93,
    noIndependentYouth: 23,
    unreliableResidents: 168,
    limitedServiceResidents: 390,
    healthcareName: "West Prairie Community Clinic (sample)",
    weeklyBoardings: 134,
    usageTrendPercent: 7,
    evidenceConfidence: "Moderate",
    evidenceCoverage: 78,
    missingData: ["Sunday demand", "Accessible vehicle peak availability"],
    occupation: "plains",
    alternatives: "Likely",
    demand: "Possible",
    infrastructure: [
      "Remote households remain beyond the town pickup boundary.",
      "Only one accessible van is available at peak times.",
      "Town stops need additional level boarding pads.",
    ],
    names: [
      "West Prairie Community Clinic",
      "West Prairie library & community center",
      "Smoky Creek nature park",
    ],
    trips: [
      [28, 7, 0, true, 5, true, true, 14],
      [22, 6, 0, true, 5, true, true, 10],
      [37, 11, 0, true, 3, false, true, 17],
    ],
    scenario: {
      serviceName: "Evening & accessible van extension",
      capitalCost: 95000,
      annualOperatingCost: 78000,
      residentsBenefiting: 240,
      youthBenefiting: 50,
      addedWeeklyTrips: 8,
    },
  },
  {
    id: "sandhills-north",
    adolescents: 192,
    noIndependentYouth: 62,
    unreliableResidents: 435,
    limitedServiceResidents: 920,
    healthcareName: "Sandhills Community Health Center (sample)",
    weeklyBoardings: 109,
    usageTrendPercent: 2,
    evidenceConfidence: "Moderate",
    evidenceCoverage: 72,
    missingData: ["Remote ranch pickup requests", "Late-day youth activities"],
    occupation: "plains",
    alternatives: "Likely",
    demand: "Possible",
    infrastructure: [
      "Sparse road connections produce indirect ranch pickups.",
      "Small driver roster limits evening coverage.",
      "Regional bus transfers require advance coordination.",
    ],
    names: [
      "Sandhills Community Health Center",
      "Sandhills town library & skills center",
      "Dune Prairie nature reserve",
    ],
    trips: [
      [42, 9, 0, true, 5, false, true, 23],
      [32, 8, 0, true, 5, true, true, 16],
      [57, 13, 0, true, 3, false, false, 28],
    ],
    scenario: {
      serviceName: "Ranch flex-route & evening trips",
      capitalCost: 145000,
      annualOperatingCost: 119000,
      residentsBenefiting: 420,
      youthBenefiting: 85,
      addedWeeklyTrips: 10,
    },
  },
  {
    id: "red-mesa",
    adolescents: 498,
    noIndependentYouth: 420,
    unreliableResidents: 2260,
    limitedServiceResidents: 3630,
    healthcareName: "Mesa Valley Community Clinic (sample)",
    weeklyBoardings: 31,
    usageTrendPercent: -5,
    evidenceConfidence: "Low",
    evidenceCoverage: 35,
    missingData: [
      "Tribe-led community travel assessment",
      "Unpaved road condition inventory",
      "Coordinated provider schedules",
    ],
    occupation: "community",
    alternatives: "Possible",
    demand: "Not indicated",
    infrastructure: [
      "Mesa escarpments force long canyon detours.",
      "Unpaved approaches become impassable after storms.",
      "Route changes require coordination with tribal authorities.",
    ],
    names: [
      "Mesa Valley Community Clinic",
      "Mesa Junction community learning center",
      "Mesa Rim nature access site",
    ],
    trips: [
      [118, 26, 1, true, 1, false, false, 57],
      [97, 23, 1, false, 1, false, false, 44],
      [null, 30, 0, false, 0, false, false, 32],
    ],
    scenario: {
      serviceName: "Community-led mesa connector",
      capitalCost: 310000,
      annualOperatingCost: 256000,
      residentsBenefiting: 1120,
      youthBenefiting: 280,
      addedWeeklyTrips: 16,
    },
  },
  {
    id: "sage-creek",
    adolescents: 664,
    noIndependentYouth: 548,
    unreliableResidents: 2840,
    limitedServiceResidents: 4510,
    healthcareName: "Sage Crossing Health Center (sample)",
    weeklyBoardings: 43,
    usageTrendPercent: 1,
    evidenceConfidence: "Low",
    evidenceCoverage: 39,
    missingData: [
      "Tribe-led adolescent access survey",
      "Accessible vehicle coverage",
      "Household travel needs",
    ],
    occupation: "community",
    alternatives: "Possible",
    demand: "Not indicated",
    infrastructure: [
      "Widely dispersed housing creates long first-mile trips.",
      "Drainage crossings need all-weather access review.",
      "Limited accessible vehicles constrain dispatch options.",
    ],
    names: [
      "Sage Crossing Health Center",
      "Sage Crossing library & youth skills hub",
      "Sage Creek grasslands recreation area",
    ],
    trips: [
      [96, 24, 1, true, 1, false, false, 46],
      [78, 21, 1, true, 1, false, false, 38],
      [null, 27, 0, false, 0, false, false, 29],
    ],
    scenario: {
      serviceName: "Community youth & health flex service",
      capitalCost: 295000,
      annualOperatingCost: 249000,
      residentsBenefiting: 1480,
      youthBenefiting: 360,
      addedWeeklyTrips: 20,
    },
  },
  {
    id: "bighorn-foothills",
    adolescents: 402,
    noIndependentYouth: 236,
    unreliableResidents: 1180,
    limitedServiceResidents: 2250,
    healthcareName: "Foothills Community Primary Care (sample)",
    weeklyBoardings: 82,
    usageTrendPercent: 4,
    evidenceConfidence: "Moderate",
    evidenceCoverage: 58,
    missingData: [
      "Tribe-led destination priorities",
      "Cross-jurisdiction stop inventory",
      "Evening transfer reliability",
    ],
    occupation: "community",
    alternatives: "Possible",
    demand: "Possible",
    infrastructure: [
      "Dispersed foothill settlements sit beyond the main corridor.",
      "Separate jurisdictions maintain roads and stop areas.",
      "Regional transfer timetables lack an evening connection.",
    ],
    names: [
      "Foothills Community Primary Care",
      "Foothills town learning & services center",
      "Bighorn Valley nature access site",
    ],
    trips: [
      [68, 13, 1, true, 3, false, true, 32],
      [49, 12, 1, true, 3, false, true, 24],
      [58, 17, 0, true, 2, false, true, 26],
    ],
    scenario: {
      serviceName: "Coordinated foothill youth connector",
      capitalCost: 225000,
      annualOperatingCost: 183000,
      residentsBenefiting: 940,
      youthBenefiting: 195,
      addedWeeklyTrips: 14,
    },
  },
];

function buildMobility(profile) {
  const zone = zones.find((entry) => entry.id === profile.id);
  const { id, occupation, alternatives, demand, names, trips, ...metrics } =
    profile;
  const younger = Math.round(metrics.adolescents * 0.51);
  const destinations = trips.map((trip, index) => {
    const [
      transitMinutes,
      walkMinutes,
      transfers,
      roundTripAvailable,
      serviceDays,
      eveningReturn,
      accessible,
      carMinutes,
    ] = trip;
    const offsets = [
      [0.035, 0.055],
      [-0.025, 0.075],
      [0.06, -0.045],
    ];
    return {
      id: `${id}-${["healthcare", "urban", "nature"][index]}`,
      name: `${names[index]} (sample)`,
      type: ["Healthcare", "Urban service", "Nature"][index],
      lat: Number((zone.lat + offsets[index][0]).toFixed(4)),
      lng: Number((zone.lng + offsets[index][1]).toFixed(4)),
      transitMinutes,
      walkMinutes,
      transfers,
      roundTripAvailable,
      serviceDays,
      eveningReturn,
      accessible,
      carMinutes,
    };
  });
  return {
    totalPopulation: zone.population,
    ...metrics,
    healthcareMinutesCar: destinations[0].carMinutes,
    healthcareMinutesTransit: destinations[0].transitMinutes,
    ageGroups: [
      { label: "12–14", population: younger },
      { label: "15–17", population: metrics.adolescents - younger },
    ],
    occupationMix: occupations[occupation].map((entry) => ({ ...entry })),
    drivers: [
      {
        label: "Limited service implementation",
        assessment: zone.severity === "Low" ? "Possible" : "Likely",
        evidence: `Sample: ${zone.weeklyService} one-way trips per week and a ${zone.distance}-mile gap to the nearest stop suggest a supply constraint.`,
      },
      {
        label: "Convenience of other travel modes",
        assessment: alternatives,
        evidence: `Sample: the clinic takes ${destinations[0].carMinutes} minutes by car${destinations[0].transitMinutes === null ? " with no scheduled transit connection" : ` versus ${destinations[0].transitMinutes} minutes by transit`}. Car access is not assumed for adolescents.`,
      },
      {
        label: "Low travel need",
        assessment: demand,
        evidence:
          demand === "Not indicated"
            ? "Sample: unmet youth and healthcare trips suggest suppressed travel. Low boardings alone do not establish low need."
            : "Sample: dispersed activities may produce some low-demand periods; a community survey is needed to separate low need from unmet demand.",
      },
      {
        label: "Age-related dependence",
        assessment: "Likely",
        evidence: `Sample: ${metrics.noIndependentYouth} of ${metrics.adolescents} adolescents ages 12–17 lack independent access under this fixture's assumptions.`,
      },
      {
        label: "Work & learning schedules",
        assessment: zone.severity === "Low" ? "Possible" : "Likely",
        evidence:
          "Sample: shift work, training, and after-school activities can fall outside service hours. Occupation shares are context, not evidence of causation.",
      },
    ],
    destinations,
  };
}

export const mobilityByZone = Object.fromEntries(
  profiles.map((profile) => [profile.id, buildMobility(profile)]),
);

/** Rule-based demo screening, not a journey planner or a safety assessment. */
export function assessDestination(
  destination,
  {
    maxMinutes = 60,
    maxWalkMinutes = 15,
    requiresEveningReturn = false,
    requiresWheelchair = false,
  } = {},
) {
  const reasons = [];
  let unavailable = false;
  if (
    destination.transitMinutes === null ||
    !Number.isFinite(destination.transitMinutes)
  ) {
    reasons.push("No scheduled public transit connection.");
    unavailable = true;
  }
  if (!destination.roundTripAvailable) {
    reasons.push("No usable same-day return trip.");
    unavailable = true;
  }
  if (destination.serviceDays === 0) {
    reasons.push("No operating days per week.");
    unavailable = true;
  }
  if (unavailable) return { status: "Unavailable", reasons };

  if (destination.transitMinutes > maxMinutes)
    reasons.push(`Transit travel exceeds ${maxMinutes} minutes one way.`);
  if (destination.walkMinutes > maxWalkMinutes)
    reasons.push(`Walking access exceeds ${maxWalkMinutes} minutes.`);
  if (destination.serviceDays < 3)
    reasons.push(
      `Service operates only ${destination.serviceDays} day${destination.serviceDays === 1 ? "" : "s"} per week.`,
    );
  if (requiresEveningReturn && !destination.eveningReturn)
    reasons.push("No evening return for after-school activities.");
  if (requiresWheelchair && !destination.accessible)
    reasons.push(
      "Accessible vehicle or boarding is not available in this sample.",
    );
  if (reasons.length) return { status: "Limited", reasons };
  return {
    status: "Reachable",
    reasons: [
      `A return trip is available at least 3 days per week, within ${maxMinutes} transit minutes and ${maxWalkMinutes} walking minutes.${requiresEveningReturn ? " An evening return is available." : ""}${requiresWheelchair ? " Accessible vehicle and boarding are available in this sample." : ""}`,
    ],
  };
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const percent = (numerator, denominator) =>
  denominator > 0 ? clamp((numerator / denominator) * 100, 0, 100) : 0;

/** Transparent demonstration weights; this is not a validated policy score. */
export function priorityScore(mobility) {
  const components = [
    {
      label: "Youth without independent access",
      value: percent(mobility.noIndependentYouth, mobility.adolescents),
      weight: 45,
    },
    {
      label: "Residents without reliable transportation",
      value: percent(mobility.unreliableResidents, mobility.totalPopulation),
      weight: 25,
    },
    {
      label: "Healthcare transit burden",
      value:
        mobility.healthcareMinutesTransit === null
          ? 100
          : clamp((mobility.healthcareMinutesTransit / 120) * 100, 0, 100),
      weight: 30,
    },
  ];
  return {
    score: Math.round(
      components.reduce(
        (sum, component) => sum + (component.value * component.weight) / 100,
        0,
      ),
    ),
    components,
  };
}

/**
 * Illustrative cost/coverage assumptions: operating costs scale with added trips,
 * potential residents served scale with the square root of the trip ratio.
 * These figures do not estimate realized demand, boardings, or actual route costs.
 */
export function scenarioEstimate(
  mobility,
  weeklyTrips = mobility.scenario.addedWeeklyTrips,
) {
  const trips = Number.isFinite(weeklyTrips)
    ? Math.max(0, Math.round(weeklyTrips))
    : 0;
  const base = mobility.scenario;
  if (trips === 0 || base.addedWeeklyTrips <= 0) {
    return {
      capitalCost: 0,
      annualOperatingCost: 0,
      residentsBenefiting: 0,
      youthBenefiting: 0,
      annualCostPerResident: 0,
      firstYearCost: 0,
      weeklyTrips: 0,
    };
  }
  const ratio = trips / base.addedWeeklyTrips;
  const annualOperatingCost = Math.round(base.annualOperatingCost * ratio);
  const residentsBenefiting = Math.min(
    mobility.limitedServiceResidents,
    Math.round(base.residentsBenefiting * Math.sqrt(ratio)),
  );
  const youthBenefiting = Math.min(
    mobility.adolescents,
    residentsBenefiting,
    Math.round(base.youthBenefiting * Math.sqrt(ratio)),
  );
  return {
    capitalCost: base.capitalCost,
    annualOperatingCost,
    residentsBenefiting,
    youthBenefiting,
    annualCostPerResident:
      residentsBenefiting > 0
        ? Math.round(annualOperatingCost / residentsBenefiting)
        : 0,
    firstYearCost: base.capitalCost + annualOperatingCost,
    weeklyTrips: trips,
  };
}
