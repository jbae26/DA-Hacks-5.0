import { isMedicationQuery } from "./logic.js";

const CATEGORIES = ["tshirt", "pants", "underwear"];
export const SEARCH_CLOTHING_FLAGS = [
  "cottonRich",
  "woolFree",
  "latexFree",
  "coveredElastic",
  "flatSeams",
  "noSewnLabel",
];
const SORTS = ["relevance", "price-asc", "price-desc", "transparency"];
const normalize = (text) =>
  text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/[’']/g, "")
    .trim();
const words = (text) => normalize(text).match(/[\p{L}\p{N}]+/gu) || [];
const hasText = (value) => typeof value === "string" && !!value.trim();
const UNSUPPORTED =
  /\b(?:bras?|brassieres?|bralettes?|moisturi[sz]ers?|cleansers?|detergents?|toothbrush(?:es)?|bottles?|creams?|lotions?|soaps?|shampoos?|shoes?|socks?|dresses?|skirts?)\b|胸罩|文胸|护肤|乳霜|洗衣液|牙刷|水瓶|袜子|裙子/iu;
const FLAG_PATTERNS = [
  [
    "latexFree",
    /\blatex[\s-]?free\b|\b(?:no|without)\s+latex\b|无乳胶|不含乳胶/giu,
  ],
  [
    "woolFree",
    /\bwool[\s-]?free\b|\b(?:no|without)\s+wool\b|无羊毛|不含羊毛/giu,
  ],
  ["cottonRich", /\bcotton[\s-]?rich\b|高含棉|高棉含量/giu],
  ["flatSeams", /\bflat[\s-]?(?:seams?|stitching)\b|平缝|平整接缝/giu],
  ["coveredElastic", /\b(?:covered|encased)[\s-]+elastic\b|包覆松紧带/giu],
  [
    "noSewnLabel",
    /\btag[\s-]?less\b|\btag[\s-]?free\b|\bno\s+sewn[\s-]+labels?\b|\bwithout\s+(?:tags?|labels?)\b|无标签|无缝制标签/giu,
  ],
];
const CATEGORY_PATTERNS = [
  ["tshirt", /\bt[\s-]?shirts?\b|\btees?\b|t恤|短袖衫|圆领衫/giu],
  [
    "underwear",
    /\bboxer[\s-]+(?:briefs?|shorts?)\b|\b(?:underwear|underpants|briefs?|boxers?|panties)\b|内裤|内衣/giu,
  ],
  ["pants", /\b(?:pants|trousers?)\b|裤子|长裤|休闲裤|阔腿裤|西裤/giu],
];
const MATERIAL_PATTERNS = [
  ["cotton", /\bcotton\b|棉/giu],
  ["polyester", /\bpolyester\b|聚酯纤维|聚酯|涤纶/giu],
  ["nylon", /\bnylon\b|锦纶|尼龙/giu],
  ["elastane", /\b(?:elastane|spandex|lycra)\b|氨纶/giu],
  ["wool", /\bwool\b|羊毛/giu],
  ["silk", /\bsilk\b|真丝|蚕丝/giu],
  ["linen", /\blinen\b|亚麻/giu],
  ["hemp", /\bhemp\b|大麻纤维/giu],
  ["bamboo", /\bbamboo\b|竹纤维/giu],
  ["viscose", /\b(?:viscose|rayon)\b|粘胶|黏胶/giu],
  ["modal", /\bmodal\b|莫代尔/giu],
  ["acrylic", /\bacrylic\b|腈纶/giu],
  ["latex", /\blatex\b|乳胶/giu],
];
const MATERIAL_ALIASES = {
  elastane: ["elastane", "spandex", "lycra"],
  viscose: ["viscose", "rayon"],
};

/**
 * Small, deterministic catalog vocabulary, not natural-language or medical AI.
 * Category mentions are OR; materials, evidence claims and remaining words AND.
 * Unrecognized terms are retained, so an unsupported request cannot silently
 * become a different garment. Explicit negation is supported only by the six
 * documented construction phrases above; other negation produces no results.
 */
export function parseSearchQuery(query = "") {
  if (typeof query !== "string") return null;
  const normalized = normalize(query);
  if (isMedicationQuery(query) || UNSUPPORTED.test(normalized)) return null;
  let remaining = normalized;
  const consume = (patterns) => {
    const matched = new Set();
    for (const [key, pattern] of patterns) {
      remaining = remaining.replace(pattern, () => {
        matched.add(key);
        return " ";
      });
    }
    return [...matched];
  };
  const clothingFlags = consume(FLAG_PATTERNS);
  const categories = consume(CATEGORY_PATTERNS);
  const materials = consume(MATERIAL_PATTERNS);
  remaining = remaining
    .replace(/有机/gu, " organic ")
    .replace(/男士|男款/gu, " mens ")
    .replace(/女士|女款/gu, " womens ")
    .replace(/黑色/gu, " black ")
    .replace(/蓝色/gu, " blue ")
    .replace(/\b(?:and|or|with|for|a|an|the|of)\b|和|或/gu, " ");
  const terms = [...new Set(words(remaining))];
  if (terms.some((term) => ["no", "not", "without", "free"].includes(term)))
    return null;
  return { normalized, categories, materials, clothingFlags, terms };
}

/** Only positive, disclosed fabric components participate in fiber search. */
function mainFabricText(product) {
  if (!Array.isArray(product.components)) return "";
  return product.components
    .filter(
      (component) =>
        component &&
        hasText(component.part) &&
        hasText(component.material) &&
        ["natural", "synthetic", "processed", "processed-material"].includes(
          component.kind,
        ) &&
        /^(?:main fabric|fabric(?:[, ]|$)|stretch fiber$)/i.test(
          component.part,
        ) &&
        !/\b(?:unknown|unverified|not disclosed|not specified|may include|conflict|without|free)\b/i.test(
          component.material,
        ),
    )
    .map((component) => component.material)
    .join(" ");
}

/** Known false and known true each count once; this is not a health score. */
export function constructionTransparency(product) {
  return SEARCH_CLOTHING_FLAGS.filter(
    (flag) => typeof product?.clothing?.[flag] === "boolean",
  ).length;
}

/**
 * Search every matching catalog garment without substitution or a result cap.
 * Budget and price order use purchase/pack price, never the per-garment price.
 * Name/brand words and positive main-fabric disclosures form the search index;
 * claims in warnings, unknown fields and sewing-thread fibers do not. Requested
 * construction criteria require explicit true evidence. Stable catalog order
 * breaks all ties. Neither natural composition nor medical suitability ranks.
 */
export function searchProducts(products, options = {}) {
  if (
    !Array.isArray(products) ||
    !options ||
    typeof options !== "object" ||
    Array.isArray(options)
  )
    return [];
  const {
    query = "",
    category = "all",
    brand = "all",
    budget = null,
    clothingFlags = [],
    sort = "relevance",
  } = options;
  const parsed = parseSearchQuery(query);
  if (
    !parsed ||
    !["all", ...CATEGORIES].includes(category) ||
    !hasText(brand) ||
    !SORTS.includes(sort)
  )
    return [];
  if (
    budget !== null &&
    (typeof budget !== "number" || !Number.isFinite(budget) || budget < 0)
  )
    return [];
  if (
    !Array.isArray(clothingFlags) ||
    clothingFlags.some((flag) => !SEARCH_CLOTHING_FLAGS.includes(flag))
  )
    return [];
  const requiredFlags = [
    ...new Set([...clothingFlags, ...parsed.clothingFlags]),
  ];
  const chosenBrand = normalize(brand);
  const candidates = [];
  products.forEach((product, index) => {
    if (
      !product ||
      !CATEGORIES.includes(product.category) ||
      !hasText(product.name) ||
      !hasText(product.brand)
    )
      return;
    if (
      !Number.isFinite(product.price) ||
      product.price < 0 ||
      !Number.isInteger(product.unitCount ?? 1) ||
      (product.unitCount ?? 1) < 1
    )
      return;
    if (category !== "all" && product.category !== category) return;
    if (
      parsed.categories.length &&
      !parsed.categories.includes(product.category)
    )
      return;
    if (chosenBrand !== "all" && normalize(product.brand) !== chosenBrand)
      return;
    if (budget !== null && product.price > budget) return;
    if (!requiredFlags.every((flag) => product.clothing?.[flag] === true))
      return;
    const fabricWords = new Set(words(mainFabricText(product)));
    if (
      !parsed.materials.every((material) =>
        (MATERIAL_ALIASES[material] || [material]).some((alias) =>
          fabricWords.has(alias),
        ),
      )
    )
      return;
    const nameWords = new Set(words(product.name));
    const brandWords = new Set(words(product.brand));
    if (
      !parsed.terms.every(
        (term) =>
          nameWords.has(term) || brandWords.has(term) || fabricWords.has(term),
      )
    )
      return;
    const rank = parsed.terms.reduce(
      (score, term) =>
        score +
        (brandWords.has(term) ? 4 : 0) +
        (nameWords.has(term) ? 2 : 0) +
        (fabricWords.has(term) ? 1 : 0),
      0,
    );
    candidates.push({ product, index, rank });
  });
  candidates.sort((a, b) => {
    const difference =
      sort === "price-asc"
        ? a.product.price - b.product.price
        : sort === "price-desc"
          ? b.product.price - a.product.price
          : sort === "transparency"
            ? constructionTransparency(b.product) -
              constructionTransparency(a.product)
            : b.rank - a.rank;
    return difference || a.index - b.index;
  });
  return candidates.map(({ product }) => product);
}
