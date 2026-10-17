// Product component disclosures and general EPA reuse guidance; no impact score.
const reuse = {
  title: "EPA: reduce, reuse and repair",
  url: "https://www.epa.gov/climate-change/what-you-can-do-about-climate-change-waste",
};
const recycling = {
  title: "EPA: clothing reuse and recycling",
  url: "https://www.epa.gov/recycle/how-do-i-recycle-common-recyclables",
};
export function getLifecycle(product) {
  const main = product.components.find((c) => /main fabric/i.test(c.part));
  return {
    origin: `${main ? main.material : product.materialSummary}. This describes the main fabric only. Review thread, labels, waistbands, dyes and finishes in the component list.`,
    care: "Follow this garment’s washing and drying label. Repair when practical and comfortable; replacement frequency depends on wear, care and your needs. No verified service life in months is available.",
    afterUse:
      product.category === "underwear"
        ? "Check local textile collection rules specifically for used underwear. Confirm the collector’s hygiene and acceptance rules before donating. Do not assume cotton content makes a finished garment compostable."
        : "Keep comfortable, wearable clothing in use or pass it to an organization that accepts it. Ask local textile programs about damaged items; blends, trims and finishes affect processing.",
    unknowns:
      "Full dye and finish chemistry, verified service life and disposal outcomes are not established. Material origin alone cannot determine skin tolerance or total environmental impact.",
    sources: [...product.sources.slice(0, 1), reuse, recycling],
  };
}
