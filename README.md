# Przy Stole

Serwis demonstracyjny restauracji przygotowany na kurs **Zastosowania webowe — Programowanie zaawansowanych aplikacji webowych**.

Zespół: Antoni Golachowski, Dawid Nowak, Jakub Bednarczyk, Zuzanna Sosnowska.

## Zakres

- Menu pobierane z bazy, podział na kategorie i filtrowanie dań.
- Formularz zgłoszenia rezerwacji z walidacją i zapisem do SQLite.
- Galeria wnętrza, godziny otwarcia i przykładowe dane kontaktowe.

Zgłoszenie nie oznacza przydzielenia stolika. Aplikacja nie sprawdza dostępności miejsc, nie wysyła wiadomości e-mail i nie zawiera panelu administracyjnego. Formularz służy do pracy z danymi testowymi.

## Technologie

React, Tailwind CSS i Vite po stronie klienta; Express i SQLite po stronie serwera. Baza korzysta z modułu `node:sqlite` wbudowanego w Node.js.

## Uruchomienie

Wymagany **Node.js 24.15+ z linii 24** oraz npm. Wszystkie polecenia wykonuje się w głównym katalogu repozytorium.

```powershell
npm install
npm run dev
```

- Strona: http://localhost:5173
- API: http://localhost:3001/api/health

Vite przekazuje żądania `/api` do backendu. Docker i osobny serwer bazy danych nie są potrzebne do pracy lokalnej.

Wersja produkcyjna:

```powershell
npm run build
npm start
```

Express udostępnia wtedy API i pliki z `frontend/dist` pod adresem http://localhost:3001.

## Baza danych

Przy pierwszym uruchomieniu backend tworzy `backend/data/restaurant.sqlite`, trzy tabele i przykładowe menu. Kolejne uruchomienia zachowują zapisane dane.

| Tabela | Zawartość |
| --- | --- |
| `categories` | Nazwy i kolejność kategorii menu |
| `dishes` | Dania, opisy, ceny w groszach i dostępność |
| `reservations` | Dane zgłoszenia, termin, liczba gości i status |

Daty i godziny wizyt odnoszą się do strefy `Europe/Warsaw`. Czas utworzenia rekordu (`created_at`) jest zapisywany w UTC. Schemat i dane początkowe znajdują się w `backend/src/db.js`; wersję migracji przechowuje `PRAGMA user_version`.

### Podgląd zgłoszeń

Po wysłaniu formularza uruchom w drugim terminalu:

```powershell
npm run reservations
```

Polecenie wypisuje ścieżkę bazy, łączną liczbę zgłoszeń i 20 ostatnich rekordów. Opcjonalny argument zmienia limit:

```powershell
npm run reservations -- 50
```

Podgląd działa również przy uruchomionym backendzie i nie zmienia danych. Numer zgłoszenia z formularza odpowiada kolumnie `id`.

Plik można także otworzyć w przeglądarce SQLite i wykonać zapytanie:

```sql
SELECT * FROM reservations ORDER BY id DESC;
```

Przed ręczną edycją lub kopiowaniem pliku zatrzymaj backend. Przy działającej bazie kopię należy wykonywać mechanizmem backupu SQLite, z uwzględnieniem WAL.

### Konfiguracja

| Zmienna | Znaczenie | Domyślnie |
| --- | --- | --- |
| `PORT` | Port backendu | `3001` |
| `DATABASE_PATH` | Ścieżka pliku SQLite | `backend/data/restaurant.sqlite` |
| `RAILWAY_VOLUME_MOUNT_PATH` | Katalog bazy na wolumenie Railway, jeśli nie ustawiono `DATABASE_PATH` | — |

`DATABASE_PATH` najlepiej podawać jako ścieżkę bezwzględną. Przykład dla PowerShell:

```powershell
$env:DATABASE_PATH = Join-Path $PWD 'backend/data/restaurant.sqlite'
npm run dev
```

Zmienne są odczytywane ze środowiska procesu. Plik `.env.example` opisuje ustawienia; aplikacja nie wczytuje go automatycznie.

Każda lokalna kopia projektu ma własną bazę. Pliki SQLite, dane zgłoszeń i lokalne zmienne środowiskowe są wyłączone z Git.

## Sprawdzenie projektu

```powershell
npm test
npm run lint
npm run build
```

Testy backendu używają tymczasowych baz. Obejmują pobieranie menu, walidację formularza, zapis i trwałość danych oraz podgląd zgłoszeń.

## Struktura

```text
backend/
  scripts/         podgląd danych z terminala
  src/             Express, konfiguracja restauracji i SQLite
  test/            testy API i narzędzi lokalnych
frontend/
  public/images/   oryginalne zdjęcia
  src/components/  formularz i karta dania
  src/App.jsx      układ strony i pobieranie menu
docs/              API, wdrożenie, pomiary i źródła zdjęć
```

## Dokumentacja

- [API i przypadki użycia](docs/api.md)
- [Wdrożenie na Railway](docs/deployment.md)
- [Wersja bazowa i pomiary wydajności](docs/performance.md)
- [Źródła zdjęć](docs/image-sources.md)
