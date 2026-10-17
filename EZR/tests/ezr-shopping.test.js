import test from "node:test";
import assert from "node:assert/strict";
import {
  renderMaterialOptions,
  renderShoppingAction,
} from "../dist/ezr-shopping.js";

const groups = [
  { label: "Natural fibers", materials: [{ id: "cotton", label: "Cotton" }] },
  { label: "Processed fibers", materials: [{ id: "modal", label: "Modal" }] },
  {
    label: "Synthetic fibers",
    materials: [{ id: "polyester", label: "Polyester" }],
  },
];

// This fixture checks rendering only and is never part of the shipped catalog.
const productFixture = (overrides = {}) => ({
  id: "fixture-shopping-tee",
  name: 'Fixture shirt <navy> & "white"',
  retailer_name: "Fixture Retailer & Co.",
  data_status: "verified",
  source_checked_at: "2026-10-17",
  product_url:
    "https://www.gap.com/browse/product.do?pid=fixture-only&color=navy%20blue&size=L",
  ...overrides,
});

test("native material options keep group order and disable only selected fibers", () => {
  const html = renderMaterialOptions(groups, ["modal"]);
  assert.match(html, /^<option value="">Add a material…<\/option>/);
  assert.deepEqual(
    [...html.matchAll(/<optgroup label="([^"]+)">/g)].map((match) => match[1]),
    groups.map(({ label }) => label),
  );
  assert.match(html, /<option value="cotton">Cotton<\/option>/);
  assert.match(html, /<option value="modal" disabled>Modal<\/option>/);
  assert.match(html, /<option value="polyester">Polyester<\/option>/);
  assert.equal((html.match(/ disabled/g) || []).length, 1);
  assert.doesNotMatch(renderMaterialOptions(groups), / disabled/);
});

test("material option labels and values cannot inject markup", () => {
  const html = renderMaterialOptions([
    {
      label: 'Natural <fibers> & "other"',
      materials: [{ id: 'fiber" unsafe', label: "Cotton & <linen>" }],
    },
  ]);
  assert.match(html, /label="Natural &lt;fibers&gt; &amp; &quot;other&quot;"/);
  assert.match(html, /value="fiber&quot; unsafe"/);
  assert.match(html, />Cotton &amp; &lt;linen&gt;<\/option>/);
  assert.doesNotMatch(html, /<fibers>|<linen>/);
});

test("shopping opens the selected record's exact variant URL with secure new-tab attributes", () => {
  const product = productFixture({ retailer_url: "https://www.gap.com/" });
  const html = renderShoppingAction(product);
  const href = html.match(/href="([^"]+)"/)?.[1];
  assert.ok(href);
  assert.equal(href.replaceAll("&amp;", "&"), product.product_url);
  assert.match(href, /&amp;color=navy%20blue&amp;size=L$/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, />Shop for this product<\/a>/);
  assert.match(html, /opens a new tab/);
  assert.doesNotMatch(html, /href="https:\/\/www\.gap\.com\/"/);
});

test("shopping escapes product and retailer text without losing its action label", () => {
  const html = renderShoppingAction(productFixture());
  assert.match(html, /Fixture shirt &lt;navy&gt; &amp; &quot;white&quot;/);
  assert.match(html, /Fixture Retailer &amp; Co\./);
  assert.doesNotMatch(html, /<navy>/);
});

test("a product route may contain category words without becoming a category-page link", () => {
  const product = productFixture({
    retailer_name: "J.Crew",
    product_url:
      "https://www.jcrew.com/p/mens/categories/clothing/tshirts-and-polos/t-shirts/FIXTURE?colorCode=navy&fit=Classic",
  });
  const html = renderShoppingAction(product);
  const href = html.match(/href="([^"]+)"/)?.[1];
  assert.equal(href?.replaceAll("&amp;", "&"), product.product_url);
  const categoryPage = renderShoppingAction(
    productFixture({
      product_url:
        "https://www.jcrew.com/m/mens/categories/clothing/tshirts-and-polos",
    }),
  );
  assert.doesNotMatch(categoryPage, /\bhref=|<a\b/);
});

test("unverified, missing and invalid retailer links show a disabled action without any href", () => {
  const cases = [
    productFixture({ data_status: "illustrative" }),
    productFixture({ source_checked_at: null }),
    productFixture({ product_url: null }),
    productFixture({ product_url: "https://www.gap.com/" }),
    productFixture({ product_url: "https://www.uniqlo.com/us/en/" }),
    productFixture({
      product_url: "https://www.gap.com/browse/category.do?cid=5225",
    }),
    productFixture({
      product_url: "http://www.gap.com/browse/product.do?pid=fixture-only",
    }),
    productFixture({ product_url: "javascript:alert(1)" }),
    productFixture({
      product_url:
        "https://user:secret@www.gap.com/browse/product.do?pid=fixture-only",
    }),
  ];
  for (const product of cases) {
    const html = renderShoppingAction(product);
    assert.match(
      html,
      /<button\b[^>]*\bdisabled>Shop for this product<\/button>/,
    );
    assert.match(html, /Retailer link unavailable/);
    assert.doesNotMatch(html, /\bhref=|<a\b/);
  }
});
