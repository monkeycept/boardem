# ✈️ SkyLoft

**Turn every flight into a flying neighborhood.**

Build your dream loft, blast your music, and visit other passengers' rooms while flying.

---

## 🌌 The Magic

SkyLoft transforms airplane flights into connected flying communities. Scan your boarding pass, design your personal "loft" with furniture and album art, play your favorite music, and visit other passengers' rooms in real time—all over airplane WiFi. It's The Sims meets Airdrop, but you're 30,000 feet in the air.

**Imagine this:**
- You board Flight AA123. SkyLoft connects you to 8 other passengers on the same flight.
- You drag a cozy bed into your room, add a vinyl player, pin your favorite album poster to the wall.
- Your music starts playing softly in the background.
- You pop into your neighbor's loft and see their cyberpunk setup with neon lights and lo-fi beats.
- You float your tiny avatar across their room and chat via speech bubbles.
- When you land, your loft saves. On your next flight, it's waiting for you.

**Vibe:** Deep navy and purple gradients, glowing cyan accents, glassmorphism, buttery animations, and the gentle hum of airplane ambient sound.

---

## 🎮 Features (MVP)

### 1. **Boarding Pass Scanner**
- Full-screen QR code scanner (HTML5 Camera API)
- Parse flight number, seat, and passenger name
- Confetti celebration + "Welcome aboard Flight AA123!" animation
- Works with both real QR codes and demo mock data

### 2. **Personal Loft Builder**
- Interactive 2D drag-and-drop room using Konva canvas
- 12+ furniture items: bed, couch, desk, plants, lamps, rug, speaker, TV, wall posters, shelves
- Full manipulation: drag, drop, move, layer, rotate, delete
- Wallpaper and floor selector
- Wall frames for album art and photos
- Automatic saves to browser local storage + Firebase

### 3. **Music & Albums**
- Upload local MP3s or choose from 6 preset chill tracks
- Draggable album art posters on walls
- Click poster to play—music plays in real time for visitors
- Album metadata display (artist, title, vibes)

### 4. **Flight Lobby**
- Real-time passenger list for your flight
- 8 fun demo profiles with unique lofts
- Passenger avatars and online status
- Quick "Visit Loft" button for each passenger

### 5. **Visit Other Lofts**
- Enter "visitor mode" in any passenger's room
- See their exact furniture layout and decorations
- Watch their music play in real time
- Move your tiny avatar around the room
- Live chat with speech bubbles
- See other visitors in the room too

### 6. **Real-Time Connections**
- Group passengers by flight code from boarding pass
- Firebase Firestore for instant sync of:
  - Passenger list and online status
  - Room layouts and furniture placement
  - Chat messages
  - Currently playing music
- Feels like local Airdrop over airplane WiFi

### 7. **Full PWA**
- Install on home screen (iOS & Android)
- Offline support for loft editing
- Complete manifest.json
- Optimized service worker
- Works on all modern browsers

### 8. **Bottom Navigation**
- Home (welcome + flight info)
- My Loft (builder)
- Passengers (lobby)
- Chat (global flight chat)

---

## 🎨 Design Philosophy

- **100% mobile-first** — optimized for phone screens, touch-perfect drag interactions
- **Dark theme only** — premium, Apple-level polish
- **Subtle ambient sounds** — gentle plane hum on load
- **Generous animations** — Framer Motion for delight at every interaction
- **Glassmorphism** — frosted glass panels on dark backgrounds
- **Confetti moments** — celebrate boarding, saves, and first visits

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- A free Firebase account (< 5 min to set up)

### Installation

```bash
git clone https://github.com/yourusername/skyloft.git
cd skyloft
npm install
```

### Firebase Setup (Super Simple)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project called "SkyLoft"
3. Enable "Anonymous Authentication" (Settings > Authentication > Sign-in Method)
4. Create a Firestore Database in test mode (Collections > Start Collection)
5. Copy your Firebase config from Project Settings > SDK setup

Create `.env.local` in your project root:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Run Locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser (or your phone on the same WiFi).

---

## 📦 Deploy to GitHub Pages

1. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/skyloft/', // Change to your repo name
     ...
   })
   ```

2. Deploy:
   ```bash
   npm run build
   npm run deploy
   ```

3. Go to your repo Settings > Pages > set source to "gh-pages" branch

Your PWA is now live at: `https://yourusername.github.io/skyloft`

---

## 📱 Install as PWA

**On iPhone (iOS):**
1. Open in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Name it "SkyLoft" and tap "Add"

**On Android:**
1. Open in Chrome
2. Tap the three-dot menu
3. Tap "Install app" or "Add to Home Screen"

The app will work offline for your loft editing!

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| **Build** | Vite 5 + React 18 + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui + Radix |
| **Animations** | Framer Motion |
| **Canvas** | react-konva (loft builder) |
| **QR Scanner** | html5-qrcode |
| **Audio** | Howler.js |
| **Backend** | Firebase (Firestore + Anonymous Auth) |
| **State** | Zustand |
| **Icons** | Lucide React |
| **Toasts** | react-hot-toast |
| **PWA** | @vitejs/plugin-pwa |

---

## 📂 Folder Structure

```
skyloft/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── LoftBuilderScreen.tsx
│   │   │   ├── PassengersScreen.tsx
│   │   │   ├── ChatScreen.tsx
│   │   │   ├── ScannerScreen.tsx
│   │   │   └── VisitLoftScreen.tsx
│   │   ├── loft/
│   │   │   ├── LoftCanvas.tsx
│   │   │   ├── FurnitureItem.tsx
│   │   │   ├── FurnitureInventory.tsx
│   │   │   └── WallpaperSelector.tsx
│   │   ├── passengers/
│   │   │   ├── PassengerCard.tsx
│   │   │   ├── PassengerList.tsx
│   │   │   └── PassengerAvatar.tsx
│   │   ├── chat/
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── ChatPanel.tsx
│   │   └── common/
│   │       ├── ConfettiCannon.tsx
│   │       ├── MusicPlayer.tsx
│   │       └── LoadingSpinner.tsx
│   ├── hooks/
│   │   ├── useFirebase.ts
│   │   ├── useAudio.ts
│   │   └── useLocalStorage.ts
│   ├── stores/
│   │   ├── flightStore.ts
│   │   ├── loftStore.ts
│   │   └── userStore.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── firebase.ts
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── demo-data.ts
│   │   └── utils.ts
│   ├── assets/
│   │   ├── audio/
│   │   │   ├── ambient-hum.mp3
│   │   │   └── preset-tracks/
│   │   ├── images/
│   │   └── fonts/
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   └── robots.txt
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── .env.local (create this)
```

---

## 🎯 How It Works On A Plane

1. **Before Boarding:** Download SkyLoft on your phone and add to home screen
2. **At Gate:** Scan your boarding pass (or use demo data)
3. **During Flight:** 
   - Connect to Airplane WiFi
   - Design your loft while cruising
   - Visit 8 other passengers' rooms
   - Chat and hang out
4. **After Landing:** Your loft saves—visit it on your next flight!

All synced through Firebase with anonymous auth (no login required!).

---

## 🎮 Demo Profiles

The app ships with 8 fun passenger profiles:

1. **Amara** — Cyberpunk hacker vibe, neon lights, lo-fi tracks
2. **Marcus** — Cozy bookworm, plants everywhere, indie folk
3. **Zara** — Minimalist artist, sparse furniture, ambient sounds
4. **Kai** — Gamer setup with RGB everything, synthwave
5. **Nova** — Music producer, vinyl records, chillwave
6. **River** — Nature lover, forest aesthetic, nature sounds
7. **Sienna** — Retro 80s vibes, pastel colors, synthpop
8. **Atlas** — Traveler's collection, world maps, world music

Each has a unique loft layout, music, and personality.

---

## 🔮 Roadmap

### Phase 2 (Next Steps)
- [ ] **Real WebRTC with PeerJS** — Pure peer-to-peer sync over local WiFi (no Firebase needed)
- [ ] **Avatar Customization** — Design your character
- [ ] **Multiplayer Mini-Games** — Play with other passengers
- [ ] **Photo Sharing** — Capture and display flight moments
- [ ] **Leaderboards** — Most creative lofts, most visitors, etc.
- [ ] **Airlines Integration** — Official partnerships for real boarding pass data

### Phase 3
- [ ] **Persistent Accounts** — Cloud saves across flights
- [ ] **Loft Themes** — Pre-made beautiful room templates
- [ ] **Voice Chat** — Talk directly with other passengers
- [ ] **AR Preview** — See your loft in AR before boarding

---

## 🐛 Debugging & Troubleshooting

**Firebase not connecting?**
- Check your `.env.local` file
- Make sure Firestore is in test mode
- Check Firebase Console for errors

**QR Scanner not working?**
- Use demo data instead (it's built in)
- On iOS, use Safari (not Chrome)
- Grant camera permissions

**Audio not playing?**
- Check browser audio permissions
- Try a different track
- Check browser console for errors

**Offline not working?**
- Make sure you're on HTTPS (localhost works)
- Service worker takes ~30 seconds to register
- Check DevTools > Application > Service Workers

---

## 📄 License

MIT — Use it, fork it, improve it!

---

## 🙏 Credits

Built with love for the friendly skies ✈️

Made with:
- Vite for lightning-fast builds
- Firebase for real-time magic
- React Konva for smooth canvas interactions
- Framer Motion for delightful animations
- And a passion for making flights more fun

---

## 💬 Questions?

- Check the [demo](https://skyloft-demo.vercel.com) (placeholder)
- File an issue on GitHub
- DM on Twitter [@skyloftapp](https://twitter.com)

---

**Now board your flight and build something beautiful.** ✈️✨
```

Now let me create the complete project structure and files: