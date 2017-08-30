


// Global Data
var DATA_ladder = {}  // main data structs
var DATA_table = {}

var hsFormats =     ['Standard','Wild']
var ladder_times =  ['lastDay','lastWeek','lastMonth']
var table_times =   ['lastWeek','lastMonth']
var table_ranks =   ['ranks_all'] //later: ['ranks_L_5','ranks_6_15','ranks_all']





function setupTableData (data) {

    var tableData = data.val()
    
    for (f of hsFormats) {
        DATA_table[f] = {}
        for (t of table_times) {
            DATA_table[f][t] = {}
            for (r of table_ranks) {
                var key = Object.keys(tableData[f][t][r])[0]
                DATA_table[f][t][r] = {
                    imported: tableData[f][t][r][key],
                    table: null,
                    archetypes: null,
                    archetypesLadder: null,
                    winrates: null,
                    frequency: null,
                    classPlusArch: null,
                    textTable: null,
                    layout: null,
                    freqPlotData: null,
                    archetypes_sorted: null,
                    table_sorted: null,
                }
                //if (f == ui.table.f && t == ui.table.t && r == ui.table.r) {
                    makeTable(f,t,r)
                //}
            }
        }
    }
}

function setupLadderData (data) {
    
    var ladderData = data.val()
    
    for (f of hsFormats) {
        DATA_ladder[f] = {}
        for (t of ladder_times) {
            var key = Object.keys(ladderData[f][t])[0]
            DATA_ladder[f][t] = {
                imported: ladderData[f][t][key],
                data: null,
                archetypes: null,
                data_classes: null,
            }
            //if (f == ui.ladder.f && t == ui.ladder.t) {
                makeLadder(f,t)
            //}
        } 
    }

    finishedLoading()
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

    var refTable = database.ref('tableData')
    refTable.on('value',setupTableData,errMsg)

    var refLadder = database.ref('ladderData')
    refLadder.on('value',setupLadderData,errMsg)
}

function errMsg() {print("failed to load Data")}











