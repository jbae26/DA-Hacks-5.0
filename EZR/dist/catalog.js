import { teeProducts } from "./clothing-tees.js";
import { pantsProducts } from "./clothing-pants.js";
import { underwearProducts } from "./clothing-underwear.js";
export const products = [
  ...teeProducts,
  ...pantsProducts,
  ...underwearProducts,
];
export const guidanceSources = {
  aad: "https://www.aad.org/public/diseases/eczema/types/atopic-dermatitis/atopic-dermatitis-coping",
  clothing: "https://www.eczema.org.uk/support/clothing-and-eczema",
  care: "https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule",
};
const comparison = [
  "Check the main fabric, sewing thread, labels and any elastic. A fiber percentage does not describe the whole garment.",
  "Softness, seams, tags and fit vary between garments.",
  "Follow the garment care label and check condition before replacing.",
  "Individual comfort and tolerance cannot be inferred from a garment name or natural material label.",
];
const materials =
  "Fabric, trims, dyes and finishes are unknown unless supplied from your garment label.";
export const categories = {
  tshirt: {
    name: "T-shirt",
    original: "Your current T-shirt",
    function: "Everyday upper-body clothing",
    materials,
    price: 15,
    life: null,
    comparison,
  },
  pants: {
    name: "Pants",
    original: "Your current pants",
    function:
      "Everyday lower-body clothing; compare cut, warmth and activity needs",
    materials,
    price: 30,
    life: null,
    comparison,
  },
  underwear: {
    name: "Underwear",
    original: "Your current underwear",
    function:
      "Next-to-skin briefs or boxers; compare coverage, support and fit",
    materials,
    price: 12,
    life: null,
    comparison,
  },
};
export const materialGroups = {
  fabrics: {
    title: "Start with fabric and fit",
    intro:
      "AAD advises loose cotton clothing for eczema. Check the finished fabric as well as fit, tags and seams; a natural fiber does not guarantee individual comfort.",
    items: [
      "Read the full fiber blend",
      "Look beyond the main fabric",
      "Check rubbing and fit",
      "Comfort is individual",
    ],
    source: guidanceSources.aad,
    sourceLabel: "AAD clothing guidance",
  },
  construction: {
    title: "The details that touch your skin",
    intro:
      "Compare seam placement, sewn labels and waistband construction. A covered elastic band still contains elastic; a cotton main fabric does not establish that an entire garment is latex-free. We show a positive criterion only when the manufacturer explicitly supports it.",
    items: [
      "Seams and stitching",
      "Printed or sewn-in labels",
      "Covered vs exposed elastic",
      "Latex claims need evidence",
    ],
    source: guidanceSources.clothing,
    sourceLabel: "Eczema UK clothing guidance",
  },
  care: {
    title: "Choose care you can keep up with",
    intro:
      "Read the garment’s washing and drying instructions before buying. Wash new clothing before first wear. A printed label, certification or “hypoallergenic” claim is not a promise that the item will suit everyone.",
    items: [
      "Follow garment care labels",
      "Wash before first wear",
      "Check size and return policy",
      "Keep unknown finishes visible",
    ],
    source: guidanceSources.aad,
    sourceLabel: "AAD clothing and care guidance",
  },
};
export const classLabels = {
  "fully-natural": "Fully natural",
  "partially-natural": "Partially natural",
  "contains-synthetics": "Includes synthetic parts",
  "processed-material": "Processed materials",
};
