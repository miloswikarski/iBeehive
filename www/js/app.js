
// Dom7
var $$ = Dom7;

// Theme
var theme = 'auto';

// Init App
var app7 = new Framework7({
  id: 'sk.alya.ibeehive',
  root: '#app',
  theme: theme,
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  methods: {
    helloWorld: function () {
      app7.dialog.alert('Hello World!');
    },
    onBackKeyDown: function() { // Handle the Android back button
        var leftp = app7.panel.left && app7.panel.left.opened;
        var rightp = app7.panel.right && app7.panel.right.opened;
        if ( leftp || rightp ) {
            app7.panel.close();
            return false;
        } else if ($$('.modal-in').length > 0) {
            app7.dialog.close();
            return false;
        } else if (app7.views.main.router.url == '/') {
            app7.dialog.confirm(i18next.t('Are you sure you want to exit?'), "iBeehive", function() {
                navigator.app.exitApp();
            },
            function() {
            });
        } else {
            mainView.router.back();
        }

    },
  },
  routes: routes,
  on: {
    pageInit: function (page) {
        console.log(page);
        jQuery('.page').localize();
    }
  }
});


// Init/Create main view
var mainView = app7.views.create('.view-main', {
  url: '/'
});




