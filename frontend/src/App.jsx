import { useEffect, useState } from "react";
import DishCard from "./components/DishCard";
import ReservationForm from "./components/ReservationForm";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/menu", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Nie udało się pobrać menu.");
        return response.json();
      })
      .then(data => setCategories(data.categories))
      .catch(error => {
        if (error.name !== "AbortError") {
          setError("Nie udało się pobrać menu. Sprawdź połączenie i spróbuj ponownie.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  function retryMenu() {
    setLoading(true);
    setError("");
    setAttempt(attempt + 1);
  }

  return <>
    <header className="border-b border-stone-200 bg-white">
      <nav aria-label="Nawigacja główna" className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <a href="#" className="font-serif text-2xl font-bold">Przy Stole<span className="text-orange-700">.</span></a>
        <div className="flex flex-wrap gap-5 text-sm"><a href="#menu">Menu</a><a href="#wnetrze">Wnętrze</a><a href="#rezerwacja">Rezerwacja</a><a href="#kontakt">Kontakt</a></div>
      </nav>
    </header>
    <main>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-14 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div>
        <p className="mb-5 text-sm font-bold uppercase tracking-widest text-orange-800">Włoskie smaki · wspólne chwile</p>
        <h1 className="font-serif text-5xl leading-tight lg:text-6xl">Dobre jedzenie.<br />Jeszcze lepsze towarzystwo.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">Chrupiąca pizza, proste składniki i czas przy wspólnym stole. Zajrzyj do naszego menu i zaplanuj wizytę.</p>
        <a href="#menu" className="button mt-8 inline-block">Zobacz menu</a>
        </div>
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-900">
          <img src="/images/menu/ortolana.jpg" alt="Pizza z warzywami na rustykalnym drewnianym stole" className="aspect-[4/3] w-full object-cover md:aspect-[4/5]" />
        </div>
      </section>
      <section id="menu" className="border-y border-stone-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-serif text-4xl">Nasze menu</h2>
          <p className="mt-3 text-stone-600">Coś na początek, coś do podziału i coś na deser.</p>
          {loading && <p className="mt-8" role="status">Ładowanie menu…</p>}
          {error && <div role="alert" className="mt-8"><p>{error}</p><button className="button mt-4" onClick={retryMenu}>Spróbuj ponownie</button></div>}
          {!loading && !error && <>
            <div className="my-8 flex flex-wrap gap-3" role="group" aria-label="Kategorie menu">
              {[{ id: null, name: "Wszystko" }, ...categories].map(category => <button key={category.id ?? "all"} aria-pressed={active === category.id}
                className={`rounded-full border px-5 py-2 text-sm ${active === category.id ? "border-orange-800 bg-orange-800 text-white" : "border-stone-300"}`}
                onClick={() => setActive(category.id)}>{category.name}</button>)}
            </div>
            {categories.length === 0 && <p>Menu jest obecnie aktualizowane.</p>}
            {categories.filter(category => active === null || category.id === active).map(category => <div key={category.id} className="mb-10">
              <h3 className="mb-4 font-serif text-2xl">{category.name}</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{category.dishes.map(dish => <DishCard key={dish.id} dish={dish} />)}</div>
            </div>)}
          </>}
        </div>
      </section>
      <section id="wnetrze" className="mx-auto max-w-5xl px-6 pt-16">
        <h2 className="font-serif text-4xl">Miejsce na wspólne chwile</h2>
        <p className="mt-3 text-stone-600">Przy barze czy przy stole — rozgość się po swojemu.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <figure>
            <img src="/images/interior/bar.jpg" alt="Goście przy barze z drewnianym blatem i półkami z butelkami" className="aspect-[4/3] w-full rounded-2xl object-cover md:aspect-auto md:h-[440px]" />
            <figcaption className="mt-3 text-sm text-stone-600">Przy barze</figcaption>
          </figure>
          <figure>
            <img src="/images/interior/sala.jpg" alt="Jasna sala restauracyjna z dużymi oknami, stolikami i drewnianą podłogą" className="aspect-[4/5] w-full rounded-2xl object-cover md:aspect-auto md:h-[440px]" />
            <figcaption className="mt-3 text-sm text-stone-600">Przy wspólnym stole</figcaption>
          </figure>
        </div>
      </section>
      <section id="rezerwacja" className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-serif text-4xl">Spotkajmy się przy stole</h2>
        <p className="mb-8 mt-3 text-stone-600">Wypróbuj zgłoszenie rezerwacji: wybierz termin i podaj przykładowe dane kontaktowe.</p>
        <ReservationForm />
      </section>
      <section id="kontakt" className="bg-stone-900 px-6 py-14 text-stone-100">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-3xl">Przy Stole</h2>
            <p className="mt-3 text-stone-300">Fikcyjna restauracja, prawdziwy projekt studencki.</p>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">Menu, zdjęcia i dane kontaktowe służą prezentacji projektu. Serwis nie obsługuje rzeczywistych rezerwacji.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Kontakt i lokalizacja</h3>
            <address className="mt-3 space-y-2 not-italic">
              <p>Warszawa · lokalizacja przykładowa</p>
              <p><a href="mailto:kontakt@example.com" className="underline underline-offset-4">kontakt@example.com</a></p>
              <p className="text-sm text-stone-300">E-mail demonstracyjny, bez obsługi wiadomości.</p>
            </address>
            <a href="https://www.google.com/maps/search/?api=1&query=Warszawa" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm underline underline-offset-4">Zobacz Warszawę w Google Maps <span className="sr-only">(otwiera nową kartę)</span>↗</a>
          </div>
          <div><h3 className="text-lg font-semibold">Godziny otwarcia</h3><p className="mt-3">Codziennie: 12:00–22:00</p><p className="mt-2 text-sm text-stone-300">Zgłoszenia rezerwacji: 12:00–20:00 · czas polski</p></div>
        </div>
      </section>
    </main>
    <footer className="px-6 py-5 text-center text-xs text-stone-500">Projekt na kurs Programowanie zaawansowanych aplikacji webowych</footer>
  </>;
}
