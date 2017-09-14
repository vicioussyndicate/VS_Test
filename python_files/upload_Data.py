

import csv
from datetime import *
import pyrebase # learn more: https://python.org/pypi/Pyrebase


config = {
    "apiKey": "AIzaSyCDn9U08D4Lzhrbfz2MSy2rws_D02eH3HA",
    "authDomain": "testproject-a0746.firebaseapp.com",
    "databaseURL": "https://testproject-a0746.firebaseio.com",
    "projectId": "testproject-a0746",
    "storageBucket": "testproject-a0746.appspot.com",
    "messagingSenderId": "826197220845"

}

firebase = pyrebase.initialize_app(config)


auth = firebase.auth()

DB = firebase.database()






FILENAME = 'live.csv'

timeIntervals = {

    'lastDay':      1, # time in [days]
    'lastWeek':     7,
    'last2Weeks':   14,
    'last3Weeks':   21,
    'lastMonth':    30,
}

rankIntervals = {

    'ranks_all':    [0,20], # rankName: [startRank, endRank] -> rank <= endRank && rank >= startRank
    'ranks_L':      [0,0],
    'ranks_L_5':    [0,5],
    'ranks_6_15':   [6,15],

}


timeSpans = {        # for history
    'lastHours': 24,
    'lastDays': 30
}




hsRanks = 21
hsFormats = ['Standard','Wild']
hsClasses = ['Druid','Hunter','Mage','Paladin','Priest','Rogue','Shaman','Warlock','Warrior']



hsArchetypes = {}

# Default Archetypes
for f in hsFormats:
    hsArchetypes[f] = []
    for c in hsClasses:
        hsArchetypes[f].append([c,'Other']) # placeholder archetypes
    hsArchetypes[f].append(['','Other']) # unidentified class
    
                


def getCSVFile(path):
    f = open(path,encoding='latin-1')
    reader=csv.reader(f)
    return list(reader)


def newLadder(t, archetypes):
    ladder = {  'timeStart':[t.year,t.month,t.day,t.hour,t.minute],
                'timeEnd':[],
                'archetypes':archetypes,
                'gamesPerRank':[0 for x in range(hsRanks)],
                'rankData':[[0 for x in range(len(archetypes))] for y in range(hsRanks)],
                'classRankData':[[0 for x in range(9)] for y in range(hsRanks)]}
    return ladder



def newTable(t, archetypes):
    table = {   'timeStart':[t.year,t.month,t.day,t.hour,t.minute],
                'timeEnd':[],
                'archetypes':archetypes,
                'frequency':[0 for x in range(len(archetypes))],
                'table': [[[0,0] for x in range(len(archetypes))] for y in range(len(archetypes))]}
    return table



def newHistory(archetypes, d):
    history = []
    for a in archetypes:
        history.append({
            'name': a if type(a) is str else a[1]+" "+a[0],
            'avg':0,
            'data':[0 for x in range(d)],
        })
            
    history.append({
            'name':'tot',
            'avg':0,
            'data':[0 for x in range(d)],
            })
            
    return history
                  
    
    
    
    
    
    







def run():

    # Get all Archetypes:
    
    with open(FILENAME, "r") as csvfile:
        datareader = csv.reader(csvfile)
        count = 0
        
        for row in datareader:
            if count == 0:
                count = 1
                continue
                
            hsFormat = row[12] # ??
            if hsFormat not in hsFormats:
                continue
                     
            op_arch = [row[4],row[5]]
            if op_arch[1] == '':
                op_arch[1] = 'Other'
                
            if op_arch not in hsArchetypes[hsFormat]:
                hsArchetypes[hsFormat].append(op_arch)
                
            count += 1


    # GET DATA

    with open(FILENAME, "r") as csvfile:
        datareader = csv.reader(csvfile)
        count = 0
        countBreak = pow(10,10)
        
        # Data: ladder, table, history
        L = {}
        T = {}
        H = {}
        
        #
        #                                H
        #                              /  \
        #                      Standard   Wild
        #                       /     \ 
        #               lastDays      lastHours 
        #               /     \\\
        #          ranks_all   rankIntervals
        #           /     \
        #      decks       classes    
        #       /
        #   [{ name, data, avg },...] <- History element

        for row in datareader:
            if count > countBreak:
                break
            if count == 0:
                count = 1
                continue
            
            
            dr = row[11]
            dt = datetime(int(dr[:4]),int(dr[5:7]),int(dr[8:10]),int(dr[11:13]))
            if count == 1:
                lastDate = dt
                for f in hsFormats:
                    L[f] = {}
                    T[f] = {}
                    H[f] = {}


                    for t in timeSpans:
                        H[f][t] = {}
                        for r in rankIntervals:
                            H[f][t][r] = {}
                            H[f][t][r]['classes'] = newHistory(hsClasses, timeSpans[t])
                            H[f][t][r]['decks'] = newHistory(hsArchetypes[f], timeSpans[t])
                    
                    for t in timeIntervals:
                        L[f][t] = newLadder(dt, hsArchetypes[f])
                        T[f][t] = {}
                        for r in rankIntervals:
                            T[f][t][r] = newTable(dt, hsArchetypes[f])
                

            
            hsFormat = row[12] # ??
            if hsFormat not in hsFormats:
                continue
            
            rank = int(row[9])
            if rank not in range(hsRanks):
                rank = 20
            
            if row[5] == '':
                row[5] = 'Other'
            if row[3] == '':
                row[3] = 'Other'
            
            he_arch = [row[2],row[3]]
            op_arch = [row[4],row[5]]
            
            
            # ADD DATA
            if op_arch in hsArchetypes[hsFormat]:
                idx_op = hsArchetypes[hsFormat].index(op_arch)
                idx_class_op = hsClasses.index(op_arch[0])
                t_delta = datetime.now() - dt
                
                t_H = 'lastDays' if t_delta.days > 1 else 'lastHours'
                t = t_delta.days if t_delta.days > 1 else int(t_delta.seconds/3600)
                
                options = {'classes':idx_class_op,'decks':idx_op}
               
                if t_delta.days < 1:
                    hours = int(t_delta.seconds/3600)
                    for r in rankIntervals:
                        if rank >= rankIntervals[r][0] and rank <= rankIntervals[r][1]:
                            for o in options:
                                H[hsFormat]['lastHours'][r][o][-1]['data'][hours] += 1
                                H[hsFormat]['lastHours'][r][o][options[o]]['data'][hours] += 1
         
                if t_delta.days < 100:       
                    for r in rankIntervals:
                        if rank >= rankIntervals[r][0] and rank <= rankIntervals[r][1]:
                            for o in options:
                                H[hsFormat]['lastDays'][r][o][-1]['data'][hours] += 1
                                H[hsFormat]['lastDays'][r][o][options[o]]['data'][hours] += 1
                
                
                
                for t in timeIntervals:
                    if t_delta.days < timeIntervals[t]:
                        L[hsFormat][t]['rankData'][rank][idx_op] += 1
                        L[hsFormat][t]['gamesPerRank'][rank] += 1
                        L[hsFormat][t]['classRankData'][rank][idx_class_op] += 1

                if he_arch in hsArchetypes[hsFormat]:
                    idx_he = hsArchetypes[hsFormat].index(he_arch)
                    res = 0 if row[7] == 'win' else 1
                    
                    for t in timeIntervals:
                        if t_delta.days >= timeIntervals[t]:
                            continue
                            
                        for r in rankIntervals:
                            if rank >= rankIntervals[r][0] and rank <= rankIntervals[r][1]:
                                T[hsFormat][t][r]['table'][idx_he][idx_op][res] += 1
                                T[hsFormat][t][r]['frequency'][idx_op] += 1
          



                
            count += 1
            if count % 1000 == 0:
                print(count)
        
        #normalize stuff here
        for f in hsFormats:
            for t in ['lastHours','lastDays']:
                for r in rankIntervals:
                    for o in ['classes','decks']:
                        archetypes = H[f][t][r][o]
                        tot = archetypes[-1]['data']
                        for a in range(len(archetypes)-1):
                            avg = 0
                            for d in range(len(H[f][t][r][o][a]['data'])):
                                if tot[d] >0:
                                    H[f][t][r][o][a]['data'][d] /= tot[d]
                                    avg += H[f][t][r][o][a]['data'][d]
                                    
                            H[f][t][r][o][a]['avg'] = avg/len(H[f][t][r][o][a]['data'])
        
        #upload stuff here

        DB.child("Branch").child("ladderData").set(L)
        DB.child("Branch").child("tableData").set(T)
        DB.child("Branch").child("historyData").set(H)

            


if __name__ == "__main__":
    run()



















    


