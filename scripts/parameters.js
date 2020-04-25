const DISCORDLINK = "https://discordapp.com/invite/0oxwpa5Mtc2VA2xC";
const POLLLINK =
  "https://docs.google.com/forms/d/e/1FAIpQLSel6ym_rJHduxkgeimzf9HdNbBMB5Kak7Fmk0Bl2O7O8XhVGg/viewform?usp=sf_link";
const VSGOLDINFOLINK = "https://www.vicioussyndicate.com/membership/vs-gold/";

// Message when opening app - Basic
// removed the line from the paragraph below - <b class='marker'>Update:</b> VS Live version <b>2.0</b> has launched. Head on to the info tab to find out more.<br><br>
const overlayText1 = `

<span style='font-size:200%;font-weight:bold;padding-left:2rem;'>Greetings Travelers,</span><br><br><br>

Welcome to the VS Live web app where you can explore the newest Hearthstone data and find 

out about frequency and win rates of your favorite decks.<br><br>

To get more information on the current tab simply click on the 

    <div class='fa fa-question-circle' style='display:inline-block'></div>

icon in the top right corner.<br><br>

Upgrade to vS Gold to visit the gold version of this app. Check the link more information:<br><br><br>

<button id='basicBtn'>BASIC</button>
<img src='Images/arrow.png' class='arrow'>
<a href=${VSGOLDINFOLINK} target="_blank">
<button id='premiumBtn'>GOLD</button>
</a>

<br>

To give feedback simply click on the discord link below:<br><br><br>

<a href=${DISCORDLINK}
   target="_blank"><img class='discordLogo' src="Images/discordLogo.png"></a><br><br>

`;

// Message when opening app - PREMIUM
const overlayText2 = `

<span style='font-size:200%;font-weight:bold;padding-left:2rem'>Greetings Travelers,</span><br><br><br>

Welcome to the VS Live web app where you can explore the newest Hearthstone data and find 

out about frequency and win rates of your favorite decks.<br><br>

To get more information on the current tab simply click on the 

    <div class='fa fa-question-circle' style='display:inline-block'></div>

icon in the top right corner.<br><br>

<b class='marker'>Update:</b> VS Live version <b>2.0</b> has launched. Head on to the info tab to find out more.<br><br>

Thank you for using vS Live Gold.

<br><br>

To give feedback simply click on the discord link below:<br><br><br>

<a href=${DISCORDLINK}
   target="_blank"><img class='discordLogo' src="Images/discordLogo.png"></a><br><br>

`;

// Global Variables

const ladder_times = ["lastDay", "last2Weeks"];
const ladder_times_premium = [
  "last6Hours",
  "last12Hours",
  "lastDay",
  "last3Days",
  "lastWeek",
  "last2Weeks",
];

const ladder_ranks = ["ranks_all"];

/*
.  Overview tab Rank filter drop down for some of the graphs
   ranks are cumulative as defined below in the format "key" -> label - description
  "ranks_all" -> All Ranks - All Games
  "legend" -> Legend - Only Legend league
  "diamond_1_4" -> D4+ = All games from D1-4 & Legend together
  "diamond_5_10" ->D10+ = All games from D5-10, D1-4, & Legend
  "platinum" -> platinum+ = All games from Platinum, D5-10, D1-4, & Legend
*/

const ladder_ranks_premium = [
  //   "ranks_all",   "ranks_L",  "ranks_1_4", "ranks_5_14", "ranks_6_15",
  "ranks_all",
  "legend",
  "diamond_1_4",
  "diamond_5_10",
  "platinum",
  //"gold_silver_bronze",
];

const ladder_plotTypes = [];

const table_times = ["last2Weeks"];
const table_times_premium = ["last3Days", "lastWeek", "last2Weeks"];

const table_sortOptions = ["frequency", "winrate"];
const table_sortOptions_premium = ["frequency", "winrate", "matchup"];

const table_numArch = 16;

const table_ranks = ["ranks_all"];
// const table_ranks_premium = ['ranks_all','ranks_L_5','ranks_6_15']

/*
.  Match up tab Rank filter drop down
   ranks are cumulative as defined below in the format "key" -> label - description
  "ranks_all" -> All Ranks - All Games
  "legend" -> Legend - Only Legend league
  "diamond_1_4" -> D4+ = All games from D1-4 & Legend together
  "diamond_5_10" ->D10+ = All games from D5-10, D1-4, & Legend
  "platinum" -> platinum+ = All games from Platinum, D5-10, D1-4, & Legend
*/

const table_ranks_premium = [
  "ranks_all",
  "legend",
  "diamond_1_4",
  "diamond_5_10",
  "platinum",
  //"gold_silver_bronze",
];

const rankingSystem = {
  legend: { start: 0, end: 0 },
  diamond: { start: 1, end: 10 },
  platinum: { start: 11, end: 20 },
  gold: { start: 21, end: 30 },
  silver: { start: 31, end: 40 },
  bronze: { start: 41, end: 50 },
};

var MU_COLOR_IDX = 0;

//const hsRanks =       21
const hsRanks = 20; // columns/groups in the overview tab
const hsClasses = [
  "DemonHunter",
  "Druid",
  "Hunter",
  "Mage",
  "Paladin",
  "Priest",
  "Rogue",
  "Shaman",
  "Warlock",
  "Warrior",
];
const hsFormats = ["Standard", "Wild"];

// const rankRange = { ranks_all: [0, 51], ranks_L: [0, 0], ranks_1_5: [1, 5], ranks_1_4: [1, 4], ranks_L_5: [0, 5], ranks_6_15: [6, 15], ranks_5_14: [5, 14], };
// const rankRange = {ranks_all: [0, 50],legend: [0, 0],diamond_1_4: [1, 4],diamond_5_10: [5, 10],platinum: [11, 20],gold_silver_bronze: [31, 50],};

const rankRange = {
  ranks_all: [0, 19],
  legend: [0, 0],
  diamond_1_4: [0, 4],
  diamond_5_10: [0, 10],
  platinum: [0, 15],
  gold_silver_bronze: [0, 19],
};

function tier_classifier(wr) {
  if (wr < 0.47) {
    return 4;
  }
  if (wr < 0.5) {
    return 3;
  }
  if (wr < 0.52) {
    return 2;
  }
  return 1;
}

const cardDust = {
  Free: 0,
  Basic: 0,
  Common: 40,
  Rare: 100,
  Epic: 400,
  Legendary: 1600,
};

// Text

const btnIdToText = {
  Standard: "Standard",
  Wild: "Wild",
  // ranks_all: "All Ranks", ranks_L: "Legend Ranks", ranks_1_4: "Ranks 1-4", ranks_1_5: "Ranks 1-5", ranks_L_5: "Ranks L-5", ranks_6_15: "Ranks 6-15", ranks_5_14: "Ranks 5-14",
  // labels for matchup dropdowns
  ranks_all: "All Ranks",
  legend: "Legend",
  diamond_1_4: "D4+",
  diamond_5_10: "D10+",
  platinum: "Platinum+",
  gold_silver_bronze: "G S B",

  last6Hours: "Last 6 Hours",
  last12Hours: "Last 12 Hours",
  lastDay: "Last Day",
  last3Days: "Last 3 Days",
  lastWeek: "Last Week",
  last2Weeks: "Last 2 Weeks",
  last3Weeks: "Last 3 Weeks",
  lastMonth: "Last Month",

  class: "By Class",
  frequency: "By Frequency",
  winrate: "By Winrate",
  matchup: "By Matchup",

  frSubplot: "Frequency",
  wrSubplot: "Winrate",

  classes: "Classes",
  decks: "Archetypes",
};

const btnIdToText_m = {
  Standard: "Std",
  Wild: "Wild",
  // ranks_all: "R: All", ranks_L: "R: L", ranks_1_5: "R: 1-5", ranks_L_5: "R: L-5", ranks_6_15: "R: 6-15", ranks_1_4: "R: 1-4", ranks_5_14: "R: 5-14",
  ranks_all: "All",
  legend: "Legend",
  diamond_1_4: "D4+",
  diamond_5_10: "D10+",
  platinum: "Platinum+",
  gold_silver_bronze: "G S B",

  last6Hours: "6 Hours",
  last12Hours: "12 Hours",
  lastDay: "1 Day",
  last3Days: "3 Days",
  lastWeek: "1 Week",
  last2Weeks: "2 Weeks",
  last3Weeks: "3 Weeks",
  lastMonth: "1 Month",

  class: "Class",
  frequency: "Freq.",
  winrate: "Wr",
  matchup: "Mu",

  frSubplot: "Frequency",
  wrSubplot: "Winrate",

  classes: "Classes",
  decks: "Archetypes",
};

// // Material
const hsColors = {
  DemonHunter: "#008000	",
  Druid: "#795548",
  Hunter: "#689f38",
  Mage: "#4fc3f7",
  Paladin: "#ffee58",
  Priest: "#bdbdbb",
  Rogue: "#424242",
  Shaman: "#5c6bc0",
  Warlock: "#9c27b0",
  Warrior: "#f44336",
};

const hsArchColors = {
  // switch switch
  //DemonHunter: ["#008000", "#3c9887", "#11b611", "#087008", "#89e989"],
  DemonHunter: ["#00B00C", "#00A10B", "#00920A", "#008309", "#006907"],
  Druid: ["#3d2a25", "#694f3f", "#543f33", "#b88230", "#d39e48"],
  //Hunter: ["#67b35f", "#329c50", "#abda48", "#bce86a", "#1f7922"],
  Hunter: ["#79FF00", "#71F000", "#68DA00", "#60CB00", "#57B700"],
  Mage: ["#22abb1", "#74d8dd", "#38ccd8", "#a4dadc", "#b5eef0"],
  Paladin: ["#ffda74", "#ffc42e", "#ffee58", "#fbffaa", "#ff8f00"],
  Priest: ["#95a482", "#bfc6b1", "#9eb5a5", "#cad3be", "#e3e6dd"],
  Rogue: ["#3e4447", "#2a3231", "#4d5c5a", "#5e716f", "#0e1413"],
  Shaman: ["#002b8d", "#0074be", "#0052b4", "#009ec7", "#00b6e5"],
  Warlock: ["#d95dab", "#470f26", "#902661", "#591c55", "#c33891"],
  Warrior: ["#ba1419", "#f83f4a", "#ec191d", "#ea5e53", "#fc736b"],
};

var hsFontColors = {
  DemonHunter: "#fff",
  Druid: "#fff",
  Hunter: "#222",
  Mage: "#222",
  Paladin: "#222",
  Priest: "#222",
  Rogue: "#fff",
  Shaman: "#fff",
  Warlock: "#fff",
  Warrior: "#fff",
  Other: "#88042d",
  "": "#88042d",
  "§": "#88042d",
};

const rankLabels = [
  "L",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
  "P1-2",
  "P3-4",
  "P5-6",
  "P7-8",
  "P9-10",
  "G1-5",
  "G6-10",
  "S1-10",
  "B1-10",
];
