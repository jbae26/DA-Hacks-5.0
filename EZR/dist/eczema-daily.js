// Public US product listings checked 2026-10-16. Prices are snapshots, not live quotes.
// This catalog supports label comparison; it does not establish individual tolerance.
const checkedAt = "2026-10-16";
const aadCare =
  "https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis/atopic-dermatitis-coping";
const source = (title, url) => ({ title, url });
const offer = (name, price, url) => ({
  name,
  price,
  unitCount: 1,
  url,
  shipping: "Calculated at checkout",
  checkedAt,
});
const noLifespan = {
  label:
    "No verified lifespan in months. Enter your own replacement or consumption assumption for the cost scenario.",
  months: null,
  sourceUrl: null,
};
const detergentProperties = {
  waterproof: "unknown",
  heatResistant: "unknown",
  flexible: "unknown",
  lightweight: "unknown",
  durable: "unknown",
};
const clothingFlags = {
  fragranceFree: "unknown",
  dyeFree: "unknown",
  essentialOilFree: "unknown",
  lanolinFree: "unknown",
  ingredientsComplete: false,
  neaAccepted: "unknown",
  cottonRich: true,
  woolFree: true,
};

export const dailyProducts = [
  {
    id: "tide-free-gentle-42",
    category: "detergent",
    name: "Free & Gentle Liquid — 42 fl oz",
    brand: "Tide",
    price: 7.19,
    unitCount: 1,
    priceUnit: "bottle",
    imageUrl: "/assets/eczema-tide.jpg",
    imageAlt:
      "White Tide Free & Gentle liquid laundry detergent bottle, 32 loads",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Fragrance-free and dye-free detergent with surfactants, enzymes and a preservative.",
    components: [
      {
        part: "Cleaning formula",
        material:
          "Water, surfactants, cleaning enzymes and formulation aids; see ingredient snapshot",
        kind: "processed",
      },
      {
        part: "Preservative in retailer list",
        material: "Benzisothiazolinone",
        kind: "synthetic",
      },
      {
        part: "Packaging",
        material: "Plastic bottle and cap",
        kind: "synthetic",
      },
    ],
    function:
      "Washes machine-washable laundry; selected bottle is labeled for 32 loads, depending on dose.",
    advantages: [
      "Manufacturer states no dyes or perfumes.",
      "Free & Gentle HE liquid is listed in the NEA Seal of Acceptance directory.",
    ],
    tradeoffs: [
      "Contains cleaning enzymes and benzisothiazolinone in the retailer ingredient list; these still need checking against personal allergies.",
      "Retailer and NEA ingredient lists differ. Compare your exact bottle and UPC before relying on an exclusion.",
    ],
    care: "Use the dose on the bottle for your washer and load size, and follow garment care labels. Laundry use only; keep away from children and eyes. Rinse clothing adequately.",
    lifespan: { ...noLifespan },
    properties: { ...detergentProperties },
    scores: { function: 95, sustainability: 50 },
    sustainabilityReasons: [
      "Cold-water use is supported by the manufacturer.",
      "Packaging and formulation are not fully natural; material origin does not predict skin tolerance.",
    ],
    sellers: [offer("Target", 7.19, "https://www.target.com/p/-/A-94370621")],
    sources: [
      source(
        "Tide manufacturer formula claims and directions",
        "https://tide.com/en-us/shop/type/liquid/tide-free-and-gentle-liquid",
      ),
      source(
        "Target: 42 fl oz price, UPC 030772121474 and ingredient snapshot",
        "https://www.target.com/p/-/A-94370621",
      ),
      source(
        "NEA: Free & Gentle HE liquid directory entry",
        "https://nationaleczema.org/eczema-products/tide-free-and-gentle-liquid-high-efficiency-for-fdm/",
      ),
      source(
        "AAD: clothing and laundry choices for atopic dermatitis",
        aadCare,
      ),
    ],
    stockNote:
      "42 fl oz / 32-load selection. Price excludes promotions, tax and delivery. NEA listing describes a different bottle size; verify the seal and formula on the package you purchase.",
    country: "US",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: "unknown",
      lanolinFree: "unknown",
      cottonRich: "unknown",
      woolFree: "unknown",
      neaAccepted: true,
      sensitiveNote:
        "Fragrance/dye-free is a useful label criterion, not a guarantee against a flare. Enzymes and benzisothiazolinone remain in the retailer list. The NEA entry and retailer list differ, so we cannot establish a complete current ingredient exclusion list for this bottle.",
      ingredients:
        "Retailer snapshot: Water; C10-16 Pareth; Sodium C10-16 Alkylbenzenesulfonate; Sodium Lauryl Sulfate; Polyethyleneimines Alkoxylated; Sodium Salts of C12-18 Fatty Acids; Sodium Citrate; Propylene Glycol; C10-16 Alkyldimethylamine Oxide; Alcohol; Sodium Cumenesulfonate; Tetrasodium Glutamate Diacetate; Calcium Formate; Subtilisin; Amylase Enzyme; Benzisothiazolinone; Cellulase Enzyme; Mannanase Enzyme. The NEA entry lists additional/different ingredients, including phenoxyethanol and polymers. Confirm the current package label.",
      ingredientsComplete: false,
      ingredientSource: "https://www.target.com/p/-/A-94370621",
      neaSource:
        "https://nationaleczema.org/eczema-products/tide-free-and-gentle-liquid-high-efficiency-for-fdm/",
      texture: "Liquid detergent for laundering textiles, not a skin cleanser.",
    },
  },
  {
    id: "all-free-clear-73",
    category: "detergent",
    name: "Free Clear The Original — 73 fl oz",
    brand: "all",
    price: 11.99,
    unitCount: 1,
    priceUnit: "bottle",
    imageUrl: "/assets/eczema-all.jpg",
    imageAlt:
      "Manufacturer image of all Free Clear The Original 73 fl oz bottle, 58 loads, with NEA seal",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Detergent labeled free of perfumes and dyes; current ingredient sources are inconsistent.",
    components: [
      {
        part: "Cleaning formula",
        material:
          "Water, surfactants and formulation aids; online ingredient snapshots differ",
        kind: "processed",
      },
      {
        part: "Preservative in retailer list",
        material:
          "Benzisothiazolinone; current manufacturer/NEA formula should be checked",
        kind: "synthetic",
      },
      {
        part: "Packaging",
        material: "Plastic bottle and cap",
        kind: "synthetic",
      },
    ],
    function:
      "Machine laundry detergent; selected 73 fl oz bottle is labeled for 58 medium loads.",
    advantages: [
      "Manufacturer states no perfumes or dyes.",
      "The Original Concentrated is listed in the NEA Seal of Acceptance directory.",
    ],
    tradeoffs: [
      "Retailer lists benzisothiazolinone; the newer NEA entry lists enzymes and a different formula. Neither establishes what is in every bottle currently sold.",
      "The retailer title selects 73 fl oz, while some description text still says 88 fl oz. Confirm size, ingredients and dose at checkout.",
    ],
    care: "Follow the dose printed on your exact bottle and the garment care label. Use for laundry only, avoid eye contact and keep away from children. Do not use detergent as a skin patch test.",
    lifespan: { ...noLifespan },
    properties: { ...detergentProperties },
    scores: { function: 94, sustainability: 50 },
    sustainabilityReasons: [
      "Manufacturer supports cold-water washing.",
      "This is a formulated detergent in plastic packaging; no whole-product natural claim is made.",
    ],
    sellers: [offer("Target", 11.99, "https://www.target.com/p/-/A-13219348")],
    sources: [
      source(
        "all manufacturer product, 73 oz directions and label claims",
        "https://www.all-laundry.com/products/liquid-laundry-detergent/all-free-clear-liquid-laundry-detergent-the-original.html",
      ),
      source(
        "Target: selected 73 fl oz price and ingredient snapshot",
        "https://www.target.com/p/-/A-13219348",
      ),
      source(
        "NEA: all Free Clear The Original Concentrated",
        "https://nationaleczema.org/eczema-products/all-free-clear-the-original-concentrated/",
      ),
      source(
        "AAD: clothing and laundry choices for atopic dermatitis",
        aadCare,
      ),
    ],
    stockNote:
      "Price is for the retailer's selected 73 fl oz option. Some older text/images reference 88 fl oz. Manufacturer photo is for 73 fl oz; check actual package before purchase.",
    country: "US",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: "unknown",
      lanolinFree: "unknown",
      cottonRich: "unknown",
      woolFree: "unknown",
      neaAccepted: true,
      sensitiveNote:
        "NEA acceptance is not an individual tolerance guarantee. Online ingredient sources conflict: the retailer lists benzisothiazolinone, while the current NEA Original Concentrated entry lists protease and mannanase enzymes. Ask the manufacturer about your bottle if you have a known ingredient allergy.",
      ingredients:
        "Retailer snapshot: Water; C12-15 Alcohols Ethoxylated; Sodium Laureth Sulfate; Sodium Carbonate; Trisodium Dicarboxymethyl Alaninate; Fatty Acids, C8-18 and C18-Unsaturated Sodium Salts; Sodium Polyacrylate; Benzisothiazolinone. NEA Original Concentrated snapshot instead lists C12-15 Alcohols Ethoxylated, Ethanol, Fatty Acids C8-18 and C18-Unsaturated Sodium Salts, Glycerin, Iminodisuccinic Acid, Mannanase Enzyme, Polyethyleneimine Alkoxylated, Protease Enzyme, Sodium Laureth Sulfate and Water. These are conflicting snapshots, not a combined formulation.",
      ingredientsComplete: false,
      ingredientSource: "https://www.target.com/p/-/A-13219348",
      neaSource:
        "https://nationaleczema.org/eczema-products/all-free-clear-the-original-concentrated/",
      texture: "Liquid detergent for laundering textiles, not a skin cleanser.",
    },
  },
  {
    id: "seventh-free-clear-90",
    category: "detergent",
    name: "Free & Clear Liquid — 90 fl oz",
    brand: "Seventh Generation",
    price: 12.99,
    unitCount: 1,
    priceUnit: "bottle",
    imageUrl: "/assets/eczema-seventh.jpg",
    imageAlt:
      "Seventh Generation Free & Clear liquid laundry detergent, 90 fl oz, 60 loads",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Fragrance/dye-free formula with plant-derived surfactants, enzymes and synthetic preservatives.",
    components: [
      {
        part: "Surfactants and formula",
        material:
          "Water, processed plant-derived cleaning agents, salts and enzymes",
        kind: "processed",
      },
      {
        part: "Preservatives",
        material: "Benzisothiazolinone and methylisothiazolinone",
        kind: "synthetic",
      },
      {
        part: "Packaging",
        material: "Plastic bottle and cap; maker reports recycled content",
        kind: "synthetic",
      },
    ],
    function:
      "Machine laundry detergent for HE or standard washers; bottle is labeled for 60 loads at the stated dose.",
    advantages: [
      "Manufacturer states no fragrances, dyes or optical brighteners.",
      "The manufacturer publishes the formula's preservatives and enzymes.",
    ],
    tradeoffs: [
      "Contains methylisothiazolinone and benzisothiazolinone. A plant-derived formula is not an allergy exclusion.",
      "Includes protease, amylase and mannanase enzymes. Check your own known triggers before switching.",
    ],
    care: "Follow the label dose for your washer and load, and garment care instructions. Laundry use only; keep out of eyes and away from children. Use adequate rinsing.",
    lifespan: { ...noLifespan },
    properties: { ...detergentProperties },
    scores: { function: 93, sustainability: 65 },
    sustainabilityReasons: [
      "Maker reports a 97% USDA Certified Biobased formula and recycled-content bottle.",
      "Biobased content does not establish individual skin tolerance or whole-product compostability.",
    ],
    sellers: [offer("Target", 12.99, "https://www.target.com/p/-/A-84215092")],
    sources: [
      source(
        "Seventh Generation: Free & Clear formula and directions",
        "https://www.seventhgeneration.com/liquid-laundry-detergent-free-clear",
      ),
      source(
        "Target: selected 90 fl oz price, ingredients and 60-load package",
        "https://www.target.com/p/-/A-84215092",
      ),
      source(
        "AAD: clothing and laundry choices for atopic dermatitis",
        aadCare,
      ),
    ],
    stockNote:
      "One 90 fl oz Free & Clear bottle. Do not substitute a fragranced variant when checking the label.",
    country: "US",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: true,
      lanolinFree: true,
      cottonRich: "unknown",
      woolFree: "unknown",
      neaAccepted: "unknown",
      sensitiveNote:
        "Fragrance-free does not mean preservative-free. Methylisothiazolinone and benzisothiazolinone are listed. Essential-oil/lanolin exclusions here reflect the published ingredient list, not laboratory testing or a tolerance guarantee.",
      ingredients:
        "Water; Laureth-6; Sodium Citrate; Sodium Lauryl Sulfate; Sodium Chloride; Sodium Oleate; Sodium Sulfate; Citric Acid; Protease Enzyme Blend; Amylase Enzyme Blend; Mannanase Enzyme Blend; Benzisothiazolinone; Methylisothiazolinone. Manufacturer list snapshot; check the current bottle for changes.",
      ingredientsComplete: true,
      ingredientSource:
        "https://www.seventhgeneration.com/liquid-laundry-detergent-free-clear",
      texture: "Liquid detergent for laundering textiles, not a skin cleanser.",
    },
  },
  {
    id: "terra-cotton-tee",
    category: "tshirt",
    name: "Organic Cotton T-shirt — Midnight Blue",
    brand: "Terra Thread",
    price: 14.97,
    unitCount: 1,
    priceUnit: "shirt",
    imageUrl: "/assets/terra-tee.jpg",
    imageAlt: "Terra Thread midnight blue organic cotton T-shirt",
    naturalClass: "contains-synthetics",
    materialSummary:
      "100% organic cotton main fabric; polyester sewing thread and printed label.",
    components: [
      {
        part: "Main fabric",
        material: "100% organic cotton, 180 GSM",
        kind: "natural",
      },
      { part: "Sewing thread", material: "Polyester", kind: "synthetic" },
      {
        part: "Dyes and printed label",
        material: "Full chemical composition not disclosed",
        kind: "unknown",
      },
    ],
    function: "All-gender everyday crewneck T-shirt.",
    advantages: [
      "Cotton main fabric with a familiar everyday cut.",
      "Manufacturer says it is prewashed and preshrunk.",
    ],
    tradeoffs: [
      "Polyester stitching and unspecified label ink still contact skin.",
      "Final sale: returns and exchanges are excluded; check fit before buying.",
    ],
    care: "Maker: cold gentle wash with similar colors; hang dry or tumble low; avoid ironing the printed label. AAD advises washing new clothing before wearing it and choosing a loose fit.",
    lifespan: { ...noLifespan },
    properties: {
      waterproof: false,
      heatResistant: "unknown",
      flexible: true,
      lightweight: "unknown",
      durable: "unknown",
    },
    scores: { function: 94, sustainability: 78 },
    sustainabilityReasons: [
      "Manufacturer reports Regenerative Organic Certified cotton.",
      "Cotton origin is separate from eczema tolerance; sewing thread is polyester.",
    ],
    sellers: [
      offer(
        "Terra Thread",
        14.97,
        "https://terrathread.com/products/organic-cotton-t-shirts",
      ),
    ],
    sources: [
      source(
        "Terra Thread: fabric, stitching, care and final-sale price",
        "https://terrathread.com/products/organic-cotton-t-shirts",
      ),
      source("AAD: loose cotton clothing and washing before wear", aadCare),
    ],
    stockNote:
      "Listed final-sale price. Sizes and colors may be limited; main-fabric claims do not cover thread, dyes or printed label.",
    country: "US",
    eczema: {
      ...clothingFlags,
      sensitiveNote:
        "Cotton main fabric may fit a loose, soft clothing preference. Polyester thread, dyes and label ink remain; organic certification does not guarantee that this shirt will not irritate your skin.",
      ingredients:
        "100% organic cotton main fabric; polyester thread; printed label and dyes with unspecified chemical composition. This is a textile component disclosure, not a complete chemical ingredient list.",
      texture:
        "Manufacturer describes a soft, 180 GSM cotton knit. Check seams, printed label and fit against your own sensitivities.",
    },
  },
  {
    id: "cottonique-mens-tee",
    category: "tshirt",
    name: "Men's Cotton T-Shirt — Melange Black",
    brand: "Cottonique",
    price: 24,
    unitCount: 1,
    priceUnit: "shirt",
    imageUrl: "/assets/eczema-cottonique.jpg",
    imageAlt:
      "Model wearing Cottonique's Melange Black cotton crewneck T-shirt",
    naturalClass: "partially-natural",
    materialSummary:
      "Organic cotton jersey, cotton sewing thread and cotton label; dyed fabric.",
    components: [
      {
        part: "Main fabric",
        material: "100% organic cotton single jersey, fiber-dyed, 150 GSM",
        kind: "natural",
      },
      {
        part: "Sewing thread",
        material: "100% cotton colored thread",
        kind: "natural",
      },
      { part: "Label", material: "100% woven cotton", kind: "natural" },
      {
        part: "Dyes and finishes",
        material: "Full chemical composition not published",
        kind: "unknown",
      },
    ],
    function: "Classic-fit, short-sleeve cotton crewneck shirt.",
    advantages: [
      "Manufacturer specifies cotton thread, cotton label and flat seams.",
      "Lightweight 150 GSM jersey with no wool in disclosed textile components.",
    ],
    tradeoffs: [
      "Dyed fabric is not dye-free; finish chemistry is not fully disclosed.",
      "Cotton labels and seams can still rub. The maker's hypoallergenic claim is not an individual guarantee.",
    ],
    care: "Maker: machine wash on a gentle cycle, do not bleach, tumble dry low and iron at low heat. Wash before first wear and choose a comfortable loose fit.",
    lifespan: { ...noLifespan },
    properties: {
      waterproof: false,
      heatResistant: "unknown",
      flexible: true,
      lightweight: true,
      durable: "unknown",
    },
    scores: { function: 95, sustainability: 72 },
    sustainabilityReasons: [
      "Maker discloses cotton across fabric, stitching and label.",
      "Dyes and disposal conditions remain relevant; no verified full-product compostability claim is made here.",
    ],
    sellers: [
      offer(
        "Cottonique",
        24,
        "https://cottonique.com/products/mens-t-shirt-colored",
      ),
    ],
    sources: [
      source(
        "Cottonique: Melange Black shirt materials, flat seams, care and sale price",
        "https://cottonique.com/products/mens-t-shirt-colored",
      ),
      source("AAD: loose cotton clothing and washing before wear", aadCare),
    ],
    stockNote:
      "Listed sale price $24 (regular $30) for the Melange Black selection. Confirm your size and current price.",
    country: "US",
    eczema: {
      ...clothingFlags,
      sensitiveNote:
        "Flat seams and cotton stitching are explicitly documented. The shirt still contains dyes and a woven label; no product is guaranteed to suit every person with eczema. Formulation exclusion filters do not apply to clothing.",
      ingredients:
        "100% organic cotton single-jersey fiber-dyed fabric; 100% cotton colored sewing thread; 100% woven cotton label. Full dye and finish chemistry is not provided.",
      texture:
        "Soft knitted single jersey, 150 GSM; manufacturer specifies flat seam stitching.",
    },
  },
  {
    id: "pact-softspun-tee",
    category: "tshirt",
    name: "Softspun Essential Crewneck Tee — Black",
    brand: "Pact",
    price: 24,
    unitCount: 1,
    priceUnit: "shirt",
    imageUrl: "/assets/eczema-pact.jpg",
    imageAlt: "Model wearing Pact's black Softspun Essential Crewneck Tee",
    naturalClass: "partially-natural",
    materialSummary:
      "100% organic cotton main fabric; thread, ink and finish chemistry not fully disclosed.",
    components: [
      { part: "Main fabric", material: "100% organic cotton", kind: "natural" },
      {
        part: "Thread and interior label stamp",
        material: "Composition not fully disclosed",
        kind: "unknown",
      },
      {
        part: "Dyes and finishes",
        material: "Full chemical composition not published",
        kind: "unknown",
      },
    ],
    function: "Everyday short-sleeve cotton crewneck shirt.",
    advantages: [
      "100% organic cotton main fabric.",
      "Printed interior tag instead of a sewn neck tag, according to the brand's wholesale listing.",
    ],
    tradeoffs: [
      "An interior stamp still uses ink; its composition is not specified.",
      "No verified service-life or individual eczema-tolerance estimate is available.",
    ],
    care: "Brand listing: machine wash cold and tumble dry low. Wash new clothing before wearing it and choose a fit that avoids rubbing.",
    lifespan: { ...noLifespan },
    properties: {
      waterproof: false,
      heatResistant: "unknown",
      flexible: true,
      lightweight: "unknown",
      durable: "unknown",
    },
    scores: { function: 94, sustainability: 72 },
    sustainabilityReasons: [
      "Main fabric is organic cotton; the brand lists GOTS certification.",
      "No full lifecycle assessment is supplied; continued comfortable use matters more than a natural label alone.",
    ],
    sellers: [
      offer(
        "Pact",
        24,
        "https://wearpact.com/men/apparel/all%20tops/softspun%20essential%20crewneck%20tee/wc1-mcn-blk",
      ),
    ],
    sources: [
      source(
        "Pact: black Softspun Essential Crewneck Tee product and listed price",
        "https://wearpact.com/men/apparel/all%20tops/softspun%20essential%20crewneck%20tee/wc1-mcn-blk",
      ),
      source(
        "Pact brand wholesale listing: care and interior label stamp",
        "https://www.faire.com/product/p_yur84pgy7r",
      ),
      source("AAD: loose cotton clothing and washing before wear", aadCare),
    ],
    stockNote:
      "Listed single-shirt price before temporary promotions. Confirm available size and current price; price varies with offers.",
    country: "US",
    eczema: {
      ...clothingFlags,
      sensitiveNote:
        "Cotton main fabric and an interior tag stamp are disclosed. Ink, thread and finish details remain unverified; natural fabric does not establish freedom from every contact allergen.",
      ingredients:
        "100% organic cotton main fabric; thread, interior stamp ink, dyes and finishes are not fully specified. Textile disclosure is not a complete ingredient list.",
      texture:
        "Brand describes a soft cotton knit; interior label is stamped. Check seams, fit and finish tolerance individually.",
    },
  },
];
