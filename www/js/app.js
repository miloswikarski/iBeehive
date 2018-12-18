
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

    shareFn: function () {
        devId = (typeof devId !== 'undefined') ?  devId : beedb.settings.curId.toString();
        var options = {limit : 365, include_docs: true,
           startkey: devId + '_' + "\ufff0",
           endkey: devId + '_',
           descending: true };
        pdb.allDocs(options, function (err, response) {
          if (response && response.rows.length > 0) {
            var hDate;
            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var alldata = "";
            response.rows.sort(function(a, b){
              return a.doc.hwtime == b.doc.hwtime ? 0 : +(a.doc.hwtime < b.doc.hwtime) || -1;
            }).forEach(function(o) {
               const d = new Date(o.doc.hwtime);
               const t = Math.floor(o.doc.hwtime/1000);
               const hDate = (new Date( (new Date(o.doc.hwtime)).getTime() - tzoffset)).toISOString().slice(0, -8).replace("T", " ") || "";
               alldata = alldata + hDate + ";" + o.doc.weight.toString() + ";" + o.doc.temp1.toString()  + ";" + o.doc.temp2.toString() + ";\n"; 
               
             });
             console.log(alldata);
          navigator.share(beedb.settings.curId.toString() + "\n" + 
           "Date;Weight;Temp1;Temp2;\n" 
           + alldata
            ,"Share","plain/csv");


           };

         });


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


//open www url
$$('.external').on('click', function (e) {
    var url = $$(this).attr("href");
    window.open(url, "_system");
});


// Init/Create main view
var mainView = app7.views.create('.view-main', {
  url: '/'
});




