import {
  ArrowUpRight,
  BusFront,
  Landmark,
  Route,
  UsersRound,
  Mountain,
  Ship,
  Info,
} from "lucide-react";

const programCards = [
  {
    id: "5311",
    code: "FTA SECTION 5311",
    title: "Rural Areas Formula Grants",
    icon: BusFront,
    accent: "#2563eb",
    metric: "<50,000",
    metricLabel: "Rural area population",
    description:
      "Supports public transportation in rural areas through capital, operating, and planning assistance.",
    eligibility:
      "States and federally recognized tribes are eligible recipients. Local governments, nonprofits, and transit or intercity bus operators may be subrecipients. Eligibility is based on the rural service area, not simply a county’s total population.",
    uses: [
      "Vehicles and transit facilities",
      "Service operations",
      "Planning and mobility management",
    ],
    note: "Planning lens: compare public routes that help young people reach healthcare, jobs, town centers, and outdoor destinations. Coordinate a rural service concept with the state DOT.",
    source: "https://www.transit.dot.gov/rural-formula-grants-5311",
    sourceLabel: "FTA · Section 5311 overview",
  },
  {
    id: "intercity",
    code: "FTA SECTION 5311(f)",
    title: "Intercity Bus Connections",
    icon: Route,
    accent: "#0d9488",
    metric: "15%",
    metricLabel: "State annual allocation minimum",
    description:
      "States must use at least 15% of their annual Section 5311 apportionment to develop and support intercity bus transportation.",
    eligibility:
      "This is a state spending requirement within Section 5311. An exception applies when the governor certifies, after consultation with affected intercity bus providers, that the state’s intercity bus needs are adequately met.",
    uses: [
      "Rural-to-intercity connections",
      "Intercity operating assistance",
      "Stops, facilities, and coordination",
    ],
    note: "Planning lens: check whether a young rider can make the onward connection and return the same day. The 15% requirement does not guarantee an award to a zone.",
    source:
      "https://www.transit.dot.gov/sites/fta.dot.gov/files/2024-09/C9040.1H-Circular-11-01-2024.pdf#page=101",
    sourceLabel: "FTA · Intercity guidance (PDF)",
  },
  {
    id: "tribal",
    code: "FTA SECTION 5311(c)",
    title: "Tribal Transit Program",
    icon: UsersRound,
    accent: "#7c3aed",
    metric: "2 tracks",
    metricLabel: "Formula and competitive funding",
    description:
      "Supports public transportation on and around tribal lands in rural areas, including sparsely populated communities.",
    eligibility:
      "Federally recognized American Indian and Alaska Native tribes identified by the Bureau of Indian Affairs are eligible. Projects must serve rural communities. Formula funding and competitive opportunities have distinct requirements.",
    uses: [
      "Tribe-led service planning",
      "Capital and accessible vehicles",
      "Operations and administration",
    ],
    note: "Planning lens: work with tribal planners and young residents on destination and schedule priorities. Formula allocations use National Transit Database information; competitive requirements depend on the applicable notice.",
    source: "https://www.transit.dot.gov/funding/tribal-governments",
    sourceLabel: "FTA · Tribal government guidance",
  },
  {
    id: "appalachian",
    code: "FTA SECTION 5311(c)(3)",
    title: "Appalachian Transit Assistance",
    icon: Mountain,
    accent: "#527b4b",
    metric: "3%",
    metricLabel: "National Section 5311 set-aside",
    description:
      "The Appalachian Development Public Transportation Assistance Program (ADTAP) provides additional rural transit funding to eligible states in the Appalachian region.",
    eligibility:
      "The 13 Appalachian states receive formula allocations for eligible service areas within the defined Appalachian region. Rural service-area and Section 5311 requirements apply. Local governments, nonprofits, and transit operators may participate as subrecipients.",
    uses: [
      "Public transit vehicles and facilities",
      "Operations and service planning",
      "Connections to essential services",
    ],
    note: "The 3% is a national set-aside under Section 5311(c)(1)(B), not a requirement for each state’s allocation. Planning lens: assess mountain routes to healthcare, employment, education, and recreation.",
    source:
      "https://www.transit.dot.gov/funding/grants/fact-sheet-formula-grants-rural-areas",
    sourceLabel: "FTA · Rural funding and 3% set-aside",
    additionalSource:
      "https://www.transit.dot.gov/sites/fta.dot.gov/files/2024-09/C9040.1H-Circular-11-01-2024.pdf",
    additionalSourceLabel: "FTA · ADTAP eligibility, Chapter VIII (PDF)",
  },
  {
    id: "ferry",
    code: "IIJA SECTION 71103",
    title: "Ferry Service for Rural Communities",
    icon: Ship,
    accent: "#0b809b",
    metric: "Rural ferry",
    metricLabel: "Competitive essential-service funding",
    description:
      "Supports essential ferry connections for qualifying rural communities, including places separated by water. Island or territory status alone does not establish eligibility.",
    eligibility:
      "States and U.S. territories with eligible ferry service may apply; local governments and tribes may be subrecipients. The FY 2026 notice requires historical scheduled service between rural areas and specific route-distance and funding conditions.",
    uses: [
      "Ferries, terminals, and equipment",
      "Eligible service planning",
      "Operating assistance",
    ],
    note: "Planning lens: evaluate walk-on access, onward transit, and a usable return sailing for young riders. Check the official notice for historical service dates and the separate over-50 / over-15-mile funding criteria.",
    source:
      "https://www.transit.dot.gov/funding/grants/grant-programs/ferry-service-rural-communities-program-iija-ss-71103",
    sourceLabel: "FTA · Rural Ferry Program",
    additionalSource:
      "https://www.transit.dot.gov/notices-funding/fy-2026-notice-funding-opportunity-passenger-ferry-program-electric-or-low-emitting",
    additionalSourceLabel: "FTA · FY 2026 eligibility notice (closed)",
  },
];

export default function Programs({ zones, onSelectZone }) {
  return (
    <div className="programs-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">FUNDING & POLICY</p>
          <h1>Federal programs</h1>
          <p className="text-muted">
            Connect youth mobility and rural transit needs with federal funding
            pathways.
          </p>
        </div>
        <a
          className="button button-secondary"
          href="https://www.transit.dot.gov/rural"
          target="_blank"
          rel="noreferrer"
        >
          FTA resource center <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="panel program-intro">
        <span className="program-intro-icon">
          <Landmark size={25} />
        </span>
        <div>
          <h2>A starting point for pre-development</h2>
          <p>
            Explore five federal pathways, then open a related sample zone to
            review local conditions. Program summaries link to official Federal
            Transit Administration guidance.
          </p>
        </div>
        <span className="tag">5 reference guides</span>
      </div>

      <div className="program-grid">
        {programCards.map((program) => {
          const Icon = program.icon;
          const related = zones.filter((zone) =>
            program.id === "appalachian"
              ? zone.region === "Appalachia"
              : zone.programs.includes(program.id),
          );
          return (
            <article className="panel program-card" key={program.id}>
              <div className="program-card-top">
                <span
                  className="program-icon"
                  style={{
                    color: program.accent,
                    backgroundColor: `${program.accent}10`,
                  }}
                >
                  <Icon size={23} />
                </span>
                <span className="eyebrow">{program.code}</span>
              </div>
              <h2>{program.title}</h2>
              <p className="text-muted program-description">
                {program.description}
              </p>
              <div className="program-metric">
                <strong style={{ color: program.accent }}>
                  {program.metric}
                </strong>
                <span>{program.metricLabel}</span>
              </div>
              <h3>Who is eligible?</h3>
              <p className="program-copy">{program.eligibility}</p>
              <h3>What it supports</h3>
              <ul className="program-uses">
                {program.uses.map((use) => (
                  <li key={use}>{use}</li>
                ))}
              </ul>
              <div className="program-note">
                <Info size={15} />
                <p>{program.note}</p>
              </div>
              <div className="related-zones">
                <h3>
                  Related sample zones{" "}
                  <span className="text-muted">({related.length})</span>
                </h3>
                <div className="related-zone-links">
                  {related.length === 0 && (
                    <p
                      className="text-muted"
                      style={{ fontSize: 12, lineHeight: 1.8 }}
                    >
                      {program.id === "ferry"
                        ? "No island/ferry scenario in this demo."
                        : "No related sample zones."}
                    </p>
                  )}
                  {related.slice(0, 3).map((zone) => (
                    <button
                      key={zone.id}
                      className="related-zone-button"
                      onClick={() => onSelectZone(zone)}
                    >
                      <span>{zone.name}</span>
                      <span>
                        {zone.stateCode} <ArrowUpRight size={14} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <a
                className="program-source"
                href={program.source}
                target="_blank"
                rel="noreferrer"
              >
                {program.sourceLabel}
                <ArrowUpRight size={15} />
              </a>
              {program.additionalSource && (
                <a
                  className="program-source"
                  href={program.additionalSource}
                  target="_blank"
                  rel="noreferrer"
                >
                  {program.additionalSourceLabel}
                  <ArrowUpRight size={15} />
                </a>
              )}
            </article>
          );
        })}
      </div>

      <div className="panel program-footer-note">
        <Info size={19} />
        <div>
          <strong>Reference guidance · reviewed October 2026</strong>
          <p>
            Related zones and their funding measures are fictional examples, not
            eligibility determinations or confirmed awards. Check current FTA
            guidance, funding notices, and state or tribal procedures before
            developing an application. Rural eligibility uses Census-defined
            service areas; a county population alone does not determine
            eligibility.
          </p>
        </div>
      </div>
    </div>
  );
}
