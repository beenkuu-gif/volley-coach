// volley-coach/src/data/seedData.js

export const SEED_DRILLS = [
  // ─── ROZGRZEWKA (8) ─────────────────────────────────────────
  {
    id: 'drill-01', name: 'Rozgrzewka dynamiczna', category: 'Rozgrzewka',
    description: 'Bieg po boisku ze zmianami kierunku (slalom między pachołkami), wyskoki, skip A i B, mobilizacja barków i kostek.',
    tips: 'Zwróć uwagę na rozgrzanie barków i kostek przed ćwiczeniami technicznymi. Tempo spokojne, nie wyścig.',
  },
  {
    id: 'drill-02', name: 'Kółko z piłką', category: 'Rozgrzewka',
    description: 'Zawodniczki w kole (8-12 osób) podają piłkę sposobem górnym i dolnym naprzemiennie. 3 okrążenia.',
    tips: 'Skupiamy się na technice, nie szybkości. Błąd techniczny = cofamy odliczanie.',
  },
  {
    id: 'drill-R01', name: 'Rozgrzewka ze skakanką', category: 'Rozgrzewka',
    description: '3 serie po 2 minuty skakania na skakance: seria 1 — obunóż, seria 2 — naprzemiennie nogi, seria 3 — wolne tempo z wysokim kolanem. Przerwa 45 sek. między seriami.',
    tips: 'Aktywuje łydki i stawy skokowe przed treningiem siatkarskim. Skok — lądowanie na przodzie stopy, nie na piętach.',
  },
  {
    id: 'drill-R02', name: 'Mobilizacja stawów', category: 'Rozgrzewka',
    description: 'Rotacje barków (do przodu i tyłu, 15×), krążenia biodrami (15×), rotacje kostek (10×), skręty tułowia z ramionami poziomo (20×), skłony boczne.',
    tips: 'Każdy ruch wykonujemy powoli i z pełnym zakresem. NIE rozciągamy na zimno — to mobilizacja w ruchu.',
  },
  {
    id: 'drill-R03', name: 'Aktywacja core przed treningiem', category: 'Rozgrzewka',
    description: 'Sekwencja: plank przodem 30 sek. → plank bokiem lewy 20 sek. → plank bokiem prawy 20 sek. → dead bug 10 powtórzeń → bird-dog 10 powtórzeń. 2 rundy.',
    tips: 'Aktywacja mięśni głębokich zapobiega kontuzjom pleców. Brzuch napięty przez cały czas — nie opuszczaj bioder.',
  },
  {
    id: 'drill-R04', name: 'Rozgrzewka w parach z oporem', category: 'Rozgrzewka',
    description: 'Pary: A stoi za B i daje lekki opór dłońmi na ramionach. B wykonuje 10 kroków do przodu z oporem, potem zamiana. Następnie: A i B stoją naprzeciwko siebie, wywierają naprzemiennie opór na dłoniach (jak zamrożone pchanie).',
    tips: 'Aktywuje mięśnie stabilizujące ramię przed grą siatkówki. Siła oporu = 20-30% maksymalnej, nie walczymy.',
  },
  {
    id: 'drill-R05', name: 'Sprint z zadaniami — starty', category: 'Rozgrzewka',
    description: 'Zawodniczki w rzędzie na linii końcowej. Na sygnał: sprint do 3m (linia ataku) i z powrotem. Seria 2: start tyłem, obrót na sygnał. Seria 3: start bokiem — krok dostawny do 3m i sprint powrotny. 5 powtórzeń każdej wersji.',
    tips: 'Imituje ruchy siatkarskie (krok do bloku, bieg za piłką). Przerwa 30 sek. między seriami.',
  },
  {
    id: 'drill-R06', name: 'Stretching dynamiczny', category: 'Rozgrzewka',
    description: 'Marsz z wykrokiem i rotacją tułowia (10×), wykopy nóg do przodu (10×), przysiad z ramionami nad głową (10×), krok w bok z ugięciem kolana (10×), marsz z chwytaniem kostki do tyłu (10×).',
    tips: 'Stretching dynamiczny przed treningiem, statyczny dopiero PO. Ta kolejność zmniejsza ryzyko kontuzji i poprawia wyniki.',
  },

  // ─── ZAGRYWKA (7) ────────────────────────────────────────────
  {
    id: 'drill-03', name: 'Zagrywka floatowa z linii', category: 'Zagrywka',
    description: 'Seria 10 zagrywek floatowych z pełnej odległości (9m). Zawodniczka liczy ile weszło w pole.',
    tips: 'Kontakt dłonią w centrum piłki, brak rotacji nadgarstka — piłka powinna „tańczyć". Cel: min. 7/10 w pole.',
  },
  {
    id: 'drill-04', name: 'Zagrywka skoczna — progresja', category: 'Zagrywka',
    description: 'Etap 1: skok bez piłki (5 razy). Etap 2: zagrywka skoczna z 3m (5 razy). Etap 3: pełna zagrywka z linii (10 razy).',
    tips: 'Skok przed linią, uderzenie w najwyższym punkcie. Rozbiegu 3 kroki: lewa-prawa-lewa dla praworęcznych.',
  },
  {
    id: 'drill-Z01', name: 'Zagrywka w strefy — celność', category: 'Zagrywka',
    description: 'Na boisku rywala rozłóż 4 obręcze/stożki w rogach i środku. Zawodniczka wykonuje 15 zagrywek celując w wyznaczone strefy wg planu trenera. Punkty za celność.',
    tips: 'Zmiana kierunku zagrywki = zmiana kąta stania, nie kąta uderzenia. Ustaw nogi w stronę celu.',
  },
  {
    id: 'drill-Z02', name: 'Zagrywka pod presją czasową', category: 'Zagrywka',
    description: 'Zawodniczka ma 6 sekund na wykonanie zagrywki od sygnału trenera. Seria 12 zagrywek. Trener daje sygnał co 10-12 sekund. Liczymy procent zagrywek w pole.',
    tips: 'Imituje presję meczową z ograniczeniem czasu (8 sek. w przepisach). Rutyna przed zagrywką musi być krótka i powtarzalna.',
  },
  {
    id: 'drill-Z03', name: 'Seria zagrywek — 10 z rzędu', category: 'Zagrywka',
    description: 'Cel: 10 zagrywek z rzędu w pole. Jak wpada — liczymy dalej. Jak wychodzi — zaczynamy od zera. Drużynowo: kto pierwsza dojdzie do 10.',
    tips: 'Element rywalizacji i koncentracji. Po błędzie zawodniczka musi mentalnie się "zresetować" i nie wchodzić z niepokojem.',
  },
  {
    id: 'drill-Z04', name: 'Zagrywka na libero — taktyczna', category: 'Zagrywka',
    description: 'Trener wskazuje pozycję libero na boisku rywala. Zadanie: seria 10 zagrywek celując w strefę OBOK libero — zmuszamy go do trudniejszego przyjęcia lub atakujemy słabsze przyjmujące.',
    tips: 'Zagrywka na mocne libero to strata — atakuj słabsze przyjmujące lub graj na krawędź jego zasięgu. Analiza ustawienia przed zagrywką.',
  },
  {
    id: 'drill-Z05', name: 'Mecz na zagrywkę — bojowy', category: 'Zagrywka',
    description: 'Drużyna A zagrywa, drużyna B tylko przyjmuje (bez gry). Punkt za aceya lub złe przyjęcie (poza strefą wystawiczelki). Gra do 10 punktów, potem zamiana ról.',
    tips: 'Motywujące ćwiczenie na koniec bloku zagrywki. Zagrywająca i przyjmująca drużyna rywalizują — obie mają cel do osiągnięcia.',
  },

  // ─── PRZYJĘCIE (7) ────────────────────────────────────────────
  {
    id: 'drill-05', name: 'Przyjęcie zagrywki — trójkąt', category: 'Przyjęcie',
    description: 'Trzy zawodniczki w formacji trójkąta (libero + 2 przyjmujące) przyjmują zagrywki od trenera. Rotacja po 5 przyjęciach.',
    tips: 'Komunikacja „moja!" jest obowiązkowa — kara techniczna za brak. Wystawiczelka ocenia każde przyjęcie (1-3 pkt).',
  },
  {
    id: 'drill-06', name: 'Przyjęcie zagrywki w parach', category: 'Przyjęcie',
    description: 'Pary na boisku: jedna zawodniczka zagrywa, druga przyjmuje do wyznaczonej strefy (kółko przy siatce). 10 serii.',
    tips: 'Ustawienie nóg przed zagrywką — ramiona i stopy skierowane w stronę celu, nie w stronę piłki.',
  },
  {
    id: 'drill-P01', name: 'Przyjęcie po ruchu bocznym', category: 'Przyjęcie',
    description: 'Zawodniczka stoi na środku (P6). Trener wskazuje lewą lub prawą — zawodniczka robi 2 kroki dostawne, trener zagrywa. 15 powtórzeń na przemian. Praca nóg przed przyjęciem.',
    tips: 'Zatrzymanie przed uderzeniem jest kluczowe — nie przyjmuj w ruchu bocznym. Stop → ustaw nogi → przyjmij.',
  },
  {
    id: 'drill-P02', name: 'Przyjęcie zagrywki skocznej', category: 'Przyjęcie',
    description: 'Trener lub doświadczona zawodniczka wykonuje zagrywki skoczne. Przyjmujące ćwiczą adaptację do innej trajektorii i prędkości piłki. 3 serie po 6 przyjęć.',
    tips: 'Zagrywka skoczna jest płaska i szybka — cofnij się 1m dalej niż przy floacie. Czytaj ruch ramienia, nie piłkę.',
  },
  {
    id: 'drill-P03', name: 'Forearm pass od ściany — technika', category: 'Przyjęcie',
    description: 'Indywidualnie przy ścianie: zawodniczka odbija piłkę forearmem (sposobem dolnym) od ściany, starając się utrzymać stały rytm. 3 serie po 30 uderzeń.',
    tips: 'Ramiona proste i złączone przez cały ruch. Ruch wykonuje się NOGAMI (wejście pod piłkę), nie ramionami. Cel: zero rotacji piłki.',
  },
  {
    id: 'drill-P04', name: 'Przyjęcie z ograniczeniem ruchu', category: 'Przyjęcie',
    description: 'Zawodniczka stoi w obręczy lub kwadracie 1×1m z taśmy. Trener zagrywa w różne miejsca — zawodniczka musi przyjąć BEZ wychodzenia z kwadratu. Tylko praca ramion i dosięganie.',
    tips: 'Uczy optymalnego ustawienia przed zagrywką. Jeśli musisz wyj(ść z kwadratu — to błąd ustawienia, nie błąd techniki.',
  },
  {
    id: 'drill-P05', name: 'Przyjęcie z różnych stref boiska', category: 'Przyjęcie',
    description: 'Trener zagrywa z różnych miejsc — raz z lewej, raz z prawej, raz ze środka, raz z rogu. Przyjmująca musi adaptować ustawienie do każdej zagrywki. 15 powtórzeń.',
    tips: 'Zawodniczka powinna CZYTAĆ skąd idzie zagrywka i ustawiać się zanim piłka przejdzie siatkę. Aktywna obserwacja, nie bierne czekanie.',
  },

  // ─── ATAK (7) ─────────────────────────────────────────────────
  {
    id: 'drill-07', name: 'Atak z wystawienia — wzorzec', category: 'Atak',
    description: 'Wystawiczelka wystawia kolejno na 4, na 2 i z zadu. Atakujące wykonują pełne rozbieganie i atak. Po 3 seriach zmiana.',
    tips: 'Sprawdzaj lądowanie — obie nogi jednocześnie, ugięte kolana. Ramię uderza piłkę z wyprostowanym łokciem.',
  },
  {
    id: 'drill-08', name: 'Atak po chaotycznym przyjęciu', category: 'Atak',
    description: 'Trener rzuca piłkę losowo po boisku. Zawodniczka dobiera piłkę, wystawiczelka wystawia, zawodniczka atakuje. 8 razy.',
    tips: 'Ćwiczy atak po nieidealnym przyjęciu. Zwróć uwagę na wybór kierunku — diagonal vs. linia. Nie zawsze diagonal!',
  },
  {
    id: 'drill-A01', name: 'Atak — diagonal vs. linia', category: 'Atak',
    description: 'Wystawiczelka wystawia na 4. Trener wskazuje PRZED wystawieniem: krzyżyk (diagonal) lub linia prosta. Atakująca musi uderzyć w wyznaczony kierunek. 15 powtórzeń.',
    tips: 'Zmiana kierunku ataku = zmiana położenia nadgarstka w momencie kontaktu. Diagonal: nadgarstek "okręca" piłkę. Linia: uderzenie na wprost.',
  },
  {
    id: 'drill-A02', name: 'Atak z piłką trzymaną — technika ramienia', category: 'Atak',
    description: 'Wystawiczelka trzyma piłkę w wyskoku. Atakująca robi pełny rozbieg, wyskakuje i uderza piłkę trzymaną przez wystawiczelkę. Bez prędkości — tylko technika ruchu ramienia.',
    tips: 'Pozwala skupić się wyłącznie na ruchu ramienia i kontakcie. Łokieć wysoko, uderzenie otwartą dłonią, przepust nadgarstka.',
  },
  {
    id: 'drill-A03', name: 'Atak z różnych wystawień', category: 'Atak',
    description: 'Wystawiczelka wystawia na zmianę: piłkę wysoką (klasyczna), szybką (połówka), i balonową (bardzo wysoką). Atakująca musi dopasować timing do każdego rodzaju.',
    tips: 'Na piłkę szybką — skróć rozbieg i skacz wcześniej. Na piłkę balonową — czekaj z skokiem. Timing = najważniejszy element ataku.',
  },
  {
    id: 'drill-A04', name: 'Atak za libero — czytanie obrony', category: 'Atak',
    description: 'Trener ustawia 3 zawodniczki w obronie (jedna gra libero). Atakująca obserwuje PRZED uderzeniem gdzie stoi libero i uderza w wolną strefę. 12 powtórzeń.',
    tips: 'Zawodniczka powinna "czytać" obronę w momencie wyskoku — nie po. Wzrok na górze rozbiegania skanuje boisko, nie piłkę.',
  },
  {
    id: 'drill-A05', name: 'Atak przez ręce bloku', category: 'Atak',
    description: 'Dwie zawodniczki stoją na podestach/skrzyniach po drugiej stronie siatki i trzymają ręce nad siatką (imitacja bloku). Atakująca uczy się uderzać wysoko i "po rękach" na boczne linie.',
    tips: 'Cel: dać piłkę blokującym na palce (wipe) i posłać ją na aut. Atakuj górną część rąk, nie "wbijaj" przez środek bloku.',
  },

  // ─── BLOK (6) ────────────────────────────────────────────────
  {
    id: 'drill-09', name: 'Blok indywidualny — drabinka', category: 'Blok',
    description: 'Zawodniczki poruszają się wzdłuż siatki krokiem drabinkowym, na sygnał trenera zatrzymują się i wykonują blok indywidualny.',
    tips: 'Dłonie nad siatką — nie obok. Cel: seal-block (uszczelnienie siatki). Palce rozłożone, kciuki do góry.',
  },
  {
    id: 'drill-10', name: 'Blok podwójny z komunikacją', category: 'Blok',
    description: 'Dwie zawodniczki synchronizują blok podwójny. Trener wskazuje stronę ataku (lewa/prawa), para dobiera się i blokuje.',
    tips: 'Zawodniczka bliższa piłce lideruje — daje sygnał „blok!". Zewnętrzna dłoń powinna być skierowana do środka boiska.',
  },
  {
    id: 'drill-B01', name: 'Blok środkowej — szybkie przemieszczanie', category: 'Blok',
    description: 'Środkowa blokująca stoi na P3. Trener wskazuje lewą (P4) lub prawą (P2) — środkowa przebiega krokiem drabinkowym i wykonuje blok. 10 powtórzeń w każdą stronę.',
    tips: 'Środkowa musi pokonać 2-3m w 0,5 sek. — trening szybkości poruszania się wzdłuż siatki. Nie krzyżuj nóg — krok dostawny!',
  },
  {
    id: 'drill-B02', name: 'Blok reagujący — czytanie ataku', category: 'Blok',
    description: 'Atakująca po drugiej stronie wyskakuje i uderza (lub udaje uderzenie). Blokująca musi reagować na ruch ramienia atakującej — NIE na piłkę. Seria 15 prób.',
    tips: 'Czytaj ramię i bark atakującej, nie piłkę — decyzja o kierunku bloku musi być podjęta 0,2 sek. przed uderzeniem.',
  },
  {
    id: 'drill-B03', name: 'Blok po kroku bocznym + skok', category: 'Blok',
    description: '3 pachołki wzdłuż siatki (co 2m). Zawodniczka startuje od środkowego, biegnie do lewego pachołka → blok → wraca do środka → biegnie do prawego → blok. 8 serii.',
    tips: 'Trening wytrzymałościowy blokowych. Tempo wysokie — imituje wielokrotne bloki podczas seta. Utrzymuj technikę mimo zmęczenia.',
  },
  {
    id: 'drill-B04', name: 'Penetracja dłoni — technika nad siatką', category: 'Blok',
    description: 'Zawodniczka stoi przy siatce i ćwiczy "wbijanie" dłoni nad siatkę (maksymalna penetracja). Trener sprawdza: dłonie po drugiej stronie, kciuki skierowane w dół po przejściu przez siatkę.',
    tips: 'Aktywna penetracja dłoni redukuje "wipe" (ześlizgnięcie piłki na aut). Dłonie wbijaj, nie tylko unoś.',
  },

  // ─── OBRONA (6) ──────────────────────────────────────────────
  {
    id: 'drill-11', name: 'Obrona dolna — reakcja', category: 'Obrona',
    description: 'Trener lub zawodniczka zbija piłkę z wyskoczki z różnych pozycji. Obrońcy (2 osoby) reagują i odbijają do wystawiczelki.',
    tips: 'Pozycja gotowości: niska, ciężar na przodzie stóp, ręce przed sobą. NIE czekaj na piłkę — ruszaj na anticipacji.',
  },
  {
    id: 'drill-O01', name: 'Obrona po ataku cross', category: 'Obrona',
    description: 'Atakująca uderza diagonal ze skrzydła. Obrończyni na P1 lub P5 przygotowuje się na cross i odbija piłkę do wystawiczelki. 12 powtórzeń z każdej strony.',
    tips: 'Przewidywalny atak = aktywna defensywa. Ustaw się 2m od bocznej linii, 2m od końcowej. Czekaj nisko.',
  },
  {
    id: 'drill-O02', name: 'Poślizg i rolling — technika upadku', category: 'Obrona',
    description: 'Ćwiczenie na miękkiej macie: krok w bok, opuść biodra, wyślizgnij się na udo (poślizg siatkarzy). Następnie: rolling — przewrót przez ramię po wyciągnięciu. 5 serii po 5 powtórzeń.',
    tips: 'Poślizg: biodra niżej niż kolana zanim dotkniesz podłogi. Rolling: piłka (okrągłe) — nie na bark kanciasty. Bezpieczna technika upadku.',
  },
  {
    id: 'drill-O03', name: 'Obrona strefowa — 2 zawodniczki', category: 'Obrona',
    description: 'Dwie obrończynie na polu (P1+P6 lub P5+P6). Trener atakuje z wyskoku z różnych stref. Para reaguje, komunikuje i odbija piłkę. 15 ataków.',
    tips: 'Jedna zawodniczka "lideruje" — zawodniczka bliżej piłki idzie po nią, druga zabezpiecza. Brak komunikacji = kolizja.',
  },
  {
    id: 'drill-O04', name: 'Kopanie (dig) — technika jednorącz', category: 'Obrona',
    description: 'Trener rzuca piłkę nisko i boczne. Obrończyni ćwiczy jednoręczny dig (kopanie) — ostateczna deska ratunku. 10 powtórzeń lewą i prawą ręką.',
    tips: 'Dig jednoręczny ratuje piłkę niemożliwą do obrony klasycznie. Ramię wyprostowane, uderzenie wewnętrzną stroną nadgarstka.',
  },
  {
    id: 'drill-O05', name: 'Obrona za blokiem', category: 'Obrona',
    description: 'Ustawienie meczowe: blok na siatce, 2 zawodniczki w obronie. Trener atakuje. Obrończynie muszą bronić piłki "przez" blok lub które uciekną z boku bloku. 15 prób.',
    tips: 'Obrona za blokiem = gra w cieniu. Wylicz co blok "zamknął" i zabezpiecz resztę. P1 broni diagonal, P5 broni linię.',
  },

  // ─── GRA (6) ──────────────────────────────────────────────────
  {
    id: 'drill-12', name: 'Gra 6×6 — wolny wynik', category: 'Gra',
    description: 'Pełnowymiarowa gra bez ograniczeń taktycznych. Grają dwa pełne składy. 2 sety do 21 punktów.',
    tips: 'Trener obserwuje, nie przerywa bez ważnego powodu. Notuj błędy seriami — omawiaj po secie, nie w trakcie gry.',
  },
  {
    id: 'drill-13', name: 'Gra 4×4 — małe boisko (6×9m)', category: 'Gra',
    description: 'Gra na połowie boiska, 4 na 4. Każda zawodniczka ma więcej kontaktu z piłką. Sety do 15 punktów.',
    tips: 'Idealne gdy mało zawodniczek lub na koniec treningu. Wymuszaj zagrania o 1 z krawędzi — rozwijają kreatywność.',
  },
  {
    id: 'drill-G01', name: 'Gra z zadaniem — punkty bonusowe', category: 'Gra',
    description: 'Normalna gra 6×6, ale za konkretne zagranie drużyna dostaje 2 pkt. zamiast 1. Zadanie zmienia się co set: np. set 1 = bonus za asa, set 2 = bonus za blok, set 3 = bonus za przyjęcie z P6 prosto do wystawiczelki.',
    tips: 'Drużyny zaczynają wymuszać ćwiczone elementy. Bon celowa gra to lepszy trening niż wyizolowane ćwiczenie.',
  },
  {
    id: 'drill-G02', name: 'Gra 3×3 — ultraintensywna', category: 'Gra',
    description: 'Boisko 6×6m (1/4 pola). Gra 3 na 3, każda zawodniczka gra wszystkie role. Sety do 11, gra 3 sety, przerwa 1 min. Bardzo wysoka intensywność kontaktu z piłką.',
    tips: 'Idealne na koniec treningu lub jako przerywnik. Zawodniczki robią 3-4× więcej kontaktów niż w normalnej grze.',
  },
  {
    id: 'drill-G03', name: 'Gra sytuacyjna — tylko z przyjęcia', category: 'Gra',
    description: 'Punkt może być zdobyty TYLKO jeśli poprzedza go pozytywne przyjęcie (libero lub skrzydłowa). Jeśli przyjęcie złe — piłka wraca i drużyna nie może atakować. Gra do 15.',
    tips: 'Wymusza priorytetyzację przyjęcia. Zawodniczki uczą się że bez dobrego przyjęcia nie ma ataku — to fundament siatkówki.',
  },
  {
    id: 'drill-G04', name: 'Rotacja challenge — gra z rotacją', category: 'Gra',
    description: 'Normalna gra, ale co 5 punktów OBIE drużyny rotują. Cel: każda zawodniczka gra na każdej pozycji. Sprawdzamy jak drużyna funkcjonuje w każdej rotacji.',
    tips: 'Identyfikuje słabe rotacje (np. serwis w P1 jest słaby). Po grze omów które rotacje wymagają pracy.',
  },

  // ─── SIŁOWNIA (13) ────────────────────────────────────────────
  {
    id: 'drill-14', name: 'Skoki pionowe — seria plyometryczna', category: 'Siłownia',
    description: '5 serii: 10 skoków box jump (skrzynia 40cm) + 10 squat jump. Przerwa 90 sekund między seriami. Łącznie 100 skoków.',
    tips: 'Jeśli technika lądowania jest zła — zatrzymaj całą serię. Priorytet: miękkość lądowania, nie wysokość. Kolana nad stopami.',
  },
  {
    id: 'drill-S01', name: 'Przysiad klasyczny (squat) z obciążeniem', category: 'Siłownia',
    description: 'Przysiad ze sztangą lub hantlami. 4 serie × 8 powtórzeń. Głębokość: udo równoległe do podłogi lub głębiej. Przerwa 2 min między seriami.',
    tips: 'Kolana nie wychodzą do wewnątrz (valgus!). Ciężar na piętach. Spójrz w górę lub prosto — nie w dół. To ćwiczenie bazowe dla siatkarzy.',
  },
  {
    id: 'drill-S02', name: 'Skok z gumą oporową — siła wyskoku', category: 'Siłownia',
    description: 'Guma mocowana do pasa i do podłogi (kotwica). Zawodniczka wykonuje 3 serie × 10 skoków pionowych z oporem gumy. Różne gumy = różny opór. Przerwa 90 sek.',
    tips: 'Guma ćwiczy "wybuch" z dołu — fazę koncentryczną skoku. Zaczynaj od słabszej gumy, stopniowo zwiększaj opór.',
  },
  {
    id: 'drill-S03', name: 'Wyciskanie nad głowę (overhead press)', category: 'Siłownia',
    description: 'Hantle lub sztanga — wyciskanie nad głowę w staniu. 4 serie × 10 powtórzeń. Ciężar: 40-60% maksymalnego. Kontrolowany ruch w dół (excentryk).',
    tips: 'Wzmacnia mięśnie zagrywki i ataku. Brzuch napięty przez cały czas — nie wyginaj lędźwi. Łokcie lekko przed ciałem.',
  },
  {
    id: 'drill-S04', name: 'Martwy ciąg rumuński (RDL)', category: 'Siłownia',
    description: 'Sztanga lub hantle, nogi prawie proste. Schylamy się, prowadząc ciężar wzdłuż nóg do połowy piszczeli. 4 serie × 8 powtórzeń.',
    tips: 'Wzmacnia tylną taśmę mięśniową (uda, pośladki, prostowniki pleców) — kluczowe dla skoku i obrony. Plecy ZAWSZE proste.',
  },
  {
    id: 'drill-S05', name: 'Wiosłowanie z gumą oporową — plecy', category: 'Siłownia',
    description: 'Guma mocowana do słupka lub drzwi. Zawodniczka wiosłuje oburącz lub jednoręcz, cofając łokcie przy ciele. 3 serie × 15 powtórzeń. Przerwa 60 sek.',
    tips: 'Ćwiczy antagonistów mięśni klatki piersiowej — ważne dla zdrowia barku siatkarki. Łopatki "ściągaj" do kręgosłupa przy każdym powtórzeniu.',
  },
  {
    id: 'drill-S06', name: 'Rotacje tułowia z gumą — core rotacyjny', category: 'Siłownia',
    description: 'Guma mocowana z boku na wysokości pasa. Stań bokiem, nogi rozstaw na szerokość bioder. Obróć tułów od gumy (w bok) z gumą w dłoniach. 3 serie × 15 w każdą stronę.',
    tips: 'Imituje ruch ataku i zagrywki. Siła rotacji = siła uderzenia. Ruch z bioder, nie z ramion. Nogi stabilne, ruszaj tułowiem.',
  },
  {
    id: 'drill-S07', name: 'Ćwiczenia na bark z gumą — rotator cuff', category: 'Siłownia',
    description: 'Seria profilaktyczna dla barku: (1) rotacja zewnętrzna z gumą — łokieć przy boku, 15 powtórzeń. (2) Face pull z gumą — wyciągaj do twarzy, 15 powtórzeń. (3) YTLW na macie — 10 powtórzeń każdej litery.',
    tips: 'OBOWIĄZKOWE dla każdej siatkarki. Rotator cuff jest najczęściej kontuzjowaną częścią ciała w siatkówce. Wykonuj co 2-3 treningi.',
  },
  {
    id: 'drill-S08', name: 'Lunges ze sztangą lub hantlami', category: 'Siłownia',
    description: 'Wykroki naprzemienne (walking lunges) z hantlami. 3 serie × 12 kroków na każdą nogę. Wersja zaawansowana: wykroki z rotacją tułowia.',
    tips: 'Kolano przedniej nogi nad stopą — nie wychodź do przodu. Tułów pionowy. Wzmacnia nogi niesymetrycznie (jak w grze).',
  },
  {
    id: 'drill-S09', name: 'Core — plank i warianty', category: 'Siłownia',
    description: 'Kompleks core: (1) Plank przodem 45 sek. (2) Plank bokiem L 30 sek. (3) Plank bokiem P 30 sek. (4) Hollow body hold 30 sek. (5) Superman 30 sek. 3 rundy, przerwa 45 sek. między rundami.',
    tips: 'Core to fundament wszystkich ruchów siatkarskich. Nie opuszczaj bioder w planku — postawa jak deska. Oddychaj normalnie.',
  },
  {
    id: 'drill-S10', name: 'Hip thrust — aktywacja pośladków', category: 'Siłownia',
    description: 'Plecy oparte o ławkę, sztanga na biodrach. Unieś biodra do góry aż uda będą poziomo. 4 serie × 12 powtórzeń. Wersja bez obciążenia: mostek biodrowy na podłodze.',
    tips: 'Pośladki to "motor" skoku. Wiele siatkarek ma słabe pośladki przez nadmierną pracę czworogłowego. Napnij pośladek na górze każdego powtórzenia.',
  },
  {
    id: 'drill-S11', name: 'Podciąganie lub lat pulldown', category: 'Siłownia',
    description: 'Podciąganie na drążku: 3 serie do upadku (lub z gumą pomocniczą). Zamiast: lat pulldown na maszynie 4 serie × 10, ciężar umiarkowany. Wersja z gumą: pullover z gumą stojąc.',
    tips: 'Wzmacnia szerokie mięśnie pleców — decydują o sile uderzenia piłki. Łopatki ściągaj do dołu, nie unoś barków do uszu.',
  },
  {
    id: 'drill-S12', name: 'Plyometria z gumami — skoki z oporem', category: 'Siłownia',
    description: 'Kompleks na hali z gumami: (1) Skoki boczne z gumą wokół ud — 10×. (2) Przysiady z wyskokiem z gumą na barkach — 10×. (3) Sprint 5m z gumą trzymaną przez partnera — 8×. 3 rundy. Przerwa 2 min.',
    tips: 'Gumy plyometryczne zwiększają siłę bez dużego obciążenia stawów. Idealne na obozie gdzie nie ma ciężarów. Zachowaj technikę mimo oporu.',
  },
  {
    id: 'drill-S13', name: 'Ogólnorozwojowe — obwód atletyczny', category: 'Siłownia',
    description: '6 stacji po 40 sek. pracy i 20 sek. przerwy na zmianę: (1) Burpees, (2) Mountain climbers, (3) Skoki na skrzynię, (4) Push-ups z klaśnięciem, (5) Squat jumps, (6) Plank do push-up. 3 rundy. Przerwa 2 min między rundami.',
    tips: 'Wszechstronny obwód wydolnościowy i siłowy. Idealne na obóz bez sprzętu. Intensywność dostosuj do poziomu grupy — nie wszyscy muszą robić to samo.',
  },
];

export const SEED_TEAMS = [
  {
    id: 'team-01',
    name: 'Kadra A',
    players: [
      { id: 'p-a01', name: 'Anna Kowalska',       number: 1  },
      { id: 'p-a02', name: 'Maja Nowak',           number: 2  },
      { id: 'p-a03', name: 'Zuzanna Wiśniewska',  number: 3  },
      { id: 'p-a04', name: 'Karolina Wójcik',     number: 4  },
      { id: 'p-a05', name: 'Natalia Kowalczyk',   number: 5  },
      { id: 'p-a06', name: 'Aleksandra Kamińska', number: 6  },
      { id: 'p-a07', name: 'Weronika Lewandowska',number: 7  },
      { id: 'p-a08', name: 'Paulina Zielińska',   number: 8  },
      { id: 'p-a09', name: 'Monika Szymańska',    number: 9  },
      { id: 'p-a10', name: 'Katarzyna Woźniak',   number: 10 },
      { id: 'p-a11', name: 'Agnieszka Dąbrowska', number: 11 },
      { id: 'p-a12', name: 'Joanna Kozłowska',    number: 12 },
    ],
  },
  {
    id: 'team-02',
    name: 'Kadra B',
    players: [
      { id: 'p-b01', name: 'Zofia Jankowska',      number: 1  },
      { id: 'p-b02', name: 'Marta Wojciechowska',  number: 2  },
      { id: 'p-b03', name: 'Patrycja Kwiatkowska', number: 3  },
      { id: 'p-b04', name: 'Dominika Kaczmarek',   number: 4  },
      { id: 'p-b05', name: 'Ewelina Piotrowska',   number: 5  },
      { id: 'p-b06', name: 'Gabriela Grabowska',   number: 6  },
      { id: 'p-b07', name: 'Sylwia Nowicka',       number: 7  },
      { id: 'p-b08', name: 'Kinga Pawlak',         number: 8  },
      { id: 'p-b09', name: 'Martyna Michalska',    number: 9  },
      { id: 'p-b10', name: 'Julia Adamczyk',       number: 10 },
    ],
  },
];
