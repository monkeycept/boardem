# SkyLoft setup

## 1. Run it locally (2 minutes)

Requires Node 18+.

```bash
npm install
npm run dev
```

Open http://localhost:5173 and tap **Use Demo Flight**. No accounts or keys needed — demo mode runs entirely in the browser.

To try it on your phone, open the "Network" URL Vite prints while on the same Wi-Fi. (Camera scanning needs HTTPS, so on a phone use the deployed site or enter the flight manually.)

## 2. Turn on live mode with Firebase (optional, ~5 minutes)

Live mode lets everyone who boards the same flight number see each other's lofts and chat in real time.

1. Create a project at https://console.firebase.google.com (Analytics not needed).
2. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**
3. **Build → Firestore Database → Create database** (production mode is fine) and pick a region.
4. **Firestore → Rules**: paste the contents of [`firestore.rules`](./firestore.rules) and publish.
5. **Project settings → Your apps → Web (`</>`)**: register an app and copy the config values.
6. Copy `.env.example` to `.env.local` and fill them in:

```bash
cp .env.example .env.local
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

7. Restart `npm run dev`. The header badge now says **● Live** after boarding. Open the app in two browsers, board the same flight number, and you'll see each other.

If Firebase can't be reached (bad keys, Anonymous auth disabled, offline), the app tells you and falls back to demo neighbours.

> Firebase web config values are not secrets — they identify your project. Access is controlled by the Firestore rules and Anonymous Auth.

## 3. Deploy to GitHub Pages

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the app and pushes `dist/` to the `gh-pages` branch. GitHub Pages serves that branch at `https://<user>.github.io/<repo>/`.

* If Pages isn't serving yet: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `gh-pages` / root**.
* For live mode on the deployed site, add each `VITE_FIREBASE_*` value under **Settings → Secrets and variables → Actions → New repository secret**, then re-run the workflow. In Firebase, add `<user>.github.io` under **Authentication → Settings → Authorized domains**.

Manual alternative from your machine: `npm run deploy`.

## 4. Install as an app

* **iPhone**: open the site in Safari → Share → **Add to Home Screen**.
* **Android**: open in Chrome → ⋮ → **Install app**.

## Troubleshooting

| Problem | Fix |
|---|---|
| No sound | Tap anywhere first — browsers only allow audio after a tap. Check the phone isn't on silent (iOS mutes web audio in silent mode). |
| Camera won't open | Needs HTTPS and camera permission. Use **Enter flight details** instead. |
| Stuck on **Demo** with Firebase configured | Check the browser console; usually Anonymous auth isn't enabled or the domain isn't in Firebase's authorized domains. |
| Old version after deploying | The PWA updates itself in the background; close and reopen the app, or hard-refresh. |
| Want a clean slate | **Home → Leave flight**, or clear the site's data in your browser. |

## Regenerating icons

Icons in `public/` come from `scripts/make_icons.py` (needs Python + Pillow): `python3 scripts/make_icons.py`.
