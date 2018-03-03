// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton */
/* global detailPage, resultDiv, messageInput, sendButton, disconnectButton */
/* global ble  */
/* jshint browser: true , devel: true*/
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
    serviceUUID: '94e2ed81-5c2a-4f18-a414-e5393ab997e5',

    nettoVahaUUID: '18c0c807-589e-4b89-8ee3-8c1de9a80248',
    tempInUUID: '3511d30e-9911-479e-a7be-43d4220ab1b2',
    tempOutUUID: 'e7e2aec2-5335-49b9-ad90-3aad5eac7eb8',

//    rxCharacteristic: 'f18832d8-8639-49da-becf-4d0f956dc727', // transmit is from the phone's perspective
    txCharacteristic: '08a53bd2-0b16-4ece-b3c2-9d27c79967ae'  // receive is from the phone's perspective
};

var discovered = [];

// scann or not scann
var scanning = false;

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

    refreshDeviceList: function() {
        deviceList.innerHTML = '';
        discovered = [];
//        if (cordova.platformId === 'android') { // Android filtering is broken
        ble.startScan([], app.onDiscoverDevice, app.onError);
        $("#mainStatus").text(i18next.t('iBeehive radar active...'));
//        } else {
//            ble.startScan([alyadevice.serviceUUID], app.onDiscoverDevice, app.onError);
//        }
    },
    repeatScan: function() {
        $("#mainStatus").text(i18next.t('iBeehive radar active...'));
        ble.startScan([], app.onDiscoverDevice, app.onError);
    },
    
    restartScanner: function() { 
        ble.stopScan( function(){
                    $("#mainStatus").text(i18next.t('iBeehive radar stopped.'));
                    $("#notFoundInfo").show();
                    disconnectButton.click();
                    app.refreshDeviceList();
        }, function(){
                    //SpinnerPlugin.activityStop();
                    $("#mainStatus").text(i18next.t('Error occured.'));
        } );
    },

    reScan: function() {
        var options = { dimBackground: true };
        //SpinnerPlugin.activityStart(i18next.t("Scanning BLE devices"), options);
        app.showMainPage();
        app.restartScanner();
    },

    refreshRssi: function() {
        discovered.forEach( function( dev) {
            console.log(dev);
            ble.readRSSI(dev, 
                function( rssi ){
                    var rssiHtml = app.getRssiIcon( rssi );
                    $("#rssi_" + dev.replace(/[^a-zA-Z0-9]/g, "") ).html(rssiHtml);
                    console.log('rssi read '+rssi );
                },
                function( err ){
                    console.log(err);
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
        this.bindEvents();
        //detailPage.hidden = true;
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {
                FastClick.attach(document.body);
                }, false);
        }
        $("#mainStatus").text('');


        var rssiSample = setInterval(function() {
            console.log('ide rescan');
            //app.refreshRssi();
            app.reScan();
            }, 200000);


    },


    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.reScan, false);
        sendButton.addEventListener('click', this.sendData, false);
        disconnectButton.addEventListener('click', this.disconnect, false);
        //deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    onDiscoverDevice: function(device) {

        console.log(JSON.stringify(device));

        if( device.name === undefined ) {
            return false;
        }

        ////SpinnerPlugin.activityStop();

        $("#notFoundInfo").hide();

        if( updateDiscoveredCollection( device.id )  ) {

            var listItem = document.createElement('div');
            listItem.className = "row";
            listItem.id = "li_" + device.id.replace(/[^a-zA-Z0-9]/g, "");

            listItem.innerHTML = app.getDeviceListItem( device );
            deviceList.insertBefore(listItem, deviceList.firstChild);

            var el = document.querySelector('#btn_'+device.id.replace(/[^a-zA-Z0-9]/g, ""));
            el.dataset.deviceId = device.id;
            el.dataset.deviceName = device.name;
            console.log('appconnect on ' + el.dataset.deviceId )
            el.addEventListener('touchstart', app.connect, false);


        } else {
            var listItem = document.getElementById( "li_" + device.id.replace(/[^a-zA-Z0-9]/g, "") );
            listItem.innerHTML = app.getDeviceListItem( device );

        }

    },

    connectInList: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function(peripheral) {
                e.innerHTML = i18next.t("Connected");
            };

        ble.connect(deviceId, onConnect, app.onError);
    },

    connect: function(e) {
        console.log(e);
        console.log(e.target.dataset.deviceId);
        
        var deviceId = e.target.dataset.deviceId,
            onErrorConnect = function(e) {
                    linked.hidden = true;
            },
            onConnect = function(peripheral) {

//                        alert('conn to ' + deviceId + ' .. ' + JSON.stringify(peripheral));
//console.log(JSON.stringify(peripheral));
                unlinked.hidden = true;

                app.determineWriteType(peripheral);

                // subscribe for incoming data
//                ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.rxCharacteristic, app.onData, app.onErrorData);

                ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.tempOutUUID, app.onTempOut, app.onErrorTempOut);
                ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.tempInUUID, app.onTempIn, app.onErrorTempIn);
                ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.nettoVahaUUID, app.onNettoVaha, app.onErrorNettoVaha);
                sendButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                resultDiv.innerHTML = "";
                app.showDetailPage();
                $("#detailName").text(e.target.dataset.deviceName);
            };

        ble.connect(deviceId, onConnect, onErrorConnect);
        beedb.settings.curId = deviceId;


        app.chartInit();
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
        $("#tempOutTitle").text(i18next.t("External temperature"));
        $("#tempOut").text(bytesToString(data)).append("<sup>°C</sup>");
        app.setChart(chartData.datasets[1].data,bytesToString(data));
        beedb.settings.curT1 = bytesToString(data);
    },
    onTempIn: function(data) { // data received from Arduino
        $("#tempInTitle").text(i18next.t("Internal temperature") );
        $("#tempIn").text(bytesToString(data)).append("<sup>°C</sup>");
        app.setChart(chartData.datasets[0].data,bytesToString(data));
        beedb.settings.curT2 = bytesToString(data);
    },
    onNettoVaha: function(data) { // data received from Arduino
        //$("#nettoVahaTitle").text(i18next.t("Weight") );
        $("#nettoVaha").text(bytesToString(data)).append("<small> kg</small>");
        app.setWeightChart(chartWeightData.datasets[0].data,bytesToString(data));
        beedb.settings.curW = parseFloat(bytesToString(data))|| 0.0;
        var perc = beedb.settings.curW / ( ( beedb.settings.maxweight - beedb.settings.minweight )/100 )
        weightProgres.setAttribute("style","width: " + perc + "%")
    },

    sendData: function(event) { // send data to Arduino

        var success = function() {
            console.log("success");
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


        var data = stringToBytes(messageInput.value);
        var deviceId = event.target.dataset.deviceId;

        //if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                alyadevice.serviceUUID,
                alyadevice.txCharacteristic,
                data, success, failure
            );
            /*
        } else {
            ble.write(
                deviceId,
                alyadevice.serviceUUID,
                alyadevice.txCharacteristic,
                data, success, failure
            );
        }
        */

    },
    disconnect: function(event) {
        //SpinnerPlugin.activityStart(i18next.t("Scanning BLE devices"), {});
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.hidden = false;
        //detailPage.hidden = true;
        //SpinnerPlugin.activityStop();
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
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
        alert("TEMP IN: " + reason); // real apps should use notification.alert
    },
    onErrorTempOut: function(reason) {
        alert("TEMP OUT: " + reason); // real apps should use notification.alert
    },
    onErrorNettoVaha: function(reason) {
        alert("Netto Vaha error: " + reason); // real apps should use notification.alert
    },
    onErrorData: function(reason) {
        navigator.notification.alert(
                i18next.t("Service UUID ERROR: ") + reason,
                function(){},
                i18next.t('BLE core'),
                i18next.t('OK')
            );
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
        var html = '\
          <div class="col-lg-12" id="card_' + device.id.replace(/[^a-zA-Z0-9]/g, "") + '">\
              <div class="card text-white bg-primary mb-3">\
                <div class="card-header d-flex w-100 justify-content-between">\
                  <span id="rssi_' + device.id.replace(/[^a-zA-Z0-9]/g, "") + '">'
                 + sigHtml + '</span><small>id: ' + device.id + '</small>\
                </div>\
                <div class="card-body d-flex w-100 justify-content-between">\
                  <h2 class="card-title center">' + device.name + '</h2>\
                  <button id="btn_' + device.id.replace(/[^a-zA-Z0-9]/g, "") + '" class="btn btn-secondary my-2 my-sm-0">\
                  Connect <i class="fa fa-chevron-right"  aria-hidden="true"></i>\
                  </button>\
                </div>\
              </div>\
        </div>';

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

        var myLineChart = new Chart($("#tempChart"), {
        type: 'line',
        data: chartData,
        options: chartOptions
        });

    },

    setWeightChart: function(dataSet, dataValue) {
        dataSet.push(dataValue);
        dataSet.shift();

        var myLineChart = new Chart($("#weightChart"), {
        type: 'line',
        data: chartWeightData,
        options: chartOptions
        });

    },


};
