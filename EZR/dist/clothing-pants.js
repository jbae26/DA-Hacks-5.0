// US product-label and price snapshots checked 2026-10-16.
// Published construction details are not evidence of individual skin tolerance.
const checkedAt = "2026-10-16";
const womenUrl =
  "https://cottonique.com/products/womens-drawstring-pants-pockets?variant=47839031034098";
const menUrl =
  "https://cottonique.com/products/mens-drawstring-lounge-pants-colored?variant=48029516267762";
const quinceUrl =
  "https://www.quince.com/women/women-s-100-organic-cotton-gauze-straight-leg-pants?color=black";
const offer = (name, price, url, shipping = "Calculated at checkout") => ({
  name,
  price,
  unitCount: 1,
  url,
  shipping,
  checkedAt,
});
const lifespan = {
  months: null,
  label:
    "No verified lifespan in months. Enter your own replacement assumption for the cost scenario.",
  sourceUrl: null,
};
const properties = {
  waterproof: "unknown",
  heatResistant: "unknown",
  flexible: "unknown",
  lightweight: "unknown",
  durable: "unknown",
};
const eczema = {
  fragranceFree: "unknown",
  dyeFree: "unknown",
  essentialOilFree: "unknown",
  lanolinFree: "unknown",
  cottonRich: true,
  woolFree: true,
  neaAccepted: "unknown",
  ingredientsComplete: false,
};
const cottoniqueClothing = {
  cottonRich: true,
  woolFree: true,
  latexFree: true,
  coveredElastic: false,
  flatSeams: true,
  noSewnLabel: false,
};
const cottoniqueComponents = [
  {
    part: "Main fabric",
    material: "100% organic cotton single jersey; fiber-dyed",
    kind: "natural",
  },
  { part: "Drawstring and sewing thread", material: "Cotton", kind: "natural" },
  { part: "Label", material: "Woven cotton", kind: "natural" },
  {
    part: "Dyes and finishes",
    material: "Complete chemistry not disclosed",
    kind: "unknown",
  },
];
const cottoniqueCare =
  "Machine wash gently; no bleach. Use low heat for drying and ironing. Follow the label on the delivered garment.";
const cottoniqueNotes = {
  waistband:
    "Adjustable cotton drawstring; no elastic. Covered elastic is not applicable.",
  seams: "Maker explicitly specifies flat seams and cotton thread.",
  labels: "A woven cotton label remains; not a tag-free design.",
  finishes: "Colored fabric; full dye and finish chemistry is unavailable.",
};

export const pantsProducts = [
  {
    id: "cottonique-womens-drawstring-pants",
    category: "pants",
    name: "Women's Drawstring Pants with Patch Pockets — Melange Black",
    brand: "Cottonique",
    price: 44,
    unitCount: 1,
    priceUnit: "pair",
    imageUrl: "/assets/clothing-pants-cottonique-women.jpg",
    imageAlt:
      "Model wearing dark grey Cottonique women's drawstring pants with patch pockets",
    naturalClass: "partially-natural",
    materialSummary:
      "Cotton fabric, thread, drawstring and label; dye chemistry unspecified.",
    components: cottoniqueComponents.map((component) => ({ ...component })),
    function: "Full-length casual and lounge pants with front pockets.",
    advantages: ["Adjustable non-elastic waist.", "Flat seams are documented."],
    tradeoffs: [
      "Drawstring position may differ from the photo as stock transitions between versions.",
      "The woven label and dyed fabric still need checking against your own preferences.",
    ],
    care: cottoniqueCare,
    lifespan: { ...lifespan },
    properties: { ...properties },
    scores: { function: 80, sustainability: 0 },
    sustainabilityReasons: [
      "Plant-based main fabric. No whole-garment lifecycle comparison is available.",
      "Keep using comfortable clothing; check local textile collection rules when it is worn out.",
    ],
    sellers: [offer("Cottonique", 44, womenUrl)],
    sources: [
      {
        title:
          "Cottonique: selected pants, materials, construction, care and current USD sale price",
        url: womenUrl,
      },
    ],
    stockNote:
      "Melange Black, size 6 snapshot: $44 sale / $55 regular. Promotion and size availability may change. Photo may show the older external drawstring.",
    country: "US",
    clothing: { ...cottoniqueClothing },
    clothingNotes: {
      ...cottoniqueNotes,
      fit: "Women's cut, adjustable waist; check the size chart rather than assuming your usual size.",
    },
    eczema: {
      ...eczema,
      ingredients:
        "Cotton textile components; dyes and finish chemistry not fully listed. This is not a complete chemical ingredient disclosure.",
      ingredientSource: womenUrl,
      texture: "Midweight 230 GSM jersey, according to the maker.",
      sensitiveNote:
        "Latex-free and flat-seam claims describe construction. They do not establish freedom from every allergen or guarantee that the garment will suit eczema-prone skin.",
    },
  },
  {
    id: "quince-cotton-gauze-pants",
    category: "pants",
    name: "Women's Organic Cotton Gauze Straight Leg Pants — Black",
    brand: "Quince",
    price: 39.9,
    unitCount: 1,
    priceUnit: "pair",
    imageUrl: "/assets/clothing-pants-quince.jpg",
    imageAlt: "Model wearing black Quince cotton gauze straight-leg pants",
    naturalClass: "partially-natural",
    materialSummary:
      "100% organic cotton main fabric; elastic and trim composition unspecified.",
    components: [
      {
        part: "Main fabric",
        material: "100% organic cotton double-knit gauze",
        kind: "natural",
      },
      {
        part: "Waistband",
        material: "Elastic present; composition not listed",
        kind: "unknown",
      },
      {
        part: "Thread, labels, dyes and finishes",
        material: "Complete composition not disclosed",
        kind: "unknown",
      },
    ],
    function: "Easy-fit straight-leg everyday pants with side pockets.",
    advantages: [
      "Cotton main fabric is explicitly specified.",
      "Relaxed silhouette with an elastic waist.",
    ],
    tradeoffs: [
      "Latex content and whether every elastic surface is covered are unverified.",
      "Flat seams and tag-free construction are not documented.",
    ],
    care: "Cool machine wash, no bleach; dry on low heat or hang dry. Check the garment care label.",
    lifespan: { ...lifespan },
    properties: { ...properties },
    scores: { function: 80, sustainability: 0 },
    sustainabilityReasons: [
      "Plant-based main fabric; elastic and other trims remain relevant to disposal.",
      "No verified lifecycle comparison or replacement schedule is available.",
    ],
    sellers: [
      offer(
        "Quince",
        39.9,
        quinceUrl,
        "Free standard shipping stated on product page; confirm checkout terms",
      ),
    ],
    sources: [
      {
        title:
          "Quince US: black gauze pants, fiber content, waistband, fit, care and price",
        url: quinceUrl,
      },
    ],
    stockNote:
      "Black selection listed at $39.90. Choose your size and verify availability at checkout; price excludes tax.",
    country: "US",
    clothing: {
      cottonRich: true,
      woolFree: true,
      latexFree: "unknown",
      coveredElastic: "unknown",
      flatSeams: "unknown",
      noSewnLabel: "unknown",
    },
    clothingNotes: {
      fit: "Maker calls this an easy fit; size-small inseam is 30 inches.",
      waistband:
        "Elastic waistband documented; elastic composition and complete coverage unknown.",
      seams: "Seam construction is not specified.",
      labels: "Interior label construction is not specified.",
      finishes:
        "Black fabric is colored; full dye and finish chemistry is unavailable.",
    },
    eczema: {
      ...eczema,
      ingredients:
        "Cotton main fabric with elastic waistband; remaining components and processing chemicals are not fully specified.",
      ingredientSource: quinceUrl,
      texture:
        "Textured cotton gauze; personal tolerance cannot be assessed from an online description.",
      sensitiveNote:
        "Cotton main fabric does not establish a latex-free garment. Ask the maker about the elastic, seams, tags or finishes when one of these is important to you.",
    },
  },
  {
    id: "cottonique-mens-drawstring-pants",
    category: "pants",
    name: "Men's Drawstring Lounge Pants — Deep Melange Blue",
    brand: "Cottonique",
    price: 36,
    unitCount: 1,
    priceUnit: "pair",
    imageUrl: "/assets/clothing-pants-cottonique-men.jpg",
    imageAlt: "Model wearing blue Cottonique men's drawstring lounge pants",
    naturalClass: "partially-natural",
    materialSummary:
      "Cotton fabric, thread, drawstring and label; dyed jersey.",
    components: cottoniqueComponents.map((component) => ({ ...component })),
    function: "Full-length lounge pants with front pockets.",
    advantages: [
      "Cotton drawstring replaces elastic tension at the waist.",
      "Maker documents flat seams and cotton stitching.",
    ],
    tradeoffs: [
      "Drawstring position may differ from the photo as stock transitions between versions.",
      "Woven label and colored fabric remain; this is not a verified dye-free garment.",
    ],
    care: cottoniqueCare,
    lifespan: { ...lifespan },
    properties: { ...properties },
    scores: { function: 80, sustainability: 0 },
    sustainabilityReasons: [
      "Plant-based main fabric. A cotton label alone is not a complete environmental assessment.",
      "Repair and continued comfortable use can avoid an unnecessary replacement; no lifespan is assumed here.",
    ],
    sellers: [offer("Cottonique", 36, menUrl)],
    sources: [
      {
        title:
          "Cottonique: current colored men's pants, component list, construction, care and USD sale price",
        url: menUrl,
      },
    ],
    stockNote:
      "Deep Melange Blue, S/M snapshot: $36 sale / $45 regular. Confirm size, promotion and current construction before purchasing.",
    country: "US",
    clothing: { ...cottoniqueClothing },
    clothingNotes: {
      ...cottoniqueNotes,
      fit: "Men's lounge cut in combined sizes; check measurements before choosing.",
    },
    eczema: {
      ...eczema,
      ingredients:
        "Cotton textile components; full dye and finish chemistry is not published. Other colorways or production versions may use different thread.",
      ingredientSource: menUrl,
      texture: "Deep Melange Blue jersey is listed at 250–260 GSM.",
      sensitiveNote:
        "These are the current colored-version specifications. Flat seams and the maker's latex-free claim do not predict an individual's reaction or make these pants eczema treatment.",
    },
  },
];
