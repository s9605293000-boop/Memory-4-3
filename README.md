
# Memory Duel 4.3 — Full React + Firebase (Auth + Firestore)

## 1) Install
```
npm install
```

## 2) Firebase keys
Create file: `src/config/firebaseConfig.ts` from example and paste your keys:
```ts
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
}
```

## 3) Run
```
npm run dev
```

## 4) Deploy to GitHub Pages
- Set correct `base` in `vite.config.ts` to `/<repo-name>/`
- Then:
```
npm run deploy
```
