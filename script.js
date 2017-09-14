

var t0 = performance.now();



// Global Data
var DATABASE
var auth

// Windows
var powerWindow
var decksWindow
var tableWindow
var ladderWindow
var ui

// Global Variables
var hsRanks =       21
var hsClasses =     ["Druid","Hunter","Mage","Paladin","Priest","Rogue","Shaman","Warlock","Warrior"]
var hsFormats =     ['Standard','Wild']
var ladder_times =  ['lastDay','lastWeek','lastMonth']
var ladder_ranks =  ['ranks_L_5','ranks_6_15','ranks_all']
var table_times =   ['lastWeek','lastMonth']
var table_ranks =   ['ranks_L_5','ranks_6_15','ranks_all']




window.onload = function() {
    ui = new UI()
    ui.showLoader()
    setupFirebase()
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
    DATABASE = firebase.database()
    


    const emailTxt = document.getElementById('emailInput')
    const passwordTxt = document.getElementById('passwordInput')
    const loginBtn = document.getElementById('loginBtn')
    const logOutBtn = document.getElementById('logOutBtn')
    const signupBtn = document.getElementById('signUpBtn')
    const errorMsg = document.getElementById('loginErrorMsg')




    loginBtn.addEventListener('click', e => {
        const email = emailTxt.value
        const password = passwordTxt.value
        auth = firebase.auth()

        const promise = auth.signInWithEmailAndPassword(email,password);
        promise.catch(e => {console.log(e.message); errorMsg.innerHTML = 'Username or Password incorrect'})
    });



    signUpBtn.addEventListener('click', e => {
        const email = emailTxt.value
        const password = passwordTxt.value
        auth = firebase.auth()

        const promise = auth.createUserWithEmailAndPassword(email,password);
        promise.catch(e => {console.log(e.message); errorMsg.innerHTML = 'invalid email'})
    });

    logOutBtn.addEventListener('click', e => {
        firebase.auth().signOut()

    });

    firebase.auth().onAuthStateChanged(firebaseUser => {

        if (firebaseUser) {
            console.log('user logged in:',firebaseUser)
            logOutBtn.classList.remove('hidden')
            signUpBtn.classList.add('hidden')
            loginBtn.classList.add('hidden')
            errorMsg.innerHTML = ''
        } else {
            console.log('not logged in')
            logOutBtn.classList.add('hidden')
            loginBtn.classList.remove('hidden')
            signUpBtn.classList.remove('hidden')
        }
    })


    tableWindow = new TableWindow(hsFormats, table_times, table_ranks)
    ladderWindow = new LadderWindow(hsFormats, ladder_times, ladder_ranks)
    decksWindow = new DecksWindow(hsFormats)

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






function overlay() {
    if (ui.overlay) {document.getElementById("overlay").style.display = "none"; ui.overlay = false}
    else {document.getElementById("overlay").style.display = "block"; ui.overlay = true}
    
}









var colorscale_Table = [
    [0, '#a04608'],
    [0.3, '#d65900'],
    [0.5, '#FFFFFF'],
    [0.7,'#00a2bc'],
    [1, '#055c7a']
];


// VS Colors
var hsColors = {
    Druid:      '#8C564B',
    Hunter:     '#2CA02C',
    Mage:       '#17BECF',
    Paladin:    '#FFDA66',
    Priest:     '#7F7F7F',
    Rogue:      '#000000',
    Shaman:     '#1F77B4',
    Warlock:    '#9467BD',
    Warrior:    '#D62728',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
}

// In between
var hsColors = {
    Druid:      '#855043',
    Hunter:     '#72d946',
    Mage:       '#0090d0',
    Paladin:    '#fdd458',
    Priest:     '#b3b9bc',
    Rogue:      '#203338',
    Shaman:     '#2062a9',
    Warlock:    '#d072df',
    Warrior:    '#b31a27',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
}

// Compromise 2

var hsColors = {
    Druid:      '#7d554b',
    Hunter:     '#1ea124',
    Mage:       '#44d0e3',
    Paladin:    '#f6de5d',
    Priest:     '#abb9c2',
    Rogue:      '#1f3739',
    Shaman:     '#116eb5',
    Warlock:    '#cf78dd',
    Warrior:    '#a9070c',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
}


// Compromise 3 Muted

var hsColors = {
    Druid:      '#7e564b',
    Hunter:     '#65bb4a',
    Mage:       '#248ec2',
    Paladin:    '#f8be42',
    Priest:     '#a1b6ce',
    Rogue:      '#223135',
    Shaman:     '#0e7290',
    Warlock:    '#c67dd2',
    Warrior:    '#a21a1f',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
}



// Compromise 3 Weird

var hsColors = {
    Druid:      '#7e4949',
    Hunter:     '#49a211',
    Mage:       '#5adccd',
    Paladin:    '#ffb145',
    Priest:     '#a4a8ba',
    Rogue:      '#1f3738',
    Shaman:     '#1877ab',
    Warlock:    '#c483ff',
    Warrior:    '#a9070c',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
}


// Compromise 4 blue blended


var hsColors = {
    Druid:      '#774f53',
    Hunter:     '#19982a',
    Mage:       '#58c3ee',
    Paladin:    '#fac333',
    Priest:     '#83969e',
    Rogue:      '#16161b',
    Shaman:     '#0c6aa1',
    Warlock:    '#552fa5',
    Warrior:    '#d12825',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
}

// RIVER PICTURE


var hsColors = {
    Druid:      '#665730',
    Hunter:     '#4f8f49',
    Mage:       '#98c9dc',
    Paladin:    '#caa73f',
    Priest:     '#f7f4b5',
    Rogue:      '#172323',
    Shaman:     '#2b789e',
    Warlock:    '#514384',
    Warrior:    '#c02e31',
    Other:      '#88042d',
    '':         '#88042d',
    '§':        '#88042d',
}



// Washed out

// var hsColors = {
//     Druid:      '#9f8868',//'#836353',
//     Hunter:     '#6fbe24',//'#74a121',
//     Mage:       '#7dc0f1',
//     Paladin:    '#f3ba0c',
//     Priest:     '#d8e1e6',//'#fdfde3',
//     Rogue:      '#335057', // osfjaksadf
//     Shaman:     '#3b5fcd',
//     Warlock:    '#b25bba',//'#a249a2',
//     Warrior:    '#88042d',
//     Other:      '#88042d',
//     '':         '#88042d',
//     '§':        '#88042d',
// }




const btnIdToText = {
    Standard: 'Standard',
    Wild: 'Wild',
    
    ranks_all: 'All Ranks',
    ranks_L: 'Legend Ranks',
    ranks_1_5: 'Ranks 1-5', 
    ranks_L_5: 'Ranks L-5',
    ranks_6_15: 'Ranks 6-15',

    lastDay: 'Last Day',
    lastWeek: 'Last Week',
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












