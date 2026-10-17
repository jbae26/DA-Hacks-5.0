# EZR presentation and verification guide

The current catalog contains 35 real US retailer listings (five per retailer) checked on **October 17, 2026**. Prices and availability are dated observations. All garment images are original generic SVG sketches. This guide is a rehearsal/checklist, not a report that every check has passed.

## Two-minute presentation

**0:00–0:20 — The problem**

“Finding clothing that matches your material preferences often means checking labels across many shopping websites. That research can be especially time-consuming for people with eczema or skin sensitivities. EZR brings documented clothing information into one searchable place.”

**0:20–0:40 — Search**

Search **T-shirt** and press Enter. Point out retailer names, recorded fabric percentages and checked dates.

“These are real listings from selected retailers. We show the attributes we could verify, and keep missing information visible. Prices are snapshots, not a live shopping feed.”

**0:40–1:05 — Preferences and limits**

Choose **Cotton** in Prefer. Open **Why this match?**. Then briefly choose **Polyester** in Avoid and explain the empty result before clearing Avoid.

“Prefer changes ranking using known fiber content. Avoid is stricter: incomplete fabric or trim information cannot pass. These retailers leave some trim details unspecified, so the current catalog can return no results rather than invent certainty.”

**1:05–1:30 — Similar products**

With Avoid cleared, open a T-shirt's details and choose **Find similar alternatives**. Return to the search.

“Alternatives stay in the same clothing category and retain your preferences and budget. This comparison uses recorded attributes, not a medical suitability score.”

**1:30–1:45 — Shopping**

Show **Shop for this product**, positioned before **Find similar alternatives**, and open one exact retailer listing. Point out a purchase condition such as Uniqlo's member price or J.Crew's final-sale notice.

“Each shopping link goes to that product. The retailer confirms final price, stock, delivery and returns. The Old Navy underwear price covers the full three-pack.”

**1:45–2:00 — Purpose and theme**

Click **Start with the fabric** to open the materials guide. Point out the **Caution: Not medical advice** heading.

“Our City life and Nature life connection is the everyday wardrobe: making fiber information easier to understand and compare. Natural is not automatically better. EZR supports informed shopping choices without guaranteeing how anyone's skin will react.”

## Local checks

From the repository root:

```sh
cd EZR
python3 -m http.server 4180 --bind 127.0.0.1 --directory dist
```

Open <http://127.0.0.1:4180>. Omit `cd EZR` if already in the application directory. No build, login, paid service or external API setup is needed.

| Check | Expected behavior |
| --- | --- |
| Initial load and preference changes before Search | No product cards or catalog section appear. |
| Clear search or use Reset all | Results are hidden again. |
| Click Start with the fabric | The materials guide opens and receives keyboard focus. |
| Search `T-shirt`, `pants` and `underwear`, including Enter | Relevant records appear; counts and reasons agree with the results. |
| Compare uppercase/extra spaces and supported aliases | Normalization preserves equivalent matches. |
| Open Prefer and Avoid | Native menus group Natural, Processed and Synthetic fibers in that order. |
| Prefer Cotton | Known cotton content affects ranking; mixed fabrics keep their actual percentages. |
| Avoid Polyester or another fiber | Known matches are excluded; unknown trims are conservatively omitted. No results is expected with the current catalog. |
| Prefer and Avoid the same fiber | A conflict appears; neither choice is silently removed. |
| Apply and clear Max price | Recorded total purchase prices obey the limit. Old Navy's three-pack is compared using its full pack price. |
| Read product purchase notes | Member-price restrictions, final-sale conditions and limited-size information remain visible where supplied. |
| Open product name or image | Product details appear without redirecting the entire card. |
| Use Shop for this product on a card and in details | Both links target the identical stored product URL, open separately and appear before Find similar alternatives. |
| Find similar alternatives; return to search | Same category only; reference omitted; preferences, exclusions and budget preserved. |
| Search an absent item | Clear empty state; no invented products or relaxed exclusions. |
| Dismiss retailer notice and reload | Notice dismissal persists where localStorage works; search preferences reset. |
| Test with localStorage unavailable | Search remains functional without an uncaught storage error. |
| Keyboard navigation and mobile width around 390 px | Controls have usable labels/focus, cards reflow, and no horizontal overflow occurs. |
| Read About | Purpose, matching limits and retailer responsibilities remain clear. |

From the application directory, run:

```sh
node --test tests/*.test.js
node --check dist/ezr-app.js
```

Use actual command output for the passing count. Legacy tests remain in the suite; passing them alone does not validate current EZR behavior. Rehearse on the presentation device and check its browser console for errors.

## Data and presentation boundaries

The seven retailers are Gap, Old Navy, Uniqlo, J.Crew, Anthropologie, lululemon and Banana Republic. Their three data modules are `retail-gap-family.js`, `retail-jcrew-lulu.js` and `retail-br-anthro.js`. Evidence and content-use reviews are in [Gap-family notes](retail-gap-family.md), [J.Crew/lululemon notes](retail-jcrew-lulu.md) and [Banana Republic/Anthropologie notes](retail-br-anthro.md).

Do not present sketches as retailer photographs or dated prices as live quotes. Source verification establishes recorded facts, not an image/content license, retailer affiliation, medical approval or universal skin compatibility. Retailer photos and promotional copy are not reused. The current implementation remains native HTML/CSS/JavaScript, with browser-local matching and no camera or image recognition.

## Reset for another rehearsal

Clear controls or reload to reset in-memory search preferences. To show the retailer notice again, remove only `ezr.retailer-notice.v3` in browser developer tools; do not clear unrelated browser data. See [README](../README.md) for the data schema and privacy details.
