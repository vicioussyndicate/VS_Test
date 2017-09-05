


// SETUP UI



var ui = { 
    fullyLoaded: false,
    overlay: false,

    tabs: {
        activeID: 'ladder',
        buttons: [],
    },

    windows: {
        activeWindow: null,
        list: [],
    },

    options: {
        openFolder: null,
        buttons: [],
        folderButtons: [],
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

    var tabs = document.querySelectorAll('button.tab');
    var windows = document.querySelectorAll('.tabWindow');
    var folderButtons = document.querySelectorAll('.folder-toggle');
    var optionButtons = document.querySelectorAll('.optionBtn')

    ui.tabs.buttons = tabs
    ui.windows.list = windows
    ui.options.buttons = optionButtons
    ui.options.folderButtons = folderButtons
    
    ui.tabs.activeTab = document.querySelector('.tab#ladder')
    ui.windows.activeWindow = document.querySelector('#ladderWindow')

    renderWindows()
     

    for(let i=0;i<tabs.length;i++) {    
        tabs[i].addEventListener("click", toggleMainTabs);}

    for(let i=0;i<folderButtons.length;i++) { 
        folderButtons[i].addEventListener("click", toggleDropDown);}

    for (let i=0;i<optionButtons.length;i++) { 
        optionButtons[i].addEventListener("click", buttonTrigger)}

}




function toggleMainTabs(e) {

    ui.tabs.activeTab = e.target
    ui.windows.activeWindow = document.getElementById(e.target.id+'Window')

    renderTabs()
    renderWindows()
}


function toggleDropDown(e) {
    
    
    var siblings = e.target.parentElement.childNodes
    var dd_folder = siblings[3] // !!

    //for (s of siblings) { if (s.class = 'dropdown' || s.class == 'dropdown hidden') {dd_folder = s; break} }
    
    if (dd_folder == ui.options.openFolder) {ui.options.openFolder = null}
    else if (ui.options.openFolder != null) {
        ui.options.openFolder.classList.toggle('hidden');
        ui.options.openFolder = dd_folder
    }

    dd_folder.classList.toggle('hidden')
}










function renderTabs() {

    for (tab of ui.tabs.buttons) {
        if (tab != ui.tabs.activeTab) {tab.classList.remove('highlighted')}
        else {tab.classList.add('highlighted')}
    }
}

function renderWindows() {
    for (tabWindow of ui.windows.list) {
        if (tabWindow != ui.windows.activeWindow) {tabWindow.style.display = 'none'}
        else {tabWindow.style.display = 'inline-block'}
    }
}


function renderOptions() {

    if (ui.windows.activeWindow.id == 'ladderWindow') { 
        document.getElementById("formatBtn").innerHTML =    btnIdToText[ui.ladder.f]
        document.getElementById("timeBtn").innerHTML =      btnIdToText[ui.ladder.t]
        /*
        if (ui.ladder.dispMode == 'classes') {
            document.getElementById('classes').classList.add('highlighted')
            document.getElementById('decks').classList.remove('highlighted')
        }

        if (ui.ladder.dispMode == 'decks') {
            document.getElementById('decks').classList.add('highlighted')
            document.getElementById('classes').classList.remove('highlighted')
        }*/
    }

    if (ui.windows.activeWindow.id == 'tableWindow') { 
        document.getElementById("formatBtn").innerHTML =    btnIdToText[ui.table.f]
        document.getElementById("timeBtn").innerHTML =      btnIdToText[ui.table.t]
        document.getElementById("ranksBtn").innerHTML =     btnIdToText[ui.table.r]
        document.getElementById("sortBtn").innerHTML =      btnIdToText[ui.table.sortBy]
    }
}






function buttonTrigger(e) {

    const btnID = e.target.id
    
    if (ui.windows.activeWindow.id == 'ladderWindow') {
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

     if (ui.windows.activeWindow.id == 'tableWindow') {

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




