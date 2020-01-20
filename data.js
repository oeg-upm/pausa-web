function getMadrid(){
    let data = httpGet('https://raw.githubusercontent.com/oeg-upm/pausa-web/master/madrid.distritos.geojson.json');
    console.log(data);
    console.log(JSON.parse(data));
    return JSON.parse(data);
}
function getParques(){
  let data = httpGet('https://raw.githubusercontent.com/oeg-upm/pausa-web/master/ENP_CMadrid.geojson.js');
  console.log(data);
  console.log(JSON.parse(data));
  return JSON.parse(data);

}
function getComarcas(){
  let data = httpGet('https://raw.githubusercontent.com/oeg-upm/pausa-web/master/ComarcasAgrariasCM.geojson.js');
  console.log(data);
  console.log(JSON.parse(data));
  return JSON.parse(data);

}
function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}