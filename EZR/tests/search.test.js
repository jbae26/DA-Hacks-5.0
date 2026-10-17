import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../dist/catalog.js";
import {
  searchProducts,
  parseSearchQuery,
  constructionTransparency,
} from "../dist/search.js";

const ids = (items) => items.map(({ id }) => id);
const search = (query, options = {}) =>
  searchProducts(products, { query, ...options });

test("empty search returns every garment in stable catalog order without mutation", () => {
  const snapshot = structuredClone(products);
  assert.deepEqual(searchProducts(products), products);
  assert.equal(search("  ").length, 9);
  assert.equal(searchProducts(products).length, 9);
  search("", { sort: "price-desc" });
  assert.deepEqual(products, snapshot);
});

test("category terms match English and Chinese, while other constraints AND together", () => {
  for (const query of [
    "cotton pants",
    "cotton trousers",
    "棉裤子",
    "有机棉长裤",
  ]) {
    assert.equal(search(query).length, 3, query);
    assert.ok(
      search(query).every((item) => item.category === "pants"),
      query,
    );
  }
  assert.equal(search("T恤").length, 3);
  assert.equal(search("内裤").length, 3);
  assert.equal(search("underpants").length, 3);
  assert.equal(search("pants or T-shirts").length, 6);
  assert.deepEqual(search("pants", { category: "tshirt" }), []);
  assert.equal(search("", { category: "underwear" }).length, 3);
});

test("brand and name searches use direct product words", () => {
  assert.equal(search("Pact").length, 2);
  assert.ok(search("Pact").every((item) => item.brand === "Pact"));
  assert.deepEqual(ids(search("Pact T-shirt")), ["pact-softspun-tee"]);
  assert.deepEqual(ids(search("Softspun black")), ["pact-softspun-tee"]);
  assert.equal(search("", { brand: "cottonique" }).length, 4);
  assert.equal(search("", { brand: "Not a brand" }).length, 0);
  assert.equal(search("Pact", { brand: "Hanes" }).length, 0);
});

test("material queries match disclosed main fabric rather than substitute garments or thread", () => {
  assert.deepEqual(search("polyester T-shirt"), []);
  for (const material of ["silk", "wool", "linen", "nylon", "latex", "涤纶"])
    assert.deepEqual(search(material), [], material);
  assert.deepEqual(ids(search("elastane underwear")), [
    "pact-everyday-boxer-briefs-2",
  ]);
  assert.deepEqual(ids(search("spandex underwear")), [
    "pact-everyday-boxer-briefs-2",
  ]);
  assert.equal(search("100% cotton underwear").length, 1);
  assert.equal(
    search("cotton").length,
    8,
    "uncertain assorted-color Hanes fabric is not positive evidence",
  );
});

test("construction phrases use explicit evidence and never wording in warnings", () => {
  assert.deepEqual(ids(search("latex-free underwear")), [
    "cottonique-drawstring-boxers-2",
  ]);
  assert.deepEqual(ids(search("无乳胶内裤")), [
    "cottonique-drawstring-boxers-2",
  ]);
  assert.equal(search("latex-free T-shirt").length, 0);
  assert.equal(search("flat seams pants").length, 2);
  assert.deepEqual(ids(search("tagless T-shirt")), ["pact-softspun-tee"]);
  assert.deepEqual(ids(search("covered elastic underwear")), [
    "hanes-pure-comfort-briefs-6",
  ]);
  assert.equal(search("cotton-rich underwear").length, 2);
  assert.equal(search("wool-free underwear").length, 2);
  assert.equal(
    search("underwear", { clothingFlags: ["latexFree", "coveredElastic"] })
      .length,
    0,
  );
  assert.deepEqual(search("not latex-free underwear"), []);
  assert.deepEqual(search("not tagless"), []);
});

test("unknown, unsupported and medication queries never silently become garment suggestions", () => {
  for (const query of [
    "moisturizer",
    "cotton moisturizer",
    "bra",
    "cotton bras",
    "胸罩",
    "polyester dress",
    "cotton socks",
    "hydrocortisone pants",
    "mysterious pants",
    "cottonfree",
    "xyzzy",
  ])
    assert.deepEqual(search(query), [], query);
  assert.equal(parseSearchQuery("prescription shirt"), null);
});

test("budget and ordering use whole-pack purchase prices", () => {
  const underwear = search("underwear", { sort: "price-asc" });
  assert.deepEqual(
    underwear.map((item) => item.price),
    [15.99, 28.99, 48],
  );
  assert.deepEqual(ids(search("underwear", { budget: 20 })), [
    "hanes-pure-comfort-briefs-6",
  ]);
  assert.deepEqual(
    search("underwear", { budget: 5 }),
    [],
    "a $2.67 per-pair display cannot pass a $5 pack budget",
  );
  const all = search("", { sort: "price-asc" });
  assert.equal(
    all[0].id,
    "terra-cotton-tee",
    "$14.97 single tee precedes a $15.99 underwear pack",
  );
  assert.equal(search("", { sort: "price-desc" })[0].price, 48);
});

test("transparency counts documented yes and no equally and keeps ties stable", () => {
  const hanes = products.find((item) => item.brand === "Hanes");
  assert.equal(constructionTransparency(hanes), 4);
  assert.equal(constructionTransparency({ clothing: { latexFree: false } }), 1);
  assert.equal(
    constructionTransparency({ clothing: { latexFree: "unknown" } }),
    0,
  );
  const result = search("", { sort: "transparency" });
  assert.ok(
    result.every(
      (item, index) =>
        index === 0 ||
        constructionTransparency(result[index - 1]) >=
          constructionTransparency(item),
    ),
  );
  assert.deepEqual(
    ids(search("Pact", { sort: "transparency" })),
    ids(products.filter((item) => item.brand === "Pact")),
  );
});

test("invalid filters and malformed products fail closed", () => {
  for (const options of [
    null,
    [],
    { query: 1 },
    { category: "dress" },
    { brand: "" },
    { brand: 3 },
    { budget: "20" },
    { budget: -1 },
    { budget: NaN },
    { budget: Infinity },
    { clothingFlags: ["unknownFlag"] },
    { clothingFlags: "latexFree" },
    { sort: "potential" },
  ])
    assert.deepEqual(searchProducts(products, options), []);
  assert.deepEqual(searchProducts(null), []);
  assert.deepEqual(
    searchProducts([
      null,
      {},
      { ...products[0], price: "15" },
      { ...products[0], unitCount: 0 },
      { ...products[0], unitCount: 1.5 },
    ]),
    [],
  );
});
