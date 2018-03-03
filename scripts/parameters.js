

const DISCORDLINK = 'https://discordapp.com/invite/0oxwpa5Mtc2VA2xC'
const POLLLINK = 'https://docs.google.com/forms/d/e/1FAIpQLSel6ym_rJHduxkgeimzf9HdNbBMB5Kak7Fmk0Bl2O7O8XhVGg/viewform?usp=sf_link'
const VSGOLDINFOLINK = 'https://www.vicioussyndicate.com/membership/vs-gold/'


// Global Variables

const ladder_times =  ['lastDay','last2Weeks']
const ladder_times_premium = ['last6Hours','last12Hours','lastDay','last3Days','lastWeek','last2Weeks']

const ladder_ranks =  ['ranks_all']
// const ladder_ranks_premium = ['ranks_all','ranks_L_5','ranks_6_15']
const ladder_ranks_premium = ['ranks_all','ranks_L','ranks_1_4','ranks_5_14']

const ladder_plotTypes = []

const table_times =   ['last2Weeks']
const table_times_premium = ['last3Days','lastWeek','last2Weeks']

const table_sortOptions = ['frequency','winrate']
const table_sortOptions_premium = ['frequency','winrate','matchup']

const table_numArch = 16
const table_ranks =   ['ranks_all']
// const table_ranks_premium = ['ranks_all','ranks_L_5','ranks_6_15']
const table_ranks_premium = ['ranks_all','ranks_L','ranks_1_4','ranks_5_14']


var MU_COLOR_IDX = 0

const hsRanks =       21
const hsClasses =     ['Druid','Hunter','Mage','Paladin','Priest','Rogue','Shaman','Warlock','Warrior']
const hsFormats =     ['Standard','Wild']


const rankRange = {
    ranks_all:      [0,20],
    ranks_L:        [0,0],
    ranks_1_5:      [1,5],
    ranks_1_4:      [1,4], 
    ranks_L_5:      [0,5],
    ranks_6_15:     [6,15],
    ranks_5_14:     [5,14],
}

function tier_classifier(wr) {
    if (wr < 0.47) {return 4}
    if (wr < 0.5)  {return 3}
    if (wr < 0.52) {return 2}
    return 1
}


const cardDust = {
    Free: 0,
    Basic: 0,
    Common: 40,
    Rare: 100,
    Epic: 400,
    Legendary: 1600,
}


// Text

const btnIdToText = {
    Standard: 'Standard',
    Wild: 'Wild',
    
    ranks_all: 'All Ranks',
    ranks_L: 'Legend Ranks',
    ranks_1_4: 'Ranks 1-4',
    ranks_1_5: 'Ranks 1-5', 
    ranks_L_5: 'Ranks L-5',
    ranks_6_15: 'Ranks 6-15',
    ranks_5_14: 'Ranks 5-14',

    last6Hours: 'Last 6 Hours',
    last12Hours: 'Last 12 Hours',
    lastDay: 'Last Day',
    last3Days: 'Last 3 Days',
    lastWeek: 'Last Week',
    last2Weeks: 'Last 2 Weeks',
    last3Weeks: 'Last 3 Weeks',
    lastMonth: 'Last Month',

    class: 'By Class',
    frequency: 'By Frequency',
    winrate: 'By Winrate',
    matchup: 'By Matchup',
    
    frSubplot: 'Frequency',
    wrSubplot: 'Winrate',

    classes: 'Classes',
    decks: 'Archetypes',
}


const btnIdToText_m = {
    Standard: 'Std',
    Wild: 'Wild',
    
    ranks_all: 'R: All',
    ranks_L: 'R: L',
    ranks_1_5: 'R: 1-5', 
    ranks_L_5: 'R: L-5',
    ranks_6_15: 'R: 6-15',

    last6Hours: '6 Hours',
    last12Hours: '12 Hours',
    lastDay: '1 Day',
    last3Days: '3 Days',
    lastWeek: '1 Week',
    last2Weeks: '2 Weeks',
    last3Weeks: '3 Weeks',
    lastMonth: '1 Month',

    class: 'Class',
    frequency: 'Freq.',
    winrate: 'Wr',
    matchup: 'Mu',
    
    frSubplot: 'Frequency',
    wrSubplot: 'Winrate',

    classes: 'Classes',
    decks: 'Archetypes',
}




// // Material
const hsColors = {
    Druid:      '#795548',
    Hunter:     '#689f38',
    Mage:       '#4fc3f7',
    Paladin:    '#ffee58',
    Priest:     '#bdbdbb',
    Rogue:      '#424242',
    Shaman:     '#5c6bc0',
    Warlock:    '#9c27b0',
    Warrior:    '#f44336',
}



const hsArchColors = { // switch switch
    Druid:      ['#3d2a25','#694f3f','#543f33','#b88230','#d39e48'],
    Hunter:     ['#67b35f','#329c50','#abda48','#bce86a','#1f7922'],
    Mage:       ['#22abb1','#74d8dd','#38ccd8','#a4dadc','#b5eef0'],
    Paladin:    ['#ffda74','#ffc42e','#ffee58','#fbffaa','#ff8f00',],
    Priest:     ['#95a482','#bfc6b1','#9eb5a5','#cad3be','#e3e6dd'],
    Rogue:      ['#3e4447','#2a3231','#4d5c5a','#5e716f','#0e1413'],
    Shaman:     ['#002b8d','#0074be','#0052b4','#009ec7','#00b6e5'],
    Warlock:    ['#d95dab','#470f26','#902661','#591c55','#c33891'],
    Warrior:    ['#ba1419','#f83f4a','#ec191d','#ea5e53','#fc736b'],
}


var hsFontColors = {
    Druid:      '#fff',
    Hunter:     '#222',
    Mage:       '#222',
    Paladin:    '#222',
    Priest:     '#222',
    Rogue:      '#fff',
    Shaman:     '#fff',
    Warlock:    '#fff',
    Warrior:    '#fff',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
}

