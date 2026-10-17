import { gapFamilyProducts } from "./retail-gap-family.js?v=retail3";
import { brAnthroProducts } from "./retail-br-anthro.js?v=retail3";
import { jcrewLuluProducts } from "./retail-jcrew-lulu.js?v=retail3";

// Manually reviewed US retailer listings. Price snapshots are not live inventory.
export const MATERIAL_GROUPS = [
  {
    label: "Natural fibers",
    materials: [
      { id: "cotton", label: "Cotton" },
      { id: "linen", label: "Linen" },
      { id: "wool", label: "Wool" },
      { id: "silk", label: "Silk" },
      { id: "hemp", label: "Hemp" },
    ],
  },
  {
    label: "Processed fibers",
    materials: [
      { id: "lyocell", label: "Lyocell" },
      { id: "viscose", label: "Viscose" },
      { id: "modal", label: "Modal" },
    ],
  },
  {
    label: "Synthetic fibers",
    materials: [
      { id: "polyester", label: "Polyester" },
      { id: "nylon", label: "Nylon" },
      { id: "elastane", label: "Elastane" },
      { id: "acrylic", label: "Acrylic" },
    ],
  },
];
export const MATERIALS = MATERIAL_GROUPS.flatMap((group) => group.materials);

export const CATEGORY_LABELS = {
  top: "Tops",
  pants: "Pants",
  underwear: "Underwear",
};

const placeholderImages = {
  top: "assets/retail/top.svg",
  pants: "assets/retail/pants.svg",
  underwear: "assets/retail/underwear.svg",
};
export const products = [
  ...gapFamilyProducts,
  ...brAnthroProducts,
  ...jcrewLuluProducts,
].map((product) => ({
  ...product,
  image_url: placeholderImages[product.category],
}));
