"use strict";

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}

function setupFirebase() {
    var t = {
        apiKey: "AIzaSyAt0uIAVOFjB42_bkwrEIqhSWkMT_VmluI",
        authDomain: "data-reaper.firebaseapp.com",
        databaseURL: "https://data-reaper.firebaseio.com",
        projectId: "data-reaper",
        storageBucket: "data-reaper.appspot.com",
        messagingSenderId: "1079276848174"
    };
    firebase.initializeApp(t), DATABASE = firebase.database();
    firebase.auth().signInAnonymously();
    var e = document.getElementById("emailInput"), r = document.getElementById("passwordInput"), i = document.getElementById("loginBtn"), a = document.getElementById("logOutBtn"), s = (document.getElementById("signUpBtn"), 
    document.getElementById("loginErrorMsg"));
    i.addEventListener("click", function(t) {
        var i = e.value, a = r.value;
        firebase.auth().signInWithEmailAndPassword(i, a).catch(function(t) {
            console.log(t.message), s.innerHTML = "Username or Password incorrect";
        });
    }), signUpBtn.addEventListener("click", function(t) {
        var i = e.value, a = r.value, o = firebase.auth().createUserWithEmailAndPassword(i, a);
        o.then(function(t) {
            return saveUser(t);
        }), o.catch(function(t) {
            console.log(t.message), s.innerHTML = "invalid email";
        });
    }), a.addEventListener("click", function(t) {
        firebase.auth().signOut();
    }), firebase.auth().onAuthStateChanged(function(t) {
        ui.loggedIn || (t ? (console.log("user logged in:", t), ui.loggedIn = !0, PREMIUM = !0, 
        loadFireData(), a.classList.remove("hidden"), signUpBtn.classList.add("hidden"), 
        i.classList.add("hidden"), s.innerHTML = "") : (console.log("not logged in"), ui.loggedIn = !0, 
        a.classList.add("hidden"), i.classList.remove("hidden"), signUpBtn.classList.remove("hidden"), 
        PREMIUM = !1, loadFireData()));
    });
}

function saveUser(t) {
    console.log(t), firebase.database().ref("users/" + t.uid).set({
        username: t.displayName,
        email: t.email,
        status: "premium"
    });
    var e = {};
    e[t.uid] = !0, firebase.database().ref("premiumUsers").set(e);
}

function loadFireData() {
    PREMIUM ? (tableWindow = new TableWindow(hsFormats, table_times_premium, table_ranks_premium, table_sortOptions_premium), 
    ladderWindow = new LadderWindow(hsFormats, ladder_times_premium, ladder_ranks_premium), 
    document.querySelector("#vsLogoDiv .text").innerHTML = "Pro") : (tableWindow = new TableWindow(hsFormats, table_times, table_ranks, table_sortOptions), 
    ladderWindow = new LadderWindow(hsFormats, ladder_times, ladder_ranks), document.querySelector("#vsLogoDiv .text").innerHTML = "Live");
}

function finishedLoading() {
    tableWindow.fullyLoaded && ladderWindow.fullyLoaded && (powerWindow = new PowerWindow(), 
    decksWindow = new DecksWindow(hsFormats), powerWindow.plot(), ladderWindow.plot(), 
    tableWindow.plot(), ui.fullyLoaded = !0, ui.hideLoader(), console.log("App initializing took " + (performance.now() - t0) + " ms."));
}

function choice(t) {
    return t[Math.floor(Math.random() * t.length)];
}

function randint(t, e) {
    return t = Math.ceil(t), e = Math.floor(e), Math.floor(Math.random() * (e - t)) + t;
}

function randomColor() {
    return "rgb(" + randint(0, 255) + "," + randint(0, 255) + "," + randint(0, 255) + ")";
}

function range(t, e) {
    for (var r = [], i = t; i < e; i++) r.push(i);
    return r;
}

function fillRange(t, e, r) {
    for (var i = [], a = t; a < e; a++) i.push(r);
    return i;
}

function colorRange(t, e, r, i) {
    for (var a = "rgb(", s = [ t, e, r ], o = 0; o < s.length; o++) {
        c = s[o];
        var n = c + randint(-i, i);
        n > 255 && (n = 255), n < 0 && (n = 0), a += n + ",";
    }
    return a.slice(0, -1) + ")";
}

function colorStringRange(t, e) {
    var r = "rgb(", i = hexToRgb(t), a = !0, s = !1, o = void 0;
    try {
        for (var n, l = i[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
            c = n.value;
            var d = c + randint(-e, e);
            d > 255 && (d = 255), d < 0 && (d = 0), r += d + ",";
        }
    } catch (t) {
        s = !0, o = t;
    } finally {
        try {
            !a && l.return && l.return();
        } finally {
            if (s) throw o;
        }
    }
    return r.slice(0, -1) + ")";
}

function getRGB(t) {
    var e = t.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return e ? [ parseInt(e[1]), parseInt(e[2]), parseInt(e[3]) ] : [];
}

function hexToRgb(t) {
    var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    return e ? [ parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16) ] : null;
}

function hsColorScale(t, e) {
    (e -= .15) < 0 && (e = 0), e > .1 && (e = .1), e /= .25, e = 0;
    var r = hexToRgb(hsColors[t]), i = hexToRgb(hsColors2[t]);
    return "rgb(" + parseInt(r[0] + (i[0] - r[0]) * e) + "," + parseInt(r[1] + (i[1] - r[1]) * e) + "," + parseInt(r[2] + (i[2] - r[2]) * e) + ")";
}

function detectswipe(t, e) {
    swipe_det = new Object(), swipe_det.sX = 0, swipe_det.sY = 0, swipe_det.eX = 0, 
    swipe_det.eY = 0;
    var r = "";
    ele = document.querySelector(t), ele.addEventListener("touchstart", function(t) {
        var e = t.touches[0];
        swipe_det.sX = e.screenX, swipe_det.sY = e.screenY;
    }, !1), ele.addEventListener("touchmove", function(t) {
        t.preventDefault();
        var e = t.touches[0];
        swipe_det.eX = e.screenX, swipe_det.eY = e.screenY;
    }, !1), ele.addEventListener("touchend", function(i) {
        (swipe_det.eX - 30 > swipe_det.sX || swipe_det.eX + 30 < swipe_det.sX) && swipe_det.eY < swipe_det.sY + 60 && swipe_det.sY > swipe_det.eY - 60 && swipe_det.eX > 0 ? r = swipe_det.eX > swipe_det.sX ? "r" : "l" : (swipe_det.eY - 50 > swipe_det.sY || swipe_det.eY + 50 < swipe_det.sY) && swipe_det.eX < swipe_det.sX + 30 && swipe_det.sX > swipe_det.eX - 30 && swipe_det.eY > 0 && (r = swipe_det.eY > swipe_det.sY ? "d" : "u"), 
        "" != r && "function" == typeof e && e(t, r), r = "", swipe_det.sX = 0, swipe_det.sY = 0, 
        swipe_det.eX = 0, swipe_det.eY = 0;
    }, !1);
}

function myfunction(t, e) {
    alert("you swiped on element with id '" + t + "' to " + e + " direction");
}

var _createClass = function() {
    function t(t, e) {
        for (var r = 0; r < e.length; r++) {
            var i = e[r];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), 
            Object.defineProperty(t, i.key, i);
        }
    }
    return function(e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
    };
}(), Decklist = function t(e, r) {
    _classCallCheck(this, t), this.hsClass = r, this.cards = [], this.cardNames = [], 
    this.deckBox = document.createElement("div"), this.deckBox.className = "deckBox", 
    this.deckTitle = document.createElement("div"), this.deckTitle.className = "deckTitle", 
    this.deckTitle.innerHTML = "<p>" + e.name + "</p>", this.deckTitle.style.backgroundColor = hsColors[this.hsClass], 
    this.deckTitle.style.color = hsFontColors[this.hsClass], this.decklist = document.createElement("div"), 
    this.decklist.className = "decklist";
    var i = !0, a = !1, s = void 0;
    try {
        for (var o, n = e.cards[Symbol.iterator](); !(i = (o = n.next()).done); i = !0) {
            var l = o.value;
            this.cardNames.push(l.name);
            var d = new CardDiv(l);
            this.cards.push(d), this.decklist.appendChild(d.div);
        }
    } catch (t) {
        a = !0, s = t;
    } finally {
        try {
            !i && n.return && n.return();
        } finally {
            if (a) throw s;
        }
    }
    this.copyBtn = document.createElement("buttton"), this.copyBtn.innerHTML = "Copy To Clipboard", 
    this.copyBtn.className = "copyDL", this.copyBtn.id = "dl" + randint(0, 1e7), this.deckBox.appendChild(this.deckTitle), 
    this.deckBox.appendChild(this.decklist), this.deckBox.appendChild(this.copyBtn), 
    new Clipboard("#" + this.copyBtn.id, {
        text: function(t) {
            return e.deckCode;
        }
    });
}, CardDiv = function t(e) {
    _classCallCheck(this, t), this.name = e.name, this.cost = e.manaCost, this.quantity = e.quantity, 
    this.div = document.createElement("div"), this.div.className = "card", this.div.style.display = "block";
    var r = document.createElement("div");
    r.className = "costContainer";
    var i = document.createElement("div");
    i.className = "hex", i.innerHTML = "&#11042";
    var a = document.createElement("div");
    a.innerHTML = this.cost, a.className = "cost", this.cost >= 10 && (a.style.fontSize = "75%", 
    a.style.paddingLeft = "0.2rem", a.style.paddingTop = "0.35rem");
    var s = document.createElement("div");
    s.innerHTML = this.name, s.className = "name";
    var o = document.createElement("div");
    o.innerHTML = this.quantity > 1 ? "x" + this.quantity : "", o.className = "quantity", 
    r.appendChild(i), r.appendChild(a), this.div.appendChild(r), this.div.appendChild(s), 
    this.div.appendChild(o);
}, DecksWindow = function() {
    function t(e) {
        _classCallCheck(this, t), this.hsFormats = e, this.archDiv = document.querySelector("#decksWindow .content .archetypes .archetypeList"), 
        this.descriptionBox = document.querySelector("#decksWindow .content .descriptionBox"), 
        this.decksDiv = document.querySelector("#decksWindow .content .decklists"), this.description = document.querySelector("#decksWindow .content .descriptionBox .description"), 
        this.overlayDiv = document.querySelector("#decksWindow .overlay"), this.questionBtn = document.querySelector("#decksWindow .question"), 
        this.firebasePath = "deckData", this.archButtons = [], this.optionButtons = document.querySelectorAll("#decksWindow .optionBtn");
        var r = !0, i = !1, a = void 0;
        try {
            for (var s, o = this.optionButtons[Symbol.iterator](); !(r = (s = o.next()).done); r = !0) s.value.addEventListener("click", this.buttonTrigger.bind(this));
        } catch (t) {
            i = !0, a = t;
        } finally {
            try {
                !r && o.return && o.return();
            } finally {
                if (i) throw a;
            }
        }
        this.f = "Standard", this.hsClass = "Druid", this.hsArch = null, this.mode = "description", 
        this.deckWidth = "12rem", this.fullyLoaded = !1, this.overlay = !1, this.decklists = [], 
        this.data = {};
        var n = !0, l = !1, d = void 0;
        try {
            for (var h, c = this.hsFormats[Symbol.iterator](); !(n = (h = c.next()).done); n = !0) {
                var u = h.value;
                this.data[u] = {};
                var y = !0, f = !1, v = void 0;
                try {
                    for (var m, p = hsClasses[Symbol.iterator](); !(y = (m = p.next()).done); y = !0) {
                        var b = m.value;
                        this.data[u][b] = {}, this.data[u][b].archetypes = [], this.data[u][b].text = "";
                    }
                } catch (t) {
                    f = !0, v = t;
                } finally {
                    try {
                        !y && p.return && p.return();
                    } finally {
                        if (f) throw v;
                    }
                }
            }
        } catch (t) {
            l = !0, d = t;
        } finally {
            try {
                !n && c.return && c.return();
            } finally {
                if (l) throw d;
            }
        }
        this.loadData(), this.renderOptions(), this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), 
        this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this));
    }
    return _createClass(t, [ {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            t.target.classList.contains("archBtn") && this.deckLink(e, this.f), -1 != hsClasses.indexOf(e) && (this.hsArch = null, 
            this.loadClass(e)), "decklists" == e && this.loadDecklists(), "description" == e && this.loadDescription(), 
            "Standard" == e && this.loadFormat("Standard"), "Wild" == e && this.loadFormat("Wild"), 
            this.renderOptions();
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var i, a = this.optionButtons[Symbol.iterator](); !(t = (i = a.next()).done); t = !0) (h = i.value).classList.remove("highlighted"), 
                h.id == this.mode && h.classList.add("highlighted");
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw r;
                }
            }
            var s = !0, o = !1, n = void 0;
            try {
                for (var l, d = this.archButtons[Symbol.iterator](); !(s = (l = d.next()).done); s = !0) {
                    var h = l.value;
                    h.classList.remove("highlighted"), null != this.hsArch && h.id == this.hsArch.name && h.classList.add("highlighted");
                }
            } catch (t) {
                o = !0, n = t;
            } finally {
                try {
                    !s && d.return && d.return();
                } finally {
                    if (o) throw n;
                }
            }
            document.querySelector("#decksWindow #formatBtn").innerHTML = btnIdToText[this.f], 
            document.querySelector("#decksWindow #classBtn").innerHTML = this.hsClass;
        }
    }, {
        key: "loadData",
        value: function() {
            DATABASE.ref(this.firebasePath).on("value", this.readData.bind(this), function(t) {
                return console.log("Could not load Deck Data", t);
            });
        }
    }, {
        key: "readData",
        value: function(t) {
            if (!this.fullyLoaded) {
                var t = t.val(), e = !0, r = !1, i = void 0;
                try {
                    for (var a, s = this.hsFormats[Symbol.iterator](); !(e = (a = s.next()).done); e = !0) {
                        var o = a.value, n = !0, l = !1, d = void 0;
                        try {
                            for (var h, c = hsClasses[Symbol.iterator](); !(n = (h = c.next()).done); n = !0) {
                                var u = h.value;
                                this.data[o][u].text = t[o][u].text;
                                var y = Object.keys(t[o][u].archetypes), f = !0, v = !1, m = void 0;
                                try {
                                    for (var p, b = y[Symbol.iterator](); !(f = (p = b.next()).done); f = !0) {
                                        var w = p.value;
                                        this.data[o][u].archetypes.push({
                                            name: w,
                                            hsClass: u,
                                            hsFormat: o,
                                            decklists: []
                                        });
                                        var k = this.data[o][u].archetypes.length - 1, g = t[o][u].archetypes[w], C = Object.keys(g), T = !0, x = !1, L = void 0;
                                        try {
                                            for (var _, S = C[Symbol.iterator](); !(T = (_ = S.next()).done); T = !0) {
                                                var W = _.value;
                                                g[W];
                                                this.data[o][u].archetypes[k].decklists.push(g[W]);
                                            }
                                        } catch (t) {
                                            x = !0, L = t;
                                        } finally {
                                            try {
                                                !T && S.return && S.return();
                                            } finally {
                                                if (x) throw L;
                                            }
                                        }
                                    }
                                } catch (t) {
                                    v = !0, m = t;
                                } finally {
                                    try {
                                        !f && b.return && b.return();
                                    } finally {
                                        if (v) throw m;
                                    }
                                }
                            }
                        } catch (t) {
                            l = !0, d = t;
                        } finally {
                            try {
                                !n && c.return && c.return();
                            } finally {
                                if (l) throw d;
                            }
                        }
                    }
                } catch (t) {
                    r = !0, i = t;
                } finally {
                    try {
                        !e && s.return && s.return();
                    } finally {
                        if (r) throw i;
                    }
                }
                this.fullyLoaded = !0, console.log("decks loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                this.plot();
            }
        }
    }, {
        key: "deckLink",
        value: function(t) {
            var e, r, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Standard";
            this.mode = "decklists", this.f = i;
            var a = !0, s = !1, o = void 0;
            try {
                for (var n, l = hsClasses[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
                    var d = n.value;
                    -1 != t.indexOf(d) && (e = d);
                    var h = this.data[i][d].archetypes, c = !0, u = !1, y = void 0;
                    try {
                        for (var f, v = h[Symbol.iterator](); !(c = (f = v.next()).done); c = !0) {
                            var m = f.value;
                            if (m.name == t) {
                                e = d, r = m;
                                break;
                            }
                        }
                    } catch (t) {
                        u = !0, y = t;
                    } finally {
                        try {
                            !c && v.return && v.return();
                        } finally {
                            if (u) throw y;
                        }
                    }
                }
            } catch (t) {
                s = !0, o = t;
            } finally {
                try {
                    !a && l.return && l.return();
                } finally {
                    if (s) throw o;
                }
            }
            void 0 == e && (e = "Druid"), void 0 == r && (r = null, this.mode = "description"), 
            this.hsClass = e, this.hsArch = r, this.plot(), this.renderOptions();
        }
    }, {
        key: "plot",
        value: function() {
            this.loadFormat(this.f);
        }
    }, {
        key: "loadFormat",
        value: function(t) {
            this.f = t, this.loadClass(this.hsClass);
        }
    }, {
        key: "loadClass",
        value: function(t) {
            this.hsClass = t, "description" == this.mode && this.loadDescription(), "decklists" == this.mode && this.loadDecklists(), 
            this.archDiv.innerHTML = "";
            var e = this.data[this.f][this.hsClass].archetypes, r = !0, i = !1, a = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next()).done); r = !0) {
                    var n = s.value;
                    this.addArchetypeBtn(n);
                }
            } catch (t) {
                i = !0, a = t;
            } finally {
                try {
                    !r && o.return && o.return();
                } finally {
                    if (i) throw a;
                }
            }
            e.length > 0 && null == this.hsArch && (this.hsArch = e[0]);
        }
    }, {
        key: "loadDescription",
        value: function() {
            this.mode = "description";
            var t = this.data[this.f][this.hsClass];
            this.addDescription(this.hsClass, t.text), this.descriptionBox.style.display = "inline", 
            this.decksDiv.style.display = "none";
        }
    }, {
        key: "loadDecklists",
        value: function() {
            if (this.mode = "decklists", this.decklists = [], this.decksDiv.innerHTML = "", 
            null == this.hsArch && (this.hsArch = this.data[this.f][this.hsClass].archetypes[0]), 
            void 0 != this.hsArch) {
                var t = "", e = !0, r = !1, i = void 0;
                try {
                    for (var a, s = this.hsArch.decklists[Symbol.iterator](); !(e = (a = s.next()).done); e = !0) {
                        var o = a.value;
                        t += this.deckWidth + " ";
                        var n = new Decklist(o, this.hsClass);
                        this.decklists.push(n), this.decksDiv.appendChild(n.deckBox);
                    }
                } catch (t) {
                    r = !0, i = t;
                } finally {
                    try {
                        !e && s.return && s.return();
                    } finally {
                        if (r) throw i;
                    }
                }
                this.descriptionBox.style.display = "none", this.decksDiv.style.display = "grid", 
                this.decksDiv.style.gridTemplateColumns = t;
            } else this.hsArch = null;
        }
    }, {
        key: "addDescription",
        value: function(t, e) {
            this.description.innerHTML = '<p class="title">' + t + '</p><p class="text">' + e + "</p>";
        }
    }, {
        key: "addArchetypeBtn",
        value: function(t) {
            var e = document.createElement("button");
            e.style.backgroundColor = hsColors[t.hsClass], e.style.color = hsFontColors[t.hsClass], 
            e.innerHTML = t.name, e.id = t.name, e.style.padding = "0.2rem", e.style.marginTop = "0.2rem", 
            e.className = "archBtn", e.addEventListener("click", this.buttonTrigger.bind(this)), 
            this.archButtons.push(e), this.archDiv.appendChild(e);
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayDiv.style.display = "block", 
            this.overlay = !0);
        }
    } ]), t;
}(), History = function() {
    function t(e, r) {
        _classCallCheck(this, t), this.window = r, this.data = e, this.bgColor = "transparent", 
        this.gridcolor = "white", this.layout = {
            showlegend: !1,
            displayModeBar: !1,
            autosize: !0,
            hovermode: "closest",
            xaxis: {
                tickfont: {
                    family: "Arial, bold",
                    size: 15,
                    color: this.window.fontColor
                },
                tickcolor: "transparent",
                visible: !0,
                showgrid: !0,
                gridcolor: this.gridcolor,
                color: this.window.fontColor,
                fixedrange: !0,
                zeroline: !1,
                autorange: "reversed"
            },
            yaxis: {
                tickfont: {
                    family: "Arial, bold",
                    size: 19
                },
                ticklen: 12,
                tickcolor: "transparent",
                tickformat: ",.0%",
                gridcolor: this.gridcolor,
                fixedrange: !0,
                color: this.window.fontColorLight
            },
            plot_bgcolor: this.bgColor,
            paper_bgcolor: this.bgColor,
            annotations: [],
            margin: MOBILE ? {
                l: 60,
                r: 10,
                b: 50,
                t: 0
            } : {
                l: 70,
                r: 20,
                b: 30,
                t: 0
            }
        }, this.top = 9, this.x = {
            last6Hours: 6,
            last12Hours: 12,
            lastDay: 24,
            last3Days: 3,
            lastWeek: 7,
            last2Weeks: 14,
            last3Weeks: 21,
            lastMonth: 30
        };
    }
    return _createClass(t, [ {
        key: "plot",
        value: function() {
            this.window.chartDiv.innerHTML = "", document.querySelector("#ladderWindow .content-header #rankBtn").style.display = "inline";
            for (var t = this.window.f, e = this.window.t, r = "lastDay" == this.window.t || "last12Hours" == this.window.t || "last6Hours" == this.window.t ? "lastHours" : "lastDays", i = "lastHours" == r ? "Hour" : "Day", a = this.window.r, s = this.window.mode, o = range(1, this.x[e] + 1), n = this.data[t][r][a][s], l = [], d = [], h = 0, c = n[n.length - 1].data.slice(), u = 0; u < this.x[e] && u < c.length; u++) h += c[u];
            n.sort(function(t, e) {
                return t.avg > e.avg ? -1 : t.avg < e.avg ? 1 : 0;
            });
            for (u = 0; u < this.top; u++) {
                var y, f = n[u].name;
                y = "classes" == s ? {
                    color: hsColors[f],
                    fontColor: hsFontColors[f]
                } : this.window.getArchColor(0, f, this.window.f), d.push({
                    name: f,
                    color: y.color,
                    fontColor: y.fontColor
                });
                for (var v = "lastHours" == r ? this.smoothData(n[u].data) : n[u].data, m = [], p = 0; p < v.length; p++) {
                    var b = p > 0 ? i + "s" : i;
                    m.push(n[u].name + " (" + (100 * v[p]).toFixed(1) + "% )<br>" + o[p] + " " + b + " ago");
                }
                var w = {
                    x: o.slice(),
                    y: v.slice(),
                    text: m,
                    line: {
                        width: 2.5
                    },
                    marker: {
                        color: y.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                };
                l.push(w);
            }
            Plotly.newPlot("chart1", l, this.layout, {
                displayModeBar: !1
            }), this.window.setGraphTitle(), this.createLegend(d), this.window.setTotGames(h);
        }
    }, {
        key: "createLegend",
        value: function(t) {
            for (var e = this.window.mode, r = document.querySelector("#ladderWindow .chart-footer"); r.firstChild; ) r.removeChild(r.firstChild);
            var i = 9;
            "classes" == e && (i = 9), "decks" == e && (i = this.top) > t.length && (i = t.length);
            for (var a = 0; a < i; a++) {
                var s = document.createElement("div");
                document.createElement("div"), document.createElement("l");
                if (s.className = "legend-item", s.style.fontSize = "0.8em", "classes" == e) {
                    var o = hsClasses[a];
                    s.style.backgroundColor = hsColors[o], s.style.color = hsFontColors[o], s.id = o, 
                    s.innerHTML = o, s.onclick = function(t) {
                        ui.deckLink(t.target.id, this.window.f);
                    };
                }
                if ("decks" == e) {
                    var n = t[a];
                    s.style.backgroundColor = n.color, s.style.color = n.fontColor, s.id = n.name, s.innerHTML = n.name, 
                    s.onclick = function(t) {
                        ui.deckLink(t.target.id, this.window.f);
                    };
                }
                r.appendChild(s);
            }
        }
    }, {
        key: "smoothData",
        value: function(t) {
            for (var e = [], r = 0; r < t.length; r++) {
                var i = 0, a = 0;
                r > 0 && (a += .3 * t[r - 1], i += .3), r < t.length - 1 && (a += .3 * t[r + 1], 
                i += .3), a += t[r] * (1 - i), e.push(a);
            }
            return e;
        }
    } ]), t;
}(), Ladder = function() {
    function t(e, r, i, a) {
        _classCallCheck(this, t), this.maxLegendEntries = 9, this.maxLines = 10, this.bgColor = "transparent", 
        this.fontColor = a.fontColor, this.fontColorLight = a.fontColorLight, this.lineWidth = 2.7, 
        this.fr_min = .03, this.DATA = e, this.f = r, this.t = i, this.window = a, this.archetypes = [], 
        this.c_data = {}, this.traces_bar = {
            classes: [],
            decks: []
        }, this.traces_line = {
            classes: [],
            decks: []
        }, this.traces_zoom = {}, this.traces_pie = {
            classes: {},
            decks: {}
        }, this.archLegend = [], this.classLegend = [], this.totGames = 0, this.totGamesRanks = {}, 
        this.download = {
            classes: "",
            decks: ""
        }, this.rankLabels = [], this.tiers = [];
        var s = !0, o = !1, n = void 0;
        try {
            for (var l, d = this.window.ranks[Symbol.iterator](); !(s = (l = d.next()).done); s = !0) {
                var h = l.value;
                this.tiers.push({
                    name: btnIdToText[h],
                    buttonId: h,
                    start: rankRange[h][0],
                    end: rankRange[h][1]
                });
            }
        } catch (t) {
            o = !0, n = t;
        } finally {
            try {
                !s && d.return && d.return();
            } finally {
                if (o) throw n;
            }
        }
        this.tier = this.tiers[0];
        var c = !0, u = !1, y = void 0;
        try {
            for (var f, v = hsClasses[Symbol.iterator](); !(c = (f = v.next()).done); c = !0) {
                rt = f.value;
                this.traces_zoom[rt] = [];
            }
        } catch (t) {
            u = !0, y = t;
        } finally {
            try {
                !c && v.return && v.return();
            } finally {
                if (u) throw y;
            }
        }
        var m = !0, p = !1, b = void 0;
        try {
            for (var w, k = this.tiers[Symbol.iterator](); !(m = (w = k.next()).done); m = !0) {
                var g = w.value;
                this.totGamesRanks[g.buttonId] = 0;
                var C = {
                    values: [],
                    labels: [],
                    marker: {
                        colors: []
                    },
                    textfont: {
                        color: []
                    },
                    hoverinfo: "label+percent",
                    insidetextfont: {
                        color: "white"
                    },
                    outsidetextfont: {
                        color: "transparent"
                    },
                    text: [],
                    type: "pie"
                }, T = [], x = !0, L = !1, _ = void 0;
                try {
                    for (var S, W = hsClasses[Symbol.iterator](); !(x = (S = W.next()).done); x = !0) rt = S.value, 
                    T.push(hsColors[rt]);
                } catch (t) {
                    L = !0, _ = t;
                } finally {
                    try {
                        !x && W.return && W.return();
                    } finally {
                        if (L) throw _;
                    }
                }
                var B = {
                    values: fillRange(0, hsClasses.length, 0),
                    labels: hsClasses.slice(),
                    marker: {
                        colors: T
                    },
                    hoverinfo: "label+percent",
                    insidetextfont: {
                        color: "white"
                    },
                    outsidetextfont: {
                        color: "#222"
                    },
                    text: hsClasses.slice(),
                    type: "pie"
                };
                this.traces_pie.decks[g.buttonId] = [ C ], this.traces_pie.classes[g.buttonId] = [ B ];
            }
        } catch (t) {
            p = !0, b = t;
        } finally {
            try {
                !m && k.return && k.return();
            } finally {
                if (p) throw b;
            }
        }
        var M = e.archetypes, E = e.gamesPerRank;
        this.rankSums = e.gamesPerRank;
        for (var I = this.smoothLadder(e.rankData, E.slice()), D = this.smoothLadder(e.classRankData, E.slice()), q = 0; q < hsRanks; q++) {
            q % 5 == 0 ? this.rankLabels.push(q + "  ") : this.rankLabels.push(""), this.totGames += E[q];
            var A = !0, H = !1, F = void 0;
            try {
                for (var R, O = this.tiers[Symbol.iterator](); !(A = (R = O.next()).done); A = !0) q >= (g = R.value).start && q <= g.end && (this.totGamesRanks[g.buttonId] += E[q]);
            } catch (t) {
                H = !0, F = t;
            } finally {
                try {
                    !A && O.return && O.return();
                } finally {
                    if (H) throw F;
                }
            }
        }
        this.rankLabels[0] = "L  ";
        for (q = 0; q < M.length; q++) {
            var P = [], z = [], N = [], G = 0, U = M[q][1] + " " + M[q][0].replace("§", ""), X = hsClasses.indexOf(M[q][0]), Y = this.window.getArchColor(M[q][0], M[q][1], this.f), V = Y.fontColor;
            Y = Y.color;
            for (st = 0; st < hsRanks; st++) {
                ot = I[st][q];
                z.push(ot), N.push("<b>" + U + "     </b><br>freq: " + (100 * ot).toFixed(1) + "%"), 
                ot < this.fr_min && q > 8 && (this.traces_bar.decks[X].y[st] += ot, ot = 0), G += ot, 
                P.push(ot);
                var j = !0, K = !1, $ = void 0;
                try {
                    for (var J, Q = this.tiers[Symbol.iterator](); !(j = (J = Q.next()).done); j = !0) if (st == (g = J.value).start && (this.traces_pie.decks[g.buttonId][0].values.push(ot), 
                    this.traces_pie.decks[g.buttonId][0].labels.push(U), this.traces_pie.decks[g.buttonId][0].marker.colors.push(Y)), 
                    st > g.start && st <= g.end && (this.traces_pie.decks[g.buttonId][0].values[q] += ot), 
                    st == g.end) {
                        this.traces_pie.decks[g.buttonId][0].values[q] /= g.end - g.start + 1, this.traces_pie.decks[g.buttonId][0].text.push(U);
                        var Z = this.traces_pie.decks[g.buttonId][0].values[q];
                        Z < this.fr_min && q > 8 && (this.traces_pie.decks[g.buttonId][0].values[q] = 0, 
                        this.traces_pie.decks[g.buttonId][0].values[X] += Z);
                    }
                } catch (t) {
                    K = !0, $ = t;
                } finally {
                    try {
                        !j && Q.return && Q.return();
                    } finally {
                        if (K) throw $;
                    }
                }
            }
            G /= hsRanks;
            var tt = {
                x: range(0, hsRanks),
                y: P.slice(),
                name: U,
                text: N,
                hoverinfo: "text",
                marker: {
                    color: Y
                },
                type: "bar",
                winrate: 0,
                hsClass: M[q][0] + M[q][1]
            }, et = {
                x: range(0, hsRanks),
                y: z.slice(),
                name: U,
                text: N,
                hoverinfo: "text",
                orientation: "h",
                marker: {
                    color: Y
                },
                line: {
                    width: this.lineWidth
                },
                type: "scatter",
                mode: "lines",
                winrate: 0,
                hsClass: M[q][0] + M[q][1],
                fr: G
            };
            this.traces_bar.decks.push(tt), this.traces_line.decks.push(et), this.archLegend.push({
                name: U,
                hsClass: M[q][0],
                color: Y,
                fontColor: V,
                fr: G
            }), this.archetypes.push({
                name: U,
                hsClass: M[q][0],
                fr: G,
                data: z.slice(),
                color: Y,
                fontColor: V
            });
        }
        for (q = 0; q < 9; q++) {
            for (var rt = hsClasses[q], it = [], at = [], G = 0, st = 0; st < hsRanks; st++) {
                var ot = D[st][q];
                it.push(ot), at.push(rt + " " + (100 * ot).toFixed(2) + "%"), G += ot;
                var nt = !0, lt = !1, dt = void 0;
                try {
                    for (var ht, ct = this.tiers[Symbol.iterator](); !(nt = (ht = ct.next()).done); nt = !0) st >= (g = ht.value).start && st <= g.end && (this.traces_pie.classes[g.buttonId][0].values[q] += ot), 
                    st == g.end && (this.traces_pie.classes[g.buttonId][0].values[q] /= g.end - g.start + 1);
                } catch (t) {
                    lt = !0, dt = t;
                } finally {
                    try {
                        !nt && ct.return && ct.return();
                    } finally {
                        if (lt) throw dt;
                    }
                }
            }
            var ut = fillRange(0, hsRanks, 0), yt = !0, ft = !1, vt = void 0;
            try {
                for (var mt, pt = this.archetypes[Symbol.iterator](); !(yt = (mt = pt.next()).done); yt = !0) if ((xt = mt.value).hsClass == rt) {
                    for (st = 0; st < hsRanks; st++) ut[st] += xt.data[st];
                    var bt = {
                        x: range(0, hsRanks),
                        y: xt.data,
                        name: xt.name,
                        text: xt.name,
                        hoverinfo: "text",
                        marker: {
                            color: xt.color
                        },
                        type: "bar",
                        winrate: 0,
                        hsClass: rt
                    };
                    this.traces_zoom[rt].push(bt);
                }
            } catch (t) {
                ft = !0, vt = t;
            } finally {
                try {
                    !yt && pt.return && pt.return();
                } finally {
                    if (ft) throw vt;
                }
            }
            var wt = !0, kt = !1, gt = void 0;
            try {
                for (var Ct, Tt = this.traces_zoom[rt][Symbol.iterator](); !(wt = (Ct = Tt.next()).done); wt = !0) for (var xt = Ct.value, st = 0; st < hsRanks; st++) xt.y[st] /= ut[st] > 0 ? ut[st] : 1;
            } catch (t) {
                kt = !0, gt = t;
            } finally {
                try {
                    !wt && Tt.return && Tt.return();
                } finally {
                    if (kt) throw gt;
                }
            }
            G /= hsRanks, this.c_data[rt] = it.slice();
            var Lt = {
                x: range(0, hsRanks),
                y: it.slice(),
                name: rt,
                text: at.slice(),
                hoverinfo: "text",
                marker: {
                    color: hsColors[rt]
                },
                type: "bar",
                winrate: 0,
                hsClass: rt
            }, _t = {
                x: range(0, hsRanks),
                y: it.slice(),
                name: rt,
                text: at.slice(),
                hoverinfo: "text",
                marker: {
                    color: hsColors[rt]
                },
                line: {
                    width: this.lineWidth
                },
                type: "scatter",
                mode: "lines",
                winrate: 0,
                hsClass: rt,
                fr: G
            };
            this.traces_bar.classes.push(Lt), this.traces_line.classes.push(_t), this.classLegend.push({
                name: rt,
                color: hsColors[rt]
            });
        }
        this.layout_bar = {
            barmode: "stack",
            showlegend: !1,
            displayModeBar: !1,
            hovermode: "closest",
            annotations: [],
            xaxis: {
                tickfont: {
                    family: "Arial, bold",
                    size: 15,
                    color: this.fontColor
                },
                visible: !0,
                showgrid: !1,
                tickvals: range(0, hsRanks),
                ticktext: this.rankLabels,
                ticklen: 5,
                tickcolor: "transparent",
                hoverformat: ".1%",
                range: [ 21, -1 ],
                color: this.fontColor,
                fixedrange: !0,
                zeroline: !1,
                autorange: "reversed"
            },
            yaxis: {
                title: "[ % ]  of  Meta",
                showgrid: !1,
                tickfont: {
                    family: "Arial, bold",
                    size: 16
                },
                ticklen: 5,
                tickcolor: "transparent",
                showticklabels: !1,
                fixedrange: !0,
                zeroline: !1,
                color: this.fontColorLight,
                tickformat: ",.0%",
                visible: !MOBILE
            },
            plot_bgcolor: "transparent",
            paper_bgcolor: "transparent",
            margin: MOBILE ? {
                l: 10,
                r: 10,
                b: 35,
                t: 0
            } : {
                l: 60,
                r: 30,
                b: 35,
                t: 0
            }
        }, this.layout_line = {
            showlegend: !1,
            displayModeBar: !1,
            autosize: !0,
            hovermode: "closest",
            xaxis: {
                tickfont: {
                    family: "Arial, bold",
                    size: 15,
                    color: this.fontColor
                },
                visible: !0,
                showgrid: !0,
                tickvals: range(0, hsRanks),
                ticktext: this.rankLabels,
                hoverformat: ".1%",
                range: [ 21, -1 ],
                color: this.fontColor,
                fixedrange: !0,
                zeroline: !1,
                autorange: "reversed"
            },
            yaxis: {
                tickfont: {
                    family: "Arial, bold",
                    size: 19
                },
                showgrid: !0,
                ticklen: 12,
                tickcolor: "transparent",
                tickformat: ",.0%",
                fixedrange: !0,
                color: this.fontColorLight
            },
            plot_bgcolor: "transparent",
            paper_bgcolor: this.bgColor,
            margin: MOBILE ? {
                l: 60,
                r: 10,
                b: 50,
                t: 0
            } : {
                l: 70,
                r: 20,
                b: 30,
                t: 0
            }
        }, this.layout_pie = {
            showlegend: !1,
            displayModeBar: !1,
            autosize: !0,
            textinfo: "label+percent",
            hovermode: "closest",
            plot_bgcolor: "transparent",
            paper_bgcolor: "transparent",
            margin: {
                l: 70,
                r: 20,
                b: 30,
                t: 30
            }
        };
        var St = function(t, e) {
            return t.hsClass < e.hsClass ? -1 : t.hsClass > e.hsClass ? 1 : 0;
        }, Wt = function(t, e) {
            return t.fr > e.fr ? -1 : t.fr < e.fr ? 1 : 0;
        };
        this.traces_bar.classes.sort(St), this.traces_line.classes.sort(Wt), this.traces_line.classes.splice(this.maxLines), 
        this.traces_bar.decks.sort(St), this.traces_line.decks.sort(Wt), this.traces_line.decks.splice(this.maxLines), 
        this.archLegend.sort(Wt), this.archetypes.sort(Wt);
    }
    return _createClass(t, [ {
        key: "smoothLadder",
        value: function(t, e) {
            var r = [ t[0].slice() ];
            0 == e[0] && (e[0] = 1), 0 == e[1] && (e[1] = 1);
            for (var i, a, s = 1; s < hsRanks - 1; s++) {
                0 == e[s + 1] && (e[s + 1] = 1), a = e[s - 1] / e[s], i = e[s + 1] / e[s], a > 7 && (a = 7), 
                i > 7 && (i = 7), s % 5 == 0 && (i = 0), s % 5 == 1 && (a = 0);
                for (var o = 3.5 + i + a, n = [], l = 0; l < t[s].length; l++) {
                    var d = t[s][l] / e[s], h = t[s + 1][l] / e[s + 1], c = t[s - 1][l] / e[s - 1];
                    n.push((3.5 * d + h * i + c * a) / o);
                }
                r.push(n);
            }
            r.push(t[hsRanks - 1].slice());
            for (u = 0; u < r[0].length; u++) r[0][u] /= e[0];
            for (var u = 0; u < t[hsRanks - 1].length; u++) r[hsRanks - 1][u] /= e[hsRanks - 1];
            return r;
        }
    }, {
        key: "plot",
        value: function() {
            document.getElementById("chart1").innerHTML = "";
            var t, e;
            if (this.window.hideRankFolder(), "pie" == this.window.plotType && (this.window.showRankFolder(), 
            e = this.layout_pie, t = this.traces_pie[this.window.mode][this.window.r]), "number" == this.window.plotType) return this.createTable(this.window.mode), 
            void this.window.setGraphTitle();
            if ("bar" == this.window.plotType && (e = this.layout_bar, t = this.traces_bar[this.window.mode]), 
            "zoom" == this.window.plotType) {
                var r = this.window.zoomClass ? this.window.zoomClass : "Druid";
                e = this.layout_bar, t = this.traces_zoom[r];
            }
            "line" == this.window.plotType && (e = this.layout_line, t = this.traces_line[this.window.mode]), 
            "portrait" == MOBILE && "pie" != this.window.plotTyp && (e.width = 2 * ui.width, 
            e.height = .6 * ui.height), Plotly.newPlot("chart1", t, e, {
                displayModeBar: !1
            }), this.window.setGraphTitle();
            var i = "pie" != this.window.plotType ? this.totGames : this.totGamesRanks[this.window.r];
            this.window.setTotGames(i), "decks" == this.window.mode && this.createLegend("decks"), 
            "classes" == this.window.mode && (this.createLegend("classes"), "bar" != this.window.plotType && "zoom" != this.window.plotType || document.getElementById("chart1").on("plotly_click", this.zoomToggle.bind(this)));
        }
    }, {
        key: "colorScale",
        value: function(t) {
            var e = this.window.colorScale_c1, r = this.window.colorScale_c2, i = [];
            (t /= this.window.colorScale_f) > 1 && (t = 1);
            for (var a = 0; a < 3; a++) i.push(parseInt(e[a] + (r[a] - e[a]) * t));
            return "rgb(" + i[0] + "," + i[1] + "," + i[2] + ")";
        }
    }, {
        key: "annotate",
        value: function(t) {
            var e;
            if (t) {
                for (var r = [], i = 0; i < hsRanks; i++) {
                    var a = {
                        x: i,
                        y: .5,
                        xref: "x",
                        yref: "y",
                        text: this.rankSums[i],
                        showarrow: !1,
                        bgcolor: "rgba(0,0,0,0.1)",
                        opacity: .8
                    };
                    r.push(a);
                }
                e = {
                    annotations: r
                };
            } else e = {
                annotations: []
            };
            Plotly.relayout("chart1", e);
        }
    }, {
        key: "createTable",
        value: function(t) {
            var e = 20;
            this.archetypes.length < e && (e = this.archetypes.length), document.getElementById("chart1").innerHTML = "";
            var r = document.createElement("table");
            r.style.width = "100%", r.id = "numberTable";
            var i = document.createElement("tr");
            this.download[t] = [ [] ];
            var a = document.createElement("th");
            a.className = "pivot", a.innerHTML = "Rank ->", i.appendChild(a), this.download[t] += "Rank%2C";
            for (u = hsRanks - 1; u >= 0; u--) (a = document.createElement("th")).innerHTML = u > 0 ? u : "L", 
            i.appendChild(a), this.download[t] += u > 0 ? u : "L", this.download[t] += "%2C";
            if (r.appendChild(i), this.download[t] += "%0A", "decks" == t) for (l = 0; l < e; l++) {
                var s = this.archetypes[l], o = s.name + "%2C", n = document.createElement("tr");
                (c = document.createElement("td")).className = "pivot", c.style.backgroundColor = s.color, 
                c.style.color = s.fontColor, c.innerHTML = s.name, n.appendChild(c);
                for (u = hsRanks - 1; u > -1; u--) (a = document.createElement("td")).style.backgroundColor = this.colorScale(s.data[u]), 
                a.innerHTML = s.data[u].toFixed(1) + "%", n.appendChild(a), o += s.data[u] + "%2C";
                r.appendChild(n), this.download[t] += o + "%0A";
            }
            if ("classes" == t) for (var l = 0; l < 9; l++) {
                var d = hsClasses[l], h = this.c_data[d], o = d + "%2C", n = document.createElement("tr"), c = document.createElement("td");
                c.className = "pivot", c.style.backgroundColor = hsColors[d], c.style.color = hsFontColors[d], 
                c.innerHTML = d, n.appendChild(c);
                for (var u = hsRanks - 1; u > -1; u--) (a = document.createElement("td")).style.backgroundColor = this.colorScale(h[u]), 
                a.innerHTML = (100 * h[u]).toFixed(1) + "%", n.appendChild(a), o += h[u] + "%2C";
                r.appendChild(n), this.download[t] += o + "%0A";
            }
            document.getElementById("chart1").appendChild(r), this.createNumbersFooter();
        }
    }, {
        key: "createLegend",
        value: function(t) {
            for (var e = document.querySelector("#ladderWindow .chart-footer"); e.firstChild; ) e.removeChild(e.firstChild);
            var r, i = this.archLegend;
            "classes" == t && (r = 9), "decks" == t && (r = this.maxLegendEntries) > i.length && (r = i.length);
            for (var a = 0; a < r; a++) {
                var s = document.createElement("div");
                document.createElement("div"), document.createElement("l");
                if (s.className = "legend-item", s.style.fontSize = "0.8em", "classes" == t) {
                    var o = hsClasses[a];
                    s.style = "background-color:" + hsColors[o] + "; color:" + hsFontColors[o], s.id = o, 
                    s.innerHTML = o, s.onclick = function(t) {
                        ui.deckLink(t.target.id, this.f);
                    };
                }
                if ("decks" == t) {
                    var n = i[a];
                    s.style = "background-color:" + n.color + "; color:" + hsFontColors[n.hsClass], 
                    s.id = n.name, s.innerHTML = n.name, s.onclick = function(t) {
                        ui.deckLink(t.target.id, this.f);
                    };
                }
                e.appendChild(s);
            }
        }
    }, {
        key: "createNumbersFooter",
        value: function() {
            for (var t = document.querySelector("#ladderWindow .chart-footer"); t.firstChild; ) t.removeChild(t.firstChild);
            var e = document.createElement("div"), r = document.createElement("button"), i = document.createElement("button");
            i.innerHTML = "Copy to Clipboard <div class='fa fa-clipboard'></div>", i.style = "background-color:#92fc64;color: black; padding:0.2rem;margin:0.2rem;font-size:0.8rem;text-align:center;", 
            i.className = "copyNumbers", r.innerHTML = "Download as csv <div class='fa fa-cloud-download'></div>", 
            r.style = "background-color:#57a1c1; padding:0.2rem;font-size:0.8rem;text-align:center;", 
            e.style = "font-size:2rem;", e.appendChild(r), r.addEventListener("click", this.downloadCSV.bind(this)), 
            t.appendChild(e);
        }
    }, {
        key: "downloadCSV",
        value: function() {
            var t = document.createElement("a");
            t.setAttribute("href", "data:text/plain;charset=utf-8," + this.download[this.window.mode]), 
            t.setAttribute("download", "ladder.csv"), t.style.display = "none", document.body.appendChild(t), 
            t.click(), document.body.removeChild(t);
        }
    }, {
        key: "zoomToggle",
        value: function(t) {
            if ("zoom" == this.window.plotType) return this.window.plotType = "bar", void this.plot();
            this.window.plotType = "zoom", this.window.zoomClass = t.points[0].data.hsClass, 
            this.plot();
        }
    } ]), t;
}(), LadderWindow = function() {
    function t(e, r, i) {
        _classCallCheck(this, t), this.window = document.querySelector("#ladderWindow"), 
        this.chartDiv = document.querySelector("#ladderWindow #chart1"), this.totGamesDiv = document.querySelector("#ladderWindow .content-header .nrGames"), 
        this.graphTitle = document.querySelector("#ladderWindow .graphTitle"), this.graphLabel = document.querySelector("#ladderWindow .graphLabel"), 
        this.rankFolder = document.querySelector("#ladderWindow .content-header #rankBtn"), 
        this.optionButtons = document.querySelectorAll("#ladderWindow .optionBtn"), this.questionBtn = document.querySelector("#ladderWindow .question"), 
        this.overlayDiv = document.querySelector("#ladderWindow .overlay"), this.firebasePath = PREMIUM ? "premiumData/ladderData" : "data/ladderData", 
        this.firebaseHistoryPath = PREMIUM ? "premiumData/historyData" : "", this.fontColor = "#222", 
        this.fontColorLight = "#999", this.overlay = !1, this.colorScale_c1 = [ 255, 255, 255 ], 
        this.colorScale_c2 = [ 87, 125, 186 ], this.colorScale_f = .15, this.archetypeColors = {
            Standard: {},
            Wild: {}
        }, this.data = {}, this.hsFormats = e, this.hsTimes = r, this.ranks = i, this.archColors = {};
        var a = !0, s = !1, o = void 0;
        try {
            for (var n, l = this.hsFormats[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
                k = n.value;
                this.archColors[k] = {};
                var d = !0, h = !1, c = void 0;
                try {
                    for (var u, y = hsClasses[Symbol.iterator](); !(d = (u = y.next()).done); d = !0) {
                        var f = u.value;
                        this.archColors[k][f] = {
                            count: 0
                        };
                    }
                } catch (t) {
                    h = !0, c = t;
                } finally {
                    try {
                        !d && y.return && y.return();
                    } finally {
                        if (h) throw c;
                    }
                }
            }
        } catch (t) {
            s = !0, o = t;
        } finally {
            try {
                !a && l.return && l.return();
            } finally {
                if (s) throw o;
            }
        }
        this.f = "Standard", this.t = "lastDay", this.r = "ranks_all", this.plotType = "bar", 
        this.plotTypes = [ "bar", "line", "pie", "number", "timeline" ], this.mode = "classes", 
        this.fullyLoaded = !1, this.history = null, this.zoomClass = null;
        var v = !0, m = !1, p = void 0;
        try {
            for (var b, w = this.hsFormats[Symbol.iterator](); !(v = (b = w.next()).done); v = !0) {
                var k = b.value;
                this.data[k] = {};
                var g = !0, C = !1, T = void 0;
                try {
                    for (var x, L = this.hsTimes[Symbol.iterator](); !(g = (x = L.next()).done); g = !0) {
                        var _ = x.value;
                        this.data[k][_] = null;
                    }
                } catch (t) {
                    C = !0, T = t;
                } finally {
                    try {
                        !g && L.return && L.return();
                    } finally {
                        if (C) throw T;
                    }
                }
            }
        } catch (t) {
            m = !0, p = t;
        } finally {
            try {
                !v && w.return && w.return();
            } finally {
                if (m) throw p;
            }
        }
        this.loadData(), this.setupUI(), this.renderOptions();
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var i, a = this.optionButtons[Symbol.iterator](); !(t = (i = a.next()).done); t = !0) (T = i.value).addEventListener("click", this.buttonTrigger.bind(this));
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw r;
                }
            }
            document.querySelector("#ladderWindow #formatFolder .dropdown").innerHTML = "";
            var s = !0, o = !1, n = void 0;
            try {
                for (var l, d = this.hsFormats[Symbol.iterator](); !(s = (l = d.next()).done); s = !0) {
                    var h = l.value;
                    (T = document.createElement("button")).className = "optionBtn folderBtn", T.innerHTML = h, 
                    T.id = h;
                    T.onclick = function(t) {
                        this.f = t.target.id, this.plot();
                    }.bind(this), document.querySelector("#ladderWindow #formatFolder .dropdown").appendChild(T);
                }
            } catch (t) {
                o = !0, n = t;
            } finally {
                try {
                    !s && d.return && d.return();
                } finally {
                    if (o) throw n;
                }
            }
            document.querySelector("#ladderWindow #timeFolder .dropdown").innerHTML = "";
            var c = !0, u = !1, y = void 0;
            try {
                for (var f, v = this.hsTimes[Symbol.iterator](); !(c = (f = v.next()).done); c = !0) {
                    var m = f.value;
                    (T = document.createElement("button")).className = "optionBtn folderBtn", T.innerHTML = btnIdToText[m], 
                    T.id = m;
                    T.onclick = function(t) {
                        this.t = t.target.id, this.plot();
                    }.bind(this), document.querySelector("#ladderWindow #timeFolder .dropdown").appendChild(T);
                }
            } catch (t) {
                u = !0, y = t;
            } finally {
                try {
                    !c && v.return && v.return();
                } finally {
                    if (u) throw y;
                }
            }
            document.querySelector("#ladderWindow #rankFolder .dropdown").innerHTML = "";
            var p = !0, b = !1, w = void 0;
            try {
                for (var k, g = this.ranks[Symbol.iterator](); !(p = (k = g.next()).done); p = !0) {
                    var C = k.value, T = document.createElement("button");
                    T.className = "optionBtn folderBtn", T.innerHTML = btnIdToText[C], T.id = C;
                    T.onclick = function(t) {
                        this.r = t.target.id, this.plot();
                    }.bind(this), document.querySelector("#ladderWindow #rankFolder .dropdown").appendChild(T);
                }
            } catch (t) {
                b = !0, w = t;
            } finally {
                try {
                    !p && g.return && g.return();
                } finally {
                    if (b) throw w;
                }
            }
            var x = PREMIUM ? "inline" : "none";
            this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this)), 
            document.querySelector("#ladderWindow .content-header #line").style.display = x, 
            document.querySelector("#ladderWindow .content-header #decks").style.display = x, 
            document.querySelector("#ladderWindow .content-header #classes").style.display = x, 
            document.querySelector("#ladderWindow .content-header #number").style.display = x, 
            document.querySelector("#ladderWindow .content-header #timeline").style.display = x, 
            document.querySelector("#ladderWindow .content-header .nrGames").onmouseover = this.showGames.bind(this), 
            document.querySelector("#ladderWindow .content-header .nrGames").onmouseout = this.hideGames.bind(this), 
            this.optionButtons = document.querySelectorAll("#ladderWindow .optionBtn");
        }
    }, {
        key: "showGames",
        value: function() {
            "bar" == this.plotType && this.data[this.f][this.t].annotate(!0);
        }
    }, {
        key: "hideGames",
        value: function() {
            this.data[this.f][this.t].annotate(!1);
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            "classes" == e && (this.mode = "classes"), "decks" == e && (this.mode = "decks"), 
            "bar" == e && (this.plotType = "bar"), "line" == e && (this.plotType = "line"), 
            "pie" == e && (this.plotType = "pie"), "number" == e && (this.plotType = "number"), 
            "timeline" == e && (this.plotType = "timeline"), "zoom" == this.plotType && "classes" != this.mode && (this.plotType = "bar"), 
            this.plot();
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var i, a = this.optionButtons[Symbol.iterator](); !(t = (i = a.next()).done); t = !0) {
                    var s = i.value;
                    s.classList.remove("highlighted"), s.id == this.mode && s.classList.add("highlighted"), 
                    s.id == this.plotType && s.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw r;
                }
            }
            document.querySelector("#ladderWindow #formatBtn").innerHTML = MOBILE ? btnIdToText_m[this.f] : btnIdToText[this.f], 
            document.querySelector("#ladderWindow #timeBtn").innerHTML = MOBILE ? btnIdToText_m[this.t] : btnIdToText[this.t], 
            document.querySelector("#ladderWindow #rankBtn").innerHTML = MOBILE ? btnIdToText_m[this.r] : btnIdToText[this.r];
        }
    }, {
        key: "loadData",
        value: function() {
            DATABASE.ref(this.firebasePath).on("value", this.readData.bind(this), function(t) {
                return console.log("Could not load Ladder Data", t);
            }), PREMIUM && DATABASE.ref(this.firebaseHistoryPath).on("value", this.addHistoryData.bind(this), function(t) {
                return console.log("Could not load history data", t);
            });
        }
    }, {
        key: "readData",
        value: function(t) {
            if (!this.fullyLoaded) {
                var e = t.val(), r = !0, i = !1, a = void 0;
                try {
                    for (var s, o = this.hsFormats[Symbol.iterator](); !(r = (s = o.next()).done); r = !0) {
                        var n = s.value, l = !0, d = !1, h = void 0;
                        try {
                            for (var c, u = this.hsTimes[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                                var y = c.value;
                                this.data[n][y] = new Ladder(e[n][y], n, y, this);
                            }
                        } catch (t) {
                            d = !0, h = t;
                        } finally {
                            try {
                                !l && u.return && u.return();
                            } finally {
                                if (d) throw h;
                            }
                        }
                    }
                } catch (t) {
                    i = !0, a = t;
                } finally {
                    try {
                        !r && o.return && o.return();
                    } finally {
                        if (i) throw a;
                    }
                }
                this.fullyLoaded = !0, console.log("ladder loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                finishedLoading();
            }
        }
    }, {
        key: "addHistoryData",
        value: function(t) {
            this.history = new History(t.val(), this);
        }
    }, {
        key: "plot",
        value: function() {
            this.renderOptions(), "timeline" != this.plotType ? this.data[this.f][this.t].plot() : this.history.plot();
        }
    }, {
        key: "getArchColor",
        value: function(t, e, r) {
            var i;
            if (t) i = e + " " + t; else {
                i = e;
                var a = !0, s = !1, o = void 0;
                try {
                    for (var n, l = hsClasses[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
                        var d = n.value;
                        if (-1 != i.indexOf(d)) {
                            t = d;
                            break;
                        }
                    }
                } catch (t) {
                    s = !0, o = t;
                } finally {
                    try {
                        !a && l.return && l.return();
                    } finally {
                        if (s) throw o;
                    }
                }
            }
            return i in this.archColors[r] ? {
                color: hsArchColors[t][this.archColors[r][i]],
                fontColor: hsFontColors[t]
            } : (this.archColors[r][i] = this.archColors[r][t].count, this.archColors[r][t].count += 1, 
            this.archColors[r][t].count > 4 && (this.archColors[r][t].count = 4), {
                color: hsArchColors[t][this.archColors[r][i]],
                fontColor: hsFontColors[t]
            });
        }
    }, {
        key: "setTotGames",
        value: function(t) {
            this.totGamesDiv.innerHTML = t.toLocaleString() + " games";
        }
    }, {
        key: "showRankFolder",
        value: function() {
            this.rankFolder.style.display = "flex";
        }
    }, {
        key: "hideRankFolder",
        value: function() {
            this.rankFolder.style.display = "none";
        }
    }, {
        key: "setGraphTitle",
        value: function() {
            var t = "classes" == this.mode ? "Class" : "Deck", e = -1 != [ "lastDay", "last6Hours", "last12Hours" ].indexOf(this.t) ? "Hours" : "Days", r = btnIdToText[this.r];
            switch (this.plotType) {
              case "bar":
                this.graphTitle.innerHTML = "Class Frequency vs Ranks", this.graphLabel.innerHTML = "Ranks >";
                break;

              case "line":
                this.graphTitle.innerHTML = t + " Frequency vs Ranks", this.graphLabel.innerHTML = "Ranks >";
                break;

              case "pie":
                this.graphTitle.innerHTML = t + " Frequency of " + r, this.graphLabel.innerHTML = "";
                break;

              case "number":
                console.log("number"), this.graphTitle.innerHTML = t + " Frequency vs Ranks", this.graphLabel.innerHTML = "";
                break;

              case "timeline":
                this.graphTitle.innerHTML = t + " Frequency over Time", this.graphLabel.innerHTML = "Past " + e + " >";
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayDiv.style.display = "block", 
            this.overlay = !0);
        }
    } ]), t;
}(), PowerWindow = function() {
    function t() {
        _classCallCheck(this, t), this.grid = document.querySelector("#powerGrid"), this.optionButtons = document.querySelectorAll("#powerWindow .optionBtn"), 
        this.questionBtn = document.querySelector("#powerWindow .question"), this.overlayDiv = document.querySelector("#powerWindow .overlay"), 
        this.f = "Standard", this.mode = "tiers", this.t_ladder = "lastDay", this.t_table = "last2Weeks", 
        this.top = 5, this.data = {
            Standard: [],
            Wild: []
        };
        for (e = 0; e < hsRanks; e++) this.data.Standard.push([]);
        for (var e = 0; e < hsRanks; e++) this.data.Wild.push([]);
        for (var r = 0; r < this.optionButtons.length; r++) this.optionButtons[r].addEventListener("click", this.buttonTrigger.bind(this));
        this.tierData = {}, this.tiers = [ {
            name: "All Ranks",
            start: 0,
            end: 15
        }, {
            name: "L",
            start: 0,
            end: 0
        }, {
            name: "1-5",
            start: 1,
            end: 5
        }, {
            name: "6-15",
            start: 6,
            end: 15
        } ], this.maxTierElements = PREMIUM ? 16 : 5;
        for (var i = [ "Standard", "Wild" ], a = 0; a < i.length; a++) {
            var s = i[a];
            this.tierData[s] = {};
            var o = !0, n = !1, l = void 0;
            try {
                for (var d, h = this.tiers[Symbol.iterator](); !(o = (d = h.next()).done); o = !0) {
                    var c = d.value;
                    this.tierData[s][c.name] = [];
                }
            } catch (t) {
                n = !0, l = t;
            } finally {
                try {
                    !o && h.return && h.return();
                } finally {
                    if (n) throw l;
                }
            }
        }
        this.overlay = !1, this.addData("Standard"), this.addData("Wild"), this.setupUI(), 
        this.renderOptions();
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            PREMIUM || (document.querySelector("#powerWindow .content-header #top").style.display = "none"), 
            this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this));
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            "Standard" == e && (this.f = "Standard"), "Wild" == e && (this.f = "Wild"), "top" == e && (this.mode = "top"), 
            "tiers" == e && (this.mode = "tiers"), this.plot(), this.renderOptions();
        }
    }, {
        key: "pressButton",
        value: function(t) {
            ui.deckLink(t.target.id, this.f);
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var i, a = this.optionButtons[Symbol.iterator](); !(t = (i = a.next()).done); t = !0) {
                    var s = i.value;
                    s.classList.remove("highlighted"), s.id == this.mode && s.classList.add("highlighted"), 
                    s.id == this.f && s.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw r;
                }
            }
        }
    }, {
        key: "addData",
        value: function(t) {
            var e = ladderWindow.data[t][this.t_ladder].archetypes, r = tableWindow.data[t][this.t_table].ranks_all, i = !0, a = !1, s = void 0;
            try {
                for (var o, n = e[Symbol.iterator](); !(i = (o = n.next()).done); i = !0) {
                    var l = o.value, d = r.archetypes.indexOf(l.name);
                    if (-1 != d) for (W = 0; W < hsRanks; W++) {
                        var h = 0, c = 0, u = !0, y = !1, f = void 0;
                        try {
                            for (var v, m = e[Symbol.iterator](); !(u = (v = m.next()).done); u = !0) {
                                var p = v.value, b = r.archetypes.indexOf(p.name);
                                if (-1 != b) {
                                    var w = p.data[W];
                                    h += w, c += w * r.table[d][b];
                                }
                            }
                        } catch (t) {
                            y = !0, f = t;
                        } finally {
                            try {
                                !u && m.return && m.return();
                            } finally {
                                if (y) throw f;
                            }
                        }
                        0 != h ? c /= h : c = 0, this.data[t][W].push({
                            name: l.name,
                            wr: c,
                            fr: l.data[W],
                            color: l.color,
                            fontColor: l.fontColor
                        });
                        var k = !0, g = !1, C = void 0;
                        try {
                            for (var T, x = this.tiers[Symbol.iterator](); !(k = (T = x.next()).done); k = !0) {
                                var L = T.value, _ = this.tierData[t][L.name];
                                W == L.start && _.push({
                                    name: l.name,
                                    wr: c,
                                    fr: l.data[W],
                                    color: l.color,
                                    fontColor: l.fontColor
                                }), W > L.start && W <= L.end && (_[_.length - 1].wr += c), W == L.end && (_[_.length - 1].wr /= L.end - L.start + 1);
                            }
                        } catch (t) {
                            g = !0, C = t;
                        } finally {
                            try {
                                !k && x.return && x.return();
                            } finally {
                                if (g) throw C;
                            }
                        }
                    }
                }
            } catch (t) {
                a = !0, s = t;
            } finally {
                try {
                    !i && n.return && n.return();
                } finally {
                    if (a) throw s;
                }
            }
            for (var S = function(t, e) {
                return t.wr > e.wr ? -1 : t.wr < e.wr ? 1 : 0;
            }, W = 0; W < hsRanks; W++) this.data[t][W].sort(S);
            var B = !0, M = !1, E = void 0;
            try {
                for (var I, D = this.tiers[Symbol.iterator](); !(B = (I = D.next()).done); B = !0) {
                    L = I.value;
                    this.tierData[t][L.name].sort(S);
                }
            } catch (t) {
                M = !0, E = t;
            } finally {
                try {
                    !B && D.return && D.return();
                } finally {
                    if (M) throw E;
                }
            }
        }
    }, {
        key: "plot",
        value: function() {
            "top" == this.mode && this.plotTop(this.f), "tiers" == this.mode && this.plotTiers(this.f);
        }
    }, {
        key: "plotTop",
        value: function(t) {
            for (;this.grid.firstChild; ) this.grid.removeChild(this.grid.firstChild);
            var e = range(0, hsRanks);
            e[0] = "L";
            for (var r = "1fr ", i = 0; i < this.top; i++) r += "4fr 1fr ";
            this.grid.style.gridTemplateColumns = r, this.grid.style.gridTemplateRows = "auto", 
            this.grid.style.gridGap = "0.1rem", (d = document.createElement("div")).className = "header", 
            d.innerHTML = "Rank", this.grid.appendChild(d);
            for (i = 0; i < this.top; i++) (d = document.createElement("div")).className = "header columnTitle", 
            d.innerHTML = "Top " + (i + 1), this.grid.appendChild(d);
            for (i = 0; i < hsRanks; i++) {
                (d = document.createElement("div")).className = "pivot", d.innerHTML = e[i], this.grid.appendChild(d);
                for (var a = 0; a < this.top; a++) {
                    var s = this.data[t][i][a].name, o = (100 * this.data[t][i][a].wr).toFixed(1) + "%", n = this.data[t][i][a].color, l = this.data[t][i][a].fontColor, d = document.createElement("div"), h = document.createElement("button"), c = document.createElement("span");
                    c.className = "tooltipText", c.innerHTML = "R:" + i + " #" + (a + 1) + " " + s, 
                    h.className = "archBtn tooltip", h.id = s, h.style.backgroundColor = n, h.style.color = l, 
                    h.innerHTML = s, h.onclick = this.pressButton.bind(this), d.classList.add("winrate"), 
                    d.innerHTML = o, this.grid.appendChild(h), this.grid.appendChild(d);
                }
            }
        }
    }, {
        key: "plotTiers",
        value: function(t) {
            for (;this.grid.firstChild; ) this.grid.removeChild(this.grid.firstChild);
            range(0, hsRanks)[0] = "L";
            for (var e = "", r = 0; r < this.tiers.length; r++) e += "4fr 1fr ";
            this.grid.style.gridTemplateColumns = e, this.grid.style.gridTemplateRows = "auto", 
            this.grid.style.gridGap = "0.3rem";
            var i = !0, a = !1, s = void 0;
            try {
                for (var o, n = this.tiers[Symbol.iterator](); !(i = (o = n.next()).done); i = !0) {
                    y = o.value;
                    (m = document.createElement("div")).className = "header columnTitle", m.innerHTML = y.name, 
                    this.grid.appendChild(m);
                }
            } catch (t) {
                a = !0, s = t;
            } finally {
                try {
                    !i && n.return && n.return();
                } finally {
                    if (a) throw s;
                }
            }
            for (r = 0; r < this.maxTierElements; r++) {
                var l = !0, d = !1, h = void 0;
                try {
                    for (var c, u = this.tiers[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                        var y = c.value, f = this.tierData[t][y.name][r];
                        if (void 0 != f) {
                            var v = (100 * f.wr).toFixed(1) + "%", m = document.createElement("div"), p = document.createElement("button"), b = document.createElement("span");
                            b.className = "tooltipText", b.innerHTML = "#" + (r + 1) + " " + f.name, p.className = "archBtn tooltip", 
                            p.id = f.name, p.style.backgroundColor = f.color, p.style.color = f.fontColor, p.style.marginLeft = "0.5rem", 
                            p.innerHTML = f.name, p.onclick = this.pressButton.bind(this), m.className = "winrate", 
                            m.innerHTML = v, this.grid.appendChild(p), this.grid.appendChild(m);
                        } else this.grid.appendChild(document.createElement("div")), this.grid.appendChild(document.createElement("div"));
                    }
                } catch (t) {
                    d = !0, h = t;
                } finally {
                    try {
                        !l && u.return && u.return();
                    } finally {
                        if (d) throw h;
                    }
                }
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayDiv.style.display = "block", 
            this.overlay = !0);
        }
    } ]), t;
}(), t0 = performance.now(), DATABASE, PREMIUM = !1, MOBILE = !1, powerWindow, decksWindow, tableWindow, ladderWindow, ui, hsRanks = 21, hsClasses = [ "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ], hsFormats = [ "Standard", "Wild" ], ladder_times = [ "lastDay", "last2Weeks" ], ladder_times_premium = [ "last6Hours", "last12Hours", "lastDay", "last3Days", "lastWeek", "last2Weeks" ], ladder_ranks = [ "ranks_all" ], ladder_ranks_premium = [ "ranks_all", "ranks_L_5", "ranks_6_15" ], ladder_plotTypes = [], table_times = [ "last2Weeks" ], table_times_premium = [ "lastDay", "last3Days", "lastWeek", "last2Weeks" ], table_sortOptions = [ "frequency" ], table_sortOptions_premium = [ "frequency", "class", "winrate", "matchup" ], table_ranks = [ "ranks_all" ], table_ranks_premium = [ "ranks_all", "ranks_L_5", "ranks_6_15" ];

window.onload = function() {
    window.innerWidth <= 756 && (MOBILE = !0, console.log("mobile")), (ui = new UI()).showLoader(), 
    setupFirebase();
};

var colorscale_Table = [ [ 0, "#a04608" ], [ .3, "#d65900" ], [ .5, "#FFFFFF" ], [ .7, "#00a2bc" ], [ 1, "#055c7a" ] ], hsColors = {
    Druid: "#674f3a",
    Hunter: "#719038",
    Mage: "#90bbc3",
    Paladin: "#ffd96d",
    Priest: "#cfcbb3",
    Rogue: "#172917",
    Shaman: "#1a5d72",
    Warlock: "#ad5c7b",
    Warrior: "#dc7852"
}, hsArchColors = {
    Druid: [ "#674f3a", "#624737", "#675645", "#785c43", "#523f2e" ],
    Hunter: [ "#719038", "#597525", "#6d8347", "#8da238", "#4f6d1a" ],
    Mage: [ "#90bbc3", "#75a3a5", "#a4c6c4", "#89aaba", "#638a8b" ],
    Paladin: [ "#ffd96d", "#e9bf64", "#ffe6a0", "#f1f976", "#ffc770" ],
    Priest: [ "#cfcbb3", "#bbb7a1", "#d5cec1", "#c3c2a4", "#aca995" ],
    Rogue: [ "#172917", "#304030", "#24352d", "#33453f", "#0c0c0c" ],
    Shaman: [ "#1a5d72", "#154a5a", "#326a8c", "#245368", "#05475d" ],
    Warlock: [ "#ad5c7b", "#904c66", "#ba7690", "#a85494", "#923d6d" ],
    Warrior: [ "#dc7852", "#c25a48", "#e0563b", "#cc4941", "#bc3b29" ]
}, hsFontColors = {
    Druid: "#fff",
    Hunter: "#fff",
    Mage: "#fff",
    Paladin: "#222",
    Priest: "#222",
    Rogue: "#fff",
    Shaman: "#fff",
    Warlock: "#fff",
    Warrior: "#fff",
    Other: "#88042d",
    "": "#88042d",
    "§": "#88042d"
}, btnIdToText = {
    Standard: "Standard",
    Wild: "Wild",
    ranks_all: "All Ranks",
    ranks_L: "Legend Ranks",
    ranks_1_5: "Ranks 1-5",
    ranks_L_5: "Ranks L-5",
    ranks_6_15: "Ranks 6-15",
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
    decks: "Archetypes"
}, btnIdToText_m = {
    Standard: "Std",
    Wild: "Wild",
    ranks_all: "R: All",
    ranks_L: "R: L",
    ranks_1_5: "R: 1-5",
    ranks_L_5: "R: L-5",
    ranks_6_15: "R: 6-15",
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
    decks: "Archetypes"
}, rankRange = {
    ranks_all: [ 0, 20 ],
    ranks_L: [ 0, 0 ],
    ranks_1_5: [ 1, 5 ],
    ranks_L_5: [ 0, 5 ],
    ranks_6_15: [ 6, 15 ]
}, Table = function() {
    function t(e, r, i, a, s) {
        _classCallCheck(this, t), this.DATA = e, this.f = r, this.t = i, this.r = a, this.window = s, 
        this.sortBy = "", this.numArch = 16, this.bgColor = "transparent", this.fontColor = "#22222", 
        this.subplotRatio = .6, this.table = [], this.textTable = [], this.frequency = [], 
        this.archetypes = [], this.classPlusArch = [], this.winrates = [], this.totGames = 0, 
        this.download = "";
        var o = e.frequency.slice(), n = e.table.slice(), l = e.archetypes.slice();
        this.numArch > l.length && (this.numArch = l.length);
        var d = range(0, o.length);
        d.sort(function(t, e) {
            return o[t] > o[e] ? -1 : o[t] < o[e] ? 1 : 0;
        }), d.splice(this.numArch);
        for (C = 0; C < this.numArch; C++) this.table.push(fillRange(0, this.numArch, 0)), 
        this.textTable.push(fillRange(0, this.numArch, ""));
        for (C = 0; C < this.numArch; C++) {
            var h = d[C];
            this.frequency.push(o[h]), this.archetypes.push(l[h][1] + " " + l[h][0]), this.classPlusArch.push(l[h][0] + l[h][1]);
            for (x = C; x < this.numArch; x++) {
                var c = d[x], u = 0, y = 0, f = n[h][c][0], v = n[h][c][1];
                f + v > 0 && (u = f / (f + v));
                var m = n[c][h][1], p = n[c][h][0];
                m + p > 0 && (y = m / (m + p)), C == x && (u = .5, y = .5);
                T = 0;
                T = u > 0 && y > 0 ? (u + y) / 2 : 0 == u ? y : u;
                var b = f + m + v + p, w = l[h][1] + " " + l[h][0], k = l[c][1] + " " + l[c][0];
                this.table[C][x] = T, this.table[x][C] = 1 - T, this.totGames += b, this.textTable[C][x] = w + "<br><b>vs:</b> " + k + "<br><b>wr:</b>  " + (100 * T).toFixed(0) + "%  (" + b + ")", 
                this.textTable[x][C] = k + "<br><b>vs:</b> " + w + "<br><b>wr:</b>  " + (100 * (1 - T)).toFixed(0) + "%  (" + b + ")";
            }
        }
        for (var g = 0, C = 0; C < this.numArch; C++) g += this.frequency[C];
        0 == g && (g = 1, console.log("freqSum = 0"));
        for (C = 0; C < this.numArch; C++) {
            for (var T = 0, x = 0; x < this.numArch; x++) T += this.table[C][x] * this.frequency[x];
            this.winrates.push(T / g);
        }
        this.layout = {
            showlegend: !1,
            xaxis: {
                side: "top",
                showgrid: !1,
                tickcolor: this.fontColor,
                tickangle: 45,
                color: this.fontColor,
                gridcolor: this.fontColor,
                fixedrange: !0
            },
            yaxis: {
                autorange: "reversed",
                tickcolor: this.fontColor,
                color: this.fontColor,
                gridcolor: this.fontColor,
                fixedrange: !0
            },
            plot_bgcolor: "transparent",
            paper_bgcolor: this.bgColor,
            margin: {
                l: 120,
                r: 0,
                b: 30,
                t: 100
            },
            width: MOBILE ? 2 * ui.width : this.window.width,
            height: MOBILE ? .8 * ui.height : this.window.height,
            yaxis2: {
                visible: !1,
                showticklabels: !1,
                fixedrange: !0,
                domain: [ 0, .01 ],
                anchor: "x"
            }
        }, this.getFreqPlotData();
    }
    return _createClass(t, [ {
        key: "getFreqPlotData",
        value: function(t, e) {
            for (var t = this.frequency.slice(), r = 0, i = [], a = 0; a < t.length; a++) r += t[a];
            for (a = 0; a < t.length; a++) t[a] = t[a] / r, i.push("FR: " + (100 * t[a]).toFixed(1) + "%");
            this.freqPlotData = {
                x: [ this.archetypes ],
                y: [ t ],
                text: [ i ],
                visible: !0,
                hoverinfo: "text",
                marker: {
                    color: "#a3a168"
                }
            };
        }
    }, {
        key: "plot",
        value: function() {
            "" != this.sortBy && this.sortBy == this.window.sortBy || this.sortTableBy(this.window.sortBy, !1);
            for (var t = this.winrates, e = this.table.concat([ t ]), r = this.archetypes.concat([ "Overall" ]), i = [], a = 0; a < e[0].length; a++) i.push(this.archetypes[a] + "<br>Overall wr: " + (100 * t[a]).toFixed(1) + "%");
            var s = this.textTable.concat([ i ]), o = [ {
                type: "heatmap",
                z: e,
                x: this.archetypes,
                y: r,
                text: s,
                hoverinfo: "text",
                colorscale: colorscale_Table,
                showscale: !1
            }, {
                visible: !1,
                x: this.archetypes,
                y: range(0, this.numArch),
                xaxis: "x",
                yaxis: "y2",
                type: "line",
                hoverinfo: "x+y"
            }, {
                visible: !1,
                x: this.archetypes,
                y: range(0, this.numArch),
                xaxis: "x",
                yaxis: "y2",
                type: "line",
                hoverinfo: "x+y"
            } ];
            Plotly.newPlot("chart2", o, this.layout, {
                displayModeBar: !1
            }), document.getElementById("chart2").on("plotly_click", this.zoomToggle.bind(this)), 
            this.window.zoomIn && this.zoomIn(this.window.zoomArch), document.getElementById("loader").style.display = "none", 
            document.querySelector("#tableWindow .nrGames").innerHTML = this.totGames.toLocaleString() + " games";
        }
    }, {
        key: "subPlotFR",
        value: function() {
            Plotly.restyle("chart2", this.freqPlotData, 1);
        }
    }, {
        key: "subPlotWR",
        value: function(t) {
            var e;
            if (e = -1 == t || t >= this.numArch ? this.winrates.slice() : this.table[t].slice(), 
            !(t > this.numArch)) {
                for (var r = [], i = 0; i < e.length; i++) r.push("WR: " + (100 * e[i]).toFixed(1) + "%"), 
                e[i] -= .5;
                var a = {
                    type: "bar",
                    x: [ this.archetypes ],
                    y: [ e ],
                    text: [ r ],
                    visible: !0,
                    hoverinfo: "text",
                    marker: {
                        color: "#222"
                    }
                };
                Plotly.restyle("chart2", a, 2);
            }
        }
    }, {
        key: "zoomToggle",
        value: function(t) {
            var e = t.points[0].y;
            0 == this.window.zoomIn ? this.zoomIn(e) : this.zoomOut();
        }
    }, {
        key: "zoomIn",
        value: function(t) {
            var e = this.archetypes.indexOf(t);
            if ("Overall" == t && (e = this.numArch), -1 != e) {
                var r = {
                    yaxis: {
                        range: [ e - .5, e + .5 ],
                        fixedrange: !0,
                        color: this.fontColor,
                        tickcolor: this.fontColor
                    },
                    yaxis2: {
                        domain: [ 0, this.subplotRatio ],
                        visible: !1,
                        fixedrange: !0
                    }
                };
                Plotly.relayout("chart2", r), this.subPlotFR(), this.subPlotWR(e);
                var i = document.querySelector("#tableWindow #matchup");
                document.querySelector("#tableWindow #winrate");
                i.style.display = "inline-block", "Overall" == t && (i.style.display = "none"), 
                this.window.zoomIn = !0, this.window.zoomArch = t;
            } else this.zoomOut();
        }
    }, {
        key: "zoomOut",
        value: function() {
            var t = {
                yaxis: {
                    range: [ this.numArch + .5, -.5 ],
                    color: this.fontColor,
                    tickcolor: this.fontColor,
                    fixedrange: !0
                },
                yaxis2: {
                    domain: [ 0, .01 ],
                    visible: !1,
                    fixedrange: !0
                }
            };
            Plotly.relayout("chart2", t), Plotly.restyle("chart2", {
                visible: !1
            }, [ 1, 2 ]);
            var e = document.querySelector("#tableWindow #matchup"), r = document.querySelector("#tableWindow #winrate");
            e.style.display = "none", r.style.display = "inline-block", this.window.zoomIn = !1;
        }
    }, {
        key: "sortTableBy",
        value: function(t) {
            var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], r = this;
            if (this.sortBy != t || this.window.zoomIn) {
                var i = range(0, this.numArch), a = this.archetypes.indexOf(this.window.zoomArch);
                "winrate" == t && i.sort(function(t, e) {
                    return r.winrates[t] > r.winrates[e] ? -1 : r.winrates[t] < r.winrates[e] ? 1 : 0;
                }), "matchup" == t && i.sort(function(t, e) {
                    return r.table[a][t] > r.table[a][e] ? -1 : r.table[a][t] < r.table[a][e] ? 1 : 0;
                }), "frequency" == t && i.sort(function(t, e) {
                    return r.frequency[t] > r.frequency[e] ? -1 : r.frequency[t] < r.frequency[e] ? 1 : 0;
                }), "class" == t && i.sort(function(t, e) {
                    return r.classPlusArch[t] < r.classPlusArch[e] ? -1 : r.classPlusArch[t] > r.classPlusArch[e] ? 1 : 0;
                });
                for (var s = [], o = [], n = [], l = [], d = [], h = [], c = 0; c < r.numArch; c++) {
                    var u = i[c];
                    h.push(r.classPlusArch[u]), n.push(r.archetypes[u]), l.push(r.frequency[u]), d.push(r.winrates[u]);
                    for (var y = [], f = [], v = 0; v < r.numArch; v++) y.push(r.table[u][i[v]]), f.push(r.textTable[u][i[v]]);
                    s.push(y), o.push(f);
                }
                this.table = s, this.textTable = o, this.archetypes = n, this.classPlusArch = h, 
                this.frequency = l, this.winrates = d, this.sortBy = t, this.window.sortBy = t, 
                this.getFreqPlotData(), this.window.renderOptions(), e && this.plot();
            } else console.log("already sorted by " + t);
        }
    }, {
        key: "downloadCSV",
        value: function() {
            this.download = " %2C";
            for (t = 0; t < this.numArch; t++) this.download += this.archetypes[t] + "%2C";
            this.download += "%0A";
            for (var t = 0; t < this.numArch; t++) {
                this.download += this.archetypes[t] + "%2C";
                for (var e = 0; e < this.numArch; e++) this.download += this.table[t][e] + "%2C";
                this.download += "%0A";
            }
            var r = document.createElement("a");
            r.setAttribute("href", "data:text/plain;charset=utf-8," + this.download), r.setAttribute("download", "matchupTable.csv"), 
            r.style.display = "none", document.body.appendChild(r), r.click(), document.body.removeChild(r);
        }
    } ]), t;
}(), TableWindow = function() {
    function t(e, r, i, a) {
        _classCallCheck(this, t), this.firebasePath = PREMIUM ? "premiumData/tableData" : "data/tableData", 
        this.window = document.querySelector("#ladderWindow"), this.optionButtons = document.querySelectorAll("#tableWindow .optionBtn"), 
        this.questionBtn = document.querySelector("#tableWindow .question"), this.overlayDiv = document.querySelector("#tableWindow .overlay"), 
        this.data = {}, this.hsFormats = e, this.hsTimes = r, this.ranks = i, this.sortOptions = a, 
        this.width = document.querySelector(".main-wrapper").offsetWidth - 40, this.height = .95 * document.querySelector("#ladderWindow .content").offsetHeight, 
        this.f = this.hsFormats[0], this.t = "lastWeek", this.r = this.ranks[0], this.sortBy = this.sortOptions[0], 
        this.zoomIn = !1, this.zoomArch = null, this.fullyLoaded = !1, this.overlay = !1, 
        this.minGames = 1e3;
        var s = !0, o = !1, n = void 0;
        try {
            for (var l, d = this.hsFormats[Symbol.iterator](); !(s = (l = d.next()).done); s = !0) {
                var h = l.value;
                this.data[h] = {};
                var c = !0, u = !1, y = void 0;
                try {
                    for (var f, v = this.hsTimes[Symbol.iterator](); !(c = (f = v.next()).done); c = !0) {
                        var m = f.value;
                        this.data[h][m] = {};
                        var p = !0, b = !1, w = void 0;
                        try {
                            for (var k, g = this.ranks[Symbol.iterator](); !(p = (k = g.next()).done); p = !0) {
                                var C = k.value;
                                this.data[h][m][C] = null;
                            }
                        } catch (t) {
                            b = !0, w = t;
                        } finally {
                            try {
                                !p && g.return && g.return();
                            } finally {
                                if (b) throw w;
                            }
                        }
                    }
                } catch (t) {
                    u = !0, y = t;
                } finally {
                    try {
                        !c && v.return && v.return();
                    } finally {
                        if (u) throw y;
                    }
                }
            }
        } catch (t) {
            o = !0, n = t;
        } finally {
            try {
                !s && d.return && d.return();
            } finally {
                if (o) throw n;
            }
        }
        this.loadData(), this.setupUI();
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            document.querySelector("#tableWindow .content-header #formatFolder .dropdown").innerHTML = "";
            var t = !0, e = !1, r = void 0;
            try {
                for (var i, a = this.hsFormats[Symbol.iterator](); !(t = (i = a.next()).done); t = !0) {
                    var s = i.value;
                    (x = document.createElement("button")).innerHTML = btnIdToText[s], x.id = s, x.className = "folderBtn optionBtn";
                    L = function(t) {
                        this.f = t.target.id, this.plot(), this.renderOptions();
                    };
                    x.onclick = L.bind(this), document.querySelector("#tableWindow .content-header #formatFolder .dropdown").appendChild(x);
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw r;
                }
            }
            document.querySelector("#tableWindow .content-header #timeFolder .dropdown").innerHTML = "";
            var o = !0, n = !1, l = void 0;
            try {
                for (var d, h = this.hsTimes[Symbol.iterator](); !(o = (d = h.next()).done); o = !0) {
                    var c = d.value;
                    (x = document.createElement("button")).innerHTML = btnIdToText[c], x.id = c, x.className = "folderBtn optionBtn";
                    L = function(t) {
                        this.t = t.target.id, this.plot(), this.renderOptions();
                    };
                    x.onclick = L.bind(this), document.querySelector("#tableWindow .content-header #timeFolder .dropdown").appendChild(x);
                }
            } catch (t) {
                n = !0, l = t;
            } finally {
                try {
                    !o && h.return && h.return();
                } finally {
                    if (n) throw l;
                }
            }
            document.querySelector("#tableWindow .content-header #rankFolder .dropdown").innerHTML = "";
            var u = !0, y = !1, f = void 0;
            try {
                for (var v, m = this.ranks[Symbol.iterator](); !(u = (v = m.next()).done); u = !0) {
                    var p = v.value;
                    (x = document.createElement("button")).innerHTML = btnIdToText[p], x.id = p, x.className = "folderBtn optionBtn";
                    L = function(t) {
                        this.r = t.target.id, this.plot(), this.renderOptions();
                    };
                    x.onclick = L.bind(this), document.querySelector("#tableWindow .content-header #rankFolder .dropdown").appendChild(x);
                }
            } catch (t) {
                y = !0, f = t;
            } finally {
                try {
                    !u && m.return && m.return();
                } finally {
                    if (y) throw f;
                }
            }
            document.querySelector("#tableWindow .content-header #sortFolder .dropdown").innerHTML = "";
            var b = !0, w = !1, k = void 0;
            try {
                for (var g, C = this.sortOptions[Symbol.iterator](); !(b = (g = C.next()).done); b = !0) {
                    var T = g.value, x = document.createElement("button");
                    x.innerHTML = btnIdToText[T], x.id = T, x.className = "folderBtn optionBtn";
                    var L = function(t) {
                        this.sortBy = t.target.id, this.data[this.f][this.t][this.r].sortTableBy(this.sortBy), 
                        this.renderOptions();
                    };
                    x.onclick = L.bind(this), document.querySelector("#tableWindow .content-header #sortFolder .dropdown").appendChild(x);
                }
            } catch (t) {
                w = !0, k = t;
            } finally {
                try {
                    !b && C.return && C.return();
                } finally {
                    if (w) throw k;
                }
            }
            document.querySelector("#tableWindow .downloadTable").addEventListener("click", function() {
                this.data[this.f][this.t][this.r].downloadCSV();
            }.bind(this)), this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), 
            this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this));
        }
    }, {
        key: "plot",
        value: function() {
            this.data[this.f][this.t][this.r].plot();
        }
    }, {
        key: "renderOptions",
        value: function() {
            document.querySelector("#tableWindow #formatBtn").innerHTML = MOBILE ? btnIdToText_m[this.f] : btnIdToText[this.f], 
            document.querySelector("#tableWindow #timeBtn").innerHTML = MOBILE ? btnIdToText_m[this.t] : btnIdToText[this.t], 
            document.querySelector("#tableWindow #ranksBtn").innerHTML = MOBILE ? btnIdToText_m[this.r] : btnIdToText[this.r], 
            document.querySelector("#tableWindow #sortBtn").innerHTML = MOBILE ? btnIdToText_m[this.sortBy] : btnIdToText[this.sortBy];
            var t = !0, e = !1, r = void 0;
            try {
                for (var i, a = this.hsTimes[Symbol.iterator](); !(t = (i = a.next()).done); t = !0) {
                    var s = i.value;
                    this.data[this.f][s].ranks_all.totGames < this.minGames && (document.querySelector("#tableWindow .content-header #timeFolder #" + s).style.display = "none");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw r;
                }
            }
        }
    }, {
        key: "loadData",
        value: function() {
            DATABASE.ref(this.firebasePath).on("value", this.readData.bind(this), function(t) {
                return console.log("Could not load Table Data", t);
            });
        }
    }, {
        key: "readData",
        value: function(t) {
            if (!this.fullyLoaded) {
                var e = t.val(), r = !0, i = !1, a = void 0;
                try {
                    for (var s, o = this.hsFormats[Symbol.iterator](); !(r = (s = o.next()).done); r = !0) {
                        var n = s.value, l = !0, d = !1, h = void 0;
                        try {
                            for (var c, u = this.hsTimes[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                                var y = c.value, f = !0, v = !1, m = void 0;
                                try {
                                    for (var p, b = this.ranks[Symbol.iterator](); !(f = (p = b.next()).done); f = !0) {
                                        var w = p.value;
                                        this.data[n][y][w] = new Table(e[n][y][w], n, y, w, this);
                                    }
                                } catch (t) {
                                    v = !0, m = t;
                                } finally {
                                    try {
                                        !f && b.return && b.return();
                                    } finally {
                                        if (v) throw m;
                                    }
                                }
                            }
                        } catch (t) {
                            d = !0, h = t;
                        } finally {
                            try {
                                !l && u.return && u.return();
                            } finally {
                                if (d) throw h;
                            }
                        }
                    }
                } catch (t) {
                    i = !0, a = t;
                } finally {
                    try {
                        !r && o.return && o.return();
                    } finally {
                        if (i) throw a;
                    }
                }
                this.fullyLoaded = !0, console.log("table loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                this.renderOptions(), finishedLoading();
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayDiv.style.display = "block", 
            this.overlay = !0);
        }
    } ]), t;
}(), UI = function() {
    function t() {
        _classCallCheck(this, t), this.tabs = document.querySelectorAll("button.tab"), this.mobileBtns = document.querySelectorAll("button.mobileBtn"), 
        this.windows = document.querySelectorAll(".tabWindow"), this.folderButtons = document.querySelectorAll(".folder-toggle"), 
        this.loader = document.getElementById("loader"), this.logo = document.querySelector("#vsLogoDiv .logo"), 
        this.overlayText = document.querySelector("#overlay .overlayText"), this.getWindowSize(), 
        this.tabIdx = 0, this.activeTab = this.tabs[0], this.activeWindow = document.querySelector("#ladderWindow"), 
        this.openFolder = null, this.overlay = !1, this.loggedIn = !1;
        var e = !0, r = !1, i = void 0;
        try {
            for (var a, s = this.tabs[Symbol.iterator](); !(e = (a = s.next()).done); e = !0) a.value.addEventListener("click", this.toggleTabs.bind(this));
        } catch (t) {
            r = !0, i = t;
        } finally {
            try {
                !e && s.return && s.return();
            } finally {
                if (r) throw i;
            }
        }
        var o = !0, n = !1, l = void 0;
        try {
            for (var d, h = this.folderButtons[Symbol.iterator](); !(o = (d = h.next()).done); o = !0) d.value.addEventListener("click", this.toggleDropDown.bind(this));
        } catch (t) {
            n = !0, l = t;
        } finally {
            try {
                !o && h.return && h.return();
            } finally {
                if (n) throw l;
            }
        }
        if (MOBILE) {
            var c = !0, u = !1, y = void 0;
            try {
                for (var f, v = this.mobileBtns[Symbol.iterator](); !(c = (f = v.next()).done); c = !0) f.value.addEventListener("click", this.mobileMenu.bind(this));
            } catch (t) {
                u = !0, y = t;
            } finally {
                try {
                    !c && v.return && v.return();
                } finally {
                    if (u) throw y;
                }
            }
            detectswipe(".navbar", this.swipeTab.bind(this)), document.querySelector("#ladderWindow .content-header .nrGames").style.display = "none", 
            this.hideLoader();
        }
        this.logo.addEventListener("click", this.toggleOverlay.bind(this)), document.querySelector("#overlay").addEventListener("click", this.toggleOverlay.bind(this)), 
        window.addEventListener("orientationchange", this.getWindowSize.bind(this)), window.addEventListener("resize", this.getWindowSize.bind(this)), 
        this.renderTabs(), this.renderWindows(), this.toggleOverlay();
    }
    return _createClass(t, [ {
        key: "getWindowSize",
        value: function() {
            this.width = parseInt(Math.max(document.documentElement.clientWidth, window.innerWidth || 0)), 
            this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0), 
            MOBILE && (MOBILE = this.height / this.width >= 1 ? "portrait" : "landscape");
        }
    }, {
        key: "swipeTab",
        value: function(t, e) {
            "r" == e && (this.tabIdx -= 1, this.tabIdx < 0 && (this.tabIdx = this.tabs.length - 1)), 
            "l" == e && (this.tabIdx += 1, this.tabIdx >= this.tabs.length && (this.tabIdx = 0)), 
            this.activeTab = this.tabs[this.tabIdx], this.activeWindow = document.getElementById(this.activeTab.id + "Window"), 
            this.renderTabs(), this.renderWindows();
        }
    }, {
        key: "toggleDropDown",
        value: function(t) {
            var e = t.target.parentElement.childNodes[3];
            e == this.openFolder ? this.openFolder = null : null != this.openFolder && (this.openFolder.classList.toggle("hidden"), 
            this.openFolder = e), e.classList.toggle("hidden");
        }
    }, {
        key: "mobileMenu",
        value: function(t) {
            console.log("mobile menu");
            var e = t.target, r = !0, i = !1, a = void 0;
            try {
                for (var s, o = this.tabs[Symbol.iterator](); !(r = (s = o.next()).done); r = !0) {
                    var n = s.value;
                    n.id == e.id && (this.activeTab = n, this.activeWindow = document.getElementById(n.id + "Window"), 
                    this.renderTabs(), this.renderWindows());
                }
            } catch (t) {
                i = !0, a = t;
            } finally {
                try {
                    !r && o.return && o.return();
                } finally {
                    if (i) throw a;
                }
            }
        }
    }, {
        key: "toggleTabs",
        value: function(t) {
            this.activeTab = t.target, this.activeWindow = document.getElementById(t.target.id + "Window"), 
            this.renderTabs(), this.renderWindows();
        }
    }, {
        key: "deckLink",
        value: function(t, e) {
            this.activeTab = document.querySelector(".navbar #decks.tab"), this.activeWindow = document.getElementById("decksWindow"), 
            this.renderTabs(), this.renderWindows(), decksWindow.deckLink(t, e);
        }
    }, {
        key: "renderTabs",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var i, a = this.tabs[Symbol.iterator](); !(t = (i = a.next()).done); t = !0) {
                    var s = i.value;
                    s != this.activeTab ? s.classList.remove("highlighted") : s.classList.add("highlighted"), 
                    MOBILE && s.classList.contains("highlighted") && (s.style.display = "inline"), MOBILE && !s.classList.contains("highlighted") && (s.style.display = "none");
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw r;
                }
            }
        }
    }, {
        key: "renderWindows",
        value: function() {
            var t = !0, e = !1, r = void 0;
            try {
                for (var i, a = this.windows[Symbol.iterator](); !(t = (i = a.next()).done); t = !0) {
                    var s = i.value;
                    s != this.activeWindow ? s.style.display = "none" : s.style.display = "inline-block";
                }
            } catch (t) {
                e = !0, r = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw r;
                }
            }
        }
    }, {
        key: "showLoader",
        value: function() {
            this.loader.style.display = "block";
        }
    }, {
        key: "hideLoader",
        value: function() {
            this.loader.style.display = "none";
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlayText.innerHTML = overlayText1, this.overlay ? (document.getElementById("overlay").style.display = "none", 
            this.overlay = !1) : (document.getElementById("overlay").style.display = "block", 
            this.overlay = !0);
        }
    } ]), t;
}(), overlayText1 = '\n\n<span style=\'font-size:180%;padding-left:2rem\'>Greetings Travelers,</span><br><br><br>\n\nWelcome to the VS Live web app where you can explore the newest Hearthstone data and find \n\nout about frequncey and winrates of your favorite decks.<br><br>\n\nTo get more information on the current tab simply click on the \n\n    <div class=\'fa fa-question-circle\' style=\'display:inline-block\'></div>\n\nicon in the top right corner.<br><br>\n\nThis app is currently in BETA. To give feedback simply click on the reddit link below:<br><br><br>\n\n<a href="https://www.reddit.com/r/ViciousSyndicate/comments/6yqj62/vs_live_web_app_feedback_thread/"\n   target="_blank"><img src="Images/redditLogo.png" \n   style="position:absolute; left: 35%; display: inline-block"></a><br><br>\n\n\n';