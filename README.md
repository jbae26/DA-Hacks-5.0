# DA-Hacks-5.0

Esther, Kimi, Siena

## EZR — Personalized clothing discovery

EZR is an English-language clothing search prototype for people with material preferences and skin sensitivities, including eczema. It connects the **City life and/or Nature life** theme with the clothing choices people make every day.

Products appear only after submitting a search. Search ordinary keywords, choose multiple **Prefer** and **Avoid** materials, read why each garment matches, and find similar alternatives in the same category. Preferences affect ranking; exclusions remove known avoided fibers and records with unverifiable fabric or textile trims. The catalog contains **35 real listings (five per retailer)** from **Gap, Old Navy, Uniqlo, J.Crew, Anthropologie, lululemon and Banana Republic**, with sources checked on **October 17, 2026**. Prices and availability are dated snapshots. Original generic SVG sketches represent garment categories; they are not retailer photographs or exact product depictions.

**Shop for this product** opens the exact retailer listing. Pack prices, member-price conditions and final-sale notes are shown where applicable. Retailers handle checkout, stock, shipping and returns. Product information does not establish medical suitability.

The existing vanilla HTML/CSS/JavaScript stack is retained. No backend, accounts, API keys, external AI, checkout or new dependencies. Preferences stay in page memory; only dismissal of the introductory notice is stored locally. Earlier Rooted features and data remain as inactive reference code.

From this repository root:

```sh
cd EZR
python3 -m http.server 4180 --bind 127.0.0.1 --directory dist
```

Open **http://127.0.0.1:4180**. Requires Python 3; no npm install or build. Stop with Ctrl+C.

From `EZR`, run checks with Node.js 20+:

```sh
node --test tests/*.test.js
```

Current verification: **74 tests pass**. Application details: [EZR/README.md](./EZR/README.md). Two-minute hackathon script: [EZR/docs/EZR-DEMO.md](./EZR/docs/EZR-DEMO.md).

EZR does not diagnose eczema, identify medical triggers, guarantee skin compatibility or certify products.
