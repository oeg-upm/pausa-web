//const path = "/base/data/"
const path = "/python/geojsons/"
function getComMadrid(){
  console.log(path + 'comunidadMadrid.geojson.json')
  return new Promise((resolve, reject) => {
    axios.get(path + 'comunidadMadrid.geojson.json?' + Date.now().toString())
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
function getMadrid(){
console.log(path + 'madrid.distritos.geojson.json')
  return new Promise((resolve, reject) => {
    axios.get(path + 'madrid.distritos.geojson.json?' + Date.now().toString())
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
function getParques(){
  return new Promise((resolve, reject) => {
    axios.get(path + 'ENP_CMadrid.geojson.json?' + Date.now().toString())
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
function getComarcas(){
  return new Promise((resolve, reject) => {
    axios.get(path + 'ComarcasAgrariasCM.geojson.json?' + Date.now().toString())
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

// function loadJSON(){
//   return new Promise((resolve, reject) => {
//     axios.get(path + 'data.json').then((response) => {
//       resolve(response.data);
//     }).catch((err) => { reject(err)})
//   });
// }
// function insertData(geoLocations, data){
//   gjLayer = L.geoJson(geoLocations)
//   let poligon = null
//   for (let desc in data){
//   if(  Object.keys(data[desc]).includes('centroid_y') &&  Object.keys(data[desc]).includes('centroid_x') ){
//     let coordinate = L.latLng(parseFloat(data[desc].centroid_y),parseFloat(data[desc].centroid_x))
//     poligon = leafletPip.pointInLayer(coordinate,gjLayer, false)
//     // console.log(poligon)
//     // console.log(gjLayer.getLayer(poligon[0]._leaflet_id).feature.properties)
//   }

//   }
// }
