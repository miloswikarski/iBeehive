var onInitFn = {

  devDetail: function() {
    deviceId = (typeof deviceId !== 'undefined') ?  deviceId : beedb.settings.curId.toString();
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

  deleteOneDb: function(id,rev,d) {
    $("#title").append("<h4>"+d+"</h4>");
    $("#delBtn").click(function(){
      if( pdb.remove(id,rev) ){
        app7.views.main.router.back();
        setTimeout(function(){app7.views.main.router.back();},500);
      //app7.views.main.router.back('/mydevices/',{ignoreCache:true, force:true});
        app7.dialog.alert(i18next.t("deleted"),i18next.t("deleteRecord"));
      } else {
        app7.dialog.alert(i18next.t("Error occured."),i18next.t("deleteRecord"));
      }
    });
  },

  deleteOneAllDb: function(d) {
    $("#title").append("<h4>ALL DEVICE "+d+" DATA</h4>");
    $("#delBtn").click(function(){

          devId = (typeof d !== 'undefined') ?  d : beedb.settings.curId.toString();
          console.log('deleting devId ', devId );
          app.writeData( "I=" );
          var options = {limit : 10, include_docs: true,
             startkey: devId + '_' + "\ufff0",
             endkey: devId + '_',
             descending: true
              };
            pdb.allDocs(options, function (err, response) {
              if (response && response.rows.length > 0) {
                response.rows.forEach(function(o) {
                  pdb.remove(o.doc._id, o.doc._rev);
                });
                app7.views.main.router.back();
                setTimeout(function(){app7.views.main.router.back();},500);
//                app7.dialog.alert(i18next.t("deleted"),i18next.t("devicedeleted"));

              } else {
                console.log(response);
                app7.views.main.router.back();
                setTimeout(function(){app7.views.main.router.back();},500);
                  app7.dialog.alert(i18next.t("Error occured."),i18next.t("deleteRecord"));

              }
          });

    });
  },


  myDevices: function() {
   var options = {limit : 256, include_docs: true,
   startkey: 'GADGET_' + "\ufff0",
   endkey: 'GADGET_',
   descending: true };
   var hDate;
   var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
   pdb.allDocs(options).then( function (response) {
    if (response && response.rows.length > 0) {
      response.rows.forEach(function(o) {
        hDate = (new Date( (new Date(o.doc.hwtime)).getTime() - tzoffset)).toISOString().slice(0, -8).replace("T", " ") || "";

        $("#gadgetList").append('\
                <li class="link list-group-item">\
                <a href="/history/?devId=' + o.doc.hwid + '">' + hDate + 
                '&nbsp;<i class="fa fa-microchip"></i>&nbsp;<span>' + o.doc.hwname.slice(5) + '</span>\
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
      $("#version").append("<p><span data-i18n=\"version\">V</span>: <b>" + version + "</b></p>");//<p>Cloud DB: <b>" + window.localStorage.getItem('beehavedb') + "</b></p>");
    });
  },
  aboutDevice: function() {
    // davam priamo do menu
  },

  devset: function(devId) {
    devId = (typeof devId !== 'undefined') ?  devId : beedb.settings.curId.toString();

    $("#setDateTime").click( function(){
                //var dataT = stringToBytes(Date.now().toString().slice(0,10));
                var dataT = stringToBytes((Date.now()-(new Date()).getTimezoneOffset()*60000).toString().slice(0,10));
                ble.write(devId,
                    alyadevice.serviceDateTime,
                    alyadevice.setDateTime,
                    dataT,
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
    });

    $("#setTare").click( function(){
      app.writeData( "t=" );
    });

    $("#setTare0").click( function(){
      app.writeData( "T=0" );
    });

    $("#setName").click( function() {
      app.writeData( "B=" + $("#setNameVal").val().trim().slice(0,255) );
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
    picker1.setValue([beedb.settings.time1.slice(0,2),':',beedb.settings.time1.slice(3,5)]);
    pickerParams.inputEl = '#pickerTime2';
    var picker2 = app7.picker.create(pickerParams);
    picker2.setValue([beedb.settings.time2.slice(0,2),':',beedb.settings.time2.slice(3,5)]);
    pickerParams.inputEl = '#pickerTime3';
    var picker3 = app7.picker.create(pickerParams);
    picker3.setValue([beedb.settings.time3.slice(0,2),':',beedb.settings.time3.slice(3,5)]);
    pickerParams.inputEl = '#pickerTime4';
    var picker4 = app7.picker.create(pickerParams);
    picker4.setValue([beedb.settings.time4.slice(0,2),':',beedb.settings.time4.slice(3,5)]);
    //1
    if( beedb.settings.time1 !== "" ) {
      jQuery('#switch-time1').attr("checked", "checked"); 
      jQuery('#pickerTime1').val(beedb.settings.time1);
    }
    jQuery('#pickerTime1').on('focusout', function () {
      beedb.settings.time1 = picker1.getValue().toString().replace(/,/g,'');
      window.localStorage.setItem('settingsTime1', beedb.settings.time1);
      ble.write(devId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime1,
                    stringToBytes(beedb.settings.time1.replace(/:/,'') + '00'),
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
      $("#switch-time1").attr("checked", true);
    });
    jQuery('#switch-time1').on('change', function () {
      if( document.querySelector('#switch-time1').checked ){
        beedb.settings.time1 = picker1.getValue().toString().replace(/,/g,'');
      } else {
        beedb.settings.time1 = "";
      }
      var saveString = stringToBytes(beedb.settings.time1.replace(/:/,'') + '00');
      if (beedb.settings.time1 == "") saveString = stringToBytes('-1');
      ble.write(devId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime1,
                    saveString,
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
      window.localStorage.setItem('settingsTime1', beedb.settings.time1);
    });
    //2
    if( beedb.settings.time2 !== "" ) {
      jQuery('#switch-time2').attr("checked", "checked"); 
      jQuery('#pickerTime2').val(beedb.settings.time2);
    }
    jQuery('#pickerTime2').on('focusout', function () {
      beedb.settings.time2 = picker2.getValue().toString().replace(/,/g,'');
      window.localStorage.setItem('settingsTime2', beedb.settings.time2);
      ble.write(devId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime2,
                    stringToBytes(beedb.settings.time2.replace(/:/,'') + '00'),
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
      $("#switch-time2").attr("checked", true);
    });
    jQuery('#switch-time2').on('change', function () {
      if( document.querySelector('#switch-time2').checked ){
        beedb.settings.time2 = picker2.getValue().toString().replace(/,/g,'');
      } else {
        beedb.settings.time2 = "";
      }
      var saveString = stringToBytes(beedb.settings.time2.replace(/:/,'') + '00');
      if (beedb.settings.time2 == "") saveString = stringToBytes('-1');
      ble.write(devId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime2,
                    saveString,
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
      window.localStorage.setItem('settingsTime2', beedb.settings.time2);
    });
    //3
    if( beedb.settings.time3 !== "" ) {
      jQuery('#switch-time3').attr("checked", "checked"); 
      jQuery('#pickerTime3').val(beedb.settings.time3);
    }
    jQuery('#pickerTime3').on('focusout', function () {
      beedb.settings.time3 = picker3.getValue().toString().replace(/,/g,'');
      window.localStorage.setItem('settingsTime3', beedb.settings.time3);
      ble.write(devId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime3,
                    stringToBytes(beedb.settings.time3.replace(/:/,'') + '00'),
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
      $("#switch-time3").attr("checked", true);
    });
    jQuery('#switch-time3').on('change', function () {
      if( document.querySelector('#switch-time3').checked ){
        beedb.settings.time3 = picker3.getValue().toString().replace(/,/g,'');
      } else {
        beedb.settings.time3 = "";
      }
      var saveString = stringToBytes(beedb.settings.time3.replace(/:/,'') + '00');
      if (beedb.settings.time3 == "") saveString = stringToBytes('-1');
      ble.write(devId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime3,
                    saveString,
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
      window.localStorage.setItem('settingsTime3', beedb.settings.time3);
    });
    //4
    if( beedb.settings.time4 !== "" ) {
      jQuery('#switch-time4').attr("checked", "checked"); 
      jQuery('#pickerTime4').val(beedb.settings.time4);
    }
    jQuery('#pickerTime4').on('focusout', function () {
      beedb.settings.time4 = picker4.getValue().toString().replace(/,/g,'');
      window.localStorage.setItem('settingsTime4', beedb.settings.time4);
      ble.write(devId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime4,
                    stringToBytes(beedb.settings.time4.replace(/:/,'') + '00'),
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
      $("#switch-time4").attr("checked", true);
    });
    jQuery('#switch-time4').on('change', function () {
      if( document.querySelector('#switch-time4').checked ){
        beedb.settings.time4 = picker4.getValue().toString().replace(/,/g,'');
      } else {
        beedb.settings.time4 = "";
      }
      var saveString = stringToBytes(beedb.settings.time4.replace(/:/,'') + '00');
      if (beedb.settings.time4 == "") saveString = stringToBytes('-1');
      ble.write(devId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime4,
                    saveString,
                    function(event){ app7.dialog.alert(i18next.t("OK"),i18next.t("configureDevice"));},
                    function(e){ app7.dialog.alert(i18next.t("Error occured") + " " + JSON.stringify(e),i18next.t("configureDevice"));}
                );
      window.localStorage.setItem('settingsTime4', beedb.settings.time4);
    });

    /*
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
      app.writeData( "2=" + beedb.settings.time2.replace(/:/,'') + '00' );
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
      app.writeData( "3=" + beedb.settings.time3.replace(/:/,'') + '00' );
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
    */

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
    on: {
      pageInit: function (e, page) {
        if( app7.isDetail ){
          app.disconnectByGlobalId();
          app7.isDetail = false;
        }
      }
    }
  },
  // About page
  {
    path: '/about/',
    url: './pages/about.html',
    name: 'about',
    on: {
      pageInit: function (e, page) {
        onInitFn.about();
          app7.isDetail = false;
      },
    }
  },
  // About Device page
  {
    path: '/aboutDevice/',
    url: './pages/aboutDevice.html',
    name: 'aboutDevice',
    on: {
      pageInit: function (e, page) {
        onInitFn.aboutDevice();
          app7.isDetail = false;
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
          app7.isDetail = true;
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
          app7.isDetail = false;
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
          app7.isDetail = false;
      },
    }
  },

  // Config of one device
  {
    path: '/devset/',
    templateUrl: './pages/devset.html',
    on: {
      pageInit: function (e, page) {
          app7.isDetail = false;
        if( page.route.query.devId ){
          onInitFn.devset(page.route.query.devId);
        } else {
          onInitFn.devset();
        }
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
          app7.isDetail = false;
        if( page.route.query.devId ){
          onInitFn.historyDb(page.route.query.devId);
        } else {
          onInitFn.historyDb();
        }
      },
    }
  },


  // mazanie zaznamu
  {
    path: '/delete/',
    templateUrl: './pages/delete.html',
    on: {
      pageInit: function (e, page) {
        console.log(page);
          app7.isDetail = false;
          if( page.route.query.devid ){
            onInitFn.deleteOneAllDb(page.route.query.devid);
          } else {
            onInitFn.deleteOneDb(page.route.query.id, page.route.query.rev, page.route.query.d);
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
          app7.isDetail = false;
      },
    }
  },



  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
  ];
