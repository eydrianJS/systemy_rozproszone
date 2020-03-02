Po ściągnięciu aplikacji należy skonfigurować projekt:
1. W pliku src dodajemy plik confij.js a w nim export default "http://adres_ip"
adres_ip = nasz adres ip potrzebny do postawienia serwera

2. Należy zainstalować potrzebne paczki:
    a) wchodzimy w console następnie w poszczególnych folderach wykonujemy komendę "npm i":
        -src
        -atm
        -nodeApi
        -transfer

3. Mongo należy postawić lokalnie i dodać do niej 4 bazy o nazwach:
    -Jeden
    -Dwa
    -Trzy
    -Cztery
W każdej bazie należy stworzyć kolekcję o nazwie "users". Po czym nalezy kliknąć prawym przyciskiem myszy na danej kolekcji wybrać "Insert document" i wkleić zawartość odpowiedniego pliku do inserta. Przykładowo plik Jeden.json zawiera użytkowników od 1 do 99. Wchodząc w plik klikamy crtl + a, crtl + c i wklejamy do bazy Jeden do kolekcji users

4. Po zainstalowaniu zależności w folderze src wpisujemy komendę "npm start", która odpali nam 4 nasze serwery oraz aplikację frontendową.
5. Aplikacje działają na portach 8002, 8081, 8083, 8084, 8085

6. W przypadku problemów z odpaleniem upewnij się czy powyższe porty są wolne oraz czy wtyczka concurrently jest zainstalowana poprawnie, jeżeli nie zainstaluj "npm i concurrently --global"

Zasady działania aplikacji:

-Aplikacja działa na 4 bazach danych gdzie pierwsza powinna zawierać użytkowników od 1 - 99, druga 100 - 199, trzecia 200 - 299, czwarta 300 - 399.
-Gdy uzytkownik się loguje trafia do zalogowanych użytkowników poprzez powiązanie id_sessi -> userID z bazy oraz gdy bufor użytkowników jest mniejszy od 10 jego dane z bazy trafiają do bufora.
-Gdy użytkownik wykona jakąś czynność wraz z id_sessi oraz userID event trafia na ostatnią pozycję w kolejce, oraz gdzy user nie znajduję się w bufforze oraz buffor nie jest pełny (w naszym przypadku 10 uzytkowaników) trafia również tam.

-Dwa setInterval:
    Pierwszy interval obsługuje kolejkę z zapytaniami: 
        -Sprawdzenie czy jest miejsce w buforze, lub czy znajdąją się w nim Userzy zostali wysłani już do Bazy danych.
            Jeżeli nie: nic nie robi
            Jeżeli tak:
                ustawia max liczbę requestów które może updatować w naszym przypadku 10,
                zabiera pierwsze 10 requestów z naszej kolejki i wrzuca je do eventow do wykonania (usuwa z głównej kolejki),
                kazdy user który jest w buforze sprawdza czy w 10 requestach jest kolejny request do niego
                    Jeżeli nie: zostaje usunięty z bufora
                    Jeżeli tak: zostaje w buforze
                Requesty są wykonywane w kolejności:
                    1.Sprawdzenie czy mam użytkownika w buforze:
                        Jeżeli tak: wykonuje akcję
                        Jeżeli nie: pobieram uzytkownika do bufora po czym wykonuję akcję
                    2.Po kolei każda akcja sprawdz czy moze byc wykonana
                        Jeżeli tak: update danych w bufforze, wysłanie odpowiedzi do klienta
                        Jeżeli nie: wysłanie odpowiedzi do klienta
                    3.Ustawienie flagi dla usera w buforze, o wymaganych update do bazy przed usunięciem z bufora.

    Interval dwa obsługuje update do odpowiedniej bazy:
        -sprawdza wszystkich userów w buforze czy ktorys potrzebuje update
            Jeżeli tak: updatuje jego dane w bazie i ustawia flage na mozliwy do usunięcia z buffora
            Jeżeli nie: nic się nie dzieje

GDY KOLEJKA JEST PUSTA A W BUFORZE ZNAJDUJĄ SIĘ USERZY KTORZY SA AKTUALNI W BAZIE, ZOSTAJĄ AUTOMATYCZNIE USUNIĘCI.
W MOMENCIE WYLOGOWANIA USER ZOSTAJE USUNIETY Z BUFORA ORAZ Z LISTY UZYTKOWNIKOW ZALOGOWANYCH.