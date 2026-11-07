# boardem: The Plan

> From **SkyLoft** (rooms on a plane) to **boardem**: a web app where any group of people sharing a place (a flight, a train, a concert, a classroom, a group of friends) can each build a little room and visit each other's.

_Last updated 2026-11-07 · written on branch `claude/desktop-app-planning-8kynzp`_

**Contents**

1. [TL;DR](#1-tldr)
2. [Where the repo stands today](#2-where-the-repo-stands-today)
3. [The big idea: from Flights to Spaces](#3-the-big-idea-from-flights-to-spaces)
4. [Target architecture](#4-target-architecture)
5. [Roadmap](#5-roadmap)
6. [Dream goals](#6-dream-goals)
7. [How-tos](#7-how-tos)
8. [Claude on desktop: links & downloads](#8-claude-on-desktop-links--downloads)
9. [Decisions needed](#9-decisions-needed)

---

## 1. TL;DR

- **The planes aren't what makes SkyLoft good.** The appeal is that *people share a place for a while, each gets a room to decorate, and they visit each other's rooms.* That works just as well for trains, festivals, classrooms, offices, dorms and friend groups. So we turn "flight" into a general **Space**, and flights become one **Space Type** among many.
- **The repo doesn't run yet.** The docs say "production ready", but about 30 source files were pasted into a single file (`src/types/index.ts`). Two of the dependencies don't exist on npm. And nothing syncs in real time: Firebase is set up but never used for data. Fixing this (Phase 0) is about a day of mechanical work, and it comes first.
- **Order of work:** make it run → make SkyLoft truly multiplayer → generalize to Spaces → make rooms delightful → desktop and mobile apps → dream goals.
- **Building it with Claude on desktop:** download links, install commands and ready-to-paste prompts for each phase are in [§7](#7-how-tos) and [§8](#8-claude-on-desktop-links--downloads).

---

## 2. Where the repo stands today

I checked this on 2026-11-07. In a scratch copy, I split the pasted code into real files, then ran install, type-check and build.

| Area | What the docs say | What's actually there |
|---|---|---|
| Source files | "40+ files, 15+ components" | **One file.** `src/types/index.ts` (2,595 lines) is a pasted AI-chat transcript. It holds about 30 files separated by `<file_path>` markers, so it isn't valid TypeScript. `index.html`, `vite.config.ts`, `tsconfig.json` and the rest exist only inside it. |
| `npm install` | Works | **Fails.** `@vitejs/plugin-pwa` doesn't exist (the real package, `vite-plugin-pwa`, is also listed). `@radix-ui/react-slot@^2.0.2` was never published (the latest is 1.x). |
| Type-check | Strict, clean | After splitting and fixing the dependencies: **19 errors**. 18 are unused imports, and one is a type-only import clash in `FurnitureItem.tsx`. |
| Build | One-command deploy | **Fails in CSS.** `drop-shadow-cyan-500/50` isn't a Tailwind class, and `.animate-float` `@apply`s itself (circular). |
| Real-time sync | Firestore syncs passengers, rooms, chat and music | **Not wired.** Firebase is initialized and anonymous sign-in runs, but nothing reads or writes data (no `onSnapshot`, `setDoc` or `addDoc`). Everything is local demo data, so your chat messages are visible only to you. |
| Firebase config | From `.env.local` | It falls back to **hard-coded fake keys**, so a missing `.env` fails silently instead of switching to demo mode. |
| Saving | localStorage + Firebase | One `localStorage.setItem('loft', …)`. It's **never read back**, so your room is gone after a reload. |
| Boarding-pass scan | Parses flight and seat | It expects a made-up `AA123-12A` QR code. Real boarding passes use the IATA **BCBP** format in PDF417 or Aztec barcodes. Route, times and airline are hard-coded (SFO→JFK, American Airlines). |
| Navigation | n/a | Pages switch in memory with **no URLs**, so you can't share or bookmark anything. |
| PWA | Manifest + icons | There's no `public/` folder, so the icons are missing. |
| Naming | n/a | Three names: repo **boardem**, product **SkyLoft**, doc paths **sandship**. |
| Docs | "1,500+ lines" | 5 overlapping docs (about 2,400 lines) that repeat the same feature list and roadmap. |

**The good news:** the UI code itself is small, readable and worth keeping. That includes the Zustand stores, the Konva room canvas, the types, the demo passengers and the visual style.

---

## 3. The big idea: from Flights to Spaces

*boardem* = "board 'em": get everyone on board. I recommend it as the umbrella brand, with **SkyLoft** kept as the name of the flight experience.

### Concept map

| SkyLoft today | boardem (general) | Notes |
|---|---|---|
| Flight | **Space** | A shared place, with or without an end time |
| Boarding pass | **Join method** | Link, 6-letter code, QR poster, boarding pass, event ticket, NFC tag, location, calendar invite |
| Passenger | **Member** | |
| Loft | **Room** | *Your* room. It travels with you from Space to Space |
| Furniture | **Items**, grouped in **Packs** | Each Space Type brings a themed pack |
| Flight lobby | **Lobby** | A list, grid, seat map or venue map |
| Seat | **Spot** (optional) | Shown as a zone by default, not an exact seat |
| Landing | **Space ends → Memory** | Archived, read-only, with a postcard |

### Space Types

Each Space Type is a small config: how you join, how long it lasts, what the lobby looks like, which item packs it brings, and its safety settings. Types are not separate copies of the app.

| Type | How you join | Lasts | Lobby | What's special |
|---|---|---|---|---|
| ✈️ Flight (SkyLoft) | Scan boarding pass, or enter flight no. + date | Departure → landing + 1h | Seat map | Copes with flaky in-flight Wi-Fi |
| 🚆 Train / bus / ferry | Ticket QR, or route + time | The trip | Carriage list | |
| 🎪 Event / concert / festival | Ticket barcode, venue QR poster, geofence | Event days | Venue map by section | Listen-along, organizer's item pack |
| 🧑‍💻 Conference / meetup | Badge QR or link | The event | By track or room | "Who's here for X" |
| 📚 Classroom / study group | Teacher's code | The term | Grid | Teacher moderation, no DMs |
| 🏢 Office / team | Invite or SSO | Permanent | Floor plan | Status, focus mode |
| 🏠 Dorm / building | Invite + verification | Permanent | Floors | |
| ⏳ Waiting room (gate, clinic, DMV) | Posted QR code | Hours | List | Quiet mode, no audio |
| 💞 Friends / long-distance | Link | Permanent | Small | Private by default |
| 🔗 Pop-up | Anyone with the link | 24h by default | List | The simplest one, and the most shareable |

### The core every type shares

Room builder · visiting, with door states (**open / knock / closed**) · presence · Space-wide and per-room chat · music · reactions · block and report · Space lifecycle (start, end, archive).

### Product principles

1. **Link-first.** Every Space, Room and invite is a URL that opens in any browser. No install needed.
2. **Instant.** Under 10 seconds from "join" to standing in a decorated room. Demo mode works with no account.
3. **Your room is yours.** You have one persistent room, and each Space borrows it.
4. **Safe with strangers.** Door states, block and report, seat shown as a zone by default, and only the minimum data taken from tickets.
5. **Works on bad networks.** Editing works offline and syncs when it can.
6. **Space Types are data.** Adding "road trip" should take one file, not a fork.

---

## 4. Target architecture

### Code layout

Stay a **single package** through Phase 3, but organize it by domain from day one:

```
src/
├── core/          # types, room model, Space lifecycle, permissions (no React)
├── sync/          # SyncAdapter interface + demo / firebase implementations
├── space-types/   # flight.ts, popup.ts, event.ts, classroom.ts … + registry
├── tickets/       # join parsers: IATA BCBP, generic QR, links, codes
├── packs/         # item catalogs (base, flight, festival …)
├── features/      # room-builder, lobby, visit, chat, music (React)
└── ui/            # shared components, theme tokens
```

When the desktop shell arrives (Phase 4), switch to workspaces: `apps/web`, `apps/desktop` and `packages/*`.

### Data model (generalized)

```ts
type SpaceTypeId = 'flight' | 'train' | 'event' | 'classroom' | 'office' | 'friends' | 'popup' | (string & {})

interface Space {
  id: string                        // "flight:AA123:2026-11-07" or a random id for pop-ups
  type: SpaceTypeId
  title: string
  startsAt?: number
  endsAt?: number
  visibility: 'ticket' | 'link' | 'invite'
  meta: Record<string, unknown>     // type-specific: route, venue, seat map …
}

interface Member {
  spaceId: string
  userId: string
  displayName: string
  avatar: string
  roomId: string                    // the room they bring into this Space
  spot?: string                     // seat / section / desk, shown as a zone
  role: 'member' | 'host' | 'moderator'
  joinedAt: number
}

interface Room {
  id: string
  ownerId: string
  items: Item[]
  theme: { wall: string; floor: string }
  door: 'open' | 'knock' | 'closed'
  nowPlaying?: Track
  updatedAt: number
}

interface Item {
  id: string
  kind: string                      // comes from a Pack, no longer a fixed union
  x: number; y: number; rotation: number; scale: number; z: number
  props?: Record<string, unknown>   // color, image, link, track …
}

interface SpaceType {
  id: SpaceTypeId
  name: string
  icon: string
  joinMethods: JoinMethod[]
  defaultLifetimeHours?: number
  lobby: 'list' | 'grid' | 'seatmap' | 'map'
  packs: string[]
  safety: 'open' | 'standard' | 'strict'   // strict = classroom / minors
}
```

There are two key changes from today. Rooms no longer belong to a flight (`Loft.flightCode` goes away). And item kinds become data instead of a 12-item TypeScript union.

### Sync

**Recommendation:** put every read and write behind one `SyncAdapter` interface, and keep **Firebase** for Phase 1, because the docs and env setup are already built around it.

- **Firestore** holds Spaces, Members, Rooms and Messages.
- **Realtime Database** handles presence and avatar positions: frequent, cheap writes, with `onDisconnect()` to clean up.
- **Security rules** are tested with the Firebase Emulator Suite in CI.
- A **demo adapter** wraps today's demo data, so the app always works with zero setup.

Later (Phase 4 and the dream goals), room state can move to a **Yjs CRDT**. That allows editing a room together, merging offline edits, and syncing over local Wi-Fi with WebRTC when a plane has no internet. Because everything sits behind the adapter, that swap doesn't touch the UI.

### Routing

React Router with real, shareable URLs:

| Route | Screen |
|---|---|
| `/` | Home / your Spaces |
| `/join` | Scan or enter a code |
| `/j/:code` | Short invite link |
| `/s/:spaceId` | Lobby |
| `/s/:spaceId/r/:userId` | Visit someone's room |
| `/me/room` | Edit your room |

GitHub Pages needs a `404.html` fallback for this. **Firebase Hosting** handles it with one rewrite rule, and it's the natural home once Phase 1 uses Firebase.

### Identity, privacy, safety

- **Identity:** anonymous first (as today), with an optional upgrade to Google, Apple or an email link, so your room survives a new phone.
- **Ticket privacy:** a boarding pass barcode contains your full name and booking reference. Parse it on the device, keep only what's needed for the Space key (carrier + flight + date, plus the seat if you opt in), and never upload the raw barcode.
- **Safety:** door states, block and report, rate limits, and per-type safety presets (classrooms: no DMs, teacher moderation). Show seats as zones by default.

---

## 5. Roadmap

Rough estimates assume one person working with Claude Code.

### Phase 0: Make it run (about 1 day)

**Goal:** `npm install && npm run build` passes on a clean clone, and the demo is live at a URL.

- [ ] Split `src/types/index.ts` into the ~30 real files it contains. Each block is marked `<file_path>`; strip the `sandship/` prefix. I did this once in a scratch copy for this plan, and it takes a short script.
- [ ] Fix `package.json`:
  - remove `@vitejs/plugin-pwa`
  - set `@radix-ui/react-slot` to `^1.x`
  - move `tailwindcss`, `postcss` and `autoprefixer` to devDependencies
  - drop the packages nothing imports
- [ ] Fix the 19 TypeScript errors.
- [ ] Fix the two CSS errors in `globals.css`.
- [ ] Add `public/` with the manifest and icons (192, 512, maskable).
- [ ] Replace the fake Firebase fallback keys: no env → explicit demo mode.
- [ ] Load the saved room on start.
- [ ] Pick one name ([§9](#9-decisions-needed)) and apply it everywhere.
- [ ] Collapse the 5 docs into `README.md` (what, why, how to run) plus `docs/`, and drop the "production ready" claims.
- [ ] Add a GitHub Actions workflow that runs install → type-check → lint → build on every PR.
- [ ] Deploy (GitHub Pages or Firebase Hosting).
- [ ] Add a `CLAUDE.md` with commands, folder layout and conventions, so every Claude session starts with the right context.

**Done when:** CI is green, the live URL works, and the demo flight works end to end.

### Phase 1: Real multiplayer SkyLoft (about 1–2 weeks)

**Goal:** two phones that enter the same flight see each other, chat, and visit each other's rooms.

- [ ] `SyncAdapter` interface with `demo` and `firebase` implementations
- [ ] Rooms save and load, both locally and in the cloud
- [ ] Live passenger list with presence
- [ ] Real-time chat, Space-wide and per room
- [ ] Visiting a room shows it live, with visitor avatars moving live
- [ ] Door states, block and report
- [ ] URL routing and share links
- [ ] Real BCBP parsing (PDF417, Aztec, QR) with an "enter flight number" fallback. Space key = carrier + flight + date
- [ ] Security rules, plus emulator tests for them
- [ ] A Playwright test where two browser contexts join one Space, chat and visit

**Done when:** at least two real devices share one Space, the security rules are tested, and CI is green.

### Phase 2: Generalize to Spaces (about 2–3 weeks)

- [ ] Rename the model (Flight → Space, Loft → Room, Passenger → Member, FurnitureItem → Item), with a migration for rooms saved by v1.
- [ ] Add a `SpaceType` registry, and port Flight as the first type with no change in behavior.
- [ ] Add three more types to prove the abstraction: **Pop-up**, **Event**, **Classroom**.
- [ ] Add a "Create a Space" flow: pick a type → name it → get a link, a code, and a printable QR poster.
- [ ] Support these join methods: link, 6-character code, QR poster, boarding pass, generic ticket barcode.
- [ ] Space lifecycle: scheduled end, archive, read-only afterwards.
- [ ] Your room comes with you into every Space.
- [ ] Item packs: a base pack plus themed packs per type.
- [ ] Lobby layouts: list, grid, seat map.

**Done when:** someone who has never heard of SkyLoft can make a Space for their party in under a minute.

### Phase 3: Make rooms delightful (ongoing)

- Customizable avatars, emotes, and walking between rooms through hallways
- Upload your own photos and items (Firebase Storage, with size limits and moderation)
- Music: listen-along sync for embeds (streaming services limit what can be embedded, so check their terms); local files play for the owner only
- Decorate together: several people editing one room live
- Passport stamps and achievements for Spaces you've been to
- An accessibility pass: keyboard drag-and-drop, screen-reader room descriptions, reduced motion
- Translations (i18n)

### Phase 4: Everywhere (desktop and mobile apps)

1. **Install as a desktop app (free, available right after Phase 0).** The PWA installs from Chrome or Edge, or from Safari's *Add to Dock*. See [§7.5](#75-install-boardem-as-an-app-on-your-computer).
2. **Tauri 2 desktop shell** (`apps/desktop`). It's a small native app for macOS, Windows and Linux built from the same web code. It adds a tray or menu-bar icon, native notifications ("Kai knocked on your door"), `boardem://` deep links, auto-update, and local-network discovery. I picked Tauri over Electron for its much smaller downloads, because it uses the system's own webview.
3. **App stores** via Capacitor, which wraps the same web app, if you need store presence or reliable push notifications on iOS.
4. **Downloads page** on the site with links for each OS. CI builds the installers onto GitHub Releases.

Desktop-only ideas: a "mini room" window that stays on top, your room as a live wallpaper or screensaver, and friends' presence in the menu bar.

---

## 6. Dream goals

Each dream has a concrete first step, so it's never just a slogan.

| # | Dream | First step |
|---|---|---|
| 1 | **No-internet multiplayer.** Airplane mode stops mattering: phones in the same cabin find each other over local Wi-Fi or Bluetooth, sync rooms and chat, and catch up with the cloud after landing. | Move room state to Yjs behind `SyncAdapter`, then add a WebRTC provider. |
| 2 | **Your room is your passport.** One room you carry everywhere. It collects souvenirs from every Space: a mug from Lisbon, a festival wristband, a stamp from flight AA123. | Phase 2 "room travels with you", plus a `souvenirs` item pack. |
| 3 | **Describe it, get it.** Type "rainy Tokyo jazz bar" and Claude lays out the items, picks the colors and suggests a playlist. | A server-side function sends the item catalog and your prompt to the Claude API and gets back validated `Item[]` JSON (tool use / structured output). Use a fast model (Claude Haiku 5.5) for instant drafts and Sonnet 5.5 for detailed rooms. The API key never reaches the browser. |
| 4 | **A concierge in every Space.** Claude in the Space chat translates between passengers, answers "what's open near gate B12?", summarizes what you missed, and helps moderators. | Add a bot Member that only answers when @-mentioned. |
| 5 | **Listen-along.** The music in a room plays in sync for every visitor, and the DJ role can be handed off. | A shared `nowPlaying` with a server timestamp, so every client seeks to the same position. |
| 6 | **See it in the real world.** Hold up your phone in the cabin and rooms float above their seats. At a festival, rooms are pinned to the venue map. | A WebXR prototype for the seat-map lobby. |
| 7 | **Space Memories.** When a Space ends, everyone gets an auto-made postcard or yearbook of all the rooms and the best chat moments. | Render room snapshots to images when the Space archives. |
| 8 | **Official Spaces.** Airlines, venues, schools and brands host verified Spaces with exclusive item packs, maybe even on seatback screens. | A verified-host flag plus sponsored packs. |
| 9 | **Mini-games in rooms.** Chess on the coffee table, cabin-wide trivia, a shared jukebox vote. | Items with interactive `props` and a tiny game protocol. |
| 10 | **Accessible by default.** Every room is described for screen readers, and the builder works fully by keyboard. | An AI-generated alt-text description for each room. |
| 11 | **An open protocol.** Anyone can host a boardem-compatible server, and Spaces federate. | Publish the data model and the sync protocol as a spec. |
| 12 | **boardem for everything.** A community marketplace for Space Types and item packs. | Space Types are already data after Phase 2, so let users upload them. |

**North-star metric:** the share of Space members who visit at least one other person's room. That number tracks the thing that makes this app unlike any other.

---

## 7. How-tos

### 7.1 Get Claude on your desktop (about 5 minutes)

1. Download the Claude desktop app ([links in §8](#claude-desktop-app)) and install it.
2. Open it, sign in, and click the **Code** tab. The desktop app already includes Claude Code, so you don't need the CLI. Claude Code needs a paid plan.
3. Get the repo on your computer:
   ```bash
   git clone https://github.com/monkeycept/boardem.git
   ```
4. Click **+ New** (`Cmd+N` on macOS, `Ctrl+N` on Windows). Pick a **Local** environment, choose the `boardem` folder as the project folder, then type a task.
5. Optional: turn on **Worktree**. Each session then works in its own isolated copy of the repo, which is handy for running several Phase 1 tasks in parallel.

### 7.2 Pick up this plan on your desktop

This plan was written in a cloud session on branch `claude/desktop-app-planning-8kynzp`.

- **In the desktop app:**
  ```bash
  cd boardem
  git fetch origin
  git checkout claude/desktop-app-planning-8kynzp
  ```
  Then open the folder in a new session and ask Claude to *"Read PLAN.md and start Phase 0."*
- **From a terminal:**
  1. Install the CLI ([§8](#claude-code-cli-optional)), `cd boardem`, and run `claude --teleport` to pull a web session onto your computer.
  2. Run `/desktop` to hand that session to the desktop app (macOS and x64 Windows).
  3. Both steps need a claude.ai subscription.
- **From your phone:** follow and steer cloud sessions at [claude.ai/code](https://claude.ai/code) or in the Claude mobile app.

### 7.3 Run boardem locally (after Phase 0)

```bash
git clone https://github.com/monkeycept/boardem.git
cd boardem
npm install
npm run dev        # open http://localhost:5173 → "Use Demo Flight"
```

In the desktop app you can ask: *"Start the dev server and open it in the preview."* Claude opens the app in its Browser pane and can check its own changes there.

### 7.4 Prompts to paste into Claude Code

Before a big phase, ask Claude to propose a plan first, and approve it before it edits anything.

**Phase 0**
```text
Read PLAN.md §2 and §5 Phase 0. Split src/types/index.ts into the real files it
contains (each block is marked with <file_path>; strip the "sandship/" prefix).
Fix the package.json dependencies, the TypeScript errors and the CSS errors, add
public/ with the manifest and icons, and get `npm run type-check` and
`npm run build` passing. Add a GitHub Actions workflow that runs both on pull
requests, and a CLAUDE.md. Commit in small, reviewable steps.
```

**Phase 1**
```text
Implement PLAN.md Phase 1. Start with a SyncAdapter interface in src/sync, with a
demo implementation that wraps the current demo data, then a Firebase
implementation (Firestore for rooms and messages, Realtime Database for presence).
Add the React Router routes from PLAN.md §4. Write security rules and test them
with the Firebase emulator. Add a Playwright test where two browser contexts
join the same Space, chat, and visit each other's room.
```

**Phase 2**
```text
Implement PLAN.md Phase 2. Rename the model (Flight→Space, Loft→Room,
Passenger→Member, FurnitureItem→Item) with a migration for rooms saved by v1.
Add a SpaceType registry, port Flight as the first type with no change in
behavior, then add Pop-up, Event and Classroom types and a "Create a Space" flow.
```

**Dream goal 3 (AI room designer)**
```text
Add "Describe your room": a server-side function that sends the item catalog and
the user's prompt to the Claude API and returns validated Item[] JSON. Keep the
API key on the server, validate every item kind against the catalog, and add a
loading state plus an undo button in the room builder.
```

### 7.5 Install boardem as an app on your computer

Once the site is deployed:

- **Chrome or Edge** (Windows, macOS, Linux, ChromeOS): click the install icon at the right of the address bar, or open the browser menu and choose **Install**.
- **Safari on macOS** (Sonoma or later): **File → Add to Dock**.
- **iPhone / iPad:** in Safari, **Share → Add to Home Screen**.
- **Android:** in Chrome, **⋮ → Install app**.

### 7.6 Add a new Space Type (after Phase 2)

1. Create `src/space-types/roadtrip.ts`:
   ```ts
   import type { SpaceType } from '../core/types'

   export const roadtrip: SpaceType = {
     id: 'roadtrip',
     name: 'Road trip',
     icon: '🚗',
     joinMethods: ['link', 'code'],
     defaultLifetimeHours: 72,
     lobby: 'list',
     packs: ['base', 'roadtrip'],
     safety: 'standard',
   }
   ```
2. Register it in `src/space-types/index.ts`.
3. Add its item pack under `src/packs/roadtrip/`.
4. If it needs a new way to join, add a parser in `src/tickets/`.
5. Add a test that creates the Space, joins it, and visits a room.

### 7.7 Deploy

**GitHub Pages**
1. Set `base: '/boardem/'` in `vite.config.ts`.
2. Copy `index.html` to `404.html` at build time, so the router works.
3. Run `npm run deploy`.
4. In **Settings → Pages**, choose the `gh-pages` branch.

**Firebase Hosting** (recommended once Phase 1 uses Firebase)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # public dir: dist · single-page app rewrite: yes
npm run build && firebase deploy
```

---

## 8. Claude on desktop: links & downloads

### Claude desktop app

| Platform | Download |
|---|---|
| macOS (Apple Silicon and Intel) | https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect |
| Windows x64 | https://claude.ai/api/desktop/win32/x64/setup/latest/redirect |
| Windows ARM64 | https://claude.ai/api/desktop/win32/arm64/setup/latest/redirect |
| Windows (Microsoft Store) | https://apps.microsoft.com/detail/9P6K58THS811 |
| Linux (beta, Ubuntu/Debian, via apt) | https://code.claude.com/docs/en/desktop-linux |
| Every platform on one page | https://claude.com/download |

### Phone, browser, web

| Where | Link |
|---|---|
| iPhone / iPad | https://apps.apple.com/us/app/claude-by-anthropic/id6473753684 |
| Android | Open https://claude.ai/mobile on your phone |
| Chrome extension | https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn |
| Claude Code on the web | https://claude.ai/code |

### Claude Code CLI (optional)

The desktop app already includes Claude Code. Install the CLI only if you also want it in a terminal.

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Homebrew (macOS)
brew install --cask claude-code

# WinGet (Windows)
winget install Anthropic.ClaudeCode
```

Then run `cd boardem && claude`. To check the install, run `claude --version`.

**In your editor:**
- **VS Code or Cursor:** search for "Claude Code" in the Extensions view (extension id `anthropic.claude-code`).
- **JetBrains:** https://plugins.jetbrains.com/plugin/27310-claude-code-beta-

### Docs worth bookmarking

| Topic | Link |
|---|---|
| Desktop app guide | https://code.claude.com/docs/en/desktop |
| Desktop quickstart | https://code.claude.com/docs/en/desktop-quickstart |
| Claude Code overview | https://code.claude.com/docs/en/overview |
| Claude Code on the web | https://code.claude.com/docs/en/claude-code-on-the-web |
| CLAUDE.md and memory | https://code.claude.com/docs/en/memory |
| Remote Control (desktop ↔ phone) | https://code.claude.com/docs/en/remote-control |
| Plans and pricing | https://claude.com/pricing |
| Free courses (Claude Academy) | https://academy.claude.com/ |

### Tools this plan uses

| Tool | Docs |
|---|---|
| Vite | https://vite.dev |
| vite-plugin-pwa | https://vite-pwa-org.netlify.app |
| Firebase | https://firebase.google.com/docs |
| Firebase Emulator Suite | https://firebase.google.com/docs/emulator-suite |
| Konva | https://konvajs.org |
| Yjs | https://yjs.dev |
| Tauri | https://tauri.app |
| Capacitor | https://capacitorjs.com |
| Playwright | https://playwright.dev |

---

## 9. Decisions needed

| # | Question | My recommendation |
|---|---|---|
| 1 | **Name:** boardem as the umbrella, or keep SkyLoft for everything? | **boardem** for the app; **SkyLoft** for the flight Space Type. |
| 2 | **Backend for Phase 1:** stay on Firebase, or switch? | **Stay on Firebase.** It's already designed in, and the free tier covers testing. |
| 3 | **First non-flight Space Type:** Pop-up, Event or Classroom? | **Pop-up (link).** It's the easiest to build, the easiest to share, and it tests the whole abstraction. |
| 4 | **Under-18 users:** allowed? | This decides the Classroom type and the safety defaults, so settle it before Phase 2. |
| 5 | **Desktop:** PWA install only, or build the Tauri app early? | **PWA first.** Start on Tauri once Phase 2 ships. |
