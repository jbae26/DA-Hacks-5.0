import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Building2,
  BusFront,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Compass,
  ExternalLink,
  FlaskConical,
  Globe2,
  Info,
  LayoutDashboard,
  LocateFixed,
  Map,
  MapPin,
  Menu,
  MessageSquare,
  Mountain,
  Network,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  UsersRound,
  TreePine,
  HeartPulse,
  X,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { zones as seedZones, initialReports, regions } from "./data.js";
import TransitMap from "./components/TransitMap.jsx";
import Reports from "./components/Reports.jsx";
import Programs from "./components/Programs.jsx";
import YouthPlanning from "./components/YouthPlanning.jsx";
import ZoneMobilitySummary from "./components/ZoneMobilitySummary.jsx";
import { mobilityByZone, priorityScore } from "./mobilityData.js";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "map", label: "Interactive map", icon: Map },
  { id: "youth", label: "Youth access", icon: UsersRound },
  { id: "reports", label: "Citizen reports", icon: MessageSquare },
  { id: "zones", label: "Zones registry", icon: ClipboardList },
  { id: "programs", label: "Federal programs", icon: Building2 },
];
const COLORS = { High: "#ce6558", Medium: "#d8a34d", Low: "#4d928b" };
const num = (n) => new Intl.NumberFormat("en-US").format(n);
const date = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
function readSaved(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(fallback)
      ? Array.isArray(value) &&
        value.every(
          (x) =>
            x &&
            [
              "id",
              "description",
              "county",
              "state",
              "category",
              "createdAt",
            ].every((k) => typeof x[k] === "string") &&
            ["Pending", "Approved", "Filtered", "Rejected"].includes(x.status),
        )
        ? value
        : fallback
      : value && typeof value === "object" && !Array.isArray(value)
        ? Object.fromEntries(
            Object.entries(value).filter(([, v]) =>
              [
                "Needs assessment",
                "Under review",
                "Planning underway",
              ].includes(v),
            ),
          )
        : fallback;
  } catch {
    return fallback;
  }
}
function useSaved(key, fallback, onError) {
  const [state, setState] = useState(() => readSaved(key, fallback));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      onError?.(
        "Browser storage is unavailable. Changes will last only for this session.",
      );
    }
  }, [key, state]);
  return [state, setState];
}
function exportZones(zones) {
  const fields = [
    ["Zone", "name"],
    ["State", "state"],
    ["County", "county"],
    ["Region", "region"],
    ["Population", "population"],
    ["Severity", "severity"],
    ["Nearest stop (mi)", "distance"],
    ["Weekly one-way trips", "weeklyService"],
    ["Terrain difficulty", "terrainGrade"],
    ["Status", "status"],
    ["Adolescent residents (ages 12-17)", "youthCount"],
    ["Youth without independent access", "youthGap"],
    ["Residents without reliable transport", "unreliableResidents"],
    ["Residents with limited transit", "limitedServiceResidents"],
    ["Healthcare transit minutes (one way)", "healthcareMinutesTransit"],
    ["Baseline annual operating cost USD", "annualOperatingCost"],
    ["Illustrative needs score /100", "priority"],
  ];
  const quote = (value) =>
    '"' + String(value ?? "").replaceAll('"', '""') + '"';
  const csv = [
    fields.map(([name]) => quote(name)).join(","),
    ...zones.map((z) =>
      fields
        .map(([, key]) =>
          quote(
            key === "healthcareMinutesTransit" && z[key] === null
              ? "No usable trip"
              : z[key],
          ),
        )
        .join(","),
    ),
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "TSTS-sample-zones.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Severity({ value }) {
  return (
    <span className={`badge severity-${value?.toLowerCase()}`}>
      <span />
      {value}
    </span>
  );
}
function Dialog({ title, children, onClose, wide = false }) {
  const ref = useRef();
  useEffect(() => {
    ref.current.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      className={`dialog ${wide ? "dialog-wide" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="dialog-header">
        <div>
          <span className="eyebrow">TSTS PLANNING WORKSPACE</span>
          <h2>{title}</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
      </div>
      <div className="dialog-body">{children}</div>
    </dialog>
  );
}
function Filters({
  severity,
  setSeverity,
  region,
  setRegion,
  state,
  setState,
  states,
  children,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-label">
        <SlidersHorizontal size={16} /> Filters
      </div>
      <label className="select-wrap">
        <span className="sr-only">Severity</span>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="All">All severities</option>
          {["High", "Medium", "Low"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <ChevronDown size={14} />
      </label>
      <label className="select-wrap">
        <span className="sr-only">Region</span>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="All">All regions</option>
          {regions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <ChevronDown size={14} />
      </label>
      <label className="select-wrap">
        <span className="sr-only">State</span>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="All">All states</option>
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <ChevronDown size={14} />
      </label>
      {(severity !== "All" || region !== "All" || state !== "All") && (
        <button
          className="text-button"
          onClick={() => {
            setSeverity("All");
            setRegion("All");
            setState("All");
          }}
        >
          Clear filters
        </button>
      )}
      <div className="filter-trailing">{children}</div>
    </div>
  );
}
function ZoneDetails({
  zone,
  reports,
  onStatusChange,
  onPrograms,
  onYouth,
  compact = false,
}) {
  const linked = reports.filter(
    (r) => r.zoneId === zone.id && r.status === "Approved",
  );
  return (
    <div className={`zone-details ${compact ? "zone-details-compact" : ""}`}>
      <div className="zone-title">
        <div>
          <div className="eyebrow">{zone.region} · SAMPLE ZONE</div>
          <h2>{zone.name}</h2>
          <p>
            <MapPin size={14} />
            {zone.county}, {zone.state}
          </p>
        </div>
        <Severity value={zone.severity} />
      </div>
      <div className="zone-stat-grid">
        <div>
          <span>Population</span>
          <strong>{num(zone.population)}</strong>
        </div>
        <div>
          <span>Nearest stop</span>
          <strong>
            {zone.distance}
            <small> mi</small>
          </strong>
        </div>
        <div>
          <span>Weekly service</span>
          <strong>
            {zone.weeklyService}
            <small> trips</small>
          </strong>
        </div>
        <div>
          <span>Terrain difficulty</span>
          <strong className="terrain-value">{zone.terrainGrade}</strong>
        </div>
      </div>
      <p className="detail-caption">
        Population and service values describe the fictional zone. Weekly
        service is one-way trips.
      </p>
      <section>
        <h3>
          <BusFront size={17} />
          Transit access
        </h3>
        <p>
          The nearest sample stop is <strong>{zone.nearestStop}</strong>,{" "}
          {zone.distance} miles from the zone center.{" "}
          {zone.weeklyService === 0
            ? "No scheduled transit service operates within this sample zone."
            : `The sample zone has ${zone.weeklyService} one-way service trips per week.`}
        </p>
      </section>
      <section>
        <h3>
          <Mountain size={17} />
          Landscape & implementation
        </h3>
        <p>{zone.landscape}</p>
        <div className="terrain-metrics">
          <span>
            Elevation <strong>{zone.elevation}</strong>
          </span>
          <span>
            Slope <strong>{zone.slope}</strong>
          </span>
        </div>
        <div className="small-demo">
          <FlaskConical size={15} />
          <span>
            <strong>{zone.terrainGrade} difficulty</strong> · Simulated skyview
            analysis. Illustrative terrain grades; no satellite processing or
            measured elevation analysis.
          </span>
        </div>
      </section>
      <ZoneMobilitySummary zone={zone} onExplore={onYouth} />
      <section>
        <h3>What drives the scarcity</h3>
        <ul className="cause-list">
          {zone.causes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Existing measures & funding</h3>
        <ul className="cause-list">
          {zone.measures.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <button className="text-button" onClick={onPrograms}>
          Explore related federal programs <ArrowUpRight size={14} />
        </button>
      </section>
      <section>
        <h3>
          <MessageSquare size={17} />
          Linked citizen reports{" "}
          <span className="count-pill">{linked.length}</span>
        </h3>
        {linked.length ? (
          linked.map((r) => (
            <article className="linked-report" key={r.id}>
              <div>
                <strong>{r.category}</strong>
                <span>{date(r.createdAt)}</span>
              </div>
              <p>{r.description}</p>
              <span className="approved-text">
                <ShieldCheck size={12} />
                Approved report · Sample / browser-local
              </span>
            </article>
          ))
        ) : (
          <p className="muted-box">
            No approved reports are linked to this zone yet.
          </p>
        )}
      </section>
      <label className="status-field">
        Planning status
        <select
          value={zone.status}
          onChange={(e) => onStatusChange(zone.id, e.target.value)}
        >
          {["Needs assessment", "Under review", "Planning underway"].map(
            (s) => (
              <option key={s}>{s}</option>
            ),
          )}
        </select>
      </label>
    </div>
  );
}

function Dashboard({
  zones,
  allZones,
  reports,
  onSelect,
  onNavigate,
  filters,
}) {
  const high = zones.filter((z) => z.severity === "High");
  const far = zones.filter((z) => z.distance > 10);
  const pending = reports.filter(
    (r) =>
      r.status === "Pending" &&
      zones.some(
        (z) =>
          z.id === r.zoneId ||
          (!r.zoneId && z.county === r.county && z.state === r.state),
      ),
  );
  const chart = ["High", "Medium", "Low"].map((name) => ({
    name,
    value: zones.filter((z) => z.severity === name).length,
  }));
  const priority = [...zones]
    .sort(
      (a, b) =>
        priorityScore(mobilityByZone[b.id]).score -
          priorityScore(mobilityByZone[a.id]).score || b.distance - a.distance,
    )
    .slice(0, 4);
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR TRANSIT PLANNING WORKSPACE</div>
          <h1>Planning overview</h1>
          <p>
            Connect adolescents to healthcare, urban opportunities, and the
            outdoors.
          </p>
        </div>
        <button
          className="button button-secondary"
          onClick={() => exportZones(zones)}
        >
          <ArrowDownToLine size={16} />
          Export snapshot
        </button>
      </div>
      <div className="demo-banner">
        <div className="demo-icon">
          <FlaskConical size={18} />
        </div>
        <p>
          <strong>Evidence for the work before the route.</strong> A
          demonstration of youth access and rural mobility with synthetic
          population, service, and cost data.
        </p>
        <span className="demo-tag">Sample data</span>
      </div>
      {filters}
      <div className="kpi-grid">
        {[
          {
            label: "High-severity zones",
            value: high.length,
            icon: LocateFixed,
            cls: "coral",
            foot: `of ${zones.length} tracked zones`,
            detail: "Priority for assessment",
          },
          {
            label: "Youth without independent access",
            value: num(zones.reduce((s, z) => s + z.youthGap, 0)),
            icon: Users,
            cls: "blue",
            foot: "Ages 12–17 · baseline estimate",
            detail: "Sample youth access gap",
          },
          {
            label: "Without reliable transport",
            value: num(zones.reduce((s, z) => s + z.unreliableResidents, 0)),
            icon: BusFront,
            cls: "amber",
            foot: "Residents · all age groups",
            detail: "Sample reliable transport gap",
          },
          {
            label: "Residents with limited transit",
            value: num(
              zones.reduce((s, z) => s + z.limitedServiceResidents, 0),
            ),
            icon: Users,
            cls: "teal",
            foot: "Overlaps with other population groups",
            detail: "Sample service coverage gap",
          },
        ].map((k) => (
          <article className={`kpi-card ${k.cls}`} key={k.label}>
            <div className="kpi-top">
              <span>{k.label}</span>
              <k.icon size={18} />
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-footer">
              <span>
                <i />
                {k.foot}
              </span>
              {k.action && (
                <button
                  className="icon-button"
                  onClick={k.action}
                  aria-label="Review pending reports"
                >
                  <ArrowUpRight size={15} />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="dashboard-context-strip">
        <span>
          <MessageSquare size={13} />
          <strong>{pending.length}</strong> pending citizen reports
        </span>
        <span>
          <MapPin size={13} />
          <strong>{far.length}</strong> zones without a stop within 10 mi
        </span>
        <span>
          <Info size={13} />
          Population groups overlap; counts are not additive.
        </span>
      </div>
      <div className="youth-dashboard-bridge">
        <div className="youth-bridge-symbol">
          <Building2 size={29} />
          <span />
          <TreePine size={29} />
        </div>
        <div className="youth-bridge-copy">
          <h2>A bridge between city & nature.</h2>
          <p>
            Can a young person reach a clinic, an opportunity, or a trail—and
            get home without a private ride?
          </p>
        </div>
        <div className="youth-bridge-stat">
          <strong>{num(zones.reduce((s, z) => s + z.youthCount, 0))}</strong>
          <span>adolescent residents · sample</span>
        </div>
        <button
          className="button button-primary"
          onClick={() => onNavigate("youth")}
        >
          Explore youth access <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="dashboard-map-grid">
        <section className="panel map-card">
          <div className="panel-heading">
            <div>
              <h2>Transit scarcity across the U.S.</h2>
              <p>A national view of communities with limited access.</p>
            </div>
            <button className="text-button" onClick={() => onNavigate("map")}>
              Explore map <ArrowUpRight size={15} />
            </button>
          </div>
          <TransitMap zones={zones} onSelectZone={onSelect} compact />
          <div className="map-footnote">
            <span>
              <span className="live-dot" />
              {zones.length} sample zones ·{" "}
              {new Set(zones.map((z) => z.region)).size} planning regions
            </span>
            <span>Click a zone to explore</span>
          </div>
        </section>
        <section className="panel watchlist">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">WHERE TO FOCUS</div>
              <h2>Priority watchlist</h2>
            </div>
            <span className="soft-icon">
              <LocateFixed size={18} />
            </span>
          </div>
          <p className="watchlist-intro">
            Review youth, household, and healthcare access needs together.
          </p>
          <div className="watchlist-items">
            {priority.slice(0, 3).map((z, i) => (
              <button
                key={z.id}
                className="watchlist-item"
                onClick={() => onSelect(z)}
              >
                <div className="watchlist-number">0{i + 1}</div>
                <div>
                  <div className="watchlist-name">
                    {z.name}
                    <ChevronRight size={15} />
                  </div>
                  <p>
                    {z.county}, {z.stateCode}
                  </p>
                  <div className="watchlist-meta">
                    <Severity value={z.severity} />
                    <span>Needs score {z.priority}/100</span>
                  </div>
                </div>
              </button>
            ))}
            {!priority.length && (
              <div className="empty-state">No zones match these filters.</div>
            )}
          </div>
          <button
            className="watchlist-link"
            onClick={() => onNavigate("zones")}
          >
            View all scarcity zones <ArrowRight size={16} />
          </button>
        </section>
      </div>
      <div className="dashboard-bottom">
        <section className="panel region-panel">
          <div className="panel-heading">
            <div>
              <h2>Youth access gaps by region</h2>
              <p>Adolescents without independent access.</p>
            </div>
            <Globe2 size={18} className="muted-icon" />
          </div>
          <div className="region-list">
            {regions.map((region) => {
              const list = zones.filter((z) => z.region === region);
              const pop = list.reduce((s, z) => s + z.youthGap, 0);
              const max = Math.max(
                1,
                ...regions.map((r) =>
                  zones
                    .filter((z) => z.region === r)
                    .reduce((s, z) => s + z.youthGap, 0),
                ),
              );
              return (
                <div className="region-row" key={region}>
                  <div>
                    <span>{region}</span>
                    <strong>
                      {num(pop)} <small>people</small>
                    </strong>
                  </div>
                  <div className="region-bar">
                    <span style={{ width: `${(pop / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="panel severity-panel">
          <div className="panel-heading">
            <div>
              <h2>Severity distribution</h2>
              <p>Every zone, in perspective.</p>
            </div>
          </div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={chart.filter((x) => x.value)}
                  dataKey="value"
                  innerRadius={51}
                  outerRadius={67}
                  paddingAngle={4}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chart
                    .filter((x) => x.value)
                    .map((x) => (
                      <Cell key={x.name} fill={COLORS[x.name]} />
                    ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} zones`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <strong>{zones.length}</strong>
              <span>total zones</span>
            </div>
          </div>
          <div className="severity-legend">
            {chart.map((c) => (
              <div key={c.name}>
                <span>
                  <i style={{ background: COLORS[c.name] }} />
                  {c.name}
                </span>
                <strong>{c.value}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Your latest community signals.</p>
            </div>
            <Activity size={18} className="muted-icon" />
          </div>
          <div className="activity-list">
            {[...reports]
              .filter((r) =>
                zones.some(
                  (z) =>
                    z.id === r.zoneId ||
                    (!r.zoneId && z.county === r.county && z.state === r.state),
                ),
              )
              .sort(
                (a, b) =>
                  new Date(b.updatedAt || b.createdAt) -
                  new Date(a.updatedAt || a.createdAt),
              )
              .slice(0, 3)
              .map((r) => (
                <button
                  className="activity-item"
                  key={r.id}
                  onClick={() => onNavigate("reports")}
                >
                  <span
                    className={`activity-icon ${r.status === "Approved" ? "is-approved" : ""}`}
                  >
                    {r.status === "Approved" ? (
                      <Check size={15} />
                    ) : (
                      <MessageSquare size={15} />
                    )}
                  </span>
                  <div>
                    <strong>
                      {r.status === "Approved"
                        ? "Report approved"
                        : r.status === "Filtered"
                          ? "Report flagged for review"
                          : "Citizen report received"}
                    </strong>
                    <p>
                      {allZones.find((z) => z.id === r.zoneId)?.name ||
                        r.county}
                    </p>
                    <span>
                      {date(r.updatedAt || r.createdAt)} · {r.category}
                    </span>
                  </div>
                </button>
              ))}
          </div>
          <button
            className="text-button activity-link"
            onClick={() => onNavigate("reports")}
          >
            Open review queue <ArrowRight size={14} />
          </button>
        </section>
      </div>
      <div className="planning-note">
        <ShieldCheck size={18} />
        <p>
          <strong>Built for the work before the route.</strong> A shared
          starting point for state, county, and tribal transportation planning.
        </p>
        <button className="text-button" onClick={() => onNavigate("programs")}>
          Find federal support <ArrowUpRight size={14} />
        </button>
      </div>
    </>
  );
}
function Registry({ zones, onSelect, onExport, filters }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "severity", asc: true });
  const [status, setStatus] = useState("All");
  const visible = useMemo(
    () =>
      zones
        .filter(
          (z) =>
            (status === "All" || z.status === status) &&
            `${z.name} ${z.state} ${z.county}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) => {
          let x = a[sort.key],
            y = b[sort.key];
          if (sort.key === "severity") {
            x = ["High", "Medium", "Low"].indexOf(x);
            y = ["High", "Medium", "Low"].indexOf(y);
          }
          if (x === null || y === null)
            return x === y ? 0 : x === null ? 1 : -1;
          return (
            (typeof x === "number"
              ? x - y
              : String(x).localeCompare(String(y))) * (sort.asc ? 1 : -1)
          );
        }),
    [zones, query, sort, status],
  );
  const columns = [
    ["Zone / county", "name"],
    ["State", "state"],
    ["Population", "population"],
    ["Youth access gap", "youthGap"],
    ["Healthcare transit", "healthcareMinutesTransit"],
    ["Baseline annual ops.", "annualOperatingCost"],
    ["Severity", "severity"],
    ["Nearest stop", "distance"],
    ["Terrain", "terrainGrade"],
    ["Status", "status"],
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">A SHARED PLANNING INVENTORY</div>
          <h1>Zones registry</h1>
          <p>Explore and prioritize every sample transit scarcity zone.</p>
        </div>
        <button
          className="button button-primary"
          onClick={() => onExport(visible)}
        >
          <ArrowDownToLine size={16} />
          Export CSV
        </button>
      </div>
      {filters}
      <section className="panel registry-panel">
        <div className="table-tools">
          <label className="search-input">
            <Search size={17} />
            <input
              aria-label="Search zones"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search zone, county, or state…"
            />
          </label>
          <label className="select-wrap">
            <span className="sr-only">Planning status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All statuses</option>
              {["Needs assessment", "Under review", "Planning underway"].map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </select>
            <ChevronDown size={14} />
          </label>
          <span className="table-count">{visible.length} zones</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map(([label, key]) => (
                  <th
                    key={key}
                    aria-sort={
                      sort.key === key
                        ? sort.asc
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <button
                      onClick={() =>
                        setSort({
                          key,
                          asc: sort.key === key ? !sort.asc : true,
                        })
                      }
                    >
                      {label}
                      <span>
                        {sort.key === key ? (sort.asc ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
                <th>
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((z) => (
                <tr key={z.id}>
                  <td>
                    <button className="zone-cell" onClick={() => onSelect(z)}>
                      <strong>{z.name}</strong>
                      <span>{z.county}</span>
                    </button>
                  </td>
                  <td>{z.stateCode}</td>
                  <td className="tabular">{num(z.population)}</td>
                  <td className="youth-count-cell">
                    {num(z.youthGap)}
                    <small>of {num(z.youthCount)} adolescents</small>
                  </td>
                  <td className="tabular">
                    {z.healthcareMinutesTransit === null
                      ? "No usable trip"
                      : `${z.healthcareMinutesTransit} min`}
                  </td>
                  <td className="tabular">
                    ${num(z.annualOperatingCost)}
                    <small className="text-muted"> / yr</small>
                  </td>
                  <td>
                    <Severity value={z.severity} />
                  </td>
                  <td className="tabular">
                    {z.distance} <span className="text-muted">mi</span>
                  </td>
                  <td>
                    <span className="terrain-cell">
                      <Mountain size={14} />
                      {z.terrainGrade}
                    </span>
                  </td>
                  <td>
                    <span className="status-tag">{z.status}</span>
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      onClick={() => onSelect(z)}
                      aria-label={`View ${z.name}`}
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <div className="empty-state">
              <Search size={28} />
              <h3>No zones found</h3>
              <p>Try a different search or clear your filters.</p>
            </div>
          )}
        </div>
        <div className="table-footer">
          <span>Showing {visible.length} sample zones</span>
          <span>
            <Info size={13} />
            Fictional planning data · Not for operational decisions
          </span>
        </div>
      </section>
    </>
  );
}
export default function App() {
  const pageFromHash = () =>
    NAV.some((n) => n.id === location.hash.slice(1))
      ? location.hash.slice(1)
      : "dashboard";
  const [page, setPage] = useState(pageFromHash);
  const [toast, setToast] = useState("");
  const [reports, setReports] = useSaved(
    "tsts-reports-v1",
    initialReports,
    setToast,
  );
  const [zoneStatus, setZoneStatus] = useSaved(
    "tsts-zone-status-v1",
    {},
    setToast,
  );
  const zones = useMemo(
    () =>
      seedZones.map((z) => {
        const m = mobilityByZone[z.id];
        return {
          ...z,
          status: zoneStatus[z.id] || z.status,
          youthCount: m.adolescents,
          youthGap: m.noIndependentYouth,
          unreliableResidents: m.unreliableResidents,
          limitedServiceResidents: m.limitedServiceResidents,
          healthcareMinutesTransit: m.healthcareMinutesTransit,
          annualOperatingCost: m.scenario.annualOperatingCost,
          priority: priorityScore(m).score,
        };
      }),
    [zoneStatus],
  );
  const [severity, setSeverity] = useState("All"),
    [region, setRegion] = useState("All"),
    [state, setState] = useState("All");
  const [youthZoneId, setYouthZoneId] = useState(null);
  const [detailId, setDetailId] = useState(null),
    [help, setHelp] = useState(false),
    [mobileNav, setMobileNav] = useState(false),
    [globalSearch, setGlobalSearch] = useState(""),
    [mapZone, setMapZone] = useState(null);
  const mainRef = useRef();
  const sidebarRef = useRef();
  const mapDetailRef = useRef();
  useEffect(() => {
    if (mapZone && page === "map") {
      mapDetailRef.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width:1050px)").matches)
        mapDetailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  }, [mapZone, page]);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width:760px)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width:760px)");
    const onChange = () => setIsMobile(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  useEffect(() => {
    if (!mobileNav || !isMobile) return;
    const el = sidebarRef.current;
    el.querySelector("button")?.focus();
    const handler = (e) => {
      if (e.key === "Escape") {
        setMobileNav(false);
        document.querySelector(".mobile-menu")?.focus();
      }
      if (e.key === "Tab") {
        const items = [...el.querySelectorAll("button,a")].filter(
          (x) => !x.disabled,
        );
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileNav, isMobile]);
  useEffect(() => {
    const handler = () => setPage(pageFromHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const navigate = (id) => {
    location.hash = id;
    setPage(id);
    setMobileNav(false);
    setGlobalSearch("");
    window.scrollTo({ top: 0, behavior: "instant" });
    mainRef.current?.focus();
  };
  const visible = zones.filter(
    (z) =>
      (severity === "All" || z.severity === severity) &&
      (region === "All" || z.region === region) &&
      (state === "All" || z.state === state),
  );
  const states = [...new Set(zones.map((z) => z.state))].sort();
  const detail = zones.find((z) => z.id === detailId);
  const selectedMap = visible.find((z) => z.id === mapZone);
  const pending = reports.filter((r) => r.status === "Pending").length;
  const filters = (
    <Filters
      {...{ severity, setSeverity, region, setRegion, state, setState, states }}
    >
      <span className="sample-indicator">
        <span />
        {visible.length} sample zones
      </span>
    </Filters>
  );
  const updateStatus = (id, value) => {
    setZoneStatus((s) => ({ ...s, [id]: value }));
    setToast("Planning status saved in this browser.");
  };
  const toYouth = (zone) => {
    setYouthZoneId(zone.id);
    setSeverity("All");
    setRegion("All");
    setState("All");
    setDetailId(null);
    navigate("youth");
  };
  const toPrograms = () => {
    setDetailId(null);
    navigate("programs");
  };
  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to main content
      </a>
      {mobileNav && (
        <div className="nav-backdrop" onClick={() => setMobileNav(false)} />
      )}
      <aside
        id="main-sidebar"
        ref={sidebarRef}
        inert={isMobile && !mobileNav}
        className={`sidebar ${mobileNav ? "is-open" : ""}`}
      >
        <button
          className="brand"
          onClick={() => navigate("dashboard")}
          aria-label="TSTS dashboard"
        >
          <span className="brand-mark">
            <Network size={24} />
          </span>
          <span>
            <strong>
              TSTS<span className="brand-dot">.</span>
            </strong>
            <small>Connecting communities</small>
          </span>
        </button>
        <div className="workspace-label">PLANNING WORKSPACE</div>
        <nav aria-label="Main navigation">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => navigate(n.id)}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              aria-current={page === n.id ? "page" : undefined}
            >
              <n.icon size={19} />
              <span>{n.label}</span>
              {n.id === "reports" && pending > 0 && (
                <span className="nav-count">{pending}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="sidebar-note-icon">
              <Globe2 size={20} />
            </div>
            <strong>Access starts with insight.</strong>
            <p>Helping rural communities move forward, together.</p>
            <button
              onClick={() => {
                setMobileNav(false);
                setHelp(true);
              }}
            >
              About this workspace <ArrowUpRight size={13} />
            </button>
          </div>
          <button
            className="help-link"
            onClick={() => {
              setMobileNav(false);
              setHelp(true);
            }}
          >
            <CircleHelp size={18} />
            Help & documentation
            <ArrowUpRight size={14} />
          </button>
          <div className="user-card">
            <div className="user-avatar">TP</div>
            <div>
              <strong>Transportation planner</strong>
              <span>Demo workspace</span>
            </div>
            <ShieldCheck size={16} />
          </div>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div className="topbar-title">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={mobileNav}
              aria-controls="main-sidebar"
              onClick={() => setMobileNav(true)}
            >
              <Menu size={21} />
            </button>
            <span>Transit Scarcity Tracking System</span>
            <ChevronRight size={13} />
            <strong>{NAV.find((n) => n.id === page)?.label}</strong>
          </div>
          <div className="topbar-actions">
            <div className="global-search">
              <Search size={16} />
              <input
                aria-label="Search all zones"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Find a zone…"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setGlobalSearch("");
                }}
              />
              {globalSearch && (
                <div className="search-results">
                  {zones
                    .filter((z) =>
                      `${z.name} ${z.state} ${z.county}`
                        .toLowerCase()
                        .includes(globalSearch.toLowerCase()),
                    )
                    .map((z) => (
                      <button
                        key={z.id}
                        onClick={() => {
                          setDetailId(z.id);
                          setGlobalSearch("");
                        }}
                      >
                        <MapPin size={15} />
                        <span>
                          <strong>{z.name}</strong>
                          <small>
                            {z.county}, {z.stateCode}
                          </small>
                        </span>
                        <ChevronRight size={15} />
                      </button>
                    ))}
                  {!zones.some((z) =>
                    `${z.name} ${z.state} ${z.county}`
                      .toLowerCase()
                      .includes(globalSearch.toLowerCase()),
                  ) && <p>No matching zones.</p>}
                </div>
              )}
            </div>
            <span className="top-demo">
              <span />
              Demo mode
            </span>
            <button
              className="icon-button notification-button"
              onClick={() => navigate("reports")}
              aria-label={`${pending} reports awaiting review`}
            >
              <Bell size={18} />
              {pending > 0 && <i />}
            </button>
            <span className="top-avatar">TP</span>
          </div>
        </header>
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="main-content"
        >
          {page === "dashboard" && (
            <Dashboard
              zones={visible}
              allZones={zones}
              reports={reports}
              onSelect={(z) => setDetailId(z.id)}
              onNavigate={navigate}
              filters={filters}
            />
          )}{" "}
          {page === "map" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">EXPLORE THE GEOGRAPHY OF ACCESS</div>
                  <h1>Interactive map</h1>
                  <p>
                    Map youth populations, urban services, nature destinations,
                    and transit barriers.
                  </p>
                </div>
                <span className="demo-tag">
                  <FlaskConical size={14} />
                  Sample data
                </span>
              </div>
              {filters}
              <div
                className={`map-page-layout ${selectedMap ? "with-detail" : ""}`}
              >
                <section className="panel full-map">
                  <TransitMap
                    zones={visible}
                    onSelectZone={(z) => setMapZone(z.id)}
                    selectedZoneId={mapZone}
                  />
                  <div className="map-footnote">
                    <span>
                      <Info size={13} />
                      Sample zone centers and destination connections. Lines
                      show geographic relationships, not routes.
                    </span>
                  </div>
                </section>
                {selectedMap && (
                  <aside
                    ref={mapDetailRef}
                    tabIndex={-1}
                    aria-label="Selected zone details"
                    className="panel map-details"
                  >
                    <div className="map-detail-toolbar">
                      <span>ZONE INSIGHT</span>
                      <button
                        className="icon-button"
                        onClick={() => setMapZone(null)}
                        aria-label="Close zone panel"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <ZoneDetails
                      zone={selectedMap}
                      reports={reports}
                      onStatusChange={updateStatus}
                      onPrograms={toPrograms}
                      onYouth={toYouth}
                      compact
                    />
                  </aside>
                )}
              </div>
              <div className="planning-note">
                <Mountain size={21} />
                <p>
                  <strong>Understand the land behind the gap.</strong> Turn on
                  terrain difficulty to explore simulated implementation
                  challenges. All grades and boundaries are illustrative.
                </p>
              </div>
            </>
          )}{" "}
          {page === "youth" && (
            <YouthPlanning
              zones={visible}
              initialZoneId={youthZoneId}
              filters={filters}
              onSelectZone={(z) => setDetailId(z.id)}
            />
          )}
          {page === "reports" && (
            <Reports
              zones={zones}
              reports={reports}
              setReports={setReports}
              notify={setToast}
            />
          )}{" "}
          {page === "zones" && (
            <Registry
              zones={visible}
              onSelect={(z) => setDetailId(z.id)}
              onExport={exportZones}
              filters={filters}
            />
          )}{" "}
          {page === "programs" && (
            <Programs zones={zones} onSelectZone={(z) => setDetailId(z.id)} />
          )}
          <footer className="page-footer">
            <span>
              TSTS <i /> Transit Scarcity Tracking System
            </span>
            <span>
              Sample data · Planning demonstration{" "}
              <button
                onClick={() => {
                  setMobileNav(false);
                  setHelp(true);
                }}
              >
                About & methodology <ArrowUpRight size={12} />
              </button>
            </span>
          </footer>
        </main>
      </div>
      {detail && (
        <Dialog title="Zone profile" onClose={() => setDetailId(null)} wide>
          <ZoneDetails
            zone={detail}
            reports={reports}
            onStatusChange={updateStatus}
            onPrograms={toPrograms}
            onYouth={toYouth}
          />
        </Dialog>
      )}
      {help && (
        <Dialog title="About this workspace" onClose={() => setHelp(false)}>
          <div className="about-content">
            <div className="small-demo">
              <FlaskConical size={20} />
              <strong>Demonstration only · No live government data</strong>
            </div>
            <p>
              TSTS helps state DOT, county, and tribal transportation planners
              explore underserved communities and organize early transit
              development research.
            </p>
            <h3>What the sample shows</h3>
            <p>
              Twelve fictional zones in real U.S. geographic settings.
              Population, stops, trips, funding measures, causes, and citizen
              reports are invented examples. Tribal scenarios do not describe
              actual tribal service conditions or imply tribal endorsement.
            </p>
            <h3>How to use it</h3>
            <ol>
              <li>Filter the dashboard or registry to prioritize zones.</li>
              <li>
                Explore the map and select a zone for its landscape and access
                profile.
              </li>
              <li>
                Submit a browser-local report, review its flags, and approve or
                link it to a zone.
              </li>
              <li>
                Export the filtered registry as CSV and review official funding
                references.
              </li>
            </ol>
            <h3>Simulated terrain analysis</h3>
            <p>
              Terrain grades use seeded, illustrative elevation and slope
              categories. Overlay boundaries are generated demo patterns around
              sample locations. There is no satellite processing, routing, field
              survey, or actual eligibility determination.
            </p>
            <h3>Youth access & project comparisons</h3>
            <p>
              The demonstration uses adolescents aged 12–17 as its planning
              cohort. Counts are synthetic zone aggregates; map centers and
              destinations are illustrative, with no individual home or school
              locations. Independent access is a sample transport screen, not a
              determination that a trip is safe for a child.
            </p>
            <p>
              Healthcare refers to a fictional primary-care facility suitable
              for routine visits, not emergency or specialist care. One-way
              transit and private-vehicle times are separate. Missing transit is
              shown as unavailable, never zero minutes. The explorer checks
              travel time, walking, service days, return trips, and optional
              evening/accessibility needs.
            </p>
            <p>
              Needs scores use 45% youth access gap, 25% residents without
              reliable transport, and 30% healthcare access. Proposed-service
              costs and beneficiaries are transparent assumptions. Low ridership
              alone does not establish low demand; evidence gaps and alternative
              explanations remain visible.
            </p>
            <h3>Data & privacy</h3>
            <p>
              Reports and planning status persist in this browser’s
              localStorage. They are never sent to planners or agencies. Use
              fictional contact information. Spam checks are lightweight demo
              heuristics and can be overridden by a planner. Clearing browser
              storage resets the demonstration.
            </p>
            <p>
              Street and satellite imagery load from external map providers and
              require an internet connection. Federal program cards link to
              official FTA sources.
            </p>
          </div>
        </Dialog>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          <span>{toast}</span>
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
