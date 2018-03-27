var onInitFn = {

  devDetail: function() {
    $("#disconnectButton").click(app.disconnect);
    $("#saveButton").click(beedb.savedata);
    $("#historyButton").click(beedb.readAll);
  },
  config: function() {

  if( beedb.settings.demo == 1 ) {
    jQuery('#switch-demo').trigger('click').attr("checked", "checked"); 
  }
  jQuery('#switch-demo').on('change', function () {
    if( document.querySelector('#switch-demo').checked ){
      beedb.settings.demo = 1;
    } else {
      beedb.settings.demo = 0;
    }
    window.localStorage.setItem('settingsDemo', beedb.settings.demo);
  });

  if( beedb.settings.graphs == 1 ) {
    jQuery('#switch-graph').trigger('click').attr("checked", "checked"); 
  }
  jQuery('#switch-graph').on('change', function () {
    if( document.querySelector('#switch-graph').checked ){
      beedb.settings.graphs = 1;
    } else {
      beedb.settings.graphs = 0;
    }
    window.localStorage.setItem('settingsGraphs', beedb.settings.graphs);
  });

  for( var i=0; i<100; i++){
    var j = "";
    if( Number(beedb.settings.minweight) === i ) {
      j = "selected";
    }
    jQuery('#minwSelect').append('<option value="' + i + '" ' + j + '>' + i + '</option>' );
  }

    jQuery('#minwSelect').on('change', function () {
      beedb.settings.minweight = Number(jQuery('#minwSelect').val());
      window.localStorage.setItem('settingsMinweight', beedb.settings.minweight);
    });


  for( var i=5; i<300; i++){
    var j = "";
    if( Number(beedb.settings.maxweight) === i ) {
      j = "selected";
    }
    jQuery('#maxwSelect').append('<option class="bg-orange" value="' + i + '" ' + j + '>' + i + '</option>' );
  }

    jQuery('#maxwSelect').on('change', function () {
      beedb.settings.maxweight = Number(jQuery('#maxwSelect').val());
      window.localStorage.setItem('settingsMaxweight', beedb.settings.maxweight);
    });


  }

}



var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'home',
  },
  // About page
  {
    path: '/about/',
    url: './pages/about.html',
    name: 'about',
  },
  // Detail
  {
    path: '/devDetail/',
    url: './pages/devDetail.html',
    name: 'iBeehive',
    on: {
        pageInit: function (e, page) {
          onInitFn.devDetail();
        },
      }
  },
  // Config
  {
    path: '/config/',
    templateUrl: './pages/config.html',
    on: {
        pageInit: function (e, page) {
          onInitFn.config();
        },
      }
  },

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
