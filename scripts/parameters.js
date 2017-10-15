
const discordLink = 'https://discord.gg/ZeAfz3'



// Global Variables

const ladder_times =  ['lastDay','last2Weeks']
const ladder_times_premium = ['last6Hours','last12Hours','lastDay','last3Days','lastWeek','last2Weeks']

const ladder_ranks =  ['ranks_all']
const ladder_ranks_premium = ['ranks_all','ranks_L_5','ranks_6_15']

const ladder_plotTypes = []

const table_times =   ['last2Weeks']
const table_times_premium = ['last3Days','lastWeek','last2Weeks']

const table_sortOptions = ['frequency']
const table_sortOptions_premium = ['frequency','class','winrate','matchup']


const table_ranks =   ['ranks_all']
const table_ranks_premium = ['ranks_all','ranks_L_5','ranks_6_15']




const hsRanks =       21
const hsClasses =     ['Druid',"Hunter","Mage","Paladin","Priest","Rogue","Shaman","Warlock","Warrior"]
const hsFormats =     ['Standard','Wild']


const rankRange = {
    ranks_all:      [0,20],
    ranks_L:        [0,0],
    ranks_1_5:      [1,5], 
    ranks_L_5:      [0,5],
    ranks_6_15:     [6,15],
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
// }


// Official wow
// var hsColors = {
//     Druid:      '#FF7D0A',
//     Hunter:     '#ABD473',
//     Mage:       '#69CCF0',
//     Paladin:    '#F58CBA',
//     Priest:     '#FFFFFF',
//     Rogue:      '#FFF569',
//     Shaman:     '#0070DE',
//     Warlock:    '#9482C9',
//     Warrior:    '#C79C6E',
//     Other:      '#88042d',
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

// Neon
// const hsColors = {
//     Druid:      '#674f3a',
//     Hunter:     '#5c9e53',//'#b0c404',
//     Mage:       '#83d8df',
//     Paladin:    '#ffbe21',
//     Priest:     '#bfc6b1',
//     Rogue:      '#2a3231',//'#1e291f',
//     Shaman:     '#0b72ca',//'#1a5d72',
//     Warlock:    '#892667',
//     Warrior:    '#ec4441',
// }

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


// var hsColors = { Druid: "rgb(158,131,8)", Hunter: "rgb(160,210,13)", Mage: "rgb(24,199,208)", Paladin: "rgb(238,156,40)", Priest: "rgb(230,224,168)", Rogue: "rgb(41,80,77)", Shaman: "rgb(24,113,193)", Warlock: "rgb(150,75,185)", Warrior: "rgb(167,0,24)" }
// var hsColors = { Druid: "rgb(171,168,73)", Hunter: "rgb(111,183,56)", Mage: "rgb(0,155,231)", Paladin: "rgb(220,150,45)", Priest: "rgb(232,245,218)", Rogue: "rgb(98,77,91)", Shaman: "rgb(76,141,190)", Warlock: "rgb(134,60,190)", Warrior: "rgb(90,33,0)" }

// const hsArchColors = { // Original
//     Druid:      ['#674f3a','#624737','#675645','#785c43','#523f2e'],
//     Hunter:     ['#719038','#597525','#6d8347','#8da238','#4f6d1a'],
//     Mage:       ['#90bbc3','#75a3a5','#a4c6c4','#89aaba','#638a8b'],
//     Paladin:    ['#ffd96d','#e9bf64','#ffe6a0','#f1f976','#ffc770'],
//     Priest:     ['#cfcbb3','#bbb7a1','#d5cec1','#c3c2a4','#aca995'],
//     Rogue:      ['#172917','#304030','#24352d','#33453f','#0c0c0c'],
//     Shaman:     ['#1a5d72','#154a5a','#326a8c','#245368','#05475d'],
//     Warlock:    ['#ad5c7b','#904c66','#ba7690','#a85494','#923d6d'],
//     Warrior:    ['#dc7852','#c25a48','#e0563b','#cc4941','#bc3b29'],
// }

// const hsArchColors = { // new
//     Druid:      ['#3d2a25','#543f33','#694f3f','#b88230','#d39e48'],
//     Hunter:     ['#1f7922','#329c50','#67b35f','#abda48','#bce86a'],
//     Mage:       ['#22abb1','#38ccd8','#74d8dd','#a4dadc','#b5eef0'],
//     Paladin:    ['#ff8f00','#ffc42e','#ffda74','#ffee58','#fbffaa'],
//     Priest:     ['#95a482','#9eb5a5','#bfc6b1','#cad3be','#e3e6dd'],
//     Rogue:      ['#0e1413','#2a3231','#3e4447','#4d5c5a','#5e716f'],
//     Shaman:     ['#002b8d','#0052b4','#0074be','#009ec7','#00b6e5'],
//     Warlock:    ['#470f26','#591c55','#902661','#c33891','#d95dab'],
//     Warrior:    ['#ba1419','#ec191d','#f83f4a','#ea5e53','#fc736b'],
// }

// const hsArchColors = { // switch
//     Druid:      ['#3d2a25','#694f3f','#543f33','#b88230','#d39e48'],
//     Hunter:     ['#1f7922','#67b35f','#329c50','#abda48','#bce86a'],
//     Mage:       ['#22abb1','#74d8dd','#38ccd8','#a4dadc','#b5eef0'],
//     Paladin:    ['#ff8f00','#ffda74','#ffc42e','#ffee58','#fbffaa'],
//     Priest:     ['#95a482','#bfc6b1','#9eb5a5','#cad3be','#e3e6dd'],
//     Rogue:      ['#0e1413','#3e4447','#2a3231','#4d5c5a','#5e716f'],
//     Shaman:     ['#002b8d','#0074be','#0052b4','#009ec7','#00b6e5'],
//     Warlock:    ['#470f26','#902661','#591c55','#c33891','#d95dab'],
//     Warrior:    ['#ba1419','#f83f4a','#ec191d','#ea5e53','#fc736b'],
// }

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

// const hsArchColors = { // high saturation
//     Druid:      ['#541c0d','#743713','#694f3f','#b88230','#f4a627'],
//     Hunter:     ['#007e05','#329c50','#67b35f','#aded26','#c4ffae'],
//     Mage:       ['#00a7af','#38ccd8','#74d8dd','#92eaee','#b5eef0'],
//     Paladin:    ['#ff9100','#ffc42e','#ffda74','#ffef58','#fbffaa'],
//     Priest:     ['#95a482','#9eb5a5','#bfc6b1','#cde3ae','#e3e6dd'],
//     Rogue:      ['#0e1413','#203c38','#424242','#4a5e5b','#5b7471'],
//     Shaman:     ['#002b8d','#0052b4','#0074be','#009ec7','#00b5e5'],
//     Warlock:    ['#470f26','#75006e','#902661','#e7149a','#f640b4'],
//     Warrior:    ['#870106','#d40509','#f83f4a','#ff6b5b','#ff8b76'],
// }

// for (var c of hsClasses) { hsArchColors[c] = shuffle(hsArchColors[c]) }


var hsFontColors = {
    Druid:      '#fff',
    Hunter:     '#fff',
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

