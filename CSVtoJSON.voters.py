import csv
import json
import pymongo

housedict = {
    'c': 'challengers',
    'e': 'explorers',
    'p': 'pioneers',
    'v': 'voyagers',
    ' ': '-'
}

csvfile = open('voters.csv', 'r')
#jsonfile = open('file.json', 'w')

fieldnames = 'name,grade,sec,house'.split(',')
voters = eval(json.dumps([row for row in csv.DictReader(csvfile, fieldnames)]))
for v in voters: 
    v['voted'] = 0
    #v['grade'] = 11
    v['house'] = housedict[v['house'][0].lower()] if v['house'] else '-'
        
client = pymongo.MongoClient("mongodb://localhost:27017/")
voterscol = client['elect']['voters']
res = voterscol.insert_many(voters)
print(res.inserted_ids)

#print(reader)

##for row in reader:
##    print(row)
##    json.dump(row, jsonfile)
##    jsonfile.write('\n')
#jsonfile.close()
