import {
  ArrowUpRight,
  HeartPulse,
  UsersRound,
  TreePine,
  Building2,
  ShieldCheck,
  CircleAlert,
} from "lucide-react";
import {
  mobilityByZone,
  assessDestination,
  priorityScore,
  scenarioEstimate,
} from "../mobilityData.js";
const n = (value) => new Intl.NumberFormat("en-US").format(value);
const usd = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export default function ZoneMobilitySummary({ zone, onExplore }) {
  const m = mobilityByZone[zone.id];
  if (!m) return null;
  const score = priorityScore(m),
    scenario = scenarioEstimate(m);
  return (
    <div className="zone-mobility-summary">
      <section>
        <h3>
          <UsersRound size={17} />
          Youth & essential access <span className="tag">Ages 12–17</span>
        </h3>
        <div className="mobility-detail-grid">
          <div>
            <span>Adolescent residents</span>
            <strong>{n(m.adolescents)}</strong>
          </div>
          <div>
            <span>Youth without independent access</span>
            <strong>{n(m.noIndependentYouth)}</strong>
          </div>
          <div>
            <span>Residents without reliable transport</span>
            <strong>{n(m.unreliableResidents)}</strong>
          </div>
          <div>
            <span>Residents with limited transit</span>
            <strong>{n(m.limitedServiceResidents)}</strong>
          </div>
        </div>
        <p className="detail-caption">
          Synthetic, overlapping population groups; do not add these counts.
          Zone totals never identify individual adolescents or households.
        </p>
      </section>
      <section>
        <h3>
          <HeartPulse size={17} />
          Access to appropriate healthcare
        </h3>
        <p>
          <strong>{m.healthcareName}</strong> · Sample primary-care destination.
          Emergency and specialist care may require a different facility.
        </p>
        <div className="healthcare-comparison">
          <div>
            <span>By private vehicle</span>
            <strong>{m.healthcareMinutesCar} min</strong>
          </div>
          <ArrowUpRight size={17} />
          <div>
            <span>By existing transit, one way</span>
            <strong>
              {m.healthcareMinutesTransit === null
                ? "No usable trip"
                : `${m.healthcareMinutesTransit} min`}
            </strong>
          </div>
        </div>
      </section>
      <section>
        <h3>
          <TreePine size={17} />
          City services & nature
        </h3>
        <div className="profile-destinations">
          {m.destinations.map((d) => {
            const access = assessDestination(d);
            const Icon =
              d.type === "Nature"
                ? TreePine
                : d.type === "Healthcare"
                  ? HeartPulse
                  : Building2;
            return (
              <div key={d.id}>
                <Icon size={16} />
                <div>
                  <strong>{d.name}</strong>
                  <span>
                    {d.type} ·{" "}
                    {d.transitMinutes === null
                      ? "No transit itinerary"
                      : `${d.transitMinutes} min by transit`}
                  </span>
                </div>
                <span
                  className={`access-status access-${access.status.toLowerCase()}`}
                >
                  {access.status}
                </span>
              </div>
            );
          })}
        </div>
        <p className="detail-caption">
          Default demo screen: ≤60 min one-way, ≤15 min walk, a return trip and
          ≥3 service days/week. Reachability is illustrative, not a safety
          assessment.
        </p>
        <button className="text-button" onClick={() => onExplore(zone)}>
          Adjust access criteria & compare projects <ArrowUpRight size={14} />
        </button>
      </section>
      <section>
        <h3>Infrastructure constraints</h3>
        <ul className="cause-list">
          {m.infrastructure.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Baseline sample service proposal</h3>
        <p>
          <strong>{scenario.weeklyTrips} added weekly trips</strong> ·{" "}
          {m.scenario.serviceName}
        </p>
        <div className="mobility-detail-grid">
          <div>
            <span>One-time capital</span>
            <strong>{usd(scenario.capitalCost)}</strong>
          </div>
          <div>
            <span>Annual operations</span>
            <strong>{usd(scenario.annualOperatingCost)}</strong>
          </div>
          <div>
            <span>Residents potentially benefiting</span>
            <strong>{n(scenario.residentsBenefiting)}</strong>
          </div>
          <div>
            <span>Including adolescents</span>
            <strong>{n(scenario.youthBenefiting)}</strong>
          </div>
        </div>
        <p className="detail-caption">
          Seeded baseline; the Youth access workspace can explore alternative
          scenarios. Not an engineering estimate, funding award, or forecast.
          Youth beneficiaries are included in resident beneficiaries.
        </p>
      </section>
      <section className="evidence-summary">
        <h3>
          <CircleAlert size={17} />
          Evidence & assessment priority
        </h3>
        <div className="evidence-score">
          <strong>
            {score.score}
            <small>/100</small>
          </strong>
          <span>
            Illustrative needs score
            <br />
            <b>
              {m.evidenceConfidence} evidence confidence · {m.evidenceCoverage}%
              coverage
            </b>
          </span>
        </div>
        <p>
          45% youth access gap + 25% unreliable transport + 30% healthcare
          access. This screen supports review; it does not determine funding or
          eligibility.
        </p>
        <ul className="cause-list">
          {m.missingData.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="detail-caption">
          <ShieldCheck size={12} /> Synthetic research inventory · October 2026
          · Community validation required.
        </p>
      </section>
    </div>
  );
}
