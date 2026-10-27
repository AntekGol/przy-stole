const express = require("express");
const { restaurant, warsawNow } = require("../restaurant");
module.exports = function reservationRouter(db, now = () => new Date()) {
  const router = express.Router();
  const insert = db.prepare(`INSERT INTO reservations
    (customer_name, email, phone, reservation_date, reservation_time, guests, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  router.post("/", (req, res) => {
    const body = req.body || {};
    const clean = (key) => typeof body[key] === "string" ? body[key].trim() : "";
    const name = clean("customer_name"), email = clean("email"), phone = clean("phone");
    const date = clean("reservation_date"), time = clean("reservation_time"), notes = clean("notes");
    const errors = {};
    if (name.length < 2 || name.length > 100) errors.customer_name = "Podaj imię i nazwisko (2–100 znaków).";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Podaj poprawny adres e-mail.";
    if (!/^\+?[\d ()-]{7,25}$/.test(phone) || phone.replace(/\D/g, "").length < 7) errors.phone = "Podaj poprawny numer telefonu.";
    const parsed = new Date(`${date}T12:00:00Z`);
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
    const current = warsawNow(now());
    if (!validDate || date < current.date) errors.reservation_date = "Wybierz dzisiejszą lub przyszłą datę.";
    if (!/^\d{2}:(00|30)$/.test(time) || time < restaurant.opensAt || time > restaurant.lastReservationAt) {
      errors.reservation_time = "Wybierz godzinę od 12:00 do 20:00, co 30 minut.";
    } else if (date === current.date && time <= current.time) {
      errors.reservation_time = "Wybierz przyszłą godzinę.";
    }
    if (!Number.isInteger(body.guests) || body.guests < 1 || body.guests > restaurant.maxGuests) errors.guests = "Liczba gości musi wynosić od 1 do 12.";
    if (notes.length > 1000) errors.notes = "Uwagi mogą mieć maksymalnie 1000 znaków.";
    if (Object.keys(errors).length) return res.status(400).json({ error: "Sprawdź dane formularza.", errors });
    const result = insert.run(name, email, phone, date, time, body.guests, notes);
    return res.status(201).json({ id: Number(result.lastInsertRowid), status: "pending",
      message: "Zgłoszenie demonstracyjne zostało zapisane. Nie jest to potwierdzenie rezerwacji i nie wysłano wiadomości e-mail.",
    });
  });
  return router;
};
