import test from "node:test";
import assert from "node:assert/strict";
import {
  RANKING_WEIGHTS,
  normalizeQuery,
  validateProduct,
  compositionLabel,
  retailerUrl,
  searchCatalog,
  findAlternatives,
} from "../dist/ezr-matching.js";

function garment(id, overrides = {}) {
  return {
    id,
    name: "Black long-sleeve cotton top",
    category: "top",
    keywords: ["long-sleeved", "crew neck", "regular fit"],
    colors: ["Black"],
    sizes: ["S", "M", "L"],
    material_composition: [{ material: "cotton", percentage: 100 }],
    composition_status: "complete",
    trim_materials: ["cotton"],
    trims_status: "complete",
    price: 30,
    currency: "USD",
    retailer_name: "Illustrative seller",
    product_url: null,
    image_url: "assets/demo-top.svg",
    data_status: "illustrative",
    source_checked_at: null,
    description:
      "An illustrative garment, not evidence of medical suitability.",
    ...overrides,
  };
}
const ids = (result) => result.items.map(({ product }) => product.id);
const unknown = (id, overrides = {}) =>
  garment(id, {
    material_composition: [],
    composition_status: "unknown",
    ...overrides,
  });

test("normalization supports garment, sleeve, color, and fiber synonyms", () => {
  assert.equal(
    normalizeQuery(" Please FIND me a BLACK long-sleeved T-shirt! "),
    "black long sleeve top",
  );
  assert.equal(normalizeQuery("grey tee with spandex"), "gray top elastane");
  assert.equal(normalizeQuery("shirts tops tees tshirts"), "top top top top");
  assert.equal(normalizeQuery("trousers boxers rayon"), "pants boxer viscose");
  assert.equal(normalizeQuery(null), "");
});

test("all significant terms must match: black long sleeve top is not a category-only search", () => {
  const catalog = [
    garment("right"),
    garment("short", {
      name: "Black short sleeve top",
      keywords: ["short sleeve"],
    }),
    garment("blue", { name: "Blue long sleeve top", colors: ["blue"] }),
    garment("pants", {
      category: "pants",
      name: "Black cotton pants",
      keywords: ["straight leg"],
    }),
  ];
  for (const query of [
    "black long-sleeve top",
    "black long sleeved T-shirt",
    "black longsleeve tee",
  ]) {
    assert.deepEqual(ids(searchCatalog(catalog, { query })), ["right"], query);
  }
  assert.deepEqual(ids(searchCatalog(catalog, { query: "blue pants" })), []);
  assert.deepEqual(
    ids(searchCatalog(catalog, { query: "black mysterious top" })),
    [],
  );
});

test("search does not use descriptions, disclaimers, exclusion selections, or false material marketing", () => {
  const item = garment("a", {
    description: "Does not contain wool; sensitive skin is not assessed.",
    keywords: ["polyester-free", "long sleeve"],
  });
  for (const query of ["wool", "sensitive", "polyester"])
    assert.deepEqual(ids(searchCatalog([item], { query })), [], query);
  assert.deepEqual(
    ids(searchCatalog([item], { query: "wool", avoid: ["wool"] })),
    [],
  );
  assert.deepEqual(
    ids(searchCatalog([unknown("b")], { query: "cotton" })),
    [],
    "material in product name is not disclosure",
  );
});

test("underwear searches retain boxer and brief subtype terms", () => {
  const catalog = [
    garment("boxer", {
      name: "Everyday Cotton Boxer",
      category: "underwear",
      keywords: ["boxer"],
    }),
    garment("brief", {
      name: "Everyday Cotton Brief",
      category: "underwear",
      keywords: ["brief"],
    }),
    garment("boxer-brief", {
      name: "Everyday Cotton Boxer Brief",
      category: "underwear",
      keywords: ["boxer brief"],
    }),
    garment("top"),
  ];
  assert.deepEqual(ids(searchCatalog(catalog, { query: "underpants" })), [
    "boxer",
    "boxer-brief",
    "brief",
  ]);
  assert.deepEqual(ids(searchCatalog(catalog, { query: "boxers" })), [
    "boxer",
    "boxer-brief",
  ]);
  assert.deepEqual(ids(searchCatalog(catalog, { query: "briefs" })), [
    "boxer-brief",
    "brief",
  ]);
  assert.deepEqual(ids(searchCatalog(catalog, { query: "boxer briefs" })), [
    "boxer-brief",
  ]);
  assert.deepEqual(
    ids(searchCatalog(catalog, { query: "cotton underwear boxers" })),
    ["boxer", "boxer-brief"],
  );
});

test("similarity retains underwear subtype distinctions in shared-style ranking", () => {
  const reference = garment("reference", {
    category: "underwear",
    keywords: ["brief"],
  });
  const boxer = garment("a-boxer", {
    category: "underwear",
    keywords: ["boxer"],
  });
  const brief = garment("b-brief", {
    category: "underwear",
    keywords: ["brief"],
  });
  const result = findAlternatives([boxer, brief], reference);
  assert.deepEqual(ids(result), ["b-brief", "a-boxer"]);
  assert.match(
    result.items[0].reasons.join(" "),
    /Shared style details: brief/,
  );
  assert.ok(
    !result.items[1].reasons.some((reason) =>
      reason.startsWith("Shared style details"),
    ),
  );
});

test("prefer is soft ranking by known percentage, with zero bonus for unknown percentages", () => {
  const catalog = [
    garment("cotton-20", {
      material_composition: [
        { material: "cotton", percentage: 20 },
        { material: "polyester", percentage: 80 },
      ],
    }),
    garment("cotton-100"),
    garment("partial-known", {
      composition_status: "partial",
      material_composition: [{ material: "cotton", percentage: 50 }],
    }),
    garment("partial-unknown", {
      composition_status: "partial",
      material_composition: [{ material: "cotton", percentage: null }],
    }),
    unknown("unknown"),
    garment("poly-100", {
      material_composition: [{ material: "polyester", percentage: 100 }],
    }),
  ];
  const result = searchCatalog(catalog, { prefer: ["cotton"] });
  assert.deepEqual(ids(result), [
    "cotton-100",
    "partial-known",
    "cotton-20",
    "partial-unknown",
    "poly-100",
    "unknown",
  ]);
  assert.equal(result.total, 6, "preference never becomes a hard requirement");
  assert.equal(
    result.items[0].score,
    100 * RANKING_WEIGHTS.preferredMaterialPercentage,
  );
  assert.equal(result.items[3].score, 0);
  assert.match(result.items[0].reasons.join(" "), /100% cotton/);
});

test("hard exclusions detect even small blend percentages and disclosed textile trims", () => {
  const result = searchCatalog(
    [
      garment("clear"),
      garment("tiny-blend", {
        material_composition: [
          { material: "cotton", percentage: 99 },
          { material: "polyester", percentage: 1 },
        ],
      }),
      garment("trim", { trim_materials: ["polyester"] }),
      garment("partial-with-avoided", {
        composition_status: "partial",
        material_composition: [{ material: "polyester", percentage: null }],
      }),
    ],
    { avoid: ["polyester"] },
  );
  assert.deepEqual(ids(result), ["clear"]);
  assert.equal(result.excludedMaterials, 3);
  assert.equal(result.omittedUnknown, 0);
  assert.match(
    result.items[0].details.join(" "),
    /Dyes, finishes, and individual skin suitability are not assessed/,
  );
});

test("unknown fabric or textile trim disclosure never clears an exclusion", () => {
  const result = searchCatalog(
    [
      garment("clear"),
      unknown("unknown-fabric"),
      garment("unknown-trim", { trims_status: "unknown" }),
      garment("partial", {
        composition_status: "partial",
        material_composition: [{ material: "cotton", percentage: 80 }],
      }),
    ],
    { avoid: ["wool"] },
  );
  assert.deepEqual(ids(result), ["clear"]);
  assert.equal(result.omittedUnknown, 3);
  assert.equal(result.excludedMaterials, 0);
});

test("omission counts only include candidates matching query and USD maximum purchase price", () => {
  const catalog = [
    unknown("eligible"),
    unknown("too-costly", { price: 90 }),
    unknown("price-unknown", { price: null }),
    unknown("other-currency", { currency: "EUR" }),
    unknown("other-category", {
      category: "pants",
      name: "Blue trousers",
      keywords: [],
      colors: ["blue"],
    }),
    garment("known-avoided", {
      material_composition: [{ material: "polyester", percentage: 100 }],
      trims_status: "unknown",
    }),
  ];
  const result = searchCatalog(catalog, {
    query: "black long sleeve top",
    maxPrice: 40,
    avoid: ["polyester"],
  });
  assert.equal(result.omittedUnknown, 1);
  assert.equal(
    result.excludedMaterials,
    1,
    "known avoided takes priority over unknown trims",
  );
});

test("contradictory selections are explicit and synonyms cannot evade conflicts", () => {
  const result = searchCatalog([garment("a")], {
    prefer: ["spandex"],
    avoid: ["elastane"],
  });
  assert.deepEqual(result.conflicts, ["elastane"]);
  assert.deepEqual(result.items, []);
  assert.match(result.error, /both preferred and excluded/);
});

test("invalid maximum price is rejected rather than silently ignored", () => {
  for (const maxPrice of ["40", "", -1, NaN, Infinity, undefined]) {
    const result = searchCatalog([garment("a")], { maxPrice });
    // An omitted/undefined option is the same as the default null option.
    if (maxPrice === undefined) assert.equal(result.total, 1);
    else {
      assert.equal(result.total, 0);
      assert.match(result.error, /Maximum price/);
    }
  }
  assert.equal(
    searchCatalog([garment("a", { price: 0 })], { maxPrice: 0 }).total,
    1,
  );
});

test("price sorting keeps unknown prices last in either direction and tie ordering is deterministic", () => {
  const catalog = [
    garment("z", { price: null }),
    garment("b", { price: 20 }),
    garment("a", { price: 20 }),
    garment("c", { price: 40 }),
  ];
  assert.deepEqual(ids(searchCatalog(catalog, { sort: "price-asc" })), [
    "a",
    "b",
    "c",
    "z",
  ]);
  assert.deepEqual(ids(searchCatalog(catalog, { sort: "price-desc" })), [
    "c",
    "a",
    "b",
    "z",
  ]);
  assert.deepEqual(
    ids(searchCatalog(catalog)),
    ids(searchCatalog([...catalog].reverse())),
  );
  assert.deepEqual(ids(searchCatalog([garment("z"), garment("a")])), [
    "a",
    "z",
  ]);
});

test("matching never mutates caller catalog, preferences, or reference", () => {
  const catalog = [garment("b"), garment("a")];
  const options = { prefer: ["organic cotton"], avoid: [], sort: "price-asc" };
  const snapshot = structuredClone({ catalog, options });
  searchCatalog(catalog, options);
  findAlternatives(catalog, catalog[0], options);
  assert.deepEqual({ catalog, options }, snapshot);
});

test("similarity replaces the query, stays within category, and removes the reference item", () => {
  const reference = garment("reference");
  const catalog = [
    reference,
    garment("other"),
    garment("pants", { category: "pants" }),
  ];
  const result = findAlternatives(catalog, reference, {
    query: "pink trousers unicorn",
  });
  assert.deepEqual(ids(result), ["other"]);
  assert.match(result.items[0].reasons.join(" "), /Shared style details/);
  assert.match(result.items[0].reasons.join(" "), /Shared color/);
  assert.match(result.items[0].reasons.join(" "), /Similar listed price/);
  assert.match(
    result.items[0].reasons.join(" "),
    /Shared disclosed fabric fibers/,
  );
});

test("similarity never relaxes exclusions, unknown disclosure, budget, or conflicts", () => {
  const reference = garment("ref");
  const catalog = [
    reference,
    garment("clear"),
    garment("expensive", { price: 50 }),
    unknown("unknown"),
    garment("trim", { trim_materials: ["polyester"] }),
    garment("blend", {
      material_composition: [
        { material: "cotton", percentage: 95 },
        { material: "polyester", percentage: 5 },
      ],
    }),
  ];
  const result = findAlternatives(catalog, reference, {
    avoid: ["polyester"],
    maxPrice: 40,
  });
  assert.deepEqual(ids(result), ["clear"]);
  assert.equal(result.omittedUnknown, 1);
  assert.equal(result.excludedMaterials, 2);
  assert.equal(
    findAlternatives(catalog, reference, { avoid: ["cotton"] }).total,
    0,
  );
  assert.deepEqual(
    findAlternatives(catalog, reference, {
      prefer: ["cotton"],
      avoid: ["cotton"],
    }).conflicts,
    ["cotton"],
  );
  assert.match(
    findAlternatives(catalog, reference, { maxPrice: -1 }).error,
    /Maximum price/,
  );
});

test("similarity ranking favors shared style, color, price, and known materials with stable ties", () => {
  const reference = garment("reference");
  const catalog = [
    garment("far", {
      keywords: ["short sleeve"],
      colors: ["white"],
      price: 200,
      material_composition: [{ material: "linen", percentage: 100 }],
    }),
    garment("b"),
    garment("a"),
  ];
  const result = findAlternatives(catalog, reference);
  assert.deepEqual(ids(result), ["a", "b", "far"]);
  assert.deepEqual(
    ids(findAlternatives([...catalog].reverse(), reference)),
    ids(result),
  );
});

test("ranking weights can be overridden per call without changing exported defaults", () => {
  const result = searchCatalog([garment("a")], {
    prefer: ["cotton"],
    weights: { preferredMaterialPercentage: 2 },
  });
  assert.equal(result.items[0].score, 200);
  assert.equal(RANKING_WEIGHTS.preferredMaterialPercentage, 0.4);
  assert.match(
    searchCatalog([garment("a")], { weights: { mystery: 1 } }).error,
    /Ranking weights/,
  );
});

test("fabric labels keep exact percentages, partial disclosure, and unknowns distinct", () => {
  assert.equal(compositionLabel(garment("a")), "100% cotton");
  assert.equal(
    compositionLabel(
      garment("a", {
        material_composition: [
          { material: "cotton", percentage: 95 },
          { material: "elastane", percentage: 5 },
        ],
      }),
    ),
    "95% cotton · 5% elastane",
  );
  assert.equal(compositionLabel(unknown("a")), "Fabric composition unknown");
  assert.match(
    compositionLabel(
      garment("a", {
        composition_status: "partial",
        material_composition: [{ material: "cotton", percentage: null }],
      }),
    ),
    /percentage unknown.*Partial disclosure/,
  );
});

test("validation accepts disclosed uncertainty and rejects fabricated or invalid percentages", () => {
  assert.deepEqual(validateProduct(garment("a")), []);
  assert.deepEqual(
    validateProduct(garment("a", { retailer_name: null })),
    [],
    "illustrative records do not need an invented seller",
  );
  assert.deepEqual(validateProduct(unknown("a")), []);
  assert.deepEqual(
    validateProduct(
      garment("a", {
        composition_status: "partial",
        material_composition: [{ material: "cotton", percentage: null }],
      }),
    ),
    [],
  );
  for (const percentage of [-1, 101, NaN, Infinity, "100"]) {
    assert.ok(
      validateProduct(
        garment("a", {
          material_composition: [{ material: "cotton", percentage }],
        }),
      ).length,
      String(percentage),
    );
  }
  for (const percentage of [50, null])
    assert.ok(
      validateProduct(
        garment("a", {
          material_composition: [{ material: "cotton", percentage }],
        }),
      ).length,
    );
  assert.ok(
    validateProduct(
      garment("a", {
        material_composition: [{ material: "Cotton", percentage: 100 }],
      }),
    ).length,
  );
  assert.ok(
    validateProduct(garment("a", { composition_status: "unknown" })).length,
  );
  assert.ok(
    validateProduct(garment("a", { source_checked_at: "2026-02-31" })).length,
  );
  assert.deepEqual(
    validateProduct(
      garment("a", {
        material_composition: [{ material: "cotton", percentage: 99.7 }],
      }),
    ),
    [],
    "small rounding tolerance is explicit",
  );
});

test("malformed catalog records cannot bypass material or budget filters", () => {
  const catalog = [
    garment("valid"),
    garment("bad", {
      material_composition: [
        { material: "polyester", percentage: -5 },
        { material: "cotton", percentage: 105 },
      ],
    }),
    garment("price", { price: "10" }),
  ];
  assert.deepEqual(
    ids(searchCatalog(catalog, { avoid: ["polyester"], maxPrice: 40 })),
    ["valid"],
  );
});

test("retailer links require verified explicit HTTPS product pages and never guess a URL", () => {
  const url = "https://shop.retailer.org/products/cotton-shirt";
  assert.equal(
    retailerUrl(garment("a", { product_url: url })),
    null,
    "illustrative never links",
  );
  assert.equal(
    retailerUrl(garment("a", { data_status: "verified", product_url: url })),
    null,
    "unchecked claims of verification never link",
  );
  assert.equal(
    retailerUrl(
      garment("a", {
        data_status: "verified",
        product_url: url,
        source_checked_at: "2026-10-17",
      }),
    ),
    url,
  );
  for (const product_url of [
    null,
    "",
    "javascript:alert(1)",
    "http://shop.retailer.org/product",
    "https://example.com/product",
    "https://shop.retailer.org/",
    "https://shop.retailer.org/search?q=cotton",
    "https://user:password@shop.retailer.org/product",
    "https://localhost/product",
    "https://127.0.0.1/product",
  ]) {
    assert.equal(
      retailerUrl(
        garment("a", {
          data_status: "verified",
          source_checked_at: "2026-10-17",
          product_url,
        }),
      ),
      null,
      String(product_url),
    );
  }
});

test("verified records cannot use retailer home, search, or collection pages as product links", () => {
  for (const product_url of [
    "https://www.uniqlo.com/us/en/?srsltid=tracking",
    "https://www.hollisterco.com/shop/us",
    "https://us.louisvuitton.com/eng-us/homepage",
    "https://shop.retailer.org/en-US/",
    "https://shop.retailer.org/home?product=shirt",
    "https://shop.retailer.org/%68ome",
    "https://shop.retailer.org/us/en/index.html",
    "https://shop.retailer.org/?pid=123",
    "https://shop.retailer.org/us/en/search?q=cotton",
    "https://shop.retailer.org/search-results/cotton",
    "https://www.gap.com/browse/category.do?cid=15043",
    "https://shop.retailer.org/categories/tops",
    "https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks?colorProductCode=CT123",
    "https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ003",
    "https://shop.retailer.org/collection/cotton",
    "https://shop.retailer.org/collections/cotton?sort=price",
    "https://shop.retailer.org/collections/cotton/products/",
    "https://shop.retailer.org/products/%ZZ",
  ]) {
    const product = garment("a", {
      data_status: "verified",
      source_checked_at: "2026-10-17",
      product_url,
    });
    assert.equal(retailerUrl(product), null, product_url);
    assert.ok(
      validateProduct(product).some((error) =>
        /HTTPS product page/.test(error),
      ),
      product_url,
    );
  }
});

test("exact product routes remain valid across retailers and preserve variant queries", () => {
  for (const product_url of [
    "https://www.gap.com/browse/product.do?pid=428038002",
    "https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ003?colorCode=GR7543&colorProductCode=CT123&display=all&fit=Women",
    "https://www.jcrew.com/p/mens/categories/clothing/tshirts-and-polos/t-shirts/BZ100?colorCode=PP7700&colorProductCode=BZ100&display=sale&fit=Classic&isFromSale=true",
    "https://www.asos.com/us/topman/topman-classic-fit-t-shirt-in-white/prd/210991303",
    "https://www.zara.com/us/en/100-linen-relaxed-fit-pants-p05070902.html",
    "https://shop.retailer.org/products/cotton-shirt?variant=Black%2FWhite",
    "https://shop.retailer.org/collections/cotton/products/crew-neck-shirt?variant=123",
    "https://shop.retailer.org/collections/cotton/product/crew-neck-shirt",
    "https://shop.retailer.org/products/search-party-shirt",
  ]) {
    const product = garment("a", {
      data_status: "verified",
      source_checked_at: "2026-10-17",
      product_url,
    });
    assert.equal(retailerUrl(product), product_url, product_url);
    assert.deepEqual(validateProduct(product), [], product_url);
  }
});

test("retailer link validation preserves the exact stored URL rather than reserializing it", () => {
  const product_url =
    "https://Shop.Retailer.org:443/items/../products/top?variant=Black%2FWhite&source=Exact#size-M";
  assert.notEqual(
    new URL(product_url).href,
    product_url,
    "fixture exercises parser normalization",
  );
  const product = garment("a", {
    data_status: "verified",
    source_checked_at: "2026-10-17",
    product_url,
  });
  assert.equal(retailerUrl(product), product_url);
  for (const invalid of [
    ` ${product_url}`,
    `${product_url} `,
    `${product_url}\n`,
    "https://shop.retailer.org/products/black top",
  ]) {
    assert.equal(
      retailerUrl({ ...product, product_url: invalid }),
      null,
      "whitespace cannot silently alter the source URL",
    );
  }
});
