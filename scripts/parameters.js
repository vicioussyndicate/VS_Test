// Global Variables
const hsRanks =       21
const hsClasses =     ['Druid',"Hunter","Mage","Paladin","Priest","Rogue","Shaman","Warlock","Warrior"]
const hsFormats =     ['Standard','Wild']

const ladder_times =  ['lastDay','last2Weeks']
const ladder_times_premium = ['last6Hours','last12Hours','lastDay','last3Days','lastWeek','last2Weeks']

const ladder_ranks =  ['ranks_all']
const ladder_ranks_premium = ['ranks_all','ranks_L_5','ranks_6_15']

const ladder_plotTypes = []

const table_times =   ['last2Weeks']
const table_times_premium = ['lastDay','last3Days','lastWeek','last2Weeks']

const table_sortOptions = ['frequency']
const table_sortOptions_premium = ['frequency','class','winrate','matchup']


const table_ranks =   ['ranks_all']
const table_ranks_premium = ['ranks_all','ranks_L_5','ranks_6_15']





const rankRange = {
    ranks_all:      [0,20],
    ranks_L:        [0,0],
    ranks_1_5:      [1,5], 
    ranks_L_5:      [0,5],
    ranks_6_15:     [6,15],
}






// Text

const btnIdToText = {
    Standard: 'Standard',
    Wild: 'Wild',
    
    ranks_all: 'All Ranks',
    ranks_L: 'Legend Ranks',
    ranks_1_5: 'Ranks 1-5', 
    ranks_L_5: 'Ranks L-5',
    ranks_6_15: 'Ranks 6-15',

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




// Colors

var colorscale_Table = [
    [0, '#a04608'],
    [0.3, '#d65900'],
    [0.5, '#FFFFFF'],
    [0.7,'#00a2bc'],
    [1, '#055c7a']
];


// // VS Colors
// var hsColors = {
//     Druid:      '#8C564B',
//     Hunter:     '#2CA02C',
//     Mage:       '#17BECF',
//     Paladin:    '#FFDA66',
//     Priest:     '#7F7F7F',
//     Rogue:      '#000000',
//     Shaman:     '#1F77B4',
//     Warlock:    '#9467BD',
//     Warrior:    '#D62728',
//     Other:      '#88042d',
//     '':         '#88042d',
//     '§':        '#88042d',
// }

// // RIVER PICTURE
// var hsColors = {
//     Druid:      '#665730',
//     Hunter:     '#4f8f49',
//     Mage:       '#98c9dc',
//     Paladin:    '#caa73f',
//     Priest:     '#f7f4b5',
//     Rogue:      '#172323',
//     Shaman:     '#2b789e',
//     Warlock:    '#514384',
//     Warrior:    '#c02e31',
//     Other:      '#88042d',
//     '':         '#88042d',
//     '§':        '#88042d',
// }

// // Sun Picture
// const hsColors = {
//     Druid:      '#674f3a',//'#725d4d',
//     Hunter:     '#719038',//'#5f8732',
//     Mage:       '#90bbc3',//'#89b9c8',
//     Paladin:    '#ffd96d',
//     Priest:     '#cfcbb3',//'#ddd9be', //'#fdfae9',//'#fff3c7',
//     Rogue:      '#1f291f',
//     Shaman:     '#1a5d72',
//     Warlock:    '#ad5c7b',
//     Warrior:    '#dc7852',
// }

// Saturated
const hsColors = {
    Druid:      '#674f3a',
    Hunter:     '#b0c404',
    Mage:       '#83d8df',
    Paladin:    '#ffe551',
    Priest:     '#cacfb3',
    Rogue:      '#1e291f',
    Shaman:     '#0b72ca',//'#1a5d72',
    Warlock:    '#892667',
    Warrior:    '#ec4441',
}



const hsArchColors = {
    Druid:      ['#674f3a','#624737','#675645','#785c43','#523f2e'],
    Hunter:     ['#719038','#597525','#6d8347','#8da238','#4f6d1a'],
    Mage:       ['#90bbc3','#75a3a5','#a4c6c4','#89aaba','#638a8b'],
    Paladin:    ['#ffd96d','#e9bf64','#ffe6a0','#f1f976','#ffc770'],
    Priest:     ['#cfcbb3','#bbb7a1','#d5cec1','#c3c2a4','#aca995'],
    Rogue:      ['#172917','#304030','#24352d','#33453f','#0c0c0c'],
    Shaman:     ['#1a5d72','#154a5a','#326a8c','#245368','#05475d'],
    Warlock:    ['#ad5c7b','#904c66','#ba7690','#a85494','#923d6d'],
    Warrior:    ['#dc7852','#c25a48','#e0563b','#cc4941','#bc3b29'],
}





var hsFontColors = {
    Druid:      '#fff',
    Hunter:     '#fff',
    Mage:       '#fff',
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

