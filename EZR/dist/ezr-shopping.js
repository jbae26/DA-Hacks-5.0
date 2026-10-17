import { retailerUrl } from "./ezr-matching.js?v=retail3";

const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

export function renderMaterialOptions(groups, selected = []) {
  return (
    '<option value="">Add a material…</option>' +
    groups
      .map(
        (group) =>
          `<optgroup label="${escape(group.label)}">${group.materials
            .map(
              (material) =>
                `<option value="${escape(material.id)}"${selected.includes(material.id) ? " disabled" : ""}>${escape(material.label)}</option>`,
            )
            .join("")}</optgroup>`,
      )
      .join("")
  );
}

/** Only the selected record's checked product URL can create a shopping link. */
export function renderShoppingAction(product) {
  const url = retailerUrl(product);
  if (!url)
    return '<div class="shop-action"><button class="shop-button" type="button" disabled>Shop for this product</button><span class="shop-status">Retailer link unavailable</span></div>';
  return `<div class="shop-action"><a class="shop-button" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="Shop for ${escape(product.name)} at ${escape(product.retailer_name)} (opens a new tab)">Shop for this product</a><span class="shop-status">${escape(product.retailer_name)}</span></div>`;
}
