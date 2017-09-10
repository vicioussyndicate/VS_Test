


// SETUP UI



var ui = { 
    fullyLoaded: false,
    overlay: false,

    tabs: {
        activeTab: null,
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
    },

    power: {
        f: 'Standard',
        dispMode: 'tiers' // tiers or top
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
    renderTabs()
     

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

        if (ui.ladder.dispMode == 'classes') {
            document.querySelector('#ladderWindow .optionBar #classes').classList.add('highlighted')
            document.querySelector('#ladderWindow .optionBar #decks').classList.remove('highlighted')
        }

        if (ui.ladder.dispMode == 'decks') {
            document.querySelector('#ladderWindow .optionBar #classes').classList.remove('highlighted')
            document.querySelector('#ladderWindow .optionBar #decks').classList.add('highlighted')
        }
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
        if (btnID == 'timeline')    {ui.ladder.plotMode = 'timeline'}

        DATA_L[ui.ladder.f][ui.ladder.t].plot()
    }

    if (ui.windows.activeWindow.id == 'tableWindow') {

        var data = DATA_T[ui.table.f][ui.table.t][ui.table.r]


        if (btnID == 'class')       {data.sortTableBy('class'); return}
        if (btnID == 'frequency')   {data.sortTableBy('frequency');return}
        if (btnID == 'winrate')     {data.sortTableBy('winrate');return}
        if (btnID == 'matchup')     {data.sortTableBy('matchup');return}

        if (btnID == 'lastWeek')    {ui.table.t = 'lastWeek'}
        if (btnID == 'lastMonth')   {ui.table.t = 'lastMonth'}

        if (btnID == 'Standard')    {ui.table.f = 'Standard'}
        if (btnID == 'Wild')        {ui.table.f = 'Wild'}

        if (btnID == 'ranks_all')   {ui.table.r = 'ranks_all'}
        if (btnID == 'ranks_L_5')   {ui.table.r = 'ranks_L_5'}
        if (btnID == 'ranks_6_15')  {ui.table.r = 'ranks_6_15'}
        
        DATA_T[ui.table.f][ui.table.t][ui.table.r].plot()
    }

    if (ui.windows.activeWindow.id == 'powerWindow') {

        if (btnID == 'Standard')    {ui.power.f = 'Standard'}
        if (btnID == 'Wild')        {ui.power.f = 'Wild'}

        if (btnID == 'top')         {ui.power.dispMode = 'top'}
        if (btnID == 'tiers')       {ui.power.dispMode = 'tiers'}
        
        powerWindow.plot()
    }

    if (ui.windows.activeWindow.id == 'decksWindow') {
        if (btnID == 'druid')       {decksWindow.loadClass('Druid')}
        if (btnID == 'hunter')      {decksWindow.loadClass('Hunter')}
        if (btnID == 'mage')        {decksWindow.loadClass('Mage')}
        if (btnID == 'paladin')     {decksWindow.loadClass('Paladin')}
        if (btnID == 'priest')      {decksWindow.loadClass('Priest')}
        if (btnID == 'rogue')       {decksWindow.loadClass('Rogue')}
        if (btnID == 'shaman')      {decksWindow.loadClass('Shaman')}
        if (btnID == 'warlock')     {decksWindow.loadClass('Warlock')}
        if (btnID == 'warrior')     {decksWindow.loadClass('Warrior')}

        if (btnID == 'decklists')   {decksWindow.loadDecklists()}
        if (btnID == 'description') {decksWindow.loadDescription()}

        if (btnID == 'Standard')    {decksWindow.loadFormat('Standard')}
        if (btnID == 'Wild')        {decksWindow.loadFormat('Wild')}
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
    matchup: 'Matchup',
}




