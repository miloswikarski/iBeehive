
'use strict';

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// this is Nordic's UART service
var alyadevice = {
    serviceUUID: '94e2ed81-5c2a-4f18-a414-e5393ab997e5', // data - save, t1, t2, w
    serviceTxRx: '12345d81-5c2a-4f18-a414-e5393ab997e5', // TX, RX, na zapis t= B= ...


    serviceRead: '1e400001-b5a3-f393-e0a9-e50e24dcca9e', // Batt, Firmw, Sw, Manf, Model#

    nettoVahaUUID: '18c0c807-589e-4b89-8ee3-8c1de9a80248',
    tempInUUID: '3511d30e-9911-479e-a7be-43d4220ab1b2',
    tempOutUUID: 'e7e2aec2-5335-49b9-ad90-3aad5eac7eb8',
    savedUUID: '07c28844-d666-4a1c-8eff-8cbfb83aadab',

    //chars
          sr1: '00002a26-0000-1000-8000-00805f9b34fb',
          sr2: '00002a29-0000-1000-8000-00805f9b34fb',
          sr3: '00002a19-0000-1000-8000-00805f9b34fb',
          sr4: '00002a28-0000-1000-8000-00805f9b34fb',
          sr5: '00002a24-0000-1000-8000-00805f9b34fb',

        serviceCasMerania:  '54321d81-5c2a-4f18-a414-e5393ab997e5', // Read Date char

        setMeasureTime1:  'cccd6018-ec89-4efe-9b95-677e6986fe0f',
        setMeasureTime2:  '73e3c7ee-3fab-468d-9a15-babdc773663d',
        setMeasureTime3:  '6fe7d8e6-8e79-4def-9d5d-d7e6cdbeedd3',
        setMeasureTime4:  '0ddf34cb-7875-4333-a276-7cdc05015596',

        serviceDateTime:  '6c648c88-c0d1-4c07-a9e5-03956368e622', // Set Date char

        setDateTime:  '1d1ee309-5e66-46b2-bbfb-c648802f55a8', // na zapis casov


/*
SERVICE UUID 94e2ed81-5c2a-4f18-a414-e5393ab997e5
VAHA 18c0c807-589e-4b89-8ee3-8c1de9a80248
TEPLOTA IN 3511d30e-9911-479e-a7be-43d4220ab1b2
TEPLOTA OUT e7e2aec2-5335-49b9-ad90-3aad5eac7eb8
CAS MERANIA 1 cccd6018-ec89-4efe-9b95-677e6986fe0f
CAS MERANIA 2 73e3c7ee-3fab-468d-9a15-babdc773663d
CAS MERANIA 3 6fe7d8e6-8e79-4def-9d5d-d7e6cdbeedd3
CAS MERANIA 4 0ddf34cb-7875-4333-a276-7cdc05015596
NULOVANIE 7fd6fa82-842f-42cf-a038-c2ae9b69b25f
CITANIE ULOZENYCH DAT 
INDEX CITANIA DAT 18957e29-7ec8-4b34-aebb-e4d57f8af6e8
DATUM CAS 1d1ee309-5e66-46b2-bbfb-c648802f55a8
PIN 82e3533d-37e1-4ed8-9b1a-5500b93f1e74
ID VAHY 37070ec0-19c2-49ee-bbf2-a7c1c00121a5


TX characteristic f18832d8-8639-49da-becf-4d0f956dc727
RX characteristic 08a53bd2-0b16-4ece-b3c2-9d27c79967ae 
*/

    rxCharacteristic: 'f18832d8-8639-49da-becf-4d0f956dc727', // transmit is from the phone's perspective
    txCharacteristic: '08a53bd2-0b16-4ece-b3c2-9d27c79967ae'  // receive is from the phone's perspective
};

var discovered = [];

// scann or not scann
var scanning = false;

var chartInterval = 1111, chart1, chart2;
var chartData = {
    labels: ["1","2","3","4","5","6","7"],
    datasets: [{
      label: "Internal",
      fillColor: "rgba(181,137,0,0.2)",
      strokeColor: "rgba(181,137,22,1)",
      pointColor: "rgba(181,137,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(181,137,11,1)",
      data: [0,0,0,0,0,0,0]
  }, {
      label: "External",
      fillColor: "rgba(151,187,205,0.2)",
      strokeColor: "rgba(151,187,205,1)",
      pointColor: "rgba(151,187,205,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
      data: [0,0,0,0,0,0,0]
  }]
};

var chartWeightData = {
    labels: ["1","2","3","4","5","6","7"],
    datasets: [{
      label: "Weight",
      fillColor: "rgba(15,187,205,0.2)",
      strokeColor: "rgba(15,187,205,1)",
      pointColor: "rgba(15,187,205,1)",
      pointStrokeColor: "#ddd",
      pointHighlightFill: "#ddd",
      pointHighlightStroke: "rgba(15,187,205,1)",
      data: [0,0,0,0,0,0,0]
  }]
};

var chartOptions = {
    animation: false,
        //Boolean - If we want to override with a hard coded scale
        scaleOverride: true,
        //** Required if scaleOverride is true **
        //Number - The number of steps in a hard coded scale
        scaleSteps: 10,
        //Number - The value jump in the hard coded scale
        scaleStepWidth: 10,
        //Number - The scale starting value
        scaleStartValue: 0
    };

    

    function updateDiscoveredCollection ( dev ) {
        if (discovered.indexOf(dev) === -1) {
            discovered.push(dev);
            return true;
        } else if (discovered.indexOf(dev) > -1) {
            return false;
        }
    }

    var app = {

        rescanInterval: 0,    

        refreshDeviceList: function() { /**/
            if( typeof deviceList === 'undefined' ){
                return;
            }

            deviceList.innerHTML = '';
            discovered = [];

            if( Number(beedb.settings.demo) === 1 ){
                demo.initialize({id: "demo1", name: "DEMO DEVICE - not compatible"} );
                demo.initialize({id: "demo2", name: "ALYA DEMO DEVICE"} );
            } else {
                console.log(beedb.settings);
            }

            ble.isConnected( beedb.settings.curId, 
                function() {
                    if( app7.views.main.router.url == '/' ){
                        app7.views.main.router.navigate('/devDetail/');
                    }
                },
                function() {
                    console.log("Peripheral is *not* connected");
                }
                );

            //        if (cordova.platformId === 'android') { // Android filtering is broken
                ble.startScan([], app.onDiscoverDevice, app.onError);
                $("#mainStatus").text(i18next.t("iBeehiveRadarActive"));
            //        } else {
            //            ble.startScan([alyadevice.serviceUUID], app.onDiscoverDevice, app.onError);
            //        }
            },
            repeatScan: function() {
                $("#mainStatus").text(i18next.t("iBeehiveRadarActive"));
                ble.startScan([], app.onDiscoverDevice, app.onError);
            },

            restartScanner: function() { 
                ble.stopScan( function(){
                    $("#mainStatus").text(i18next.t("iBeehiveRadarStopped"));
                    $("#notFoundInfo").show();
                    $("#iFound").hide();
                    app.refreshDeviceList();
                }, app.emptyFunction );
            },

            reScan: function() {
                var options = { dimBackground: true };
                    //SpinnerPlugin.activityStart(i18next.t("Scanning BLE devices"), options);
                    app.restartScanner();
                },

                refreshRssi: function() {
                    discovered.forEach( function( dev) {
                        //console.log(dev);
                        ble.readRSSI(dev, 
                            function( rssi ){
                                var rssiHtml = app.getRssiIcon( rssi );
                                $("#rssi_" + dev.replace(/[^a-zA-Z0-9]/g, "") ).html(rssiHtml);
                                //console.log('rssi read '+rssi );
                            },
                            function( err ){
                                //console.log(err);
            //                    $("#card_" + dev.replace(/[^a-zA-Z0-9]/g, "") ).remove();
              //                  discovered.splice( $.inArray(dev, discovered), 1 );
                //                console.log('rssi deleted ' +dev);
            }
            );
        });
    },

    switchScanner:  function() {
        if( scanning !== false ){
            app.restartScanner();
            scanning = false;
            refreshButton.title = i18next.t("Start scanning...");
        } else {
            app.repeatScan();
            scanning = true;
            refreshButton.title = i18next.t("Stop scanning...");
        }
    },

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);


        clearInterval(app.rescanInterval);
        app.rescanInterval = setInterval(function() {
            console.log('ide rescan');
            //app.refreshRssi();
            app.reScan();
        }, 30000);


    },

    onDeviceReady: function() {
        // Register the event listener
        document.addEventListener("backbutton", app7.methods.onBackKeyDown, false);

        ble.isEnabled(
            function() {
                console.log("Bluetooth is enabled");
            },
            function() {
                ble.enable(app.emptyFunction, function(){
                    app7.dialog.alert(i18next.t("BTnotEnabled"),i18next.t("BLE core"));
                });

            }
        );


        app.refreshDeviceList();
    },


    onDiscoverDevice: function(device) {

        //console.log(JSON.stringify(device));

        if( device.name === undefined ) {
            return false;
        }

        ////SpinnerPlugin.activityStop();

        if ($('#notFoundInfo').css('display') != 'none') {
            $("#notFoundInfo").hide();
            $("#iFound").show();
        };
        


        if( updateDiscoveredCollection( device.id )  ) {

            var listItem = document.createElement('div');
            listItem.className = "row";
            listItem.id = "li_" + device.id.replace(/[^a-zA-Z0-9]/g, "");

            listItem.innerHTML = app.getDeviceListItem( device );
            deviceList.insertBefore(listItem, deviceList.firstChild);

            var el = document.querySelector('#btn_'+device.id.replace(/[^a-zA-Z0-9]/g, ""));
            if( el !== null ){ // only Alya devices has btn
                el.dataset.deviceId = device.id;
                el.dataset.deviceName = device.name;
                console.log('app.connect on ' + el.dataset.deviceId )
                el.addEventListener('touchstart', app.connect, false);

                beedb.saveDevice({
                    _id: "GADGET_" + device.id.toString(),
                    hwid: device.id,
                    hwname: device.name,
                    hwtime: Number(Date.now().toString()),
                });

            }


        } else {
            var listItem = document.getElementById( "li_" + device.id.replace(/[^a-zA-Z0-9]/g, "") );
            listItem.innerHTML = app.getDeviceListItem( device );
            deviceList.insertBefore(listItem, deviceList.firstChild);

        }

    },
/*
    connectInList: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function(peripheral) {
                e.innerHTML = i18next.t("Connected");
            };

        ble.connect(deviceId, onConnect, app.onError);
    }, */

    connect: function(e) {
        //console.log(e);
        //console.log(e.target.dataset.deviceId);
        
        beedb.settings.curW = -999; // vynuluj hodnoty aby ihned ukazal
        beedb.settings.curT1 = -999;
        beedb.settings.curT2 = -999;

        var deviceId = e.target.dataset.deviceId,
        onErrorConnect = function(e) {
                    //linked.hidden = true;
                    console.log('error connect to dev');
                    console.log(e);
                    app7.dialog.alert(i18next.t("DeviceConnectError") + e.errorMessage,i18next.t("BLE core"));

                },
        onConnect = function(peripheral) {

            //                        alert('conn to ' + deviceId + ' .. ' + JSON.stringify(peripheral));
            //console.log(JSON.stringify(peripheral));
                            //unlinked.hidden = true;

                            app.determineWriteType(peripheral);

                            // subscribe for incoming data
            //                ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.rxCharacteristic, app.onData, app.onErrorData);

            $("#tempOutTitle").text("");
            $("#tempOut").text("");
            $("#tempOut").append("<div class=\"loader\"></div>");
            $("#tempInTitle").text("");
            $("#tempIn").text("");
            $("#tempIn").append("<div class=\"loader\"></div>");
            $("#nettoVaha").text("");
            $("#nettoVaha").append("<div class=\"loader\"></div>");


            ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.tempOutUUID, app.onTempOut, app.onErrorTempOut);
            ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.tempInUUID, app.onTempIn, app.onErrorTempIn);
            ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.nettoVahaUUID, app.onNettoVaha, app.onErrorNettoVaha);

            ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.savedUUID, app.onGetSaved, app.onErrorGetSaved);


            $("#resultDiv").text("");
            $("#detailName").text(e.target.dataset.deviceName.slice(5));
            $("#devPageTitle").text(e.target.dataset.deviceName.slice(5));

                //Set date on every connect
                var dataT = stringToBytes((Date.now()-(new Date()).getTimezoneOffset()*60000).toString().slice(0,10));
                ble.write(deviceId,
                    alyadevice.serviceDateTime,
                    alyadevice.setDateTime,
                    dataT, function(event){ console.log(JSON.stringify(event));},
                    function(e){ console.log("err " + JSON.stringify(e));}
                );
                //read actual time1
                ble.read(deviceId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime1,
                function(data){ 
                    var d = bytesToString(data);
                    if (d.length == 5 ) d = "0" + d;
                    beedb.settings.time1 = d.substring(0,2) + ":" + d.substring(2,4) ;
                },
                function(e){
                    console.log("err " + JSON.stringify(e));
                });
                //read actual time2
                ble.read(deviceId, 
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime2,
                function(data){ 
                    var d = bytesToString(data);
                    if (d.length == 5 ) d = "0" + d;
                    beedb.settings.time2 = d.substring(0,2) + ":" + d.substring(2,4) ;
                },
                function(e){
                    console.log("err " + JSON.stringify(e));
                });
                //read actual time3
                ble.read(deviceId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime3,
                function(data){ 
                    var d = bytesToString(data);
                    if (d.length == 5 ) d = "0" + d;
                    beedb.settings.time3 = d.substring(0,2) + ":" + d.substring(2,4) ;
                },
                function(e){
                    console.log("err " + JSON.stringify(e));
                });
                //read actual time4
                ble.read(deviceId,
                    alyadevice.serviceCasMerania,
                    alyadevice.setMeasureTime4,
                function(data){ 
                    var d = bytesToString(data);
                    if (d.length == 5 ) d = "0" + d;
                    beedb.settings.time4 = d.substring(0,2) + ":" + d.substring(2,4) ;
                },
                function(e){
                    console.log("err " + JSON.stringify(e));
                });


            ble.read(deviceId, alyadevice.serviceRead, alyadevice.sr2,
                function(event){
                  var text = bytesToString(event);
                  $("#devinfo").append("<p>Vendor: " + text + "</p>");
                },
                function(e){ console.log("err " + JSON.stringify(e));}
                );
            ble.read(deviceId, alyadevice.serviceRead, alyadevice.sr3,
                function(event){
                  var text = bytesToString(event);
                  $("#devinfo").append("<p>Battery: " + text + "</p>");
                },
                function(e){ console.log("err " + JSON.stringify(e));}
                );
            ble.read(deviceId, alyadevice.serviceRead, alyadevice.sr1,
                function(event){
                  var text = bytesToString(event);
                  $("#devinfo").append("<p>FW: " + text + "</p>");
                },
                function(e){ console.log("err " + JSON.stringify(e));}
                );
            ble.read(deviceId, alyadevice.serviceRead, alyadevice.sr4,
                function(event){
                  var text = bytesToString(event);
                  $("#devinfo").append("<p>SW: " + text + "</p>");
                },
                function(e){ console.log("err " + JSON.stringify(e));}
                );
            ble.read(deviceId, alyadevice.serviceRead, alyadevice.sr5,
                function(event){
                  var text = bytesToString(event);
                  $("#devinfo").append("<p>Model: " + text + "</p>");
                },
                function(e){ console.log("err " + JSON.stringify(e));}
                );


                console.log("done");

    };

ble.connect(deviceId, onConnect, onErrorConnect);
beedb.settings.curId = deviceId;

if( Number(beedb.settings.graphs) === 1 ){
    $("#tempChart").show();
    $("#weightChart").show();
    app.chartInit();
} else {
    $("#tempChart").hide();
    $("#weightChart").hide();
};

},
determineWriteType: function(peripheral) {
        //Alya rewrited:
        app.writeWithoutResponse = true;
        
        // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
        // Newer Bluefruit devices use Write Request for the TX characteristic
        /*
        var characteristic = peripheral.characteristics.filter(function(element) {
            if (element.characteristic.toLowerCase() === alyadevice.txCharacteristic) {
                return element;
            }
        })[0];

        if (characteristic.properties.indexOf('WriteWithoutResponse') > -1) {
            app.writeWithoutResponse = true;
        } else {
            app.writeWithoutResponse = false;
        }
        */

    },
    /*
    onData: function(data) { // data received from Arduino
        console.log(data);
        var resarray = bytesToString(data).split(';');
        resarray.forEach(function(resVal){
            var resPar = resVal.split('=');
            if( resPar.length > 1 && resPar[0] == 'K'){
                $("#tempOut").text(i18next.t("External temperature") + ": " + resPar[1]);
            } else 
            if( resPar.length > 1 && resPar[0] == 'J'){
                $("#tempIn").text(i18next.t("Internal temperature") + ": " + resPar[1]);
            } else 
            if( resPar.length > 1 && resPar[0] == 'E'){
                $("#nettoVaha").text(i18next.t("Weight") + ": " + resPar[1]);
            }

        });
        $("#mainStatus").text(i18next.t("Received") + ": " + bytesToString(data));
    },
    */
    onTempOut: function(data) { // data received from Arduino
        if( beedb.settings.curT1 === bytesToString(data) ){
            return false;
        }
        $("#tempOutTitle").text(i18next.t("External temperature"));
        $("#tempOut").text(bytesToString(data)).append("<sup>°C</sup>");
        if( Number(beedb.settings.graphs == 1) ){
            $("#tempChart").show();
            app.setChart(chartData.datasets[1].data,bytesToString(data));
        } else {
            $("#tempChart").hide();
        }
        beedb.settings.curT1 = bytesToString(data);
    },
    onTempIn: function(data) { // data received from Arduino
        if( beedb.settings.curT2 === bytesToString(data) ){
            return false;
        }
        $("#tempInTitle").text(i18next.t("Internal temperature") );
        $("#tempIn").text(bytesToString(data)).append("<sup>°C</sup>");
        if( Number(beedb.settings.graphs) === 1 ){
            $("#tempChart").show();
            app.setChart(chartData.datasets[0].data,bytesToString(data));
        } else {
            $("#tempChart").hide();
        }
        beedb.settings.curT2 = bytesToString(data);
    },
    onNettoVaha: function(data) { // data received from Arduino
        if( beedb.settings.curW === parseFloat(bytesToString(data)) ){
            return false;
        }
        //$("#nettoVahaTitle").text(i18next.t("Weight") );
        $("#nettoVaha").text(bytesToString(data)).append("<small> kg</small>");
        if( Number(beedb.settings.graphs) === 1 ){
            $("#weightChart").show();
            app.setWeightChart(chartWeightData.datasets[0].data,bytesToString(data));
        } else {
            $("#weightChart").hide();
        }
        beedb.settings.curW = parseFloat(bytesToString(data))|| 0.0;
        var perc = beedb.settings.curW / ( ( beedb.settings.maxweight - beedb.settings.minweight )/150 )
        if( typeof weightProgress !== "undefined") {
            weightProgress.setAttribute("style","width: " + perc + "%")
            weightProgress.innerHTML = perc.toFixed(0).toString() + ' % max';
        }
    },

    onGetSaved: function(data) {
        var allInfo = bytesToString(data);

        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds HERE PLUS
        var hDate = (new Date( (new Date(Number(allInfo.substring(0,10))*1000)).getTime() + tzoffset)).getTime();

        var o = {
            _id: beedb.settings.curId.toString() + '_' + allInfo.substring(0,10),
            hwid: beedb.settings.curId,
            hwtime: hDate,
            temp1: Number(allInfo.substring(14,17))/10,
            temp2: Number(allInfo.substring(17,20))/10,
            weight: Number(allInfo.substring(10,14))/10
        };

//        console.log(allInfo,o.hwid,o.hwtime,o.temp1,o.temp2,o.weight);

        beedb.saveHistory(o);

    },
    writeData: function(stringData) { // send data to Arduino

        var data = stringToBytes(stringData);

        var success = function() {

            //read after write, the same char
            ble.read(beedb.settings.curId, alyadevice.serviceTxRx, alyadevice.rxCharacteristic,

                function(event){ 
                    var text = bytesToString(event);
                    app7.dialog.alert(i18next.t("Data sent") + " " + text,i18next.t("BLE core"));

                },
                function(e){
                    console.log("err " + JSON.stringify(e));
                });
        };

        var failure = function(e) {
            app7.dialog.alert(i18next.t("Failed writing data"),i18next.t("BLE core"));
            console.log("err " + JSON.stringify(e));
        };

        console.log('.....');
        console.log(data);

        ble.write(
            beedb.settings.curId,
            alyadevice.serviceTxRx,
            alyadevice.txCharacteristic,
            data, success, failure
            );

    },


    sendData: function(event) { // send data to Arduino

        var data = stringToBytes(messageInput.value);
        var deviceId = event.target.dataset.deviceId;

        var success = function() {

            //read after write, the same char
            ble.read(deviceId, alyadevice.serviceUUID, alyadevice.txCharacteristic,

                function(event){ alert("read " + JSON.stringify(event));},
                function(e){
                    console.log("err " + JSON.stringify(e));
                });

            $("#mainStatus").text(i18next.t("Sent") + ": " + messageInput.value );

            //resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            //resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            navigator.notification.alert(
                i18next.t("Failed writing data"),
                function(){},
                i18next.t('BLE core'),
                i18next.t('OK')
                );
        };



        //if (app.writeWithoutResponse) {
    /*        ble.writeWithoutResponse(
                deviceId,
                alyadevice.serviceUUID,
                alyadevice.txCharacteristic,
                data, success, failure
                );
            
        } else {
         */   ble.write(
                deviceId,
                alyadevice.serviceUUID,
                alyadevice.txCharacteristic,
                data, success, failure
            );
        //}
        

    },


    disconnect: function(event) {
        //SpinnerPlugin.activityStart(i18next.t("Scanning BLE devices"), {});
        var deviceId = event.target.dataset.deviceId;

        if( !deviceId ) {
            app.showMainPage();
        } else {
            ble.disconnect(deviceId, app.showMainPage, app.onError);
        }
    },
    disconnectById: function(id) {
        ble.disconnect(id, app.showMainPage, app.onError);
    },
    disconnectByGlobalId: function() {

        ble.stopNotification(beedb.settings.curId, alyadevice.serviceUUID, alyadevice.tempOutUUID, app.emptyFunction, app.emptyFunction);
        ble.stopNotification(beedb.settings.curId, alyadevice.serviceUUID, alyadevice.tempInUUID, app.emptyFunction, app.emptyFunction);
        ble.stopNotification(beedb.settings.curId, alyadevice.serviceUUID, alyadevice.nettoVahaUUID, app.onNettoVaha, app.emptyFunction);

        ble.stopNotification(beedb.settings.curId, alyadevice.serviceUUID, alyadevice.savedUUID, app.emptyFunction, app.emptyFunction);


        ble.disconnect(beedb.settings.curId, app.showMainPage, app.onError);
    },
    emptyFunction: function(){

    },

    showMainPage: function() {
        //mainPage.hidden = false;
        app.reScan();
        //detailPage.hidden = true;
        //SpinnerPlugin.activityStop();
    },
    onError: function(reason) {
        //SpinnerPlugin.activityStop();
        navigator.notification.alert(
            reason.errorMessage,
            function(){},
            i18next.t("Error occured"),
            i18next.t('OK')
            );

    },
    onErrorTempIn: function(reason) {
        navigator.notification.alert(
            reason.errorMessage,
            function(){},
            i18next.t("Internal temperature reading error"),
            i18next.t('OK')
            );
    },
    onErrorTempOut: function(reason) {
        navigator.notification.alert(
            reason.errorMessage,
            function(){},
            i18next.t("External temperature reading error"),
            i18next.t('OK')
            );
    },
    onErrorNettoVaha: function(reason) {
        navigator.notification.alert(
            reason.errorMessage,
            function(){},
            i18next.t("Weight reading error"),
            i18next.t('OK')
            );
    },
    onErrorData: function(reason) {
        navigator.notification.alert(
            i18next.t("Service UUID ERROR: ") + reason,
            function(){},
            i18next.t('BLE core'),
            i18next.t('OK')
            );
    },

    onErrorGetSaved: function(reason) {
        console.log(reason);
        /*
        navigator.notification.alert(
                i18next.t("Service UUID ERROR: ") + reason,
                function(){},
                i18next.t('BLE core'),
                i18next.t('OK')
            );
            */
        },

        getRssiIcon: function( rssiValue ) {
            var rssi = Number(rssiValue);
            var sigHtml = '<span class="fa-stack fa-lg">\
            <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
            <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.0em; margin-left:0.5em;"></i>\
            </span>';
            if( rssi < -85 ){
                sigHtml = '<span class="fa-stack fa-lg">\
                <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.2em; margin-left:0.5em;"></i>\
                </span>';
            } else if( rssi < -70 ){
                sigHtml = '<span class="fa-stack fa-lg">\
                <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.4em; margin-left:0.5em;"></i>\
                </span>';
            } else if( rssi < -55 ){
                sigHtml = '<span class="fa-stack fa-lg">\
                <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.6em; margin-left:0.5em;"></i>\
                </span>';
            } else if( rssi < -85 ){
                sigHtml = '<span class="fa-stack fa-lg">\
                <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.8em; margin-left:0.5em;"></i>\
                </span>';
            } else if( rssi < 0 ){
                sigHtml = '<span class="fa-stack fa-lg">\
                <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:1.0em; margin-left:0.5em;"></i>\
                </span>';
            } 

            return sigHtml;
        },

        getDeviceListItem: function( device ) {
            var sigHtml = app.getRssiIcon( device.rssi );
            var urlDetail = "devDetail";
            if( device.id.substring(0,4) == "demo"){
                urlDetail = "demoDetail";
            }
            if( device.name.substring(0,5) == "ALYA " ){
                var html = '\
                <div class="col-lg-12" id="card_' + device.id.replace(/[^a-zA-Z0-9]/g, "") + '">\
                <div class="card text-white bg-primary mb-3">\
                <div class="card-header d-flex w-100 justify-content-between">\
                <span id="rssi_' + device.id.replace(/[^a-zA-Z0-9]/g, "") + '">'
                + sigHtml + '</span>\
                <span class="fa-stack fa-lg float-right col-sm-1">\
                <i class="fa fa-unlink text-danger"></i>\
                </span>\
                </div>\
                <div class="card-body d-flex w-100 justify-content-between">\
                <h2 class="card-title center">' + device.name.slice(5) + '</h2>\
                <a href="/' + urlDetail + '/">\
                <button id="btn_' + device.id.replace(/[^a-zA-Z0-9]/g, "") +
                '" class="btn btn-secondary my-2 my-sm-0">\
                <i class="fa fa-link"></i> ' + i18next.t('Connect') + 
                '</button>\
                </a>\
                </div>\
                <div class="card-footer text-white" >' + i18next.t("iBeehiveBleDevice") + '</div>\
                </div>\
                </div>';

            } else {
                var html = '\
                <div class="col-lg-12" id="card_' + device.id.replace(/[^a-zA-Z0-9]/g, "") + '">\
                <div class="card text-white bg-secondary mb-3">\
                <div class="card-header d-flex w-100 justify-content-between">\
                <span id="rssi_' + device.id.replace(/[^a-zA-Z0-9]/g, "") + '">'
                + sigHtml + '</span>\
                <span class="fa-stack fa-lg float-right col-sm-1">\
                <i class="fa fa-unlink text-danger"></i>\
                </span>\
                </div>\
                <div class="card-body d-flex w-100 justify-content-between">\
                <h2 class="card-title center">' + device.name + '</h2>\
                </div>\
                <div class="card-footer text-white" >' + i18next.t("notiBeehiveBleDevice") + '</div>\
                </div>\
                </div>';

            }

            return html;

        },

        chartInit: function(){
            var tLineChart = new Chart($("#tempChart"), {
                type: 'line',
                data: chartData,
                options: chartOptions
            });
            var wLineChart = new Chart($("#weightChart"), {
                type: 'line',
                data: chartWeightData,
                options: chartOptions
            });

        },

        setChart: function(dataSet, dataValue) {
            dataSet.push(dataValue);
            dataSet.shift();
            chartInterval += 1;
            if( chartInterval > 11 ) {
               chartInterval = 0;
               chart1 = new Chart($("#tempChart"), {
                   type: 'line',
                   data: chartData,
                   options: chartOptions
               });
           }

       },

       setWeightChart: function(dataSet, dataValue) {
        dataSet.push(dataValue);
        dataSet.shift();
        if( chartInterval == 10 || chartInterval == 9 || chartInterval == 8 || chartInterval == 7 ) {
           chartInterval = 11;
           chart2 = new Chart($("#weightChart"), {
               type: 'line',
               data: chartWeightData,
               options: chartOptions
           });
       }
   },


};
