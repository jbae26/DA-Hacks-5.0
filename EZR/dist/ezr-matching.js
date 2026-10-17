/**
 * Deterministic, client-only catalog matching. Scores describe catalog similarity,
 * never a garment's medical suitability. Avoidance covers fabric and textile
 * trim fibers; dyes, finishes, and individual reactions are outside this data.
 */
export const RANKING_WEIGHTS = Object.freeze({
  preferredMaterialPercentage: 0.4,
  queryNameTerm: 2,
  queryKeywordTerm: 1,
  sharedKeyword: 5,
  sharedColor: 8,
  priceProximity: 12,
  materialSimilarity: 20,
});

const CATEGORIES = new Set(["top", "pants", "underwear"]);
const MATERIAL_ALIASES = new Map([
  ["spandex", "elastane"],
  ["lycra", "elastane"],
  ["rayon", "viscose"],
  ["polyamide", "nylon"],
  ["flax", "linen"],
  ["tencel", "lyocell"],
  ["organic cotton", "cotton"],
]);
const MATERIALS = new Set([
  "cotton",
  "polyester",
  "elastane",
  "nylon",
  "acrylic",
  "wool",
  "silk",
  "linen",
  "hemp",
  "viscose",
  "lyocell",
  "modal",
  "bamboo",
  "bamboo viscose",
  "natural rubber",
  "rubber",
  "latex",
  "cashmere",
  "alpaca",
  "acetate",
]);
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "of",
  "for",
  "with",
  "in",
  "on",
  "to",
  "my",
  "me",
  "find",
  "search",
  "show",
  "please",
  "clothing",
  "clothes",
  "wear",
]);
const text = (value) => (typeof value === "string" ? value : "");
const simple = (value) => text(value).normalize("NFKC").trim().toLowerCase();
const materialName = (value) => {
  const normalized = simple(value).replace(/\s+/g, " ");
  return MATERIAL_ALIASES.get(normalized) ?? normalized;
};
const percentageKnown = (value) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= 100;
const validPrice = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
const unique = (values) => [...new Set(values)];
const compareId = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const capital = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const formatPercentage = (value) => Number(value.toFixed(2)).toString();

/** Return searchable terms as a normalized string; no catalog data is mutated. */
export function normalizeQuery(query) {
  return simple(query)
    .replace(/[’‘]/g, "'")
    .replace(/\b(women|men|kid|girl|boy)'s\b/g, "$1")
    .replace(/\b(?:t[\s-]*shirts?|tshirts?|tees?|shirts?|tops?)\b/g, " top ")
    .replace(/\b(?:trousers?|pants?|slacks)\b/g, " pants ")
    .replace(/\b(?:underpants|underwear)\b/g, " underwear ")
    .replace(/\b(?:briefs?|panties)\b/g, " brief ")
    .replace(/\bboxers?\b/g, " boxer ")
    .replace(/\blong[\s-]*sleeve(?:d|s)?\b/g, " long sleeve ")
    .replace(/\bshort[\s-]*sleeve(?:d|s)?\b/g, " short sleeve ")
    .replace(/\bsleeves\b/g, "sleeve")
    .replace(/\b(?:spandex|lycra)\b/g, "elastane")
    .replace(/\brayon\b/g, "viscose")
    .replace(/\bpolyamide\b/g, "nylon")
    .replace(/\bflax\b/g, "linen")
    .replace(/\btencel\b/g, "lyocell")
    .replace(/\bgrey\b/g, "gray")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word))
    .join(" ");
}

function explicitRetailerUrl(product) {
  if (
    typeof product?.product_url !== "string" ||
    !product.product_url ||
    /\s/.test(product.product_url)
  )
    return null;
  try {
    const url = new URL(product.product_url);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (
      !host.includes(".") ||
      /^(?:localhost|127\.|0\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(
        host,
      )
    )
      return null;
    if (
      /(?:^|\.)(?:example\.(?:com|org|net)|invalid|test|localhost)$/.test(host)
    )
      return null;
    // A supplied product page is required; never construct a seller URL. Decode
    // only for route checks and still return the exact verified source below.
    const route = decodeURIComponent(url.pathname).replace(/\/{2,}/g, "/");
    const segments = route.split("/").filter(Boolean);
    const homeSegment =
      /^(?:[a-z]{2}(?:[-_][a-z]{2})?|[a-z]{3}-[a-z]{2}|shop|(?:home|homepage|index)(?:\.(?:html?|aspx?|php))?)$/i;
    // J.Crew also uses /m/ for product families with an explicit style and
    // selected product code. Its ordinary category pages remain non-actionable.
    const jcrewProductFamily =
      /^(?:www\.)?jcrew\.com$/.test(host) &&
      /^\/m\/(?:mens|womens)\/categories\/clothing\/.+\/[A-Z0-9]{5}\/?$/i.test(
        route,
      ) &&
      /^[A-Z0-9]{5}$/i.test(url.searchParams.get("colorProductCode") || "");
    const hasProductRoute =
      /\/(?:p|products?|prd)\/[^/]+/i.test(route) || jcrewProductFamily;
    if (
      !segments.length ||
      segments.every((segment) => homeSegment.test(segment)) ||
      /\/search(?:-results)?(?:\.(?:do|html?|aspx?|php))?(?:\/|$)/i.test(
        route,
      ) ||
      (!hasProductRoute &&
        /\/(?:categor(?:y|ies)|collections?)(?:\.(?:do|html?|aspx?|php))?(?:\/|$)/i.test(
          route,
        ))
    )
      return null;
    // Parsing is for validation only. Keep the verified source's exact URL,
    // including its query, encoding, case, and explicit port.
    return product.product_url;
  } catch {
    return null;
  }
}

/** Illustrative records deliberately never receive actionable purchase links. */
export function retailerUrl(product) {
  return product?.data_status === "verified" &&
    isDate(product.source_checked_at)
    ? explicitRetailerUrl(product)
    : null;
}

/** Schema errors are human-readable; incomplete disclosure is valid data. */
export function validateProduct(product) {
  if (!product || typeof product !== "object" || Array.isArray(product))
    return ["Product must be an object."];
  const errors = [];
  for (const key of ["id", "name", "description"]) {
    if (!text(product[key]).trim())
      errors.push(`${key} must be a nonempty string.`);
  }
  if (product.retailer_name !== null && !text(product.retailer_name).trim())
    errors.push("retailer_name must be a nonempty string or null.");
  if (!CATEGORIES.has(product.category))
    errors.push("category must be top, pants, or underwear.");
  for (const key of ["keywords", "colors", "sizes", "trim_materials"]) {
    if (
      !Array.isArray(product[key]) ||
      product[key].some((value) => !text(value).trim())
    ) {
      errors.push(`${key} must be an array of nonempty strings.`);
    }
  }
  if (!["complete", "partial", "unknown"].includes(product.composition_status))
    errors.push("composition_status must be complete, partial, or unknown.");
  if (!["complete", "unknown"].includes(product.trims_status))
    errors.push("trims_status must be complete or unknown.");
  if (product.price !== null && !validPrice(product.price))
    errors.push("price must be a nonnegative number or null.");
  if (!/^[A-Z]{3}$/.test(text(product.currency)))
    errors.push("currency must be a three-letter uppercase code.");
  if (typeof product.image_url !== "string" || !product.image_url.trim())
    errors.push("image_url must be a nonempty string.");
  if (!["illustrative", "verified"].includes(product.data_status))
    errors.push("data_status must be illustrative or verified.");
  if (product.source_checked_at !== null && !isDate(product.source_checked_at))
    errors.push("source_checked_at must be an ISO date or null.");
  if (
    product.data_status === "verified" &&
    (!isDate(product.source_checked_at) ||
      !explicitRetailerUrl(product) ||
      !text(product.retailer_name).trim())
  )
    errors.push(
      "Verified products need a retailer name, checked source date, and an explicit HTTPS product page.",
    );
  if (
    product.product_url !== null &&
    product.product_url !== "" &&
    !explicitRetailerUrl(product)
  )
    errors.push(
      "product_url must be a valid explicit HTTPS product page or null.",
    );
  const composition = product.material_composition;
  if (!Array.isArray(composition)) {
    errors.push("material_composition must be an array.");
  } else {
    const seen = new Set();
    let sum = 0;
    for (const component of composition) {
      const material = component?.material;
      if (!MATERIALS.has(material) || materialName(material) !== material)
        errors.push(
          `Use a standardized lowercase fabric material: ${text(material) || "missing"}.`,
        );
      if (seen.has(material))
        errors.push(`Duplicate fabric material: ${material}.`);
      seen.add(material);
      if (
        component?.percentage !== null &&
        !percentageKnown(component?.percentage)
      )
        errors.push(
          "Material percentages must be numbers from 0 to 100 or null.",
        );
      if (percentageKnown(component?.percentage)) sum += component.percentage;
    }
    if (sum > 100.5)
      errors.push("Known fabric percentages cannot total more than 100%.");
    if (
      product.composition_status === "complete" &&
      (!composition.length ||
        composition.some(
          (component) => !percentageKnown(component?.percentage),
        ) ||
        Math.abs(sum - 100) > 0.5)
    )
      errors.push(
        "Complete fabric composition must have known percentages totaling 100% (±0.5%).",
      );
    if (product.composition_status === "unknown" && composition.length)
      errors.push(
        "Unknown fabric composition must use an empty material_composition array; use partial for known fibers.",
      );
    if (product.composition_status === "partial" && !composition.length)
      errors.push(
        "Partial composition needs at least one disclosed fiber; use unknown for no disclosure.",
      );
  }
  for (const material of Array.isArray(product.trim_materials)
    ? product.trim_materials
    : []) {
    if (!MATERIALS.has(material) || materialName(material) !== material)
      errors.push(
        `Use a standardized lowercase textile trim material: ${material}.`,
      );
  }
  return errors;
}

function isDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

/** Keeps unknown composition visibly distinct from an exact blend. */
export function compositionLabel(product) {
  if (
    product?.composition_status === "unknown" ||
    !Array.isArray(product?.material_composition) ||
    !product.material_composition.length
  )
    return "Fabric composition unknown";
  const parts = product.material_composition.map(({ material, percentage }) =>
    percentageKnown(percentage)
      ? `${formatPercentage(percentage)}% ${materialName(material)}`
      : `${capital(materialName(material))} (percentage unknown)`,
  );
  return (
    parts.join(" · ") +
    (product.composition_status === "partial" ? " · Partial disclosure" : "")
  );
}

function blankResult(error = null, conflicts = []) {
  return {
    items: [],
    total: 0,
    omittedUnknown: 0,
    excludedMaterials: 0,
    conflicts,
    error,
  };
}

function readOptions(options = {}) {
  if (!options || typeof options !== "object" || Array.isArray(options))
    return { error: "Search options must be an object." };
  const {
    query = "",
    prefer = [],
    avoid = [],
    maxPrice = null,
    sort = "recommended",
  } = options;
  if (typeof query !== "string") return { error: "Enter a text search." };
  if (maxPrice !== null && !validPrice(maxPrice))
    return { error: "Maximum price must be a valid nonnegative number." };
  if (!["recommended", "price-asc", "price-desc"].includes(sort))
    return { error: "Choose a supported sort order." };
  if (
    ![prefer, avoid].every(
      (values) =>
        Array.isArray(values) &&
        values.every(
          (value) =>
            typeof value === "string" && MATERIALS.has(materialName(value)),
        ),
    )
  )
    return { error: "Choose supported material preferences and exclusions." };
  const normalizedPrefer = unique(prefer.map(materialName));
  const normalizedAvoid = unique(avoid.map(materialName));
  const conflicts = normalizedPrefer.filter((material) =>
    normalizedAvoid.includes(material),
  );
  const weights = { ...RANKING_WEIGHTS };
  if (options.weights !== undefined) {
    if (
      !options.weights ||
      typeof options.weights !== "object" ||
      Array.isArray(options.weights)
    )
      return { error: "Ranking weights must be an object." };
    for (const [key, value] of Object.entries(options.weights)) {
      if (!(key in weights) || !validPrice(value))
        return {
          error: "Ranking weights must be known, finite, nonnegative values.",
        };
      weights[key] = value;
    }
  }
  return {
    query: normalizeQuery(query),
    prefer: normalizedPrefer,
    avoid: normalizedAvoid,
    maxPrice,
    sort,
    conflicts,
    weights,
  };
}

const tokens = (value) =>
  unique(normalizeQuery(value).split(" ").filter(Boolean));
const materialTokens = new Set([...MATERIALS].flatMap(tokens));
function catalogTokens(product) {
  // Description is intentionally excluded: it may contain cautions or negations.
  // Material terms must come from disclosure, not "polyester-free" marketing.
  const indexed = new Set(
    tokens(
      [
        product.name,
        product.category,
        product.retailer_name,
        ...product.keywords,
        ...product.colors,
      ].join(" "),
    ).filter((token) => !materialTokens.has(token)),
  );
  for (const component of product.material_composition) {
    if (component.percentage === 0) continue;
    for (const token of tokens(component.material)) indexed.add(token);
    if (percentageKnown(component.percentage))
      indexed.add(formatPercentage(component.percentage));
  }
  return indexed;
}

function knownFabric(product) {
  return new Map(
    product.material_composition
      .filter(
        (component) =>
          percentageKnown(component.percentage) && component.percentage > 0,
      )
      .map(({ material, percentage }) => [material, percentage]),
  );
}

function excludedFiber(product, avoid) {
  const present = new Set([
    ...product.material_composition
      .filter((component) => component.percentage !== 0)
      .map(({ material }) => material),
    ...product.trim_materials,
  ]);
  return avoid.some((material) => present.has(material));
}

function preferenceScore(product, options, reasons) {
  let score = 0;
  const fabric = knownFabric(product);
  for (const material of options.prefer) {
    const percentage = fabric.get(material);
    if (!percentage) continue;
    score += percentage * options.weights.preferredMaterialPercentage;
    reasons.push(
      `${formatPercentage(percentage)}% ${material} in disclosed fabric matches a preference.`,
    );
  }
  return score;
}

function disclosureDetails(product, options) {
  const details = [];
  if (product.composition_status !== "complete")
    details.push(
      "Fabric disclosure is incomplete; unknown percentages receive no preference bonus.",
    );
  if (product.trims_status !== "complete")
    details.push("Textile trim fibers are not fully disclosed.");
  if (product.price === null)
    details.push(
      "Price is unknown; this item cannot pass a maximum-price filter.",
    );
  if (options.avoid.length)
    details.push(
      "Exclusions check disclosed fabric and textile trim fibers only. Dyes, finishes, and individual skin suitability are not assessed.",
    );
  if (product.data_status === "illustrative")
    details.push(
      "Illustrative catalog item; price and availability are not verified.",
    );
  return details;
}

function compareResults(a, b, sort) {
  if (sort !== "recommended") {
    const aKnown = validPrice(a.product.price),
      bKnown = validPrice(b.product.price);
    if (aKnown !== bKnown) return aKnown ? -1 : 1;
    if (aKnown && a.product.price !== b.product.price)
      return sort === "price-asc"
        ? a.product.price - b.product.price
        : b.product.price - a.product.price;
  }
  return b.score - a.score || compareId(a.product.id, b.product.id);
}

function run(products, rawOptions, reference = null) {
  const options = readOptions(rawOptions);
  if (options.error) return blankResult(options.error);
  if (options.conflicts.length)
    return blankResult(
      "A material cannot be both preferred and excluded. Resolve the conflicting selections.",
      options.conflicts,
    );
  if (!Array.isArray(products)) return blankResult("Catalog must be an array.");
  if (reference && validateProduct(reference).length)
    return blankResult(
      "Choose a valid reference item to find similar clothing.",
    );
  const result = blankResult();
  const terms = tokens(options.query);
  const seen = new Set();
  for (const product of products) {
    // Malformed records cannot silently bypass a hard filter.
    if (validateProduct(product).length || seen.has(product.id)) continue;
    seen.add(product.id);
    if (
      reference &&
      (product.id === reference.id || product.category !== reference.category)
    )
      continue;
    if (
      options.maxPrice !== null &&
      (!validPrice(product.price) ||
        product.currency !== "USD" ||
        product.price > options.maxPrice)
    )
      continue;
    if (!reference && terms.length) {
      const index = catalogTokens(product);
      if (!terms.every((term) => index.has(term))) continue;
    }
    // Count exclusions only after query/category/budget match. Known avoided
    // fibers take precedence over incomplete disclosure, so counts never overlap.
    if (excludedFiber(product, options.avoid)) {
      result.excludedMaterials++;
      continue;
    }
    if (
      options.avoid.length &&
      (product.composition_status !== "complete" ||
        product.trims_status !== "complete")
    ) {
      result.omittedUnknown++;
      continue;
    }
    const reasons = [];
    let score = preferenceScore(product, options, reasons);
    if (reference) {
      score += similarityScore(product, reference, options.weights, reasons);
    } else if (terms.length) {
      reasons.unshift(`Matches all search terms: ${options.query}.`);
      const nameTerms = tokens(product.name);
      const keywordTerms = tokens(product.keywords.join(" "));
      score +=
        terms.filter((term) => nameTerms.includes(term)).length *
        options.weights.queryNameTerm;
      score +=
        terms.filter((term) => keywordTerms.includes(term)).length *
        options.weights.queryKeywordTerm;
    }
    if (options.avoid.length)
      reasons.push(
        "Selected fibers are absent from the disclosed fabric and textile trims.",
      );
    if (!reasons.length) reasons.push("Available in the clothing catalog.");
    result.items.push({
      product,
      score: Math.round(score * 10000) / 10000,
      reasons,
      details: disclosureDetails(product, options),
    });
  }
  result.items.sort((a, b) => compareResults(a, b, options.sort));
  result.total = result.items.length;
  return result;
}

function similarityScore(product, reference, weights, reasons) {
  let score = 0;
  reasons.unshift(
    `Same clothing category: ${product.category === "top" ? "tops" : product.category}.`,
  );
  const referenceKeywords = new Set(
    reference.keywords.map(normalizeQuery).filter(Boolean),
  );
  const sharedKeywords = unique(
    product.keywords
      .map(normalizeQuery)
      .filter(
        (keyword) =>
          keyword && referenceKeywords.has(keyword) && !CATEGORIES.has(keyword),
      ),
  )
    .sort(compareId)
    .slice(0, 6);
  if (sharedKeywords.length) {
    score += sharedKeywords.length * weights.sharedKeyword;
    reasons.push(`Shared style details: ${sharedKeywords.join(", ")}.`);
  }
  const referenceColors = new Set(reference.colors.map(normalizeQuery));
  const sharedColors = unique(
    product.colors
      .map(normalizeQuery)
      .filter((color) => color && referenceColors.has(color)),
  ).sort(compareId);
  if (sharedColors.length) {
    score += weights.sharedColor;
    reasons.push(`Shared color: ${sharedColors.join(", ")}.`);
  }
  if (
    validPrice(product.price) &&
    validPrice(reference.price) &&
    product.currency === reference.currency
  ) {
    const closeness =
      1 -
      Math.abs(product.price - reference.price) /
        Math.max(product.price, reference.price, 1);
    score += closeness * weights.priceProximity;
    if (closeness >= 0.75)
      reasons.push(
        `Similar listed price to the reference item (${reference.currency}).`,
      );
  }
  const referenceFabric = knownFabric(reference);
  const sharedFabric = [];
  let overlap = 0;
  for (const [material, percentage] of knownFabric(product)) {
    if (!referenceFabric.has(material)) continue;
    overlap += Math.min(percentage, referenceFabric.get(material));
    sharedFabric.push(material);
  }
  if (sharedFabric.length) {
    score += (overlap / 100) * weights.materialSimilarity;
    reasons.push(
      `Shared disclosed fabric fibers: ${sharedFabric.sort(compareId).join(", ")}.`,
    );
  }
  return score;
}

export function searchCatalog(products, options = {}) {
  return run(products, options);
}

/** Reference replaces the text query; category and every hard filter stay fixed. */
export function findAlternatives(products, reference, options = {}) {
  if (!reference)
    return blankResult("Choose a reference item to find similar clothing.");
  if (!options || typeof options !== "object" || Array.isArray(options))
    return blankResult("Search options must be an object.");
  // Query deliberately has no role in similarity mode, including malformed text.
  return run(products, { ...options, query: "" }, reference);
}
