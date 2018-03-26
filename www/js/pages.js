
const pageMain = `
   <div id="mainPageAll">
    <div class="container">
    <!-- menu -->
    <nav class="navbar navbar-collapse navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="#"><img  style="max-width:50px;" src="css/icon.png"> iBeehive</a>

      <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="navbar-collapse collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li class="text-center">
            <button class="btn btn-warning" data-toggle="collapse" data-target=".navbar-collapse.show"  id="refreshButton" type="button">
              <i class="fa fa-undo"></i> <span data-i18n="rescan">Rescan...</span>
            </button>
          </li>
          <li>
                &nbsp;
          </li>
          <li>
                <div class="card-body d-flex w-100 justify-content-between">
                <input  id="messageInput" class="form-control mr-sm-2" type="text" placeholder="Data to send..." aria-label="Search">
                <button id="sendButton" class="btn btn-outline-success my-2 my-sm-0">Send</button>
                </div>
          </li>
          <li class="text-center">
                <button id="settingsButton" class="btn btn-success" data-toggle="collapse" data-target=".navbar-collapse.show"><i class="fa fa-cogs"></i> <span data-i18n="settings">Settings</span></button>
          <li>
                &nbsp;
          </li>

          </li>
          <li class="text-center">
                <button id="aboutButton" class="btn btn-primary" data-toggle="collapse" data-target=".navbar-collapse.show"><i class="fa fa-info-circle"></i> <span data-i18n="aboutIbeehive">About iBeehive</span></button>

          </li>
          <li>
                &nbsp;
                <a href="#detailDevice">PAGE1</a>
                <a href="#pageConfig">PAGE2</a>
          </li>


        </ul>
      </div>
    </nav>


    <!-- status info -->
    <div class="row col-lg-12"><label id="mainStatus"></label></div>


    <!-- init scanning page -->

    <div class="row" id="notFoundInfo">
      <div class="col-lg-12">
        <h2 data-i18n="scanning">Scanning... not found yet</h2>
        <p data-i18n="iBeehiveIntro">iBeehive app is searching for all smart bluetooth devices around you. If you are near iBeehive device, you will be able to connect to this device and see actual and historical data.</p>
      </div>
    </div>

    <div id="mainPage">
      <div class="row col-lg-12"><h4 id="iFound" data-i18n="bleFound"></h4></div>
      <div id="deviceList">                    
      </div>
    </div>

  <script>
  $("#refreshButton").click(app.reScan);
  $("#sendButton").click(app.sendData);
  $("#disconnectButton").click(app.disconnect);
  $("#aboutButton").click( function(){ $("#aboutModal").modal("show"); } );
  $("#settingsButton").click(function(){ $("#settingsModal").modal("show"); } );
  $("#deviceList").on("touchstart",app.connect);  
  </script>

  </div>
  </div>

`;


const pageDetail = `

    <!-- detail -->
    <div id="detailPageAll">   

    <div id="detailPage" class="container">

    <!-- menu -->
    <nav class="navbar navbar-collapse navbar-dark fixed-top bg-dark">
      <a id="backWithDisconnect" class="btn btn-link btn-xs  d-flex align-items-center" href="#home"><i class="fa fa-angle-left bigicon"></i>&nbsp; {{ back }}</a>
      <a class="navbar-brand mx-auto" href="#">{{ title }}</a>


    </nav>


      <div id="resultDiv" class="row"></div>

      <div class="card bg-white justify-content-between">
      <div class="card-header row">
        <span class="col-sm-12 text-primary" id="detailName"></span>
<!--        <span class="fa-stack fa-lg float-right col-sm-1" id="linked">
        <i class="fa fa-link text-success"></i>
        </span> -->
      </div>
      <div class="card-body row text-secondary">
<!--        <h2 class="float-left"  id="nettoVahaTitle"></h2> -->
        <span class="fa-stack fa-1x float-right col-sm-1">
        <i class="fa fa-balance-scale text-right"></i>
        </span>
        <h1 class="text-center col-sm-10 display-3" id="nettoVaha" >
                    <div class="loader"></div>
        </h1>
        <div class="progress d-flex w-100">
          <div id="weightProgress" class="progress-bar progress-bar-striped progress-bar-animated text-success" role="progressbar" aria-valuenow="79" aria-valuemin="0" aria-valuemax="300" style="width: 79%">79% max</div>
        </div>

      </div>
      <div class="card-body row">
        <span class="fa-stack fa-lg col-sm-1 text-primary">
        <i class="fa fa-thermometer-half"></i>
        </span>
      <div class="col-sm-5 text-primary">
        <span class="float-left"  id="tempInTitle"></span>
        <H1 class="float-right" id="tempIn">
          <div class="loader"></div>
        </H1>
      </div>
      <span class="fa-stack fa-lg col-sm-1 text-success">
        <i class="fa fa-thermometer-full"></i>
        </span>
      <div class="col-sm-5 text-success">
        <span class="float-left"  id="tempOutTitle"></span>
        <H1 class="float-right text-success" id="tempOut">
                    <div class="loader"></div>
        </H1>
      </div>
      </div>


      </div>


      <div class="card bg-white">
      <div class="card-body row">
      <canvas id="weightChart" class="col-sm-6 mh-150"></canvas>
      <canvas id="tempChart" class="col-sm-6 mh-150"></canvas>
      </div>
      </div>


      <!-- SAVE AND DISCONNECT BTNS -->

    <div class="wrapper text-center">

      <div>&nbsp;</div>


      <div class="btn-group" role="group" aria-label="iBeehive actions">

      <button id="disconnectButton" class="btn btn-success"><i class="fa fa-unlink"></i> <span data-i18n="disconnect">Disconnect</span></button>

      <button id="saveButton" class="btn btn-primary" data-toggle="modal" data-target="#infoModal"><i class="fa fa-archive"></i> <span data-i18n="save">Save</span></button>

      <button id="historyButton" class="btn btn-secondary" data-toggle="modal" data-target="#historyModal"><i class="fa fa-history"></i> <span data-i18n="history">History</span></button>

      </div>
    </div>
    <script>
    $("#saveButton").click(beedb.savedata);
    $("#historyButton").click(beedb.readAll);
    </script>



      <!-- Save alert dialog box -->

      <!-- Modal -->
      <div class="modal fade modal-fullscreen" id="historyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel" data-i18n="historyValues">History values</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" id="historyBody">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" data-i18n="close">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal INFO -->
      <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="infoModalLabel" data-i18n="actualValues">Actual values</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" data-i18n="valuesSaved">
              Actual values saved
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" data-i18n="close">Close</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Modal ABOUT -->
      <div class="modal fade modal-fullscreen" id="aboutModal" tabindex="-1" role="dialog" aria-labelledby="About iBeehive" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="aboutTitle" data-i18n="aboutTitle">About iBeehive</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" id="aboutBody">
              <span data-i18n="aboutText"> iBeehive is application used for smart bee weight products by Alya Ltd. You can find more on </span>
               <a href="https://www.alya.sk">www.alya.sk</a>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" data-i18n="close">Close</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Modal SETTINGS -->
      <div class="modal fade modal-fullscreen" id="settingsModal" tabindex="-1" role="dialog" aria-labelledby="About iBeehive" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="settingsTitle" data-i18n="settings">Settings</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" id="settingsBody">
              <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex active" data-unit="switch-light-1">
                      <svg class="icon-sprite">
                        <use class="glow" fill="url(#radial-glow)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#glow"></use>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#bulb-eco"></use>
                      </svg>
                      <h5>Kitchen</h5>
                      <label class="switch ml-auto checked">
                        <input type="checkbox" id="switch-light-1" checked="">
                      </label>
                      <div class="info-holder info-rb" style="right:40px;">
                        <div data-toggle="popover-all" data-content="Checkbox element using localStorage to remember the last status." data-original-title="Switch ON/OFF" data-container="body" data-placement="top" data-offset="0,-6"></div>
                      </div>
                    </li>
                    <li class="list-group-item d-flex" data-unit="switch-light-2">
                      <svg class="icon-sprite">
                        <use class="glow" fill="url(#radial-glow)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#glow"></use>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#bulb-eco"></use>
                      </svg>
                      <h5>Dining room</h5>
                      <label class="switch ml-auto">
                        <input type="checkbox" id="switch-light-2">
                      </label>
                    </li>
                    <li class="list-group-item d-flex" data-unit="switch-light-3">
                      <svg class="icon-sprite">
                        <use class="glow" fill="url(#radial-glow)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#glow"></use>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#bulb-eco"></use>
                      </svg>
                      <h5>Living room</h5>
                      <label class="switch ml-auto">
                        <input type="checkbox" id="switch-light-3">
                      </label>
                    </li>
                    <li class="list-group-item d-flex" data-unit="switch-light-4">
                      <svg class="icon-sprite">
                        <use class="glow" fill="url(#radial-glow)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#glow"></use>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#bulb-eco"></use>
                      </svg>
                      <h5>Bedroom</h5>
                      <label class="switch ml-auto">
                        <input type="checkbox" id="switch-light-4">
                      </label>
                    </li>
                    <li class="list-group-item d-flex" data-unit="switch-light-5">
                      <svg class="icon-sprite">
                        <use class="glow" fill="url(#radial-glow)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#glow"></use>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons-sprite.svg#bulb-eco"></use>
                      </svg>
                      <h5>Bathroom</h5>
                      <label class="switch ml-auto">
                        <input type="checkbox" id="switch-light-5">
                      </label>
                    </li>
                  </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" data-i18n="close">Close</button>
            </div>
          </div>
        </div>
      </div>



      <div id="dataDiv">&nbsp;</div>
    </div>

    </div><!-- detailPageAll -->

`;




const pageConfig = `

    <!-- config -->
    <div id="configPageAll">   

    <div id="configPage" class="container">

    <!-- menu -->
    <nav class="navbar navbar-collapse navbar-dark fixed-top bg-dark">
      <a id="backWithDisconnect" class="btn btn-link btn-xs  d-flex align-items-center" href="#home"><i class="fa fa-angle-left bigicon"></i>&nbsp; {{ back }}</a>
      <a class="navbar-brand mx-auto" href="#">{{ title }}</a>
    </nav>


    <ul class="list-group">
      <li class="list-group-item d-flex  w-100 justify-content-between align-items-center">
      <!-- DEMO switch -->
        <span class=" d-flex justify-content-start">
          {{ demo_title }}
          </span>
        <span class="switch d-flex justify-content-end">
          <input type="checkbox" class="switch d-flex justify-content-end" id="switch-demo">
          <label for="switch-demo" id="switch-demo-label"></label>
        </span>
      </li>

      <li class="list-group-item d-flex  w-100 justify-content-between align-items-center">
      <!-- GRAPH switch -->
        <span class=" d-flex justify-content-start">
          {{ graph_title }}
          </span>
        <span class="switch d-flex justify-content-end">
          <input type="checkbox" class="switch d-flex justify-content-end" id="switch-graph">
          <label for="switch-graph" id="switch-graph-label"></label>
        </span>
      </li>

      <li class="list-group-item d-flex  w-100 justify-content-between align-items-center">
      <!-- MIN WEIGHT -->
        <span class=" d-flex justify-content-start">
          {{ minw_title }}
          </span>
        <span class="switch d-flex justify-content-end">
          <select id="minwSelect">
          </select> &nbsp; kg
        </span>
      </li>

      <li class="list-group-item d-flex  w-100 justify-content-between align-items-center">
      <!-- MAX WEIGHT -->
        <span class=" d-flex justify-content-start">
          {{ maxw_title }}
          </span>
        <span class="switch d-flex justify-content-end">
          <select id="maxwSelect">
          </select> &nbsp; kg
        </span>
      </li>

    </ul>


  <script>

  if( beedb.settings.demo == 1 ) {
    $('#switch-demo').trigger('click').attr("checked", "checked"); 
  }
  $('#switch-demo').on('change', function () {
    if( document.querySelector('#switch-demo').checked ){
      beedb.settings.demo = 1;
    } else {
      beedb.settings.demo = 0;
    }
    window.localStorage.setItem('settingsDemo', beedb.settings.demo);
  });

  if( beedb.settings.graphs == 1 ) {
    $('#switch-graph').trigger('click').attr("checked", "checked"); 
  }
  $('#switch-graph').on('change', function () {
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
    $('#minwSelect').append('<option value="' + i + '" ' + j + '>' + i + '</option>' );
  }

    $('#minwSelect').on('change', function () {
      beedb.settings.minweight = Number($('#minwSelect').val());
      window.localStorage.setItem('settingsMinweight', beedb.settings.minweight);
    });


  for( var i=5; i<300; i++){
    var j = "";
    if( Number(beedb.settings.maxweight) === i ) {
      j = "selected";
    }
    $('#maxwSelect').append('<option value="' + i + '" ' + j + '>' + i + '</option>' );
  }

    $('#maxwSelect').on('change', function () {
      beedb.settings.maxweight = Number($('#maxwSelect').val());
      window.localStorage.setItem('settingsMaxweight', beedb.settings.maxweight);
    });



  </script>

  </div>
  </div>

`;
