import {
  renderMaterialOptions,
  renderShoppingAction,
} from "./ezr-shopping.js?v=retail3";
import {
  products,
  MATERIALS,
  MATERIAL_GROUPS,
  CATEGORY_LABELS,
} from "./ezr-catalog.js?v=retail3";
import {
  searchCatalog,
  findAlternatives,
  compositionLabel,
  validateProduct,
} from "./ezr-matching.js?v=retail3";

const $ = (selector) => document.querySelector(selector);
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const label = (material) =>
  MATERIALS.find((item) => item.id === material)?.label ?? material;
const money = (value) =>
  typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value)
    : "Price unavailable";

// Preferences are deliberately session-only. They never enter URLs or storage.
const state = {
  query: "",
  prefer: [],
  avoid: [],
  maxPrice: null,
  sort: "recommended",
  reference: null,
  hasSearched: false,
};
let currentItems = [];
const dialog = $("#detail-dialog");
const noticeKey = "ezr.retailer-notice.v3";
const catalogErrors = products.flatMap((product) =>
  validateProduct(product).map((error) => `${product.id}: ${error}`),
);

function options() {
  return {
    query: state.query,
    prefer: state.prefer,
    avoid: state.avoid,
    maxPrice: state.maxPrice,
    sort: state.sort,
  };
}

function renderMaterialControls() {
  for (const type of ["prefer", "avoid"]) {
    const select = $(`#${type}-material`);
    select.innerHTML = renderMaterialOptions(MATERIAL_GROUPS, state[type]);
    $(`#${type}-chips`).innerHTML = state[type]
      .map(
        (material) =>
          `<button class="selection-chip" type="button" data-remove="${type}" data-material="${escape(material)}" aria-label="Remove ${escape(label(material))} from ${type}">${escape(label(material))}<span aria-hidden="true">×</span></button>`,
      )
      .join("");
  }
}

function missingDetails(product) {
  const notices = [];
  if (product.composition_status === "unknown")
    notices.push("Fabric composition unavailable.");
  else if (product.composition_status !== "complete")
    notices.push("Fabric composition incomplete.");
  if (product.trims_status !== "complete")
    notices.push("Textile trim fibers unknown.");
  return notices.join(" ");
}

function trimLabel(product) {
  if (!product.trim_materials.length)
    return product.trims_status === "complete"
      ? "No additional textile trim fibers in this record."
      : "Not disclosed.";
  return (
    product.trim_materials.map(label).join(", ") +
    (product.trims_status === "unknown" ? " · other trim fibers unknown" : "")
  );
}

function priceLabel(product) {
  return `${escape(money(product.price))} <small>USD / ${escape(product.price_unit || "item")}</small>`;
}

function listingNotes(product) {
  return [
    product.composition_note,
    product.trim_note,
    product.purchase_note,
    product.availability_note,
  ]
    .filter(Boolean)
    .map((note) => `<p class="data-warning">${escape(note)}</p>`)
    .join("");
}

function priceSource(product) {
  return `<p class="price-source">${escape(product.retailer_name)} · Price checked ${escape(product.source_checked_at)}</p>`;
}

function shortReason(item) {
  // The explanation is selected from the same facts that the ranking engine used.
  const preferred = item.reasons.find((reason) =>
    /matches a preference/i.test(reason),
  );
  return preferred || item.reasons[0] || "Explore the details in this catalog.";
}

function productCard(item) {
  const product = item.product;
  const warning = missingDetails(product);
  const descriptions = [...new Set([...item.reasons, ...item.details])];
  return `<article class="product-card" aria-labelledby="name-${escape(product.id)}">
    <button class="product-image" type="button" data-details="${escape(product.id)}" aria-label="View details for ${escape(product.name)}">
      <img src="${escape(product.image_url)}" alt="Garment sketch: ${escape(CATEGORY_LABELS[product.category])}" width="360" height="360" loading="lazy" />
      <span class="demo-badge">Garment sketch</span><span class="image-detail" aria-hidden="true">↗</span>
    </button>
    <div class="card-body"><div class="card-meta"><span>${escape(CATEGORY_LABELS[product.category])}</span><span>${escape(product.colors.join(" / ") || "Color unknown")}</span></div>
      <h3 class="card-name" id="name-${escape(product.id)}"><button type="button" data-details="${escape(product.id)}">${escape(product.name)}</button></h3>
      <p class="card-price">${priceLabel(product)}</p>${priceSource(product)}
      <p class="composition"><span>Main fabric</span>${escape(compositionLabel(product))}</p>
      <p class="attributes">Sizes: ${escape(product.sizes.length ? product.sizes.join(" · ") : "Not disclosed")}<br />Trims: ${escape(trimLabel(product))}</p>
      ${warning ? `<p class="data-warning">${escape(warning)}</p>` : ""}
      ${product.purchase_note ? `<p class="data-warning">${escape(product.purchase_note)}</p>` : ""}
      <p class="match-line">${escape(shortReason(item))}</p>
      <details class="why-match"><summary>Why this match?<span aria-hidden="true">+</span></summary><ul>${descriptions.map((reason) => `<li>${escape(reason)}</li>`).join("")}<li>Matching uses recorded attributes and your choices, not a medical suitability score.</li></ul></details>
    </div>
    <div class="card-actions">${renderShoppingAction(product)}<button type="button" class="similar-button" data-similar="${escape(product.id)}" aria-label="Find similar alternatives to ${escape(product.name)}">Find similar alternatives <span aria-hidden="true">↗</span></button></div>
  </article>`;
}

function renderReference() {
  const reference = state.reference;
  const panel = $("#reference-panel");
  panel.hidden = !reference;
  panel.innerHTML = reference
    ? `<img src="${escape(reference.image_url)}" alt="Reference garment illustration" /><div class="reference-copy"><span>Your starting point · ${escape(CATEGORY_LABELS[reference.category])}</span><h3>${escape(reference.name)}</h3><p>Same category. Your current preferences, exclusions and budget still apply.</p></div><button class="button secondary" type="button" data-back-search>← Back to search</button>`
    : "";
}

function renderResults({ focus = false } = {}) {
  const results = state.reference
    ? findAlternatives(products, state.reference, options())
    : searchCatalog(products, options());
  currentItems = state.hasSearched ? results.items : [];
  renderReference();
  const title = state.reference
    ? "Similar alternatives"
    : "Your search results";
  $("#results-title").innerHTML =
    `${escape(title)} <span>${results.total}</span>`;
  const error =
    results.error ||
    (catalogErrors.length
      ? "Some catalog records need review. Only valid records are shown."
      : "");
  $("#preference-error").hidden = !error;
  $("#preference-error").textContent = error;
  $("#max-price").setAttribute(
    "aria-invalid",
    String(
      state.maxPrice !== null &&
        (!Number.isFinite(state.maxPrice) || state.maxPrice < 0),
    ),
  );
  $("#clear-search").hidden = !$("#search-input").value;
  $("#results").hidden = !state.hasSearched;
  if (!state.hasSearched) {
    $("#product-grid").replaceChildren();
    $("#result-status").textContent = "";
    $("#omission-note").textContent = "";
    $("#omission-note").hidden = true;
    $("#empty-state").hidden = true;
    return;
  }
  const context = state.reference
    ? ` similar alternative${results.total === 1 ? "" : "s"} for ${state.reference.name}`
    : state.query
      ? ` result${results.total === 1 ? "" : "s"} for “${state.query}”`
      : ` result${results.total === 1 ? "" : "s"}`;
  const active = [
    state.prefer.length ? `Prefer: ${state.prefer.map(label).join(", ")}.` : "",
    state.avoid.length ? `Avoid: ${state.avoid.map(label).join(", ")}.` : "",
    state.maxPrice !== null &&
    Number.isFinite(state.maxPrice) &&
    state.maxPrice >= 0
      ? `Up to ${money(state.maxPrice)}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  $("#result-status").textContent =
    `${results.total}${context}. ${active}${state.sort !== "recommended" ? " Price order selected; material exclusions still apply." : ""}`;
  const omission = [];
  if (results.excludedMaterials)
    omission.push(
      `${results.excludedMaterials} ${results.excludedMaterials === 1 ? "item contains" : "items contain"} an avoided fiber and ${results.excludedMaterials === 1 ? "was" : "were"} excluded.`,
    );
  if (results.omittedUnknown)
    omission.push(
      `${results.omittedUnknown} ${results.omittedUnknown === 1 ? "item was" : "items were"} also hidden because fabric or textile trim composition could not be verified against your exclusions.`,
    );
  $("#omission-note").hidden = !omission.length;
  $("#omission-note").textContent = omission.join(" ");
  $("#product-grid").innerHTML = results.items.map(productCard).join("");
  const empty = $("#empty-state");
  empty.hidden = !!results.total;
  empty.innerHTML = results.total
    ? ""
    : `<div class="empty-mark" aria-hidden="true">✳</div><h3>${results.conflicts.length ? "A preference needs a second look." : state.reference ? "No alternatives meet these choices." : "No matches just yet."}</h3><p>${escape(results.conflicts.length ? `You both prefer and avoid ${results.conflicts.map(label).join(", ")}. Remove one selection to continue.` : results.error || (state.reference ? "We kept your category, budget and exclusions in place. Adjust your choices above, or return to your search." : "Try fewer search words or adjust your budget and material choices. Your exclusions have not been relaxed."))}</p><div class="empty-actions">${state.reference ? '<button class="button secondary" data-back-search type="button">Back to search</button>' : ""}<button class="button primary" type="button" data-edit-preferences>${results.conflicts.length ? "Review preferences" : "Adjust search"}</button><button class="button secondary" type="button" data-reset>Reset all</button></div>`;
  $("#clear-search").hidden = !$("#search-input").value;
  if (focus) {
    $("#results-title").focus({ preventScroll: true });
    $("#results").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function submitSearch(query = $("#search-input").value) {
  state.query = query.trim();
  state.reference = null;
  state.hasSearched = true;
  $("#search-input").value = state.query;
  renderResults({ focus: true });
}

function resetAll() {
  Object.assign(state, {
    query: "",
    prefer: [],
    avoid: [],
    maxPrice: null,
    sort: "recommended",
    reference: null,
    hasSearched: false,
  });
  $("#search-input").value = "";
  $("#max-price").value = "";
  $("#sort-order").value = "recommended";
  renderMaterialControls();
  renderResults();
}

function beginSimilar(id) {
  const reference = products.find((product) => product.id === id);
  if (!reference) return;
  if (dialog.open) dialog.close();
  state.reference = reference;
  state.hasSearched = true;
  renderResults({ focus: true });
}

function openDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const result = currentItems.find((item) => item.product.id === id);
  const warning = missingDetails(product);
  $("#detail-content").innerHTML =
    `<div class="detail-layout"><div class="detail-visual"><img src="${escape(product.image_url)}" alt="Garment sketch: ${escape(CATEGORY_LABELS[product.category])}" /></div><div class="detail-info"><p class="eyebrow">Retailer listing · ${escape(CATEGORY_LABELS[product.category])}</p><h2 id="detail-title">${escape(product.name)}</h2><p class="card-price">${priceLabel(product)}</p>${priceSource(product)}<p class="detail-description">${escape(product.description)}</p><dl class="detail-fields"><div><dt>Main fabric</dt><dd>${escape(compositionLabel(product))}</dd></div><div><dt>Textile trim fibers</dt><dd>${escape(trimLabel(product))}</dd></div><div><dt>Color & sizes</dt><dd>${escape(product.colors.join(", ") || "Color unavailable")} · ${escape(product.sizes.join(", ") || "Sizes unavailable")}</dd></div><div><dt>Data source</dt><dd>${escape(product.retailer_name)} · Checked ${escape(product.source_checked_at)}</dd></div></dl>${warning ? `<p class="data-warning">${escape(warning)}</p>` : ""}${listingNotes(product)}${result ? `<div class="detail-reasons"><h3>Why this match?</h3><ul>${[...new Set([...result.reasons, ...result.details])].map((reason) => `<li>${escape(reason)}</li>`).join("")}</ul></div>` : ""}${renderShoppingAction(product)}<button class="button secondary" type="button" data-similar="${escape(product.id)}">Find similar alternatives <span aria-hidden="true">↗</span></button><p class="detail-note">Fabric and textile trim information does not identify dyes, finishes, or your personal triggers. EZR does not guarantee skin compatibility or medically certify clothing.</p></div></div>`;
  dialog.showModal();
  $("#close-details").focus();
}

$("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  submitSearch();
});
$("#search-input").addEventListener("input", () => {
  $("#clear-search").hidden = !$("#search-input").value;
});
$("#clear-search").addEventListener("click", () => {
  $("#search-input").value = "";
  state.query = "";
  state.reference = null;
  state.hasSearched = false;
  renderResults();
  $("#search-input").focus();
});
for (const type of ["prefer", "avoid"]) {
  $(`#${type}-material`).addEventListener("change", (event) => {
    const material = event.target.value;
    if (!material || state[type].includes(material)) return;
    state[type].push(material);
    renderMaterialControls();
    renderResults();
  });
}
$("#max-price").addEventListener("input", (event) => {
  // A blank budget is unrestricted; invalid input remains an error, never silently relaxed.
  state.maxPrice = event.target.validity.badInput
    ? NaN
    : event.target.value === ""
      ? null
      : Number(event.target.value);
  renderResults();
});
$("#sort-order").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderResults();
});
$("#reset-filters").addEventListener("click", resetAll);
$("#close-details").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});

// Delegation keeps card interactions working after every local search render.
document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.example !== undefined)
    submitSearch(target.dataset.example);
  else if (target.dataset.remove) {
    state[target.dataset.remove] = state[target.dataset.remove].filter(
      (material) => material !== target.dataset.material,
    );
    const type = target.dataset.remove;
    renderMaterialControls();
    renderResults();
    $(`#${type}-material`).focus();
  } else if (target.dataset.similar) beginSimilar(target.dataset.similar);
  else if (target.dataset.details) openDetails(target.dataset.details);
  else if (target.hasAttribute("data-back-search")) {
    state.reference = null;
    renderResults({ focus: true });
  } else if (target.hasAttribute("data-reset")) {
    resetAll();
    $("#search-input").focus();
  } else if (target.hasAttribute("data-edit-preferences")) {
    $("#finder").scrollIntoView({ behavior: "smooth" });
    $(
      state.prefer.some((material) => state.avoid.includes(material))
        ? "#avoid-material"
        : "#search-input",
    ).focus({ preventScroll: true });
  }
});

// Storage is optional and only remembers the introductory notice, never preferences.
try {
  $("#retailer-notice").hidden =
    localStorage.getItem(noticeKey) === "dismissed";
} catch {
  $("#retailer-notice").hidden = false;
}
$("#dismiss-notice").addEventListener("click", () => {
  try {
    localStorage.setItem(noticeKey, "dismissed");
  } catch {
    /* Keep the current visit usable; show the notice on a later visit. */
  }
  $("#retailer-notice").hidden = true;
  $("#search-input").focus({ preventScroll: true });
});
$("#show-notice").addEventListener("click", () => {
  $("#retailer-notice").hidden = false;
  $("#dismiss-notice").focus({ preventScroll: true });
});
$("#retailer-notice a").addEventListener("click", () => {
  $("#retailer-notice").hidden = true;
});

// The fabric card opens the guide and retains a useful keyboard focus target.
$("#materials-link").addEventListener("click", (event) => {
  event.preventDefault();
  const guide = $("#material-guide");
  guide.open = true;
  history.pushState(null, "", "#material-guide");
  guide.scrollIntoView({ behavior: "smooth", block: "start" });
  guide.querySelector("summary").focus({ preventScroll: true });
});

renderMaterialControls();
renderResults();
