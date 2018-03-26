'use strict';

//
//init_db
//
var dburl = 'https://db.grapph.com/';
if ( !window.localStorage.getItem('beehavedb') ){
  window.localStorage.setItem('beehavedb','bee' + Math.random().toString(36).substring(2));
  //create and init remote db
  // 
  var rdb = new PouchDB( dburl + window.localStorage.getItem('beehavedb') );
  //var rdb = new PouchDB( dburl + 'ibeehive' );
  rdb.info();
}
  //var pdb = new PouchDB(window.localStorage.getItem('beedb'));

var pdb = new PouchDB( window.localStorage.getItem('beehavedb') );


var beedb = {

  settings: {
    demo: window.localStorage.getItem('settingsDemo') || 1,
    graphs: window.localStorage.getItem('settingsGraphs') || 0,
    minweight: window.localStorage.getItem('settingsMinweight') || 0,
    maxweight: window.localStorage.getItem('settingsMaxweight') || 100,
    curT1: 0,
    curT2: 0,
    curW: 0,
    curId: "0"
  },

  initialize: function(){
    /* Add the event handler */
//    saveButton.addEventListener('click', this.savedata, false);
//    historyButton.addEventListener('click', this.readAll, false);
    window.localStorage.setItem('settingsDemo', this.settings.demo);
    window.localStorage.setItem('settingsMinweight', this.settings.minweight);
    window.localStorage.setItem('settingsMaxweight', this.settings.maxweight);
    window.localStorage.setItem('settingsGraphs', this.settings.graphs);

    if( this.settings.graphs == 0 ) {
      if ( typeof weightChart !== 'undefined' ) {
        weightChart.hidden = true;
      }
      if ( typeof tempChart !== 'undefined' ) {
        tempChart.hidden = true; 
      }      
    }

  },

  readAll: function() {

    var options = {limit : 555555, include_docs: true};
    pdb.allDocs(options, function (err, response) {
        if (response && response.rows.length > 0) {
          options.startkey = response.rows[response.rows.length - 1].id;
          options.skip = 1;
          var display = document.getElementById('historyBody');
          var html = '<table class="table table-bordered table-striped"><thead>\
          <tr><th>'+i18next.t('date')+'</th><th>'+i18next.t('weight')+' [kg]</th><th>T1 [°C]</th><th>T2 [°C]</th></tr>\
          </thead>';
          var hDate;
          response.rows.forEach(function(o) {
            if( o.doc.hwid != beedb.settings.curId ){ //filter for current
              return;
            }
            hDate = new Date(o.doc.hwtime).toISOString().slice(0,16);
            html = html + "<tr><td>" + hDate + "</td><td>"
              + o.doc.weight +"</td><td>" + o.doc.temp1 + "</td><td>"
              + o.doc.temp2 + "</td></tr>";
          });
          display.innerHTML = html + '</table>';

        }
        // handle err or response
      });
 
  },

  savedata: function(event) {

    var o = {};
    o.hwid = beedb.settings.curId;
    o.hwtime = Date.now();
    o.temp1 = beedb.settings.curT1.toString().trim();
    o.temp2 = beedb.settings.curT2.toString().trim();
    o.weight = beedb.settings.curW.toString().trim();

    console.log(o);

  pdb.post(o, function(error, response) {
    if (error) {
      console.log(error);
      return;
    } else if(response && response.ok) {
      console.log(response);
      
      pdb.sync(window.localStorage.getItem('beehavedb'),dburl+'ibeehive',
        {
          live: true,
          retry: true,
          cache: false
        }).on('error', function (err) {
         console.log(err);
        });
    }
  });
}


}

