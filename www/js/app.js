// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */




// This file contains your event handlers, the center of your application.
// NOTE: see app.initEvents() in init-app.js for event handler initialization code.

//
//MAIN MOBISCOOT URL
//
window.localStorage.setItem('mainUrl',"https://mobiscoot.ch/");

      // use plugins and options as needed, for options, detail see
      // http://i18next.com/docs/
      i18next
      .init({
        debug: 'false',
        lng: window.navigator.userLanguage || window.navigator.language || 'fr',
        fallbackLng: 'en',
        resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
          "en": {
            translation: {
                "Mobiscoot loading": "Mobiscoot loading...",
                'NetworkError':'Loading error occured. Check your network connection.',
                'ConnectingServer':'Connecting Mobiscoot server',
                'OK':'OK',
                'title': ' Rollersharing',
                'login': 'Login',
                'logout': 'Log out',
                'register': "Register",
                'introduction':"Introduction",
                'faq':"FAQ",
                'map':'Map/ rent a Mobiscoot',
                'username':'Username',
                'password':'Password',
                'forgotPassword':"Forgot password?",
                'cancel':"Cancel",
                'badLogin':"Login failed",
                'Done':"Menu",
                'profile':"My profile",
            }
          },
          "de": {
            translation: {
                "Mobiscoot loading": "Mobiscoot laden",
                'NetworkError':'Ladefehler. Überprüfen Sie bitte die Netzwerkverbindung.',
                'ConnectingServer':'Mobiscoot Server Verbindung',
                'OK':'OK',
                'title': ' Rollersharing',
                'login': 'Anmelden',
                'logout': 'Ausloggen',
                'register': "Register",
                'introduction':"Anleitung",
                'faq':"FAQ",
                'map': "Karte/ Servicegebiet",
                'username':'Benutzername',
                'password':'Passwort',
                'forgotPassword':"Passwort vergessen?",
                'cancel':"Löschen",
                'badLogin':"Anmeldung fehlgeschlagen",
                'Done':"Hauptmenü",
                'profile':"Mein Profil",
            }
          },
          "it": {
            translation: {
                "Mobiscoot loading": "Mobiscoot loading...",
                'NetworkError':'Errore durante il caricamento si è verificato. Controllare la connessione di rete.',
                'ConnectingServer':'Collegamento del server Mobiscoot',
                'OK':'OK',
                'title': ' Rollersharing',
                'login': 'Login',
                'logout': 'Disconnettersi',
                'register': "Registratione",
                'introduction':"Introduzione",
                'faq':"FAQ",
                'map':'Mappa/ affittare un Mobiscoot',
                'username':'Username',
                'password':'Password',
                'forgotPassword':"Ha dimenticato la password?",
                'cancel':"Annullare",
                'badLogin':"Accesso fallito",
                'Done':"Menu",
                'profile':"il mio profilo",
            }
          },
            "fr": {
            translation: {
            "Mobiscoot loading": "Mobiscoot loading...",
            'NetworkError':'erreur de chargement s\'est produite. Vérifiez votre connexion réseau.',
            'ConnectingServer':'Connexion du serveur Mobiscoot',
            'OK':'OK',
            'title': ' Rollersharing',
            'login': 'Connexion',
            'logout': 'connexion',
            'register': 'S\'inscrire',
            'introduction':"Introduction",
            'faq':"FAQ",
            'map':'Carte / location de Mobiscoot',
            'username':'Nom d\'utilisateur',
            'password':'Mot de passe',
            'forgotPassword':"Oublié le mot de passe?",
            'cancel':"Annuler",
            'badLogin':"Login failed",
            'Done':"Menu",
            'profile':"Mon profil",
            }
            },
        }
      }, function(err, t) {

            
          // for options see
        // https://github.com/i18next/jquery-i18next#initialize-the-plugin
        jqueryI18next.init(i18next, $);
        // start localizing, details:
        // https://github.com/i18next/jquery-i18next#usage-of-selector-function
        $('.nav').localize();
      });



//
// alert if no connection available
//
/*
function checkConnection() {
    var networkState = navigator.connection.type;

    if( networkState == Connection.NONE){
            navigator.notification.alert(
            i18next.t('Loading error occured. Check your network connection.'), null, i18next.t('ConnectingServer'), 
            i18next.t('OK') );        
    }
};

checkConnection();

*/


    //Login submit button
    function submitIt(){
            var storage = window.localStorage;
            storage.setItem('name', $('#usernameInput').val() );
            storage.setItem('pass', $('#passwordInput').val() );
    }


    //
    //Logout button
    function logout(){
        $('#loginDiv').show();
        $('#regDiv').show();
        $('#introDiv').show();
        $('#faqDiv').show();
        $('#mapLogin').hide();
        $('#mapLogout').show();
        $('#profileDiv').hide();
        $('#logoutDiv').hide();
        $('#nameLabel').text("");
        window.localStorage.removeItem('name');
        window.localStorage.removeItem('pass');
        $('#ajax_loader').show();
        $.ajax({
            url: window.localStorage.getItem('mainUrl') + '/i/',
            type: 'POST',
            data: {
              action: 'logout'
            },
            success: function(data){
              $('#ajax_loader').hide();
            },
            error: function(data){
              $('#ajax_loader').hide();
            }
        });
    }
    //
    // Autologin
    //
    (function(){
        $('#profileDiv').hide();
        $('#logoutDiv').hide();
        if ( window.localStorage.getItem('pass') ){
            //try login with saved data
            $('#ajax_loader').show();
            $('#mapLogin').hide();
            $('#mapLogout').show();
          $.ajax({
            url: window.localStorage.getItem('mainUrl') + '/i/login.php',
            type: 'POST',
            data: {
              username: window.localStorage.getItem('name'),
              password: window.localStorage.getItem('pass'),
              action: 'login'
            },
            success: function(data){
              $('#ajax_loader').hide();
              //HACK - reading web page form whether login was successful
              if (data.indexOf('<input name="action" type="hidden" value="login">') > 0 ){
                  //bad login
                $('#mapLogin').hide();
                $('#mapLogout').show();
                $("#errText").text(i18next.t('badLogin'));
                $("#errModal").modal();
                window.localStorage.removeItem('name');
                window.localStorage.removeItem('pass');
              } else {
                $('#loginDiv').hide();
                $('#regDiv').hide();
                //$('#introDiv').hide();
                $('#mapLogin').show();
                $('#mapLogout').hide();
                //$('#faqDiv').hide();
                $('#nameLabel').text(window.localStorage.getItem('name'));  
                $('#profileDiv').show();
                $('#logoutDiv').show();
              }
            },
            error: function(data){
              $('#ajax_loader').hide();
              $("#errModal").modal();
                $('#loginDiv').show();
                $('#introDiv').show();
                $('#faqDiv').show();
                $('#regDiv').show();
                $('#mapLogin').hide();
                $('#mapLogout').show();
                $('#logoutDiv').hide();
            }
                });


       } else {
           //nothing saved, show login page buttons
            $('#loginDiv').show();
            $('#regDiv').show();
            $('#introDiv').show();
            $('#faqDiv').show();
            $('#mapLogin').hide();
            $('#mapLogout').show();
            $('#logoutDiv').hide();
            $('#nameLabel').text("");
        }
    })();
