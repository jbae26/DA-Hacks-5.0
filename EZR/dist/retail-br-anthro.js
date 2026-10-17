/**
 * Minimal retailer facts checked against visible product pages on 2026-10-17.
 * The existing SVGs are generic garment placeholders, not retailer photographs.
 * Unknown trims stay unknown so strict material exclusions remain conservative.
 */
export const brAnthroProducts = [
  {
    id: "banana-republic-utility-pant",
    name: "Low-Rise Relaxed Utility Pant — Whiskey Brown",
    category: "pants",
    keywords: [
      "women",
      "utility",
      "low rise",
      "relaxed fit",
      "cotton",
      "sateen",
      "pockets",
      "zip fly",
      "regular",
    ],
    colors: ["Whiskey Brown"],
    sizes: ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18"],
    material_composition: [{ material: "cotton", percentage: 100 }],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 140,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Banana Republic",
    product_url:
      "https://bananarepublic.gap.com/browse/product.do?pid=1180277032",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Unlined cotton sateen pants with a low rise, belt loops, a button-and-zip closure, and front and back pockets.",
    source_urls: [
      "https://bananarepublic.gap.com/browse/product.do?pid=1180277032",
    ],
    composition_note: "The retailer lists the fabric as 100% cotton.",
    trim_note:
      "Thread, zipper tape, pocket trim and other component fibers are not specified.",
    purchase_note:
      "Price checked for Whiskey Brown. Sizes shown are listed Regular-fit options; stock depends on size and inseam.",
  },
  {
    id: "anthropologie-cotton-pull-on-pants",
    name: "By Anthropologie 100% Cotton Pull-On Pants — White Floral",
    category: "pants",
    keywords: [
      "women",
      "wide leg",
      "pull on",
      "cotton",
      "floral",
      "tall",
      "ankle",
      "pockets",
    ],
    colors: ["White Floral"],
    sizes: ["XL Tall"],
    material_composition: [{ material: "cotton", percentage: 100 }],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 59.95,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Anthropologie",
    product_url:
      "https://www.anthropologie.com/shop/by-anthropologie-100-cotton-pull-on-pants2?color=522&type=TALL&size=XL+Tall&quantity=1",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Floral cotton pants with wide legs, a pull-on waist and front slant pockets.",
    source_urls: [
      "https://www.anthropologie.com/shop/by-anthropologie-100-cotton-pull-on-pants2?color=522&type=TALL&size=XL+Tall&quantity=1",
    ],
    composition_note:
      "The retailer lists 100% cotton; this percentage does not describe separately unspecified trims.",
    trim_note:
      "Waistband elastic, thread and other component fibers are not specified.",
    purchase_note:
      "Sale price checked for White Floral, XL Tall. Only XL Tall remained available at the check; other listed sizes and Standard fit were sold out.",
  },

  {
    id: "banana-republic-tencel-cotton-wide-leg-pant",
    name: "The Everyday Wide-Leg Pant in Tencel™-Cotton — Fresh Olive Green",
    category: "pants",
    keywords: [
      "women",
      "wide leg",
      "mid rise",
      "full length",
      "tencel",
      "organic cotton",
      "pockets",
      "zip fly",
      "regular",
    ],
    colors: ["Fresh Olive Green"],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    material_composition: [
      {
        material: "lyocell",
        percentage: 60,
      },
      {
        material: "cotton",
        percentage: 40,
      },
    ],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 130,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Banana Republic",
    product_url:
      "https://bananarepublic.gap.com/browse/product.do?pid=713473122",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Mid-rise, full-length pants with wide legs, a zip fly, rear waist elastic and front and back pockets.",
    source_urls: [
      "https://bananarepublic.gap.com/browse/product.do?pid=713473122",
    ],
    trim_note:
      "Waist elastic, thread, zipper tape and other textile trims are not separately specified.",
    purchase_note:
      "Price applies to Fresh Olive Green. Sizes are listed Regular-fit options; individual inventory was not checked.",
  },
  {
    id: "banana-republic-italian-wool-wide-leg-pant",
    name: "Mid-Rise Wide-Leg Italian Lightweight Wool Pant — Heather Medium Gray",
    category: "pants",
    keywords: [
      "women",
      "wide leg",
      "mid rise",
      "full length",
      "wool",
      "stretch",
      "zip fly",
      "regular",
    ],
    colors: ["Heather Medium Gray"],
    sizes: ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18"],
    material_composition: [
      {
        material: "wool",
        percentage: 98,
      },
      {
        material: "elastane",
        percentage: 2,
      },
    ],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 198,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Banana Republic",
    product_url:
      "https://bananarepublic.gap.com/browse/product.do?pid=1189257022",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Unlined wool-blend trousers with wide legs, an elasticated back waist and a hook-and-bar zip closure.",
    source_urls: [
      "https://bananarepublic.gap.com/browse/product.do?pid=1189257022",
    ],
    trim_note:
      "Waist elastic, thread, zipper tape and other textile trims are not separately specified.",
    purchase_note:
      "Regular-fit size options are listed; stock depends on size and inseam. Retailer care instructions specify dry cleaning.",
  },
  {
    id: "banana-republic-corduroy-wide-leg-pant",
    name: "The Everyday Wide-Leg Pant in Corduroy — Citrine Forest Green",
    category: "pants",
    keywords: [
      "women",
      "wide leg",
      "mid rise",
      "corduroy",
      "stretch",
      "pockets",
      "zip fly",
      "regular",
    ],
    colors: ["Citrine Forest Green"],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    material_composition: [
      {
        material: "cotton",
        percentage: 99,
      },
      {
        material: "elastane",
        percentage: 1,
      },
    ],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 148,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Banana Republic",
    product_url:
      "https://bananarepublic.gap.com/browse/product.do?pid=1180265022",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Wide-wale corduroy pants with a mid rise, back waist elastic, belt loops and front and back pockets.",
    source_urls: [
      "https://bananarepublic.gap.com/browse/product.do?pid=1180265022",
    ],
    trim_note:
      "Waist elastic, thread, zipper tape and other textile trims are not separately specified.",
    purchase_note:
      "Price applies to Citrine Forest Green. Sizes are listed Regular-fit options; individual inventory was not checked.",
  },
  {
    id: "banana-republic-linen-ankle-pant",
    name: "The Pull-On Wide-Leg Ankle Pant in Linen — Cream Multi Stripe",
    category: "pants",
    keywords: [
      "women",
      "wide leg",
      "high rise",
      "ankle",
      "linen",
      "stripe",
      "pull on",
      "pockets",
      "regular",
    ],
    colors: ["Cream Multi Stripe"],
    sizes: ["XXS", "XS"],
    material_composition: [
      {
        material: "linen",
        percentage: 100,
      },
    ],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 54.99,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Banana Republic",
    product_url:
      "https://bananarepublic.gap.com/browse/product.do?pid=875436002",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Striped linen pants with a high rise, ankle-length wide legs, an elastic waist and front and back pockets.",
    source_urls: [
      "https://bananarepublic.gap.com/browse/product.do?pid=875436002",
    ],
    trim_note:
      "Waistband elastic, thread and other textile trims are not separately specified.",
    purchase_note:
      "Displayed sale price was $54.99, down from $130. Regular XXS and XS were selectable; S through XXL were disabled. No additional checkout discount is included.",
  },
  {
    id: "anthropologie-cotton-modal-culotte",
    name: "By Anthropologie Cotton Modal Blend Utility Culotte Pants — Olive",
    category: "pants",
    keywords: [
      "women",
      "culotte",
      "wide leg",
      "high rise",
      "cotton",
      "modal",
      "stretch",
      "drawstring",
      "pockets",
      "standard",
    ],
    colors: ["Olive"],
    sizes: ["XXS", "XS", "S", "M", "L", "XL"],
    material_composition: [
      {
        material: "cotton",
        percentage: 78,
      },
      {
        material: "modal",
        percentage: 20,
      },
      {
        material: "elastane",
        percentage: 2,
      },
    ],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 148,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Anthropologie",
    product_url:
      "https://www.anthropologie.com/shop/by-anthropologie-cotton-modal-blend-utility-culotte-pants?color=230&type=STANDARD",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Culotte-length pants with a drawstring waist, front seams and slant pockets.",
    source_urls: [
      "https://www.anthropologie.com/shop/by-anthropologie-cotton-modal-blend-utility-culotte-pants?color=230&type=STANDARD",
    ],
    trim_note:
      "Drawstring, waistband, thread and other textile trims are not separately specified.",
    purchase_note:
      "Price applies to Olive in Standard fit, before any checkout promotions. Size M was selected with Add to Basket enabled; other sizes are listed options.",
  },
  {
    id: "anthropologie-maeve-colette-magic-pant",
    name: "Maeve Colette Magic Fabric Full Length Pants — Emerald Green",
    category: "pants",
    keywords: [
      "women",
      "maeve",
      "colette",
      "wide leg",
      "high rise",
      "full length",
      "linen blend",
      "stretch",
      "patch pockets",
      "zip",
      "standard",
    ],
    colors: ["Emerald Green"],
    sizes: [
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
    ],
    material_composition: [
      {
        material: "viscose",
        percentage: 47,
      },
      {
        material: "linen",
        percentage: 35,
      },
      {
        material: "cotton",
        percentage: 15,
      },
      {
        material: "elastane",
        percentage: 3,
      },
    ],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 130,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Anthropologie",
    product_url:
      "https://www.anthropologie.com/shop/maeve-colette-magic-fabric-full-length-pants?color=359&type=STANDARD",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Full-length wide-leg pants with a high rise, front zip and front and back patch pockets.",
    source_urls: [
      "https://www.anthropologie.com/shop/maeve-colette-magic-fabric-full-length-pants?color=359&type=STANDARD",
    ],
    trim_note:
      "Zipper tape, thread and other textile trims are not separately specified.",
    purchase_note:
      "Price applies to Emerald Green in Standard fit, before any checkout promotions. Sizes are listed options; individual inventory was not checked.",
  },
  {
    id: "anthropologie-varley-wide-leg-pant",
    name: "Varley The Wide Leg 30-inch Pants — Light Grey Marl",
    category: "pants",
    keywords: [
      "women",
      "varley",
      "wide leg",
      "high rise",
      "relaxed fit",
      "30 inch",
      "pull on",
      "drawcord",
      "pintuck",
      "stretch",
      "standard",
    ],
    colors: ["Light Grey Marl"],
    sizes: ["XXS", "XS", "S", "M", "L", "XL"],
    material_composition: [
      {
        material: "viscose",
        percentage: 72,
      },
      {
        material: "polyester",
        percentage: 23,
      },
      {
        material: "elastane",
        percentage: 5,
      },
    ],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 132,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Anthropologie",
    product_url:
      "https://www.anthropologie.com/shop/varley-the-wide-leg-30-pants2?color=006&type=STANDARD",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Relaxed wide-leg pants with a high rise, pintucks and an elasticated waist with an internal drawcord.",
    source_urls: [
      "https://www.anthropologie.com/shop/varley-the-wide-leg-30-pants2?color=006&type=STANDARD",
    ],
    trim_note:
      "Waist elastic, drawcord, thread and other textile trims are not separately specified.",
    purchase_note:
      "Price applies to Light Grey Marl in Standard fit. Size M was selected with Add to Basket enabled; other sizes are listed options.",
  },
  {
    id: "anthropologie-reverie-lace-trim-pant",
    name: "By Anthropologie Reverie Lace Trim Tapered Pants — Evergreen",
    category: "pants",
    keywords: [
      "women",
      "reverie",
      "tapered",
      "wide leg",
      "mid rise",
      "ankle",
      "lace trim",
      "drawstring",
      "pull on",
      "pockets",
      "standard",
    ],
    colors: ["Evergreen"],
    sizes: ["XXS", "XS", "S", "M", "L", "XL"],
    material_composition: [
      {
        material: "viscose",
        percentage: 80,
      },
      {
        material: "nylon",
        percentage: 20,
      },
    ],
    composition_status: "complete",
    trim_materials: [],
    trims_status: "unknown",
    price: 128,
    currency: "USD",
    unit_count: 1,
    price_unit: "pair",
    retailer_name: "Anthropologie",
    product_url:
      "https://www.anthropologie.com/shop/by-anthropologie-reverie-lace-trim-tapered-pants?color=355&type=STANDARD",
    image_url: "assets/retail/pants.svg",
    data_status: "verified",
    source_checked_at: "2026-10-17",
    description:
      "Ankle-length pants with a tapered leg, lace at the hem, an adjustable drawstring waist and side pockets.",
    source_urls: [
      "https://www.anthropologie.com/shop/by-anthropologie-reverie-lace-trim-tapered-pants?color=355&type=STANDARD",
    ],
    trim_note:
      "The lace, waistband elastic, drawstring and thread fibers are not separately disclosed.",
    purchase_note:
      "Price applies to Evergreen in Standard fit, before any checkout promotions. Standard sizes are listed options; Tall fit was marked out of stock.",
  },
];
