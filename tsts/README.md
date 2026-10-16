# Transit Scarcity Tracking System (TSTS)

An English-language, responsive demonstration workspace for state DOT, county, and tribal transit planners. TSTS connects rural mobility research with adolescent access to healthcare, urban opportunities, and nature. It brings sample service gaps, landscape constraints, community reports, and project comparisons into one place to support pre-development research.

Built with React 19, Vite, Leaflet/react-leaflet, Recharts, Lucide, and responsive CSS. This is a client-side demonstration with no real backend, live transportation feeds, or satellite processing.

## Run locally

Node.js 22.12+ (or 24+) is required. From the `tsts` directory:

```sh
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173/`. Keep the terminal running; press `Ctrl+C` to stop. For a production build, run `npm run build`; use `npm run preview` to inspect it.

## Included

- Dashboard: filter-aware youth and resident access indicators, scarcity map, needs-based watchlist, region comparison, severity chart, and recent report activity.
- Map: street / Esri World Imagery layers, severity markers, optional marker sizing by adolescent population, simulated terrain difficulty polygons, and a zone detail panel. Selecting a zone reveals three fictional destinations: healthcare, an urban service, and nature. Dashed connections illustrate geographic relationships; they are not routes or routing results. Markers are keyboard accessible.
- Youth access: adjustable travel-time, walking, evening-return, and accessible-boarding criteria; explained destination assessments; demographic context; low-ridership hypotheses; evidence gaps; and infrastructure constraints.
- Service planning: per-zone trip-intensity scenarios, illustrative operating and capital costs, potential resident and adolescent beneficiaries, and sortable project comparisons with CSV export.
- Citizen reports: county selection, six issue categories, optional fictional contact, duplicate detection, keyword/link checks, and browser-local rate limiting. Planner review supports approval, rejection, and linking to zones.
- Registry: search, severity/region/state/status filters, sortable population/access/cost columns, and CSV export that preserves the displayed filtering and sorting.
- Federal programs: five reference guides covering Section 5311, its intercity-bus requirement, Tribal Transit, Appalachian transit assistance, and rural ferry service, with official FTA source links and related sample zones. No island/ferry zone is seeded.
- Zone profiles: landscape, sample population and service, youth access, healthcare travel times, terrain grades, infrastructure, causes, baseline service proposals, evidence gaps, illustrative measures/funding, approved linked reports, and editable planning status.

Reports, planning status, and Youth access service scenarios persist in browser localStorage. A fourth report submission within ten minutes is retained as Filtered for review, not sent to any agency. Storage is local to each origin/browser. The application has no backend or built-in authentication; hosted access controls are separate. Clear this site's browser storage to reset the demo.

## Your location

On **Interactive map**, click **Locate me** and allow the browser's location request. A blue marker shows your device position and a translucent circle shows the reported accuracy radius. Use **Update location**, **Recenter**, or **Clear** as needed. Location access requires HTTPS or localhost and enabled browser/device location permissions; denied access, unavailable positioning, and timeout errors have retry guidance. The feature uses a single position request rather than continuous tracking.

Location stays in component memory while the map is open. It is not written to localStorage, included in CSV exports or citizen reports, or sent to a TSTS backend. Clearing it, leaving the map, or refreshing removes it. Browser geolocation and the selected map tile provider use their own services; loading tiles reveals the viewed map area to OpenStreetMap or Esri. The nearest **visible sample zone** is calculated locally with a great-circle distance to its fictional center. It is not a route distance, transit stop lookup, or a statement about real service near you. All existing planning data remains synthetic.

Browser API reference: [MDN Geolocation.getCurrentPosition](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition).

## Planning assumptions

The planning cohort is **adolescents ages 12–17**. All population figures are synthetic area-level aggregates from the October 2026 fixture. They contain no individual adolescent, household, or school locations. Zone population, residents with limited transit, residents without reliable transportation, and adolescents overlap; do not add these groups together.

Youth access gaps are fixed baseline estimates. Changing destination criteria changes the three destination assessments, not population counts or the baseline needs score. The default screen checks a one-way transit trip of at most 60 minutes, walking access of at most 15 minutes, a same-day return, and service on at least three days per week. Evening returns and accessible boarding can be required separately. No connection or no usable return is Unavailable; a failed time, walking, service-day, evening, or accessibility criterion is Limited. Reachable is a demonstration screen, not a safety assessment for a child.

Healthcare is represented by a fictional primary-care destination for routine visits, not emergency or specialist care. Transit and private-vehicle travel times are separate one-way estimates. Missing transit is stored as `null` and displayed as unavailable, not zero minutes. Map destination offsets do not generate these travel-time estimates.

The illustrative needs score uses three normalized components: 45% youth without independent access as a share of adolescents, 25% residents without reliable transport as a share of all residents, and 30% healthcare transit time divided by 120 minutes. Healthcare burden is capped at 100%, with unavailable transit assigned 100%. The score supports comparison; it is not a validated allocation or eligibility method. Low boardings alone do not establish low travel demand. Age, adult occupation shares, schedule gaps, alternative modes, and unmet needs provide hypotheses for community validation.

The Youth access sandbox saves added weekly one-way trips per zone. Its project comparison and export use those saved scenarios. Registry costs and zone-profile proposals retain the **baseline sample scenario**. Scenario changes do not change existing-service fixtures, needs scores, or baseline population gaps. Operating costs scale linearly with added trips; potential beneficiaries scale with the square root of the trip ratio and are capped by the sample limited-service and adolescent populations. Capital is fixed for an active scenario. Annual cost per resident excludes capital; first-year cost includes it. These are transparent assumptions, not forecasts of actual riders, engineering estimates, or funding commitments.

## Demonstration boundaries

All twelve zones, demographic and service values, destination names, reports, evidence ratings, measures, and terrain grades are fictional. Real counties provide geographic context; populations represent the sample zones, not official county populations. Tribal scenarios do not describe actual tribal services or imply endorsement. Terrain polygons are seeded illustrative patterns; no satellite processing, measured terrain analysis, live GTFS, routing, or eligibility determination occurs. Maps and Google Fonts require internet access. The UI retains system-font fallbacks.

The reference cards distinguish rural service-area eligibility from county population, include the intercity certification exception, identify the Appalachian 3% as a national set-aside, and explain that island or territory status alone does not establish rural ferry eligibility. Consult the linked FTA guidance and current funding notices for an actual application.

Official references:

- https://www.transit.dot.gov/rural-formula-grants-5311
- https://www.transit.dot.gov/sites/fta.dot.gov/files/2024-09/C9040.1H-Circular-11-01-2024.pdf
- https://www.transit.dot.gov/funding/tribal-governments
- https://www.transit.dot.gov/funding/grants/fact-sheet-formula-grants-rural-areas
- https://www.transit.dot.gov/funding/grants/grant-programs/ferry-service-rural-communities-program-iija-ss-71103
- https://www.transit.dot.gov/notices-funding/fy-2026-notice-funding-opportunity-passenger-ferry-program-electric-or-low-emitting

## Verification

Run `npm test` for automated data and logic checks. Tests cover seed integrity, population and demographic consistency, fictional destination completeness, missing transit versus valid zero durations, access-screen thresholds and explanations, priority-score weights, scenario sensitivity and benefit caps, zero-trip handling, report filtering, duplicate detection, rate limits, and storage recovery. These tests do not validate real transportation conditions or perform end-to-end browser testing. `npm run build` checks the production bundle.

## Project layout

`src/App.jsx` handles the application shell, dashboard, registry, profiles, and persistence. `src/components` contains the map, Youth access explorer and project comparison, mobility profile summary, reports workflow, and program cards. `src/data.js` provides the original zone/report seeds; `src/mobilityData.js` contains synthetic mobility fixtures and the independently tested assessment, scoring, and scenario functions. `src/reportLogic.js` contains the report-filter rules. Tests live in `tests/`. `.openai/hosting.json` declares the private Sites deployment.
