const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");
const { getDatabasePath } = require("../src/db");

function showReservations() {
  const limit = Number(process.argv[2] ?? 20);
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
    throw new Error("Podaj liczbę zgłoszeń od 1 do 1000, np. npm run reservations -- 50.");
  }

  const filename = path.resolve(getDatabasePath());
  console.log(`Baza: ${filename}`);
  if (!fs.existsSync(filename)) {
    throw new Error("Brak pliku bazy. Uruchom najpierw backend poleceniem npm run dev.");
  }

  // Podgląd nie tworzy pliku, nie uruchamia migracji i nie zmienia rekordów.
  const db = new DatabaseSync(filename, { readOnly: true, timeout: 5000 });
  try {
    const { count } = db.prepare("SELECT count(*) AS count FROM reservations").get();
    console.log(`Liczba zgłoszeń: ${count}`);
    if (count === 0) {
      console.log("Brak zgłoszeń. Wyślij formularz na stronie i uruchom to polecenie ponownie.");
      return;
    }

    const reservations = db.prepare(`
      SELECT id, customer_name AS osoba, reservation_date AS data,
        reservation_time AS godzina, guests AS goscie, status, created_at AS utworzono_utc
      FROM reservations
      ORDER BY id DESC
      LIMIT ?
    `).all(limit);
    console.table(reservations);
  } finally {
    db.close();
  }
}

try {
  showReservations();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
