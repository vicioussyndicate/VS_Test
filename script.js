/*


INFO



*/

var t0 = performance.now();





// LOAD

window.onload = function() {
    
    setupUI()
    setupFirebase() // 1. setup table, 2. setup ladder 
}



// AFTER LOADING

function finishedLoading() {
    
    plotClassLadder(ui.classLadder.f,ui.classLadder.t)
    sortClassLadderBy(ui.classLadder.sortBy) // ladder plotted in ui.js -> showWindow
    sortTableBy('frequency')

    ui.fullyLoaded = true

    console.log("App initializing took " + (performance.now() - t0) + " ms.")
}




// Global Variables
var hsRanks = 21
var numArch_ladder = 0
var numArch_table_std = 20      // top 14 archetype will be posted on the table
var numArch_table_wild = 20
var ladder_xmin = 0.01         // minimal x value

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
/*
var hsColors = {
    Druid: "bc7700",
    Hunter: "1a7c3f",
    Mage: "3db49b",
    Paladin: "ffad77",
    Priest: "ddd9bb",
    Rogue: "729172",
    Shaman: "306291",
    Warlock: "da269a",
    Warrior: "880d05"}*/
/*
c_delta = 46
hsColors = {
    Druid:      colorRange(188,133,37,c_delta),
    Hunter:     colorRange(155,195,34,c_delta),
    Mage:       colorRange(32,172,213,c_delta),
    Paladin:    colorRange(203,193,25,c_delta),
    Priest:     colorRange(225,224,214,c_delta),
    Rogue:      colorRange(82,92,84,c_delta),
    Shaman:     colorRange(50,108,195,c_delta),
    Warlock:    colorRange(136,52,189,c_delta),
    Warrior:    colorRange(135,18,18,c_delta),
    Other:      randomColor(),
    '':         randomColor(),
    '§':        randomColor(),
}

console.log('class Colors:',hsColors)
*/
// GOOD THEMES:
// { Druid: "rgb(181,108,62)", Hunter: "rgb(145,229,0)", Mage: "rgb(18,200,203)", Paladin: "rgb(187,235,56)", Priest: "rgb(255,247,193)", Rogue: "rgb(83,74,61)", Shaman: "rgb(45,143,154)", Warlock: "rgb(99,19,232)", Warrior: "rgb(175,1,6)" }
//{ Druid: "rgb(158,131,8)", Hunter: "rgb(160,210,13)", Mage: "rgb(24,199,208)", Paladin: "rgb(238,156,40)", Priest: "rgb(230,224,168)", Rogue: "rgb(41,80,77)", Shaman: "rgb(24,113,193)", Warlock: "rgb(150,75,185)", Warrior: "rgb(167,0,24)" }
//{ Druid: "rgb(142,145,75)", Hunter: "rgb(196,231,0)", Mage: "rgb(29,139,191)", Paladin: "rgb(244,213,6)", Priest: "rgb(243,201,203)", Rogue: "rgb(100,131,107)", Shaman: "rgb(49,64,197)", Warlock: "rgb(109,82,168)", Warrior: "rgb(146,53,41)", Other: "rgb(39,233,133)", 2 more… }
//{ Druid: "rgb(171,168,73)", Hunter: "rgb(111,183,56)", Mage: "rgb(0,155,231)", Paladin: "rgb(220,150,45)", Priest: "rgb(232,245,218)", Rogue: "rgb(98,77,91)", Shaman: "rgb(76,141,190)", Warlock: "rgb(134,60,190)", Warrior: "rgb(90,33,0)", Other: "rgb(72,209,219)", 2 more… }
//{Druid: "rgb(183,134,80)", Hunter: "rgb(163,231,0)", Mage: "rgb(10,138,223)", Paladin: "rgb(232,162,23)", Priest: "rgb(248,255,206)", …}"": "rgb(4,63,137)"Druid: "rgb(183,134,80)"Hunter: "rgb(163,231,0)"Mage: "rgb(10,138,223)"Other: "rgb(26,216,36)"Paladin: "rgb(232,162,23)"Priest: "rgb(248,255,206)"Rogue: "rgb(114,77,125)"Shaman: "rgb(12,131,162)"Warlock: "rgb(120,63,184)"Warrior: "rgb(112,41,18)"§: "rgb(41,61,206)"__proto__: Object
//{Druid: "rgb(191,101,45)", Hunter: "rgb(157,150,65)", Mage: "rgb(18,189,181)", Paladin: "rgb(243,202,47)", Priest: "rgb(200,255,238)", …}


var colorscale_Table = [
    [0, '#a04608'],
    [0.3, '#d65900'],
    [0.5, '#FFFFFF'],
    [0.7,'#00a2bc'],
    [1, '#055c7a']
];



var hsColors = {
    Druid:      '#786530',
    Hunter:     '#519e2e',
    Mage:       '#72b1e8',
    Paladin:    '#f8c100',
    Priest:     '#fbf7f7',
    Rogue:      '#335057',
    Shaman:     '#3e59d5',
    Warlock:    '#ac40ac',
    Warrior:    '#88042d',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
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


function colorRange(r,b,g,delta) {
    var color = 'rgb('
    for (c of [r,b,g]) {
        var x = c+randint(-delta,delta)
        if (x>255){x=255}
        if (x<0){x=0}
        color+=x+','
    }
    return color.slice(0,-1)+')'
}

function colorStringRange(hex,delta) {
    var color = 'rgb('
    var color_old = hexToRgb(hex)

    for (c of color_old) {
        var x = c+randint(-delta,delta)
        if (x>255){x=255}
        if (x<0){x=0}
        color+=x+','
    }
    return color.slice(0,-1)+')'
}

function getRGB(str){
  var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  return match ? [
    parseInt(match[1]),
    parseInt(match[2]),
    parseInt(match[3])
  ] : [];
}



function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}




























