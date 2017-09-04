


// SETUP UI

var ladderOptions = []    // to show when switch to ladder tab
var tableOptions = [] 
var tabs = document.querySelectorAll('button.tab');
var options = document.querySelectorAll('#options .option-toggle');
var optionSelectionButtons = document.querySelectorAll('.optionSelBtn')



var ui = {      // UI handler
    fullyLoaded: false,
    overlay: false,

    tabs: {
        activeID: 'ladder',
    },

    windows: {
        activeID: 'classLadderWindow',
        activeLadderID: 'classLadder',
    },

    options: {
        activeID: null,
        activeBtn: null,
    },

    ladder: {
        f: 'Standard', 
        t: 'lastDay',
        plotted: false,
        zoomIn: false,
        zoomIdx: '',
        sortBy: 'class',
    },

    classLadder: {
        f: 'Standard', 
        t: 'lastDay',
        plotted: false,
        zoomIn: false,
        zoomIdx: '',
        sortBy: 'class',
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


function showWindow(windowID) {

    // Todo: generalize the loading of windows
    if (windowID == 'ladderWindow' && !ui.ladder.plotted) {}//plotLadder(ui.ladder.f, ui.ladder.t); sortLadderBy(ui.ladder.sortBy)}
    if (ui.windows.activeID == windowID && ui.fullyLoaded) {console.log('window already shown'); return}

    document.getElementById(ui.windows.activeID).style.display = 'none'
    document.getElementById(windowID).style.display = 'inline-block'

    ui.windows.activeID = windowID
}




function setupUI() {
    showLoader()

    // Show/ hide Options
    tableOptions.push(document.querySelector('#ranks'))
    ladderOptions.push(document.querySelector('#sort'))
    document.getElementById(ui.tabs.activeID).style.display = 'inline-block'

    
    // Add Click Functions
    for(let i=0;i<tabs.length;i++) {    
        tabs[i].addEventListener("click", toggleMainTabs);}
    
    for(let i=0;i<options.length;i++) { 
        options[i].addEventListener("click", dropDownToggle);}

    for (let i=0;i<optionSelectionButtons.length;i++) { 
        optionSelectionButtons[i].addEventListener("click", optionSelection)}
    
    createClassLadderLegend()

    toggleMainTabs()
}





// Tabs

function toggleMainTabs(e) {

    var tabID
    if (e != undefined) {tabID = e.target.id}
    else {tabID = ui.tabs.activeID}
    
 
    document.getElementById(ui.tabs.activeID).classList.remove('highlighted')
    document.getElementById(tabID).classList.add('highlighted')


    ui.tabs.activeID = tabID
    var windowID = tabID


    // Hide/ Show Options
    if (tabID == 'ladder') {
        document.getElementById('options').style.display = 'flex'
        //document.getElementById('lastDay').style.display = 'block'
        for (var i=0;i<ladderOptions.length;i++) {ladderOptions[i].style.display = 'flex'}
        for (var i=0;i<tableOptions.length;i++) {tableOptions[i].style.display = 'none'}
        
        showWindow(ui.windows.activeLadderID + 'Window')
    }

    if (tabID == 'table') {
        document.getElementById('options').style.display = 'flex'
        document.getElementById('lastDay').style.display = 'none'
        for (var i=0;i<ladderOptions.length;i++) {ladderOptions[i].style.display = 'none'}
        for (var i=0;i<tableOptions.length;i++) {tableOptions[i].style.display = 'flex'}

        showWindow('tableWindow')
    }

    if (tabID == 'decks') {
        document.getElementById('options').style.display = 'none'
        showWindow('decksWindow')
    }

    if (tabID == 'info') {
        document.getElementById('options').style.display = 'none'
        showWindow('infoWindow')
    }

    renderOptions()
}







function dropDownToggle(e) {
    if (!ui.fullyLoaded) {return}

    toggleShow(e.target.parentElement.id)

    if (ui.options.activeBtn == null) {ui.options.activeBtn = e.target; return}

    var parent_old = ui.options.activeBtn.parentElement
    var parent_new = e.target.parentElement

    if (parent_old == parent_new) {ui.options.activeBtn = null; return}
    
    toggleShow(parent_old.id)
    ui.options.activeBtn = e.target
}




function toggleShow(ID) {
    const el = document.querySelector(`#${ID} .dropdown`)
    el.classList.toggle('hidden');
}




// Option Triggers Todo: simplify

function optionSelection(e) {
    
    const btnID = e.target.id
    
    if (btnID == 'classes') {showWindow('classLadderWindow');   ui.windows.activeLadderID = 'classLadder'}
    if (btnID == 'decks')   {showWindow('ladderWindow');        ui.windows.activeLadderID = 'ladder'}

    if (ui.windows.activeID == 'ladderWindow') {

        if (btnID == 'Standard') {changeLadder('Standard',ui.ladder.t)}
        if (btnID == 'Wild')     {changeLadder('Wild',ui.ladder.t)}
        
        if (btnID == 'lastDay') {changeLadder(ui.ladder.f,'lastDay')}
        if (btnID == 'lastWeek') {changeLadder(ui.ladder.f,'lastWeek')}
        if (btnID == 'lastMonth') {changeLadder(ui.ladder.f,'lastMonth')}
        
        
        if (btnID == 'class') {sortLadderBy('class')}
        if (btnID == 'frequency') {sortLadderBy('frequency')}
        if (btnID == 'winrate') {sortLadderBy('winrate')}
    }

    if (ui.windows.activeID == 'classLadderWindow') {

        if (btnID == 'Standard') {changeClassLadder('Standard',ui.ladder.t)}
        if (btnID == 'Wild')     {changeClassLadder('Wild',ui.ladder.t)}
        
        if (btnID == 'lastDay') {changeClassLadder(ui.ladder.f,'lastDay')}
        if (btnID == 'lastWeek') {changeClassLadder(ui.ladder.f,'lastWeek')}
        if (btnID == 'lastMonth') {changeClassLadder(ui.ladder.f,'lastMonth')}

        if (btnID == 'class') {sortClassLadderBy('class')}
        if (btnID == 'frequency') {sortClassLadderBy('frequency')}
        if (btnID == 'winrate') {sortClassLadderBy('winrate')}
    }

    if (ui.tabs.activeID == 'table') {

        if (btnID == 'class') {sortTableBy('class')}
        if (btnID == 'frequency') {sortTableBy('frequency')}
        if (btnID == 'winrate') {sortTableBy('winrate')}

        if (btnID == 'lastWeek') {changeTable(ui.table.f,'lastWeek',ui.table.r)}
        if (btnID == 'lastMonth') {changeTable(ui.table.f,'lastMonth',ui.table.r)}

        if (btnID == 'Standard') {changeTable('Standard',ui.table.t,ui.table.r)}
        if (btnID == 'Wild') {changeTable('Wild',ui.table.t,ui.table.r)}

        if (btnID == 'ranks_all') {changeTable(ui.table.f,ui.table.t,'ranks_all')}
        if (btnID == 'ranks_L_5') {changeTable(ui.table.f,ui.table.t,'ranks_L_5')}
        if (btnID == 'ranks_6_15') {changeTable(ui.table.f,ui.table.t,'ranks_6_15')}
        
    }
    renderOptions()
}



function overlay() {
    if (ui.overlay) {document.getElementById("overlay").style.display = "none"; ui.overlay = false}
    else {document.getElementById("overlay").style.display = "block"; ui.overlay = true}
    
}

function hideLoader() { document.getElementById('loader').style.display = 'none'}
function showLoader () { document.getElementById('loader').style.display = 'block' }





function renderOptions() {
    console.log("renderoptions",ui.ladder.sortBy)
    if (ui.windows.activeID == 'ladderWindow') { 
        document.getElementById("formatBtn").innerHTML =    btnIdToText[ui.ladder.f]
        document.getElementById("timeBtn").innerHTML =      btnIdToText[ui.ladder.t]
        document.getElementById("sortBtn").innerHTML =      btnIdToText[ui.ladder.sortBy]
    }

    if (ui.windows.activeID == 'classLadderWindow') { 
        document.getElementById("formatBtn").innerHTML =    btnIdToText[ui.classLadder.f]
        document.getElementById("timeBtn").innerHTML =      btnIdToText[ui.classLadder.t]
        document.getElementById("sortBtn").innerHTML =      btnIdToText[ui.classLadder.sortBy]
    }

    if (ui.windows.activeID == 'tableWindow') { 
        document.getElementById("formatBtn").innerHTML =    btnIdToText[ui.table.f]
        document.getElementById("timeBtn").innerHTML =      btnIdToText[ui.table.t]
        document.getElementById("ranksBtn").innerHTML =     btnIdToText[ui.table.r]
        document.getElementById("sortBtn").innerHTML =      btnIdToText[ui.table.sortBy]
    }
}

const btnIdToText = {
    Standard: 'Standard',
    Wild: 'Wild',
    
    ranks_all: 'All Ranks',
    ranks_L_5: 'Ranks L-5',
    ranks_6_15: 'Ranks 6-15',

    lastDay: 'Last Day',
    lastWeek: 'Last Week',
    lastMonth: 'Last Month',

    class: 'By Class',
    frequency: 'By Frequency',
    winrate: 'By Winrate',
    
    frSubplot: 'Frequency',
    wrSubplot: 'Winrate',

    classes: 'Classes',
    decks: 'Archetypes',
}




