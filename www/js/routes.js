var onInitFn = {

  devDetail: function() {
    $("#disconnectButton").click(app.disconnectByGlobalId);
    $("#goBack").click(app.disconnectByGlobalId);
    $("#saveButton").click(beedb.savedata);
  },
  demoDetail: function() {
    $("#disconnectButton").click(function(){
      app7.views.main.router.navigate('/');
    });
    $("#goBack").click(function(){
      app7.views.main.router.navigate('/');
    });
    $("#saveButton").click(beedb.savedata);
    console.log('ide demo');
    demo.connect();
  },

  historyDb: function() {
    beedb.readAll();
  },

  myDevices: function() {
          beedb.settings.allDevices.forEach(function(o) {
              console.log(o);
          });
  },

  about: function() {
    cordova.getAppVersion.getVersionNumber().then(function (version) {
      $("#version").append("<p>Version: " + version + "</p>");
    });
  },

  devset: function() {
    $("#setDateTime").click( function(){
      app.writeData( "X=" + Date.now().toString().slice(0,10) );
    });

    $("#setTare").click( function(){
      app.writeData( "t=" );
    });

    $("#setName").click( function() {
      app.writeData( "b=" + $("#setNameVal").val().trim().slice(0,255) )
    });

  },

  config: function() {

    $("#eraseDb").click(beedb.eraseDb);


    if( Number(beedb.settings.demo) === 1 ) {
      jQuery('#switch-demo').attr("checked", "checked"); 
    }
    jQuery('#switch-demo').on('change', function () {
      if( document.querySelector('#switch-demo').checked ){
        beedb.settings.demo = 1;
      } else {
        beedb.settings.demo = 0;
      }
      window.localStorage.setItem('settingsDemo', Number(beedb.settings.demo));
    });

    if( Number(beedb.settings.graphs) === 1 ) {
      jQuery('#switch-graph').attr("checked", "checked"); 
    }
    jQuery('#switch-graph').on('change', function () {
      if( document.querySelector('#switch-graph').checked ){
        beedb.settings.graphs = 1;
      } else {
        beedb.settings.graphs = 0;
      }
      window.localStorage.setItem('settingsGraphs', Number(beedb.settings.graphs));
    });

    for( var i=0; i<100; i++){
      var j = "";
      if( Number(beedb.settings.minweight) === i ) {
        j = "selected";
      }
      jQuery('#minwSelect').append('<option value="' + i + '" ' + j + '>' + i + '</option>' );
    }

    jQuery('#minwSelect').on('change', function () {
      beedb.settings.minweight = Number(jQuery('#minwSelect').val());
      window.localStorage.setItem('settingsMinweight', beedb.settings.minweight);
    });


    for( var i=5; i<300; i++){
      var j = "";
      if( Number(beedb.settings.maxweight) === i ) {
        j = "selected";
      }
      jQuery('#maxwSelect').append('<option class="bg-orange" value="' + i + '" ' + j + '>' + i + '</option>' );
    }

    jQuery('#maxwSelect').on('change', function () {
      beedb.settings.maxweight = Number(jQuery('#maxwSelect').val());
      window.localStorage.setItem('settingsMaxweight', beedb.settings.maxweight);
    });


  }

}



var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  // About page
  {
    path: '/about/',
    url: './pages/about.html',
    name: 'about',
    on: {
      pageInit: function (e, page) {
        onInitFn.about();
      },
    }
  },
  // Detail
  {
    path: '/devDetail/',
    url: './pages/devDetail.html',
    name: 'iBeehive',
    on: {
      pageInit: function (e, page) {
        onInitFn.devDetail();
      },
    }
  },
  // Detail
  {
    path: '/demoDetail/',
    url: './pages/demoDetail.html',
    name: 'iBeehive',
    on: {
      pageInit: function (e, page) {
        onInitFn.demoDetail();
      },
    }
  },
  // Config
  {
    path: '/config/',
    templateUrl: './pages/config.html',
    on: {
      pageInit: function (e, page) {
        onInitFn.config();
      },
    }
  },

  // Config of one device
  {
    path: '/devset/',
    templateUrl: './pages/devset.html',
    on: {
      pageInit: function (e, page) {
        onInitFn.devset();
      },
    }
  },

  // tabulka history
  {
    path: '/history/',
    templateUrl: './pages/history.html',
    on: {
      pageInit: function (e, page) {
        onInitFn.historyDb();
      },
    }
  },


  // tabulka zariadeni
  {
    path: '/mydevices/',
    templateUrl: './pages/mydevices.html',
    on: {
      pageInit: function (e, page) {
        onInitFn.myDevices();
      },
    }
  },



  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
  ];
