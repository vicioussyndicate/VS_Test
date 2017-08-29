/*


INFO



*/


var t0 = performance.now();

// Global Variables
var hsRanks = 21
var numArch_ladder = 0
var numArch_table_std = 14      // top 14 archetype will be posted on the table
var numArch_table_wild = 9
var ladder_xmin = 0.03         // minimal x value

var table_default_sort = 'frequency'
var table_default_time = 'lastWeek'
var table_default_format = 'Standard'


var hsClasses = ["Druid","Hunter","Mage","Paladin","Priest","Rogue","Shaman","Warlock","Warrior"]
// var hsColors = {
//     Druid: "#FF7D0A",
//     Hunter: "#ABD473",
//     Mage: "#69CCF0",
//     Paladin: "#F58CBA",
//     Priest: "#FFFFFF",
//     Rogue: "#FFF569",
//     Shaman: "#0070DE",
//     Warlock: "#9482C9",
//     Warrior: "#C79C6E"
// }

var hsColors = {
    Druid: "bc7700",
    Hunter: "1a7c3f",
    Mage: "3db49b",
    Paladin: "ffad77",
    Priest: "ddd9bb",
    Rogue: "729172",
    Shaman: "306291",
    Warlock: "da269a",
    Warrior: "880d05"}

var colorscale_Table = [
    [0, '#3f0c03'],
    [0.3, '#872a19'],
    [0.5, '#FFFFFF'],
    [0.7,'#7f9b31'],
    [1, '#2e5307']
];







window.onload = function() {
    
    setupUI()
    setupFirebase()
    
        
}








// ---------------------------- UI -------------------------------- // ------------------------------------ UI ------------------------- // 

// Global Buttons
var tabs = document.querySelectorAll('button.tab');
var options = document.querySelectorAll('#options .option-toggle');
var optionSelectionButtons = document.querySelectorAll('.optionSelBtn')


var ui = {      // UI handler
    tabs: {
        activeID: null,
    },
    options: {
        activeID: null,
    },
    ladder: {
        f: 'Standard', 
        t: 'lastDay',
        plotted: false,
        sortBy: 'frequency',
    },
    classLadder: {
        f: 'Standard', 
        t: 'lastDay',
        sortBy: 'frequency',
    },
    table: {
        f: 'Standard',
        t: 'lastMonth',
        r: 'ranks_all',
        plotted: false,
        zoomIn: false,
        zoomArch: '',
        sortBy: 'frequency',
    }
}






// SETUP UI

function setupUI() {
    var initialID = 'classLadder'
    document.getElementById(initialID).classList.add('highlighted')
    document.getElementById(initialID+'Window').style.display = 'inline-block'
    ui.tabs.activeID = initialID;

    for(let i=0;i<tabs.length;i++) {    
        tabs[i].addEventListener("click", toggleMainTabs);}
    
    for(let i=0;i<options.length;i++) { 
        options[i].addEventListener("click", dropDownToggle);}

    for (let i=0;i<optionSelectionButtons.length;i++) { 
        optionSelectionButtons[i].addEventListener("click", optionSelection)}
}






// Tabs

function toggleMainTabs(e) {
    console.log(e.target.id)
    if (ui.tabs.activeID != null) {
        document.getElementById(ui.tabs.activeID+'Window').style.display = 'none'
        document.getElementById(ui.tabs.activeID).classList.remove('highlighted')
    }
    const tabID = e.target.id;
    if (tabID == 'ladder' && !ui.ladder.plotted) {
        plotLadder(ui.ladder.f,ui.ladder.t)
        ui.ladder.plotted = true
    }
    document.getElementById(e.target.id).classList.add('highlighted')
    document.getElementById(tabID+'Window').style.display = 'inline-block'
    ui.tabs.activeID = tabID;
}






// Options

function dropDownToggle(e) {    
    const targetParentID = e.target.parentElement.id;
    toggleShow(targetParentID);
}

function toggleShow(ID) {
    const el = document.querySelector(`#${ID} .dropdown`)
    el.classList.toggle('hidden');
}







// Option Triggers

function optionSelection(e) {
    
    const btnID = e.target.id
    if (ui.tabs.activeID == 'ladder') {
    
        if (btnID == 'classes') {console.log("classes")}
        if (btnID == 'decks') {console.log("decks")}

        if (btnID == 'standard') {changeLadder('Standard',ui.ladder.t)}
        if (btnID == 'wild')     {changeLadder('Wild',ui.ladder.t)}
        
        if (btnID == 'lastD') {changeLadder(ui.ladder.f,'lastDay')}
        if (btnID == 'lastW') {changeLadder(ui.ladder.f,'lastWeek')}
        if (btnID == 'lastM') {changeLadder(ui.ladder.f,'lastMonth')}
        
        
        if (btnID == 'byClass') {sortLadderBy('class')}
        if (btnID == 'byFreq') {sortLadderBy('frequency')}
        if (btnID == 'byWR') {sortLadderBy('winrate')}
    }

    if (ui.tabs.activeID == 'classLadder') {
        if (btnID == 'standard') {changeClassLadder('Standard',ui.ladder.t)}
        if (btnID == 'wild')     {changeClassLadder('Wild',ui.ladder.t)}
        
        if (btnID == 'lastD') {changeClassLadder(ui.ladder.f,'lastDay')}
        if (btnID == 'lastW') {changeClassLadder(ui.ladder.f,'lastWeek')}
        if (btnID == 'lastM') {changeClassLadder(ui.ladder.f,'lastMonth')}

        if (btnID == 'byClass') {sortClassLadderBy('class')}
        if (btnID == 'byFreq') {sortClassLadderBy('frequency')}
        if (btnID == 'byWR') {sortClassLadderBy('winrate')}
    }

    if (ui.tabs.activeID == 'table') {
        if (btnID == 'byClass') {sortTableBy('class')}
        if (btnID == 'byFreq') {sortTableBy('frequency')}
        if (btnID == 'byWR') {sortTableBy('winrate')}

        if (btnID == 'lastW') {changeTable(ui.table.f,'lastWeek',ui.table.r)}
        if (btnID == 'lastM') {changeTable(ui.table.f,'lastMonth',ui.table.r)}

        if (btnID == 'standard') {changeTable('Standard',ui.table.t,ui.table.r)}
        if (btnID == 'wild') {changeTable('Wild',ui.table.t,ui.table.r)}
    }
        
}



// ---------------------------- SETUP DATA -------------------------------- // ------------------------------------ SETUP DATA ------------------------- // 



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
                    winrates: null,
                    frequency: null,

                    classPlusArch: null,
                    textTable: null,
                    
                    layout: null,
                    freqPlotData: null,
                    wrPlotData: null,

                    archetypes_sorted: null,
                    table_sorted: null,
                }
                //if (f == ui.table.f && t == ui.table.t && r == ui.table.r) {
                    makeTable(f,t,r)
                //}
            }
        }
    }

    
    plotTable(ui.table.f,ui.table.t,ui.table.r)
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

    //plotLadder('Standard','lastDay')
    plotClassLadder(ui.classLadder.f,ui.classLadder.t)
    
    var t1 = performance.now()
    console.log("App initializing took " + (t1 - t0) + " ms.")
    
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



















function makeDecks() {
    
        var img = document.createElement("img");
        img.src = "Images/deck1.png";
        var src = document.getElementById("chart3");
        src.appendChild(img);
    }






// Utility
function choice(arr) {return arr[Math.floor(Math.random()*arr.length)]}
function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function print(stuff) {console.log(stuff)}
function randomColor() {return 'rgb('+randint(0,255)+','+randint(0,255)+','+randint(0,255)+')'}
function range(a,b) {var range = []; for (var i=a;i<b;i++) {range.push(i)}; return range}
function fillRange(a,b,c) {var range = []; for (var i=a;i<b;i++) {range.push(c)}; return range}


