import test from "node:test";
import assert from "node:assert/strict";
import { getActiveSection, initNavigation } from "../dist/navigation.js";

const anchors = [
  { id: "finder", top: 1000 },
  { id: "materials", top: 3000 },
  { id: "how-it-works", top: 4000 },
];

test("scrollspy follows section boundaries in both directions and includes finder sub-sections", () => {
  for (const [y, expected] of [
    [0, "finder"],
    [1000, "finder"],
    [2500, "finder"],
    [2892, "materials"],
    [3500, "materials"],
    [3892, "how-it-works"],
    [3100, "materials"],
    [1200, "finder"],
  ])
    assert.equal(getActiveSection(anchors, y, 108), expected);
  assert.equal(getActiveSection(anchors, 3500, 108, true), "how-it-works");
  assert.equal(getActiveSection([], 0), null);
  assert.equal(getActiveSection(null, 0), null);
  assert.deepEqual(
    anchors.map((anchor) => anchor.top),
    [1000, 3000, 4000],
  );
});

function environment() {
  class EventTarget {
    listeners = new Map();
    addEventListener(type, callback) {
      if (!this.listeners.has(type)) this.listeners.set(type, new Set());
      this.listeners.get(type).add(callback);
    }
    removeEventListener(type, callback) {
      this.listeners.get(type)?.delete(callback);
    }
    emit(type, event = {}) {
      for (const callback of this.listeners.get(type) || [])
        callback({ type, ...event });
    }
  }
  const win = new EventTarget();
  const doc = new EventTarget();
  let time = 0;
  let nextFrame = 0;
  const frames = new Map();
  Object.assign(win, {
    scrollY: 0,
    innerHeight: 800,
    location: { hash: "" },
    performance: { now: () => time },
    getComputedStyle: () => ({ scrollPaddingTop: "108px" }),
    requestAnimationFrame(callback) {
      const id = ++nextFrame;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
    },
  });
  const sections = anchors.map((anchor) => ({
    id: anchor.id,
    getBoundingClientRect: () => ({ top: anchor.top - win.scrollY }),
  }));
  const links = anchors.map(({ id }) => {
    const attributes = new Map([["href", `#${id}`]]);
    const classes = new Set(id === "finder" ? ["nav-active"] : []);
    const link = {
      getAttribute: (name) => attributes.get(name),
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: (name) => attributes.delete(name),
      classList: {
        toggle(name, active) {
          active ? classes.add(name) : classes.delete(name);
        },
        contains: (name) => classes.has(name),
      },
      closest: () => link,
    };
    return link;
  });
  doc.documentElement = { scrollHeight: 5000 };
  doc.querySelectorAll = () => links;
  doc.querySelector = (selector) =>
    selector === ".site-header"
      ? { getBoundingClientRect: () => ({ height: 84 }) }
      : null;
  doc.getElementById = (id) => sections.find((section) => section.id === id);
  const active = () =>
    links
      .filter((link) => link.classList.contains("nav-active"))
      .map((link) => link.getAttribute("href").slice(1));
  const advance = (milliseconds, y = win.scrollY) => {
    time += milliseconds;
    win.scrollY = y;
    const queued = [...frames.values()];
    frames.clear();
    for (const callback of queued) callback(time);
  };
  return { win, doc, links, active, advance };
}

test("clicking another navigation item moves the single underline and aria-current immediately", () => {
  const env = environment();
  const cleanup = initNavigation({ document: env.doc, window: env.win });
  assert.deepEqual(env.active(), ["finder"]);
  assert.equal(env.links[0].getAttribute("aria-current"), "location");
  env.doc.emit("click", { target: env.links[1], button: 0 });
  assert.deepEqual(env.active(), ["materials"]);
  assert.equal(env.links[0].getAttribute("aria-current"), undefined);
  assert.equal(env.links[1].getAttribute("aria-current"), "location");
  // Intermediate smooth-scroll frames must not return the underline to finder.
  env.advance(80, 1200);
  assert.deepEqual(env.active(), ["materials"]);
  env.advance(150, 2892);
  env.advance(120);
  assert.deepEqual(env.active(), ["materials"]);
  env.doc.emit("click", { target: env.links[2], button: 0 });
  assert.deepEqual(env.active(), ["how-it-works"]);
  env.advance(200, 3892);
  env.advance(120);
  assert.deepEqual(env.active(), ["how-it-works"]);
  cleanup();
});

test("manual scroll interruption, hash history, and cleanup stay synchronized", () => {
  const env = environment();
  const cleanup = initNavigation({ document: env.doc, window: env.win });
  env.doc.emit("click", { target: env.links[2], button: 0 });
  env.advance(30, 1500);
  env.doc.emit("wheel");
  env.advance(16);
  assert.deepEqual(env.active(), ["finder"]);
  env.win.scrollY = 3100;
  env.win.emit("scroll");
  env.advance(16);
  assert.deepEqual(env.active(), ["materials"]);
  env.win.location.hash = "#how-it-works";
  env.win.emit("hashchange");
  assert.deepEqual(env.active(), ["how-it-works"]);
  env.win.location.hash = "#finder";
  env.win.emit("popstate");
  assert.deepEqual(env.active(), ["finder"]);
  cleanup();
  env.win.scrollY = 4200;
  env.win.emit("scroll");
  env.advance(1000);
  assert.deepEqual(env.active(), ["finder"]);
  assert.doesNotThrow(() => initNavigation({ document: null, window: null })());
});
