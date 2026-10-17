import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  products,
  MATERIALS,
  MATERIAL_GROUPS,
  CATEGORY_LABELS,
} from "../dist/ezr-catalog.js";
import {
  validateProduct,
  retailerUrl,
  searchCatalog,
} from "../dist/ezr-matching.js";

const retailerKey = (name) => name.toLowerCase().replace(/[^a-z]/g, "");

test("the shipped catalog has 30–50 valid unique listings with multiple products from every requested retailer", () => {
  assert.ok(products.length >= 30 && products.length <= 50);
  assert.equal(new Set(products.map(({ id }) => id)).size, products.length);
  assert.deepEqual(
    [
      ...new Set(
        products.map(({ retailer_name }) => retailerKey(retailer_name)),
      ),
    ].sort(),
    [
      "anthropologie",
      "bananarepublic",
      "gap",
      "jcrew",
      "lululemon",
      "oldnavy",
      "uniqlo",
    ],
  );
  assert.deepEqual(Object.keys(CATEGORY_LABELS).sort(), [
    "pants",
    "top",
    "underwear",
  ]);
  for (const retailer of new Set(
    products.map(({ retailer_name }) => retailer_name),
  )) {
    assert.ok(
      products.filter(({ retailer_name }) => retailer_name === retailer)
        .length > 1,
      retailer,
    );
  }
  assert.equal(
    new Set(products.map(({ product_url }) => product_url)).size,
    products.length,
  );
  assert.deepEqual(
    new Set(products.map(({ category }) => category)),
    new Set(Object.keys(CATEGORY_LABELS)),
  );
  for (const product of products)
    assert.deepEqual(validateProduct(product), [], product.id);
  assert.equal(searchCatalog(products).total, products.length);
});

test("each real listing retains its checked exact product source and retailer link", () => {
  const hosts = {
    anthropologie: "www.anthropologie.com",
    bananarepublic: "bananarepublic.gap.com",
    gap: "www.gap.com",
    jcrew: "www.jcrew.com",
    lululemon: "shop.lululemon.com",
    oldnavy: "oldnavy.gap.com",
    uniqlo: "www.uniqlo.com",
  };
  for (const product of products) {
    assert.equal(product.data_status, "verified", product.id);
    assert.equal(product.source_checked_at, "2026-10-17", product.id);
    assert.equal(product.currency, "USD", product.id);
    assert.ok(Array.isArray(product.source_urls), product.id);
    assert.ok(product.source_urls.includes(product.product_url), product.id);
    assert.equal(retailerUrl(product), product.product_url, product.id);
    const url = new URL(product.product_url);
    assert.equal(url.protocol, "https:", product.id);
    assert.equal(
      url.hostname,
      hosts[retailerKey(product.retailer_name)],
      product.id,
    );
    assert.notEqual(url.pathname, "/", product.id);
    assert.equal(url.username, "", product.id);
    assert.equal(url.password, "", product.id);
    assert.ok(
      Number.isInteger(product.unit_count) && product.unit_count > 0,
      product.id,
    );
    assert.ok(
      ["shirt", "pair", `${product.unit_count}-pack`].includes(
        product.price_unit,
      ),
      product.id,
    );
    if (product.unit_count > 1)
      assert.equal(
        product.price_unit,
        `${product.unit_count}-pack`,
        product.id,
      );
  }
});

test("retail products use three self-contained original generic garment sketches", () => {
  const images = new Set(products.map(({ image_url }) => image_url));
  assert.deepEqual(
    images,
    new Set([
      "assets/retail/top.svg",
      "assets/retail/pants.svg",
      "assets/retail/underwear.svg",
    ]),
  );
  for (const product of products)
    assert.equal(
      product.image_url,
      `assets/retail/${product.category}.svg`,
      product.id,
    );
  for (const image of images) {
    const svg = readFileSync(
      new URL(`../dist/${image}`, import.meta.url),
      "utf8",
    );
    assert.match(
      svg,
      /^\s*<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/,
    );
    assert.match(svg, /viewBox="0 0 480 600"/);
    assert.match(svg, /<title\b[^>]*>Garment sketch<\/title>/);
    assert.match(svg, /<desc\b[^>]*>[^<]*generic[^<]*<\/desc>/i);
    assert.match(svg, /<path\b[^>]*\bd="[^"]+"/);
    assert.match(svg, /<\/svg>\s*$/);
    assert.doesNotMatch(svg, /<(?:script|foreignObject|iframe|image)\b/i);
    assert.doesNotMatch(svg, /\son[a-z]+\s*=/i);
    assert.doesNotMatch(svg, /\b(?:href|src)\s*=/i);
    assert.doesNotMatch(svg, /\b(?:demo|illustrative)\b/i);
    assert.doesNotMatch(
      svg.replace('xmlns="http://www.w3.org/2000/svg"', ""),
      /https?:\/\/|data:/i,
    );
    const definedIds = new Set(
      [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
    );
    for (const reference of svg.matchAll(/url\(([^)]+)\)/g)) {
      assert.match(reference[1], /^#[a-zA-Z][\w-]*$/);
      assert.ok(
        definedIds.has(reference[1].slice(1)),
        `${image}: unresolved ${reference[1]}`,
      );
    }
  }
});

test("material options retain twelve unique fibers in natural, processed, synthetic order", () => {
  assert.deepEqual(
    MATERIAL_GROUPS.map(({ label }) => label),
    ["Natural fibers", "Processed fibers", "Synthetic fibers"],
  );
  assert.deepEqual(
    MATERIALS,
    MATERIAL_GROUPS.flatMap(({ materials }) => materials),
  );
  assert.equal(MATERIALS.length, 12);
  const materials = new Set(MATERIALS.map(({ id }) => id));
  assert.equal(materials.size, MATERIALS.length);
  assert.deepEqual(
    MATERIAL_GROUPS.map(
      ({ materials }) => new Set(materials.map(({ id }) => id)),
    ),
    [
      new Set(["cotton", "linen", "wool", "silk", "hemp"]),
      new Set(["lyocell", "viscose", "modal"]),
      new Set(["polyester", "nylon", "elastane", "acrylic"]),
    ],
  );
  for (const product of products) {
    for (const { material } of product.material_composition)
      assert.ok(materials.has(material), product.id);
    for (const material of product.trim_materials)
      assert.ok(materials.has(material), product.id);
  }
});

test("a known body composition never clears an Avoid filter when trims remain unknown", () => {
  const unknownTrims = products.filter(
    ({ trims_status }) => trims_status === "unknown",
  );
  assert.ok(unknownTrims.length > 0);
  assert.ok(
    unknownTrims.some(({ material_composition }) =>
      material_composition.some(
        ({ material, percentage }) =>
          material === "cotton" && percentage === 100,
      ),
    ),
  );
  const result = searchCatalog(unknownTrims, { avoid: ["acrylic"] });
  assert.equal(result.total, 0);
  assert.equal(
    result.omittedUnknown + result.excludedMaterials,
    unknownTrims.length,
  );
});

test("the Old Navy maximum-price filter uses the full three-pack purchase price", () => {
  const pack = products.find(
    ({ id }) => id === "old-navy-soft-washed-boxer-briefs-3",
  );
  assert.ok(pack);
  assert.equal(pack.unit_count, 3);
  assert.equal(pack.price_unit, "3-pack");
  assert.equal(pack.price, 14.99);
  assert.equal(
    searchCatalog([pack], { query: "underwear", maxPrice: 15 }).total,
    1,
  );
  assert.equal(
    searchCatalog([pack], { query: "underwear", maxPrice: 14 }).total,
    0,
  );
});
