

import csv
from datetime import *
import pyrebase # learn more: https://python.org/pypi/Pyrebase


# config = { # Pascals Firebase
#     "apiKey": "AIzaSyCDn9U08D4Lzhrbfz2MSy2rws_D02eH3HA",
#     "authDomain": "testproject-a0746.firebaseapp.com",
#     "databaseURL": "https://testproject-a0746.firebaseio.com",
#     "projectId": "testproject-a0746",
#     "storageBucket": "testproject-a0746.appspot.com",
#     "messagingSenderId": "826197220845"
# }

config = { # Fenoms Firebase
    "apiKey": "AIzaSyAt0uIAVOFjB42_bkwrEIqhSWkMT_VmluI",
    "authDomain": "data-reaper.firebaseapp.com",
    "databaseURL": "https://data-reaper.firebaseio.com",
    "projectId": "data-reaper",
    "storageBucket": "data-reaper.appspot.com",
    "messagingSenderId": "1079276848174"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
user = auth.sign_in_with_email_and_password('admin01@vs.com', '2\!vEJ:6L]mh5R[z')
DB = firebase.database()






FILENAME = 'live.csv'      # csv file to read from
dataBranch = 'data' # upload target'data'




timeIntervals_ladder = { # time in [days]

    'lastDay':      1,  # class ladder 24h
    'last2Weeks':   14, # archetype overview last 14 days
}

timeIntervals_table = {

    'last2Weeks':   14,
}


timeIntervals_history = {     # no history data
}

rankIntervals = {# rankName: [startRank, endRank] -> rank <= endRank && rank >= startRank

    'ranks_all':    [0,20], # only combined ranks for table data
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
    #hsArchetypes[f].append(['','Other']) # unidentified class
    
                


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
            'name':'tot', #last line is the total of all archetypes
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

    # Sort Archetypes
    for f in hsFormats:
        if len(hsArchetypes[f]) <= 9:
            continue 
        hsArchetypes[f] = hsArchetypes[f][:9] + sorted(hsArchetypes[f][9:])


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
            dt = datetime(int(dr[:4]),int(dr[5:7]),int(dr[8:10]),int(dr[11:13]),int(dr[14:16]))
            if count == 1:
                lastDate = dt
                for f in hsFormats:
                    L[f] = {}
                    T[f] = {}
                    H[f] = {}


                    for t in timeIntervals_history:
                        H[f][t] = {}
                        for r in rankIntervals:
                            H[f][t][r] = {}
                            H[f][t][r]['classes'] = newHistory(hsClasses, timeIntervals_history[t])
                            H[f][t][r]['decks'] = newHistory(hsArchetypes[f], timeIntervals_history[t])
                    
                    for t in timeIntervals_ladder:
                        L[f][t] = newLadder(dt, hsArchetypes[f])

                    for t in timeIntervals_table:
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
                t_delta = datetime.utcnow() - dt
                days = t_delta.days                
                hours = int(t_delta.seconds/3600 + days*24) 
                
                options = {'classes':idx_class_op,'decks':idx_op}
               

                """
                if t_delta.days < 1:
                    for r in rankIntervals:
                        if rank >= rankIntervals[r][0] and rank <= rankIntervals[r][1]:
                            for o in options:
                                H[hsFormat]['lastHours'][r][o][-1]['data'][hours] += 1
                                H[hsFormat]['lastHours'][r][o][options[o]]['data'][hours] += 1
         
                if t_delta.days < timeIntervals_history['lastDays']:       
                    for r in rankIntervals:
                        if rank >= rankIntervals[r][0] and rank <= rankIntervals[r][1]:
                            for o in options:
                                days = int(t_delta.days)
                                H[hsFormat]['lastDays'][r][o][-1]['data'][days] += 1
                                H[hsFormat]['lastDays'][r][o][options[o]]['data'][days] += 1
                """
                
                
                for t in timeIntervals_ladder:
                    if 'Hours' not in t and t_delta.days >= timeIntervals_ladder[t]:
                        continue
                    if 'Hours' in t and hours >= timeIntervals_ladder[t]:
                        continue

                    L[hsFormat][t]['rankData'][rank][idx_op] += 1
                    L[hsFormat][t]['gamesPerRank'][rank] += 1
                    L[hsFormat][t]['classRankData'][rank][idx_class_op] += 1


                if he_arch in hsArchetypes[hsFormat]:
                    idx_he = hsArchetypes[hsFormat].index(he_arch)
                    res = 0 if row[7] == 'win' else 1
                    
                    for t in timeIntervals_table:
                        if 'Hours' not in t and t_delta.days >= timeIntervals_table[t]:
                            continue
                        if 'Hours' in t and hours >= timeIntervals_table[t]:
                            continue
                            
                        for r in rankIntervals:
                            if rank >= rankIntervals[r][0] and rank <= rankIntervals[r][1]:
                                T[hsFormat][t][r]['table'][idx_he][idx_op][res] += 1
                                T[hsFormat][t][r]['frequency'][idx_op] += 1
          



                
            count += 1
            #if count % 1000 == 0:
            #    print(count)
        
        #normalize stuff here
        """
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
        """
        #upload stuff here

        DB.child(dataBranch).child("ladderData").set(  L, user['idToken'])
        DB.child(dataBranch).child("tableData").set(   T, user['idToken'])
        #DB.child(dataBranch).child("historyData").set( H, user['idToken'])

            


if __name__ == "__main__":
    run()



















    


