# Pomiary wydajności

Wersja v1 stanowi punkt odniesienia do porównania kolejnych optymalizacji. Wyniki pomiarów nie zostały jeszcze zebrane.

## Charakterystyka v1

- Oryginalne pliki JPEG w `frontend/public/images`, bez dodatkowej kompresji i zmiany rozdzielczości.
- Zwykłe znaczniki `img`, bez `srcset`, lazy loadingu, preloadu i specjalnych priorytetów pobierania.
- Wymiary widoków i kadrowanie zdjęć określone w CSS.
- Standardowy build produkcyjny Vite.
- Link do Google Maps; brak osadzonej mapy i jej żądań podczas ładowania strony.

Hero i karta pizzy Ortolana korzystają z tego samego adresu zdjęcia. Źródła i rozmiary oryginalnych plików są zapisane w [rejestrze zdjęć](image-sources.md).

## Procedura

1. Utrwalić wersję bazową w Git i zapisać identyfikator commita, np. jako tag `v1-baseline`.
2. Uruchomić build produkcyjny (`npm run build`, `npm start`) albo wdrożyć go na docelowym serwerze.
3. Wykonać kilka pomiarów w Lighthouse i WebPageTest, przy jednakowych ustawieniach urządzenia, sieci, lokalizacji testu i pamięci podręcznej.
4. Zachować raporty, datę pomiaru, wersje narzędzi i identyfikator badanej wersji aplikacji.
5. Porównać mediany wyników. Lighthouse i WebPageTest raportować osobno; nie wszystkie wskaźniki są dostępne w obu narzędziach.

Późniejsze wersje zachowują treść, zdjęcia i funkcjonalność strony. Optymalizacje rozdzielczości, kompresji, formatu i strategii ładowania powinny być wprowadzane etapami, aby można było wskazać ich wpływ na wynik.

## Metryki

| Metryka | Definicja |
| --- | --- |
| FCP | Czas od rozpoczęcia nawigacji do pierwszego wyrenderowania treści |
| LCP | Czas do wyrenderowania największego elementu treści widocznego w obszarze strony |
| TTFB | Czas do odebrania pierwszego bajtu odpowiedzi; zakres składowych należy podać zgodnie z narzędziem |
| Speed Index | Wskaźnik tempa wizualnego wypełniania widoku podczas ładowania |
| Fully Loaded | Czas zakończenia ładowania według definicji WebPageTest, uwzględniający jego kryterium bezczynności sieci |
| Rozmiar strony | Liczba bajtów przesłanych dla zasobów; w raporcie należy odróżnić transfer od rozmiaru po rozpakowaniu |
| Liczba żądań | Liczba żądań sieciowych zarejestrowanych podczas pomiaru |
