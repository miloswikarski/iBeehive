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
            $("#btn_" + device.id).on('click', demo.connect);

            deviceList.insertBefore(listItem, deviceList.firstChild);


    },

    showValues: function() {

    	clearTimeout(demo.timeoutVar);

    	var randomVal = (Math.floor(Math.random() * 1310 ) - 300)/10;
    	var randomVal2 = Math.floor(randomVal + (Math.random() * 300 ))/10;
    	var randomW = (Math.floor(Math.random() * 1200 ) )/10;

        $("#tempOutTitle").text(i18next.t("T2"));
        $("#tempOut").text( randomVal.toFixed(1)).append("<sup>°C</sup>");
        $("#tempInTitle").text(i18next.t("T1") );
        $("#tempIn").text( randomVal2.toFixed(1)).append("<sup>°C</sup>");

        $("#nettoVaha").text(randomW.toFixed(1)).append("<small> kg</small>");
        beedb.settings.curT1 = randomVal;
        beedb.settings.curT2 = randomVal2;
        beedb.settings.curW = randomW || 0.0;
        var perc = beedb.settings.curW / ( ( beedb.settings.maxweight - beedb.settings.minweight )/100 )
        weightProgress.setAttribute("style","width: " + perc + "%")
        weightProgress.innerHTML = perc.toFixed(0) + ' % max';

    	demo.timeoutVar = setTimeout(demo.showValues, 2000);

    },

    connect: function(e) {

                beedb.saveDevice({
                    _id: "GADGET_0",
                    hwid: 0,
                    hwname: "DEMO",
                    hwtime: Number(Date.now().toString()),
                });
    	$("#tempOutTitle").text("");
        $("#tempOut").text("");
        $("#tempOut").append("<div class=\"loader\"></div>");
                $("#tempInTitle").text("");
                $("#tempIn").text("");
                $("#tempIn").append("<div class=\"loader\"></div>");
                $("#nettoVaha").text("");
                $("#nettoVaha").append("<div class=\"loader\"></div>");

                resultDiv.innerHTML = "";
                $("#detailName").text("RANDOM VALUES");

                beedb.settings.curId = 0;

                this.showValues();

    },



};
