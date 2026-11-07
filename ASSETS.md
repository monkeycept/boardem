# Free assets: what SkyLoft uses, and where to find more

Everything below is free to use in an app like SkyLoft. Licences were checked in November 2026 — always re-check the page for the specific pack you download, because mixed-licence sites change and some individual items carry their own terms.

**Licence cheat sheet**

| Licence | Commercial use | Credit required | Catch |
|---|---|---|---|
| **CC0** (public domain) | Yes | No | None. The easiest to work with. |
| **MIT / ISC / zlib** | Yes | Keep the licence text with the files | None in practice. |
| **OFL** (fonts) | Yes | Keep the licence; don't sell the font on its own | None for apps. |
| **CC BY 4.0** | Yes | Yes — name the author and licence | Keep a credits list. |
| **CC BY-SA 4.0** | Yes | Yes | Changes you make to the asset must be shared under the same licence. |
| **CC BY-NC** | **No** | Yes | Avoid if SkyLoft might ever make money. |
| **Pixabay Content License** | Yes | No | Can't redistribute the files on their own; fine inside an app. |

---

## What SkyLoft ships with

| Asset | Source | Licence | Where it lives |
|---|---|---|---|
| 3D furniture and avatars (28 images) | [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) | MIT | `src/assets/fluent/` (licence included) |
| Colour palette | Sanzo Wada, *A Dictionary of Color Combinations* — values from [mattdesl/dictionary-of-colour-combinations](https://github.com/mattdesl/dictionary-of-colour-combinations) | MIT (dataset) | `src/theme/wada.ts`, `scripts/make_palette.py` |
| Physics engine | [Bullet](https://github.com/bulletphysics/bullet3) via [ammo.js](https://github.com/kripken/ammo.js) ([ammojs-typed](https://github.com/giniedp/ammojs-typed)) | zlib / MIT | npm dependency |
| UI icons | [Lucide](https://lucide.dev) | ISC | npm dependency |
| Font | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts | OFL | loaded from Google Fonts |
| Music and sound effects | Generated live in the browser (`src/lib/audio.ts`) | — | no files needed |

---

## Big free sources

### 3D models and furniture
| Source | Licence | Why it's good for SkyLoft |
|---|---|---|
| [Kenney](https://kenney.nl/assets) | CC0 | Thousands of consistent assets, including furniture kits that come with ready-made isometric renders — the quickest route to a true isometric loft. Also UI packs and sound packs. Don't use the Kenney logo. |
| [Quaternius](https://quaternius.com) | CC0 | Large, stylish low-poly packs (interiors, characters with animations). Good if the loft goes 3D. |
| [Poly Pizza](https://poly.pizza) | Mix of CC0 and CC BY, per model | 7,000+ low-poly models in one searchable place, including Kenney and Quaternius work. Check each model's licence line and credit the CC BY ones. |
| [Sketchfab](https://sketchfab.com/search?features=downloadable&licenses=7c23a1ba438d4306920229c12afcb5f9&type=models) (filter: downloadable, CC0) | Per model | Huge range; use the licence filter and avoid NC models. |

### 2D art, sprites and illustrations
| Source | Licence | Notes |
|---|---|---|
| [Kenney 2D packs](https://kenney.nl/assets/category:2D) | CC0 | Pixel and vector sets, room tiles, UI frames. |
| [OpenGameArt](https://opengameart.org) | Per asset (CC0, CC BY, CC BY-SA, GPL…) | Massive and community-run. Filter by CC0 to keep it simple. |
| [itch.io free game assets](https://itch.io/game-assets/free) | Per pack | Lots of beautiful isometric furniture and cozy-room packs. Read each pack's terms — many allow commercial use with credit, some don't. |

### Emoji and icon sets (drop-in replacements for the furniture/avatars)
| Source | Licence | Notes |
|---|---|---|
| [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) | MIT | What SkyLoft uses. 3D, flat, colour and high-contrast styles for ~1,500 emoji. |
| [OpenMoji](https://openmoji.org) | CC BY-SA 4.0 | Hand-drawn outline style, 4,000+ symbols including extra non-emoji objects. Needs the credit line "All emojis designed by OpenMoji – the open-source emoji and icon project. License: CC BY-SA 4.0". |
| [Lucide](https://lucide.dev) | ISC | UI icons (already used). |

### Textures, materials and skies
| Source | Licence | Notes |
|---|---|---|
| [Poly Haven](https://polyhaven.com) | CC0 | Top-quality textures, HDRI skies and models. A Poly Haven sky would make a great view out of the cabin windows. |
| [ambientCG](https://ambientcg.com) | CC0 | Thousands of PBR materials — real wood, carpet and tile for the loft floors. |

### Music and sound effects
| Source | Licence | Notes |
|---|---|---|
| [Kenney audio packs](https://kenney.nl/assets/category:Audio) | CC0 | UI clicks, impacts and interface sounds — good for furniture thumps and button feedback. |
| [Pixabay Music & Sound Effects](https://pixabay.com/music/) | Pixabay Content License | Large lo-fi / ambient catalogue. Fine to bundle in the app; not to redistribute as standalone files. |
| [Freesound](https://freesound.org) | Per sound (CC0, CC BY, CC BY-NC) | The biggest sound library. Filter to CC0 for cabin ambience, seatbelt chimes and announcements. |

### Fonts
| Source | Licence | Notes |
|---|---|---|
| [Google Fonts](https://fonts.google.com) | Mostly OFL (check each family) | Works with the claude.ai preview too. Faces with a Taishō/Shōwa feel that pair with the Wada palette: Shippori Mincho, Zen Kaku Gothic New, Zen Maru Gothic. |
| [Fontshare](https://www.fontshare.com) | ITF Free Font License | High-quality display faces, free for commercial use. |

### Colour
| Source | Licence | Notes |
|---|---|---|
| [Sanzo Wada colour data](https://github.com/mattdesl/dictionary-of-colour-combinations) | MIT | All 159 colours and 348 combinations as JSON. Run `npm run palette` after changing the anchors in `scripts/make_palette.py`. |
| [Lospec palette list](https://lospec.com/palette-list) | Free to use | Thousands of curated palettes, handy for pixel-art packs. |

---

## Ideas for the next upgrade

1. **Isometric loft** — Kenney's furniture kit renders + Poly Haven floor textures would turn the front-on room into a proper isometric one.
2. **Cabin sounds** — a Freesound CC0 seatbelt chime when turbulence starts, and Kenney impact sounds for landings.
3. **Window views** — Poly Haven HDRI skies cropped into the two cabin windows, changing with the flight's time of day.
