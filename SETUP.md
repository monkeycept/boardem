# 🚀 SkyLoft Setup & Deployment Guide

Welcome aboard! This guide walks you through setting up SkyLoft locally, configuring Firebase, and deploying to GitHub Pages.

---

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project" → Name it "SkyLoft"
3. Enable Google Analytics (optional)
4. Wait for project to initialize

### 3. Enable Services
In Firebase Console:
- **Authentication** → Sign-in method → Enable "Anonymous"
- **Firestore Database** → Create Database → Start in test mode
- **Project Settings** → Web app → Copy your config

### 4. Create `.env.local`
```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your Firebase config:
```
VITE_FIREBASE_API_KEY=your_actual_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Run Locally
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo Mode:** Click "Use Demo Flight" to test everything without Firebase!

---

## 🎮 Testing Features

### Scanner Screen
- **Real QR Code:** Format: `AA123-12A` (flight number, seat)
- **Demo Mode:** Click button for instant access with 8 passengers

### Loft Builder
1. Click "My Loft" tab
2. Click "+ Add" to open furniture sidebar
3. Click furniture emoji to add to canvas
4. Drag items, right-click to rotate, double-click to delete
5. Click "Save" to persist locally

### Visit Passengers
1. Click "Passengers" tab
2. Click any passenger card
3. See their furniture layout and music
4. Click "Chat" to message them
5. Click "Exit" to return

### Chat
1. Click "Chat" tab
2. Type a message and send
3. Messages appear with timestamps

---

## 📦 Deploying to GitHub Pages

### Step 1: Update Vite Config
Edit `vite.config.ts` and change `base`:
```typescript
export default defineConfig({
  base: '/skyloft/', // Change 'skyloft' to your repo name
  // ... rest of config
})
```

### Step 2: Build & Deploy
```bash
npm run build
npm run deploy
```

This creates a `gh-pages` branch and pushes your app.

### Step 3: Enable GitHub Pages
1. Go to your repo → Settings → Pages
2. Source: Select "gh-pages" branch
3. Wait 1-2 minutes for deployment

Your app is now live at: `https://yourusername.github.io/skyloft/`

---

## 📱 Install as PWA

### iPhone (iOS)
1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Name: "SkyLoft" → Add

### Android
1. Open in Chrome
2. Tap ⋮ (three dots)
3. Tap "Install app"

The app works offline for loft editing!

---

## 🔧 Environment Variables

Required in `.env.local`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional:
- `VITE_FIREBASE_MEASUREMENT_ID`

Get these from Firebase Console → Project Settings → Web app

---

## 📂 Project Structure

```
sandship/
├── src/
│   ├── components/
│   │   ├── layout/           # Header, BottomNav, Layout
│   │   ├── screens/          # Main page components
│   │   ├── loft/             # Canvas, furniture, inventory
│   │   └── common/           # Confetti, toasts
│   ├── stores/               # Zustand state management
│   ├── lib/                  # Firebase, demo data
│   ├── types/                # TypeScript interfaces
│   ├── styles/               # Tailwind + animations
│   ├── App.tsx               # Main routing
│   └── main.tsx              # Entry point
├── public/                   # Static assets (favicon, icons)
├── index.html                # HTML entry
├── vite.config.ts            # Build config
├── tailwind.config.ts        # Styling config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # Full documentation
```

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  cyan: { /* ... */ },
  slate: { /* ... */ },
  // Add your colors here
}
```

### Add More Furniture
Edit `src/lib/demo-data.ts` and `src/components/loft/FurnitureInventory.tsx`:
```typescript
const FURNITURE_ITEMS = [
  { id: 'bed', label: 'Bed', emoji: '🛏️' },
  // Add more items...
]
```

### Change Wallpapers
Edit `src/components/screens/LoftBuilderScreen.tsx`:
```typescript
const wallpapers = [
  { id: 'dark-purple', label: 'Dark Purple', color: 'from-purple-900 to-slate-900' },
  // Add more wallpapers...
]
```

### Modify Demo Passengers
Edit `src/lib/demo-data.ts`:
- Change `demosPassengers` array
- Update `demoLofts` with custom furniture layouts
- Modify `demoTracks` with different music

---

## 🐛 Troubleshooting

### Firebase Connection Issues
**Problem:** "Failed to initialize auth"
**Solution:**
1. Check `.env.local` has correct Firebase keys
2. Verify Firestore is in test mode (allows all reads/writes)
3. Enable Anonymous Auth in Firebase Console
4. Check browser console for specific errors

### QR Scanner Not Working
**Problem:** Camera not detected
**Solution:**
1. Grant camera permission (check browser settings)
2. Use HTTPS or localhost (browsers require secure context)
3. Use demo mode instead for testing
4. On iOS, use Safari (not Chrome)

### Service Worker Not Registering
**Problem:** App not working offline
**Solution:**
1. Wait 30+ seconds for service worker to register
2. Check DevTools → Application → Service Workers
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Make sure app is served over HTTPS (or localhost)

### Build Errors
**Problem:** `npm run build` fails
**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check TypeScript errors: `npm run type-check`
4. Ensure Node.js 18+: `node --version`

---

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run deploy       # Build + deploy to gh-pages

# Code Quality
npm run lint         # Check for linting errors
npm run type-check   # TypeScript type checking
```

---

## 🚀 Advanced: Custom Domain (Optional)

### With GitHub Pages
1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In repo Settings → Pages → Custom domain
3. Enter your domain → Save
4. Update DNS records (follow GitHub instructions)

### With Vercel (Even Easier!)
```bash
npm install -g vercel
vercel
```

Follow prompts. Your app is live in seconds!

---

## 🎯 What's Included

✅ **Complete React 18 + TypeScript App**
✅ **Tailwind CSS + Framer Motion animations**
✅ **React Konva for 2D canvas drawing**
✅ **Firebase Firestore for real-time sync**
✅ **QR code scanner (html5-qrcode)**
✅ **Audio playback (Howler.js)**
✅ **PWA with offline support**
✅ **Dark theme only (premium feel)**
✅ **8 demo passengers with unique lofts**
✅ **Touch-optimized for mobile**
✅ **Ready to deploy**

---

## 📖 Architecture Overview

### State Management (Zustand)
- `flightStore` → Flight info, passengers, lofts, chat
- `loftStore` → Furniture, wallpaper, music
- `userStore` → User info, current page

### Firebase Structure
```
Passengers (collection)
├── id: string
├── name: string
├── status: 'online' | 'offline'
└── loftId: string

Lofts (collection)
├── id: string
├── ownerId: string
├── furniture: array
├── wallpaper: string
└── currentlyPlaying: object

ChatMessages (collection)
├── id: string
├── senderId: string
├── text: string
├── timestamp: number
└── loftId: string
```

### Component Hierarchy
```
App (routing)
├── ScannerScreen (boarding)
├── Layout
│   ├── Header (flight info)
│   ├── HomeScreen | LoftBuilderScreen | PassengersScreen | ChatScreen
│   └── BottomNav (navigation)
├── VisitLoftScreen (visitor mode)
└── Confetti (celebrations)
```

---

## 🎓 Learning Resources

- **Vite:** https://vitejs.dev
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion
- **Firebase:** https://firebase.google.com
- **Zustand:** https://github.com/pmndrs/zustand
- **React Konva:** https://konvajs.org/docs/react/

---

## 🤝 Contributing

Found a bug? Want to add a feature?

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - Use freely in your projects!

---

## ✈️ Roadmap

### v1.1 (Next)
- [ ] Custom avatar skins
- [ ] Achievement system
- [ ] Flight-specific emojis
- [ ] Sound effects & ambient audio

### v2.0 (Future)
- [ ] WebRTC P2P for offline connections
- [ ] Voice chat with lip-sync
- [ ] AR mode to see lofts overlaid on cabin
- [ ] Persistent cloud saves
- [ ] Multiplayer furniture dragging

---

## 💬 Questions?

- Check the [full README.md](./README.md) for feature details
- Review demo data in `src/lib/demo-data.ts`
- Explore components in `src/components/`
- Check type definitions in `src/types/index.ts`

---

## 🎉 You're All Set!

You now have a production-ready PWA that:
- Works on any modern browser
- Installs to home screen
- Works offline
- Syncs in real-time with Firebase
- Deploys to GitHub Pages

**Next steps:**
1. Customize with your branding
2. Add real flights data
3. Deploy to production
4. Share with your community

**Happy building! ✈️✨**
