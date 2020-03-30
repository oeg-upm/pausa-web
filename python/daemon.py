import urllib.request
import urllib.parse
import json
packageListUrl='https://gopausa.oeg-upm.net/api/3/action/package_list'
packageInfoUrl='https://gopausa.oeg-upm.net/api/3/action/package_show?id='
datasetLink = 'https://gopausa.oeg-upm.net/dataset/'
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
                result[package] = {
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

def main():
    packages = getPackageList()
    print(packages)
    packagesData = getPackageData(packages)
    print(json.dumps(packagesData))

if __name__ == '__main__':
    main()
