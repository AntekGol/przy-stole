# API

W trybie developerskim żądania `/api` przechodzą przez proxy Vite. W wersji produkcyjnej API i frontend obsługuje ten sam serwer Express.

| Metoda | Adres | Odpowiedź |
| --- | --- | --- |
| GET | `/api/health` | Stan aplikacji po wykonaniu zapytania kontrolnego do SQLite |
| GET | `/api/restaurant` | Nazwa, strefa czasowa, godziny otwarcia i limity zgłoszeń |
| GET | `/api/menu` | Kategorie wraz z dostępnymi daniami |
| POST | `/api/reservations` | Zapis zgłoszenia rezerwacji |

## Przeglądanie menu

Użytkownik otwiera stronę. Frontend pobiera `/api/menu` i wyświetla dania pogrupowane według kategorii. Filtrowanie odbywa się po stronie klienta.

W odpowiedzi `categories` zawiera obiekty `id`, `name` i `dishes`. Cena dania (`price_grosz`) jest liczbą całkowitą w groszach. Dania z `available = 0` nie są zwracane przez API.

## Zgłoszenie rezerwacji

Użytkownik uzupełnia formularz i wysyła dane. Backend sprawdza pola, zapisuje rekord w `reservations` i zwraca jego numer. Błędne zgłoszenie nie jest zapisywane.

Przykładowa treść żądania:

```json
{
  "customer_name": "Jan Testowy",
  "email": "test@example.com",
  "phone": "123456789",
  "reservation_date": "2027-05-20",
  "reservation_time": "18:30",
  "guests": 4,
  "notes": "Przy oknie"
}
```

Reguły walidacji:

- Imię i nazwisko: 2–100 znaków; e-mail do 254 znaków z kontrolą formatu.
- Telefon: 7–25 znaków, co najmniej 7 cyfr; dopuszczone spacje, nawiasy, myślniki i początkowy `+`.
- Termin: istniejąca data i przyszła godzina w strefie `Europe/Warsaw`.
- Godzina: 12:00–20:00, w odstępach 30-minutowych.
- Liczba gości: liczba całkowita 1–12.
- Uwagi: opcjonalne, do 1000 znaków.

Poprawne żądanie otrzymuje kod `201` i obiekt z polami `id`, `status: "pending"` oraz `message`. Błędy walidacji mają kod `400`; obiekt `errors` zawiera komunikaty przypisane do nazw pól formularza.

`pending` oznacza zapisane, niepotwierdzone zgłoszenie. Aplikacja nie przydziela stolików, nie obsługuje potwierdzeń ani nie wysyła e-maili. Kilka zgłoszeń na tę samą godzinę jest dopuszczalne.

## Obsługa błędów

Nieznane endpointy `/api` zwracają `404`, niepoprawny JSON — `400`, a treść żądania powyżej 16 KB — `413`. Błędy wewnętrzne zwracają `500` z ogólnym komunikatem.

Lista zgłoszeń nie jest dostępna przez publiczne API. Lokalny odczyt zapewnia `npm run reservations`.
