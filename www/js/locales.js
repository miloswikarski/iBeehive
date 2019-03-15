      // use plugins and options as needed, for options, detail see
      // http://i18next.com/docs/
      i18next
      .init({
        debug: 'false',
        lng: window.navigator.userLanguage || window.navigator.language || 'en',
        fallbackLng: 'en',
        resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
          "en": {
            translation: {
                "BLE core": "Bluetooth core",
                "iBeehive loading": "iBeehive loading...",
                "NetworkError":"Loading error occured. Check your network connection.",
                "ConnectingServer":"Connecting iBeehive server",
                "OK":"OK",
                "title": " iBeehive",
                "iBeehiveRadarActive": "iBeehive radar active...",
                "iBeehiveRadarStopped": "iBeehive radar stopped.",
                "Error occured":"Error occured.",
                "Error occured.":"Error occured.",
                "scanning": "scanning",
                "Weight": "Weight",
                "Received": "Received",
                "Internal temperature": "Internal temperature",
                "External temperature": "External temperature",
                "Sent": "Sent",
                "Failed writing data": "Failed writing data",
                "actual values": "Actual values",
                "Scanning BLE devices":"Scanning BLE devices",
                "T1 reading error":"T1 reading error",
                "T1":"T1",
                "T2":"T2",
                "T2 reading error":"T2 reading error",
                "Weight reading error":"Weight reading error",
                "iBeehiveIntro":"iBeehive app is searching for all smart bluetooth devices around you. If you are near iBeehive device, you will be able to connect to this device and see actual and historical data.",
                "bleFound":"Bluetooth device(s) found!",
                "disconnect":"Disconnect",
                "save":"Save",
                "history":"History",
                "historytitle":"History",
                "Connect":"Connect",
                "iBeehiveBleDevice":"iBeehive bluetooth smart device",
                "notiBeehiveBleDevice":"This device is not iBeehive compatible",
                "historyValues":"History values",
                "historyData":"History of measurement",
                "close":"Close",
                "actualValues":"Actual values",
                "aboutTitle":"About iBeehive",
                "aboutText":"iBeehive is application used for smart bee weight products by Alya Ltd. You can find more on web page ",
                "settings":"Settings",
                "rescan":"Rescan...",
                "aboutIbeehive":"About iBeehive",
                "date":"Date",
                "weight":"Weight",
                "valuesSaved":"Actual values saved",
                "back":"Back",
                "BTnotEnabled":"Bluetooth is not enabled! Devices not connected.",
                "DeviceConnectError":"Device connection failed. Please go back and try again. Error message: ",
                "Data sent":"Data sent",
                "NEW":"NEW",
                "Erase DB":"Erase Database",
                "AllDataDeleted":"All history data from the app are deleted",
                "devsettings":"Device settings",
                "synchroDateTitle":"Date and time sync with iBeehive",
                "devPageTitle":"Device",
                "configureDevice":"Device configuration",
                "configure": "Configure",
                "about": "About",
                "deviceMenu":"Device menu",
                "MyDevices":"My devices",
                "mydevicestitle":"All devices I connected",
                "AdvancedSettings":"Advanced settings",
                "Erase history":"Erase history database from this application",
                "Erase device history":"Erase history database from this device",
                "eraseDb":"DESTROY DATABASE",
                "aboutDevice":"About this device",
                "devinfoTitle":"Device specifications",
                "deleteRecord":"Delete record",
                "reallyDelete":"Do you want to delete this record?",
                "deleted":"Record deleted",
                "devicedeleted":"Device history deleted",
                "delete":"DELETE",
                "delete all":"DELETE ALL",
                "Set device name":"Set device name",
                "setTareTitle":"Tare your weight",
                "setTareBody":"Set device weight sensor for zero value now",
                "setTare":"Set tare",
                "setUnTareTitle":"Untare your weight",
                "setUnTareBody":"Unset device weight sensor",
                "setUnTare":"Delete tare",
                "synchroDateBody":"Set device date and time with actual value from your phone or tablet",
                "setTime":"Set date and time",
                "setTimeBtn":"SET DATE TIME",
                "setNameBtn":"SET NAME",
                "set":"SET",
                "AutoSaveTime":"Automatic save values every day at:",
                "namePlaceholder":"Set device name",
            }
        },
        "de": {
            translation: {
                "iBeehive loading": "iBeehive laden",
                "NetworkError":"Ladefehler. Überprüfen Sie bitte die Netzwerkverbindung.",
                "ConnectingServer":"iBeehive Server Verbindung",
                "OK":"OK",
                "title": " iBeehive",

            }
        },
        "pl": {
            translation: {
                "BLE core":"Bluetooth",
                "iBeehive loading":"Przesyłanie iBeehive...",
                "NetworkError":"Wystąpił błąd sieci sprawdź połączenie internetowe",
                "ConnectingServer":"Łączy się z iBeehive",
                "OK":"OK",
                "title":"iBeehive",
                "iBeehiveRadarActive":"Aktywny radar iBeehive...",
                "iBeehiveRadarStopped":"Radar iBeehive zatrzymał się...",
                "Error occured":"Wystąpił błąd",
                "Error occured.":"Wystąpił błąd",
                "scanning":"Skanowanie",
                "Weight":"masa",
                "Received":"odbiór",
                "Internal temperature":"Temperatura wewnętrzna",
                "External temperature":"Temperatura zewnętrzna",
                "Sent":"wysłany",
                "Failed writing data":"Zapisywanie danych nie powiodło się",
                "actual values":"Aktualne wartości",
                "Scanning BLE devices":"Wyszukiwanie urządzeń BLE",
                "T1 reading error":"Błąd odczytu temperatury T1",
                "T2 reading error":"Błąd odczytu temperatury T2",
                "T1":"T1",
                "T2":"T2",
                "Weight reading error":"Błąd odczytu wagi",
                "iBeehiveIntro":"IBeehive wyszukuje wszystkie inteligentne urządzenia Bluetooth dookoła. Jeśli jesteś blisko iBeehive będziesz mógł się z nim połączyć i monitorować bieżące i przeszłe wartości czujnika.",
                "bleFound":"Te urządzenia Bluetooth zostały znalezione",
                "disconnect":"odłączyć",
                "save":"uratować",
                "history":"historia",
                "historytitle":"Historia pomiarów",
                "Connect":"połączyć",
                "iBeehiveBleDevice":"Inteligentne urządzenie bluetooth iBeehive",
                "notiBeehiveBleDevice":"To urządzenie nie jest kompatybilne z iBeehive",
                "historyValues":"Historia danych",
                "historyData":"Historia pomiarów",
                "close":"blisko",
                "actualValues":"Aktualne wartości",
                "aboutTitle":"O iBeehive",
                "aboutText":"iBeehive to aplikacja BLE dla Alya Ltd. Dowiedz się więcej na stronie internetowej firmy",
                "settings":"ustawienia",
                "rescan":"Odśwież wyszukiwanie...",
                "aboutIbeehive":"O iBeehive",
                "date":"data",
                "weight":"masa",
                "valuesSaved":"Bieżące wartości przechowywane w bazie danych",
                "back":"wstecz",
                "Show demo devices":"Pokaż urządzenia demonstracyjne",
                "Show current graphs":"Pokaż wykresy bieżących wartości",
                "Set minimal beehive weight":"Minimalna waga ula dla wykresu",
                "Set maximal beehive weight":"Maksymalna waga gałęzi dla wykresu",
                "configure":"konfiguracja",
                "about":"O aplikacji",
                "thanksTitle":"Dziękujemy za korzystanie z iBeehive!",
                "Are you sure you want to exit?":"Czy na pewno chcesz zamknąć aplikację?",
                "BTnotEnabled":"Bluetooth nie jest włączony. Urządzenia nie są podłączone.",
                "DeviceConnectError":"Urządzenie nie jest podłączone. Naciśnij Wróć i spróbuj ponownie. Komunikat o błędzie:",
                "Data sent":"Dane wysłane",
                "NEW":"NOWOŚĆ",
                "Erase DB":"Usuń bazę danych",
                "AllDataDeleted":"Wszystkie dane pomiarowe są usuwane z tej aplikacji.",
                "devsettings":"Ustawienia urządzenia",
                "synchroDateTitle":"Synchronizacja daty i godziny z iBeehive",
                "devPageTitle":"sprzęt",
                "configureDevice":"Konfiguracja urządzenia",
                "deviceMenu":"Menu urządzenia",
                "MyDevices":"Moje urządzenia",
                "mydevicestitle":"Wszystkie kiedykolwiek podłączone urządzenia",
                "AdvancedSettings":"Ustawienia zaawansowane",
                "Erase history":"Wyczyść dane historii z aplikacji",
                "Erase device history":"Wyczyść dane historii urządzenia",
                "eraseDb":"Usuń bazę danych",
                "aboutDevice":"O urządzeniu",
                "devinfoTitle":"Specyfikacja techniczna sprzętu",
                "deleteRecord":"Usuń wpis",
                "reallyDelete":"Czy naprawdę usuwasz rekord z lokalnej bazy danych?",
                "deleted":"Rekord usunięty",
                "devicedeleted":"Historia urządzenia została usunięta",
                "delete":"CLEAR",
                "delete all":"USUŃ WSZYSTKIE",
                "Set device name":"Nowa nazwa urządzenia",
                "setTareTitle":"Waga tary",
                "setTareBody":"Ustawianie zera czujnika",
                "setTare":"Ustaw tarę",
                "setUnTareTitle":"Anuluj tarowanie",
                "setUnTareBody":"Wyzeruj czujnik wagi",
                "setUnTare":"Anuluj tarowanie",
                "synchroDateBody":"Ustaw datę i godzinę telefonicznie wartość tabletu",
                "setTime":"Ustaw datę i godzinę",
                "setTimeBtn":"SET Data / Czas",
                "setNameBtn":"USTAW NAZWĘ",
                "set":"SET",
                "AutoSaveTime":"Automatycznie zapisuj wartości codziennie:",
                "namePlaceholder":"Nowa nazwa",
                        }
        },
        "cs": {
            translation: {
                "BLE core": "Bluetooth",
                "iBeehive loading": "iBeehive se připájí...",
                "NetworkError":"Chyba sítě, skontrolujte připojení na internet.",
                "ConnectingServer":"Připájí sa na server iBeehive",
                "OK":"OK",
                "title": " iBeehive",
                "iBeehiveRadarActive": "iBeehive radar aktivní...",
                "Internal temperature":"vnitřní teplota",
                "External temperature":"venkovní teplota",
                "Sent":"Poslané",
                "Failed writing data":"Zápis dat selhal",
                "actual values":"aktuální hodnoty",
                "Scanning BLE devices":"Vyhledávám BLE zařízení",
                "T1 reading error":"Chyba při čtení teploty T1",
                "T2 reading error":"Chyba při čtení teploty T2",
                "T1":"T1",
                "T2":"T2",
                "Weight reading error":"Chyba při čtení hmotnosti",
                "iBeehiveIntro":"Aplikace iBeehive vyhledává všechny bluetooth smart zařízení na okolí. Pokud jste v blízkosti iBeehive, budete se moci na něj napojit a sledovat aktuální a minulé hodnoty senzorů.",
                "bleFound":"Byly nalezeny tyto bluetooth zařízení",
                "disconnect":"Odpojit",
                "save":"Uložit",
                "history":"Historie",
                "historytitle":"Historie měření",
                "Connect":"Připojit",
                "iBeehiveBleDevice":"iBeehive bluetooth smart zařízení",
                "notiBeehiveBleDevice":"Toto zařízení není kompatibilní s iBeehive",
                "historyValues":"Historie údajů",
                "historyData":"Historie měření",
                "close":"Zavřít",
                "actualValues":"aktuální hodnoty",
                "aboutTitle":"O aplikaci iBeehive",
                "aboutText":"iBeehive je aplikace pro BLE zařízení firmy Alya Ltd. Více najdete na stránkách firmy",
                "settings":"Nastavení",
                "rescan":"Obnovit vyhledávání ...",
                "aboutIbeehive":"O aplikaci iBeehive",
                "date":"Datum",
                "weight":"Hmotnost",
                "valuesSaved":"Aktuální hodnoty uložené v databázi",
                "back":"Zpět",
                "Show demo devices":"Zobrazovat demo zařízení",
                "Show current graphs":" Zobrazovat grafy aktuálních hodnot",
                "Set minimal beehive weight":" Minimální hmotnost úlu pro graf",
                "Set maximal beehive weight":"Maximální hmotnost úlu pro graf",
                "configure":"Konfigurace",
                "about":"O aplikaci",
                "thanksTitle":"Děkujeme",
                "Are you sure you want to exit?":"Skutečně chcete ukončit aplikaci?",
                "BTnotEnabled":"Bluetooth není zapnutý. Zařízení nejsou připojeny.",
                "DeviceConnectError":"Zařízení nepřipojeno. Prosím stiskněte Zpět a opakujte. Chybová zpráva:",
                "Data sent":"údaje zaslané",
                "NEW":"NOVÉ",
                "Erase DB":"Smazat databázi",
                "AllDataDeleted":"Veškeré údaje o měřeních jsou z této aplikace vymazány.",
                "devsettings":"nastavení zařízení",
                "synchroDateTitle":"Synchronizace data a času s iBeehive",
                "devPageTitle":"zařízení",
                "configureDevice":"Konfigurace zařízení",
                "deviceMenu":"menu zařízení",
                "MyDevices":"Moje zařízení",
                "mydevicestitle":"Všechna někdy připojená zařízení",
                "AdvancedSettings":"Rozšířené nastavení",
                "Erase history":"Vymazat data historie z aplikace",
                "Erase device history":"Vymazat data historie zařízení",
                "eraseDb":"SMAZAT DATABÁZI",
                "aboutDevice":"O zařízení",
                "devinfoTitle":"Technické specifikace zařízení",
                "deleteRecord":"Smazat záznam",
                "reallyDelete":"Skutečně smazat záznam z lokální databáze?",
                "deleted":"Záznam byl smazán",
                "devicedeleted":"Historie zařízení smazána",
                "delete":"SMAZAT",
                "delete all":"SMAZAT VŠE",
                "Set device name":"Nové jméno zařízení",
                "setTareTitle":"tára váhy",
                "setTareBody":"Nastavení nulové hodnoty senzoru",
                "setTare":"Nastavit Taru",
                "setUnTareTitle":"Zrušit Taru váhy",
                "setUnTareBody":"Zrušit nastavení senzoru váhy",
                "setUnTare":"Zrušit Taru",
                "synchroDateBody":"Nastavit datum a čas podle hodnoty v telefonu",
                "setTime":"Nastavení data a času",
                "setTimeBtn":"NASTAVIT Datum / čas",
                "setNameBtn":"NASTAVIT NÁZEV",
                "set":"NASTAVIT",
                "AutoSaveTime":"Automatické zapisování hodnot denně o:",
                "namePlaceholder":"Nové jméno",
            }
        },
        "sk": {
            translation: {
                "BLE core": "Bluetooth",
                "iBeehive loading": "iBeehive nahráva...",
                "NetworkError":"Nastala chyba siete, skontrolujte pripojenie na internet.",
                "ConnectingServer":"Pripája sa na server iBeehive",
                "OK":"OK",
                "title": " iBeehive",
                "iBeehiveRadarActive": "iBeehive radar aktívny...",
                "iBeehiveRadarStopped": "iBeehive radar zastavený...",
                "Error occured":"Nastala chyba",
                "Error occured.":"Nastala chyba",
                "scanning": "Skenujem",
                "Weight": "Hmotnosť",
                "Received": "Príjem",
                "Internal temperature": "Vnútorná teplota",
                "External temperature": "Vonkajšia teplota",
                "Sent": "Poslané",
                "Failed writing data": "Zápis dát zlyhal",
                "actual values": "Aktuálne hodnoty",
                "Scanning BLE devices":"Vyhľadávam BLE zariadenia",
                "T1 reading error":"Chyba pri čítaní teploty T1",
                "T2 reading error":"Chyba pri čítaní teploty T2",
                "T1":"T1",
                "T2":"T2",
                "Weight reading error":"Chyba pri čítaní hmotnosti",
                "iBeehiveIntro":"Aplikácia iBeehive vyhľadáva všetky bluetooth smart zariadenia na okolí. Ak ste v blízkosti zariadenia iBeehive, budete sa môcť na neho napojiť a sledovať aktuálne a minulé hodnoty senzorov.",
                "bleFound":"Boli nájdené tieto bluetooth zariadenia",
                "disconnect":"Odpojiť",
                "save":"Uložiť",
                "history":"História",
                "historytitle":"História meraní",
                "Connect":"Pripojiť",
                "iBeehiveBleDevice":"iBeehive bluetooth smart zariadenie",
                "notiBeehiveBleDevice":"Toto zariadenie nie je kompatibilné s iBeehive",
                "historyValues":"História údajov",
                "historyData":"História meraní",
                "close":"Zatvoriť",
                "actualValues":"Aktuálne hodnoty",
                "aboutTitle":"O aplikácii iBeehive",
                "aboutText":"iBeehive je aplikácia pre BLE zariadenia firmy Alya Ltd. Viac nájdete na stránkach firmy ",
                "settings":"Nastavenia",
                "rescan":"Obnoviť vyhľadávanie...",
                "aboutIbeehive":"O aplikácii iBeehive",
                "date":"Dátum",
                "weight":"Hmotnosť",
                "valuesSaved":"Aktuálne hodnoty uložené v databáze",
                "back":"Naspäť",
                "Show demo devices": "Zobrazovať demo zariadenia",
                "Show current graphs": "Zobrazovať grafy aktuálnych hodnôt",
                "Set minimal beehive weight": "Minimálna hmotnosť úľa pre graf",
                "Set maximal beehive weight": "Maximálna hmotnosť úľa pre graf",
                "configure": "Konfigurácia",
                "about": "O aplikácii",
                "thanksTitle": "Ďakujeme, že používate produkt iBeehive!",
                "Are you sure you want to exit?": "Skutočne chcete ukončiť aplikáciu?",
                "BTnotEnabled":"Bluetooth nie je zapnutý. Zariadenia nie sú pripojené.",
                "DeviceConnectError":"Zariadenie nepripojené. Prosím stlačte Naspäť a skúste znova. Chybová správa: ",
                "Data sent":"Údaje zaslané",
                "NEW":"NOVÉ",
                "Erase DB":"Zmazať databázu",
                "AllDataDeleted":"Všetky údaje o meraniach sú z tejto aplikácie vymazané.",
                "devsettings":"Nastavenia zariadenia",
                "synchroDateTitle":"Synchronizácia dátumu a času s iBeehive",
                "devPageTitle":"Zariadenie",
                "configureDevice":"Konfigurácia zariadenia",
                "deviceMenu":"Menu zariadenia",
                "MyDevices":"Moje zariadenia",
                "mydevicestitle":"Všetky niekedy pripojené zariadenia",
                "AdvancedSettings":"Rozšírené nastavenia",
                "Erase history":"Vymazať dáta histórie z aplikácie",
                "Erase device history":"Vymazať dáta histórie zariadenia",
                "eraseDb":"VYMAZAŤ DATABÁZU",
                "aboutDevice":"O zariadení",
                "devinfoTitle":"Technické špecifikácie zariadenia",
                "deleteRecord":"Zmazať záznam",
                "reallyDelete":"Skutočne zmazať záznam z lokálnej databázy?",
                "deleted":"Záznam bol zmazaný",
                "devicedeleted":"História zariadenia zmazaná",
                "delete":"ZMAZAŤ",
                "delete all":"ZMAZAŤ VŠETKO",
                "Set device name":"Nové meno zariadenia",
                "setTareTitle":"Tára váhy",
                "setTareBody":"Nastavenie nulovej hodnoty senzora",
                "setTare":"Nastaviť táru",
                "setUnTareTitle":"Zrušiť táru váhy",
                "setUnTareBody":"Zrušiť nastavenie senzora váhy",
                "setUnTare":"Zrušiť táru",
                "synchroDateBody":"Nastaviť dátum a čas podľa hodnoty v telefóne, tablete",
                "setTime":"Nastavenie dátumu a času",
                "setTimeBtn":"NASTAVIŤ Dátum/čas",
                "setNameBtn":"NASTAVIŤ NÁZOV",
                "set":"NASTAVIŤ",
                "AutoSaveTime":"Automatické zapisovanie hodnôt denne o:",
                "namePlaceholder":"Nové meno",
            }
        },
    }
}, function(err, t) {

        // for options see
        // https://github.com/i18next/jquery-i18next#initialize-the-plugin
        jqueryI18next.init(i18next, $);
        // start localizing, details:
        // https://github.com/i18next/jquery-i18next#usage-of-selector-function
        $('body').localize();
    });

