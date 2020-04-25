// script.js loads the app class
// also has many utility functions

var t0 = performance.now();
var MOBILE = false;
var app;

window.onload = function () {
  if (window.innerWidth <= 756) {
    MOBILE = true;
    console.log("mobile");
  }
  app = new App();
};

// Utility

let wrSort = function (a, b) {
  return a.wr > b.wr ? -1 : a.wr < b.wr ? 1 : 0;
};

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
//function randomColor() {return 'rgb('+randint(0,255)+','+randint(0,255)+','+randint(0,255)+')'}
function range(a, b) {
  var range = [];
  for (var i = a; i < b; i++) {
    range.push(i);
  }
  return range;
}
function fillRange(a, b, c) {
  var range = [];
  for (var i = a; i < b; i++) {
    range.push(c);
  }
  return range;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

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

function normalize(vector) {
  let s = 0;
  for (let v of vector) {
    s += Math.abs(v);
  }
  if (s == 1 || s == 0) {
    return vector;
  }
  for (let i = 0; i < vector.length; i++) {
    vector[i] /= s;
  }
  return vector;
}

function matrixXvector(matrix, fr) {
  let wr = [];
  let fr_n = normalize(fr);
  for (let i = 0; i < fr.length; i++) {
    let w = 0;
    for (let j = 0; j < fr.length; j++) {
      w += fr_n[j] * matrix[i][j];
    }
    wr.push(w);
  }
  return wr;
}

// MOBILE

function detectswipe(el, func) {
  var swipe_det = {};
  swipe_det.sX = 0;
  swipe_det.sY = 0;
  swipe_det.eX = 0;
  swipe_det.eY = 0;
  var min_x = 30; //min x swipe for horizontal swipe
  var max_x = 30; //max x difference for vertical swipe
  var min_y = 50; //min y swipe for vertical swipe
  var max_y = 60; //max y difference for horizontal swipe
  var direc = "";
  var ele = document.querySelector(el);
  ele.addEventListener(
    "touchstart",
    function (e) {
      var t = e.touches[0];
      swipe_det.sX = t.screenX;
      swipe_det.sY = t.screenY;
    },
    false
  );
  ele.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
      var t = e.touches[0];
      swipe_det.eX = t.screenX;
      swipe_det.eY = t.screenY;
    },
    false
  );
  ele.addEventListener(
    "touchend",
    function (e) {
      //horizontal detection
      if (
        (swipe_det.eX - min_x > swipe_det.sX ||
          swipe_det.eX + min_x < swipe_det.sX) &&
        swipe_det.eY < swipe_det.sY + max_y &&
        swipe_det.sY > swipe_det.eY - max_y &&
        swipe_det.eX > 0
      ) {
        if (swipe_det.eX > swipe_det.sX) direc = "r";
        else direc = "l";
      }
      //vertical detection
      else if (
        (swipe_det.eY - min_y > swipe_det.sY ||
          swipe_det.eY + min_y < swipe_det.sY) &&
        swipe_det.eX < swipe_det.sX + max_x &&
        swipe_det.sX > swipe_det.eX - max_x &&
        swipe_det.eY > 0
      ) {
        if (swipe_det.eY > swipe_det.sY) direc = "d";
        else direc = "u";
      }

      if (direc != "") {
        if (typeof func == "function") func(el, direc);
      }
      direc = "";
      swipe_det.sX = 0;
      swipe_det.sY = 0;
      swipe_det.eX = 0;
      swipe_det.eY = 0;
    },
    false
  );
}

function myfunction(el, d) {
  alert("you swiped on element with id '" + el + "' to " + d + " direction");
}

sumArray = (list) => {
  // will return a array which will be the sum of the corresponding elements of the given 2D array
  return list[0].map((x, idx) =>
    list.reduce((sum, curr) => sum + curr[idx], 0)
  );
};

sumNumbers = (list) => {
  // will return sum of the items of the given array
  return list.reduce((a, b) => a + b, 0);
};

// modifies the given length 50 array of rank to 20 as per the 'rankLabels' defined in parameter.js
modLadderData = (ladderData, timeIntervals) => {
  for (let timeInterval of timeIntervals) {
    //to perform modifications on the given interval's data here
    let tempObj = { ...ladderData[timeInterval] }; // object to be returned

    tempObj.classRankData = reStructureArray(
      ladderData[timeInterval].classRankData
    );
    tempObj.rankData = reStructureArray(ladderData[timeInterval].rankData);
    tempObj.gamesPerRank = reStructureGamesPerRank(
      ladderData[timeInterval].gamesPerRank
    );

    ladderData[timeInterval] = tempObj;
  }
  return ladderData;
};

reStructureGamesPerRank = (list) => {
  let { legend, diamond, platinum, gold, silver, bronze } = getBreakDown(list);
  platinum = [
    sumNumbers(platinum.slice(0, 2)),
    sumNumbers(platinum.slice(2, 4)),
    sumNumbers(platinum.slice(4, 6)),
    sumNumbers(platinum.slice(6, 8)),
    sumNumbers(platinum.slice(8, 10)),
  ];
  gold = [sumNumbers(gold.slice(0, 5)), sumNumbers(gold.slice(5, 10))];
  silver = [sumNumbers(silver.slice(0, 10))];
  bronze = [sumNumbers(bronze.slice(0, 10))];

  // merging it back to a single array to plot graphs
  return legend.concat(diamond, platinum, gold, silver, bronze);
};

reStructureArray = (list) => {
  let { legend, diamond, platinum, gold, silver, bronze } = getBreakDown(list);
  platinum = [
    sumArray(platinum.slice(0, 2)),
    sumArray(platinum.slice(2, 4)),
    sumArray(platinum.slice(4, 6)),
    sumArray(platinum.slice(6, 8)),
    sumArray(platinum.slice(8, 10)),
  ];
  gold = [sumArray(gold.slice(0, 5)), sumArray(gold.slice(5, 10))];
  silver = [sumArray(silver.slice(0, 10))];
  bronze = [sumArray(bronze.slice(0, 10))];

  // merging it back to a single array to plot graphs
  return legend.concat(diamond, platinum, gold, silver, bronze);
};

getBreakDown = (list) => {
  // will return object containing seprate array for each individual class
  return {
    legend: list.slice(
      rankingSystem.legend.start,
      rankingSystem.legend.end + 1
    ),
    diamond: list.slice(
      rankingSystem.diamond.start,
      rankingSystem.diamond.end + 1
    ),
    platinum: list.slice(
      rankingSystem.platinum.start,
      rankingSystem.platinum.end + 1
    ),
    gold: list.slice(rankingSystem.gold.start, rankingSystem.gold.end + 1),
    silver: list.slice(
      rankingSystem.silver.start,
      rankingSystem.silver.end + 1
    ),
    bronze: list.slice(
      rankingSystem.bronze.start,
      rankingSystem.bronze.end + 1
    ),
  };
};
