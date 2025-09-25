# Memory Duel (PWA + Firebase Realtime DB)

Готовая заготовка онлайн-игры «Мемори» на двоих с очередностью ходов и таймером 5 секунд.

## Что готово
- Три уровня: 4×3, 4×4, 4×6 (на телефоне всё помещается без прокрутки).
- Онлайн‑дуэль через Firebase Realtime Database:
  - приглашения, быстрый матч, комнаты;
  - синхронизация колоды, ходов и очков;
  - авто‑переход хода через 5 секунд.
- PWA: `manifest.json` + `service worker` (устанавливается на телефон).
- Пиратский сет из 12 карточек в `assets/cards` (SVG).

## Как запустить
1) Создайте проект в Firebase и включите **Authentication (Email/Password + Anonymous)** и **Realtime Database**.
2) Откройте `src/main.js` и вставьте ваши ключи в `window.FIREBASE_CONFIG`:
```js
window.FIREBASE_CONFIG = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ВАШ_PROJECT.firebaseapp.com",
  databaseURL: "https://ВАШ_PROJECT-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ВАШ_PROJECT",
  storageBucket: "ВАШ_PROJECT.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXX"
};
```
3) Залейте папку на хостинг (Vercel/Netlify/GitHub Pages).

## Структура
- `index.html` — экраны: вход, лобби, игра.
- `styles.css` — адаптивная сетка, карточки.
- `src/main.js` — логика, комнаты, ходы, таймер, очки.
- `src/firebase.js` — SDK Firebase v10 (ESM CDN).
- `src/pwa/sw.js` + `manifest.json` — PWA.
- `assets/cards` — 12 SVG карточек + оборот.

Удачных дуэлей!
