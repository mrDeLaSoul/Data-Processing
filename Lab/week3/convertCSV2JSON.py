import csv
import json

# Constants to make everything easier
CSV_PATH = './GEMIDDELDE_NEERSLAG_2016.csv'
f = open(CSV_PATH, 'rt')
# Reads the file the same way that you did
csv_file = csv.reader(f)
# Created a list and adds the rows to the list
jsonlist = []
for row in csv_file:
    row = row[0].split(";")
    # Save header row.
    rowdict = {"firstkey": row[0], "secondkey": row[1]}
    print rowdict
    jsonlist.append(rowdict)
print jsonlist

# Writes the json output to the file
with open('jsonfile.json', 'w') as outfile:
    json.dump(jsonlist, outfile)