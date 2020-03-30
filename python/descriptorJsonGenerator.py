import json
import csv
def readCsv(file_):
    result= {}
    structure = ['desc', 'name', 'centroid_x', 'centroid_y', 'x_utm', 'y_utm']
    with open(file_, 'r') as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader):
            result[row[0]] = {}
            for j, column in enumerate(row):
                result[row[0]][structure[j]] = column

    return result

def main():
    data = readCsv('descriptores.csv')
    with open('descriptores.json', 'a') as f:
        f.write(json.dumps(data, indent=2))

if __name__ == '__main__':
    main()
