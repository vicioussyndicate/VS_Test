
import pyrebase # learn more: https://python.org/pypi/Pyrebase


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




import csv
from datetime import datetime
import glob, os
import random



path = 'Sources/' # +hsFormat/hsClass/
hsClasses = ['Druid','Hunter','Mage','Paladin','Priest','Rogue','Shaman','Warlock','Warrior']
hsFormats = ['Standard', 'Wild']

def getCSVFile(path):
    f = open(path,encoding='latin-1')
    reader=csv.reader(f)
    return list(reader)  

CARDS = getCSVFile(path+'cards.csv')


def getCardRarity(cardName):
    for c in CARDS:
        if c[0] != cardName:
            continue

        if len(c) >= 5:
            r = c[4]
            if r == 'Free':
                r = 'Basic'
            return r
        else:
            return 'Basic'
    return 'Basic'


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
            if row[7] != ')':
                manaCost = row[6:8]
            name = row[9:-1]
            rarity = getCardRarity(name)
            cards.append({'name':name,'manaCost':manaCost,'quantity':quantity, 'rarity':rarity})

        count += 1

    if archetype == '':
        archetype = 'Other '+hsClass

    return {'name':title, 'cards':cards, 'deckCode': deckCode, 'color': 'rgb(0,0,0)'}, archetype






    

def upload(hsFormat):

    # Delete Existing Files
    for hsClass in hsClasses:
        DB.child('deckData').child(hsFormat).child(hsClass).remove(user['idToken'])
        pass


    for hsClass in hsClasses:

        # moves dir to /Sources/hsClass/ and looks for all .txt files
        os.chdir(path+hsFormat+'/'+hsClass)
        for file in glob.glob("*.txt"):

            # Class Description Texts should be labeled 'Druid.txt', 'Hunter.txt' etc. (first letter Capital)
            if file == hsClass+'.txt':
                f = open(file)
                txt = f.read()
                txt = txt.replace('<strong>',"<strong style='font-weight:bold'>")
                txt = txt.replace('</p>','</p><br><br>')
                DB.child('deckData').child(hsFormat).child(hsClass).child('text').set(txt,user['idToken'])
                continue

            # Decklist files can be named anything other than [hsClass].txt
            # returns deckFile = {name, cards: [{cardname,manacost,quantity},...], deckCode, color} and archetype
            # returns 0 if hsFormats don't agree
            f = open(file)
            decklist, arch = readDeckCode(f.readlines(),hsClass, hsFormat)

            if decklist != 0:
                DB.child('deckData').child(hsFormat).child(hsClass).child('archetypes').child(arch).push(decklist,user['idToken'])
                pass
        os.chdir('..')
        os.chdir('..')
        os.chdir('..')


# Execute main:

def main():
    for f in hsFormats:
        upload(f)


main()

