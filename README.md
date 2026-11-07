# ✈️ SkyLoft

**Turn every flight into a flying neighbourhood.**

Board your flight, build a tiny loft, put some music on, and drop into the lofts of the other passengers on your plane — all from your phone.

**▶ Live app: https://monkeycept.github.io/boardem/**

---

## What you can do

| | |
|---|---|
| 🎫 **Board** | Scan the barcode on a real boarding pass (PDF417 / Aztec / QR, IATA BCBP format), type your flight number, or tap **Use Demo Flight**. Pick a name and avatar. |
| 🛋️ **Build your loft** | Drag-and-drop room editor with 3D-style furniture, 10 wallpapers and 8 floors drawn from Sanzo Wada's colour combinations, and album posters on the wall. Tap an item to rotate, resize, bring to front or remove. Works with touch and mouse (Delete / R / + / − on a keyboard). Autosaves. |
| 🌀 **Real physics** | Powered by the Bullet engine: new furniture drops in and lands with a thump, placing a piece on top of another shoves it aside, wall art swings on its nail, and the **Turbulence** button shakes the whole loft (with Undo). Visitors get the occasional bit of light turbulence too. |
| 🎵 **Music** | 8 built-in tracks (synthwave, chillhop, folk, ambient, nature…) composed live in the browser, plus your own MP3s. Whatever plays in your loft is what visitors hear. Tap an album poster to play it. |
| 🚪 **Visit neighbours** | See every passenger on your flight, then walk into their loft: the exact layout they built, their music playing, other visitors wandering around, and speech-bubble chat. Tap the floor to walk. |
| 💬 **Cabin chat** | A group chat for the whole flight, with unread badges. |
| 📲 **Installable PWA** | Add to home screen on iOS / Android; works offline once loaded (handy on flaky plane Wi-Fi). Gentle cabin-hum ambience you can switch off. |

### Demo vs live

* **Demo** (default): runs entirely in your browser with 8 demo neighbours — Amara, Marcus, Zara, Kai, Nova, River, Sienna and Atlas — who each have their own loft, music and chatty personality. Nothing leaves your device.
* **Live**: add a free Firebase project and SkyLoft syncs passengers, lofts, visitor positions and chat in real time between everyone who boards the same flight number. See [SETUP.md](./SETUP.md).

The header shows a **Demo** or **● Live** badge so you always know which you're in.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173 — open it on your phone on the same Wi-Fi too
```

Other scripts:

```bash
npm run build      # type-check + production PWA build in dist/
npm run preview    # serve the production build locally
npm run lint
npm run build:single   # one self-contained HTML file in dist-single/ (no service worker)
```

## Deploying

Every push to `main` builds the app and publishes it to GitHub Pages via `.github/workflows/deploy.yml` (it pushes the build to the `gh-pages` branch). The build uses relative paths, so it works under any repo name or custom domain.

To deploy by hand instead: `npm run deploy`.

To turn on live mode in the deployed site, add the `VITE_FIREBASE_*` values as repository **secrets** (Settings → Secrets and variables → Actions) — the workflow passes them to the build.

---

## How it's built

| Layer | Tech |
|---|---|
| App | Vite 5, React 18, TypeScript (strict) |
| Styling | Tailwind CSS, Framer Motion |
| Room editor | Konva + react-konva |
| Physics | Bullet, via ammo.js WebAssembly ([ammojs-typed](https://github.com/giniedp/ammojs-typed)) — loaded only when first needed (`src/lib/physics.ts`) |
| Art | Microsoft Fluent Emoji 3D (MIT) |
| Colour | Sanzo Wada, *A Dictionary of Color Combinations*, combination 155 for the app (`src/theme/`) |
| State | Zustand (persisted to localStorage) |
| Music | Web Audio API generative engine (`src/lib/audio.ts`) — no audio files shipped |
| Boarding pass | html5-qrcode + IATA BCBP parser (`src/lib/boardingPass.ts`) |
| Realtime (optional) | Firebase Anonymous Auth + Firestore, loaded lazily only when configured |
| PWA | vite-plugin-pwa (Workbox) |

```
src/
├── App.tsx                    # screen routing
├── components/
│   ├── layout/                # Header, BottomNav, Layout
│   ├── screens/               # Scanner, Home, LoftBuilder, Passengers, Chat, VisitLoft
│   ├── loft/                  # RoomStage (shared canvas), FurnitureNode, AvatarNode, DecorateSheet, ItemToolbar
│   └── common/                # AlbumThumb, NowPlayingBar
├── hooks/                     # useMyMusic, useRoomPresence
├── lib/                       # room catalog, tracks, audio engine, boarding pass parser, firebase sync, demo data
├── stores/                    # userStore, loftStore, flightStore, audioStore
└── types/
```

Every loft is laid out in the same 460×380 logical room and scaled to fit the screen, so a visitor sees exactly what the owner built.

### Firestore layout (live mode)

```
flights/{flightNumber}/passengers/{uid}   name, avatar, seat, lastSeen, visiting, x, y
flights/{flightNumber}/lofts/{uid}        furniture, wallpaper, flooring, currentlyPlaying
flights/{flightNumber}/messages/{id}      text, sender, timestamp, loftId?
```

A passenger shows as online if they've sent a heartbeat in the last 90 seconds. Starter security rules are in [`firestore.rules`](./firestore.rules).

---

## Credits

Furniture and avatar art: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT). Colour values: [mattdesl/dictionary-of-colour-combinations](https://github.com/mattdesl/dictionary-of-colour-combinations) (MIT), from Sanzo Wada's *A Dictionary of Color Combinations*. Physics: [Bullet](https://github.com/bulletphysics/bullet3) / [ammo.js](https://github.com/kripken/ammo.js) (zlib). See [ASSETS.md](./ASSETS.md) for more free sources.

## Known limits

* Uploaded MP3s stay on your device: visitors see the song title but can't hear it (sharing audio would need file storage).
* Uploaded songs are kept for the session only; after a reload, re-upload them.
* Camera scanning needs HTTPS (GitHub Pages and `localhost` are fine) and camera permission. If the camera isn't available, enter the flight manually.

## Ideas for later

Peer-to-peer sync over the cabin network (WebRTC) so it works without internet, avatar customisation, mini-games between passengers, shared playlists.

## License

MIT
