import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";
import { products, categories } from "../dist/catalog.js";
import { recommend } from "../dist/logic.js";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const isHttps = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};
const hasText = (value) => typeof value === "string" && value.trim().length > 0;

test("catalog entries have unique stable IDs and recognized product categories", () => {
  const seen = new Set();
  assert.equal(
    products.length,
    9,
    "The garment catalog has nine researched alternatives",
  );
  assert.deepEqual(
    Object.keys(categories).sort(),
    ["pants", "tshirt", "underwear"],
    "The catalog covers three garment categories",
  );
  for (const product of products) {
    assert.match(
      product.id,
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "ID is suitable for links and saved selections",
    );
    assert.equal(seen.has(product.id), false, `Duplicate ID: ${product.id}`);
    seen.add(product.id);
    assert.ok(
      Object.hasOwn(categories, product.category),
      `Unknown category: ${product.id}`,
    );
    for (const field of [
      "name",
      "brand",
      "function",
      "imageAlt",
      "materialSummary",
      "care",
    ]) {
      assert.ok(hasText(product[field]), `${product.id} needs ${field}`);
    }
  }
  for (const category of Object.keys(categories)) {
    assert.equal(
      products.filter((product) => product.category === category).length,
      3,
      `${category} needs three researched alternatives`,
    );
  }
});

test("every product image is a real local raster asset rather than a missing path or error page", async () => {
  for (const product of products) {
    assert.match(
      product.imageUrl,
      /^\/assets\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/i,
    );
    const path = resolve(dist, `.${product.imageUrl}`);
    assert.ok(path.startsWith(`${dist.replace(/[\\/]$/, "")}${sep}`));
    const data = await readFile(path);
    assert.ok(
      data.length > 100,
      `${product.id} asset is empty or suspiciously small`,
    );
    const png = data
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const jpeg = data[0] === 255 && data[1] === 216 && data[2] === 255;
    const webp =
      data.subarray(0, 4).toString() === "RIFF" &&
      data.subarray(8, 12).toString() === "WEBP";
    assert.ok(
      png || jpeg || webp,
      `${product.id} asset is not a recognizable image`,
    );
    if (/\.png$/i.test(path))
      assert.ok(png, `${product.id} PNG extension must match file data`);
    if (/\.jpe?g$/i.test(path))
      assert.ok(jpeg, `${product.id} JPEG extension must match file data`);
    if (/\.webp$/i.test(path))
      assert.ok(webp, `${product.id} WebP extension must match file data`);
  }
});

test("display prices correspond to dated seller offers with matching pack quantities", () => {
  for (const product of products) {
    assert.ok(
      Number.isFinite(product.price) && product.price >= 0,
      `${product.id}: valid purchase price`,
    );
    assert.ok(
      Number.isInteger(product.unitCount) && product.unitCount > 0,
      `${product.id}: valid pack size`,
    );
    assert.ok(
      Array.isArray(product.sellers) && product.sellers.length > 0,
      `${product.id}: seller missing`,
    );
    assert.ok(
      product.sellers.some(
        (seller) =>
          seller.price === product.price &&
          seller.unitCount === product.unitCount,
      ),
      `${product.id}: display price must match an offer for that pack size`,
    );
    for (const seller of product.sellers) {
      assert.ok(
        hasText(seller.name) && isHttps(seller.url),
        `${product.id}: seller needs a name and HTTPS link`,
      );
      assert.ok(
        Number.isFinite(seller.price) && seller.price >= 0,
        `${product.id}: offer price`,
      );
      assert.ok(
        Number.isInteger(seller.unitCount) && seller.unitCount > 0,
        `${product.id}: offer quantity`,
      );
      assert.equal(
        seller.unitCount,
        product.unitCount,
        `${product.id}: compare offers for the displayed pack quantity`,
      );
      assert.match(seller.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(
        new Date(`${seller.checkedAt}T00:00:00Z`).toISOString().slice(0, 10),
        seller.checkedAt,
        `${product.id}: real check date`,
      );
      assert.ok(
        hasText(seller.shipping) ||
          (Number.isFinite(seller.shipping) && seller.shipping >= 0),
        `${product.id}: shipping cannot be silently omitted`,
      );
    }
  }
});

test("garment records expose construction evidence and preserve unknown states", () => {
  const flags = [
    "cottonRich",
    "woolFree",
    "latexFree",
    "coveredElastic",
    "flatSeams",
    "noSewnLabel",
  ];
  for (const product of products) {
    assert.ok(product.clothing, `${product.id}: clothing evidence required`);
    for (const flag of flags) {
      assert.ok(
        [true, false, "unknown"].includes(product.clothing[flag]),
        `${product.id}: ${flag} must be true, false or explicitly unknown`,
      );
    }
    for (const field of ["fit", "waistband", "seams", "labels", "finishes"])
      assert.ok(
        hasText(product.clothingNotes?.[field]),
        `${product.id}: explain ${field}`,
      );

    // Historical descriptive fields may remain in a record, but textile
    // evidence must never silently become a complete chemical inventory.
    if (product.eczema) {
      assert.equal(
        product.eczema.ingredientsComplete,
        false,
        `${product.id}: fabric disclosure is not a complete ingredient list`,
      );
      for (const flag of [
        "fragranceFree",
        "dyeFree",
        "essentialOilFree",
        "lanolinFree",
      ])
        assert.equal(
          product.eczema[flag],
          "unknown",
          `${product.id}: fabric origin cannot prove a formulation exclusion`,
        );
    }
  }
});

test("conflicting fabric claims and disclosed latex remain visible in the actual catalog", () => {
  const hanes = products.find(
    (product) => product.id === "hanes-pure-comfort-briefs-6",
  );
  assert.ok(hanes, "Keep the researched Hanes record");
  assert.equal(
    hanes.clothing.cottonRich,
    "unknown",
    "Conflicting color-dependent blends cannot become a verified cotton-rich claim",
  );
  assert.equal(
    hanes.clothing.woolFree,
    "unknown",
    "An unresolved full blend cannot establish the absence of wool",
  );
  assert.equal(
    hanes.clothing.latexFree,
    false,
    "Covered elastic must not conceal disclosed latex",
  );
  assert.equal(hanes.clothing.coveredElastic, true);
  assert.match(
    hanes.clothingNotes.waistband,
    /latex/i,
    "Visible construction note discloses latex",
  );
  assert.match(
    hanes.clothingNotes.finishes,
    /conflict|differ|inconsisten/i,
    "The fabric conflict must be visible",
  );
  assert.ok(
    hanes.components.some(
      (part) =>
        part.kind === "unknown" && /blend|fiber|fabric/i.test(part.material),
    ),
    "Unresolved blend belongs in component disclosure",
  );
});

test("real-catalog latex exclusion removes both unknown and known-latex underwear", () => {
  const underwear = products.filter(
    (product) => product.category === "underwear",
  );
  assert.equal(underwear.length, 3);
  assert.ok(
    underwear.some((product) => product.clothing.latexFree === "unknown"),
    "Catalog retains an explicitly unknown latex state",
  );
  assert.ok(
    underwear.some((product) => product.clothing.latexFree === false),
    "Catalog retains disclosed latex instead of relabeling it unknown",
  );
  assert.deepEqual(
    recommend(products, {
      category: "underwear",
      clothingFlags: ["latexFree"],
    }).map((product) => product.id),
    ["cottonique-drawstring-boxers-2"],
    "Only the explicit manufacturer latex-free claim satisfies the requirement",
  );
  const cottonique = underwear.find(
    (product) => product.id === "cottonique-drawstring-boxers-2",
  );
  assert.equal(
    cottonique.clothing.coveredElastic,
    false,
    "No elastic is different from covered elastic",
  );
  assert.ok(
    cottonique.sources.some((source) => /latex/i.test(source.title)),
    "The exclusion needs a traceable source",
  );
});

test("material labels do not hide synthetic or undisclosed component composition", () => {
  const classes = new Set([
    "fully-natural",
    "partially-natural",
    "contains-synthetics",
    "processed-material",
  ]);
  const kinds = new Set(["natural", "processed", "synthetic", "unknown"]);
  for (const product of products) {
    assert.ok(
      classes.has(product.naturalClass),
      `${product.id}: material class`,
    );
    assert.ok(
      Array.isArray(product.components) && product.components.length > 0,
      `${product.id}: disclose components`,
    );
    for (const component of product.components) {
      assert.ok(
        hasText(component.part) && hasText(component.material),
        `${product.id}: component disclosure`,
      );
      assert.ok(
        kinds.has(component.kind),
        `${product.id}: explicit component kind`,
      );
      if (component.kind === "unknown") {
        assert.match(
          component.material,
          /not|unknown|unspecif|undisclos|excluded/i,
          `${product.id}: uncertainty should be visible in the material description`,
        );
      }
    }
    const kindsPresent = new Set(
      product.components.map((component) => component.kind),
    );
    if (kindsPresent.has("synthetic"))
      assert.equal(
        product.naturalClass,
        "contains-synthetics",
        `${product.id}: disclosed synthetics must be visible in the product class`,
      );
    if (product.naturalClass === "fully-natural")
      assert.deepEqual(
        [...kindsPresent],
        ["natural"],
        `${product.id}: all components must be verified natural`,
      );
    if (product.naturalClass === "partially-natural")
      assert.ok(
        kindsPresent.has("natural"),
        `${product.id}: partially natural needs a natural component`,
      );
    if (product.naturalClass === "processed-material")
      assert.deepEqual(
        [...kindsPresent],
        ["processed"],
        `${product.id}: processed-only classification must not conceal other kinds`,
      );
  }
});

test("filter properties, lifespan claims, and editorial scores have explicit evidence limits", () => {
  for (const product of products) {
    for (const key of [
      "waterproof",
      "heatResistant",
      "flexible",
      "lightweight",
      "durable",
    ]) {
      assert.ok(
        [true, false, "unknown"].includes(product.properties?.[key]),
        `${product.id}: ${key} must be true, false or explicitly unknown`,
      );
    }
    assert.ok(
      hasText(product.lifespan?.label),
      `${product.id}: explain lifespan evidence`,
    );
    if (product.lifespan.months === null) {
      assert.match(
        product.lifespan.label,
        /no verified|unknown|not verified/i,
        `${product.id}: no unsupported lifespan estimate`,
      );
    } else {
      assert.ok(
        Number.isFinite(product.lifespan.months) && product.lifespan.months > 0,
        `${product.id}: valid lifespan`,
      );
      assert.ok(
        isHttps(product.lifespan.sourceUrl),
        `${product.id}: numeric lifespan requires its supporting source`,
      );
    }
    for (const key of ["function", "sustainability"])
      assert.ok(
        Number.isFinite(product.scores?.[key]) &&
          product.scores[key] >= 0 &&
          product.scores[key] <= 100,
        `${product.id}: valid relative ${key} score`,
      );
    assert.ok(
      product.sustainabilityReasons?.length > 0,
      `${product.id}: explain editorial ranking`,
    );
    assert.ok(
      product.advantages?.length > 0 && product.tradeoffs?.length > 0,
      `${product.id}: give benefits and trade-offs`,
    );
    assert.ok(
      product.sources?.length > 0,
      `${product.id}: provide research sources`,
    );
    for (const source of product.sources)
      assert.ok(
        hasText(source.title) && isHttps(source.url),
        `${product.id}: a titled source link is required`,
      );
  }
});
