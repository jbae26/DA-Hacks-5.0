// Product observations checked 2026-10-16. USD prices are snapshots, not live offers.
// Scores are editorial comparison aids; none establishes a life-cycle or health benefit.
const checkedAt = "2026-10-16";
const offer = (name, price, url) => ({
  name,
  price,
  unitCount: 1,
  url,
  shipping: "Calculated at checkout",
  checkedAt,
});
const unknownLife = {
  label: "No verified service-life estimate published",
  months: null,
  sourceUrl: null,
};

export const productsB = [
  {
    id: "bottle-klean-reflect",
    category: "bottle",
    name: "Reflect 27 oz · Mirrored",
    brand: "Klean Kanteen",
    price: 32.95,
    unitCount: 1,
    priceUnit: "bottle",
    imageUrl: "/assets/product-klean.jpg",
    imageAlt:
      "Mirrored stainless steel Klean Kanteen Reflect bottle with bamboo-topped cap",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Steel body, bamboo cap top, silicone seal. Plastic-free marketing does not mean synthetic-free.",
    components: [
      {
        part: "Body and cap interior",
        material: "18/8 stainless steel",
        kind: "processed",
      },
      { part: "Cap top", material: "Bamboo", kind: "natural" },
      { part: "Seal", material: "Food-grade silicone", kind: "synthetic" },
    ],
    function:
      "Carry 27 fl oz of drinking water in a reusable, single-wall bottle.",
    advantages: [
      "Leakproof screw cap",
      "Steel interior; compatible replacement Classic caps",
    ],
    tradeoffs: [
      "Not insulated or suitable for hot drinks",
      "Silicone seal remains synthetic",
    ],
    care: "Dishwash the bottle; handwash the bamboo cap. Do not fill with hot liquids.",
    lifespan: { ...unknownLife },
    properties: {
      waterproof: true,
      heatResistant: false,
      flexible: false,
      lightweight: "unknown",
      durable: true,
    },
    scores: { function: 92, sustainability: 84 },
    sustainabilityReasons: [
      "Manufacturer specifies 90% post-consumer recycled steel.",
      "Compatible caps allow the closure to be replaced separately.",
    ],
    sellers: [
      offer(
        "Klean Kanteen",
        32.95,
        "https://www.kleankanteen.com/products/plastic-free-water-bottle-27oz",
      ),
    ],
    sources: [
      {
        title: "Klean Kanteen: Reflect materials, specifications and care",
        url: "https://www.kleankanteen.com/products/plastic-free-water-bottle-27oz",
      },
    ],
    country: "US",
  },
  {
    id: "bottle-ello-syndicate",
    category: "bottle",
    name: "Syndicate 20 oz · Gray",
    brand: "Ello",
    price: 16.99,
    unitCount: 1,
    priceUnit: "bottle",
    imageUrl: "/assets/product-ello.png",
    imageAlt: "Gray silicone-sleeved Ello Syndicate glass bottle with flip lid",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Glass bottle with a silicone sleeve and carry loop. Full lid composition is not specified.",
    components: [
      { part: "Bottle", material: "Glass", kind: "processed" },
      {
        part: "Protective sleeve and carry loop",
        material: "Silicone",
        kind: "synthetic",
      },
      {
        part: "Flip lid assembly",
        material: "Full component composition not specified",
        kind: "unknown",
      },
    ],
    function: "Carry 20 fl oz of cold, non-carbonated drinks.",
    advantages: [
      "Drink directly from a glass rim",
      "Top-rack dishwasher cleaning",
    ],
    tradeoffs: [
      "Glass can break on impact",
      "Not for hot drinks, freezing or microwaving",
    ],
    care: "Top-rack dishwasher safe with sleeve attached. Store lid off. Discard cracked glass.",
    lifespan: { ...unknownLife },
    properties: {
      waterproof: "unknown",
      heatResistant: false,
      flexible: false,
      lightweight: "unknown",
      durable: "unknown",
    },
    scores: { function: 87, sustainability: 63 },
    sustainabilityReasons: [
      "Designed for repeated refilling.",
      "The glass body can be washed without removing its sleeve.",
    ],
    sellers: [
      offer(
        "Office Depot",
        16.99,
        "https://www.officedepot.com/a/products/9848450/Ello-Syndicate-Glass-Water-Bottle-20/",
      ),
      offer(
        "Ello",
        18.99,
        "https://www.elloproducts.com/products/syndicate-20oz-glass-water-bottle?variant=36378077397144",
      ),
    ],
    sources: [
      {
        title: "Ello: Syndicate product and care",
        url: "https://www.elloproducts.com/products/syndicate-20oz-glass-water-bottle",
      },
      {
        title: "Office Depot: same Gray 20 oz bottle, UPC 852090003481",
        url: "https://www.officedepot.com/a/products/9848450/Ello-Syndicate-Glass-Water-Bottle-20/",
      },
    ],
    country: "US",
  },
  {
    id: "bottle-blackblum-glass",
    category: "bottle",
    name: "Glass Water Bottle 20 oz · Olive",
    brand: "Black+Blum",
    price: 24.95,
    unitCount: 1,
    priceUnit: "bottle",
    imageUrl: "/assets/product-blackblum.jpg",
    imageAlt:
      "Black+Blum glass bottle with olive silicone sleeve and steel cap",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Borosilicate glass and steel, with silicone, nylon and polypropylene components.",
    components: [
      { part: "Bottle", material: "Borosilicate glass", kind: "processed" },
      { part: "Lid", material: "Stainless steel", kind: "processed" },
      { part: "Sleeve and seal", material: "Silicone", kind: "synthetic" },
      { part: "Carry cord", material: "Nylon", kind: "synthetic" },
      {
        part: "Additional component; placement unspecified",
        material: "Polypropylene",
        kind: "synthetic",
      },
    ],
    function: "Carry 20 fl oz of water in a reusable bottle.",
    advantages: [
      "Leakproof screw closure",
      "Removable sleeve and seal for cleaning",
    ],
    tradeoffs: [
      "Glass can break; overtightening can damage its neck",
      "Not suitable for carbonated drinks",
    ],
    care: "Handwash all parts. Tighten only until snug. Hot drinks are permitted, but the sleeve gets hot.",
    lifespan: { ...unknownLife },
    properties: {
      waterproof: true,
      heatResistant: true,
      flexible: false,
      lightweight: "unknown",
      durable: "unknown",
    },
    scores: { function: 90, sustainability: 66 },
    sustainabilityReasons: [
      "Reusable glass vessel.",
      "Sleeve and seal can be removed for cleaning.",
    ],
    sellers: [
      offer(
        "Black+Blum US",
        24.95,
        "https://blackblum.com/products/glass-water-bottle?variant=39660885737571",
      ),
    ],
    sources: [
      {
        title: "Black+Blum US: Glass Water Bottle specifications and care",
        url: "https://blackblum.com/products/glass-water-bottle",
      },
    ],
    country: "US",
  },
  {
    id: "container-ikea-bamboo",
    category: "container",
    name: "365+ Glass & Bamboo 34 oz",
    brand: "IKEA",
    price: 9.99,
    unitCount: 1,
    priceUnit: "container",
    imageUrl: "/assets/product-ikea.jpg",
    imageAlt: "Rectangular IKEA glass food container with bamboo lid",
    naturalClass: "contains-synthetics",
    materialSummary:
      "Heat-resistant glass and bamboo, with acrylic lacquer and a silicone seal.",
    components: [
      { part: "Bowl", material: "Heat-resistant glass", kind: "processed" },
      { part: "Lid", material: "Bamboo", kind: "natural" },
      {
        part: "Lid finish",
        material: "Clear acrylic lacquer",
        kind: "synthetic",
      },
      { part: "Seal", material: "Silicone rubber", kind: "synthetic" },
    ],
    function: "Store 34 fl oz of food and reheat it in the glass bowl.",
    advantages: [
      "Glass bowl works in oven and microwave",
      "Transparent body makes contents visible",
    ],
    tradeoffs: [
      "Lid needs handwashing and removal before heating",
      "Glass is breakable; bamboo lid is not freezer-safe",
    ],
    care: "Dishwash the bowl; handwash the lid. Remove the lid for oven or microwave use and freezing.",
    lifespan: { ...unknownLife },
    properties: {
      waterproof: "unknown",
      heatResistant: true,
      flexible: false,
      lightweight: false,
      durable: "unknown",
    },
    scores: { function: 86, sustainability: 72 },
    sustainabilityReasons: [
      "Bowl and lid are separate IKEA 365+ components.",
      "One glass bowl can store, heat and serve food.",
    ],
    sellers: [
      offer(
        "IKEA US",
        9.99,
        "https://www.ikea.com/us/en/p/ikea-365-food-container-with-lid-rectangular-glass-bamboo-s79567009/",
      ),
    ],
    sources: [
      {
        title: "IKEA US: 34 oz glass/bamboo container, materials and care",
        url: "https://www.ikea.com/us/en/p/ikea-365-food-container-with-lid-rectangular-glass-bamboo-s79567009/",
      },
    ],
    country: "US",
  },
  {
    id: "container-ukonserve-rectangle",
    category: "container",
    name: "Rectangle 45 oz · Clear Lid",
    brand: "U-Konserve",
    price: 25.99,
    unitCount: 1,
    priceUnit: "container",
    imageUrl: "/assets/product-ukonserve.jpg",
    imageAlt: "U-Konserve 45 oz steel food container with clear silicone lid",
    naturalClass: "contains-synthetics",
    materialSummary:
      "304 stainless steel base with a platinum-grade silicone lid.",
    components: [
      {
        part: "Container",
        material: "304 (18/8) stainless steel",
        kind: "processed",
      },
      { part: "Lid", material: "Platinum-grade silicone", kind: "synthetic" },
    ],
    function: "Pack lunches or store 45 fl oz of leftovers.",
    advantages: [
      "Dishwasher and freezer safe",
      "Steel base resists breakage associated with glass",
    ],
    tradeoffs: [
      "Leak-resistant does not guarantee leakproof",
      "No microwave use; keep lid out of oven",
    ],
    care: "Dishwasher safe. Base only: oven up to 300°F. Never microwave; remove lid before oven use.",
    lifespan: { ...unknownLife },
    properties: {
      waterproof: "unknown",
      heatResistant: true,
      flexible: false,
      lightweight: "unknown",
      durable: true,
    },
    scores: { function: 91, sustainability: 76 },
    sustainabilityReasons: [
      "Reusable steel base and separate lid.",
      "Containers stack and nest for storage.",
    ],
    sellers: [
      offer(
        "U-Konserve",
        25.99,
        "https://ukonserve.com/products/rectangle-container?variant=44180769833246",
      ),
    ],
    sources: [
      {
        title: "U-Konserve: 45 oz Clear variant, materials and care",
        url: "https://ukonserve.com/collections/best-sellers/products/rectangle-container?variant=44180769833246",
      },
    ],
    country: "US",
  },
  {
    id: "container-ecolunchbox-solo",
    category: "container",
    name: "Solo Rectangle 29 oz · Blank",
    brand: "ECOlunchbox",
    price: 30,
    unitCount: 1,
    priceUnit: "container",
    imageUrl: "/assets/product-ecolunchbox.jpg",
    imageAlt:
      "ECOlunchbox Solo Rectangle stainless steel lunchbox with its paper product band",
    naturalClass: "processed-material",
    materialSummary:
      "All stainless steel, without a gasket. Steel is processed metal, not a natural fiber or wood.",
    components: [
      {
        part: "Container and lid",
        material: "201 stainless steel",
        kind: "processed",
      },
    ],
    function:
      "Carry 29 fl oz of sandwiches, snacks and other non-liquid foods.",
    advantages: [
      "No plastic or silicone parts in the container",
      "Both parts are dishwasher safe",
    ],
    tradeoffs: [
      "Not leakproof: avoid soups and saucy meals",
      "Cannot be used in a microwave",
    ],
    care: "Dishwasher safe. Manufacturer permits medium-heat oven reheating; handle hot steel carefully. Never microwave.",
    lifespan: { ...unknownLife },
    properties: {
      waterproof: false,
      heatResistant: true,
      flexible: false,
      lightweight: "unknown",
      durable: true,
    },
    scores: { function: 78, sustainability: 81 },
    sustainabilityReasons: [
      "Simple single-material container construction.",
      "Reusable steel base and lid are washable.",
    ],
    sellers: [
      offer(
        "ECOlunchbox",
        30,
        "https://ecolunchboxes.com/products/ecolunchbox-solo-rectangle?variant=39625552167025",
      ),
    ],
    sources: [
      {
        title: "ECOlunchbox: Solo Rectangle materials, capacity and care",
        url: "https://ecolunchboxes.com/collections/stainless-steel-bentos/products/ecolunchbox-solo-rectangle",
      },
    ],
    country: "US",
  },
];
