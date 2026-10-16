import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Building2,
  BusFront,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  HeartPulse,
  Info,
  MapPin,
  Moon,
  Route,
  Trees,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";
import {
  mobilityByZone,
  assessDestination,
  priorityScore,
  scenarioEstimate,
} from "../mobilityData.js";
import "./YouthPlanning.css";

const format = (n) => new Intl.NumberFormat("en-US").format(n);
const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
const percent = (n, total) => (total ? Math.round((n / total) * 100) : 0);
const STORAGE_KEY = "tsts-youth-service-scenarios-v1";
const icons = {
  Healthcare: HeartPulse,
  "Urban service": Building2,
  Nature: Trees,
};

function readScenarios() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).filter(
        ([id, trips]) =>
          mobilityByZone[id] &&
          Number.isInteger(trips) &&
          trips >= 6 &&
          trips <= 30,
      ),
    );
  } catch {
    return {};
  }
}

function exportComparison(rows) {
  const fields = [
    "Sample zone",
    "State",
    "Priority score / 100",
    "Adolescents age 12–17",
    "Youth without independent access",
    "Residents without reliable transportation",
    "Residents with limited service",
    "Healthcare transit minutes",
    "Added weekly one-way trips",
    "Annual operating cost USD",
    "Capital cost USD",
    "Residents benefiting",
    "Youth benefiting",
    "Annual operating cost per resident USD",
    "Evidence confidence",
  ];
  const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const data = rows.map(({ zone, mobility, priority, estimate }) => [
    zone.name,
    zone.state,
    priority.score,
    mobility.adolescents,
    mobility.noIndependentYouth,
    mobility.unreliableResidents,
    mobility.limitedServiceResidents,
    mobility.healthcareMinutesTransit ?? "No service",
    estimate.weeklyTrips,
    estimate.annualOperatingCost,
    estimate.capitalCost,
    estimate.residentsBenefiting,
    estimate.youthBenefiting,
    estimate.annualCostPerResident,
    mobility.evidenceConfidence,
  ]);
  const csv = [fields, ...data]
    .map((row) => row.map(quote).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "TSTS-sample-youth-project-comparison.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function DestinationCard({ destination, criteria }) {
  const Icon = icons[destination.type] || MapPin;
  const assessment = assessDestination(destination, criteria);
  return (
    <article
      className={`youth-destination youth-destination-${destination.type === "Nature" ? "nature" : destination.type === "Healthcare" ? "health" : "urban"}`}
    >
      <div className="youth-destination-top">
        <span className="youth-destination-icon">
          <Icon size={20} />
        </span>
        <span
          className={`youth-access-status youth-status-${assessment.status.toLowerCase()}`}
        >
          {assessment.status === "Reachable" ? (
            <CheckCircle2 size={13} />
          ) : (
            <TriangleAlert size={13} />
          )}
          {assessment.status}
        </span>
      </div>
      <span className="youth-category">{destination.type}</span>
      <h3>{destination.name}</h3>
      <div className="youth-travel-time">
        <strong>
          {destination.transitMinutes === null
            ? "No service"
            : `${destination.transitMinutes} min`}
        </strong>
        <span>one way by existing transit</span>
      </div>
      <dl className="youth-destination-facts">
        <div>
          <dt>Walk to transit</dt>
          <dd>
            {destination.transitMinutes === null
              ? "—"
              : `${destination.walkMinutes} min`}
          </dd>
        </div>
        <div>
          <dt>Transfers</dt>
          <dd>
            {destination.transitMinutes === null ? "—" : destination.transfers}
          </dd>
        </div>
        <div>
          <dt>Service days / week</dt>
          <dd>{destination.serviceDays}</dd>
        </div>
        <div>
          <dt>Evening return</dt>
          <dd>{destination.eveningReturn ? "Available" : "Unavailable"}</dd>
        </div>
        <div>
          <dt>Accessible boarding</dt>
          <dd>{destination.accessible ? "Available" : "Unavailable"}</dd>
        </div>
        <div>
          <dt>By private car</dt>
          <dd>{destination.carMinutes} min</dd>
        </div>
      </dl>
      <div className="youth-destination-verdict" aria-live="polite">
        {assessment.reasons.length ? (
          assessment.reasons.map((reason) => <p key={reason}>{reason}</p>)
        ) : (
          <p>Meets the selected trip conditions with a same-day return.</p>
        )}
      </div>
    </article>
  );
}

export default function YouthPlanning({
  zones,
  initialZoneId,
  filters,
  onSelectZone,
}) {
  const [tab, setTab] = useState("access");
  const [selectedId, setSelectedId] = useState(
    initialZoneId || zones[0]?.id || "",
  );
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [maxWalkMinutes, setMaxWalkMinutes] = useState(15);
  const [requiresEveningReturn, setRequiresEveningReturn] = useState(false);
  const [requiresWheelchair, setRequiresWheelchair] = useState(false);
  const [scenarios, setScenarios] = useState(readScenarios);
  const [storageError, setStorageError] = useState(false);
  const [sortBy, setSortBy] = useState("priority");
  const availableZones = zones.filter((zone) => mobilityByZone[zone.id]);
  const zone =
    availableZones.find((item) => item.id === selectedId) || availableZones[0];
  const mobility = zone ? mobilityByZone[zone.id] : null;
  const criteria = {
    maxMinutes,
    maxWalkMinutes,
    requiresEveningReturn,
    requiresWheelchair,
  };
  const weeklyTrips = mobility
    ? (scenarios[zone.id] ?? mobility.scenario.addedWeeklyTrips)
    : 12;
  const estimate = mobility ? scenarioEstimate(mobility, weeklyTrips) : null;

  useEffect(() => {
    if (initialZoneId && zones.some((item) => item.id === initialZoneId)) {
      setSelectedId(initialZoneId);
      setTab("access");
    }
  }, [initialZoneId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [scenarios]);

  const comparison = useMemo(
    () =>
      zones
        .filter((item) => mobilityByZone[item.id])
        .map((item) => {
          const m = mobilityByZone[item.id];
          return {
            zone: item,
            mobility: m,
            priority: priorityScore(m),
            estimate: scenarioEstimate(
              m,
              scenarios[item.id] ?? m.scenario.addedWeeklyTrips,
            ),
          };
        })
        .sort((a, b) =>
          sortBy === "cost"
            ? a.estimate.annualCostPerResident -
              b.estimate.annualCostPerResident
            : sortBy === "youth"
              ? b.estimate.youthBenefiting - a.estimate.youthBenefiting
              : b.priority.score - a.priority.score,
        ),
    [zones, scenarios, sortBy],
  );

  const changeTab = (next) => setTab(next);
  const tabKeyDown = (event) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next =
        event.key === "Home"
          ? "access"
          : event.key === "End"
            ? "compare"
            : tab === "access"
              ? "compare"
              : "access";
      setTab(next);
      document.getElementById(`youth-tab-${next}`)?.focus();
    }
  };

  const heading = (
    <div className="page-heading">
      <div>
        <div className="eyebrow">BRIDGING CITY, COMMUNITY & NATURE</div>
        <h1>Youth access</h1>
        <p>
          Plan independent connections to opportunity for adolescents ages
          12–17.
        </p>
      </div>
      <span className="demo-tag">
        <FlaskConical size={14} />
        Sample data
      </span>
    </div>
  );

  if (!mobility)
    return (
      <div className="youth-page">
        {heading}
        {filters}
        <div className="panel empty-state">
          <Users size={28} />
          <h3>No sample zones match these filters</h3>
          <p>Clear or adjust the filters above to explore youth access.</p>
        </div>
      </div>
    );

  return (
    <div className="youth-page">
      {heading}
      {filters}
      <div
        className="youth-tabs"
        role="tablist"
        aria-label="Youth planning views"
        onKeyDown={tabKeyDown}
      >
        <button
          id="youth-tab-access"
          role="tab"
          aria-selected={tab === "access"}
          aria-controls="youth-access-panel"
          tabIndex={tab === "access" ? 0 : -1}
          onClick={() => changeTab("access")}
        >
          <Route size={16} /> Access explorer
        </button>
        <button
          id="youth-tab-compare"
          role="tab"
          aria-selected={tab === "compare"}
          aria-controls="youth-compare-panel"
          tabIndex={tab === "compare" ? 0 : -1}
          onClick={() => changeTab("compare")}
        >
          <BarChart3 size={16} /> Project comparison{" "}
          <span>{availableZones.length}</span>
        </button>
      </div>

      {tab === "access" ? (
        <div
          id="youth-access-panel"
          role="tabpanel"
          aria-labelledby="youth-tab-access"
        >
          <section className="youth-bridge">
            <div className="youth-bridge-copy">
              <span className="youth-kicker">
                <Route size={14} /> CITY ↔ COMMUNITY ↔ NATURE
              </span>
              <h2>
                More places to go.
                <br />
                More freedom to get there.
              </h2>
              <p>
                Explore whether adolescents can independently reach care, urban
                services, and natural destinations using existing transit.
              </p>
              <span className="youth-sample-note">
                <FlaskConical size={13} /> Sample data · Ages 12–17 · Area-level
                estimates
              </span>
            </div>
            <div className="youth-zone-picker">
              <label htmlFor="youth-zone">Planning zone</label>
              <select
                id="youth-zone"
                value={zone.id}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                {availableZones.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.stateCode}
                  </option>
                ))}
              </select>
              <p>
                <MapPin size={13} /> {zone.county}, {zone.state}
              </p>
              <button
                className="text-button"
                onClick={() => onSelectZone(zone)}
              >
                View complete zone profile <ArrowRight size={14} />
              </button>
            </div>
          </section>

          <div className="youth-summary-grid">
            <div className="youth-summary-card">
              <Users size={18} />
              <span>Adolescents, ages 12–17</span>
              <strong>{format(mobility.adolescents)}</strong>
              <small>
                {percent(mobility.adolescents, mobility.totalPopulation)}% of
                the planning-zone population
              </small>
            </div>
            <div className="youth-summary-card youth-summary-alert">
              <Route size={18} />
              <span>Youth lacking independent access</span>
              <strong>{format(mobility.noIndependentYouth)}</strong>
              <small>
                {percent(mobility.noIndependentYouth, mobility.adolescents)}% of
                adolescents · baseline estimate
              </small>
            </div>
            <div className="youth-summary-card">
              <BusFront size={18} />
              <span>Residents without reliable transport</span>
              <strong>{format(mobility.unreliableResidents)}</strong>
              <small>
                {format(mobility.limitedServiceResidents)} live with limited
                transit service
              </small>
            </div>
            <div className="youth-summary-card">
              <HeartPulse size={18} />
              <span>Nearest appropriate healthcare</span>
              <strong>
                {mobility.healthcareMinutesTransit === null
                  ? "No transit"
                  : `${mobility.healthcareMinutesTransit} min`}
              </strong>
              <small>
                {mobility.healthcareMinutesCar} min by car ·{" "}
                {mobility.healthcareName}
              </small>
            </div>
          </div>

          <section className="panel youth-access-panel">
            <div className="panel-heading">
              <div>
                <h2>Can a young person make this trip independently?</h2>
                <p>
                  Change the trip conditions to test access. Each assessment
                  includes a same-day return.
                </p>
              </div>
              <span className="youth-mini-label">EXISTING SERVICE</span>
            </div>
            <div className="youth-criteria">
              <label>
                Maximum one-way transit time
                <select
                  value={maxMinutes}
                  onChange={(event) =>
                    setMaxMinutes(Number(event.target.value))
                  }
                >
                  {[30, 45, 60, 90, 120].map((minutes) => (
                    <option key={minutes} value={minutes}>
                      {minutes} minutes
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Maximum walk to transit
                <select
                  value={maxWalkMinutes}
                  onChange={(event) =>
                    setMaxWalkMinutes(Number(event.target.value))
                  }
                >
                  {[5, 10, 15, 20, 30].map((minutes) => (
                    <option key={minutes} value={minutes}>
                      {minutes} minutes
                    </option>
                  ))}
                </select>
              </label>
              <label className="youth-checkbox">
                <input
                  type="checkbox"
                  checked={requiresEveningReturn}
                  onChange={(event) =>
                    setRequiresEveningReturn(event.target.checked)
                  }
                />
                <Moon size={15} />
                <span>Require evening return</span>
              </label>
              <label className="youth-checkbox">
                <input
                  type="checkbox"
                  checked={requiresWheelchair}
                  onChange={(event) =>
                    setRequiresWheelchair(event.target.checked)
                  }
                />
                <Accessibility size={16} />
                <span>Require accessible boarding</span>
              </label>
            </div>
            <div className="youth-destinations">
              {mobility.destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  criteria={criteria}
                />
              ))}
            </div>
            <p className="youth-section-note">
              <Info size={14} /> Trip conditions change destination assessments,
              not the fixed baseline population estimates. Screening uses
              illustrative timetables and travel times; it does not verify safe
              walking routes, service eligibility, or permission to travel
              alone.
            </p>
          </section>

          <div className="youth-context-grid">
            <section className="panel youth-demographics">
              <div className="panel-heading">
                <div>
                  <h2>Who lives here?</h2>
                  <p>Aggregate sample demographics; no individual locations.</p>
                </div>
                <Users size={19} />
              </div>
              <div className="youth-context-body">
                <span className="youth-mini-label">
                  AGE BREAKDOWN · {format(mobility.adolescents)} ADOLESCENTS
                </span>
                <div className="youth-age-bars">
                  {mobility.ageGroups.map((group) => (
                    <div key={group.label}>
                      <div>
                        <span>Ages {group.label}</span>
                        <strong>{format(group.population)}</strong>
                      </div>
                      <div className="youth-bar-track">
                        <span
                          style={{
                            width: `${percent(group.population, mobility.adolescents)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <span className="youth-mini-label">
                  OCCUPATIONS · SAMPLE EMPLOYED ADULTS
                </span>
                <div className="youth-occupation-list">
                  {mobility.occupationMix.map((item) => (
                    <div key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.percent}%</strong>
                    </div>
                  ))}
                </div>
                <p className="youth-small-copy">
                  Age and work patterns help frame outreach. They do not
                  establish transit demand or an individual’s transportation
                  needs.
                </p>
              </div>
            </section>
            <section className="panel youth-diagnosis">
              <div className="panel-heading">
                <div>
                  <h2>Why is transit use low?</h2>
                  <p>
                    Distinguish service gaps from preferences and unmet need.
                  </p>
                </div>
                <BarChart3 size={19} />
              </div>
              <div className="youth-usage-metrics">
                <div>
                  <strong>{format(mobility.weeklyBoardings)}</strong>
                  <span>sample weekly boardings</span>
                </div>
                <div>
                  <strong>
                    {mobility.usageTrendPercent > 0 ? "+" : ""}
                    {mobility.usageTrendPercent}%
                  </strong>
                  <span>sample year-over-year change</span>
                </div>
                <p>
                  Low ridership does not establish low demand. These are
                  hypotheses to validate with local communities.
                </p>
              </div>
              <div className="youth-drivers">
                {mobility.drivers.map((driver) => (
                  <div key={driver.label}>
                    <div>
                      <h3>{driver.label}</h3>
                      <span>{driver.assessment}</span>
                    </div>
                    <p>{driver.evidence}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="panel youth-scenario">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">SERVICE PLANNING SANDBOX</span>
                <h2>{mobility.scenario.serviceName}</h2>
                <p>
                  Adjust service intensity to explore illustrative costs and
                  residents who may benefit.
                </p>
              </div>
              <Wallet size={20} />
            </div>
            <div className="youth-scenario-body">
              <div className="youth-scenario-control">
                <label htmlFor="youth-weekly-trips">
                  Added one-way trips per week <strong>{weeklyTrips}</strong>
                </label>
                <input
                  id="youth-weekly-trips"
                  type="range"
                  min="6"
                  max="30"
                  step="2"
                  value={weeklyTrips}
                  onChange={(event) =>
                    setScenarios((current) => ({
                      ...current,
                      [zone.id]: Number(event.target.value),
                    }))
                  }
                />
                <div className="youth-range-labels">
                  <span>6 trips</span>
                  <span>30 trips</span>
                </div>
                <p>
                  Settings save in this browser and carry into project
                  comparison.
                </p>
                <button
                  className="text-button"
                  onClick={() =>
                    setScenarios((current) => ({
                      ...current,
                      [zone.id]: mobility.scenario.addedWeeklyTrips,
                    }))
                  }
                >
                  Reset to sample baseline
                </button>
              </div>
              <div className="youth-scenario-results" aria-live="polite">
                <div>
                  <span>Annual operations</span>
                  <strong>{money(estimate.annualOperatingCost)}</strong>
                  <small>{money(estimate.capitalCost)} one-time capital</small>
                </div>
                <div>
                  <span>Residents who may benefit</span>
                  <strong>{format(estimate.residentsBenefiting)}</strong>
                  <small>
                    including {format(estimate.youthBenefiting)} adolescents
                  </small>
                </div>
                <div>
                  <span>Annual cost / resident</span>
                  <strong>{money(estimate.annualCostPerResident)}</strong>
                  <small>
                    {money(estimate.firstYearCost)} first-year total
                  </small>
                </div>
              </div>
            </div>
            {storageError && (
              <p className="youth-storage-warning" role="status">
                Browser storage is unavailable. Scenario changes will last only
                for this session.
              </p>
            )}
            <p className="youth-section-note">
              <FlaskConical size={14} /> Demo estimate, not a budget or
              forecast. Operations scale with added trips; beneficiaries scale
              with the square root of the trip ratio and are capped by residents
              with limited transit or adolescents, as applicable. Capital is
              held constant. Annual cost per resident excludes capital.
            </p>
          </section>

          <div className="youth-context-grid youth-evidence-grid">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Terrain & route feasibility</h2>
                  <p>Consider barriers before selecting a service concept.</p>
                </div>
                <Route size={19} />
              </div>
              <div className="youth-context-body">
                <div className="youth-terrain-label">
                  <span>Simulated terrain difficulty</span>
                  <strong>{zone.terrainGrade}</strong>
                </div>
                <p className="youth-landscape">{zone.landscape}</p>
                <ul className="youth-constraint-list">
                  {mobility.infrastructure.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button
                  className="text-button"
                  onClick={() => onSelectZone(zone)}
                >
                  Review landscape, causes & existing measures{" "}
                  <ChevronRight size={14} />
                </button>
              </div>
            </section>
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Evidence & outreach needs</h2>
                  <p>
                    Make incomplete information visible before prioritizing.
                  </p>
                </div>
                <Info size={19} />
              </div>
              <div className="youth-context-body">
                <div className="youth-evidence-stats">
                  <span>
                    <strong>{mobility.evidenceConfidence}</strong> sample
                    confidence
                  </span>
                  <span>
                    <strong>{mobility.evidenceCoverage}%</strong> sample data
                    coverage
                  </span>
                </div>
                <ul className="youth-constraint-list">
                  {mobility.missingData.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="youth-small-copy">
                  All demographics, usage statistics, access estimates, and
                  evidence ratings are fictional demo inputs. Validate through
                  accessible youth engagement, tribal coordination where
                  applicable, operator timetables, and local surveys.
                </p>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div
          id="youth-compare-panel"
          role="tabpanel"
          aria-labelledby="youth-tab-compare"
        >
          <section className="youth-priority-intro">
            <div>
              <span className="youth-kicker">
                <BarChart3 size={14} /> TRANSPARENT PROJECT SCREENING
              </span>
              <h2>Compare needs. See the tradeoffs.</h2>
              <p>
                Use a consistent starting point across {availableZones.length}{" "}
                sample zones. Rankings help focus research and community
                outreach; they do not determine funding eligibility.
              </p>
            </div>
            <div className="youth-priority-weights">
              <div>
                <strong>45%</strong>
                <span>Youth access gap</span>
              </div>
              <div>
                <strong>25%</strong>
                <span>Unreliable transport</span>
              </div>
              <div>
                <strong>30%</strong>
                <span>Healthcare access</span>
              </div>
            </div>
          </section>
          <section className="panel youth-comparison-panel">
            <div className="panel-heading">
              <div>
                <h2>Planning priorities</h2>
                <p>
                  Uses each zone’s saved service scenario. Change intensity in
                  Access explorer.
                </p>
              </div>
              <button
                className="button button-secondary button-small"
                onClick={() => exportComparison(comparison)}
              >
                <ArrowDownToLine size={14} /> Export CSV
              </button>
            </div>
            <div className="youth-comparison-controls">
              <label htmlFor="youth-compare-sort">Sort projects by</label>
              <select
                id="youth-compare-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="priority">Highest need score</option>
                <option value="youth">Most adolescents benefiting</option>
                <option value="cost">Lowest annual cost per resident</option>
              </select>
              <span>Sample data · USD · Ages 12–17</span>
            </div>
            <div className="table-scroll">
              <table>
                <caption className="sr-only">
                  Sample zone project comparison with need scores, access gaps,
                  and service costs
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Planning zone</th>
                    <th scope="col">Need score</th>
                    <th scope="col">Youth access gap</th>
                    <th scope="col">Healthcare by transit</th>
                    <th scope="col">Youth benefiting</th>
                    <th scope="col">All residents benefiting</th>
                    <th scope="col">Annual operations</th>
                    <th scope="col">Annual cost / resident</th>
                    <th scope="col">Evidence</th>
                    <th scope="col">Explore</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(
                    ({ zone: item, mobility: m, priority: p, estimate: e }) => (
                      <tr key={item.id}>
                        <td>
                          <button
                            className="zone-cell"
                            onClick={() => onSelectZone(item)}
                          >
                            <strong>{item.name}</strong>
                            <span>
                              {item.stateCode} · {item.region}
                            </span>
                          </button>
                        </td>
                        <td>
                          <span className="youth-need-score">
                            {p.score}
                            <small> / 100</small>
                          </span>
                        </td>
                        <td>
                          {format(m.noIndependentYouth)}
                          <span className="youth-cell-note">
                            {percent(m.noIndependentYouth, m.adolescents)}% of
                            adolescents
                          </span>
                        </td>
                        <td>
                          {m.healthcareMinutesTransit === null ? (
                            <span className="youth-no-service">No service</span>
                          ) : (
                            `${m.healthcareMinutesTransit} min`
                          )}
                        </td>
                        <td>{format(e.youthBenefiting)}</td>
                        <td>{format(e.residentsBenefiting)}</td>
                        <td>
                          {money(e.annualOperatingCost)}
                          <span className="youth-cell-note">
                            {e.weeklyTrips} added trips / week
                          </span>
                        </td>
                        <td>{money(e.annualCostPerResident)}</td>
                        <td>
                          <span className="youth-confidence">
                            {m.evidenceConfidence}
                          </span>
                          <span className="youth-cell-note">
                            {m.evidenceCoverage}% coverage
                          </span>
                        </td>
                        <td>
                          <button
                            className="text-button"
                            aria-label={`Explore access in ${item.name}`}
                            onClick={() => {
                              setSelectedId(item.id);
                              setTab("access");
                              document
                                .getElementById("youth-tab-access")
                                ?.focus();
                            }}
                          >
                            Explore <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <p className="youth-section-note">
              <Info size={14} /> Youth and reliability components use the share
              of the relevant population with an access gap. Healthcare minutes
              are capped at 120; no transit service receives the maximum gap.
              Each component is normalized to 0–100 before weighting. The score
              excludes terrain, cost, and confidence so reviewers can assess
              those separately.
            </p>
          </section>
          <section className="youth-comparison-caution">
            <FlaskConical size={20} />
            <div>
              <h3>Compare estimates with their limitations</h3>
              <p>
                Estimated beneficiaries are people who may gain an option, not
                predicted riders. Overlapping population groups must not be
                added together. Budget figures exclude detailed engineering,
                inflation, land acquisition, and operator procurement. Limited
                evidence is a reason to investigate, not to exclude a community.
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
