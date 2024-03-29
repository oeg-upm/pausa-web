
function Map(geoLocations){
    function refreshMap(){
      document.getElementById('mapJumbotron').innerHTML = "<div id='map'></div>";
    }
  
    refreshMap();
  
    var map = L.map('map');
  
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
  
  
  
    function getColor(data) {
        const d = data.length
        return d == 0 ? '#38b500' : d < 3 ? '#f6d743': d < 10 ? '#fb8500':'#e63946'
   
    }
  
    function style(feature) { 
  const color = Object.keys(feature.properties).includes('datasets') ? (
              feature.properties.datasets
          ):0
        return { 
        fillColor: getColor(color), 
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
        function showDatasets(layerProps){
            if(Object.keys(layerProps).includes('datasets') && layerProps.datasets.length !== 0){
  //	      datasetsLayer.addLayer(layer)
                // console.log(layerProps)
                let datasets = "<ul>"
                layerProps.datasets.forEach((el) => {
                  datasets += `<li><a href="${el.link}">${el.name}</a></li>`
                });
                datasets += "</ul>"
                let name = Object.keys(layerProps).includes('nameunit') ? layerProps.nameunit:layerProps.NOM_COMAR
                let modal = `
              <div id="modal" class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Datasets de ${name}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                     ${datasets}
                    </div>
                  </div>
                </div>
              </div>`
              document.getElementById("modal-wrapper").innerHTML = modal;
              $("#modal").modal()
            }
        }
  
  
  
        function onEachFeature(feature, layer){
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: (e) =>{showDatasets(layer.feature.properties)}
            });
            let datasetLength= Object.keys(layer.feature.properties).includes('datasets') ?layer.feature.properties.datasets.length.toString():'0';
            const myIcon = L.divIcon({
              className: 'datasetIndicatorDiv',
              html: `<span class="datasetIndicator my-auto">${datasetLength}</span>`,
              iconSize: [25, 25],
              //iconAnchor: [18, 30]
              iconAnchor: [10, 33]
            });
            const bounds = layer.getBounds();
            const latLng = bounds.getCenter();
            if(datasetLength > 0){
              L.marker(latLng,{
                icon:myIcon
              }).addTo(map)
            }

            layer.bindTooltip(`Datasets: ${datasetLength}`,{opacity:1}).bringToFront()
          //   layer.bindPopup(function (layer){
                // console.log(layer.feature.properties.adm0_a3);
          //       return '' + layer.feature.properties.nameunit;
          //   });
            
        }
  
        geojson = L.geoJson(geoLocations, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

  
  
  
    //  AQUÍ TERMINA LA PARTE DEL MAPA
  }
  function init() {
  // Parse JSON string into object
      getComMadrid().then((data) => {
        Map(data);
      })
      .catch((err) => {
           console.log(err)
      });
  }
  function changeLayer(layerName){
    //   console.log("Cambiamos a: " + layerName)
      if(layerName == 'Comarcas'){
           getComarcas().then((data) =>{
               Map(data);
           }).catch((err) => {
            //    console.log(layerName)
            //    console.log(err)
           })
      }else if( layerName == 'Espacios Naturales'){
           getParques().then((data) =>{
               Map(data);
           }).catch((err) => {
            //    console.log(layerName)
            //    console.log(err)
           })
      }else if(layerName== 'Distritos'){
          getMadrid().then((data) =>{
              Map(data);
          }).catch((err) => {
            //   console.log(layerName)
            //   console.log(err)
          })
      }else{
        getComMadrid().then((data) => {
          Map(data)
        }).catch((err) => {console.log(err)})
      }
      $("#filtro").html(layerName + "")
  
  }
  init();
  $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  
