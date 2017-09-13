from firebase import firebase
firebase = firebase.FirebaseApplication("https://testproject-a0746.firebaseio.com/")


import csv
from datetime import *
import json
import glob, os
import random



path = 'Sources/' # +hsFormat/hsClass/
hsClasses = ['Druid','Hunter','Mage','Paladin','Priest','Rogue','Shaman','Warlock','Warrior']
hsFormats = ['Standard', 'Wild']


def readDeckCode(file,hsClass, hsFormat):

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
        if '# Format: Wild' in row and hsFormat != 'Wild':
            print('ERROR: decklist not Wild format! DeckName: '+title)
            #return 0

        if '# Format: Standard' in row and hsFormat != 'Standard':
            print('ERROR: decklist not Standard format! DeckName: '+title)
            #return 0
            
        if '# Archetype:' in row:
            archetype = row[13:-1]

        if readingCards == 'reading':
            quantity = row[2]
            manaCost = row[6]
            name = row[9:-1]
            cards.append({'name':name,'manaCost':manaCost,'quantity':quantity})

        count += 1

    if archetype == '':
        archetype = 'Other '+hsClass

    return {'name':title, 'cards':cards, 'deckCode': deckCode, 'color': 'rgb(0,0,0)'}, archetype






    

def upload(hsFormat):

    # Delete Existing Files
    for hsClass in hsClasses:
        firePath = '/deckData/'+hsFormat+'/'+hsClass+'/archetypes'
        firebase.delete(firePath,'')

        firePath = '/deckData/'+hsFormat+'/'+hsClass+'/text'
        firebase.delete(firePath,'')


    for hsClass in hsClasses:

        # moves dir to /Sources/hsClass/ and looks for all .txt files
        os.chdir(path+hsFormat+'/'+hsClass)
        for file in glob.glob("*.txt"):

            # Class Description Texts should be labeled 'Druid.txt', 'Hunter.txt' etc. (first letter Capital)
            if file == hsClass+'.txt':
                f = open(file)
                firePath = '/deckData/'+hsFormat+'/'+hsClass+'/text'
                firebase.post(firePath,f.read())
                continue

            # Decklist files can be named anything other than [hsClass].txt
            # returns deckFile = {name, cards: [{cardname,manacost,quantity},...], deckCode, color} and archetype
            # returns 0 if hsFormats don't agree
            f = open(file)
            decklist, arch = readDeckCode(f.readlines(),hsClass, hsFormat)

            if decklist != 0:
                firePath = '/deckData/'+hsFormat+'/'+hsClass+'/archetypes/'+arch
                firebase.post(firePath,decklist)
                print(hsClass,arch,decklist)
        os.chdir('..')
        os.chdir('..')
        os.chdir('..')


# Execute main:

def main():
    for f in hsFormats:
        upload(f)


