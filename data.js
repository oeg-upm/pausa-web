function getMadrid(){
  return new Promise((resolve, reject) => {
    axios.get('python/geoJsons/madrid.distritos.geojson.json')
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
function getParques(){
  return new Promise((resolve, reject) => {
    axios.get('python/geoJsons/ENP_CMadrid.geojson.json')
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })  
}
function getComarcas(){
  return new Promise((resolve, reject) => {
    axios.get('python/geoJsons/ComarcasAgrariasCM.geojson.json')
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })  
}

function loadJSON(){
  return new Promise((resolve, reject) => {
    axios.get('data.json').then((response) => {
      resolve(response.data);
    }).catch((err) => { reject(err)})
  });
}
function insertData(geoLocations, data){
  gjLayer = L.geoJson(geoLocations)
  let poligon = null
  for (let desc in data){
  if(  Object.keys(data[desc]).includes('centroid_y') &&  Object.keys(data[desc]).includes('centroid_x') ){
    let coordinate = L.latLng(parseFloat(data[desc].centroid_y),parseFloat(data[desc].centroid_x))
    poligon = leafletPip.pointInLayer(coordinate,gjLayer, false)
    console.log(poligon)
    console.log(  gjLayer.getLayer(poligon[0]._leaflet_id).feature.properties)
  }

  }
}
// function updateData(){
//   return new Promise((resolve, reject) => {
//     loadJSON().then((data) => {
//       resolve(JSON.parse(data))
//     }).catch((err) =>{
//       reject(err)
//     });
//   })
// }
