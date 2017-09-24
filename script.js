

var t0 = performance.now();



// Global Data
var DATABASE
var PREMIUM = false
var MOBILE = false

// Windows
var powerWindow
var decksWindow
var tableWindow
var ladderWindow
var ui

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
const table_sortOptions_premium = ['class','frequency','winrate','matchup']


const table_ranks =   ['ranks_all']
const table_ranks_premium = ['ranks_all','ranks_L_5','ranks_6_15']




window.onload = function() {
    if (window.innerWidth <= 756) { MOBILE = true; console.log('mobile')}

    setupFirebase()
    ui = new UI()
    ui.showLoader()
}





function finishedLoading() {

    if (!(tableWindow.fullyLoaded && ladderWindow.fullyLoaded && decksWindow.fullyLoaded)) {return}
    

    powerWindow = new PowerWindow()
    powerWindow.plot()
    ladderWindow.plot()
    tableWindow.plot()
    decksWindow.plot()

    ui.fullyLoaded = true
    ui.hideLoader()
    console.log("App initializing took " + (performance.now() - t0) + " ms.")
}
















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

// Sun Picture
var hsColors = {
    Druid:      '#674f3a',//'#725d4d',
    Hunter:     '#719038',//'#5f8732',
    Mage:       '#90bbc3',//'#89b9c8',
    Paladin:    '#ffd96d',
    Priest:     '#cfcbb3',//'#ddd9be', //'#fdfae9',//'#fff3c7',
    Rogue:      '#0b250b',
    Shaman:     '#1a5d72',
    Warlock:    '#ad5c7b',
    Warrior:    '#dc7852',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
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

const rankRange = {
    ranks_all:      [0,20],
    ranks_L:        [0,0],
    ranks_1_5:      [1,5], 
    ranks_L_5:      [0,5],
    ranks_6_15:     [6,15],
}



// Utility

function choice(arr) {return arr[Math.floor(Math.random()*arr.length)]}
function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
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


function hsColorScale(hsClass,x) {
    const xMax = 0.25
    const xMin = 0.15

    x -= xMin
    if (x<0) {x = 0}
    if (x>xMax-xMin) {x = xMax - xMin}

    x /= xMax
    x = 0
    var c1 = hexToRgb(hsColors[hsClass])
    var c2 = hexToRgb(hsColors2[hsClass])

    var r, g, b

    r = parseInt( c1[0] + (c2[0] - c1[0])*x )
    g = parseInt( c1[1] + (c2[1] - c1[1])*x )
    b = parseInt( c1[2] + (c2[2] - c1[2])*x )

    var color = 'rgb('+r+','+g+','+b+')'
    
    return color
}




function detectswipe(el,func) {
    swipe_det = new Object();
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    var min_x = 30;  //min x swipe for horizontal swipe
    var max_x = 30;  //max x difference for vertical swipe
    var min_y = 50;  //min y swipe for vertical swipe
    var max_y = 60;  //max y difference for horizontal swipe
    var direc = "";
    ele = document.querySelector(el);
    ele.addEventListener('touchstart',function(e){
      var t = e.touches[0];
      swipe_det.sX = t.screenX; 
      swipe_det.sY = t.screenY;
    },false);
    ele.addEventListener('touchmove',function(e){
      e.preventDefault();
      var t = e.touches[0];
      swipe_det.eX = t.screenX; 
      swipe_det.eY = t.screenY;    
    },false);
    ele.addEventListener('touchend',function(e){
      //horizontal detection
      if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
        if(swipe_det.eX > swipe_det.sX) direc = "r";
        else direc = "l";
      }
      //vertical detection
      else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
        if(swipe_det.eY > swipe_det.sY) direc = "d";
        else direc = "u";
      }
  
      if (direc != "") {
        if(typeof func == 'function') func(el,direc);
      }
      direc = "";
      swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    },false);  
  }
  
  function myfunction(el,d) {
    alert("you swiped on element with id '"+el+"' to "+d+" direction");
  }



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












