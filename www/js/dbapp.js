'use strict';

//
//init_db
//
var dburl = 'https://db.grapph.com/';
if ( !window.localStorage.getItem('beedb') ){
  window.localStorage.setItem('beedb','bee' + Math.random().toString(36).substring(2));
  //create and init remote db
  // 
  var rdb = new PouchDB( dburl + window.localStorage.getItem('beedb') );
  //var rdb = new PouchDB( dburl + 'ibeehive' );
  rdb.info();
}
  //var pdb = new PouchDB(window.localStorage.getItem('beedb'));

var pdb = new PouchDB( window.localStorage.getItem('beedb') );


var beedb = {

  settings: {
    minweight: 0,
    maxweight: 300,
    curT1: 0,
    curT2: 0,
    curW: 0,
    curId: "0"
  },

  initialize: function(){
    /* Add the event handler */
    saveButton.addEventListener('click', this.savedata, false);
    historyButton.addEventListener('click', this.readAll, false);

  },

  readAll: function() {

    var options = {limit : 555555, include_docs: true};
    pdb.allDocs(options, function (err, response) {
        if (response && response.rows.length > 0) {
          options.startkey = response.rows[response.rows.length - 1].id;
          options.skip = 1;
          var display = document.getElementById('historyBody');
          var html = '<table class="table table-bordered table-striped"><thead>\
          <tr><th>Date</th><th>Weight</th><th>T1</th><th>T2</th></tr>\
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
      
      pdb.sync(window.localStorage.getItem('beedb'),dburl+'ibeehive',
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

