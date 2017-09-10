from firebase import firebase
firebase = firebase.FirebaseApplication("https://testproject-a0746.firebaseio.com/")


import csv
from datetime import *
import json
import glob, os
import random



path = 'Sources/'
hsClasses = ['Druid','Hunter','Mage','Paladin','Priest','Rogue','Shaman','Warlock','Warrior']
hsFormats = ['Standard', 'Wild']


def readDeckCode(file):

    title = ''
    deckCode = ''
    archetype = ''
    cards = []
    readingCards = 'waiting'
    count = 0
    for row in file:

        if len(row) <= 3:
            if readingCards == 'reading':
                readingCards = 'finished'
            elif readingCards == 'waiting':
                readingCards = 'reading'
                continue
        
        if '###' in row:
            title = row[4:-1]
            continue
        if '#' not in row and deckCode == '':
            deckCode = row[:-1]
            continue
        if '# Format: Wild' in row:
            print('not ok?')
        if '# Archetype:' in row:
            archetype = row[13:-1]

        if readingCards == 'reading':
            quantity = row[2]
            manaCost = row[6]
            name = row[9:-1]
            cards.append({'name':name,'manaCost':manaCost,'quantity':quantity})

        count += 1

    return {'name':title, 'cards':cards, 'deckCode': deckCode, 'color': 'rgb(0,0,0)'}, archetype








hsFormat = 'Wild'
    
for hsClass in hsClasses:
    firePath = '/deckData/'+hsFormat+'/'+hsClass+'/archetypes'
    firebase.delete(firePath,'')

    firePath = '/deckData/'+hsFormat+'/'+hsClass+'/text'
    firebase.delete(firePath,'')


for hsClass in hsClasses:
    os.chdir(path+hsClass)
    for file in glob.glob("*.txt"):

        if file == hsClass+'.txt':
            f = open(file)
            firePath = '/deckData/'+hsFormat+'/'+hsClass+'/text'
            firebase.post(firePath,f.read())
            continue

        f = open(file)
        text = f.readlines()
        decklist, arch = readDeckCode(text)

        if decklist != 0:
            firePath = '/deckData/'+hsFormat+'/'+hsClass+'/archetypes/'+arch
            firebase.post(firePath,decklist)
            print(hsClass,arch,decklist)
    os.chdir('..')
    os.chdir('..')