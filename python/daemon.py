import os
import urllib.request
import urllib.parse
import json
from shapely.geometry import shape, Point
packageListUrl='https://gopausa.linkeddata.es/api/3/action/package_list'
packageInfoUrl='https://gopausa.linkeddata.es/api/3/action/package_show?id='
datasetLink = 'https://gopausa.linkeddata.es/dataset/'
links = [
            'https://raw.githubusercontent.com/oeg-upm/pausa-web/master/ComarcasAgrariasCM.geojson.json',
            'https://raw.githubusercontent.com/oeg-upm/pausa-web/master/madrid.distritos.geojson.json',
            'https://raw.githubusercontent.com/oeg-upm/pausa-web/master/comunidadMadrid.geojson.json'
            ]
geojsonPath = './geojsons/'
codePath = "./"
def getPackageList():
    try:
        res = urllib.request.urlopen(packageListUrl)
        resJson = json.loads(res.read().decode('utf-8'))
        if(not resJson['success']):
            raise ValueError('Failed Request')
        else:
            return resJson['result']
    except ValueError:
       print(ValueError)
       raise
    except Exception as err:
        print("Something goes wrong")
        print(err)
        raise
def getPackageData(packages):
    result = {}
    oo= False
    for package in packages:
        try:
            res = urllib.request.urlopen(packageInfoUrl + package)
            resJson = json.loads(res.read())
            #if( not oo):
                # oo=True
                # print(json.dumps(resJson, indent=2))
            if('success' in resJson.keys() and
                resJson['success'] is True and
                'result' in resJson.keys() and
                'descriptor_geografico' in resJson['result'].keys() and
                len(resJson['result']['descriptor_geografico']) > 0
                ):
                data =  resJson['result']['descriptor_geografico'].split('\t')
                name = resJson['result']['title']
                if(data[0] not in result.keys()):
                    result[data[0]] = {'datasets':[]}
                result[data[0]]['datasets'].append({
                        'datasetName': package,
                        'desc':data[0],
                        'name':name,
                        'link':datasetLink + package
                        })

            else:
                raise ValueError('Invalid dataset: ' + package)
        except ValueError as vErr:
            print(vErr)
            pass
        except Exception as err:
            print("Something goes wrong")
            print(err)
            raise
    return result
def linkDataWithCoordinates(data):
    descriptores = json.loads(str(open(codePath + 'descriptores.json').read()))
    result = {}
    for descriptor in descriptores.keys():
        if descriptor in data.keys():
            result[descriptor] = {}
            for key in descriptores[descriptor].keys():
                result[descriptor][key] = descriptores[descriptor][key]
            for key in data[descriptor].keys():
                if(key not in result[descriptor].keys()):
                    result[descriptor][key] = data[descriptor][key]
    return result
def downloadGeojsons():
    for link in links:
        res = urllib.request.urlopen(link)
        resJson = json.loads(res.read().decode('utf-8'))
        f = open(geojsonPath  + link.split("/")[-1], 'w', encoding='utf-8')
        f.write(json.dumps(resJson, indent=2))
        f.close()
        #os.system("wget -O /geojsons/" + link.split("/")[-1] + " " + link)
def addDatasetsToGeojsons(datasets):
    geoJsons = []
    for link in links:
        geoJsons.append(json.loads(open(geojsonPath  + link.split("/")[-1]).read()))
    for i,geoJson in enumerate(geoJsons):
        for j,feature in enumerate(geoJson["features"]):
            polygon = shape(feature['geometry'])
            if('datasets' not in geoJsons[i]["features"][j]["properties"].keys()):
                geoJsons[i]["features"][j]["properties"]['datasets'] = []
            includedDatasets = 0
            for desc in datasets:
                if("centroid_x" in datasets[desc].keys() and
                "centroid_y" in datasets[desc].keys() and
                datasets[desc]['centroid_x'] != '' and
                datasets[desc]['centroid_y'] != ''):
                    # print(datasets[desc])
                    point = Point(float(datasets[desc]["centroid_x"]), float(datasets[desc]["centroid_y"]))
                    if(polygon.contains(point)):
                        print(f'Includes: {desc}')
                        _datasets = geoJsons[i]["features"][j]["properties"]["datasets"] 
                        geoJsons[i]["features"][j]["properties"].update(datasets[desc])
                        geoJsons[i]["features"][j]["properties"]["datasets"] += _datasets 
                        includedDatasets += 1
            if includedDatasets == len(datasets):
                break
        with open(geojsonPath + links[i].split("/")[-1], 'w') as f:
            f.write(json.dumps(geoJsons[i], indent=2))




def main():
    packages = getPackageList()
    #print(packages)
    packagesData = getPackageData(packages)
    #print(json.dumps(packagesData, indent=2))

    data = linkDataWithCoordinates(packagesData)
    downloadGeojsons()
    addDatasetsToGeojsons(data)
    with open(codePath + 'datasetsInfo.json', 'w') as f:
        f.write(json.dumps(data, indent=2))
#    print(json.dumps(data, indent=2))

if __name__ == '__main__':
    main()
