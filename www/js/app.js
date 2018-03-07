//
// MAIN iBeehive URL
//

window.localStorage.setItem('mainUrl',"https://iBeehive.grapph.com/");

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
                "BLE core": "BLE core",
                "iBeehive loading": "iBeehive loading...",
                "NetworkError":"Loading error occured. Check your network connection.",
                "ConnectingServer":"Connecting iBeehive server",
                "OK":"OK",
                "title": " iBeehive",
                "iBeehive radar active...": "iBeehive radar active...",
                "iBeehive radar stopped.": "iBeehive radar stopped.",
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
                "Internal temperature reading error":"Internal temperature reading error",
                "External temperature reading error":"External temperature reading error",
                "Weight reading error":"Weight reading error",
                "iBeehiveIntro":"iBeehive app is searching for all smart bluetooth devices around you. If you are near iBeehive device, you will be able to connect to this device and see actual and historical data.",
                "bleFound":"Bluetooth device(s) found!",
                "disconnect":"Disconnect",
                "save":"Save",
                "history":"History",
                "Connect":"Connect",
                "iBeehiveBleDevice":"iBeehive bluetooth smart device",
                "notiBeehiveBleDevice":"This device is not iBeehive compatible",
                "historyValues":"History values",
                "close":"Close",
                "actualValues":"Actual values",
                "aboutTitle":"About iBeehive",
                "aboutText":"iBeehive is application used for smart bee weight products by Alya Ltd. You can find more on web page ",
                "settings":"Settings",
                "rescan":"Rescan...",
                "aboutIbeehive":"About iBeehive",
                "date":"Date",
                "weight":"Weight",
                "valuesSaved":"Actual values saved"



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
        "cz": {
            translation: {
                "iBeehive loading": "iBeehive se připájí...",
                "NetworkError":"Chyba sítě, skontrolujte připojení na internet.",
                "ConnectingServer":"Připájí se na server iBeehive",
                "OK":"OK",
                "title": " iBeehive",
                "iBeehive radar active...": "iBeehive radar aktivni...",
                "scanning": "Vyhledává se",

            }
        },
        "sk": {
            translation: {
                "BLE core": "BLE systém",
                "iBeehive loading": "iBeehive nahráva...",
                "NetworkError":"Nastala chyba siete, skontrolujte pripojenie na internet.",
                "ConnectingServer":"Pripája sa na server iBeehive",
                "OK":"OK",
                "title": " iBeehive",
                "iBeehive radar active...": "iBeehive radar aktívny...",
                "iBeehive radar stopped.": "iBeehive radar zastavený...",
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
                "Internal temperature reading error":"Chyba pri čítaní vnútornej teploty",
                "External temperature reading error":"Chyba pri čítaní vonkajšej teploty",
                "Weight reading error":"Chyba pri čítaní hmotnosti",
                "iBeehiveIntro":"Aplikácia iBeehive vyhľadáva všetky bluetooth smart zariadenia na okolí. Ak ste v blízkosti zariadenia iBeehive, budete sa môcť na neho napojiť a sledovať aktuálne a minulé hodnoty senzorov.",
                "bleFound":"Boli nájdené tieto bluetooth zariadenia",
                "disconnect":"Odpojiť",
                "save":"Uložiť",
                "history":"História",
                "Connect":"Pripojiť",
                "iBeehiveBleDevice":"iBeehive bluetooth smart zariadenie",
                "notiBeehiveBleDevice":"Toto zariadenie nie je kompatibilné s iBeehive",
                "historyValues":"História údajov",
                "close":"Zatvoriť",
                "actualValues":"Aktuálne hodnoty",
                "aboutTitle":"O aplikácii iBeehive",
                "aboutText":"iBeehive je aplikácia pre BLE zariadenia firmy Alya Ltd. Viac nájdete na stránkach firmy ",
                "settings":"Nastavenia",
                "rescan":"Obnoviť vyhľadávanie...",
                "aboutIbeehive":"O aplikácii iBeehive",
                "date":"Dátum",
                "weight":"Hmotnosť",
                "valuesSaved":"Aktuálne hodnoty uložené v databáze"



            }
        },
    }
}, function(err, t) {

        // for options see
        // https://github.com/i18next/jquery-i18next#initialize-the-plugin
        jqueryI18next.init(i18next, $);
        // start localizing, details:
        // https://github.com/i18next/jquery-i18next#usage-of-selector-function
        $('.container').localize();
    });

