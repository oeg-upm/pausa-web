import os
import urllib.request
import urllib.parse
import json
from shapely.geometry import shape, Point
packageListUrl='https://gopausa.oeg-upm.net/api/3/action/package_list'
packageInfoUrl='https://gopausa.oeg-upm.net/api/3/action/package_show?id='
datasetLink = 'https://gopausa.oeg-upm.net/dataset/'
links = [
            'https://raw.githubusercontent.com/oeg-upm/pausa-web/master/ComarcasAgrariasCM.geojson.json',
            'https://raw.githubusercontent.com/oeg-upm/pausa-web/master/madrid.distritos.geojson.json'
            ]

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
    for package in packages:
        try:
            res = urllib.request.urlopen(packageInfoUrl + package)
            resJson = json.loads(res.read())
            if('success' in resJson.keys() and 
                resJson['success'] is True and
                'result' in resJson.keys() and 
                'descriptor_geografico' in resJson['result'].keys() and
                len(resJson['result']['descriptor_geografico']) > 0
                ):
                data =  resJson['result']['descriptor_geografico'].split(' ')
                result[data[0]] = {
                        'datasetName': package, 
                        'desc':data[0],
                        'name':data[1] if len(data) > 1 else "",
                        'link':datasetLink + package
                        }
               
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
    descriptores = json.loads(str(open('descriptores.json').read()))
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
        os.system("wget -O ./geoJsons/" + link.split("/")[-1] + " " + link)
def addDatasetsToGeojsons(datasets):
    geoJsons = []
    for link in links:
        geoJsons.append(json.loads(open('./geoJsons/' + link.split("/")[-1]).read()))
    for i,geoJson in enumerate(geoJsons):
        for j,feature in enumerate(geoJson["features"]):
            polygon = shape(feature['geometry'])
            geoJsons[i]["features"][j]["properties"]['datasets'] = []
            includedDatasets = 0
            print(polygon.bounds)
            for desc in datasets:
                if("centroid_x" in datasets[desc].keys() and "centroid_y" in datasets[desc].keys()):
                    point = Point(float(datasets[desc]["centroid_x"]), float(datasets[desc]["centroid_y"]))
                    print("DONDE METEREMOS ESTE PUNTO? " + str(point))
                    if(polygon.contains(point)):
                        print("METEMOS " + desc + " EN " + links[i].split("/")[-1])
                        geoJsons[i]["features"][j]["properties"]["datasets"].append(datasets[desc])
                        includedDatasets += 1
            if includedDatasets == len(datasets):
                break
        with open('./geoJsons/'+ links[i].split("/")[-1], 'w') as f:
            f.write(json.dumps(geoJsons[i], indent=2))


                    

def main():
    packages = getPackageList()
    print(packages)
    packagesData = getPackageData(packages)
    data = linkDataWithCoordinates(packagesData)
    downloadGeojsons();
    addDatasetsToGeojsons(data)
    with open('datasetsInfo.json', 'w') as f:
        f.write(json.dumps(data, indent=2))
#    print(json.dumps(data, indent=2))

if __name__ == '__main__':
    main()
