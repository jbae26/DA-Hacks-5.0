// US product and one-time retail price snapshots checked 2026-10-16.
// Ingredient exclusions describe disclosed formulas; they do not establish personal tolerance.
const checkedAt = "2026-10-16";
const seller = (price, url) => ({
  name: "Ulta Beauty",
  price,
  unitCount: 1,
  url,
  shipping: "Calculated at checkout; taxes excluded",
  checkedAt,
});
const source = (title, url) => ({ title, url });
const unknownProperties = {
  waterproof: "unknown",
  heatResistant: "unknown",
  flexible: "unknown",
  lightweight: "unknown",
  durable: "unknown",
};
const lifespan = {
  label:
    "How long this container lasts depends on the amount used. Follow the package expiry/open-container symbol; no verified months-per-container estimate.",
  months: null,
  sourceUrl: null,
};
const skinDefaults = {
  unitCount: 1,
  naturalClass: "contains-synthetics",
  properties: unknownProperties,
  lifespan,
  country: "US",
  scores: { function: 80, sustainability: 0 },
};
const ingredientNote =
  "Absence flags are based on the listed US ingredients and manufacturer claims, not allergy testing. Formulas can change: check the actual package and your known allergens.";

export const skinProducts = [
  {
    ...skinDefaults,
    id: "vanicream-moisturizing-cream",
    category: "moisturizer",
    name: "Moisturizing Cream — 16 oz pump",
    brand: "Vanicream",
    price: 20.99,
    priceUnit: "jar",
    imageUrl: "/assets/eczema-vanicream-cream.png",
    imageAlt: "Vanicream Moisturizing Cream 16 ounce white jar with blue pump",
    materialSummary:
      "Petrolatum-based cream with sorbitol and synthetic formulation ingredients.",
    components: [
      {
        part: "Moisture-sealing ingredient",
        material: "Petrolatum (refined petroleum)",
        kind: "processed",
      },
      {
        part: "Humectant",
        material: "Sorbitol; source not specified",
        kind: "unknown",
      },
      {
        part: "Formula ingredients",
        material:
          "Propylene glycol, ceteareth-20, simethicone, PEG-30 stearate",
        kind: "synthetic",
      },
    ],
    function: "Daily face and body moisturization.",
    advantages: [
      "Fragrance-free; manufacturer also excludes botanical extracts and essential oils.",
      "Pump dispenses a rich cream without reaching into the jar.",
    ],
    tradeoffs: [
      "A rich cream may feel heavier than a facial lotion.",
      "Contains propylene glycol. Ulta also lists BHT, which the current manufacturer list omits; check your package.",
    ],
    care: "Apply as needed following the product label, including after bathing. Avoid a product containing a known personal allergen.",
    sustainabilityReasons: [
      "Manufacturer directs users to discard the pump and check local acceptance for the rinsed 16 oz container.",
    ],
    sellers: [
      seller(
        20.99,
        "https://www.ulta.com/p/moisturizing-cream-with-pump-sensitive-skin-pimprod2042406?sku=2619667",
      ),
    ],
    sources: [
      source(
        "Vanicream formula, directions and NEA status",
        "https://www.vanicream.com/product/vanicream-moisturizing-cream",
      ),
      source(
        "Ulta 16 oz price and ingredient list",
        "https://www.ulta.com/p/moisturizing-cream-with-pump-sensitive-skin-pimprod2042406?sku=2619667",
      ),
      source(
        "National Eczema Association product listing",
        "https://nationaleczema.org/eczema-products/vanicream-moisturizing-cream/",
      ),
    ],
    stockNote:
      "One-time price for the 16 oz pump jar. Confirm price and availability before buying.",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: true,
      lanolinFree: true,
      neaAccepted: true,
      texture: "Rich cream",
      ingredientsComplete: false,
      ingredients:
        "Water, Petrolatum, Sorbitol, Cetearyl Alcohol, Propylene Glycol, Ceteareth-20, Simethicone, Glyceryl Stearate, PEG-30 Stearate, Sorbic Acid, BHT.",
      ingredientNote:
        "Ulta's complete list is retained conservatively for ingredient screening. The current Vanicream ingredient list omits BHT; the current purchased formula is unconfirmed and different stock may differ. " +
        ingredientNote,
      sensitiveNote:
        "NEA acceptance does not guarantee individual tolerance. Review propylene glycol and the BHT formula discrepancy if either is on your personal avoidance list.",
    },
  },
  {
    ...skinDefaults,
    id: "cerave-moisturizing-cream",
    category: "moisturizer",
    name: "Moisturizing Cream — 12 oz",
    brand: "CeraVe",
    price: 15.99,
    priceUnit: "jar",
    imageUrl: "/assets/eczema-cerave-cream.png",
    imageAlt: "CeraVe Moisturizing Cream 12 ounce white and blue jar",
    materialSummary:
      "Cream with ceramides, glycerin, petrolatum and dimethicone.",
    components: [
      {
        part: "Moisture-sealing ingredient",
        material: "Petrolatum (refined petroleum)",
        kind: "processed",
      },
      {
        part: "Skin-conditioning silicone",
        material: "Dimethicone",
        kind: "synthetic",
      },
      {
        part: "Ceramides and humectants",
        material:
          "Ceramide NP/AP/EOP, glycerin, sodium hyaluronate; sources not specified",
        kind: "unknown",
      },
    ],
    function: "Daily face and body moisturization.",
    advantages: [
      "Fragrance-free cream with three ceramides.",
      "12 oz jar provides a larger amount than a small facial tube.",
    ],
    tradeoffs: [
      "Jar format requires clean hands or a clean applicator.",
      "Contains phenoxyethanol and other formula ingredients; fragrance-free does not mean suitable for every allergy.",
    ],
    care: "Apply as often as needed following the label. Keep the jar closed between uses and check its current ingredient list.",
    sustainabilityReasons: [
      "No product lifecycle comparison has been established here; check local packaging disposal rules.",
    ],
    sellers: [
      {
        name: "Target",
        price: 15.99,
        unitCount: 1,
        url: "https://www.target.com/p/-/A-15078541",
        shipping: "Calculated at checkout; taxes excluded",
        checkedAt,
      },
      seller(
        17.99,
        "https://www.ulta.com/p/moisturizing-cream-body-face-moisturizer-xlsImpprod3530069?sku=2541604",
      ),
    ],
    sources: [
      source(
        "Target price and exact UPC 3606000537729",
        "https://www.target.com/p/-/A-15078541",
      ),
      source(
        "CeraVe US formula and directions",
        "https://www.cerave.com/skincare/moisturizers/moisturizing-cream",
      ),
      source(
        "Ulta 12 oz price",
        "https://www.ulta.com/p/moisturizing-cream-body-face-moisturizer-xlsImpprod3530069?sku=2541604",
      ),
      source(
        "National Eczema Association product listing",
        "https://nationaleczema.org/eczema-products/cerave-moisturizing-cream/",
      ),
    ],
    stockNote:
      "Both offers match UPC 3606000537729 for the 12 oz (340 g) jar. Target labels it 12 fl oz online; the package is marked 12 oz. Prices exclude shipping and tax.",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: true,
      lanolinFree: true,
      neaAccepted: true,
      texture: "Rich cream",
      ingredientsComplete: true,
      ingredients:
        "Aqua / Water / Eau, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Petrolatum, Potassium Phosphate, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Dimethicone, Behentrimonium Methosulfate, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phenoxyethanol, Disodium EDTA, Dipotassium Phosphate, Tocopherol, Phytosphingosine, Xanthan Gum, Ethylhexylglycerin.",
      ingredientNote,
      sensitiveNote:
        "Fragrance-free and NEA-accepted; neither label rules out an individual reaction. Compare the full formula against your known allergens.",
    },
  },
  {
    ...skinDefaults,
    id: "vanicream-daily-facial-moisturizer",
    category: "moisturizer",
    name: "Daily Facial Moisturizer — 3 fl oz",
    brand: "Vanicream",
    price: 18.99,
    priceUnit: "tube",
    imageUrl: "/assets/eczema-vanicream-daily.png",
    imageAlt: "Vanicream Daily Facial Moisturizer 3 fluid ounce tube",
    materialSummary:
      "Facial lotion with squalane, glycerin, hyaluronic acid and five ceramides.",
    components: [
      {
        part: "Emollient and humectants",
        material:
          "Squalane, glycerin, hyaluronic acid; feedstocks not specified",
        kind: "unknown",
      },
      {
        part: "Ceramides",
        material: "Ceramide EOP, NG, NP, AS and AP; sources not specified",
        kind: "unknown",
      },
      {
        part: "Formula thickener",
        material: "Polyacrylate crosspolymer-11",
        kind: "synthetic",
      },
    ],
    function: "Daily facial moisturization.",
    advantages: [
      "Lightweight facial lotion texture.",
      "Manufacturer excludes fragrance, botanical extracts and essential oils.",
    ],
    tradeoffs: [
      "Small 3 fl oz tube costs more per amount than the larger body creams.",
      "A lightweight lotion differs from a thick cream or ointment; choose texture with your care plan.",
    ],
    care: "Apply to the face as needed day or night according to the label. Check the tube for expiry and storage directions.",
    sustainabilityReasons: [
      "Manufacturer says the box can be recycled where accepted; the tube and cap are not currently recyclable.",
    ],
    sellers: [
      seller(
        18.99,
        "https://www.ulta.com/p/daily-facial-moisturizer-with-hyaluronic-acid-ceramides-pimprod2042403?sku=2619671",
      ),
    ],
    sources: [
      source(
        "Vanicream formula, directions and NEA status",
        "https://www.vanicream.com/product/vanicream-daily-facial-moisturizer",
      ),
      source(
        "Ulta 3 oz price and attributes",
        "https://www.ulta.com/p/daily-facial-moisturizer-with-hyaluronic-acid-ceramides-pimprod2042403?sku=2619671",
      ),
    ],
    stockNote:
      "One-time price for the 3 fl oz tube. This is not an SPF product.",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: true,
      lanolinFree: true,
      neaAccepted: true,
      texture: "Lightweight lotion",
      ingredientsComplete: true,
      ingredients:
        "Water, Squalane, Glycerin, Pentylene Glycol, Polyglyceryl-2 Stearate, Glyceryl Stearate, Stearyl Alcohol, Hyaluronic Acid, Ceramide EOP, Ceramide NG, Ceramide NP, Ceramide AS, Ceramide AP, Carnosine, Hydrogenated Lecithin, Phytosterols, Caprylyl Glycol, Polyacrylate Crosspolymer-11, 1,2-Hexanediol.",
      ingredientNote,
      sensitiveNote:
        "A facial lotion option, not a replacement for an eczema treatment or a thicker moisturizer recommended in your care plan. Personal tolerance varies.",
    },
  },
  {
    ...skinDefaults,
    id: "vanicream-gentle-facial-cleanser",
    category: "cleanser",
    name: "Gentle Facial Cleanser — 8 fl oz",
    brand: "Vanicream",
    price: 12.99,
    priceUnit: "bottle",
    imageUrl: "/assets/eczema-vanicream-cleanser.png",
    imageAlt:
      "Vanicream Gentle Facial Cleanser 8 fluid ounce white pump bottle",
    materialSummary:
      "Soap-free cleanser with glycerin, coco-glucoside and sodium cocoyl glycinate.",
    components: [
      {
        part: "Cleansing agents",
        material: "Coco-glucoside and sodium cocoyl glycinate",
        kind: "processed",
      },
      {
        part: "Formula thickener",
        material: "Acrylates copolymer",
        kind: "synthetic",
      },
      {
        part: "Other ingredients",
        material: "Mica and titanium dioxide",
        kind: "processed",
      },
    ],
    function: "Rinse-off daily facial cleansing.",
    advantages: [
      "Soap-free, fragrance-free formula.",
      "Manufacturer excludes botanical extracts and essential oils.",
    ],
    tradeoffs: [
      "Contains coco-glucoside; check if it is a known personal contact allergen.",
      "Includes mica and titanium dioxide despite the maker's dye-free claim; inspect the complete formula.",
    ],
    care: "Apply to wet skin, gently lather, rinse, and pat dry following the label. Do not scrub irritated skin.",
    sustainabilityReasons: [
      "Manufacturer directs users to discard the pump and check local acceptance for the rinsed 8 oz bottle.",
    ],
    sellers: [
      seller(
        12.99,
        "https://www.ulta.com/p/gentle-facial-cleanser-sensitive-skin-pimprod2042401?sku=2619669",
      ),
    ],
    sources: [
      source(
        "Vanicream formula and directions",
        "https://www.vanicream.com/product/vanicream-facial-cleanser",
      ),
      source(
        "Ulta 8 oz price and dye-free claim",
        "https://www.ulta.com/p/gentle-facial-cleanser-sensitive-skin-pimprod2042401?sku=2619669",
      ),
      source(
        "National Eczema Association product listing",
        "https://nationaleczema.org/eczema-products/vanicream-gentle-facial-cleanser/",
      ),
    ],
    stockNote:
      "One-time price for the 8 fl oz bottle; travel size has a different price.",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: true,
      lanolinFree: true,
      neaAccepted: true,
      texture: "Lathering liquid cleanser",
      ingredientsComplete: true,
      ingredients:
        "Water, Glycerin, Coco-Glucoside, Sodium Cocoyl Glycinate, Acrylates Copolymer, Caprylyl Glycol, Mica, Sodium Chloride, 1,2-Hexanediol, Titanium Dioxide, Sodium Hydroxide, Disodium EDTA.",
      ingredientNote:
        "Dye-free reflects the maker/retailer claim, not absence of mineral pigments. " +
        ingredientNote,
      sensitiveNote:
        "The formula includes coco-glucoside, mica and titanium dioxide. NEA acceptance is not an individual allergy guarantee.",
    },
  },
  {
    ...skinDefaults,
    id: "cerave-hydrating-facial-cleanser",
    category: "cleanser",
    name: "Hydrating Facial Cleanser — 8 fl oz",
    brand: "CeraVe",
    price: 15.99,
    priceUnit: "bottle",
    imageUrl: "/assets/eczema-cerave-cleanser.png",
    imageAlt:
      "CeraVe Hydrating Facial Cleanser 8 fluid ounce green and white pump bottle",
    materialSummary:
      "Creamy cleanser with glycerin, ceramides and sodium hyaluronate.",
    components: [
      {
        part: "Humectants",
        material: "Glycerin and sodium hyaluronate; sources not specified",
        kind: "unknown",
      },
      {
        part: "Formula ingredients",
        material: "PEG-40 stearate, carbomer and phenoxyethanol",
        kind: "synthetic",
      },
      {
        part: "Conditioning ingredients",
        material: "Ceramide NP/AP/EOP and cholesterol; sources not specified",
        kind: "unknown",
      },
    ],
    function: "Rinse-off daily facial cleansing.",
    advantages: [
      "Fragrance-free, non-foaming cream texture.",
      "Contains three ceramides and glycerin.",
    ],
    tradeoffs: [
      "Non-foaming texture differs from a foaming face wash.",
      "Contains phenoxyethanol; an acceptance seal does not override a known allergy.",
    ],
    care: "Massage gently onto wet skin with lukewarm water, then rinse and pat dry, following the package directions.",
    sustainabilityReasons: [
      "The retailer states that the 8 oz bottle uses 100% recycled plastic, excluding its pump. Local recyclability still varies.",
    ],
    sellers: [
      seller(
        15.99,
        "https://www.ulta.com/p/hydrating-facial-cleanser-xlsImpprod4190255?sku=2559841",
      ),
    ],
    sources: [
      source(
        "CeraVe US formula and directions",
        "https://www.cerave.com/skincare/cleansers/hydrating-facial-cleanser",
      ),
      source(
        "Ulta 8 oz price, NEA status and packaging",
        "https://www.ulta.com/p/hydrating-facial-cleanser-xlsImpprod4190255?sku=2559841",
      ),
    ],
    stockNote:
      "One-time price for the 8 fl oz bottle, not a refill or larger size.",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: true,
      lanolinFree: true,
      neaAccepted: true,
      texture: "Non-foaming cream cleanser",
      ingredientsComplete: true,
      ingredients:
        "Aqua / Water / Eau, Glycerin, Cetearyl Alcohol, PEG-40 Stearate, Stearyl Alcohol, Potassium Phosphate, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Glyceryl Stearate, Behentrimonium Methosulfate, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phenoxyethanol, Disodium EDTA, Dipotassium Phosphate, Tocopherol, Phytosphingosine, Xanthan Gum, Cetyl Alcohol, Polysorbate 20, Ethylhexylglycerin.",
      ingredientNote,
      sensitiveNote:
        "Listed ingredients omit fragrance, essential oils and lanolin. This is a label-based comparison, not a prediction of how your skin will react.",
    },
  },
  {
    ...skinDefaults,
    id: "cetaphil-gentle-skin-cleanser",
    category: "cleanser",
    name: "Gentle Skin Cleanser — 8 fl oz",
    brand: "Cetaphil",
    price: 11.99,
    priceUnit: "bottle",
    imageUrl: "/assets/eczema-cetaphil-cleanser.png",
    imageAlt:
      "Cetaphil Gentle Skin Cleanser 8 fluid ounce white bottle with a light blue pump",
    materialSummary: "Cream cleanser with glycerin, niacinamide and panthenol.",
    components: [
      {
        part: "Humectant and conditioning ingredients",
        material:
          "Glycerin, panthenol and niacinamide; feedstocks not specified",
        kind: "unknown",
      },
      {
        part: "Cleansing agent",
        material: "Sodium cocoyl isethionate",
        kind: "processed",
      },
      {
        part: "Preservative",
        material: "Sodium benzoate; manufacturing source not specified",
        kind: "unknown",
      },
    ],
    function:
      "Daily face and body cleansing, with or without rinsing according to the label.",
    advantages: [
      "Fragrance-free, non-foaming cream formula.",
      "Manufacturer publishes a complete ten-ingredient formula.",
    ],
    tradeoffs: [
      "Contains niacinamide and sodium benzoate; review any known personal sensitivities.",
      "NEA acceptance was not verified for this exact product; do not infer it from the brand.",
    ],
    care: "For rinsing: gently massage onto skin and rinse. Follow the manufacturer's separate instructions for use without water.",
    sustainabilityReasons: [
      "No packaging lifecycle advantage is established here. Check the container label and local disposal rules.",
    ],
    sellers: [
      seller(
        11.99,
        "https://www.ulta.com/p/gentle-skin-cleanser-face-wash-sensitive-skin-pimprod2028662?sku=2586968",
      ),
    ],
    sources: [
      source(
        "Cetaphil US full formula and directions",
        "https://www.cetaphil.com/us/products/product-categories/all-cleansers/cetaphil-gentle-skin-cleanser/302990110227.html",
      ),
      source(
        "Ulta 8 oz price and formula",
        "https://www.ulta.com/p/gentle-skin-cleanser-face-wash-sensitive-skin-pimprod2028662?sku=2586968",
      ),
    ],
    stockNote:
      "One-time price for the 8 fl oz bottle. The 3.4 oz and 16 oz options have different prices.",
    eczema: {
      fragranceFree: true,
      dyeFree: true,
      essentialOilFree: true,
      lanolinFree: true,
      neaAccepted: "unknown",
      texture: "Non-foaming cream cleanser",
      ingredientsComplete: true,
      ingredients:
        "Water, Glycerin, Cetearyl Alcohol, Panthenol, Niacinamide, Pantolactone, Xanthan Gum, Sodium Cocoyl Isethionate, Sodium Benzoate, Citric Acid.",
      ingredientNote,
      sensitiveNote:
        "Fragrance-free does not guarantee tolerance. Niacinamide and other ingredients remain part of the formula; check your own avoidance list.",
    },
  },
];
