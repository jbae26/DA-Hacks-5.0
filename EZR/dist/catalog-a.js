// Manufacturer specifications and listed US prices checked 2026-10-16.
// Scores are editorial comparison aids, not lifecycle assessments or certifications.
const checkedAt = "2026-10-16";
const seller = (name, price, unitCount, url) => ({
  name,
  price,
  unitCount,
  url,
  shipping: "Calculated at checkout",
  checkedAt,
});
const source = (title, url) => ({ title, url });
const brushProperties = {
  waterproof: false,
  heatResistant: "unknown",
  flexible: false,
  lightweight: "unknown",
  durable: "unknown",
};

export const productsA = [
  {
    id: "bamboo-switch-brush",
    category: "toothbrush",
    name: "Bamboo Toothbrush",
    brand: "Bamboo Switch",
    price: 5,
    unitCount: 1,
    priceUnit: "brush",
    imageUrl: "/assets/bamboo-brush.jpg",
    imageAlt:
      "Bamboo Switch toothbrush with a bamboo handle and white bristles",
    naturalClass: "partially-natural",
    materialSummary:
      "Bamboo handle; castor-oil-derived bristles with unspecified polymer chemistry.",
    components: [
      { part: "Handle", material: "Bamboo", kind: "natural" },
      {
        part: "Bristles",
        material:
          "Castor-oil-derived; exact polymer not disclosed on this product page",
        kind: "unknown",
      },
    ],
    function: "Manual daily toothbrushing.",
    advantages: [
      "One-brush purchase option.",
      "Familiar full-length manual brush.",
    ],
    tradeoffs: [
      "Needs a dry, ventilated holder.",
      "Plant-derived bristles do not establish a fully natural or home-compostable whole brush.",
    ],
    care: "Rinse after use and air-dry; avoid a damp, closed container.",
    lifespan: {
      label:
        "Manufacturer replacement guide: 3–4 months, sooner if worn. Cost estimate uses 3 months.",
      months: 3,
      sourceUrl:
        "https://www.bambooswitch.com/products/bamboo-toothbrush-compostable-bristle?variant=41375793119337",
    },
    properties: { ...brushProperties },
    scores: { function: 91, sustainability: 73 },
    sustainabilityReasons: [
      "The handle uses bamboo instead of a molded plastic handle.",
      "Bristle composition and local disposal acceptance need checking.",
    ],
    sellers: [
      seller(
        "Bamboo Switch",
        5,
        1,
        "https://www.bambooswitch.com/products/bamboo-toothbrush-compostable-bristle?variant=41375793119337",
      ),
    ],
    sources: [
      source(
        "Bamboo Switch product, materials and care",
        "https://www.bambooswitch.com/products/bamboo-toothbrush-compostable-bristle?variant=41375793119337",
      ),
    ],
    stockNote:
      "Single-brush listing; confirm availability and shipping at checkout.",
    country: "US",
  },
  {
    id: "humble-soft-brush",
    category: "toothbrush",
    name: "Humble Brush — Adult Soft",
    brand: "The Humble Co.",
    price: 5.59,
    unitCount: 1,
    priceUnit: "brush",
    imageUrl: "/assets/hum-brush.png",
    imageAlt: "Humble Brush adult bamboo toothbrush with black soft bristles",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Bamboo handle with nylon bristles; includes synthetic material.",
    components: [
      { part: "Handle", material: "Bamboo", kind: "natural" },
      {
        part: "Bristles",
        material: "Nylon; US page also describes plant-derived content",
        kind: "synthetic",
      },
      {
        part: "Bristle anchors",
        material: "Stainless steel clamps",
        kind: "processed",
      },
    ],
    function: "Soft-bristled manual toothbrushing.",
    advantages: [
      "Soft bristle option.",
      "Uses a bamboo handle and paper packaging.",
    ],
    tradeoffs: [
      "Nylon bristles remain synthetic.",
      "Separate bristles and anchors before considering handle disposal.",
    ],
    care: "Keep dry between uses; replace worn brushes following the maker’s instructions.",
    lifespan: {
      label: "Manufacturer replacement guide: every 3 months.",
      months: 3,
      sourceUrl:
        "https://us.thehumble.co/products/humble-brush-adult-black-soft-brisltes",
    },
    properties: { ...brushProperties },
    scores: { function: 95, sustainability: 71 },
    sustainabilityReasons: [
      "Bamboo replaces the conventional plastic handle.",
      "Mixed components require separation; the whole brush is not compostable.",
    ],
    sellers: [
      seller(
        "The Humble Co. US",
        5.59,
        1,
        "https://us.thehumble.co/products/humble-brush-adult-black-soft-brisltes",
      ),
    ],
    sources: [
      source(
        "Humble US product and price",
        "https://us.thehumble.co/products/humble-brush-adult-black-soft-brisltes",
      ),
      source(
        "Humble component disclosure and disposal",
        "https://www.thehumble.co/products/humble-brush-adult-black-soft-brisltes",
      ),
    ],
    stockNote:
      "The US page shows both a sold-out label and an add-to-cart control. Confirm stock with the seller.",
    country: "US",
  },
  {
    id: "bite-bamboo-brush",
    category: "toothbrush",
    name: "Bamboo Toothbrush — 2 Pack",
    brand: "Bite",
    price: 12,
    unitCount: 2,
    priceUnit: "brush",
    imageUrl: "/assets/bite-brush.jpg",
    imageAlt: "Two Bite bamboo toothbrushes with detachable handles",
    naturalClass: "partially-natural",
    materialSummary:
      "Moso bamboo, castor-oil-derived bristles and metal staples.",
    components: [
      { part: "Handle and head", material: "Moso bamboo", kind: "natural" },
      {
        part: "Bristles",
        material: "Castor-oil-derived; exact polymer not disclosed",
        kind: "unknown",
      },
      { part: "Bristle anchors", material: "Metal staples", kind: "processed" },
    ],
    function: "Manual toothbrushing with a detachable head for packing.",
    advantages: ["Detaches for travel.", "Two brushes per one-time order."],
    tradeoffs: [
      "Costs $12 upfront for the pair.",
      "A plant feedstock does not establish natural fibers or local compostability.",
    ],
    care: "Rinse and allow to dry. Follow the maker’s separation instructions for bristles and metal staples; check local disposal rules.",
    lifespan: {
      label: "Manufacturer replacement guide: every 4 months.",
      months: 4,
      sourceUrl: "https://bitetoothpastebits.com/products/bamboo-toothbrush",
    },
    properties: { ...brushProperties },
    scores: { function: 93, sustainability: 75 },
    sustainabilityReasons: [
      "Bamboo replaces the conventional plastic handle.",
      "Metal anchors and uncertain bristle chemistry prevent a verified fully natural label.",
    ],
    sellers: [
      seller(
        "Bite",
        12,
        2,
        "https://bitetoothpastebits.com/products/bamboo-toothbrush",
      ),
    ],
    sources: [
      source(
        "Bite toothbrush specifications and one-time price",
        "https://bitetoothpastebits.com/products/bamboo-toothbrush",
      ),
    ],
    stockNote:
      "One-time two-pack price; subscriptions and promotions may differ.",
    country: "US",
  },
  {
    id: "terra-cotton-tee",
    category: "tshirt",
    name: "Organic Cotton T-shirt",
    brand: "Terra Thread",
    price: 14.97,
    unitCount: 1,
    priceUnit: "shirt",
    imageUrl: "/assets/terra-tee.jpg",
    imageAlt: "Terra Thread midnight blue organic cotton T-shirt",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Regenerative Organic Certified cotton fabric; polyester stitching.",
    components: [
      {
        part: "Main fabric",
        material: "Organic cotton, 180 GSM",
        kind: "natural",
      },
      { part: "Sewing thread", material: "Polyester", kind: "synthetic" },
      {
        part: "Printed label",
        material: "Ink composition unspecified",
        kind: "unknown",
      },
    ],
    function: "An all-gender everyday crewneck shirt.",
    advantages: [
      "Lower listed purchase price.",
      "Prewashed and preshrunk cotton fabric.",
    ],
    tradeoffs: [
      "Sale is final; no returns or exchanges.",
      "Polyester thread means the whole shirt is not fully natural.",
    ],
    care: "Cold gentle wash with similar colors; dry on low or hang. Avoid ironing the printed label.",
    lifespan: {
      label: "No verified service-life estimate; wear and laundering matter.",
      months: null,
      sourceUrl: null,
    },
    properties: {
      waterproof: false,
      heatResistant: "unknown",
      flexible: true,
      lightweight: "unknown",
      durable: "unknown",
    },
    scores: { function: 96, sustainability: 81 },
    sustainabilityReasons: [
      "The cotton is Regenerative Organic Certified and GOTS certified.",
      "The maker explicitly discloses polyester sewing thread.",
    ],
    sellers: [
      seller(
        "Terra Thread",
        14.97,
        1,
        "https://terrathread.com/products/organic-cotton-t-shirts",
      ),
    ],
    sources: [
      source(
        "Terra Thread materials, final-sale price and care",
        "https://terrathread.com/products/organic-cotton-t-shirts",
      ),
    ],
    stockNote: "Listed sale price; available sizes and colors may be limited.",
    country: "US",
  },
  {
    id: "patagonia-hemp-tee",
    category: "tshirt",
    name: "Work Pocket T-Shirt",
    brand: "Patagonia",
    price: 49,
    unitCount: 1,
    priceUnit: "shirt",
    imageUrl: "/assets/patagonia-tee.jpg",
    imageAlt: "Patagonia Work Pocket T-shirt in Shore Blue",
    naturalClass: "partially-natural",
    materialSummary:
      "55% hemp / 45% organic cotton main fabric; trim and thread not fully specified.",
    components: [
      {
        part: "Main jersey fabric",
        material: "55% industrial hemp / 45% organic cotton",
        kind: "natural",
      },
      {
        part: "Thread, label and decoration",
        material: "Composition not fully disclosed",
        kind: "unknown",
      },
    ],
    function: "Relaxed everyday or work shirt with a chest pocket.",
    advantages: [
      "Sturdy 6.6-ounce fabric.",
      "Chest pocket for small essentials.",
    ],
    tradeoffs: [
      "292 g listed weight is heavier than the wool option.",
      "Natural main fabric does not verify every component.",
    ],
    care: "Wash warm, avoid bleach, tumble dry on low and use a warm iron.",
    lifespan: {
      label:
        "No verified number of wears or years; repair and care affect service life.",
      months: null,
      sourceUrl: null,
    },
    properties: {
      waterproof: false,
      heatResistant: "unknown",
      flexible: true,
      lightweight: false,
      durable: true,
    },
    scores: { function: 94, sustainability: 84 },
    sustainabilityReasons: [
      "Main fabric combines hemp with organic cotton.",
      "The brand offers repair support through its Ironclad Guarantee; repairs can extend use.",
    ],
    sellers: [
      seller(
        "Patagonia US",
        49,
        1,
        "https://www.patagonia.com/product/mens-work-pocket-t-shirt/53396.html",
      ),
    ],
    sources: [
      source(
        "Patagonia US specifications and price",
        "https://www.patagonia.com/product/mens-work-pocket-t-shirt/53396.html",
      ),
      source(
        "Official product photograph, same style and color",
        "https://www.patagonia.jp/product/mens-work-pocket-t-shirt/53396.html",
      ),
      source(
        "Patagonia repair and guarantee",
        "https://www.patagonia.com/repairs/",
      ),
    ],
    stockNote:
      "US price for style 53396; select your size and color on the seller’s site.",
    country: "US",
  },
  {
    id: "icebreaker-merino-tee",
    category: "tshirt",
    name: "Merino 150 Tech Lite T-Shirt",
    brand: "icebreaker",
    price: 90,
    unitCount: 1,
    priceUnit: "shirt",
    imageUrl: "/assets/ice-tee.jpg",
    imageAlt: "Black icebreaker Merino 150 Tech Lite short-sleeve T-shirt",
    naturalClass: "partially-natural",
    materialSummary:
      "100% merino wool main fabric; decoration excluded from fiber disclosure.",
    components: [
      { part: "Main fabric", material: "100% merino wool", kind: "natural" },
      {
        part: "Decoration and sewing details",
        material: "Not included in full fiber disclosure",
        kind: "unknown",
      },
    ],
    function: "Light everyday or hiking T-shirt.",
    advantages: ["146 g listed weight in medium.", "Offset shoulder seams."],
    tradeoffs: [
      "Higher upfront price.",
      "Requires line drying; not suitable for tumble drying.",
    ],
    care: "Cold wash with similar colors; skip softener and bleach. Line-dry in shade; cool iron only.",
    lifespan: {
      label:
        "No verified lifespan; the calculator uses an editable scenario, not a forecast.",
      months: null,
      sourceUrl: null,
    },
    properties: {
      waterproof: false,
      heatResistant: false,
      flexible: true,
      lightweight: true,
      durable: "unknown",
    },
    scores: { function: 92, sustainability: 77 },
    sustainabilityReasons: [
      "Main fabric uses wool without a synthetic fiber blend.",
      "Animal sourcing, washing and actual garment life still affect overall impact.",
    ],
    sellers: [
      seller(
        "icebreaker US",
        90,
        1,
        "https://na.icebreaker.com/en-us/products/merino-150-tech-lite-short-sleeve-t-shirt-ib0a56wl001",
      ),
    ],
    sources: [
      source(
        "icebreaker US style IB0A56WL001, price and care",
        "https://na.icebreaker.com/en-us/products/merino-150-tech-lite-short-sleeve-t-shirt-ib0a56wl001",
      ),
    ],
    stockNote: "Black, style IB0A56WL001; availability depends on size.",
    country: "US",
  },
];
