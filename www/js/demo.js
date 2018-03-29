'use strict';


var demo = {    

	timeoutVar: 0,

    initialize: function( device ) {

    		//DEMO - nekompatibilne

            var listItem = document.createElement('div');
            listItem.className = "row";
            listItem.id = "li_" + device.id;

            listItem.innerHTML = app.getDeviceListItem( device );
   //         deviceList.insertBefore(listItem, deviceList.firstChild);

            var el = document.querySelector('#btn_'+device.id);
            if( el !== null ) {
	            //el.dataset.deviceId = device.id;
    	        //el.dataset.deviceName = device.name;
                console.log('on demo touchstart');
        	    el.addEventListener('touchstart', demo.connect, false);
            }

            deviceList.insertBefore(listItem, deviceList.firstChild);


    },

    showValues: function() {

    	clearTimeout(demo.timeoutVar);

    	var randomVal = (Math.floor(Math.random() * 1310 ) - 300)/10;
    	var randomVal2 = Math.floor(randomVal + (Math.random() * 300 ))/10;
    	var randomW = (Math.floor(Math.random() * 1200 ) )/10;

        $("#tempOutTitle").text(i18next.t("External temperature"));
        $("#tempOut").text( randomVal.toString()).append("<sup>°C</sup>");
        $("#tempInTitle").text(i18next.t("Internal temperature") );
        $("#tempIn").text( randomVal2.toString()).append("<sup>°C</sup>");

        $("#nettoVaha").text(randomW.toString()).append("<small> kg</small>");
        beedb.settings.curT1 = randomVal;
        beedb.settings.curT2 = randomVal2;
        beedb.settings.curW = randomW || 0.0;
        var perc = beedb.settings.curW / ( ( beedb.settings.maxweight - beedb.settings.minweight )/100 )
        weightProgress.setAttribute("style","width: " + perc + "%")
        weightProgress.innerHTML = perc.toFixed(0).toString() + ' % max';

    	this.timeoutVar = setTimeout(this.showValues, 2000);

    },

    connect: function(e) {
    	$("#tempOutTitle").text("");
                $("#tempOut").text("");
                $("#tempOut").append("<div class=\"loader\"></div>");
                $("#tempInTitle").text("");
                $("#tempIn").text("");
                $("#tempIn").append("<div class=\"loader\"></div>");
                $("#nettoVaha").text("");
                $("#nettoVaha").append("<div class=\"loader\"></div>");

                sendButton.dataset.deviceId = "DEMO";
                disconnectButton.dataset.deviceId = "DEMO";
                resultDiv.innerHTML = "";
                app.showDetailPage();
                $("#detailName").text("DEMO VALUES");

                this.showValues();

    },



};
