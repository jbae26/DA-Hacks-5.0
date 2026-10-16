import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  FileText,
  Info,
  Link2,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  REPORT_CATEGORIES,
  evaluateReport,
  readAttempts,
  recordAttempt,
} from "../reportLogic";
import "./Reports.css";

const statuses = ["All reports", "Pending", "Approved", "Filtered", "Rejected"];
const initialForm = {
  location: "",
  category: "",
  description: "",
  contact: "",
};

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function shortDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Sample report"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function Reports({ zones, reports, setReports, notify }) {
  const [tab, setTab] = useState("review");
  const [status, setStatus] = useState("All reports");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");
  const attempts = useRef(null);
  if (attempts.current === null) attempts.current = readAttempts(storage());

  const counts = useMemo(
    () =>
      reports.reduce((result, report) => {
        result[report.status] = (result[report.status] || 0) + 1;
        return result;
      }, {}),
    [reports],
  );

  const filteredReports = useMemo(
    () =>
      reports
        .filter(
          (report) => status === "All reports" || report.status === status,
        )
        .filter((report) =>
          `${report.description} ${report.county} ${report.state} ${report.category}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [reports, status, search],
  );

  function changeStatus(report, nextStatus) {
    setReports((current) =>
      current.map((item) =>
        item.id === report.id
          ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
    notify(
      `Report ${nextStatus.toLowerCase()}.${nextStatus === "Approved" && !report.zoneId ? " Link it to a zone to include it in zone details." : ""}`,
    );
  }

  function linkReport(report, zoneId) {
    setReports((current) =>
      current.map((item) =>
        item.id === report.id
          ? { ...item, zoneId, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
    const zone = zones.find((item) => item.id === zoneId);
    notify(
      zone
        ? `Report linked to ${zone.name}.`
        : "Report unlinked from its zone.",
    );
  }

  function submitReport(event) {
    event.preventDefault();
    setError("");
    const zone = zones.find((item) => item.id === form.location);
    if (
      !zone ||
      !REPORT_CATEGORIES.includes(form.category) ||
      form.description.trim().length < 20
    ) {
      setError(
        "Choose a county and issue category, then provide at least 20 characters describing the issue.",
      );
      return;
    }
    const now = Date.now();
    const candidate = {
      id: `report-${globalThis.crypto?.randomUUID?.() || `${now}-${Math.random().toString(36).slice(2, 8)}`}`,
      zoneId: zone.id,
      county: zone.county,
      state: zone.state,
      category: form.category,
      description: form.description.trim(),
      contact: form.contact.trim(),
      createdAt: new Date(now).toISOString(),
    };
    const result = evaluateReport(candidate, reports, attempts.current, now);
    attempts.current = recordAttempt(storage(), attempts.current, now);
    const report = { ...candidate, ...result };
    setReports((current) => [report, ...current]);
    setSubmitted(report);
    setForm(initialForm);
    notify(
      result.status === "Filtered"
        ? "Report saved and flagged for planner review."
        : "Report saved to the review queue.",
    );
  }

  function switchTab(nextTab) {
    setTab(nextTab);
    setSubmitted(null);
    setError("");
  }

  return (
    <div className="reports-page">
      <div className="page-heading reports-heading">
        <div>
          <div className="eyebrow">COMMUNITY INSIGHTS</div>
          <h1>Citizen reports</h1>
          <p>Turn local experiences into better-connected communities.</p>
        </div>
        {tab === "review" && (
          <button
            className="button button-primary"
            onClick={() => switchTab("submit")}
          >
            <Plus size={17} /> Submit a report
          </button>
        )}
      </div>

      <div
        className="report-tabs"
        role="tablist"
        aria-label="Citizen report workspace"
      >
        <button
          role="tab"
          aria-selected={tab === "review"}
          aria-controls="report-review-panel"
          id="report-review-tab"
          className={tab === "review" ? "active" : ""}
          onClick={() => switchTab("review")}
        >
          <MessageSquare size={17} /> Review queue <span>{reports.length}</span>
        </button>
        <button
          role="tab"
          aria-selected={tab === "submit"}
          aria-controls="report-submit-panel"
          id="report-submit-tab"
          className={tab === "submit" ? "active" : ""}
          onClick={() => switchTab("submit")}
        >
          <FileText size={17} /> Submit a report
        </button>
      </div>

      {tab === "review" ? (
        <div
          role="tabpanel"
          id="report-review-panel"
          aria-labelledby="report-review-tab"
        >
          <div className="report-metrics">
            <div className="panel">
              <span className="report-metric-icon pending">
                <Clock3 size={19} />
              </span>
              <div>
                <strong>{counts.Pending || 0}</strong>
                <span>Awaiting review</span>
              </div>
            </div>
            <div className="panel">
              <span className="report-metric-icon approved">
                <CheckCheck size={19} />
              </span>
              <div>
                <strong>{counts.Approved || 0}</strong>
                <span>Approved insights</span>
              </div>
            </div>
            <div className="panel">
              <span className="report-metric-icon filtered">
                <ShieldAlert size={19} />
              </span>
              <div>
                <strong>{counts.Filtered || 0}</strong>
                <span>Flagged by filters</span>
              </div>
            </div>
          </div>
          <div className="panel report-queue">
            <div className="report-queue-heading">
              <div>
                <h2>Community review queue</h2>
                <p>
                  Review reports and connect relevant insights to a scarcity
                  zone.
                </p>
              </div>
              <span className="report-local-label">
                <span /> Browser-local demo
              </span>
            </div>
            <div className="report-controls">
              <div
                className="report-status-filters"
                aria-label="Filter reports by status"
              >
                {statuses.map((item) => (
                  <button
                    key={item}
                    aria-pressed={status === item}
                    onClick={() => setStatus(item)}
                    className={status === item ? "active" : ""}
                  >
                    {item}
                    <span>
                      {item === "All reports"
                        ? reports.length
                        : counts[item] || 0}
                    </span>
                  </button>
                ))}
              </div>
              <label className="report-search">
                <Search size={16} />
                <input
                  aria-label="Search citizen reports"
                  placeholder="Search reports..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
            </div>
            <div className="report-list" aria-live="polite">
              {filteredReports.length === 0 ? (
                <div className="empty-state report-empty">
                  <MessageSquare size={30} />
                  <h3>No reports found</h3>
                  <p>
                    Try a different status or search, or submit a new community
                    report.
                  </p>
                </div>
              ) : (
                filteredReports.map((report) => {
                  const linkedZone = zones.find(
                    (zone) => zone.id === report.zoneId,
                  );
                  return (
                    <article className="report-card" key={report.id}>
                      <div className="report-card-top">
                        <div className="report-location">
                          <span className="report-location-icon">
                            <MapPin size={18} />
                          </span>
                          <div>
                            <h3>
                              {report.county}, {report.state}
                            </h3>
                            <span>
                              {shortDate(report.createdAt)}
                              <span className="report-dot">·</span>
                              {report.category}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`report-badge ${report.status.toLowerCase()}`}
                        >
                          {report.status === "Filtered" && (
                            <ShieldAlert size={12} />
                          )}
                          {report.status}
                        </span>
                      </div>
                      <p className="report-description">{report.description}</p>
                      {report.status === "Filtered" &&
                        report.filterReasons?.length > 0 && (
                          <div className="report-filter-reasons">
                            <ShieldAlert size={15} />
                            <div>
                              <strong>Flagged for manual review</strong>
                              <ul>
                                {report.filterReasons.map((reason) => (
                                  <li key={reason}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      <div className="report-actions">
                        <label className="report-zone-link">
                          <Link2 size={15} />
                          <select
                            aria-label={`Link report from ${report.county} to zone`}
                            value={report.zoneId || ""}
                            onChange={(event) =>
                              linkReport(report, event.target.value)
                            }
                          >
                            <option value="">Link to a zone</option>
                            {zones.map((zone) => (
                              <option key={zone.id} value={zone.id}>
                                {zone.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={13} />
                        </label>
                        <div className="report-review-actions">
                          {report.status !== "Rejected" && (
                            <button
                              className="button button-secondary button-small report-reject"
                              onClick={() => changeStatus(report, "Rejected")}
                            >
                              <X size={14} /> Reject
                            </button>
                          )}
                          {report.status !== "Approved" && (
                            <button
                              className="button button-small report-approve"
                              onClick={() => changeStatus(report, "Approved")}
                            >
                              <Check size={14} /> Approve
                            </button>
                          )}
                        </div>
                      </div>
                      {report.status === "Approved" && (
                        <p className="report-approved-note">
                          <Check size={12} />
                          {linkedZone
                            ? `Included in ${linkedZone.name} zone details.`
                            : "Approved. Choose a zone to include this report in zone details."}
                        </p>
                      )}
                    </article>
                  );
                })
              )}
            </div>
            <div className="report-queue-footer">
              <span>
                Showing {filteredReports.length} of {reports.length} reports
              </span>
              <span>
                <ShieldCheck size={14} /> Automated filters assist human review
              </span>
            </div>
          </div>
          <div className="report-demo-note">
            <Info size={16} />
            <p>
              <strong>Sample data, local insights.</strong> Reports and review
              decisions are saved only in this browser. This demonstration does
              not submit information to any government agency.
            </p>
          </div>
        </div>
      ) : (
        <div
          role="tabpanel"
          id="report-submit-panel"
          aria-labelledby="report-submit-tab"
          className="report-submit-layout"
        >
          <div className="panel report-form-panel">
            {submitted ? (
              <div className="report-success" role="status">
                <span
                  className={`report-success-icon ${submitted.status.toLowerCase()}`}
                >
                  {submitted.status === "Filtered" ? (
                    <ShieldAlert size={28} />
                  ) : (
                    <Check size={28} />
                  )}
                </span>
                <div className="eyebrow">REPORT SAVED</div>
                <h2>
                  {submitted.status === "Filtered"
                    ? "Your report is ready for review."
                    : "Thank you for sharing your experience."}
                </h2>
                <p>
                  {submitted.status === "Filtered"
                    ? "The automated checks flagged this report. A planner can review it in the Filtered queue and approve it if appropriate."
                    : "Your report is in the Pending queue. Approved reports will be included in the linked scarcity zone."}
                </p>
                {submitted.filterReasons.length > 0 && (
                  <ul className="report-success-reasons">
                    {submitted.filterReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                )}
                <div className="report-success-actions">
                  <button
                    className="button button-primary"
                    onClick={() => {
                      setStatus(submitted.status);
                      switchTab("review");
                    }}
                  >
                    View review queue <ArrowRight size={16} />
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => setSubmitted(null)}
                  >
                    Submit another
                  </button>
                </div>
                <small>This demo report remains in this browser only.</small>
              </div>
            ) : (
              <>
                <div className="report-form-header">
                  <span className="report-form-icon">
                    <MessageSquare size={21} />
                  </span>
                  <h2>Share a transit challenge</h2>
                  <p>
                    Tell us where transportation access falls short. All fields
                    are required unless marked optional.
                  </p>
                </div>
                <form onSubmit={submitReport} className="report-form">
                  <div className="report-form-grid">
                    <label>
                      County / service area
                      <select
                        className="input"
                        required
                        value={form.location}
                        onChange={(event) =>
                          setForm({ ...form, location: event.target.value })
                        }
                      >
                        <option value="">Choose a sample county</option>
                        {zones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.county}, {zone.state} — {zone.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Issue category
                      <select
                        className="input"
                        required
                        value={form.category}
                        onChange={(event) =>
                          setForm({ ...form, category: event.target.value })
                        }
                      >
                        <option value="">Select an issue</option>
                        {REPORT_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    Describe the transportation issue
                    <textarea
                      className="input"
                      required
                      minLength={20}
                      maxLength={2000}
                      rows={6}
                      placeholder="For example: The nearest bus stop is 18 miles away, making it difficult to get to medical appointments in the county seat."
                      value={form.description}
                      onChange={(event) =>
                        setForm({ ...form, description: event.target.value })
                      }
                      aria-describedby="report-description-help"
                    />
                  </label>
                  <div
                    className="report-field-hint"
                    id="report-description-help"
                  >
                    <span>
                      Include the destination, route, or service gap. Minimum 20
                      characters.
                    </span>
                    <span>{form.description.length}/2,000</span>
                  </div>
                  <label>
                    Email address{" "}
                    <span className="report-optional">(optional)</span>
                    <input
                      className="input"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      placeholder="you@example.com"
                      value={form.contact}
                      onChange={(event) =>
                        setForm({ ...form, contact: event.target.value })
                      }
                    />
                  </label>
                  <p className="report-contact-note">
                    Optional contact stays in local browser storage. No emails
                    are sent. Please use fictional contact information for this
                    demo.
                  </p>
                  {error && (
                    <p className="report-form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="report-form-bottom">
                    <span>
                      <ShieldCheck size={15} /> Automatically checked for
                      duplicates and spam
                    </span>
                    <button type="submit" className="button button-primary">
                      Submit report <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          <aside className="report-submit-aside">
            <div className="panel report-help">
              <h3>Your experience matters</h3>
              <p>
                Local knowledge helps planners understand the gaps that service
                data alone cannot capture.
              </p>
              <ol>
                <li>
                  <span>1</span>
                  <div>
                    <strong>Describe the gap</strong>
                    <p>
                      Choose a county and share a specific transportation
                      challenge.
                    </p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>Planner review</strong>
                    <p>
                      Reports are checked and reviewed before they inform a
                      zone.
                    </p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>Connect the evidence</strong>
                    <p>
                      Approved reports appear alongside service and terrain
                      information.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
            <div className="report-demo-note">
              <Info size={17} />
              <p>
                <strong>Demonstration only</strong>
                <br />
                Service areas and transit figures are fictional. Real county
                names provide geographic context. This is not an official
                reporting channel or a transportation booking service.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
