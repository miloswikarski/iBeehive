
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

