# EZR — Personalized clothing discovery

EZR helps people compare clothing using documented materials, personal preferences and budget. It supports research for people with eczema or skin sensitivities without diagnosing conditions, identifying individual triggers or certifying clothing as medically suitable.

The English-language app serves the US market and currently contains **35 real listings (five per retailer)** from **Gap, Old Navy, Uniqlo, J.Crew, Anthropologie, lululemon and Banana Republic**. Product information and USD prices are snapshots checked on **October 17, 2026**, not live inventory or pricing. Images are existing original, generic SVG garment sketches, not retailer photographs or exact product depictions.

## Run locally

From the repository root:

```sh
cd EZR
python3 -m http.server 4180 --bind 127.0.0.1 --directory dist
```

Open <http://127.0.0.1:4180>. If already in the application directory containing `dist/`, omit `cd EZR`. Stop the server with `Ctrl+C`. Use HTTP rather than opening the HTML file directly.

No npm installation or build is needed. Run automated checks from the application directory with Node.js 20 or later:

```sh
node --test tests/*.test.js
node --check dist/ezr-app.js
```

The command output provides the current test status. [Presentation and browser checks](docs/EZR-DEMO.md) describe manual verification without claiming those checks have already passed.

## Search and shopping behavior

- Products stay hidden until Search is submitted (including Enter or a search example). Choosing preferences alone does not show the catalog. Clearing the query or using Reset all hides results again. An explicitly submitted blank query shows the filtered catalog.
- Search matches names, categories, colors and explicit keywords, with common aliases such as pants/trousers and spandex/elastane.
- **Prefer** ranks documented fiber content higher; it is not a required-material filter. Unknown percentages do not receive invented percentage credit.
- **Avoid** excludes a product if its known fabric or textile trims contain the selected fiber. It also conservatively omits records with incomplete fabric or unknown trims. Every current listing has some unspecified trim information, so an active Avoid filter can produce no results. The app keeps this rule instead of relaxing the user's choice.
- Prefer and Avoid menus retain native dropdowns, grouped **Natural fibers → Processed fibers → Synthetic fibers**. A material selected in both produces a conflict message.
- **Max price** uses the recorded total purchase price. Old Navy's price is for the entire three-pack, not one pair. Prices exclude unverified shipping, taxes and conditional promotions. Member-price conditions and final-sale notices appear with the relevant products.
- **Find similar alternatives** stays in the reference product's category, excludes the reference itself, and preserves preferences, exclusions and budget. Matching is deterministic, not a clinical or AI suitability score.
- **Shop for this product** appears before **Find similar alternatives** on cards and in details, and opens the exact checked product page separately. Clicking a product name or image opens its details. Retailers handle checkout, stock, delivery and returns.

The home page uses the requested “Just the one for you” headline. Text is three pixels larger at each breakpoint, with the small skin-sensitivity note unchanged. The fabric card opens the materials guide; the About section has a prominent **Caution: Not medical advice** heading.

## Code and data

The existing stack remains native **HTML, CSS and JavaScript ES modules**. There is no app backend, account system, database, external API or AI service. Search and matching run in the browser.

| File | Purpose |
| --- | --- |
| `dist/index.html`, `dist/ezr.css` | Page structure, About, responsive styling and accessibility |
| `dist/ezr-app.js` | Search state, cards, product details and notices |
| `dist/ezr-shopping.js` | Grouped material options and exact retailer-link rendering |
| `dist/ezr-catalog.js` | Combines the 35 records and exports material/category definitions |
| `dist/retail-gap-family.js` | Gap, Old Navy and Uniqlo records |
| `dist/retail-jcrew-lulu.js` | J.Crew and lululemon records |
| `dist/retail-br-anthro.js` | Banana Republic and Anthropologie records |
| `dist/ezr-matching.js` | Normalization, validation, filters, ranking, alternatives and URL checks |
| `dist/assets/retail/{top,pants,underwear}.svg` | Original generic garment sketches selected by category |
| `tests/` | Current EZR checks and retained legacy regression tests |

Records preserve the existing schema: stable `id`; `name`; `category` (`top`, `pants`, `underwear`); `keywords`, `colors`, `sizes`; `material_composition` entries `{ material, percentage }`; `composition_status`; `trim_materials`; `trims_status`; `price`; `currency`; `retailer_name`; exact `product_url`; `image_url`; `data_status`; and `source_checked_at`. Purchase units and source/composition/trim/purchase notes supplement those fields.

Complete fabric percentages total 100% within the validator's rounding tolerance. Missing percentages use `null`; an unknown composition uses an empty array. `verified` means the stated attributes were observed in a source, not that missing details are known or that the product has medical approval. Separate colors or variants are not assumed to share composition, price or stock.

`retailerUrl` rejects homepages, search pages, placeholder domains, local addresses and URLs containing credentials. Never fabricate a product URL or copy unsupported details into a record. Refresh changing prices and availability before relying on them for a purchase.

## Sources and content reuse

The three source notes document the exact listings, observations, missing information and retailer terms review:

- [Gap, Old Navy and Uniqlo](docs/retail-gap-family.md)
- [J.Crew and lululemon](docs/retail-jcrew-lulu.md)
- [Banana Republic and Anthropologie](docs/retail-br-anthro.md)

The records contain minimal factual attributes and short original descriptions. No retailer photographs, logos or promotional copy are reused. Public access and factual verification do not establish a content license; the terms reviews do not grant permission to republish retailer content or harvest catalogs. Any broader commercial data or image use requires its own rights assessment.

## Privacy and scope

Queries, material choices and the current reference product remain in memory and reset on reload. They are not sent to a search backend or stored in URLs. The app uses `ezr.retailer-notice.v3` in localStorage only to remember that the retailer notice was dismissed; search still works if storage is unavailable. Opening a retailer link visits that retailer's independent website.

Legacy Rooted files remain for reference but are not loaded by the current EZR entry point. Camera capture, image recognition, saved products and persistent preferences are not current EZR features.

The **City life and/or Nature life** connection is everyday clothing: helping people navigate fiber information and compare natural, processed and synthetic materials according to their own priorities. A natural or organic label alone does not establish better health or environmental outcomes. Fiber matching cannot assess dyes, finishes or individual reactions.
