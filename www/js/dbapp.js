'use strict';

//
//init_db
//
var dburl = 'https://db.grapph.com/';
if ( !window.localStorage.getItem('beehavedb') ){
  window.localStorage.setItem('beehavedb','bee' + Math.random().toString(36).substring(2));
  //create and init remote db
  // 
//  var rdb = new PouchDB( dburl + window.localStorage.getItem('beehavedb') );
  //var rdb = new PouchDB( dburl + 'ibeehive' );
//  rdb.info();
}
  //var pdb = new PouchDB(window.localStorage.getItem('beedb'));

  var pdb = new PouchDB( window.localStorage.getItem('beehavedb') );


  var beedb = {

    settings: {
      demo: window.localStorage.getItem('settingsDemo') || 1,
      graphs: window.localStorage.getItem('settingsGraphs') || 0,
      minweight: window.localStorage.getItem('settingsMinweight') || 0,
      maxweight: window.localStorage.getItem('settingsMaxweight') || 150,
      time1: window.localStorage.getItem('settingsTime1') || "",
      time2: window.localStorage.getItem('settingsTime2') || "",
      time3: window.localStorage.getItem('settingsTime3') || "",
      time4: window.localStorage.getItem('settingsTime4') || "",
      curT1: 0,
      curT2: 0,
      curW: 0,
      curId: "0",
      allDevices: []
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

readAll: function( devId ) {
  devId = (typeof devId !== 'undefined') ?  devId : beedb.settings.curId.toString();
  console.log('reading devId ', devId );
  //ToDo: limit... paging maybe neccessary
  var options = {limit : 365, include_docs: true,
     startkey: devId + '_' + "\ufff0",
     endkey: devId + '_',
     descending: true };
  pdb.allDocs(options, function (err, response) {
    console.log('rows',response.rows);
    if (response && response.rows.length > 0) {
    //  options.startkey = response.rows[response.rows.length - 1].id;
      //options.skip = 1;
//      var display = document.getElementById('historyBody');
      var html = '<table class="table table-bordered table-striped"><thead>\
      <tr><th>'+i18next.t('date')+'</th><th>'+i18next.t('weight')+' [kg]</th><th>24h Δ</th><th>T1 [°C]</th><th>T2 [°C]</th>\
      <th><i class="fa fa-trash"></i></th></tr>\
      </thead>';
      var hDate, obj1, riadok = 1;
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
       var times = [];
       response.rows.forEach(function(o){
         const d = new Date(o.doc.hwtime);
         const t = Math.floor(o.doc.hwtime/1000);
         const hDate = (new Date( (new Date(o.doc.hwtime)).getTime() - tzoffset)).toISOString().slice(0, -8).replace("T", " ") || "";
         times[ t ] = { "hDate": hDate, "weight": o.doc.weight };
         
       });
       console.log('times',times);

        response.rows.sort(function(a, b){
          return a.doc.hwtime == b.doc.hwtime ? 0 : +(a.doc.hwtime < b.doc.hwtime) || -1;
        }).forEach(function(o) {

            const t = Math.floor(o.doc.hwtime/1000);
            var delta = "?";
            var dcolor = ' class="btn-danger"';
             if( typeof times[Math.floor((o.doc.hwtime - 24*60*60000)/1000)] !== 'undefined' ){
                delta = (times[t].weight - times[Math.floor((o.doc.hwtime - 24*3600000)/1000)].weight);
                dcolor = delta <= 0 ? ' class="btn-danger"':' class="btn-success"';
                delta = delta.toFixed(1);
             }
//              hDate = (new Date( (new Date(obj1.hwtime)).getTime() - tzoffset)).toISOString().slice(0, -8).replace("T", " ") || "";
           //   var delta = (obj1.weight - o.doc.weight).toFixed(1);
            var t2x = isNaN(o.doc.temp2)?o.doc.temp2:parseFloat(o.doc.temp2);
            if( t2x > 60 ){
                t2x = 60 - t2x;
            }
            var t1x = isNaN(o.doc.temp1)?o.doc.temp1:parseFloat(o.doc.temp1);
            if( t1x > 60 ){
                t1x = 60 - t1x;
            }
            var wei = isNaN(o.doc.weight)?o.doc.weight:o.doc.weight===null?'-':o.doc.weight.toFixed(1);        
              html = html + '<tr><td>' + times[t].hDate + '</td><td class="btn-primary">'
              + wei +"</td><td" + dcolor + ">" + delta + "</td><td>"
               + (isNaN(t1x)?t1x:t1x.toFixed(1) ) + "</td><td>"+ (isNaN(t2x)?t2x:t2x.toFixed(1) ) + '</td><td><button class="btn btn-danger"><a href="/delete/?id=' + o.doc._id + '&rev=' + o.doc._rev + '&d=' + encodeURI(hDate) + '"><i class="fa fa-trash"></i></a></button></td></tr>';
      });

      // if( obj1 ){
      //         console.log(obj1.hwtime);
      //         hDate = (new Date( (new Date(obj1.hwtime)).getTime() - tzoffset)).toISOString().slice(0, -8).replace("T", " ") || "";
      //         var delta = (obj1.weight).toFixed(1);
      //         var dcolor = delta <= 0 ? ' class="btn-danger"':' class="btn-success"';
      //         html = html + '<tr><td>' + hDate + '</td><td class="btn-primary">'
      //         + obj1.weight.toString() +"</td><td" + dcolor + ">" + delta.toString() + "</td><td>"
      //          + obj1.temp1.toString() + "</td><td>"+ obj1.temp2.toString()  + '</td><td><button class="btn btn-danger"><a href="/delete/?id=' + obj1._id + '&rev=' + obj1._rev + '&d=' + encodeURI(hDate) + '"><i class="fa fa-trash"></i></a></button></td></tr>';

      // }


      html = html + '<tfoot><tr>' 
      + '<td><a onclick="app7.methods.shareFn(\''+encodeURI(devId)+'\');" class="link nounderline icon-only"><i class="icon fa fa-share"></i></a></td>'
      + '<td colspan="4">&nbsp;</td><td><button class="btn btn-danger"><a href="/delete/?devid=' + encodeURI(devId) + '">' + i18next.t("delete all") + ' <i class="fa fa-trash"></i></a></button></td></tr></tfoot></table>';
      jQuery("#historyBody").html(html);

    }
        // handle err or response
      });

},

savedata: function(event) {

  var o = {};
  o._id = beedb.settings.curId.toString() + '_' + Date.now().toString(),
  o.hwid = beedb.settings.curId;
  o.hwtime = Number(Date.now().toString());
  o.temp1 = Number(beedb.settings.curT1);
  o.temp2 = Number(beedb.settings.curT2);
  o.weight = Number(beedb.settings.curW);

  console.log(o);

  pdb.post(o, function(error, response) {
    if (error) {
      console.log(error);
      return;
    } else if(response && response.ok) {
      console.log(response);
      
      // o._id = beedb.settings.curId.toString() + '_' + Date.now().toString(),
      // o.weight = Math.random(44);
      // o.hwtime = o.hwtime - (60*60000*24);
      // pdb.post(o,function(error,response){ console.log('savedx',o.hwtime.toString())});

      app7.dialog.alert(i18next.t("valuesSaved") + "...",i18next.t("actualValues"));

      //First synchro must be initialized by manual saving.
      //ToDo: analyse whether rather synchro on the app start
      //
      pdb.sync(dburl + window.localStorage.getItem('beehavedb'),
      {
        live: true,
        retry: true,
        cache: false
      }).on('error', function (err) {
        console.log('error sync...');
       console.log(err);
     }).on('complete', function(res) {
        console.log('completed sync');
        console.log(res);
     });
    }
  });
},

saveHistory: function(o) {


  pdb.get(o._id).then(function(doc) {
    return pdb.put({
      _id: o._id,
      _rev: doc._rev,
      hwid: o.hwid,
      hwtime: o.hwtime,
      temp1: o.temp1,
      temp2: o.temp2,
      weight: o.weight
    });
  }).then(function(response) {
      console.log('updated '+o._id);
  }).catch(function (err) {

    if( err.status == 404){
      pdb.post(o, function(error, response) {
        if (error) {
          console.log(error);
          return;
        } else if(response && response.ok) {
          console.log('new '+o._id);
          if($('#newData').html() == "") {
            $("#newData").html("<i class=\"fa fa-certificate\"></i> " + i18next.t("NEW") + " <i class=\"fa fa-certificate\"></i>");
            setTimeout(function(){ $("#newData").html("");}, 400);
          }
          //console.log(response);
        }
      });

    }

  });

},

saveDevice: function(o) {
  // save list of connected devices... for getting history info
  pdb.get(o._id).then(function(doc) {
    return pdb.put({
      _id: o._id,
      _rev: doc._rev,
      hwid: o.hwid,
      hwname: o.hwname,
      hwtime: o.hwtime
    });
  }).then(function(response) {
      console.log('updated gadget '+o._id);
  }).catch(function (err) {

    if( err.status == 404){
      pdb.post(o, function(error, response) {
        if (error) {
          console.log(error);
          return;
        } else if(response && response.ok) {
          console.log('new gadget '+o._id);
          // init - read devices
          beedb.getDevices();
        }
      });

    }

  });

},

getDevices: function() {

  var options = {limit : 256, include_docs: true,
   startkey: 'GADGET_' + "\ufff0",
   endkey: 'GADGET_',
   descending: true };
   pdb.allDocs(options).then( function (response) {
    console.log(response);
    if (response && response.rows.length > 0) {
      this.settings.allDevices = [];
      response.rows.forEach(function(o) {
        console.log('mame '+o.doc.hwname);
        this.settings.allDevices.push({
          hwid: o.doc.hwid,
          hwname: o.doc.hwname,
          hwtime: o.doc.hwtime
        });
      });
    }
      }).catch( function(err){
        console.log(err);
      });

 },

eraseDb: function() {
  pdb.destroy().then(function (response) {
      app7.dialog.alert(i18next.t("AllDataDeleted"),i18next.t("Erase DB"));

      pdb = null;
      pdb = new PouchDB( window.localStorage.getItem('beehavedb') );

}).catch(function (err) {
  console.log(err);
});
}



}

// init - read devices
beedb.getDevices();


