'use strict';

//
//init_db
//
var dburl = 'https://db.grapph.com/';
if ( !window.localStorage.getItem('beedb') ){
  window.localStorage.setItem('beedb','bee' + Math.random().toString(36).substring(2));
  //create and init remote db
  // 
  //  var rdb = new PouchDB( dburl + window.localStorage.getItem('beedb') );
  var rdb = new PouchDB( dburl + 'ibeehive' );
  rdb.info();
}


//var pdb = new PouchDB(window.localStorage.getItem('beedb'));

var pdb = new PouchDB( dburl + 'ibeehive');

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

  },

  savedata: function(event) {

    var o = {};
    o.hwid = beedb.settings.curId;
    o.hwtime = beedb.settings.curId;
    o.temp1 = beedb.settings.curT1;
    o.temp2 = beedb.settings.curT2;
    o.weight = beedb.settings.curW;

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

