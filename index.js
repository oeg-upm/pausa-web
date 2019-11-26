function Map(geoLocations){

  function refreshMap(){
      var remove = document.getElementById('map');
      remove.parentNode.removeChild(remove)
      var p = document.getElementById('mapJumbotron')
      var element = document.createElement('div');
      element.setAttribute('id', 'map');
      p.appendChild(element)
  }

  refreshMap();

  var map = L.map('map', {

  });

  map.createPane('labels');

  // This pane is above markers but below popups
  map.getPane('labels').style.zIndex = 650;

  // Layers in this pane are non-interactive and do not obscure mouse/touch events
  map.getPane('labels').style.pointerEvents = 'none';

  var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

      var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
          attribution: cartodbAttribution
      }).addTo(map);

  var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
      attribution: cartodbAttribution,
      pane: 'labels'
  }).addTo(map);



  function getColor(d) {
      return d == 1 ? '#800026' : 
          d == 2 ? '#1570BF' : 
          d == 3 ? '#38A673' : 
          d == 4 ? '#F2D129' : 
          d == 5 ? '#F26430' : 
          d == 6 ? '#F22F1D' : 
          d == 7 ? '#F22E62' : 
          '#3bb300'; 
  }

  function style(feature) { 
      return { 
      fillColor: getColor(
      feature.properties.mapcolor7), 
      weight: 1, 
      opacity: 1, 
      color: 'white', 
      dashArray: '', 
      fillOpacity: 0.3
      }; 
      }


      L.geoJson(geoLocations, { style: style }).addTo(map);



  geojson = L.geoJson(geoLocations).addTo(map);

  
  map.fitBounds(L.geoJson(geoLocations).getBounds())
  // map.setVgeoLocationsiew({ lat: 47.040182144806664, lng: 9.667968750000002 }, 2);


  function highlightFeature(e) {
      var layer = e.target;

      layer.setStyle({
          weight: 1,
          color: '#959696',
          dashArray: '',
          opacity: 1,
          fillOpacity: 1
      });

      

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
  }



      function resetHighlight(e) {
          geojson.resetStyle(e.target);
      }




      var geojson;
      // ... our listeners
      geojson = L.geoJson(geoLocations);

      function zoomToFeature(e) {
          map.fitBounds(e.target.getBounds());
      }




      function onEachFeature(feature, layer){
          layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
          });
          layer.bindPopup(function (layer){
              // console.log(layer.feature.properties.adm0_a3);
              return layer.feature.properties.nameunit;
          });
          
      }

      geojson = L.geoJson(geoLocations, {
          style: style,
          onEachFeature: onEachFeature
      }).addTo(map);


  //  AQUÍ TERMINA LA PARTE DEL MAPA
}
function init() {
// Parse JSON string into object
  var geoLocations = getMadrid();
  Map(geoLocations);
}
init();
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })