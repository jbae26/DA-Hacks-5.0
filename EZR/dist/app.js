import {
  products,
  categories,
  materialGroups,
  guidanceSources,
} from "./catalog.js?v=clothing1";
import { searchProducts } from "./search.js?v=search1";
import { isMedicationQuery } from "./logic.js?v=clothing1";
import { initPhoto } from "./photo.js?v=camera1";
import { initNavigation } from "./navigation.js?v=eczema2";
import {
  materialProfiles,
  materialGroupLabels,
} from "./materials-guide.js?v=theme1";
import { getLifecycle } from "./lifecycle.js?v=clothing1";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );
const href = (url) =>
  typeof url === "string" && url.startsWith("https://") ? esc(url) : "#";
const external = (url, label, className = "") =>
  `<a class="${className}" href="${href(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ${icon("arrow-up")}</a>`;
const iconPaths = {
  city: '<path d="M3 21V9h6V3h8v9h4v9H3ZM9 9v12m8-9v9M5 12h1m-1 4h1m6-9h2m-2 4h2m-2 4h2m5 1h1"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  "arrow-up": '<path d="M6 18 18 6M6 6h12v12"/>',
  leaf: '<path d="M20 3c-8-1-15 2-15 9a6 6 0 0 0 6 6c7 0 10-7 9-15Z"/><path d="M3 21 15 9"/>',
  sprout:
    '<path d="M12 21v-9M12 14C5 14 3 10 3 5c6 0 9 3 9 9Zm0-3c0-6 3-8 9-8 0 5-3 8-9 8Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  sliders: '<path d="M4 7h5m4 0h7M4 17h9m4 0h3M9 4v6m4 4v6"/>',
  camera:
    '<path d="M4 6h4l2-3h4l2 3h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="4"/>',
  "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8l10-5Zm-9 10 9 5 9-5M3 18l9 5 9-5"/>',
  balance:
    '<path d="M12 3v18M6 21h12M3 7h18M6 7l-4 8h8L6 7Zm12 0-4 8h8l-4-8Z"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  sparkles:
    '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  shield:
    '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  wallet:
    '<path d="M20 7V4H5a2 2 0 0 0 0 4h16v12H5a2 2 0 0 1-2-2V6m18 6h-6v4h6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  recycle:
    '<path d="m8 5 4-3 4 6m-1-5 1 5-5-1M19 10l3 6-7 3m4 1-4-1 2-4M11 21H4l1-8m-3 3 3-3 4 3"/>',
  book: '<path d="M12 5v16M3 3c4 0 7 0 9 2 2-2 5-2 9-2v16c-4 0-7 0-9 2-2-2-5-2-9-2V3Z"/>',
};
function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.leaf}</svg>`;
}
$$("[data-icon]").forEach((el) => {
  el.innerHTML = icon(el.dataset.icon);
});

const state = { category: "all", query: "", sort: "relevance", shown: [] };
const savedKey = "rooted.saved.v1";
let saved = new Set();
let savedPersisted = true;
try {
  const stored = JSON.parse(localStorage.getItem(savedKey) || "[]");
  if (Array.isArray(stored))
    saved = new Set(stored.filter((id) => products.some((p) => p.id === id)));
} catch {
  savedPersisted = false;
}
let toastTimer;
function placeToast() {
  const el = $("#toast");
  const modal = $("#detail-dialog");
  // A modal dialog lives above the document's z-index stacking contexts.
  // Keep feedback in that same layer, outside the replaceable dialog content.
  const host = modal.open ? modal : document.body;
  if (el.parentElement !== host) host.append(el);
  return el;
}
function toast(message) {
  const el = placeToast();
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 4500);
}
function syncSaved() {
  $("#saved-count").textContent = saved.size;
  $$("[data-save]").forEach((button) => {
    const active = saved.has(button.dataset.save);
    const name =
      products.find((p) => p.id === button.dataset.save)?.name || "garment";
    const label = active
      ? savedPersisted
        ? "Saved"
        : "Saved for this visit"
      : "Save clothing";
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute(
      "aria-label",
      active
        ? `${label}. Remove ${name} from saved clothing`
        : `Save clothing: ${name}`,
    );
    button.title = active ? "Remove from saved clothing" : "Save clothing";
    const text = button.querySelector("[data-save-label]");
    if (text) text.textContent = label;
    const mark = button.querySelector("[data-save-icon]");
    if (mark) mark.innerHTML = icon(active ? "check-circle" : "bookmark");
    button.classList.toggle("is-saved", active);
  });
}
function toggleSaved(id) {
  if (!products.some((p) => p.id === id)) return;
  const existed = saved.has(id);
  existed ? saved.delete(id) : saved.add(id);
  try {
    localStorage.setItem(savedKey, JSON.stringify([...saved]));
    savedPersisted = true;
    toast(
      existed
        ? "Removed from your saved clothing."
        : "Saved to your clothing list in this browser.",
    );
  } catch {
    savedPersisted = false;
    toast(
      existed
        ? "Removed for this visit. Browser storage is unavailable; it may return after a reload."
        : "Saved for this visit only. Browser storage is unavailable.",
    );
  }
  syncSaved();
  if ($("#detail-dialog").open && $("#dialog-content").dataset.view === "saved")
    showSaved();
}

function tabSet(buttons, onActivate) {
  function activate(button) {
    buttons.forEach((item) => {
      const selected = button === item;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    onActivate(button);
  }
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activate(button));
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft")
        next = (index + buttons.length - 1) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activate(buttons[next]);
        buttons[next].focus();
      }
    });
  });
  return activate;
}
const activateInput = tabSet($$("[data-input-tab]"), (button) => {
  $$('[id^="panel-"]').forEach(
    (panel) => (panel.hidden = panel.id !== `panel-${button.dataset.inputTab}`),
  );
  $("#finder-error").hidden = true;
});
$("#menu-toggle").addEventListener("click", () => {
  const expanded = $("#menu-toggle").getAttribute("aria-expanded") === "true";
  $("#menu-toggle").setAttribute("aria-expanded", String(!expanded));
  $("#menu-toggle").setAttribute(
    "aria-label",
    expanded ? "Open navigation" : "Close navigation",
  );
  $("#main-nav").classList.toggle("is-open", !expanded);
});
$$("#main-nav a").forEach((link) =>
  link.addEventListener("click", () => {
    $("#main-nav").classList.remove("is-open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
    $("#menu-toggle").setAttribute("aria-label", "Open navigation");
  }),
);

const clothingFlagNames = {
  cottonRich: "At least 90% cotton main fabric",
  woolFree: "No wool in main fabric",
  latexFree: "Manufacturer states latex-free",
  coveredElastic: "Fabric-covered elastic waistband",
  flatSeams: "Flat seams documented",
  noSewnLabel: "No sewn-in label documented",
};
function preferences() {
  const budget = $("#budget");
  if (!budget.checkValidity()) {
    budget.reportValidity();
    return null;
  }
  return {
    budget: budget.value === "" ? null : Number(budget.value),
    clothingFlags: $$("#textile-preferences input")
      .filter((i) => i.checked)
      .map((i) => i.value),
  };
}
initNavigation();
if (matchMedia("(max-width: 760px)").matches) $(".search-filters").open = false;
const categoryNames = {
  all: "All clothing",
  tshirt: "T-shirts",
  pants: "Pants",
  underwear: "Underwear",
};
$("#brand-filter").innerHTML += [...new Set(products.map((p) => p.brand))]
  .sort()
  .map((brand) => `<option value="${esc(brand)}">${esc(brand)}</option>`)
  .join("");
function focusResults() {
  $("#results").focus({ preventScroll: true });
  $("#results").scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}
function syncCategory() {
  $("#category-filter").value = state.category;
  $$("[data-category]").forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.category === state.category),
    ),
  );
}
function runSearch({ query = "", category = state.category }) {
  if (!preferences()) return;
  state.query = query.trim();
  state.category = category;
  $("#product-search").value = state.query;
  $("#finder-error").hidden = true;
  syncCategory();
  renderResults();
  focusResults();
}
$("#panel-search").addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch({ query: $("#product-search").value });
});
$$("[data-category]").forEach((button) =>
  button.addEventListener("click", () => {
    runSearch({ query: state.query, category: button.dataset.category });
  }),
);
$("#category-filter").addEventListener("change", (event) => {
  state.category = event.target.value;
  syncCategory();
  renderResults();
});
$("#brand-filter").addEventListener("change", renderResults);
$$("#textile-preferences input").forEach((input) =>
  input.addEventListener("change", renderResults),
);
$("#apply-preferences").addEventListener("click", () => {
  if (!preferences()) return;
  renderResults();
  focusResults();
});
$("#sort-products").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderResults();
});
function clearFilters(clearQuery = false) {
  state.category = "all";
  $("#brand-filter").value = "all";
  $("#budget").value = "";
  $$("#textile-preferences input").forEach((input) => (input.checked = false));
  if (clearQuery) {
    state.query = "";
    $("#product-search").value = "";
  }
  syncCategory();
  renderResults();
}
$("#clear-filters").addEventListener("click", () => clearFilters());
initPhoto({
  onConfirm: ({ category, materials }) =>
    runSearch({ category, query: materials }),
});
const rankingDescriptions = {
  relevance:
    "Matches in our researched catalog. Fabric words search the main fabric; construction requirements need explicit evidence.",
  "price-asc":
    "Lowest full purchase price first, before tax and delivery. Per-garment prices are shown separately for multipacks.",
  "price-desc":
    "Highest full purchase price first, before tax and delivery. Per-garment prices are shown separately for multipacks.",
  transparency:
    "Most documented construction criteria first, including documented absences. This measures disclosure, not skin safety.",
};
function productLabel(p) {
  return p.clothing.cottonRich === true
    ? "Cotton-rich main fabric"
    : "Review fabric disclosure";
}
function productCard(p) {
  return `<article class="product-card"><div class="product-image"><span class="tag">${esc(categoryNames[p.category])}</span><button class="save-product icon-button" data-save="${p.id}" aria-label="Save ${esc(p.name)}" aria-pressed="false">${icon("bookmark")}</button><img src="${p.imageUrl}" alt="${esc(p.imageAlt)}" loading="lazy" width="400" height="320"></div><div class="product-body"><div class="product-topline"><span class="mini-label">${esc(p.brand)}</span><span class="price">${money(p.price)}</span></div><h3><button class="product-title-button" data-detail="${p.id}">${esc(p.name)}</button></h3><div class="product-meta"><span class="tag tag-muted">${esc(productLabel(p))}</span><span class="price-small">${p.unitCount > 1 ? `${p.unitCount}-pack · ${money(p.price / p.unitCount)} / ${p.priceUnit}` : `per ${p.priceUnit}`}</span></div><p>${esc(p.materialSummary)}</p><div class="card-fact">${icon("layers")}<span>Fabric, seams and trims compared; unknowns shown.</span></div><div class="tradeoff">${icon("balance")}<span>${esc(p.tradeoffs[0])}</span></div><div class="product-actions"><button class="text-link" data-detail="${p.id}">View clothing details ${icon("arrow")}</button><small>${p.sellers.length > 1 ? `${p.sellers.length} sellers compared` : "1 verified seller"}</small></div><small class="price-date">Price checked Oct 16, 2026 · shipping & tax extra</small></div></article>`;
}
function renderResults() {
  const pref = preferences();
  if (!pref) return;
  const brand = $("#brand-filter").value;
  state.shown = searchProducts(products, {
    ...pref,
    query: state.query,
    category: state.category,
    brand,
    sort: state.sort,
  });
  $("#results-title").textContent = state.query
    ? "Search results"
    : categoryNames[state.category];
  $("#results-subtitle").textContent =
    `${state.shown.length} ${state.shown.length === 1 ? "garment" : "garments"}${state.query ? ` for “${state.query}”` : " in the catalog"}`;
  const tags = [
    state.query && ["query", state.query],
    state.category !== "all" && ["category", categoryNames[state.category]],
    brand !== "all" && ["brand", brand],
    pref.budget !== null && [
      "budget",
      `Up to ${money(pref.budget)} / purchase`,
    ],
    ...pref.clothingFlags.map((flag) => [flag, clothingFlagNames[flag]]),
  ].filter(Boolean);
  $("#input-summary").innerHTML = tags
    .map(
      ([key, label]) =>
        `<button type="button" class="filter-tag removable-filter" data-remove-filter="${esc(key)}" aria-label="Remove ${esc(label)} filter">${esc(label)} ${icon("close")}</button>`,
    )
    .join("");
  $("#ranking-explanation").textContent = rankingDescriptions[state.sort];
  $("#result-cards").innerHTML = state.shown.map(productCard).join("");
  const empty = $("#results-empty");
  empty.hidden = state.shown.length > 0;
  if (!empty.hidden)
    empty.innerHTML = `${icon("search")}<h3>No clothing matches this search.</h3><p>${isMedicationQuery(state.query) ? "This catalog contains clothing only. It does not search medicines or treatments." : "Try a garment type, brand or a simpler fabric keyword. Our small catalog covers T-shirts, pants and underwear (briefs and boxers). Selected requirements exclude unknowns; a zero result does not mean the item is unavailable elsewhere."}</p><button class="button secondary" id="reset-search">Clear search & filters</button>`;
  syncSaved();
}
$("#results-empty").addEventListener("click", (event) => {
  if (event.target.closest("#reset-search")) clearFilters(true);
});
$("#input-summary").addEventListener("click", (event) => {
  const key = event.target.closest("[data-remove-filter]")?.dataset
    .removeFilter;
  if (!key) return;
  if (key === "query") {
    state.query = "";
    $("#product-search").value = "";
  } else if (key === "category") {
    state.category = "all";
    syncCategory();
  } else if (key === "brand") $("#brand-filter").value = "all";
  else if (key === "budget") $("#budget").value = "";
  else
    $$("#textile-preferences input")
      .filter((input) => input.value === key)
      .forEach((input) => (input.checked = false));
  renderResults();
});

function clothingCriteria(p) {
  return Object.entries(clothingFlagNames)
    .map(
      ([key, label]) =>
        `<li><span>${esc(label)}</span><strong>${p.clothing[key] === true ? "Documented by source*" : p.clothing[key] === false ? "Does not meet criterion" : "Not verified"}</strong></li>`,
    )
    .join("");
}
const dialog = $("#detail-dialog");
function openDialog(html, view) {
  $("#dialog-content").innerHTML = html;
  $("#dialog-content").dataset.view = view;
  if (!dialog.open) dialog.showModal();
  placeToast();
  dialog.scrollTop = 0;
  syncSaved();
}
$(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  if (!dialog.open) placeToast();
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
});
function showProduct(id) {
  const p = products.find((p) => p.id === id);
  if (!p) return;
  const prices = p.sellers.map((s) => s.price),
    journey = getLifecycle(p);
  const noteLabels = {
    fit: "Fit & coverage",
    waistband: "Waistband & elastic",
    seams: "Seams & thread",
    labels: "Labels",
    finishes: "Dyes & finishes",
  };
  openDialog(
    `
    <div class="modal-heading"><span class="eyebrow">CLOTHING, CONSTRUCTION & EVERYDAY COMFORT</span><h2 id="dialog-title">${esc(p.brand)} ${esc(p.name)}</h2></div>
    <div class="detail-grid"><div class="detail-image"><img src="${p.imageUrl}" alt="${esc(p.imageAlt)}"></div><div><span class="tag tag-muted">${esc(productLabel(p))}</span><p>${esc(p.function)}</p><div class="detail-price">${money(p.price)} <small>${p.unitCount > 1 ? `per ${p.unitCount}-pack · ${money(p.price / p.unitCount)} per garment` : `per ${esc(p.priceUnit)}`}</small></div><p class="small muted">US price snapshot · October 16, 2026<br>Shipping and tax excluded. Check size, color, pack quantity and current price.</p><button class="button secondary detail-save" data-save="${p.id}" aria-pressed="false"><span data-save-icon aria-hidden="true">${icon("bookmark")}</span><span data-save-label>Save clothing</span></button></div></div>
    <div class="sensitivity-note">${icon("info")}<p><strong>Compare construction, not a promise of comfort.</strong> ${esc(p.eczema.sensitiveNote)}</p></div>
    <section class="modal-section"><h3>Clothing requirements</h3><ul class="property-list">${clothingCriteria(p)}</ul><p class="small muted">*Based on cited product disclosures, not independent testing. Cotton percentage and wool exclusions concern main fabric. A covered elastic waistband may still contain latex; an unknown latex claim does not mean latex-free.</p></section>
    <section class="modal-section"><h3>What touches your skin</h3><dl class="construction-list">${Object.entries(
      noteLabels,
    )
      .map(
        ([key, label]) =>
          `<div><dt>${label}</dt><dd>${esc(p.clothingNotes[key])}</dd></div>`,
      )
      .join("")}</dl></section>
    <section class="modal-section"><h3>Fabric & components</h3><ul class="component-list">${p.components.map((c) => `<li><div><strong>${esc(c.part)}</strong><span>${esc(c.material)}</span></div><span class="tag tag-muted">${esc(c.kind)}</span></li>`).join("")}</ul><p class="small muted">A fabric composition is not a complete chemical disclosure. Dyes, finishes, thread and trims may be unspecified. Natural origin is not an individual tolerance guarantee.</p></section>
    <div class="detail-grid"><section class="modal-section"><h3>Product highlights</h3><ul>${p.advantages.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section><section class="modal-section"><h3>Practical trade-offs</h3><ul>${p.tradeoffs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section></div>
    <section class="modal-section"><h3>Washing, care & replacement</h3><p>${esc(p.care)}</p><p>${esc(p.lifespan.label)}</p></section>
    <section class="modal-section material-journey"><span class="eyebrow">CITY WARDROBE → MATERIAL ORIGIN → AFTER USE</span><h3>The material journey</h3><dl><div><dt>Material origins</dt><dd>${esc(journey.origin)}</dd></div><div><dt>Care & continued use</dt><dd>${esc(journey.care)}</dd></div><div><dt>After use</dt><dd>${esc(journey.afterUse)}</dd></div><div><dt>What remains unknown</dt><dd>${esc(journey.unknowns)}</dd></div></dl><details><summary>Material & disposal sources</summary><ul>${journey.sources.map((s) => `<li>${external(s.url, s.title)}</li>`).join("")}</ul></details></section>
    <section class="modal-section"><h3>Price & shopping information</h3><p>${prices.length > 1 ? `Same-item seller range: <strong>${money(Math.min(...prices))}–${money(Math.max(...prices))}</strong>.` : "One verified seller; no comparative seller price range is available."}</p>${p.stockNote ? `<p class="stock-note">${esc(p.stockNote)}</p>` : ""}${p.sellers.map((s) => `<div class="seller-row"><div><strong>${esc(s.name)}</strong><small>${esc(s.shipping)}<br>Checked ${esc(s.checkedAt)} · ${s.unitCount} garment(s) per purchase</small></div><strong>${money(s.price)}</strong>${external(s.url, "Visit seller", "button secondary")}</div>`).join("")}<p class="small muted">Check sizing and return restrictions, especially for underwear. No Rooted checkout or affiliate commissions.</p></section>
    <section class="modal-section"><h3>Sources</h3><ul class="source-list">${p.sources.map((s) => `<li>${external(s.url, s.title)}</li>`).join("")}</ul></section>`,
    "product",
  );
}
function showSaved() {
  const entries = products.filter((p) => saved.has(p.id));
  openDialog(
    `<div class="modal-heading"><span class="eyebrow">A LITTLE LATER</span><h2 id="dialog-title">Your saved clothing.</h2><p>Stored on this browser, ready when you need them.</p></div>${entries.length ? `<div class="saved-list">${entries.map((p) => `<article><img src="${p.imageUrl}" alt="${esc(p.imageAlt)}"><div><span class="mini-label">${esc(p.brand)}</span><h3>${esc(p.name)}</h3><p>${money(p.price)} · ${esc(productLabel(p))}</p><button class="text-link" data-detail="${p.id}">View details ${icon("arrow")}</button></div><button class="icon-button" data-save="${p.id}" aria-pressed="true" aria-label="Unsave ${esc(p.name)}">${icon("bookmark")}</button></article>`).join("")}</div>` : `<div class="empty-state">${icon("bookmark")}<h3>Your clothing shortlist starts here.</h3><p>Use the bookmark on any garment to save it here.</p></div>`}`,
    "saved",
  );
}
$("#saved-button").addEventListener("click", showSaved);
document.addEventListener("click", (event) => {
  const save = event.target.closest("[data-save]");
  const detail = event.target.closest("[data-detail]");
  if (save) toggleSaved(save.dataset.save);
  else if (detail) showProduct(detail.dataset.detail);
});

function renderMaterial(key) {
  const group = materialGroups[key];
  $("#material-panel").setAttribute("aria-labelledby", `material-tab-${key}`);
  $("#material-panel").innerHTML =
    `<div class="material-panel-copy"><h3>${esc(group.title)}</h3><p>${esc(group.intro)}</p>${external(group.source, group.sourceLabel, "guide-source")}</div><div class="material-chips">${group.items.map((item) => `<span>${icon("layers")}${esc(item)}</span>`).join("")}</div>`;
}
function initMaterialExplorer() {
  const options = Object.entries(materialGroupLabels)
    .map(
      ([group, label]) =>
        `<optgroup label="${esc(label)}">${materialProfiles
          .filter((p) => p.group === group)
          .map((p) => `<option value="${p.id}">${esc(p.name)}</option>`)
          .join("")}</optgroup>`,
    )
    .join("");
  const left = $("#fiber-left"),
    right = $("#fiber-right");
  left.innerHTML = right.innerHTML = options;
  left.value = "polyester";
  right.value = "cotton";
  const fields = [
    ["origin", "Origin & processing"],
    ["skinConsideration", "Against your skin"],
    ["care", "Everyday care"],
    ["tradeoff", "Trade-offs to weigh"],
    ["endOfLife", "After use"],
  ];
  function render() {
    const pair = [left.value, right.value].map((id) =>
      materialProfiles.find((p) => p.id === id),
    );
    if (pair.some((p) => !p)) return;
    $("#fiber-status").textContent =
      pair[0].id === pair[1].id
        ? `Both columns show ${pair[0].name}. Choose different materials to compare.`
        : `Comparing ${pair[0].name} with ${pair[1].name}.`;
    $("#fiber-comparison").innerHTML =
      `<div class="fiber-table-wrap" role="region" aria-label="Material comparison table" tabindex="0"><table class="fiber-table"><caption class="sr-only">Material comparison: ${esc(pair[0].name)} and ${esc(pair[1].name)}</caption><thead><tr><th scope="col">Consideration</th>${pair.map((p) => `<th scope="col"><span class="fiber-category ${p.group}">${esc(materialGroupLabels[p.group])}</span><strong>${esc(p.name)}</strong></th>`).join("")}</tr></thead><tbody>${fields.map(([key, title]) => `<tr><th scope="row">${title}</th>${pair.map((p) => `<td data-material-name="${esc(p.name)}">${esc(p[key])}</td>`).join("")}</tr>`).join("")}</tbody></table></div><details class="fiber-sources"><summary>Sources for this comparison</summary><div>${pair.map((p) => `<section><h4>${esc(p.name)}</h4><ul>${p.sources.map((s) => `<li>${external(s.url, s.title)}</li>`).join("")}</ul></section>`).join("")}</div></details><p class="fiber-same-note" ${pair[0].id === pair[1].id ? "" : "hidden"}>Both columns show the same material. Choose another to compare.</p>`;
  }
  left.addEventListener("change", render);
  right.addEventListener("change", render);
  $("#explore-cotton-search").addEventListener("click", () => {
    activateInput($("#tab-search"));
    clearFilters(true);
    runSearch({ query: "cotton", category: "tshirt" });
  });
  render();
}
tabSet($$("[data-material]"), (button) =>
  renderMaterial(button.dataset.material),
);
$("#methodology-button").addEventListener("click", () =>
  openDialog(
    `<div class="modal-heading"><span class="eyebrow">OUR APPROACH</span><h2 id="dialog-title">Search with the details in view.</h2></div><section class="modal-section"><h3>A focused clothing catalog</h3><p>Search ${products.length} researched garments across T-shirts, pants and underwear (briefs and boxers). Search names, brands and main-fabric words, or choose a category. This is a catalog search, not a live search of every retailer.</p><h3>Evidence behind your filters</h3><p>Checked requirements need documented positive matches; unknowns do not pass. Cotton-rich means at least 90% cotton in the main fabric. Wool exclusions concern main fabric. Latex-free requires an explicit manufacturer claim; covered elastic is a separate criterion.</p><h3>How results are sorted</h3><p>Relevance uses matching catalog terms, with stable ordering for ties. Purchase-price sorts use the whole pack price. Construction transparency counts documented criteria, including explicit absences; it is not a medical safety score.</p><h3>City life and nature life</h3><p>Explore the materials behind an everyday wardrobe: origins, seams, finishes, care and end of use. Natural origin alone does not establish skin tolerance or total environmental impact.</p><h3>Photo search</h3><p>Photo analysis suggests a garment category for you to confirm. It cannot verify fiber content, latex, finishes, size or individual comfort. Any fabric keywords you enter are search terms, not verified observations.</p><p>${external(guidanceSources.aad, "AAD clothing guidance")} · ${external(guidanceSources.clothing, "Eczema UK clothing guide")}</p></section>`,
    "methodology",
  ),
);
$("#privacy-button").addEventListener("click", () =>
  openDialog(
    `<div class="modal-heading"><span class="eyebrow">PRIVACY & SOURCES</span><h2 id="dialog-title">Your clothing preferences stay with you.</h2></div><section class="modal-section"><h3>Local by design</h3><p>Only saved garment IDs persist in localStorage. Search descriptions, preferences and photos are not saved by Rooted or sent to an analysis server. Photos run locally. We do not collect a diagnosis or include analytics.</p><h3>External requests</h3><p>Fonts load from Google Fonts. Optional photo analysis downloads code from jsDelivr and model files from Hugging Face. These services receive ordinary request information such as an IP address; photos and typed garment details are not sent to them. Seller sites have their own policies.</p><h3>Clothing facts and photos</h3><p>Product details link to manufacturers and retailers, including uncertainty and conflicting labels. US prices were checked October 16, 2026 and are not live. The homepage uses actual catalog clothing photos. No sponsored placement or affiliate commission is included.</p><button class="button secondary" id="clear-saved">Clear saved clothing</button></section>`,
    "privacy",
  ),
);
$("#dialog-content").addEventListener("click", (event) => {
  if (event.target.closest("#clear-saved")) {
    saved.clear();
    try {
      localStorage.removeItem(savedKey);
      savedPersisted = true;
      toast("Saved clothing cleared from this browser.");
    } catch {
      savedPersisted = false;
      toast(
        "Cleared for this visit. Browser storage is unavailable; saved items may return after a reload.",
      );
    }
    syncSaved();
  }
});

initMaterialExplorer();
renderMaterial("fabrics");
syncCategory();
renderResults();
