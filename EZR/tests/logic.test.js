import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyProduct,
  isMedicationQuery,
  recommend,
  getCostScenario,
} from "../dist/logic.js";

const product = (id, changes = {}) => ({
  id,
  category: "tshirt",
  price: 10,
  unitCount: 1,
  naturalClass: "partially-natural",
  components: [{ kind: "natural" }, { kind: "synthetic" }],
  properties: { waterproof: true, durable: true, flexible: "unknown" },
  scores: { function: 7, sustainability: 6 },
  clothing: {
    cottonRich: true,
    woolFree: true,
    latexFree: "unknown",
    coveredElastic: "unknown",
    flatSeams: false,
    noSewnLabel: "unknown",
  },
  ...changes,
});
const ids = (products) => products.map((entry) => entry.id);

test("recognition supports three garment categories, English variants and Chinese", () => {
  for (const [text, expected] of [
    ["Polyester T-shirt", "tshirt"],
    ["Cotton T‑shirts", "tshirt"],
    ["Wool tee", "tshirt"],
    ["纯棉T恤", "tshirt"],
    ["短袖衫", "tshirt"],
    ["Polyester pants", "pants"],
    ["Linen trousers", "pants"],
    ["Joggers", "pants"],
    ["Blue jeans", "pants"],
    ["Cotton sweatpants", "pants"],
    ["Chinos", "pants"],
    ["Slacks", "pants"],
    ["裤子", "pants"],
    ["牛仔裤", "pants"],
    ["棉质运动裤", "pants"],
    ["Underwear", "underwear"],
    ["Boxers", "underwear"],
    ["Boxer briefs", "underwear"],
    ["Cotton panties", "underwear"],
    ["内裤", "underwear"],
    ["棉质内衣", "underwear"],
  ])
    assert.equal(classifyProduct(text), expected, text);
});

test("underpants do not accidentally match pants; explicit bras remain unsupported", () => {
  for (const text of [
    "underpants",
    "Cotton UNDERPANTS",
    "boxer briefs",
    "内裤",
  ])
    assert.equal(classifyProduct(text), "underwear", text);
  for (const text of [
    "bra",
    "sports bras",
    "T-shirt bra",
    "underwear bra",
    "bralette",
    "brassiere",
    "胸罩",
    "内衣文胸",
  ])
    assert.equal(classifyProduct(text), null, text);
});

test("unknown, mixed garment categories and nonclothing inputs are not forced into a match", () => {
  for (const text of [
    "",
    "rubber and plastic",
    "pantsuit",
    "steel wool",
    "pants and tees",
    "T-shirt and underwear",
    "裤子和内衣",
    "T恤和长裤",
    "fragrance-free cream",
    "body wash",
    "laundry detergent",
    "保湿霜",
    "洗衣液",
    "plastic water bottle",
    "bamboo toothbrush",
    "dress",
    "socks",
    "shoes",
    null,
    42,
  ])
    assert.equal(classifyProduct(text), null, String(text));
});

test("medication names and prescription terms cannot become garment swaps", () => {
  for (const medicine of [
    "hydrocortisone",
    "triamcinolone",
    "clobetasol",
    "desonide",
    "tacrolimus",
    "pimecrolimus",
    "ruxolitinib",
    "crisaborole",
    "dupilumab",
    "Eucrisa",
    "Opzelura",
    "Dupixent",
    "Protopic",
    "Elidel",
  ]) {
    const query = `${medicine} and a T-shirt`;
    assert.equal(isMedicationQuery(query), true, query);
    assert.equal(classifyProduct(query), null, query);
  }
  for (const query of [
    "prescription cream",
    "medicated underwear",
    "Rx lotion",
    "激素药膏",
    "ｈｙｄｒｏｃｏｒｔｉｓｏｎｅ cream",
  ]) {
    assert.equal(isMedicationQuery(query), true, query);
    assert.equal(classifyProduct(query), null, query);
  }
  for (const query of ["cotton pants", "eczema underwear", null, 42])
    assert.equal(isMedicationQuery(query), false, String(query));
});

test("negative medication labels do not conceal named medicines or create false matches", () => {
  for (const query of [
    "non-medicated T-shirt",
    "nonmedicated T-shirt",
    "non–medicated T-shirt",
    "steroid-free T-shirt",
    "corticosteroid-free T-shirt",
  ]) {
    assert.equal(isMedicationQuery(query), false, query);
    assert.equal(classifyProduct(query), "tshirt", query);
  }
  for (const query of [
    "steroid-free T-shirt with hydrocortisone",
    "non-medicated underwear and tacrolimus",
    "nonmedicated pants and a prescription lotion",
  ]) {
    assert.equal(isMedicationQuery(query), true, query);
    assert.equal(classifyProduct(query), null, query);
  }
});

test("affordability ranks per-garment price while budget limits the full pack price", () => {
  const catalog = [
    product("single", { price: 6 }),
    product("four-pack", { price: 16, unitCount: 4 }),
    product("two-pack", { price: 9, unitCount: 2 }),
    product("premium", { price: 20 }),
    product("different-category", { category: "pants", price: 1 }),
  ];
  assert.deepEqual(
    ids(recommend(catalog, { category: "tshirt", priority: "affordable" })),
    ["four-pack", "two-pack", "single"],
  );
  assert.deepEqual(
    ids(
      recommend(catalog, {
        category: "tshirt",
        budget: 10,
        priority: "affordable",
      }),
    ),
    ["two-pack", "single"],
  );
});

test("closest ranks function without treating natural composition as skin evidence", () => {
  const catalog = [
    product("half", { scores: { function: 8, sustainability: 9 } }),
    product("all", {
      scores: { function: 8, sustainability: 2 },
      components: [{ kind: "natural" }],
    }),
    product("functional", { scores: { function: 9, sustainability: 1 } }),
    product("lower", { scores: { function: 2, sustainability: 10 } }),
  ];
  assert.deepEqual(
    ids(recommend(catalog, { category: "tshirt", priority: "closest" })),
    ["functional", "half", "all"],
  );
  assert.deepEqual(
    ids(recommend(catalog, { category: "tshirt", priority: "potential" })),
    ["lower", "half", "all"],
  );
});

test("strict natural and property requirements exclude uncertain composition or properties", () => {
  const catalog = [
    product("mixed"),
    product("natural", {
      naturalClass: "fully-natural",
      components: [{ kind: "natural" }],
      properties: { waterproof: true, flexible: true },
    }),
    product("unknown-component", {
      naturalClass: "fully-natural",
      components: [{ kind: "natural" }, { kind: "unknown" }],
    }),
    product("processed", {
      naturalClass: "processed-material",
      components: [{ kind: "processed" }],
    }),
    product("unknown-property", { properties: { waterproof: "unknown" } }),
  ];
  assert.deepEqual(
    ids(
      recommend(catalog, {
        category: "tshirt",
        naturalPreference: "fully-natural",
      }),
    ),
    ["natural"],
  );
  assert.deepEqual(
    ids(
      recommend(catalog, {
        category: "tshirt",
        properties: ["waterproof", "flexible"],
      }),
    ),
    ["natural"],
  );
  assert.equal(
    recommend(catalog, {
      category: "tshirt",
      naturalPreference: "natural-components",
    }).some((entry) => entry.id === "processed"),
    false,
  );
  assert.deepEqual(
    recommend(catalog, { category: "tshirt", properties: ["heatResistant"] }),
    [],
  );
});

test("equal rankings are stable and recommendations do not mutate the catalog", () => {
  const catalog = [
    product("first"),
    product("second"),
    product("third"),
    product("fourth"),
  ];
  const snapshot = structuredClone(catalog);
  for (const priority of ["affordable", "closest", "transparency", "potential"])
    assert.deepEqual(
      ids(recommend(catalog, { category: "tshirt", priority })),
      ["first", "second", "third"],
    );
  assert.deepEqual(catalog, snapshot);
});

test("invalid requirements, unknown categories and malformed prices fail safely", () => {
  const catalog = [
    product("invalid", { price: NaN }),
    product("invalid-unit", { unitCount: 0 }),
    product("free", { price: 0 }),
  ];
  assert.deepEqual(ids(recommend(catalog, { category: "tshirt", budget: 0 })), [
    "free",
  ]);
  for (const options of [
    { category: "unrecognized" },
    { category: "moisturizer" },
    { category: "tshirt", budget: -1 },
    { category: "tshirt", budget: Infinity },
    { category: "tshirt", properties: "durable" },
    { category: "tshirt", clothingFlags: "cottonRich" },
    { category: "tshirt", clothingFlags: ["fragranceFree"] },
    { category: "tshirt", clothingFlags: ["unverified"] },
  ])
    assert.deepEqual(recommend(catalog, options), [], JSON.stringify(options));
});

test("every clothing requirement needs explicit true evidence; false, unknown and absent fail", () => {
  for (const flag of [
    "cottonRich",
    "woolFree",
    "latexFree",
    "coveredElastic",
    "flatSeams",
    "noSewnLabel",
  ]) {
    const catalog = [
      product("confirmed", { clothing: { [flag]: true } }),
      product("unknown", { clothing: { [flag]: "unknown" } }),
      product("false", { clothing: { [flag]: false } }),
      product("absent", { clothing: {} }),
      product("wrong-schema", { clothing: {}, eczema: { [flag]: true } }),
    ];
    assert.deepEqual(
      ids(recommend(catalog, { category: "tshirt", clothingFlags: [flag] })),
      ["confirmed"],
      flag,
    );
  }
  const catalog = [
    product("both", { clothing: { cottonRich: true, latexFree: true } }),
    product("partial", {
      clothing: { cottonRich: true, latexFree: "unknown" },
    }),
  ];
  assert.deepEqual(
    ids(
      recommend(catalog, {
        category: "tshirt",
        clothingFlags: ["cottonRich", "latexFree"],
      }),
    ),
    ["both"],
  );
});

test("transparency counts documented yes and no equally, then function, without rewarding unknowns", () => {
  const catalog = [
    product("one-yes", {
      clothing: { cottonRich: true },
      scores: { function: 100 },
    }),
    product("unknowns", {
      clothing: {
        cottonRich: "unknown",
        woolFree: "unknown",
        latexFree: "unknown",
        coveredElastic: "unknown",
        flatSeams: "unknown",
        noSewnLabel: "unknown",
      },
      scores: { function: 1000 },
    }),
    product("two-no-lower-function", {
      clothing: { cottonRich: false, woolFree: false },
      scores: { function: 2 },
    }),
    product("two-yes-higher-function", {
      clothing: { cottonRich: true, woolFree: true },
      scores: { function: 9 },
    }),
    product("two-no-same-function", {
      clothing: { flatSeams: false, noSewnLabel: false },
      scores: { function: 9 },
    }),
  ];
  assert.deepEqual(
    ids(recommend(catalog, { category: "tshirt", priority: "transparency" })),
    [
      "two-yes-higher-function",
      "two-no-same-function",
      "two-no-lower-function",
    ],
  );
});

const costInput = {
  months: 12,
  originalPrice: 5,
  originalLifeMonths: 3,
  alternativePrice: 12,
  alternativeLifeMonths: 6,
};

test("replacement costs count initial purchases and exclude purchases at the horizon", () => {
  assert.deepEqual(getCostScenario(costInput), {
    originalItemsNeeded: 4,
    alternativeItemsNeeded: 2,
    originalPurchases: 4,
    alternativePurchases: 2,
    originalTotal: 20,
    alternativeTotal: 24,
    savings: -4,
    originalPerUse: null,
    alternativePerUse: null,
  });
  const beyondBoundary = getCostScenario({ ...costInput, months: 12.01 });
  assert.equal(beyondBoundary.originalPurchases, 5);
  assert.equal(beyondBoundary.alternativePurchases, 3);
});

test("shipping is charged per order and per-use comparison uses the same assumed usage", () => {
  const result = getCostScenario({
    ...costInput,
    originalShipping: 2,
    alternativeShipping: 3,
    usesPerMonth: 10,
  });
  assert.equal(result.originalTotal, 28);
  assert.equal(result.alternativeTotal, 30);
  assert.equal(result.savings, -2);
  assert.equal(result.originalPerUse, 28 / 120);
  assert.equal(result.alternativePerUse, 30 / 120);
});

test("pack purchases count full upfront outlay even when some items remain unused", () => {
  const result = getCostScenario({
    ...costInput,
    originalPrice: 6,
    originalLifeMonths: 4,
    alternativePrice: 12,
    alternativeLifeMonths: 4,
    alternativePackSize: 2,
    usesPerMonth: 10,
  });
  assert.equal(result.originalItemsNeeded, 3);
  assert.equal(result.alternativeItemsNeeded, 3);
  assert.equal(result.originalPurchases, 3);
  assert.equal(result.alternativePurchases, 2);
  assert.equal(result.originalTotal, 18);
  assert.equal(result.alternativeTotal, 24);
  assert.equal(result.savings, -6);
  assert.equal(result.alternativePerUse, 24 / 120);
  const withShipping = getCostScenario({
    ...costInput,
    originalPackSize: 4,
    originalShipping: 3,
  });
  assert.equal(withShipping.originalPurchases, 1);
  assert.equal(withShipping.originalTotal, 8);
});

test("decimal lifespans do not add an order due to floating-point boundary noise", () => {
  const result = getCostScenario({
    ...costInput,
    months: 0.28,
    originalLifeMonths: 0.04,
    alternativeLifeMonths: 0.04,
  });
  assert.equal(result.originalPurchases, 7);
  assert.equal(result.alternativePurchases, 7);
});

test("free products, long-lived products, and cents are handled consistently", () => {
  const result = getCostScenario({
    ...costInput,
    originalPrice: 0,
    originalShipping: 0,
    alternativePrice: 19.99,
    alternativeShipping: 5.99,
    alternativeLifeMonths: 100,
  });
  assert.equal(result.originalTotal, 0);
  assert.equal(result.alternativePurchases, 1);
  assert.equal(result.alternativeTotal, 25.98);
  assert.equal(result.savings, -25.98);
});

test("invalid financial assumptions, lifespans, horizons, and usage return null", () => {
  assert.equal(getCostScenario(null), null);
  assert.equal(getCostScenario(), null);
  for (const changes of [
    { months: 0 },
    { months: -1 },
    { months: Infinity },
    { months: 1201 },
    { originalPrice: -1 },
    { originalPrice: "5" },
    { alternativePrice: NaN },
    { originalLifeMonths: 0 },
    { alternativeLifeMonths: -1 },
    { originalLifeMonths: 1e-100 },
    { originalShipping: -2 },
    { alternativeShipping: Infinity },
    { usesPerMonth: 0 },
    { usesPerMonth: -1 },
    { usesPerMonth: Infinity },
    { originalPackSize: 0 },
    { alternativePackSize: 1.5 },
    { originalPackSize: "2" },
    { alternativePackSize: 10_001 },
  ])
    assert.equal(
      getCostScenario({ ...costInput, ...changes }),
      null,
      JSON.stringify(changes),
    );
});
