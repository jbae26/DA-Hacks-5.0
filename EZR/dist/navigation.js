/** Pick the most recently reached navigation section, including its sub-sections. */
export function getActiveSection(
  anchors,
  scrollY = 0,
  headerHeight = 0,
  atBottom = false,
) {
  if (!Array.isArray(anchors)) return null;
  const sections = anchors
    .filter(
      (anchor) =>
        anchor && typeof anchor.id === "string" && Number.isFinite(anchor.top),
    )
    .slice()
    .sort((a, b) => a.top - b.top);
  if (!sections.length) return null;
  if (atBottom) return sections.at(-1).id;
  const position =
    (Number.isFinite(scrollY) ? scrollY : 0) +
    Math.max(0, Number.isFinite(headerHeight) ? headerHeight : 0) +
    1;
  return sections.reduce(
    (active, section) => (section.top <= position ? section.id : active),
    sections[0].id,
  );
}

/**
 * Keep the underline and aria-current synchronized with clicks, scrolling,
 * deep links, and browser history. Native anchor navigation stays intact.
 * The clicked section remains selected throughout a smooth scroll; manual
 * wheel, touch, scrollbar, or keyboard scrolling hands control back to scrollspy.
 * No DOM access happens until this function is called.
 */
export function initNavigation({
  document: doc = globalThis.document,
  window: win = globalThis.window,
} = {}) {
  if (!doc || !win) return () => {};
  const links = [...doc.querySelectorAll('#main-nav a[href^="#"]')];
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      return { id, link, element: doc.getElementById(id) };
    })
    .filter((section) => section.element);
  if (!sections.length) return () => {};
  const header = doc.querySelector(".site-header");
  const cleanups = [];
  let frame = null;
  let pending = null;
  let disposed = false;

  function listen(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  }

  function setActive(id) {
    for (const section of sections) {
      const active = section.id === id;
      section.link.classList.toggle("nav-active", active);
      if (active) section.link.setAttribute("aria-current", "location");
      else section.link.removeAttribute("aria-current");
    }
  }

  function idFromHash(hash) {
    try {
      return decodeURIComponent(hash.replace(/^#/, ""));
    } catch {
      return "";
    }
  }

  function sectionForTarget(targetId) {
    if (["home", "results", "comparison", "finder"].includes(targetId))
      return sections[0].id;
    if (sections.some((section) => section.id === targetId)) return targetId;
    const parentSection = doc.getElementById(targetId)?.closest?.("section");
    if (parentSection && parentSection.id !== targetId)
      return sectionForTarget(parentSection.id);
    return null;
  }

  function queueUpdate() {
    if (frame === null && !disposed) frame = win.requestAnimationFrame(update);
  }

  function update(timestamp) {
    frame = null;
    if (disposed) return;
    const y = win.scrollY;
    if (pending) {
      if (Math.abs(y - pending.lastY) > 0.5) {
        pending.lastY = y;
        pending.lastMovement = timestamp;
      }
      // Allow native anchor scrolling to start before considering it settled.
      const settled =
        timestamp - pending.started >= 180 &&
        timestamp - pending.lastMovement >= 100;
      if (!settled && timestamp - pending.started < 2500) {
        setActive(pending.id);
        queueUpdate();
        return;
      }
      pending = null;
    }
    const positions = sections.map(({ id, element }) => ({
      id,
      top: element.getBoundingClientRect().top + y,
    }));
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const padding =
      parseFloat(win.getComputedStyle(doc.documentElement).scrollPaddingTop) ||
      0;
    // Use the upper visible content region, rather than the header edge alone.
    // Browser history can restore an anchor partway below the sticky header;
    // keep that visibly current section active when a click ends scroll holding.
    const offset =
      Math.max(headerHeight, padding) + Math.min(220, win.innerHeight * 0.25);
    const atBottom =
      y > 0 && y + win.innerHeight >= doc.documentElement.scrollHeight - 2;
    setActive(getActiveSection(positions, y, offset, atBottom));
  }

  function selectTarget(targetId) {
    const id = sectionForTarget(targetId);
    if (!id) {
      pending = null;
      queueUpdate();
      return;
    }
    const now = win.performance.now();
    pending = { id, started: now, lastMovement: now, lastY: win.scrollY };
    setActive(id);
    queueUpdate();
  }

  function interrupt(event) {
    if (
      event.type === "keydown" &&
      ![
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ].includes(event.key)
    )
      return;
    pending = null;
    queueUpdate();
  }

  listen(doc, "click", (event) => {
    if (
      event.defaultPrevented ||
      (event.button !== undefined && event.button !== 0) ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const anchor = event.target.closest?.('a[href^="#"]');
    if (anchor) selectTarget(idFromHash(anchor.getAttribute("href")));
  });
  listen(win, "hashchange", () => selectTarget(idFromHash(win.location.hash)));
  listen(win, "popstate", () => selectTarget(idFromHash(win.location.hash)));
  listen(win, "scroll", queueUpdate, { passive: true });
  listen(win, "resize", queueUpdate, { passive: true });
  listen(doc, "wheel", interrupt, { passive: true });
  listen(doc, "touchstart", interrupt, { passive: true });
  listen(doc, "pointerdown", interrupt, { passive: true });
  listen(doc, "keydown", interrupt);

  const observer = win.ResizeObserver
    ? new win.ResizeObserver(queueUpdate)
    : null;
  if (observer)
    observer.observe(doc.querySelector("main") || doc.documentElement);
  const initial = sectionForTarget(idFromHash(win.location.hash));
  if (initial) selectTarget(idFromHash(win.location.hash));
  else update(win.performance.now());

  return () => {
    disposed = true;
    for (const cleanup of cleanups) cleanup();
    observer?.disconnect();
    if (frame !== null) win.cancelAnimationFrame(frame);
  };
}
