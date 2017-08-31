

#[id, mode, hero, hero_deck, op, op_deck, coin, result, duration, region, country, city, version]
#
# 0: id
# 1: hero
# 2: hero_deck
# 3: op
# 4: op_deck

# Creates 	games_std_2017_08_22_1200
# Creates	games_wild_2017_08_22_1200


import csv
from datetime import *
import json

# Link up firebase
from firebase import firebase
firebase = firebase.FirebaseApplication("https://testproject-a0746.firebaseio.com/")

DRFILENAME = 'Sources/datareaper.csv'


	
hsRanks = 21
hsFormat = 'Wild'


hsArchetypes = [['Druid','Other'],
				['Hunter','Other'],
				['Mage','Other'],
				['Paladin','Other'],
				['Priest','Other'],
				['Rogue','Other'],
				['Shaman','Other'],
				['Warlock','Other'],
				['Warrior','Other'],
				['', 'Other']]
				


def getCSVFile(path):
    f = open(path,encoding='latin-1')
    reader=csv.reader(f)
    return list(reader)


def newLadder(t):
	ladder = {  'timeStart':[t.year,t.month,t.day,t.hour,t.minute],
				'timeEnd':[],
				'hsFormat': hsFormat,
                'archetypes':hsArchetypes,
                'gamesPerRank':[0 for x in range(hsRanks)],
                'rankData':[[0 for x in range(len(hsArchetypes))] for y in range(hsRanks)]}
	return ladder

def newTable(t):
	table = {	'timeStart':[t.year,t.month,t.day,t.hour,t.minute],
				'timeEnd':[],
				'hsFormat': hsFormat,
                'archetypes':hsArchetypes,
                'frequency':[0 for x in range(len(hsArchetypes))],
                'table': [[[0,0] for x in range(len(hsArchetypes))] for y in range(len(hsArchetypes))]}
	return table

	

 #SAVE FILES
def saveLadderAsJson(ladder,t,span):
	if ladder == None:
		return
	
	
	ladder['timeEnd'] = [t.year,t.month,t.day,t.hour,t.minute]
	
	path = '/ladderData/'+hsFormat+'/'+span
	print(span,ladder['gamesPerRank'])

	if span in ['lastDay','lastWeek','lastMonth']:
		firebase.delete(path,'')
		firebase.post(path,ladder)
		pass
	

def saveTableAsJson(table,t,span):
	if table == None:
		print('- ! - ! -table NONE')
		return
	
	table['timeEnd'] = [t.year,t.month,t.day,t.hour,t.minute]
	print(span,table['frequency'])
	path = '/tableData/'+hsFormat+'/'+span+'/ranks_all'

	if span in ['lastWeek','lastMonth']:
		firebase.delete(path,'')
		firebase.post(path,table)
		pass
	




with open(DRFILENAME, "r") as csvfile:
	datareader = csv.reader(csvfile)
	count = 0
	# GET ALL ARCHETYPES
	for row in datareader:
		if count == 0:
			count = 1
			continue
		op_arch = [row[4],row[5]]
		if op_arch[1] == '':
			op_arch[1] = 'Other'
		if op_arch not in hsArchetypes:
			print(op_arch)
			hsArchetypes.append(op_arch)
		count += 1
	










# GET DATA

with open(DRFILENAME, "r") as csvfile:
	datareader = csv.reader(csvfile)
	count = 0
	countBreak = 1000000000000000000000000000000000000000000
	l_day = None
	l_week = None
	l_month = None

	table_week = None
	table_month = None
	table_all = None
	
	

	for row in datareader:
		if count > countBreak:
			break
		if count == 0:
			count = 1
			continue
		if count <10:
			print(row)
		
		if row[12] != hsFormat:
			continue
		
		
		# TIME STUFF
		dr = row[11]
		dt = datetime(int(dr[:4]),int(dr[5:7]),int(dr[8:10]),int(dr[11:13]))
		if count == 1:
			lastDate = dt
			l_day = newLadder(dt)
			l_week = newLadder(dt)
			l_month = newLadder(dt)
			table_week = newTable(dt)
			table_month = newTable(dt)
			table_all = newTable(dt)
		
		
		
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
		if op_arch in hsArchetypes:
			idx_op = hsArchetypes.index(op_arch)
			t_delta = datetime.now() - dt
			
			
			if t_delta.days < 1:
				l_day['rankData'][rank][idx_op] += 1
				l_day['gamesPerRank'][rank]  += 1
			if t_delta.days < 7:
				l_week['rankData'][rank][idx_op] += 1
				l_week['gamesPerRank'][rank]  += 1
			if t_delta.days < 30:
				l_month['rankData'][rank][idx_op] += 1
				l_month['gamesPerRank'][rank]  += 1

			if he_arch in hsArchetypes:
				idx_he = hsArchetypes.index(he_arch)
				res = 0
				if row[7] != 'win': 
					res = 1
				if t_delta.days < 7:
					table_week['table'][idx_he][idx_op][res] += 1
					table_week['frequency'][idx_op] += 1
				if t_delta.days < 30:
					table_month['table'][idx_he][idx_op][res] += 1
					table_month['frequency'][idx_op] += 1
				table_all['table'][idx_he][idx_op][res] += 1
				table_all['frequency'][idx_op] += 1
			
		count += 1
		
	saveLadderAsJson(l_day,dt,'lastDay')
	saveLadderAsJson(l_week,dt,'lastWeek')
	saveLadderAsJson(l_month,dt,'lastMonth')

	saveTableAsJson(table_week,dt,'lastWeek')
	saveTableAsJson(table_month,dt,'lastMonth')
	#saveTableAsJson(table_all,dt,'all')
				
		
	


