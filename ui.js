


// SETUP UI

var ladderOptions = []    // to show when switch to ladder tab
var tableOptions = [] 
var tabs = document.querySelectorAll('button.tab');
var options = document.querySelectorAll('.option-toggle');
var optionSelectionButtons = document.querySelectorAll('.optionSelBtn')



var ui = { 
    fullyLoaded: false,
    overlay: false,

    tabs: {
        activeID: 'ladder',
    },

    windows: {
        activeID: 'ladderWindow',
        activeLadderID: 'ladder',
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
        plotMode: 'bar', // bar line number
        dispMode: 'classes', // classes decks
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








function setupUI() {
    showLoader()

    // Show/ hide Options
    tableOptions.push(document.querySelector('#ranks'))
    ladderOptions.push(document.getElementById('sort'))
    document.getElementById(ui.tabs.activeID).style.display = 'inline-block'

    
    // Add Click Functions
    for(let i=0;i<tabs.length;i++) {    
        tabs[i].addEventListener("click", toggleMainTabs);}
    
    for(let i=0;i<options.length;i++) { 
        options[i].addEventListener("click", dropDownToggle);}

    for (let i=0;i<optionSelectionButtons.length;i++) { 
        optionSelectionButtons[i].addEventListener("click", optionSelection)}

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
        for (var i=0;i<ladderOptions.length;i++) {ladderOptions[i].style.display = 'flex'}
        for (var i=0;i<tableOptions.length;i++) {tableOptions[i].style.display = 'none'}
        document.getElementById('sort').style.display = 'none'
        showWindow('ladderWindow')
    }

    if (tabID == 'table') {
        document.getElementById('options').style.display = 'flex'
        document.getElementById('lastDay').style.display = 'none'
        for (var i=0;i<ladderOptions.length;i++) {ladderOptions[i].style.display = 'none'}
        for (var i=0;i<tableOptions.length;i++) {tableOptions[i].style.display = 'flex'}
                document.getElementById('sort').style.display = 'flex'
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




function showWindow(windowID) {
    console.log(windowID)
    
    if (ui.windows.activeID == windowID && ui.fullyLoaded) {console.log('window already shown'); return}

    document.getElementById(ui.windows.activeID).style.display = 'none'
    document.getElementById(windowID).style.display = 'inline-block'

    ui.windows.activeID = windowID
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
    
    

    if (ui.windows.activeID == 'ladderWindow') {
  
        if (btnID == 'classes')     {ui.ladder.dispMode = 'classes'}
        if (btnID == 'decks')       {ui.ladder.dispMode = 'decks'}

        if (btnID == 'Standard')    {ui.ladder.f = 'Standard'}
        if (btnID == 'Wild')        {ui.ladder.f = 'Wild'}
        
        if (btnID == 'lastDay')     {ui.ladder.t = 'lastDay'}
        if (btnID == 'lastWeek')    {ui.ladder.t = 'lastWeek'}
        if (btnID == 'lastMonth')   {ui.ladder.t = 'lastMonth'}

        if (btnID == 'bar')         {ui.ladder.plotMode = 'bar'}
        if (btnID == 'line')        {ui.ladder.plotMode = 'line'}
        if (btnID == 'number')      {ui.ladder.plotMode = 'number'}

        DATA_L[ui.ladder.f][ui.ladder.t].plot()
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





function renderOptions() {
    console.log("renderoptions",ui.ladder.sortBy)
    if (ui.windows.activeID == 'ladderWindow') { 
        document.getElementById("formatBtn").innerHTML =    btnIdToText[ui.ladder.f]
        document.getElementById("timeBtn").innerHTML =      btnIdToText[ui.ladder.t]
    }

    if (ui.windows.activeID == 'tableWindow') { 
        document.getElementById("formatBtn").innerHTML =    btnIdToText[ui.table.f]
        document.getElementById("timeBtn").innerHTML =      btnIdToText[ui.table.t]
        document.getElementById("ranksBtn").innerHTML =     btnIdToText[ui.table.r]
        document.getElementById("sortBtn").innerHTML =      btnIdToText[ui.table.sortBy]
    }
}


















function overlay() {
    if (ui.overlay) {document.getElementById("overlay").style.display = "none"; ui.overlay = false}
    else {document.getElementById("overlay").style.display = "block"; ui.overlay = true}
    
}

function hideLoader() { document.getElementById('loader').style.display = 'none'}
function showLoader () { document.getElementById('loader').style.display = 'block' }
















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




