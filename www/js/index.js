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
//    serviceUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',

    nettoVahaUUID: '18c0c807-589e-4b89-8ee3-8c1de9a80248',
    tempInUUID: '3511d30e-9911-479e-a7be-43d4220ab1b2',
    tempOutUUID: 'e7e2aec2-5335-49b9-ad90-3aad5eac7eb8',

    rxCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    txCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
};

var discovered = [];

// scann or not scann
var scanning = false;
    

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
        $("#mainStatus").text('iBeehive radar active...');
//        } else {
//            ble.startScan([alyadevice.serviceUUID], app.onDiscoverDevice, app.onError);
//        }
    },
    repeatScan: function() {
        $("#mainStatus").text('iBeehive radar active...');
        ble.startScan([], app.onDiscoverDevice, app.onError);
    },
    
    restartScanner: function() { 
        ble.stopScan( function(){
                    $("#mainStatus").text('iBeehive radar stopped.');
                    $("#notFoundInfo").show();
                    disconnectButton.click();
                    app.refreshDeviceList();
        }, function(){
                    $("#mainStatus").text('Error occured.');
        } );
    },

    reScan: function() {
        app.showMainPage();
        app.restartScanner();
    },

    switchScanner:  function() {
        if( scanning !== false ){
            app.restartScanner();
            scanning = false;
            refreshButton.title = "Start scanning...";
        } else {
            app.repeatScan();
            scanning = true;
            refreshButton.title = "Stop scanning...";
        }
    },

    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {
                FastClick.attach(document.body);
                }, false);
        }
        $("#mainStatus").text('');

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

        $("#notFoundInfo").hide();

        if( updateDiscoveredCollection( device.id )  ) {

            var listItem = document.createElement('div');
            listItem.className = "row";
            listItem.id = "li_" + device.id.replace(/[^a-zA-Z0-9]/g, "");

            listItem.innerHTML = app.getDeviceListItem( device );
            deviceList.insertBefore(listItem, deviceList.firstChild);

            var el = document.querySelector('#btn_'+device.id.replace(/[^a-zA-Z0-9]/g, ""));
            el.dataset.deviceId = device.id;
            el.addEventListener('touchstart', app.connect, false);


        } else {
            var listItem = document.getElementById( "li_" + device.id.replace(/[^a-zA-Z0-9]/g, "") );
            listItem.innerHTML = app.getDeviceListItem( device );

        }

    },

    connectInList: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function(peripheral) {
                e.innerHTML = "Connected";
            };

        ble.connect(deviceId, onConnect, app.onError);
    },

    connect: function(e) {
        var deviceId = e.target.dataset.deviceId,
            onConnect = function(peripheral) {
                app.determineWriteType(peripheral);

                // subscribe for incoming data
                ////ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.rxCharacteristic, app.onData, app.onErrorData);
                ble.startNotification(deviceId, alyadevice.tempOutUUID, alyadevice.rxCharacteristic, app.onTempOut, app.onErrorTempOut);
                ble.startNotification(deviceId, alyadevice.tempInUUID, alyadevice.rxCharacteristic, app.onTempIn, app.onErrorTempIn);
                ble.startNotification(deviceId, alyadevice.nettoVahaUUID, alyadevice.rxCharacteristic, app.onNettoVaha, app.onErrorNettoVaha);
                sendButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                resultDiv.innerHTML = "";
                app.showDetailPage();
                $("#detailName").text(deviceId);
            };

        //alert('conn to ' + deviceId );


        ble.connect(deviceId, onConnect, app.onError);
    },
    determineWriteType: function(peripheral) {
        // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
        // Newer Bluefruit devices use Write Request for the TX characteristic

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

    },
    onData: function(data) { // data received from Arduino
        console.log(data);
        $("#mainStatus").text("Received: " + bytesToString(data));
    },
    onTempOut: function(data) { // data received from Arduino
        console.log(data);
        $("#tempOut").text("External temperature: " + bytesToString(data));
    },
    onTempIn: function(data) { // data received from Arduino
        console.log(data);
        $("#tempIn").text("Internal temperature: " + bytesToString(data));
    },
    onNettoVaha: function(data) { // data received from Arduino
        console.log(data);
        $("#nettoVaha").text("Weight: " + bytesToString(data));
    },

    sendData: function(event) { // send data to Arduino

        var success = function() {
            console.log("success");
            $("#mainStatus").text("Sent: " + messageInput.value );

            //resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            //resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed writing data to the alyadevice");
        };

        var data = stringToBytes(messageInput.value);
        var deviceId = event.target.dataset.deviceId;

        if (app.writeWithoutResponse) {
            ble.writeWithoutResponse(
                deviceId,
                alyadevice.serviceUUID,
                alyadevice.txCharacteristic,
                data, success, failure
            );
        } else {
            ble.write(
                deviceId,
                alyadevice.serviceUUID,
                alyadevice.txCharacteristic,
                data, success, failure
            );
        }

    },
    disconnect: function(event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onError: function(reason) {
        alert("DEFAULT ERROR MSG: " + reason); // real apps should use notification.alert
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
        alert("Service UUID ERROR: " + reason); // real apps should use notification.alert
    },

    getDeviceListItem: function( device ) {
        var sigHtml = '<span class="fa-stack fa-lg">\
                    <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                    <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.0em; margin-left:0.5em;"></i>\
                  </span>';
        if( device.rssi < -85 ){
            sigHtml = '<span class="fa-stack fa-lg">\
                    <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                    <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.2em; margin-left:0.5em;"></i>\
                  </span>';
        } else if( device.rssi < -70 ){
            sigHtml = '<span class="fa-stack fa-lg">\
                    <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                    <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.4em; margin-left:0.5em;"></i>\
                  </span>';
        } else if( device.rssi < -55 ){
            sigHtml = '<span class="fa-stack fa-lg">\
                    <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                    <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.6em; margin-left:0.5em;"></i>\
                  </span>';
        } else if( device.rssi < -85 ){
            sigHtml = '<span class="fa-stack fa-lg">\
                    <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                    <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:0.8em; margin-left:0.5em;"></i>\
                  </span>';
        } else if( device.rssi < -40 ){
            sigHtml = '<span class="fa-stack fa-lg">\
                    <i class="fa fa-signal fa-stack-1x" style="opacity:.3"></i>\
                    <i class="fa fa-signal fa-stack-1x" style="overflow:hidden; width:1.0em; margin-left:0.5em;"></i>\
                  </span>';
        } 
        var html = '\
          <div class="col-lg-12">\
              <div class="card text-white bg-primary mb-3">\
                <div class="card-header d-flex w-100 justify-content-between">'
                 + sigHtml + '<small>id: ' + device.id + '</small>\
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

    }



};
