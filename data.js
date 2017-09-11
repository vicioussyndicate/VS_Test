




function setupTableData (data) {

    

    var tableData = data.val()
    
    for (f of hsFormats) {
        DATA_T[f] = {}
        for (t of table_times) {
            DATA_T[f][t] = {}
            for (r of table_ranks) {
                var key = Object.keys(tableData[f][t][r])[0]
                DATA_T[f][t][r] = new Table(tableData[f][t][r][key],f,t,r)

            }
        }
    }
}



function setupLadderData (data) {

    

    var ladderData = data.val()
    
    for (f of hsFormats) {
        DATA_L[f] = {}
        for (t of ladder_times) {
            var key = Object.keys(ladderData[f][t])[0]
            DATA_L[f][t] = new Ladder(ladderData[f][t][key],f,t)
        } 
    }

    finishedLoading()
}


function setupDeckData (data) {
    decksWindow = new DecksWindow(data.val())
}


function setupFirebase() {
    var config = {
        apiKey: "AIzaSyCDn9U08D4Lzhrbfz2MSy2rws_D02eH3HA",
        authDomain: "testproject-a0746.firebaseapp.com",
        databaseURL: "https://testproject-a0746.firebaseio.com",
        projectId: "testproject-a0746",
        storageBucket: "testproject-a0746.appspot.com",
        messagingSenderId: "826197220845"
    };
    firebase.initializeApp(config);
    var database = firebase.database()
    DATABASE = database

    var refTable = database.ref('tableData')
    refTable.on('value',setupTableData,errMsg)

    var refLadder = database.ref('ladderData')
    refLadder.on('value',setupLadderData,errMsg)

    decksWindow = new DecksWindow(hsFormats)
}

function errMsg() {print("failed to load Data")}











