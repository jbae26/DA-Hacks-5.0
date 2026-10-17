# Banana Republic and Anthropologie source notes

Checked **2026-10-17** in the live Chrome storefront. Ten selected individual listings were captured; no website-wide scraping, external API, copied photographs, logos, reviews or marketing descriptions are included. Descriptions in the data module are short original summaries of documented garment features. `verified` means the stated fields were observed, not a medical or quality certification. Unknown trims are deliberately retained.

## Banana Republic

- Exact source: https://bananarepublic.gap.com/browse/product.do?pid=1180277032
- Product: Low-Rise Relaxed Utility Pant, product number 1180277.
- Selected color: Whiskey Brown. Listed alternate colors Brown and Navy Blue were not independently checked and are not included in the record.
- Current displayed price: **USD 140.00** for one pair. No credit-card or membership promotion is included in that price.
- Live Fabric & care section: **100% cotton**, machine wash. Main textile disclosure is complete; trim fibers were not specified. No inference about elastic, thread or zipper tape is made.
- Features observed: cotton sateen; low rise; relaxed hip and thigh; zipper/button fastening; belt loops; front/back pockets; unlined.
- Regular-fit size options: 0, 2, 4, 6, 8, 10, 12, 14, 16, 18. Regular and Long inseam options and a separate Petite fit were visible. Individual size/inseam inventory was not verified; the record does not claim every option is available.
- The previously reviewed Getaway pants are not used here. Their unverified customer-review composition disagreement is not carried into this different product.
- Active placeholder: `assets/retail/pants.svg`, assigned by the catalog aggregator; it is an original generic sketch and does not reproduce the retailer photo, exact design or color.

Terms checked: https://bananarepublic.gap.com/customerService/info.do?cid=1317 (last revised February 3, 2025). Its Site Contents section limits its content license to personal, noncommercial use and restricts reproduction/publication/display outside the stated allowance. No license to reuse its photos or promotional text was identified. This record uses minimal factual attributes and an exact outbound product link, with original descriptive wording and existing original artwork. This review does not establish a broader content or image license, and does not authorize automated catalog harvesting.

## Anthropologie

- Exact selected variant: https://www.anthropologie.com/shop/by-anthropologie-100-cotton-pull-on-pants2?color=522&type=TALL&size=XL+Tall&quantity=1
- Product: By Anthropologie 100% Cotton Pull-On Pants; style 4123264840035; color code 522.
- Color: White Floral. Selected fit/size: Tall / XL Tall.
- Live displayed sale price: **USD 59.95**, original price USD 148.00, for one pair. An older indexed page showed USD 109.95; that stale price is deliberately not used. The live page did not display a further item-specific in-cart discount.
- Product Details states **100% cotton**, pull-on styling, front slant pockets and machine wash. Thread, waistband elastic and other trim composition are not stated and remain unknown.
- At the check, XL Tall could be selected and the page reported one remaining unit. XS Tall, S Tall, M Tall, L Tall and Standard fit were marked out of stock. Only XL Tall is included in `sizes`. Inventory is particularly time-sensitive; the record is a dated observation, not a live inventory feed.
- Active placeholder: `assets/retail/pants.svg`, assigned by the catalog aggregator; it is an original generic sketch, not a depiction of the floral print or a reused retailer photograph.

US terms checked: https://www.anthropologie.com/help/terms-of-use (last updated November 25, 2025). Content Usage Restrictions grants a limited personal, noncommercial browsing/purchasing license and restricts reproducing, publishing, displaying, or commercially exploiting site content; it also contains linking/association restrictions. No reusable photograph or promotional-text license was identified. Only minimal factual fields, original concise wording, existing artwork and a source/product link are included. No claim is made that these terms grant broader republication, image rights, trademark permission, or an automated data license; any larger commercial data arrangement requires a separate rights assessment.

## Integration checks

- All ten records use the existing `material_composition` / `composition_status` schema and valid explicit HTTPS `product_url` values.
- All ten main compositions total 100; all `trims_status` values remain `unknown`, preserving conservative Avoid-filter handling.
- Source dates, USD currency and per-pair purchase units are explicit.
- Neither listing claims eczema safety, medical approval or universal suitability.

## Expanded selection: eight additional styles

The following exact US product pages were manually inspected in the live browser on **2026-10-17**. The four Anthropologie links were selected from one visible pants-category page; Banana Republic links came from already observed related-product navigation. No site-wide crawl, hidden endpoint or external API was used. These additions bring this module to **five Banana Republic and five Anthropologie products**, all distinct styles rather than multiple color records of one style.

Each price below is the displayed **USD price for one pair**, before unverified taxes, shipping or further checkout offers. Only the stated selected color and fit were captured; alternate color formulas and inventory were not assumed. All use original `assets/retail/pants.svg` and retain `trims_status: "unknown"`. Main-fabric totals do not establish the composition of elastic, drawstrings, lace, zipper tape or thread.

| Listing and source                                                                                                                                                 | Selected variant; displayed price                             | Explicit main-fabric composition                | Listed sizes / limits                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Banana Republic Everyday Tencel-Cotton wide-leg pant](https://bananarepublic.gap.com/browse/product.do?pid=713473122)                                             | Fresh Olive Green, Regular; **$130**                          | 60% TENCEL lyocell, 40% organic cotton          | XXS, XS, S, M, L, XL, XXL. Other colors displayed different sale prices, which are not used for this selected green variant.                                      |
| [Banana Republic Italian lightweight wool pant](https://bananarepublic.gap.com/browse/product.do?pid=1189257022)                                                   | Heather Medium Gray, Regular; **$198**                        | 98% wool, 2% elastane                           | 0, 2, 4, 6, 8, 10, 12, 14, 16, 18; Regular/Long inseam controls. Individual combinations not stock-checked. Dry clean only.                                       |
| [Banana Republic Everyday corduroy pant](https://bananarepublic.gap.com/browse/product.do?pid=1180265022)                                                          | Citrine Forest Green, Regular; **$148**                       | 99% cotton, 1% elastane                         | XXS, XS, S, M, L, XL, XXL listed. Individual inventory not checked.                                                                                               |
| [Banana Republic linen ankle pant](https://bananarepublic.gap.com/browse/product.do?pid=875436002)                                                                 | Cream Multi Stripe, Regular; **$54.99 sale**, previously $130 | 100% linen                                      | XXS and XS selectable; S, M, L, XL, XXL disabled. Only the two selectable sizes are recorded.                                                                     |
| [Anthropologie cotton-modal utility culotte](https://www.anthropologie.com/shop/by-anthropologie-cotton-modal-blend-utility-culotte-pants?color=230&type=STANDARD) | Olive, Standard; **$148**                                     | 78% cotton, 20% modal, 2% elastane              | XXS, XS, S, M, L, XL. M selected with Add to Basket enabled; no purchase. Style 4123382010146, color 230.                                                         |
| [Anthropologie Maeve Colette Magic Fabric pant](https://www.anthropologie.com/shop/maeve-colette-magic-fabric-full-length-pants?color=359&type=STANDARD)           | Emerald Green, Standard; **$130**                             | 47% viscose, 35% linen, 15% cotton, 3% elastane | 23–34 listed. No per-size stock assertion. Style 4123650590291, color 359.                                                                                        |
| [Anthropologie Varley wide-leg 30-inch pant](https://www.anthropologie.com/shop/varley-the-wide-leg-30-pants2?color=006&type=STANDARD)                             | Light Grey Marl, Standard; **$132**                           | 72% viscose, 23% polyester, 5% elastane         | XXS, XS, S, M, L, XL. M selected with Add to Basket enabled; no purchase. Style 4281529130003, color 006.                                                         |
| [Anthropologie Reverie lace-trim tapered pant](https://www.anthropologie.com/shop/by-anthropologie-reverie-lace-trim-tapered-pants?color=355&type=STANDARD)        | Evergreen, Standard; **$128**                                 | 80% viscose, 20% nylon                          | XXS, XS, S, M, L, XL listed. Tall fit was out of stock. Lace composition was not given; do not assign the main blend to the lace. Style 4123611840001, color 355. |

The previously documented retailer terms and image-use limitations apply to these additions. No new retailer image license was identified; no photos, logos, customer reviews or marketing paragraphs are copied. Product names and minimal factual attributes are accompanied by original short descriptions and exact outbound links. These observations do not grant a license for broader content redistribution or automated harvesting.

Validation for this module checks all ten records with the existing schema validator, exact URLs, local image existence, unique IDs and conservative omission under strict Avoid filters. Application-level test totals are maintained by the parent integration task rather than asserted here.
