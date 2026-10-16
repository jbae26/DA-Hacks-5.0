export const REPORT_CATEGORIES = [
  "No service",
  "Infrequent service",
  "No intercity connection",
  "Tribal area",
  "Accessibility",
  "Other",
];

export const ATTEMPT_STORAGE_KEY = "tsts-report-attempts";
export const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
export const RATE_LIMIT_COUNT = 3;

export function normalizeReportText(value = "") {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function recentAttempts(attempts, now = Date.now()) {
  return (Array.isArray(attempts) ? attempts : []).filter(
    (value) =>
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > now - RATE_LIMIT_WINDOW &&
      value <= now,
  );
}

/** Evaluate against previous attempts; the caller records this attempt even if filtered. */
export function evaluateReport(
  candidate,
  reports = [],
  attempts = [],
  now = Date.now(),
) {
  const reasons = [];
  const description = normalizeReportText(candidate.description);
  const county = normalizeReportText(candidate.county);
  const state = normalizeReportText(candidate.state);
  if (
    description &&
    reports.some(
      (report) =>
        normalizeReportText(report.description) === description &&
        normalizeReportText(report.county) === county &&
        normalizeReportText(report.state) === state,
    )
  ) {
    reasons.push(
      "Duplicate: a report with the same description and county already exists.",
    );
  }

  const rawDescription = String(candidate.description || "");
  const links = rawDescription.match(/(?:https?:\/\/|www\.)[^\s]+/gi) || [];
  if (links.length >= 2) {
    reasons.push(
      "Multiple links: this report contains two or more external links.",
    );
  }
  if (
    /\b(?:buy now|free money|crypto giveaway|earn cash|guaranteed profit|casino|click here to win|limited time offer)\b/i.test(
      rawDescription,
    )
  ) {
    reasons.push(
      "Spam language: this report contains a promotional keyword or phrase.",
    );
  }
  if (recentAttempts(attempts, now).length >= RATE_LIMIT_COUNT) {
    reasons.push(
      "Rate limit: more than three submissions from this browser within ten minutes.",
    );
  }

  return {
    status: reasons.length ? "Filtered" : "Pending",
    filterReasons: reasons,
  };
}

export function readAttempts(storage, now = Date.now()) {
  try {
    return recentAttempts(
      JSON.parse(storage.getItem(ATTEMPT_STORAGE_KEY) || "[]"),
      now,
    );
  } catch {
    return [];
  }
}

export function recordAttempt(storage, attempts, now = Date.now()) {
  const nextAttempts = [...recentAttempts(attempts, now), now];
  try {
    storage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(nextAttempts));
  } catch {
    // In restricted browsers the calling component keeps these attempts in memory.
  }
  return nextAttempts;
}
