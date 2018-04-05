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
    demo.connect();
  },

  historyDb: function(devId) {
    beedb.readAll(devId);
  },

  myDevices: function() {
   var options = {limit : 256, include_docs: true,
   startkey: 'GADGET_' + "\ufff0",
   endkey: 'GADGET_',
   descending: true };
   pdb.allDocs(options).then( function (response) {
    if (response && response.rows.length > 0) {
      response.rows.forEach(function(o) {
        hDate = new Date(o.doc.hwtime).toISOString().slice(0,16) || "...";
        $("#gadgetList").append('\
                <li class="link list-group-item">\
                <a href="/history/?devId=' + o.doc.hwid + '">' + hDate + 
                '&nbsp;<i class="fa fa-microchip"></i>&nbsp;<span>' + o.doc.hwname + '</span>\
                </a>\
      </li>');
        });
      }
      }).catch( function(err){
        console.log(err);
          });
  },

  about: function() {
    cordova.getAppVersion.getVersionNumber().then(function (version) {
      $("#version").append("<p>Version: " + version + "</p><p>Cloud DB: <b>" + window.localStorage.getItem('beehavedb') + "</b></p>");
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
      app.writeData( "B=" + $("#setNameVal").val().trim().slice(0,255) )
    });
    var pickerParams = {
      inputEl: '#pickerTime1',
      rotateEffect: true,
      cols: [
      {
        textAlign: 'center',
        values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23').split(' ')
      },
    // Divider
    {
      values: [':']
    },
        // Minutes
        {
          textAlign: 'center',
          values: (function () {
            var arr = [];
            for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
              return arr;
          })(),
        }
        ]
      };

    var picker1 = app7.picker.create(pickerParams);
    pickerParams.inputEl = '#pickerTime2';
    var picker2 = app7.picker.create(pickerParams);
    pickerParams.inputEl = '#pickerTime3';
    var picker3 = app7.picker.create(pickerParams);
    pickerParams.inputEl = '#pickerTime4';
    var picker4 = app7.picker.create(pickerParams);
    //1
    if( beedb.settings.time1 !== "" ) {
      jQuery('#switch-time1').attr("checked", "checked"); 
      jQuery('#pickerTime1').val(beedb.settings.time1);
    }
    jQuery('#switch-time1').on('change', function () {
      if( document.querySelector('#switch-time1').checked ){
        beedb.settings.time1 = picker1.getValue().toString().replace(/,/g,'');
      } else {
        beedb.settings.time1 = "";
      }
      window.localStorage.setItem('settingsTime1', beedb.settings.time1);
      console.log("1=" + beedb.settings.time1.replace(/:/,'') + '00');
      console.log("//TO DO: NULOVANIE AKO? TERAZ TAK, ze PRAZDNY time1");
      app.writeData( "1=" + beedb.settings.time1.replace(/:/,'') + '00' );
      //TO DO: NULOVANIE AKO? TERAZ TAK, ze PRAZDNY time1
    });
    //2
    if( beedb.settings.time2 !== "" ) {
      jQuery('#switch-time2').attr("checked", "checked"); 
      jQuery('#pickerTime2').val(beedb.settings.time2);
    }
    jQuery('#switch-time2').on('change', function () {
      if(jQuery('#pickerTime2').val() === ""){
        jQuery('#switch-time2').prop("checked", false );
        return false;
      }
      if( document.querySelector('#switch-time2').checked ){
        beedb.settings.time2 = picker2.getValue().toString().replace(/,/g,'');
      } else {
        beedb.settings.time2 = "";
      }
      window.localStorage.setItem('settingsTime2', beedb.settings.time2);
      app.writeData( "2=" + beedb.settings.time1.replace(/:/,'') + '00' );
    });
    //3
    if( beedb.settings.time3 !== "" ) {
      jQuery('#switch-time3').attr("checked", "checked"); 
      jQuery('#pickerTime3').val(beedb.settings.time3);
    }
    jQuery('#switch-time3').on('change', function () {
      if( document.querySelector('#switch-time3').checked ){
        beedb.settings.time3 = picker3.getValue().toString().replace(/,/g,'');
      } else {
        beedb.settings.time3 = "";
      }
      window.localStorage.setItem('settingsTime3', beedb.settings.time3);
      app.writeData( "3=" + beedb.settings.time1.replace(/:/,'') + '00' );
    });
    //4
    if( beedb.settings.time4 !== "" ) {
      jQuery('#switch-time4').attr("checked", "checked"); 
      jQuery('#pickerTime4').val(beedb.settings.time4);
    }
    jQuery('#switch-time4').on('change', function () {
      if( document.querySelector('#switch-time4').checked ){
        beedb.settings.time4 = picker4.getValue().toString().replace(/,/g,'');
      } else {
        beedb.settings.time4 = "";
      }
      window.localStorage.setItem('settingsTime4', beedb.settings.time4);
      app.writeData( "4=" + beedb.settings.time4.replace(/:/,'') + '00' );
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
        console.log(page);
        if( page.route.query.devId ){
          onInitFn.historyDb(page.route.query.devId);
        } else {
        onInitFn.historyDb();
        }
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
