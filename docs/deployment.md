# Wdrożenie na Railway

Aplikacja jest przeznaczona do uruchomienia jako jedna usługa z jedną repliką. Express obsługuje API i zbudowany frontend. Plik SQLite znajduje się na trwałym wolumenie.

## Konfiguracja usługi

1. Połącz usługę z repozytorium GitHub. Jako katalog główny ustaw główny katalog repozytorium.
2. Budowanie odbywa się przez dołączony `Dockerfile` na Node.js 24.
3. Podłącz do usługi Volume z punktem montowania `/data`.
4. Railway ustawia `RAILWAY_VOLUME_MOUNT_PATH`; backend zapisze bazę w `/data/restaurant.sqlite`. Można też jawnie ustawić `DATABASE_PATH=/data/restaurant.sqlite`.
5. Ustaw healthcheck na `/api/health` i wygeneruj domenę publiczną.

Port jest pobierany ze zmiennej `PORT`. Baza inicjalizuje się podczas startu aplikacji, kiedy wolumen jest już zamontowany. Nie jest tworzona podczas budowania obrazu.

Bez wolumenu dane zapisane w kontenerze mogą zostać utracone po kolejnym wdrożeniu. Baza na Railway i lokalne bazy programistów są niezależne; wdrożenie kodu nie synchronizuje rekordów.

## Weryfikacja wdrożenia

- Sprawdzić `/api/health`, menu i pobieranie zdjęć.
- Wysłać zgłoszenie z danymi testowymi i sprawdzić zapis w bazie.
- Po ponownym wdrożeniu sprawdzić, czy zapisane zgłoszenie nadal istnieje.
- Skonfigurować kopie zapasowe wolumenu.

## Status

Budowanie frontendu i działanie API zostały sprawdzone lokalnie. Obraz Docker oraz trwałość danych na Railway wymagają sprawdzenia przy pierwszym wdrożeniu.

Dokumentacja usługi: [Railway Volumes](https://docs.railway.com/volumes).
