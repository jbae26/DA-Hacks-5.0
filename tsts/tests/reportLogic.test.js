import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateReport,
  recentAttempts,
  RATE_LIMIT_WINDOW,
  readAttempts,
  recordAttempt,
} from "../src/reportLogic.js";

const now = 1_000_000;
const candidate = {
  county: "Example County",
  state: "WV",
  description: "There is no bus service to the regional clinic.",
};

test("a legitimate, new report enters the pending review queue", () => {
  assert.deepEqual(evaluateReport(candidate, [], [], now), {
    status: "Pending",
    filterReasons: [],
  });
});

test("duplicates normalize capitalization, spacing, and punctuation but preserve county and state", () => {
  const duplicate = {
    ...candidate,
    description: " THERE is NO bus service to the regional clinic!!! ",
  };
  assert.match(
    evaluateReport(duplicate, [candidate], [], now).filterReasons[0],
    /Duplicate/,
  );
  assert.equal(
    evaluateReport(
      { ...duplicate, county: "Different County" },
      [candidate],
      [],
      now,
    ).status,
    "Pending",
  );
  assert.equal(
    evaluateReport({ ...duplicate, state: "VA" }, [candidate], [], now).status,
    "Pending",
  );
});

test("multiple links and promotional text are independently explained, not silently rejected", () => {
  const result = evaluateReport(
    {
      ...candidate,
      description: "Buy now! https://one.example www.two.example",
    },
    [],
    [],
    now,
  );
  assert.equal(result.status, "Filtered");
  assert.equal(result.filterReasons.length, 2);
  assert.match(result.filterReasons[0], /Multiple links/);
  assert.match(result.filterReasons[1], /Spam language/);
  assert.equal(
    evaluateReport(
      {
        ...candidate,
        description: "The clinic has details at https://clinic.example",
      },
      [],
      [],
      now,
    ).status,
    "Pending",
  );
});

test("three submissions are allowed; the fourth within ten minutes is filtered", () => {
  assert.equal(
    evaluateReport(candidate, [], [now - 2, now - 1], now).status,
    "Pending",
  );
  const result = evaluateReport(
    candidate,
    [],
    [now - 3, now - 2, now - 1],
    now,
  );
  assert.equal(result.status, "Filtered");
  assert.match(result.filterReasons[0], /Rate limit/);
});

test("expired, malformed, and future timestamps do not trigger the rate limit", () => {
  assert.deepEqual(
    recentAttempts(
      [
        now - RATE_LIMIT_WINDOW,
        now - RATE_LIMIT_WINDOW - 1,
        "bad",
        null,
        now + 1,
        now - 1,
      ],
      now,
    ),
    [now - 1],
  );
  assert.equal(
    evaluateReport(
      candidate,
      [],
      [now - RATE_LIMIT_WINDOW, now - 2, now - 1],
      now,
    ).status,
    "Pending",
  );
});

test("every attempt is recorded, including duplicates, across storage reads", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key),
    setItem: (key, value) => values.set(key, value),
  };
  let attempts = [];
  for (let index = 0; index < 3; index += 1) {
    assert.equal(
      evaluateReport(candidate, [candidate], attempts, now).status,
      "Filtered",
    );
    attempts = recordAttempt(storage, attempts, now);
  }
  const loaded = readAttempts(storage, now);
  assert.equal(loaded.length, 3);
  assert.equal(
    evaluateReport(
      {
        ...candidate,
        description: "A different request for a rural bus route.",
      },
      [],
      loaded,
      now,
    ).status,
    "Filtered",
  );
});

test("storage corruption and unavailable localStorage are safe", () => {
  assert.deepEqual(readAttempts({ getItem: () => "{broken" }, now), []);
  const storage = {
    getItem: () => {
      throw new Error("disabled");
    },
    setItem: () => {
      throw new Error("disabled");
    },
  };
  assert.deepEqual(readAttempts(storage, now), []);
  assert.deepEqual(recordAttempt(storage, [], now), [now]);
});
