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
4. Po zainstalowaniu zależności w folderze src wpisujemy komendę "npm start", która odpali nam 4 nasze serwery oraz aplikację frontendową.
5. Aplikacje działają na portach 8002, 8081, 8083, 8084, 8085
6. W przypadku problemów z odpaleniem upewnij się czy powyższe porty są wolne oraz czy wtyczka concurrently jest zainstalowana poprawnie, jeżeli nie zainstaluj "npm i concurrently --global"