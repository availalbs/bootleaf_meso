var mesonet = {
  map:{},
  sidebar:{},
  init:function(){
    /* Basemap Layers */
    var mapquestOSM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0po4e8k/{z}/{x}/{y}.png");

    var mbTerrainSat = L.tileLayer("https://{s}.tiles.mapbox.com/v3/matt.hd0b27jd/{z}/{x}/{y}.png");

    var mbTerrainReg = L.tileLayer("https://{s}.tiles.mapbox.com/v3/aj.um7z9lus/{z}/{x}/{y}.png");
  
    var mapquestOAM = L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0pml9h7/{z}/{x}/{y}.png", {
      maxZoom: 19,
    });
    var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.tiles.mapbox.com/v3/am3081.h0pml9h7/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
    })]);
    /*Leaflet Tile Overlay Layers*/
    var rainfall = L.tileLayer('http://vis.availabs.org/mesonet/data/tiles/{z}/{x}/{y}.png', {minZoom: 5, maxZoom: 10,tms: true,opacity:0.5});
    var floodplains = L.tileLayer('http://vis.availabs.org/mesonet/data/flood_planes/{z}/{x}/{y}.png', {minZoom: 5, maxZoom: 12,tms: true,opacity:1});
    
    mesonet.map = L.map("map", {
          center: [42.76314586689494,-74.7509765625],
          zoom: 7,
      layers: [mbTerrainReg]
    });
    //staydry1-4, only change the layers
    //get rid of the width but make sure it works
    //Open up the NYS shapefile in QGIS and save it as a geojson
    var staydry = L.tileLayer.wms("https://hazards.fema.gov/gis/nfhl/services/KMZ/StayDry/MapServer/WmsServer", {
        layers: 3,
        format: 'image/png',
        transparent:true,
        style:'default',
        crs:L.CRS.EPSG4326
    });
    var staydry2 = L.tileLayer.wms("https://hazards.fema.gov/gis/nfhl/services/KMZ/StayDry/MapServer/WmsServer", {
        layers: 2,
        format: 'image/png',
        transparent:true,
        style:'default',
        crs:L.CRS.EPSG4326
    });
    var staydry3 = L.tileLayer.wms("https://hazards.fema.gov/gis/nfhl/services/KMZ/StayDry/MapServer/WmsServer", {
        layers: 1,
        format: 'image/png',
        transparent:true,
        style:'default',
        crs:L.CRS.EPSG4326
    });
    var staydry4 = L.tileLayer.wms("https://hazards.fema.gov/gis/nfhl/services/KMZ/StayDry/MapServer/WmsServer", {
        layers: 0,
        format: 'image/png',
        transparent:true,
        style:'default',
        crs:L.CRS.EPSG4326
    });
    // var testLayers = {
    //   'fema1':fema1,
    //   'poland':nexrad
    // }

    var baseLayers = {
      "Street Map": mapquestOSM,
      "Aerial Imagery": mapquestOAM,
      "Imagery with Streets": mapquestHYB,
      "Aerial Imagery with Terrain" : mbTerrainSat,
      "Terrain Contours": mbTerrainReg
    };
   
    var layerControl = L.control.layers(baseLayers, {}, {
      collapsed: false
    }).addTo(mesonet.map);

    L.control.scale().addTo(mesonet.map);
    /*load and differentiate leaflet-tile layers for use with sidebar layer control*/
    mesonet.map.addLayer(rainfall);
    $('.leaflet-tile-pane .leaflet-layer').last().css('z-index',7).attr('id','rainfall').hide();

    mesonet.map.addLayer(staydry);
    $('.leaflet-tile-pane .leaflet-layer').last().css('z-index',8).attr('id','staydry').hide();

    mesonet.map.addLayer(staydry2);
    $('.leaflet-tile-pane .leaflet-layer').last().css('z-index',8).attr('id','staydry2').hide();
    
    mesonet.map.addLayer(staydry3);
    $('.leaflet-tile-pane .leaflet-layer').last().css('z-index',8).attr('id','staydry3').hide();

    mesonet.map.addLayer(staydry4);
    $('.leaflet-tile-pane .leaflet-layer').last().css('z-index',8).attr('id','staydry4').hide();

    mesonet.map.addLayer(floodplains);
    $('.leaflet-tile-pane .leaflet-layer').last().css('z-index',9).attr('id','floodplains').hide();   

    /*Necessary for Loading Sidebar Properly*/
    var sidebarLoaded = false; 
    $("#layers").click(function(){
      if(!sidebarLoaded){
        mesonet.sidebar = L.control.sidebar('sidebar', { position: 'left'});
        mesonet.map.addControl(mesonet.sidebar);
        sidebarLoaded = true;
        mesonet.sidebar.show();
      }else{
        mesonet.sidebar.toggle();
      }
    });


    
    /* Functionality for Zoom to Extent*/
  $( "#zoom" ).click(function(map) {
      mesonet.map.setView([42.76314586689494,-74.7509765625], 7);
  });

  $( "#saveBtn" ).click(function() {
      
      $('#saveNote').show().delay(1000).fadeOut(500);

  });

   $( ".btnDelete" ).click(function() 
{      
      $('#saveNote').show().delay(1000).fadeOut(500);

  });

    popup.init();
    /* Placeholder hack for IE */
    if (navigator.appName == "Microsoft Internet Explorer") {
      $("input").each(function () {
        if ($(this).val() === "" && $(this).attr("placeholder") !== "") {
          $(this).val($(this).attr("placeholder"));
          $(this).focus(function () {
            if ($(this).val() === $(this).attr("placeholder")) $(this).val("");
          });
          $(this).blur(function () {
            if ($(this).val() === "") $(this).val($(this).attr("placeholder"));
          });
        }
      });
    }
  }
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
var popup = {

    init : function() {

    // position popup
    //windowW = $(window).width();
    $("#map").on("mousemove", function(e) {
      
      var x = e.pageX + 20;
      var y = e.pageY;
      var windowH = $(window).height();
      if (y > (windowH - 100)) {
        y = e.pageY - 100;
      } else {
        y = e.pageY - 20;
      }

      $("#info").css({
        "left": x,
        "top": y
      });
    });

  }

};