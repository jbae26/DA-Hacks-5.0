/** Recognition uses a small garment vocabulary, not material or medical analysis. */
const CATEGORY_PATTERNS = {
  tshirt: [/\bt[\s-]?shirts?\b/i, /\btees?\b/i, /T恤|t恤|短袖衫|圆领衫/u],
  pants: [
    /\b(?:pants|trousers?|joggers?|jeans|sweatpants|chinos|slacks)\b/i,
    /裤子|长裤|牛仔裤|运动裤|休闲裤|阔腿裤|西裤/u,
  ],
  underwear: [
    /\b(?:underwear|underpants|briefs?|boxers?|panties)\b/i,
    /内裤|内衣/u,
  ],
};
const UNSUPPORTED_GARMENT_PATTERN =
  /\b(?:bras?|brassieres?|bralettes?)\b|胸罩|文胸/iu;
const CLOTHING_FLAGS = [
  "cottonRich",
  "woolFree",
  "latexFree",
  "coveredElastic",
  "flatSeams",
  "noSewnLabel",
];

const MEDICATION_PATTERN =
  /\b(?:hydrocortisone|triamcinolone|clobetasol|desonide|tacrolimus|pimecrolimus|ruxolitinib|crisaborole|dupilumab|eucrisa|opzelura|dupixent|protopic|elidel|prescriptions?|steroids?|corticosteroids?|medicated|rx)\b|药膏|激素/iu;

/** Consumer garments cannot stand in for treatment. */
export function isMedicationQuery(text) {
  if (typeof text !== "string") return false;
  const normalized = text.normalize("NFKC").replace(/[‐‑‒–—]/g, "-");
  const withoutNegativeLabels = normalized.replace(
    /\b(?:non[\s-]?medicated|(?:cortico)?steroids?[\s-]?free)\b/gi,
    " ",
  );
  return MEDICATION_PATTERN.test(withoutNegativeLabels);
}

function transparencyScore(product) {
  // A documented "no" is as informative as a documented "yes". Transparency
  // describes completeness, not a garment's medical suitability.
  return CLOTHING_FLAGS.filter(
    (flag) => typeof product.clothing?.[flag] === "boolean",
  ).length;
}

/** Return null for unknown, unsupported or ambiguous inputs. */
export function classifyProduct(text) {
  if (typeof text !== "string" || !text.trim()) return null;
  if (isMedicationQuery(text)) return null;
  const normalized = text.normalize("NFKC").replace(/[‐‑‒–—]/g, "-");
  if (UNSUPPORTED_GARMENT_PATTERN.test(normalized)) return null;
  const matches = Object.entries(CATEGORY_PATTERNS)
    .filter(([, patterns]) =>
      patterns.some((pattern) => pattern.test(normalized)),
    )
    .map(([category]) => category);
  return matches.length === 1 ? matches[0] : null;
}

function naturalFraction(product) {
  const components = Array.isArray(product.components)
    ? product.components
    : [];
  if (!components.length) return 0;
  return (
    components.filter((component) => component?.kind === "natural").length /
    components.length
  );
}

function numericScore(product, key) {
  const score = product.scores?.[key];
  return typeof score === "number" && Number.isFinite(score)
    ? score
    : -Infinity;
}

/**
 * Return up to three catalog garments without mutating the catalog.
 * Budget is the purchase/pack price; affordability ranks price per garment.
 * Clothing requirements need explicit true evidence; unknown never passes.
 * Natural composition is descriptive, not evidence of skin tolerability.
 */
export function recommend(products, options = {}) {
  if (!options || typeof options !== "object") return [];
  const {
    category,
    budget = null,
    naturalPreference = "any",
    properties = [],
    clothingFlags = [],
    priority = "closest",
  } = options;

  if (!Array.isArray(products) || !Object.hasOwn(CATEGORY_PATTERNS, category))
    return [];
  if (
    budget !== null &&
    (typeof budget !== "number" || !Number.isFinite(budget) || budget < 0)
  )
    return [];
  if (
    !Array.isArray(properties) ||
    properties.some((property) => typeof property !== "string")
  )
    return [];
  if (
    !Array.isArray(clothingFlags) ||
    clothingFlags.some((flag) => !CLOTHING_FLAGS.includes(flag))
  )
    return [];
  if (
    !["any", "natural-components", "fully-natural"].includes(naturalPreference)
  )
    return [];

  const candidates = products
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => {
      if (!product || product.category !== category) return false;
      if (
        typeof product.price !== "number" ||
        !Number.isFinite(product.price) ||
        product.price < 0
      )
        return false;
      const units = product.unitCount ?? 1;
      if (typeof units !== "number" || !Number.isFinite(units) || units <= 0)
        return false;
      if (budget !== null && product.price > budget) return false;
      if (!clothingFlags.every((flag) => product.clothing?.[flag] === true))
        return false;
      if (
        naturalPreference === "natural-components" &&
        naturalFraction(product) === 0
      )
        return false;
      if (
        naturalPreference === "fully-natural" &&
        (product.naturalClass !== "fully-natural" ||
          naturalFraction(product) !== 1)
      )
        return false;
      return properties.every(
        (property) => product.properties?.[property] === true,
      );
    });

  candidates.sort((a, b) => {
    let difference = 0;
    if (priority === "affordable") {
      difference =
        a.product.price / (a.product.unitCount ?? 1) -
        b.product.price / (b.product.unitCount ?? 1);
    } else if (priority === "transparency") {
      difference =
        transparencyScore(b.product) - transparencyScore(a.product) ||
        numericScore(b.product, "function") -
          numericScore(a.product, "function");
    } else if (priority === "potential") {
      difference =
        numericScore(b.product, "sustainability") -
        numericScore(a.product, "sustainability");
    } else {
      difference =
        numericScore(b.product, "function") -
        numericScore(a.product, "function");
    }
    return (Number.isNaN(difference) ? 0 : difference) || a.index - b.index;
  });
  return candidates.slice(0, 3).map(({ product }) => product);
}

const validMoney = (value) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= 1_000_000;
const validDuration = (value) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value > 0 &&
  value <= 1_200;
const validPackSize = (value) =>
  Number.isInteger(value) && value >= 1 && value <= 10_000;
const cents = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function purchasesDuring(months, lifespan) {
  const ratio = months / lifespan;
  const nearest = Math.round(ratio);
  // Avoid an extra order from floating-point noise at an exact replacement boundary.
  const boundaryTolerance = Number.EPSILON * Math.max(1, Math.abs(ratio)) * 4;
  return Math.max(
    1,
    Math.abs(ratio - nearest) <= boundaryTolerance ? nearest : Math.ceil(ratio),
  );
}

/**
 * Illustrative replacement-cost scenario, not a prediction of product lifespan.
 * Starts with a purchase at month zero. No purchase is counted at the exact end
 * of the horizon. Prices and shipping apply to each pack purchased. Partly used
 * packs still incur their full purchase cost; unused items have no salvage value.
 * Prices are USD assumptions.
 * Durations are bounded at 100 years, monetary inputs at $1M, and orders at 1M.
 */
export function getCostScenario(input = {}) {
  if (!input || typeof input !== "object") return null;
  const {
    months,
    originalPrice,
    originalLifeMonths,
    alternativePrice,
    alternativeLifeMonths,
    originalShipping = 0,
    alternativeShipping = 0,
    originalPackSize = 1,
    alternativePackSize = 1,
    usesPerMonth = null,
  } = input;

  if (![months, originalLifeMonths, alternativeLifeMonths].every(validDuration))
    return null;
  if (
    ![
      originalPrice,
      alternativePrice,
      originalShipping,
      alternativeShipping,
    ].every(validMoney)
  )
    return null;
  if (![originalPackSize, alternativePackSize].every(validPackSize))
    return null;
  if (
    usesPerMonth !== null &&
    (typeof usesPerMonth !== "number" ||
      !Number.isFinite(usesPerMonth) ||
      usesPerMonth <= 0 ||
      usesPerMonth > 1_000_000)
  )
    return null;

  const originalItemsNeeded = purchasesDuring(months, originalLifeMonths);
  const alternativeItemsNeeded = purchasesDuring(months, alternativeLifeMonths);
  if (originalItemsNeeded > 1_000_000 || alternativeItemsNeeded > 1_000_000)
    return null;
  const originalPurchases = Math.ceil(originalItemsNeeded / originalPackSize);
  const alternativePurchases = Math.ceil(
    alternativeItemsNeeded / alternativePackSize,
  );
  const originalTotal = cents(
    originalPurchases * (originalPrice + originalShipping),
  );
  const alternativeTotal = cents(
    alternativePurchases * (alternativePrice + alternativeShipping),
  );
  const totalUses = usesPerMonth === null ? null : months * usesPerMonth;

  return {
    originalItemsNeeded,
    alternativeItemsNeeded,
    originalPurchases,
    alternativePurchases,
    originalTotal,
    alternativeTotal,
    savings: cents(originalTotal - alternativeTotal),
    originalPerUse: totalUses === null ? null : originalTotal / totalUses,
    alternativePerUse: totalUses === null ? null : alternativeTotal / totalUses,
  };
}
