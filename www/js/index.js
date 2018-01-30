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
    serviceUUID: '00002a37-0000-1000-8000-00805f9b34fb',
//    serviceUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',

    rxCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    txCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
};

var discovered = [];

// set timeout
var tid = -1;
    

function updateDiscoveredCollection ( dev ) {
    if (discovered.indexOf(dev) === -1) {
        discovered.push(dev);
        return true;
    } else if (discovered.indexOf(dev) > -1) {
        return false;
    }
}

var app = {    

    repeatRefresh: function() {
        clearTimeout(tid);
        app.refreshDeviceList();
        tid = setTimeout(repeatRefresh, 10000); 
    },
    
    abortScanner: function() { 
        clearTimeout(tid);
        tid = -1;
    },

    switchScanner:  function() {
        if( tid > 0 ){
            app.abortScanner();
            $("#refreshButton").text("Start scanning...");
        } else {
            app.repeatRefresh();
            $("#refreshButton").text("Stop scanning...");
        }
    },

    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.switchScanner, false);
        sendButton.addEventListener('click', this.sendData, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        //deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
        app.repeatRefresh();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = '';
        $("#refreshButton").text("Abort scanning...");
        discovered = [];
//        if (cordova.platformId === 'android') { // Android filtering is broken
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
//        } else {
//            ble.scan([alyadevice.serviceUUID], 5, app.onDiscoverDevice, app.onError);
//        }
    },
    onDiscoverDevice: function(device) {

        if( updateDiscoveredCollection( device.name )  ) {

        var listItem = document.createElement('div');
        listItem.className = "row";
 /*       var child1 = document.createElement('div').addClass("col-sm-12");
        var child2 = document.createElement('div').addClass("chart-wrapper");
        var child3 = document.createElement('div').addClass("chart-title");
        child3.innerHTML = device.name;
        child3.dataset.deviceId = device.id;
        child3.addEventListener('touchstart', this.connectInList, false); // assume not scrolling

        child2.appendChild(child3);
        child1.appendChild(child2);
        listItem.appendChild(child1);
*/
        var html = '\
      <div class="col-sm-12">\
        <div class="chart-wrapper">\
          <div class="chart-title knob-title">' + 
            device.name + '\
          </div>\
          <div class="chart-stage">\
                  <input type="text" class="users" value="' + device.rssi + '"/>\
          </div>\
          <div id="devNote" class="chart-notes">\
            iBeehive\
          </div>\
        </div>\
        </div>\
        ';

        listItem.innerHTML = html;
        listItem.dataset.deviceId = device.id;
//        devNote.dataset.deviceId = device.id;
        deviceList.appendChild(listItem);


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
                ble.startNotification(deviceId, alyadevice.serviceUUID, alyadevice.rxCharacteristic, app.onData, app.onError);
                sendButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                resultDiv.innerHTML = "";
                app.showDetailPage();
            };

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
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },
    sendData: function(event) { // send data to Arduino

        var success = function() {
            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
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
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
