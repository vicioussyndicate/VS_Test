

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

db = firebase.database()

data = {"name": "Mortimer 'Morty' Smith"}
db.child("users").child("Morty").set(data)