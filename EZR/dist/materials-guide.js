// Material origins describe fibers, not a garment's medical suitability or
// overall environmental impact. Sources reviewed on 2026-10-16.
const sources = {
  aad: {
    title: "AAD: clothing and atopic dermatitis",
    url: "https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis/atopic-dermatitis-coping",
  },
  eczema: {
    title: "Eczema UK: clothing and eczema",
    url: "https://www.eczema.org.uk/support/clothing-and-eczema",
  },
  bamboo: {
    title: "FTC: understanding bamboo fabrics",
    url: "https://consumer.ftc.gov/articles/bamboo-fabrics",
  },
  labels: {
    title: "FTC: textile fiber labels",
    url: "https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts",
  },
  care: {
    title: "FTC: garment care labels",
    url: "https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule",
  },
  tencel: {
    title: "TENCEL: from wood pulp to lyocell",
    url: "https://www.tencel.com/us/lets-start-at-the-source-from-forest-to-fiber",
  },
  gots: {
    title: "GOTS: organic fibers and processing requirements",
    url: "https://global-standards.org/our-standards/gots/key-features",
  },
  recycling: {
    title: "EPA: reuse and recycling of clothing",
    url: "https://www.epa.gov/recycle/how-do-i-recycle-common-recyclables",
  },
  microfibers: {
    title: "EPA: microfiber pollution from clothing",
    url: "https://www.epa.gov/trash-free-waters/what-you-should-know-about-microfiber-pollution",
  },
};

export const materialGroupLabels = {
  natural: "Natural fiber",
  processed: "Processed plant fiber",
  synthetic: "Synthetic fiber",
};

export const materialProfiles = [
  {
    id: "cotton",
    name: "Cotton",
    group: "natural",
    origin:
      "A plant-derived natural fiber. Organic certification concerns its sourcing and processing; it does not make cotton a different fiber.",
    skinConsideration:
      "AAD recommends loose, 100% cotton clothing for eczema. Check seams, tags and fit too; a fiber name cannot predict your individual response.",
    care: "Wash new clothing before wear, with fragrance-free, dye-free detergent. Use the garment's care label to choose washing and drying settings.",
    tradeoff:
      "GOTS covers organic fiber content and restricts processing chemicals. It does not mean chemical-free or guarantee that a garment will suit your skin.",
    endOfLife:
      "Pass on wearable clothing; ask local textile programs about worn-out items. A natural fiber label alone is not a disposal instruction.",
    sources: [sources.aad, sources.gots, sources.care, sources.recycling],
  },
  {
    id: "bamboo-viscose",
    name: "Bamboo-derived viscose",
    group: "processed",
    origin:
      "Bamboo cellulose is chemically processed into rayon, also called viscose. This is a manufactured fiber, distinct from mechanically extracted bamboo fiber.",
    skinConsideration:
      "A soft finished fabric may feel comfortable, but check the blend and construction. Bamboo origin does not establish antibacterial properties or eczema suitability.",
    care: "Follow the finished garment's washing and drying instructions; bamboo branding does not tell you how to care for a blend.",
    tradeoff:
      "A plant starting material does not establish a lower environmental impact. Processing matters, and FTC cautions against unsupported bamboo fabric claims.",
    endOfLife:
      "Reuse wearable garments and check local textile collection rules. Do not infer compostability from the word bamboo.",
    sources: [sources.bamboo, sources.eczema, sources.care, sources.recycling],
  },
  {
    id: "lyocell",
    name: "Lyocell",
    group: "processed",
    origin:
      "A manufactured cellulose fiber made from wood pulp. TENCEL Lyocell is a branded version; read the label for the complete blend.",
    skinConsideration:
      "Consider the finished fabric's softness, seams and fit. Wood origin does not establish that a garment will suit your eczema.",
    care: "Use the garment care label for wash temperature, cycle and drying. Do not assume all lyocell blends have identical care needs.",
    tradeoff:
      "Lenzing reports solvent recovery in its TENCEL Lyocell process. That manufacturer-specific claim does not establish the impact of every lyocell garment.",
    endOfLife:
      "Reuse wearable items and check textile collection options. Fiber-level disposal claims may not apply to a finished garment with blends, dyes or trims.",
    sources: [
      sources.tencel,
      sources.labels,
      sources.eczema,
      sources.care,
      sources.recycling,
    ],
  },
  {
    id: "silk",
    name: "Silk",
    group: "natural",
    origin:
      "An animal-derived natural fiber, used on its own or in blends. Read the fiber label for the actual silk percentage.",
    skinConsideration:
      "Silk can offer a smooth feel against skin. Ordinary silk clothing is not equivalent to a therapeutic garment or an eczema treatment.",
    care: "Check washing or dry-cleaning instructions before buying. Choose a garment whose care requirements fit your everyday routine.",
    tradeoff:
      "Creams may mark ordinary silk, and frequent washing can be less practical than with cotton. Comfort and maintenance both matter.",
    endOfLife:
      "Pass on wearable pieces and check whether local collectors accept damaged textiles. Do not assume that a natural fiber label makes the whole garment compostable.",
    sources: [
      sources.eczema,
      sources.gots,
      sources.labels,
      sources.care,
      sources.recycling,
    ],
  },
  {
    id: "polyester",
    name: "Polyester",
    group: "synthetic",
    origin:
      "A manufactured, plastic-based fiber used on its own and in blends. The fiber label helps distinguish polyester from cotton-rich mixtures.",
    skinConsideration:
      "Some people with eczema find polyester clothing makes them hot or uncomfortable. Judge the finished garment's texture, fit and warmth, not the fiber name alone.",
    care: "Follow the care label. Where compatible with those instructions, EPA suggests shorter, colder washing cycles to reduce microfiber shedding.",
    tradeoff:
      "Synthetic clothing can release plastic microfibers during washing. Shedding varies with the garment's construction, age, material and finish.",
    endOfLife:
      "Keep wearable items in use or pass them on. Ask local programs about textile recycling; plastic fiber content does not mean curbside acceptance.",
    sources: [
      sources.eczema,
      sources.labels,
      sources.care,
      sources.microfibers,
      sources.recycling,
    ],
  },
  {
    id: "wool",
    name: "Wool",
    group: "natural",
    origin:
      "An animal-derived natural fiber, commonly from sheep fleece. Wool labels can also identify specialty animal fibers or recycled wool.",
    skinConsideration:
      "AAD advises avoiding wool directly against eczema-prone skin. Natural origin does not prevent a garment from feeling scratchy or too warm.",
    care: "Check the care label before washing or drying; the finished garment's instructions take priority over assumptions about wool.",
    tradeoff:
      "Wool fibers and blends vary, so a blanket good-or-bad rating hides differences. Consider how the garment feels and whether you can maintain it.",
    endOfLife:
      "Pass on wearable clothing and ask collectors about worn textiles. Check the complete item and local rules before considering any disposal claim.",
    sources: [
      sources.aad,
      sources.eczema,
      sources.labels,
      sources.care,
      sources.recycling,
    ],
  },
];
