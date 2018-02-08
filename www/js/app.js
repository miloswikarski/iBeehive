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
                "iBeehive loading": "iBeehive loading...",
                'NetworkError':'Loading error occured. Check your network connection.',
                'ConnectingServer':'Connecting iBeehive server',
                'OK':'OK',
                'title': ' iBeehive',

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
                "iBeehive loading": "iBeehive nahráva...",
                'NetworkError':'Nastala chyba siete, skontrolujte pripojenie na internet.',
                'ConnectingServer':'Pripája sa na server iBeehive',
                'OK':'OK',
                'title': ' iBeehive',
                'iBeehive radar active...': 'iBeehive radar aktivny...',
                'scanning': 'Skenujem',

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

