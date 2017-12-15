

var t0 = performance.now();



// Global Data
var DATABASE
var MOBILE = false

// Windows
var powerWindow
var decksWindow
var tableWindow
var ladderWindow
var infoWindow
var ui





window.onload = function() {
    if (window.innerWidth <= 756) { MOBILE = true; console.log('mobile')}
    ui = new UI()
    ui.showLoader()
    setupFirebase()
}


function reloadApp() {
  ui.showLoader()
  ui.loggedIn = false
  setupFirebase()
}

function reloadPremium() {
}

function reloadBasic() {
  if (!PREMIUM) {return}
  //PREMIUM = false
  ui.showLoader()
  ui.loggedIn = false
  setupFirebase()
}


function finishedLoading() {

    if (!(tableWindow.fullyLoaded && ladderWindow.fullyLoaded)) {return}
    

    powerWindow = new PowerWindow()
    decksWindow = new DecksWindow(hsFormats)
    powerWindow.plot()
    tableWindow.plot()

    ui.fullyLoaded = true
    ui.hideLoader()
    console.log("App initializing took " + (performance.now() - t0) + " ms.")
}





















// Utility

function choice(arr) {return arr[Math.floor(Math.random()*arr.length)]}
function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
//function randomColor() {return 'rgb('+randint(0,255)+','+randint(0,255)+','+randint(0,255)+')'}
function range(a,b) {var range = []; for (var i=a;i<b;i++) {range.push(i)}; return range}
function fillRange(a,b,c) {var range = []; for (var i=a;i<b;i++) {range.push(c)}; return range}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



// MOBILE

function detectswipe(el,func) {
    var swipe_det = {};
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    var min_x = 30;  //min x swipe for horizontal swipe
    var max_x = 30;  //max x difference for vertical swipe
    var min_y = 50;  //min y swipe for vertical swipe
    var max_y = 60;  //max y difference for horizontal swipe
    var direc = "";
    var ele = document.querySelector(el);
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










