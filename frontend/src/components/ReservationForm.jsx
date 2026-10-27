import { useState } from "react";

const emptyForm = {
  customer_name: "",
  email: "",
  phone: "",
  reservation_date: "",
  reservation_time: "18:00",
  guests: "2",
  notes: "",
};
const slots = Array.from({ length: 17 }, (_, i) => {
  const hour = 12 + Math.floor(i / 2);
  const minute = i % 2 ? "30" : "00";
  return `${hour}:${minute}`;
});

export default function ReservationForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [today] = useState(() =>
    new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Warsaw" }).format(new Date())
  );

  const change = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: undefined });
    setMessage("");
  };
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage("");
    setSuccess(false);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guests: Number(form.guests) }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors || {});
        throw new Error(data.error || "Nie udało się wysłać zgłoszenia.");
      }
      setMessage(`${data.message} Numer zgłoszenia: ${data.id}.`);
      setSuccess(true);
      setForm(emptyForm);
    } catch (error) {
      setMessage(error instanceof TypeError ? "Brak połączenia. Spróbuj ponownie później." : error.message);
    } finally {
      setBusy(false);
    }
  }
  function field(name, label, type, extra = {}) {
    return <label className="grid gap-2 text-sm font-medium" key={name}>
      {label}
      <input className="form-input" name={name} type={type} value={form[name]} onChange={change}
        required disabled={busy} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} {...extra} />
      {errors[name] && <span id={`${name}-error`} className="text-red-800">{errors[name]}</span>}
    </label>;
  }
  return <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-stone-200 bg-white p-6 md:p-10">
    <div className="grid gap-5 sm:grid-cols-2">
      {field("customer_name", "Imię i nazwisko", "text", { minLength: 2, maxLength: 100, autoComplete: "name" })}
      {field("email", "E-mail", "email", { maxLength: 254, autoComplete: "email" })}
      {field("phone", "Telefon", "tel", { maxLength: 25, autoComplete: "tel" })}
      {field("guests", "Liczba gości", "number", { min: 1, max: 12 })}
      {field("reservation_date", "Data", "date", { min: today })}
      <label className="grid gap-2 text-sm font-medium">Godzina
        <select className="form-input" name="reservation_time" value={form.reservation_time} onChange={change} disabled={busy}
          aria-invalid={!!errors.reservation_time} aria-describedby={errors.reservation_time ? "time-error" : undefined}>
          {slots.map(time => <option key={time}>{time}</option>)}
        </select>
        {errors.reservation_time && <span id="time-error" className="text-red-800">{errors.reservation_time}</span>}
      </label>
    </div>
    <label className="grid gap-2 text-sm font-medium">Uwagi (opcjonalnie)
      <textarea className="form-input" name="notes" value={form.notes} onChange={change} maxLength={1000} rows={3} disabled={busy}
        aria-invalid={!!errors.notes} aria-describedby={errors.notes ? "notes-error" : undefined} />
      {errors.notes && <span id="notes-error" className="text-red-800">{errors.notes}</span>}
    </label>
    <p className="text-sm text-stone-600">Formularz demonstracyjny — użyj danych testowych. Wysłanie zgłoszenia nie rezerwuje prawdziwego stolika i nie powoduje wysłania e-maila. Liczba gości: 1–12, godziny: 12:00–20:00.</p>
    <button className="button justify-self-start" disabled={busy}>{busy ? "Wysyłanie…" : "Wyślij zgłoszenie"}</button>
    <p role="status" className={success ? "text-green-800" : "text-red-800"}>{message}</p>
  </form>;
}
