//
// MAIN iBeehive URL
//

window.localStorage.setItem('mainUrl',"https://iBeehive.grapph.com/");

      // use plugins and options as needed, for options, detail see
      // http://i18next.com/docs/
      i18next
      .init({
        debug: 'false',
        lng: window.navigator.userLanguage || window.navigator.language || 'cz',
        fallbackLng: 'en',
        resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
          "en": {
            translation: {
                "BLE core": "BLE core",
                "iBeehive loading": "iBeehive loading...",
                'NetworkError':'Loading error occured. Check your network connection.',
                'ConnectingServer':'Connecting iBeehive server',
                'OK':'OK',
                'title': ' iBeehive',
                'iBeehive radar active...': 'iBeehive radar active...',
                'scanning': 'scanning',
                'Weight': 'Weight',
                'Received': 'Received',
                'Internal temperature': 'Internal temperature',
                'External temperature': 'External temperature',
                'Sent': 'Sent',
                'Failed writing data': 'Failed writing data',
                'actual values': 'Actual values',
                "Scanning BLE devices":"Scanning BLE devices",
                "Internal temperature reading error":"Internal temperature reading error",
                "External temperature reading error":"External temperature reading error",
                "Weight reading error":"Weight reading error"

            }
        },
        "de": {
            translation: {
                "iBeehive loading": "iBeehive laden",
                'NetworkError':'Ladefehler. Überprüfen Sie bitte die Netzwerkverbindung.',
                'ConnectingServer':'iBeehive Server Verbindung',
                'OK':'OK',
                'title': ' iBeehive',

            }
        },
        "cz": {
            translation: {
                "iBeehive loading": "iBeehive se připájí...",
                'NetworkError':'Chyba sítě, skontrolujte připojení na internet.',
                'ConnectingServer':'Připájí se na server iBeehive',
                'OK':'OK',
                'title': ' iBeehive',
                'iBeehive radar active...': 'iBeehive radar aktivni...',
                'scanning': 'Vyhledává se',

            }
        },
        "sk": {
            translation: {
                "BLE core": "BLE systém",
                "iBeehive loading": "iBeehive nahráva...",
                'NetworkError':'Nastala chyba siete, skontrolujte pripojenie na internet.',
                'ConnectingServer':'Pripája sa na server iBeehive',
                'OK':'OK',
                'title': ' iBeehive',
                'iBeehive radar active...': 'iBeehive radar aktivny...',
                'scanning': 'Skenujem',
                'Weight': 'Hmotnosť',
                'Received': 'Príjem',
                'Internal temperature': 'Vnútorná teplota',
                'External temperature': 'Vonkajšia teplota',
                'Sent': 'Poslané',
                'Failed writing data': 'Zápis dát zlyhal',
                'actual values': 'Aktuálne hodnoty',
                "Scanning BLE devices":"Vyhľadávam BLE zariadenia",
                "Internal temperature reading error":"Chyba pri čítaní vnútornej teploty",
                "External temperature reading error":"Chyba pri čítaní vonkajšej teploty",
                "Weight reading error":"Chyba pri čítaní hmotnosti"

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

