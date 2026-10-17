// US listing snapshots checked 2026-10-16. Not live prices or tolerance guarantees.
const checkedAt = "2026-10-16";
const cottoniqueUrl =
  "https://cottonique.com/products/latex-free-mens-drawstring-loose-boxer-shorts-2-pack";
const pactUrl = "https://www.target.com/p/-/A-1009080710";
const hanesUrl =
  "https://www.target.com/p/hanes-women-s-6pk-pure-comfort-organic-cotton-briefs-assorted/-/A-79521878";
const hanesMaker =
  "https://www.hanes.com/products/hanes-pure-comfort-women-rsquo-s-briefs-underwear-organic-cotton-assorted-colors-6-pack/pc40as";
const offer = (name, price, unitCount, url) => ({
  name,
  price,
  unitCount,
  url,
  shipping: "Calculated at checkout",
  checkedAt,
});
const source = (title, url) => ({ title, url });
const lifespan = {
  months: null,
  label: "No verified lifespan in months. Use your own replacement assumption.",
  sourceUrl: null,
};
const properties = {
  waterproof: false,
  heatResistant: "unknown",
  flexible: "unknown",
  lightweight: "unknown",
  durable: "unknown",
};
const eczemaBase = {
  fragranceFree: "unknown",
  dyeFree: "unknown",
  essentialOilFree: "unknown",
  lanolinFree: "unknown",
  neaAccepted: "unknown",
  ingredientsComplete: false,
};

export const underwearProducts = [
  {
    id: "cottonique-drawstring-boxers-2",
    category: "underwear",
    name: "Drawstring Loose Boxer Shorts — Natural, 2-pack",
    brand: "Cottonique",
    price: 48,
    unitCount: 2,
    priceUnit: "pair",
    imageUrl: "/assets/clothing-underwear-cottonique.jpg",
    imageAlt:
      "Cottonique natural-colored drawstring boxer shorts shown on an adult catalog model",
    naturalClass: "partially-natural",
    materialSummary:
      "Organic cotton fabric, thread, drawstring and label; coconut button.",
    components: [
      {
        part: "Fabric, thread and drawstring",
        material: "100% organic cotton jersey; cotton thread and cord",
        kind: "natural",
      },
      {
        part: "Label and button",
        material: "Woven cotton label and coconut button",
        kind: "natural",
      },
      {
        part: "Finishes",
        material: "Complete processing chemistry not disclosed",
        kind: "unknown",
      },
    ],
    function: "Loose underpants with an adjustable waist and button fly.",
    advantages: [
      "Explicit manufacturer latex-free claim.",
      "Drawstring waist without elastic.",
    ],
    tradeoffs: [
      "A drawstring adjusts differently from stretch elastic.",
      "A woven label remains; check rubbing and fit individually.",
    ],
    care: "Gentle machine wash; no bleach; tumble dry and iron low.",
    lifespan: { ...lifespan },
    properties: { ...properties },
    scores: { function: 80, sustainability: 0 },
    sustainabilityReasons: [
      "Plant-based disclosed textile components.",
      "No independent whole-garment lifecycle comparison is available here; keep using comfortable garments.",
    ],
    sellers: [offer("Cottonique", 48, 2, cottoniqueUrl)],
    sources: [
      source(
        "Cottonique: materials, latex exclusion, construction, care and two-pack price",
        cottoniqueUrl,
      ),
    ],
    stockNote:
      "Natural two-pack; listed sale price $48, regular $60. Brand uses men's sizing; compare measurements and cut, regardless of identity. Availability varies.",
    country: "US",
    clothing: {
      cottonRich: true,
      woolFree: true,
      latexFree: true,
      coveredElastic: false,
      flatSeams: "unknown",
      noSewnLabel: false,
    },
    clothingNotes: {
      fit: "Loose leg; manufacturer men's S/M–2XL/3XL sizing.",
      waistband:
        "Cotton drawstring, no elastic. Covered-elastic filter does not apply.",
      seams:
        "Cotton thread; smooth seam side faces skin. Flat seams not explicitly confirmed.",
      labels: "Woven cotton label; not tagless.",
      finishes:
        "Maker excludes dyes, bleach, resins and formaldehyde; this is not a complete chemical inventory.",
    },
    eczema: {
      ...eczemaBase,
      cottonRich: true,
      woolFree: true,
      ingredients:
        "Cotton textile components and coconut button. Full processing chemistry is not published.",
      ingredientSource: cottoniqueUrl,
      texture: "Midweight cotton jersey, 150–179 GSM.",
      sensitiveNote:
        "Manufacturer exclusions do not guarantee personal tolerance. Check the label, seam contact, drawstring pressure and exact size.",
    },
  },
  {
    id: "pact-everyday-boxer-briefs-2",
    category: "underwear",
    name: "Everyday Boxer Briefs — Black, 2-pack",
    brand: "Pact",
    price: 28.99,
    unitCount: 2,
    priceUnit: "pair",
    imageUrl: "/assets/clothing-underwear-pact.jpg",
    imageAlt:
      "Black Pact Everyday boxer brief shown alone against a light background",
    naturalClass: "contains-synthetics",
    materialSummary:
      "95% organic cotton and 5% elastane main fabric; trim composition not fully specified.",
    components: [
      { part: "Main fabric", material: "95% organic cotton", kind: "natural" },
      { part: "Stretch fiber", material: "5% elastane", kind: "synthetic" },
      {
        part: "Waistband, thread, label print and finishes",
        material: "Composition not fully disclosed",
        kind: "unknown",
      },
    ],
    function: "Close-fitting boxer briefs with thigh coverage.",
    advantages: [
      "Cotton-rich main fabric with stretch.",
      "Retailer specifies tagless construction.",
    ],
    tradeoffs: [
      "Contains synthetic elastane; not a fully natural garment.",
      "Latex content and seam construction remain unverified.",
    ],
    care: "Machine wash cold; tumble dry low.",
    lifespan: { ...lifespan },
    properties: { ...properties, flexible: true, lightweight: true },
    scores: { function: 80, sustainability: 0 },
    sustainabilityReasons: [
      "Plant-based cotton is blended with synthetic elastane.",
      "No verified comparative lifecycle result or disposal route; do not assume blended fabric is compostable.",
    ],
    sellers: [offer("Target — sold by Pact", 28.99, 2, pactUrl)],
    sources: [
      source(
        "Pact at Target: black small two-pack, fabric, tagless claim, care and price",
        pactUrl,
      ),
      source(
        "Pact: Everyday Boxer Brief fabric composition",
        "https://wearpact.com/men/underwear/boxers%20%26%20briefs/everyday%20boxer%20brief/wb1-mbb-blk",
      ),
    ],
    stockNote:
      "Snapshot for black, small, two-pack, UPC 197551348566. Target's embedded size chart appears inconsistent with the men's listing; confirm measurements with Pact. Tax and delivery excluded.",
    country: "US",
    clothing: {
      cottonRich: true,
      woolFree: true,
      latexFree: "unknown",
      coveredElastic: "unknown",
      flatSeams: "unknown",
      noSewnLabel: true,
    },
    clothingNotes: {
      fit: "Supportive boxer-brief cut. Confirm measurements with Pact; retailer size chart is inconsistent.",
      waistband:
        "Smooth waistband; covering material and latex status unverified.",
      seams: "Flat-seam construction not explicitly confirmed.",
      labels: "Listed as tagless; printing chemistry unknown.",
      finishes: "Dyed black. Complete dye and finish chemistry not disclosed.",
    },
    eczema: {
      ...eczemaBase,
      cottonRich: true,
      woolFree: true,
      ingredients:
        "95% organic cotton, 5% elastane main fabric. Waistband, thread, print and finish chemistry not fully published.",
      ingredientSource: pactUrl,
      texture: "Lightweight stretch knit, close to the body.",
      sensitiveNote:
        "Cotton-rich does not mean elastane-free or latex-free. Check waistband pressure and fit; tagless printing can still contact skin.",
    },
  },
  {
    id: "hanes-pure-comfort-briefs-6",
    category: "underwear",
    name: "Pure Comfort High-Rise Briefs — Assorted, 6-pack",
    brand: "Hanes",
    price: 15.99,
    unitCount: 6,
    priceUnit: "pair",
    imageUrl: "/assets/clothing-underwear-hanes.jpg",
    imageAlt:
      "Hanes Pure Comfort organic cotton brief assortment product catalog image",
    naturalClass: "partially-natural",
    materialSummary:
      "Listed cotton body; latex-containing elastic. Assorted-color fiber disclosures conflict.",
    components: [
      {
        part: "Main fabric",
        material:
          "Listing says 100% organic cotton; brand Q&A says some colors may include other fibers. Exact blend unknown",
        kind: "unknown",
      },
      {
        part: "Waistband covering and lining",
        material: "Cotton",
        kind: "natural",
      },
      {
        part: "Waist and leg elastic",
        material:
          "Contains natural rubber latex, per brand response; full elastic composition not disclosed",
        kind: "unknown",
      },
      {
        part: "Thread, print, dyes and finishes",
        material: "Full chemistry not disclosed",
        kind: "unknown",
      },
    ],
    function: "High-rise briefs with full front and back coverage.",
    advantages: [
      "Cotton-covered waistband and documented flat side seams.",
      "Tagless construction; six-pair purchase.",
    ],
    tradeoffs: [
      "Recent brand Q&A confirms latex in waist and leg elastic despite older conflicting replies; do not rely on a latex-free claim.",
      "Assorted-color fabric statements conflict; confirm the exact package before relying on a cotton percentage.",
    ],
    care: "Machine wash cold. Retailer permits tumble drying; follow the package label.",
    lifespan: { ...lifespan },
    properties: { ...properties, lightweight: true },
    scores: { function: 80, sustainability: 0 },
    sustainabilityReasons: [
      "Disclosed cotton covering is plant-based; full component composition remains uncertain.",
      "No verified lifespan or whole-product recycling/composting claim is made here.",
    ],
    sellers: [offer("Target", 15.99, 6, hanesUrl)],
    sources: [
      source(
        "Hanes: PC40AS construction, main-fabric claim and care",
        hanesMaker,
      ),
      source(
        "Target: six-pack price and brand Q&A on latex and color-dependent fibers",
        hanesUrl,
      ),
    ],
    stockNote:
      "Selected size 6, six-pack, UPC 194164840920; colors vary. Brand uses women's sizing. Check the fit chart and package. Price excludes tax and delivery.",
    country: "US",
    clothing: {
      cottonRich: "unknown",
      woolFree: "unknown",
      latexFree: false,
      coveredElastic: true,
      flatSeams: true,
      noSewnLabel: true,
    },
    clothingNotes: {
      fit: "High rise and full coverage; compare the manufacturer's hip measurements.",
      waistband:
        "Cotton-covered elastic. Brand confirms natural rubber latex in waist and leg elastic.",
      seams:
        "Manufacturer explicitly specifies flat side seams; other seams unverified.",
      labels: "Tagless design; print composition unknown.",
      finishes:
        "Assorted dyes and finishing chemistry not fully disclosed. Cotton-percentage statements conflict by color.",
    },
    eczema: {
      ...eczemaBase,
      cottonRich: "unknown",
      woolFree: "unknown",
      ingredients:
        "Published cotton-body claim conflicts with brand color-variation Q&A. Cotton waistband covering; latex-containing elastic; other trim and finish chemistry unknown.",
      ingredientSource: hanesUrl,
      texture: "Lightweight knit with a covered waistband and flat side seams.",
      sensitiveNote:
        "Covered elastic still contains latex according to the brand. Do not treat cotton fabric, tagless labeling or organic claims as an allergy guarantee.",
    },
  },
];
