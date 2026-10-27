# Frontend

Interfejs restauracji w React, budowany przez Vite. Tailwind CSS jest podłączony przez `@tailwindcss/vite`.

- `src/App.jsx` — układ strony, pobieranie menu i filtrowanie kategorii.
- `src/components/DishCard.jsx` — karta dania i powiązania z plikami zdjęć.
- `src/components/ReservationForm.jsx` — formularz, wysyłanie zgłoszeń i prezentacja błędów.
- `src/index.css` — style wspólne i import Tailwinda.
- `public/images/` — zdjęcia udostępniane bez przetwarzania pod `/images/`.

Uruchomienie całego projektu i konfiguracja bazy są opisane w [głównym README](../README.md).
Proxy w `vite.config.js` przekazuje `/api` do `http://localhost:3001`.
