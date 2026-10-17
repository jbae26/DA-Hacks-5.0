# J.Crew and lululemon listing evidence

Checked October 17, 2026 (America/Los_Angeles). Five selected products per retailer; no site-wide collection or external API. Exact product pages were inspected in the live browser. Facts below are selected-variant snapshots, not real-time stock or pricing.

## J.Crew

[Vintage-wash cotton T-shirt in stripe, BZ100](https://www.jcrew.com/p/mens/categories/clothing/tshirts-and-polos/t-shirts/BZ100?colorCode=PP7700&colorProductCode=BZ100&display=sale&fit=Classic&isFromSale=true)

- Selected color: Red Multi Sirinda Strip. Fit: Classic. The Details panel calls the silhouette relaxed and confirms short sleeves.
- Displayed price: $39.99, reduced from $49.50. The page's current shipping country was United States; USD records this US-store dollar price. No separate promotional code was applied.
- Fabric: 70% cotton and 30% recycled cotton. Both normalize to cotton, totaling 100% in the existing matching schema. Textile trims/stitching are undisclosed.
- The size dropdown offered M, L, XL with a final-sale label. XS, S, XXL were explicitly out of stock. Only the offered sizes enter `sizes`.
- Initially inspected J1785 garment-dyed tee was sold out, so it was not selected.

## lululemon

[Everyday Cotton-Blend Classic T-Shirt](https://shop.lululemon.com/p/everyday-cotton-blend-classic-t-shirt/owzvguq0v2?color=0002&fp=1)

- Selected color: White. Breadcrumbs identify men's T-shirts. Price accessibility text explicitly said 58 US Dollar; region control said US (USD).
- XS, S, M, L, XL, XXL were listed; no individual size was selected or inventory guarantee made.
- The opened Materials & Care drawer states body: 37% organic Pima cotton, 27% lyocell, 27% recycled polyester, 9% elastane. Fiber names normalize to the existing schema.
- Rib composition: 38% organic Pima cotton, 29% recycled polyester, 28% lyocell, 5% elastane. These known fibers enter `trim_materials`; `trims_status` remains unknown because other trims/stitching were not specified.

## Additional J.Crew selections

Live US storefront dollars are recorded as USD; conditional promotions were not applied. All four have full body-fiber percentages but unspecified trims and stitching.

| Product and exact source                                                                                                                                                                                                                    | Selected variant and price                    | Verified material and size facts                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Broken-in T-shirt, CI156](https://www.jcrew.com/p/mens/categories/clothing/tshirts-and-polos/t-shirts/broken-in-t-shirt/CI156?display=standard&fit=Classic&color_name=black&colorProductCode=CI156)                                        | Black / Classic, $36.50                       | 100% cotton. XS–XXL orderable. Short sleeves; separate washing recommended because dye can transfer.                                                                                   |
| [Perfect-fit crewneck T-shirt, CT123](https://www.jcrew.com/m/womens/categories/clothing/tees-and-tanks/MQ003?colorCode=GR7543&colorProductCode=CT123&display=all&fit=Women)                                                                | Bright Meadow, $39.50 solid-color price group | 100% cotton. Slim, waist-length fit. XXS, XS, XXL offered; S, M, L, XL, 2X, 3X out of stock. XS was selected without purchasing. The retailer's `/m/` route is a genuine product page. |
| [Classic chino pant, BE611](https://www.jcrew.com/p/mens/categories/clothing/pants-and-chinos/chino/classic-chino-pant/BE611)                                                                                                               | Storm Navy, $98                               | 100% cotton. Zip fly and front/back pockets. Only actual available waist/inseam pairs enter `sizes`, rather than a guessed cross-product of size ranges.                               |
| [Printed boxers in cotton, CM219](https://www.jcrew.com/p/mens/categories/clothing/underwear-and-boxers/boxer-briefs/printed-boxers-in-cotton/CM219?colorProductCode=CM219&color_name=sunhill-floral-blue-mul&display=standard&fit=Classic) | Sunhill Floral Blue Mul, $29.50 per pair      | 100% cotton body; elastic-waist fibers unknown. XS–XXL offered. Button fly.                                                                                                            |

## Additional lululemon selections

All live price accessibility labels explicitly said US Dollar. Body percentages came from each page's Materials & Care drawer. Known pocket/rib fibers are recorded without asserting that all trims are disclosed.

| Product and exact source                                                                                                                               | Selected variant and live price                    | Body composition and size observations                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Cotton-Blend Training Relaxed-Fit T-Shirt](https://shop.lululemon.com/p/cotton-blend-training-relaxed-fit-t-shirt/evofc56cb8?color=0001&locale=en_US) | Black, $68                                         | 62% organic cotton, 38% recycled nylon. Rib: 94% organic cotton, 6% elastane. XXS–XL selectable; individual inventory not checked.                       |
| [Women's Steady State Jogger](https://shop.lululemon.com/p/womens-steady-state-jogger/gqwcdnolxo?color=31045&locale=en_US)                             | Heathered Core Medium Grey, $79 sale / $98 regular | 70% cotton, 30% recycled polyester. Pocket lining: 95% cotton, 5% elastane. XXXS–XL selectable; individual inventory not checked. Final sale.            |
| [Steady State Classic-Fit Jogger Regular](https://shop.lululemon.com/p/steady-state-classic-fit-jogger/ybz0b3ska4?color=19746&sz=XS)                   | Onyx Grey / Regular, $79 sale / $118 regular       | 70% cotton, 30% recycled polyester. Pocket lining: 95% cotton, 5% elastane; rib: 97% cotton, 3% elastane. XS/XXL offered; S–XL out of stock. Final sale. |
| [Align High-Rise Pant 25-inch](https://shop.lululemon.com/p/align-pant-2/i4goprzy85?color=77007&locale=en_US)                                          | Raspberry Rave, $69 sale / $98 regular             | 81% nylon, 19% elastane. Sizes 0, 2, 4, 6, 8, 10, 12 selectable; 14 out of stock. Trims not separately disclosed. Final sale.                            |

The live women's jogger price was $79 rather than the search index's $49; the live Align pant price was $69 rather than the index's $98. Live prices take precedence. The Align T-Shirt in Raspberry Cream and Heavyweight Cotton T-Shirt in White were fully out of stock and were not added. Exact selected-color data must not be generalized to other colors or fabrics. The two Steady State joggers are separate women's and men's product IDs, not duplicate color records.

## Reuse review and implementation limits

[J.Crew Terms of Use](https://www.jcrew.com/help/terms-of-use), last updated September 19, 2024, describe a personal/noncommercial access license and reserve copying and public/commercial reuse of site materials without prior permission. No reusable-image license was established.

[lululemon Terms of Use](https://shop.lululemon.com/help/legal/terms-of-use), updated August 24, 2026, sections 2–3 restrict copying/publishing content, collecting or using product listings/descriptions, and automated extraction. Section 13 allows links that do not imply endorsement. There is no established license here for retailer images or a production product feed. These restrictions must remain visible in the developer record; an independently written facts summary is not represented as retailer permission or legal clearance.

Implementation uses the app's original local garment placeholders, selected factual attributes, short independently written descriptions, and exact non-affiliate product links. It does not copy retailer photography, marketing paragraphs, ratings, or health claims. `data_status: verified` means the recorded source attributes were observed, not that licensing, inventory, or individual skin suitability is certified. Obtain an appropriate licensed source before expanding to a production feed or retailer imagery.
