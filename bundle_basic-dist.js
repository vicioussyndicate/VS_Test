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
    firebase.apps.length || (firebase.initializeApp(t), DATABASE = firebase.database()), 
    firebase.auth().signInWithEmailAndPassword(login.email, login.pw).then(function(t) {
        ui.loggedIn || (t ? (ui.loggedIn = !0, DATABASE.ref("premiumUsers/" + t.uid).on("value", function(t) {
            !t.val() && PREMIUM && console.log("PERMISSION ERROR", t.val()), loadFireData();
        }, function(t) {
            return console.log("Could not load User Data", t);
        }), console.log("user login " + (performance.now() - t0).toFixed(2) + " ms, Premium:", PREMIUM)) : (console.log("not logged in"), 
        ui.loggedIn = !0, loadFireData()));
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
    PREMIUM ? (console.log("load Premium"), ladderWindow = new LadderWindow(hsFormats, ladder_times_premium, ladder_ranks_premium), 
    tableWindow = new TableWindow(hsFormats, table_times_premium, table_ranks_premium, table_sortOptions_premium)) : (console.log("load basic"), 
    ladderWindow = new LadderWindow(hsFormats, ladder_times, ladder_ranks), tableWindow = new TableWindow(hsFormats, table_times, table_ranks, table_sortOptions));
}

function reloadApp() {
    ui.showLoader(), ui.loggedIn = !1, setupFirebase();
}

function reloadPremium() {}

function reloadBasic() {
    PREMIUM && (ui.showLoader(), ui.loggedIn = !1, setupFirebase());
}

function finishedLoading() {
    tableWindow.fullyLoaded && ladderWindow.fullyLoaded && (powerWindow = new PowerWindow(), 
    decksWindow = new DecksWindow(hsFormats), powerWindow.plot(), tableWindow.plot(), 
    ladderWindow.plot(), ui.fullyLoaded = !0, ui.hideLoader(), console.log("App initializing took " + (performance.now() - t0) + " ms."));
}

function choice(t) {
    return t[Math.floor(Math.random() * t.length)];
}

function randint(t, e) {
    return t = Math.ceil(t), e = Math.floor(e), Math.floor(Math.random() * (e - t)) + t;
}

function range(t, e) {
    for (var i = [], r = t; r < e; r++) i.push(r);
    return i;
}

function fillRange(t, e, i) {
    for (var r = [], a = t; a < e; a++) r.push(i);
    return r;
}

function shuffle(t) {
    for (var e, i, r = t.length; 0 !== r; ) i = Math.floor(Math.random() * r), e = t[r -= 1], 
    t[r] = t[i], t[i] = e;
    return t;
}

function detectswipe(t, e) {
    var i = {};
    i.sX = 0, i.sY = 0, i.eX = 0, i.eY = 0;
    var r = "", a = document.querySelector(t);
    a.addEventListener("touchstart", function(t) {
        var e = t.touches[0];
        i.sX = e.screenX, i.sY = e.screenY;
    }, !1), a.addEventListener("touchmove", function(t) {
        t.preventDefault();
        var e = t.touches[0];
        i.eX = e.screenX, i.eY = e.screenY;
    }, !1), a.addEventListener("touchend", function(a) {
        (i.eX - 30 > i.sX || i.eX + 30 < i.sX) && i.eY < i.sY + 60 && i.sY > i.eY - 60 && i.eX > 0 ? r = i.eX > i.sX ? "r" : "l" : (i.eY - 50 > i.sY || i.eY + 50 < i.sY) && i.eX < i.sX + 30 && i.sX > i.eX - 30 && i.eY > 0 && (r = i.eY > i.sY ? "d" : "u"), 
        "" != r && "function" == typeof e && e(t, r), r = "", i.sX = 0, i.sY = 0, i.eX = 0, 
        i.eY = 0;
    }, !1);
}

function myfunction(t, e) {
    alert("you swiped on element with id '" + t + "' to " + e + " direction");
}

var _createClass = function() {
    function t(t, e) {
        for (var i = 0; i < e.length; i++) {
            var r = e[i];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
            Object.defineProperty(t, r.key, r);
        }
    }
    return function(e, i, r) {
        return i && t(e.prototype, i), r && t(e, r), e;
    };
}(), PREMIUM = !1, login = {
    email: "freeUser@vs.com",
    pw: "eva8r_PM2#H-F?B&"
}, Decklist = function() {
    function t(e, i, r) {
        _classCallCheck(this, t), this.name = e.name, this.hsClass = i, this.window = r, 
        this.cards = [], this.cardNames = [], this.dust = 0, this.manaBin = fillRange(0, 11, 0), 
        this.showInfo = !1, this.div = document.createElement("div"), this.div.className = "deckBox", 
        this.div.id = e.name, this.deckTitle = document.createElement("div"), this.deckTitle.className = "deckTitle", 
        this.deckTitle.innerHTML = "<p>" + e.name + "</p>", this.deckTitle.style.backgroundColor = hsColors[this.hsClass], 
        this.deckTitle.style.color = hsFontColors[this.hsClass];
        var a = document.createElement("div");
        a.className = "titleHover", this.infoBtn = document.createElement("div"), this.infoBtn.className = "titleHover-content", 
        this.infoBtn.innerHTML = "info", this.infoBtn.style.float = "right", this.infoBtn.addEventListener("click", this.toggleInfo.bind(this)), 
        this.copyBtn = document.createElement("div"), this.copyBtn.className = "titleHover-content", 
        this.copyBtn.innerHTML = "copy", this.copyBtn.style.float = "left", this.copyBtn.id = "dl" + randint(0, 1e9), 
        a.appendChild(this.copyBtn), a.appendChild(this.infoBtn), this.deckTitle.appendChild(a), 
        new Clipboard("#" + this.copyBtn.id, {
            text: function(t) {
                return e.deckCode;
            }
        }), this.decklist = document.createElement("div"), this.decklist.className = "decklist", 
        this.decklist.id = e.name;
        var s = !0, o = !1, n = void 0;
        try {
            for (var l, h = e.cards[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                var d = l.value;
                this.cardNames.push(d.name);
                var c = new CardDiv(d);
                c.hoverDiv.onmouseover = this.window.highlight.bind(this.window), c.hoverDiv.onmouseout = this.window.highlight.bind(this.window), 
                this.cards.push(c), this.dust += c.dust * c.quantity;
                var u = c.cost >= 10 ? 10 : c.cost;
                this.manaBin[u] += parseInt(c.quantity), this.decklist.appendChild(c.div);
            }
        } catch (t) {
            o = !0, n = t;
        } finally {
            try {
                !s && h.return && h.return();
            } finally {
                if (o) throw n;
            }
        }
        this.deckinfo = document.createElement("div"), this.deckinfo.className = "decklist deckinfo", 
        this.deckinfo.id = e.name;
        var y = document.createElement("p");
        y.innerHTML = "Manacurve", y.className = "manacurve", this.deckinfo.appendChild(y), 
        this.chart = document.createElement("div"), this.chartId = "chartId:" + randint(0, 1e8), 
        this.chart.id = this.chartId, this.chart.className = "manaChart", this.deckinfo.appendChild(this.chart);
        var f = document.createElement("div"), m = document.createElement("p");
        m.innerHTML = this.dust + "  ", m.className = "dustInfo";
        var v = document.createElement("img");
        v.src = "Images/dust.png", v.className = "dustImg", f.appendChild(m), f.appendChild(v), 
        this.deckinfo.appendChild(f);
        var p = document.createElement("p");
        p.className = "cardtypes";
        var b = "";
        e.cardTypes.Minion >= 10 ? b += e.cardTypes.Minion + " Minions<br>" : 1 == e.cardTypes.Minion ? b += e.cardTypes.Minion + "  Minion<br>" : b += e.cardTypes.Minion + "  Minions<br>", 
        e.cardTypes.Spell >= 10 ? b += e.cardTypes.Spell + " Spells<br>" : 1 == e.cardTypes.Spell ? b += e.cardTypes.Spell + "  Spell<br>" : b += e.cardTypes.Spell + "  Spells<br>", 
        e.cardTypes.Weapon && (b += e.cardTypes.Weapon + "  Weapons<br>"), e.cardTypes.Hero && (b += e.cardTypes.Hero + "  Hero<br>"), 
        p.innerHTML = b, this.deckinfo.appendChild(p);
        var k = document.createElement("p");
        k.className = "author", k.innerHTML = "Author: " + e.author, this.deckinfo.appendChild(k);
        var w = document.createElement("p");
        if (w.className = "timestamp", w.innerHTML = "Updated " + e.timestamp, this.deckinfo.appendChild(w), 
        "" != e.gameplay) {
            var g = document.createElement("a");
            g.href = "https://www.reddit.com/r/ViciousSyndicate/comments/6yqj62/vs_live_web_app_feedback_thread/", 
            g.target = "_blank", g.className = "gameplay", g.innerHTML = "Gameplay", this.deckinfo.appendChild(g);
        }
        this.div.appendChild(this.deckTitle), this.div.appendChild(this.decklist), this.div.appendChild(this.deckinfo);
    }
    return _createClass(t, [ {
        key: "highlight",
        value: function(t) {
            var e = 0, i = !0, r = !1, a = void 0;
            try {
                for (var s, o = this.cards[Symbol.iterator](); !(i = (s = o.next()).done); i = !0) {
                    var n = s.value, l = 0;
                    n.name + "x1" == t && (l = 1, e = 1), n.name + "x2" == t && (l = 2, e = 2), 0 != l ? l == n.quantity ? n.div.classList.add("highlighted") : n.div.classList.add("half-highlighted") : (n.div.classList.remove("highlighted"), 
                    n.div.classList.remove("half-highlighted"));
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (r) throw a;
                }
            }
            return e;
        }
    }, {
        key: "toggleInfo",
        value: function() {
            this.showInfo ? (this.decklist.style.display = "block", this.deckinfo.style.display = "none", 
            this.infoBtn.innerHTML = "info", this.showInfo = !1) : (this.decklist.style.display = "none", 
            this.deckinfo.style.display = "block", this.infoBtn.innerHTML = "cards", this.showInfo = !0, 
            this.plot());
        }
    }, {
        key: "plot",
        value: function() {
            var t = {
                x: range(0, this.manaBin.length),
                y: this.manaBin,
                type: "bar"
            }, e = {
                margin: {
                    l: 15,
                    r: 10,
                    b: 25,
                    t: 0
                }
            };
            Plotly.newPlot(this.chartId, [ t ], e, {
                displayModeBar: !1
            });
        }
    } ]), t;
}(), CardDiv = function t(e) {
    _classCallCheck(this, t), this.name = e.name, this.cost = e.manaCost, this.quantity = e.quantity, 
    this.rarity = e.rarity, this.dust = cardDust[this.rarity], this.div = document.createElement("div"), 
    this.div.className = "card", this.div.id = this.name, this.div.style.display = "block", 
    this.hoverDiv = document.createElement("div"), this.hoverDiv.className = "hoverDiv", 
    this.hoverDiv.id = this.name + "x" + this.quantity;
    var i = document.createElement("div");
    i.className = "costContainer";
    var r = document.createElement("div");
    r.className = "hex " + this.rarity, r.innerHTML = "&#11042";
    var a = document.createElement("div");
    a.innerHTML = this.cost, a.className = "cost", this.cost >= 10 && (a.style.fontSize = "75%", 
    a.style.paddingLeft = "0.2rem", a.style.paddingTop = "0.4rem");
    var s = document.createElement("div");
    s.innerHTML = this.name, s.className = "name";
    var o;
    this.quantity > 1 && ((o = document.createElement("div")).innerHTML = "x" + this.quantity, 
    o.className = "quantity"), i.appendChild(r), i.appendChild(a), this.div.appendChild(i), 
    this.div.appendChild(s), this.quantity > 1 && this.div.appendChild(o), this.div.appendChild(this.hoverDiv);
}, DecksWindow = function() {
    function t(e) {
        _classCallCheck(this, t), this.hsFormats = e, this.archDiv = document.querySelector("#decksWindow .content .archetypes .archetypeList"), 
        this.descriptionBox = document.querySelector("#decksWindow .content .descriptionBox"), 
        this.decksDiv = document.querySelector("#decksWindow .content .decklists"), this.description = document.querySelector("#decksWindow .content .descriptionBox .description"), 
        this.overlayDiv = document.querySelector("#decksWindow .overlay"), this.overlayP = document.querySelector("#decksWindow .overlayText"), 
        this.questionBtn = document.querySelector("#decksWindow .question"), this.overlayText = "\n            Select <span class='optionBtn'>Description</span> to see the latest report on that class.\n            Select <span class='optionBtn'>Deck Lists</span> to see the latest deck lists on that class.<br><br>\n            Select any archetype on the left side to see all the decklists of that archetype.<br><br>\n            Hover over the deck title to copy or get more information on that decklist.<br><br>\n            <img src='Images/clickOnDeckTitle.png'><br><br>\n            Tips:<br><br>\n            • When you hover over a card of a decklist it highlights all cards with the same name in the other decklists.<br><br>\n        ", 
        this.firebasePath = "deckData", this.archButtons = [], this.optionButtons = document.querySelectorAll("#decksWindow .optionBtn");
        var i = !0, r = !1, a = void 0;
        try {
            for (var s, o = this.optionButtons[Symbol.iterator](); !(i = (s = o.next()).done); i = !0) s.value.addEventListener("click", this.buttonTrigger.bind(this));
        } catch (t) {
            r = !0, a = t;
        } finally {
            try {
                !i && o.return && o.return();
            } finally {
                if (r) throw a;
            }
        }
        this.f = "Standard", this.hsClass = "Druid", this.hsArch = null, this.mode = "description", 
        this.deckWidth = "12rem", this.fullyLoaded = !1, this.overlay = !1, this.decklists = [], 
        this.data = {};
        var n = !0, l = !1, h = void 0;
        try {
            for (var d, c = this.hsFormats[Symbol.iterator](); !(n = (d = c.next()).done); n = !0) {
                var u = d.value;
                this.data[u] = {};
                var y = !0, f = !1, m = void 0;
                try {
                    for (var v, p = hsClasses[Symbol.iterator](); !(y = (v = p.next()).done); y = !0) {
                        var b = v.value;
                        this.data[u][b] = {}, this.data[u][b].archetypes = [], this.data[u][b].text = "";
                    }
                } catch (t) {
                    f = !0, m = t;
                } finally {
                    try {
                        !y && p.return && p.return();
                    } finally {
                        if (f) throw m;
                    }
                }
            }
        } catch (t) {
            l = !0, h = t;
        } finally {
            try {
                !n && c.return && c.return();
            } finally {
                if (l) throw h;
            }
        }
        this.renderOptions(), this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), 
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
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.optionButtons[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) (d = r.value).classList.remove("highlighted"), 
                d.id == this.mode && d.classList.add("highlighted");
            } catch (t) {
                e = !0, i = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw i;
                }
            }
            var s = !0, o = !1, n = void 0;
            try {
                for (var l, h = this.archButtons[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                    var d = l.value;
                    d.classList.remove("highlighted"), null != this.hsArch && d.id == this.hsArch.name && d.classList.add("highlighted");
                }
            } catch (t) {
                o = !0, n = t;
            } finally {
                try {
                    !s && h.return && h.return();
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
                var t = t.val(), e = !0, i = !1, r = void 0;
                try {
                    for (var a, s = this.hsFormats[Symbol.iterator](); !(e = (a = s.next()).done); e = !0) {
                        var o = a.value, n = !0, l = !1, h = void 0;
                        try {
                            for (var d, c = hsClasses[Symbol.iterator](); !(n = (d = c.next()).done); n = !0) {
                                var u = d.value;
                                this.data[o][u].text = t[o][u].text;
                                var y = Object.keys(t[o][u].archetypes), f = !0, m = !1, v = void 0;
                                try {
                                    for (var p, b = y[Symbol.iterator](); !(f = (p = b.next()).done); f = !0) {
                                        var k = p.value;
                                        this.data[o][u].archetypes.push({
                                            name: k,
                                            hsClass: u,
                                            hsFormat: o,
                                            decklists: []
                                        });
                                        var w = this.data[o][u].archetypes.length - 1, g = t[o][u].archetypes[k], T = Object.keys(g), C = !0, x = !1, L = void 0;
                                        try {
                                            for (var S, W = T[Symbol.iterator](); !(C = (S = W.next()).done); C = !0) {
                                                var B = S.value;
                                                g[B];
                                                this.data[o][u].archetypes[w].decklists.push(g[B]);
                                            }
                                        } catch (t) {
                                            x = !0, L = t;
                                        } finally {
                                            try {
                                                !C && W.return && W.return();
                                            } finally {
                                                if (x) throw L;
                                            }
                                        }
                                    }
                                } catch (t) {
                                    m = !0, v = t;
                                } finally {
                                    try {
                                        !f && b.return && b.return();
                                    } finally {
                                        if (m) throw v;
                                    }
                                }
                            }
                        } catch (t) {
                            l = !0, h = t;
                        } finally {
                            try {
                                !n && c.return && c.return();
                            } finally {
                                if (l) throw h;
                            }
                        }
                    }
                } catch (t) {
                    i = !0, r = t;
                } finally {
                    try {
                        !e && s.return && s.return();
                    } finally {
                        if (i) throw r;
                    }
                }
                this.fullyLoaded = !0, console.log("decks loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                this.plot();
            }
        }
    }, {
        key: "deckLink",
        value: function(t) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Standard";
            this.fullyLoaded || this.loadData();
            var i, r;
            this.mode = "decklists", this.f = e;
            var a = !0, s = !1, o = void 0;
            try {
                for (var n, l = hsClasses[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
                    var h = n.value;
                    -1 != t.indexOf(h) && (i = h);
                    var d = this.data[e][h].archetypes, c = !0, u = !1, y = void 0;
                    try {
                        for (var f, m = d[Symbol.iterator](); !(c = (f = m.next()).done); c = !0) {
                            var v = f.value;
                            if (v.name == t) {
                                i = h, r = v;
                                break;
                            }
                        }
                    } catch (t) {
                        u = !0, y = t;
                    } finally {
                        try {
                            !c && m.return && m.return();
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
            void 0 == i && (i = "Druid"), void 0 == r && (r = null, this.mode = "description"), 
            this.hsClass = i, this.hsArch = r, this.plot(), this.renderOptions();
        }
    }, {
        key: "plot",
        value: function() {
            this.fullyLoaded && this.loadFormat(this.f);
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
            var e = this.data[this.f][this.hsClass].archetypes, i = !0, r = !1, a = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(i = (s = o.next()).done); i = !0) {
                    var n = s.value;
                    this.addArchetypeBtn(n);
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (r) throw a;
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
                var t = "", e = !0, i = !1, r = void 0;
                try {
                    for (var a, s = this.hsArch.decklists[Symbol.iterator](); !(e = (a = s.next()).done); e = !0) {
                        var o = a.value;
                        t += this.deckWidth + " ";
                        var n = new Decklist(o, this.hsClass, this);
                        this.decklists.push(n), this.decksDiv.appendChild(n.div);
                    }
                } catch (t) {
                    i = !0, r = t;
                } finally {
                    try {
                        !e && s.return && s.return();
                    } finally {
                        if (i) throw r;
                    }
                }
                this.descriptionBox.style.display = "none", this.decksDiv.style.display = "grid", 
                this.decksDiv.style.gridTemplateColumns = t;
            } else this.hsArch = null;
        }
    }, {
        key: "highlight",
        value: function(t) {
            if ("mouseover" == t.type) {
                var e = t.target.id, i = t.target.parentElement.parentElement.id, r = !0, a = !1, s = void 0;
                try {
                    for (var o, n = this.decklists[Symbol.iterator](); !(r = (o = n.next()).done); r = !0) (y = o.value).name != i && y.highlight(e);
                } catch (t) {
                    a = !0, s = t;
                } finally {
                    try {
                        !r && n.return && n.return();
                    } finally {
                        if (a) throw s;
                    }
                }
            } else {
                var i = t.target.parentElement.parentElement.id, l = !0, h = !1, d = void 0;
                try {
                    for (var c, u = this.decklists[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                        var y = c.value;
                        y.name != i && y.highlight(e);
                    }
                } catch (t) {
                    h = !0, d = t;
                } finally {
                    try {
                        !l && u.return && u.return();
                    } finally {
                        if (h) throw d;
                    }
                }
            }
        }
    }, {
        key: "highlightUnique",
        value: function() {}
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
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayP.innerHTML = this.overlayText, 
            this.overlayDiv.style.display = "block", this.overlay = !0);
        }
    } ]), t;
}(), History = function() {
    function t(e, i) {
        _classCallCheck(this, t), this.window = i, this.data = e, this.bgColor = "transparent", 
        this.gridcolor = "white", this.annotations = [], this.layout = {
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
                tickangle: 0,
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
        }, this.top = 9, this.timeFrame = {
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
            var t = this.window.f, e = this.window.t, i = "lastDay" == this.window.t || "last12Hours" == this.window.t || "last6Hours" == this.window.t ? "lastHours" : "lastDays", r = "lastHours" == i ? "Hour" : "Day", a = "lastHours" == i ? 2 : 0, s = this.timeFrame[e], o = this.window.r, n = this.window.mode, l = range(a, s), h = this.data[t][i][o][n], d = 0, c = [], u = [], y = [], f = 0;
            this.annotations = [];
            for (var m = h[h.length - 1].data.slice(), v = a; v < s && v < m.length; v++) {
                f += m[v];
                var p = {
                    x: v,
                    y: .05,
                    xref: "x",
                    yref: "y",
                    text: m[v],
                    showarrow: !1,
                    bgcolor: "rgba(0,0,0,0.3)",
                    font: {
                        color: "white"
                    },
                    opacity: .8
                };
                this.annotations.push(p);
            }
            for (var b = h.slice().sort(function(t, e) {
                return t.avg > e.avg ? -1 : t.avg < e.avg ? 1 : 0;
            }), v = 0; v < this.top; v++) {
                var k, w = b[v].name;
                k = "classes" == n ? {
                    color: hsColors[w],
                    fontColor: hsFontColors[w]
                } : this.window.getArchColor(0, w, this.window.f), y.push({
                    name: w,
                    color: k.color,
                    fontColor: k.fontColor
                });
                var g = "lastHours" == i ? this.smoothData(b[v].data) : b[v].data.slice();
                g = g.slice(a, s);
                for (var T = [], C = 0; C < l.length; C++) {
                    var x = C > 0 ? r + "s" : r;
                    T.push(b[v].name + " (" + (100 * g[C]).toFixed(1) + "% )<br>" + l[C] + " " + x + " ago"), 
                    g[C] > d && (d = g[C]);
                }
                u.push({
                    x: l.slice(),
                    y: fillRange(0, g.length, 0),
                    text: T,
                    line: {
                        width: 2.5,
                        simplify: !1
                    },
                    marker: {
                        color: k.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                }), c.push({
                    x: l.slice(),
                    y: g.slice(),
                    text: T,
                    line: {
                        width: 2.5
                    },
                    marker: {
                        color: k.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                });
            }
            var L = [];
            if ("lastHours" == i) for (var S = new Date().getHours(), v = 0; v < l.length; v++) if (v % 3 == 0 || 1 == v) {
                var W = parseInt((S + 24 - l[v]) % 24);
                L.push(W + ":00");
            } else L.push("");
            if ("lastDays" == i) for (v = 0; v < l.length; v++) v % 4 == 0 || 0 == v ? ((S = new Date()).setDate(S.getDate() - v), 
            L.push(S.getDate() + "." + (S.getMonth() + 1) + ".")) : L.push("");
            this.layout.yaxis.range = [ 0, 1.1 * d ], this.layout.xaxis.tickvals = range(a, l.length + a), 
            this.layout.xaxis.ticktext = L, Plotly.newPlot("chart1", u, this.layout, {
                displayModeBar: !1
            }), this.window.nrGames = f, this.window.setGraphTitle(), this.createLegend(y), 
            this.annotate(this.window.annotated), Plotly.animate("chart1", {
                data: c,
                traces: range(0, c.length),
                layout: {}
            }, {
                transition: {
                    duration: 100,
                    easing: "linear"
                }
            });
        }
    }, {
        key: "createLegend",
        value: function(t) {
            var e = this.window.mode;
            this.window.clearChartFooter();
            var i = 9;
            "classes" == e && (i = 9), "decks" == e && (i = this.top) > t.length && (i = t.length);
            for (var r = 0; r < i; r++) "classes" == e && this.window.addLegendItem(hsClasses[r]), 
            "decks" == e && this.window.addLegendItem(t[r].name);
        }
    }, {
        key: "annotate",
        value: function(t) {
            var e;
            e = t ? {
                annotations: this.annotations
            } : {
                annotations: []
            }, Plotly.relayout("chart1", e);
        }
    }, {
        key: "smoothData",
        value: function(t) {
            for (var e = t.slice(), i = [], r = 0; r < e.length; r++) {
                var a = 0, s = 0;
                r > 0 && (s += .3 * e[r - 1], a += .3), r < e.length - 1 && (s += .3 * e[r + 1], 
                a += .3), s += e[r] * (1 - a), i.push(s);
            }
            return i;
        }
    } ]), t;
}(), InfoWindow = function t() {
    _classCallCheck(this, t);
}, Ladder = function() {
    function t(e, i, r, a) {
        _classCallCheck(this, t), this.maxLegendEntries = 9, this.maxLines = 10, this.bgColor = "transparent", 
        this.fontColor = a.fontColor, this.fontColorLight = a.fontColorLight, this.lineWidth = 2.7, 
        this.fr_min = .03, this.DATA = e, this.f = i, this.t = r, this.window = a, this.archetypes = [], 
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
            for (var l, h = this.window.ranks[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                var d = l.value;
                this.tiers.push({
                    name: btnIdToText[d],
                    buttonId: d,
                    start: rankRange[d][0],
                    end: rankRange[d][1]
                });
            }
        } catch (t) {
            o = !0, n = t;
        } finally {
            try {
                !s && h.return && h.return();
            } finally {
                if (o) throw n;
            }
        }
        this.tier = this.tiers[0];
        var c = !0, u = !1, y = void 0;
        try {
            for (var f, m = hsClasses[Symbol.iterator](); !(c = (f = m.next()).done); c = !0) {
                it = f.value;
                this.traces_zoom[it] = [];
            }
        } catch (t) {
            u = !0, y = t;
        } finally {
            try {
                !c && m.return && m.return();
            } finally {
                if (u) throw y;
            }
        }
        var v = !0, p = !1, b = void 0;
        try {
            for (var k, w = this.tiers[Symbol.iterator](); !(v = (k = w.next()).done); v = !0) {
                var g = k.value;
                this.totGamesRanks[g.buttonId] = 0;
                var T = {
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
                }, C = [], x = !0, L = !1, S = void 0;
                try {
                    for (var W, B = hsClasses[Symbol.iterator](); !(x = (W = B.next()).done); x = !0) it = W.value, 
                    C.push(hsColors[it]);
                } catch (t) {
                    L = !0, S = t;
                } finally {
                    try {
                        !x && B.return && B.return();
                    } finally {
                        if (L) throw S;
                    }
                }
                var M = {
                    values: fillRange(0, hsClasses.length, 0),
                    labels: hsClasses.slice(),
                    marker: {
                        colors: C
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
                this.traces_pie.decks[g.buttonId] = [ T ], this.traces_pie.classes[g.buttonId] = [ M ];
            }
        } catch (t) {
            p = !0, b = t;
        } finally {
            try {
                !v && w.return && w.return();
            } finally {
                if (p) throw b;
            }
        }
        var I = e.archetypes, _ = e.gamesPerRank;
        this.rankSums = e.gamesPerRank;
        for (var D = this.smoothLadder(e.rankData, _.slice()), E = this.smoothLadder(e.classRankData, _.slice()), q = 0; q < hsRanks; q++) {
            q % 5 == 0 ? this.rankLabels.push(q + "  ") : this.rankLabels.push(""), this.totGames += _[q];
            var F = !0, H = !1, A = void 0;
            try {
                for (var R, O = this.tiers[Symbol.iterator](); !(F = (R = O.next()).done); F = !0) q >= (g = R.value).start && q <= g.end && (this.totGamesRanks[g.buttonId] += _[q]);
            } catch (t) {
                H = !0, A = t;
            } finally {
                try {
                    !F && O.return && O.return();
                } finally {
                    if (H) throw A;
                }
            }
        }
        this.rankLabels[0] = "L  ";
        for (q = 0; q < I.length; q++) {
            var P = [], z = [], G = [], N = 0, U = I[q][1] + " " + I[q][0].replace("§", ""), Y = hsClasses.indexOf(I[q][0]), X = this.window.getArchColor(I[q][0], I[q][1], this.f), V = X.fontColor;
            X = X.color;
            for (st = 0; st < hsRanks; st++) {
                ot = D[st][q];
                z.push(ot), G.push("<b>" + U + "     </b><br>freq: " + (100 * ot).toFixed(1) + "%"), 
                ot < this.fr_min && q > 8 && (this.traces_bar.decks[Y].y[st] += ot, ot = 0), N += ot, 
                P.push(ot);
                var K = !0, j = !1, Z = void 0;
                try {
                    for (var J, Q = this.tiers[Symbol.iterator](); !(K = (J = Q.next()).done); K = !0) if (st == (g = J.value).start && (this.traces_pie.decks[g.buttonId][0].values.push(ot), 
                    this.traces_pie.decks[g.buttonId][0].labels.push(U), this.traces_pie.decks[g.buttonId][0].marker.colors.push(X)), 
                    st > g.start && st <= g.end && (this.traces_pie.decks[g.buttonId][0].values[q] += ot), 
                    st == g.end) {
                        this.traces_pie.decks[g.buttonId][0].values[q] /= g.end - g.start + 1, this.traces_pie.decks[g.buttonId][0].text.push(U);
                        var $ = this.traces_pie.decks[g.buttonId][0].values[q];
                        $ < this.fr_min && q > 8 && (this.traces_pie.decks[g.buttonId][0].values[q] = 0, 
                        this.traces_pie.decks[g.buttonId][0].values[Y] += $);
                    }
                } catch (t) {
                    j = !0, Z = t;
                } finally {
                    try {
                        !K && Q.return && Q.return();
                    } finally {
                        if (j) throw Z;
                    }
                }
            }
            N /= hsRanks;
            var tt = {
                x: range(0, hsRanks),
                y: P.slice(),
                name: U,
                text: G,
                hoverinfo: "text",
                marker: {
                    color: X
                },
                type: "bar",
                winrate: 0,
                hsClass: I[q][0] + I[q][1]
            }, et = {
                x: range(0, hsRanks),
                y: z.slice(),
                name: U,
                text: G,
                hoverinfo: "text",
                orientation: "h",
                marker: {
                    color: X
                },
                line: {
                    width: this.lineWidth
                },
                type: "scatter",
                mode: "lines",
                winrate: 0,
                hsClass: I[q][0] + I[q][1],
                fr: N
            };
            this.traces_bar.decks.push(tt), this.traces_line.decks.push(et), this.archLegend.push({
                name: U,
                hsClass: I[q][0],
                color: X,
                fontColor: V,
                fr: N
            }), this.archetypes.push({
                name: U,
                hsClass: I[q][0],
                fr: N,
                data: z.slice(),
                color: X,
                fontColor: V
            });
        }
        for (q = 0; q < 9; q++) {
            for (var it = hsClasses[q], rt = [], at = [], N = 0, st = 0; st < hsRanks; st++) {
                var ot = E[st][q];
                rt.push(ot), at.push(it + " " + (100 * ot).toFixed(2) + "%"), N += ot;
                var nt = !0, lt = !1, ht = void 0;
                try {
                    for (var dt, ct = this.tiers[Symbol.iterator](); !(nt = (dt = ct.next()).done); nt = !0) st >= (g = dt.value).start && st <= g.end && (this.traces_pie.classes[g.buttonId][0].values[q] += ot), 
                    st == g.end && (this.traces_pie.classes[g.buttonId][0].values[q] /= g.end - g.start + 1);
                } catch (t) {
                    lt = !0, ht = t;
                } finally {
                    try {
                        !nt && ct.return && ct.return();
                    } finally {
                        if (lt) throw ht;
                    }
                }
            }
            var ut = fillRange(0, hsRanks, 0), yt = !0, ft = !1, mt = void 0;
            try {
                for (var vt, pt = this.archetypes[Symbol.iterator](); !(yt = (vt = pt.next()).done); yt = !0) if ((St = vt.value).hsClass == it) {
                    for (var bt = [], kt = [], N = 0, st = 0; st < hsRanks; st++) ut[st] += St.data[st], 
                    bt.push(""), kt.push(St.data[st]), N += St.data[st];
                    var wt = {
                        x: range(0, hsRanks),
                        y: St.data.slice(),
                        name: St.name,
                        text: bt,
                        hoverinfo: "text",
                        marker: {
                            color: St.color
                        },
                        type: "bar",
                        winrate: 0,
                        hsClass: it,
                        overall: kt,
                        fr_avg: N / hsRanks
                    };
                    this.traces_zoom[it].push(wt);
                }
            } catch (t) {
                ft = !0, mt = t;
            } finally {
                try {
                    !yt && pt.return && pt.return();
                } finally {
                    if (ft) throw mt;
                }
            }
            var gt = !0, Tt = !1, Ct = void 0;
            try {
                for (var xt, Lt = this.traces_zoom[it][Symbol.iterator](); !(gt = (xt = Lt.next()).done); gt = !0) for (var St = xt.value, st = 0; st < hsRanks; st++) St.y[st] /= ut[st] > 0 ? ut[st] : 1, 
                St.text[st] = St.name + "<br>" + (100 * St.y[st]).toFixed(1) + "% of " + St.hsClass + "<br>" + (100 * St.overall[st]).toFixed(1) + "% overall";
            } catch (t) {
                Tt = !0, Ct = t;
            } finally {
                try {
                    !gt && Lt.return && Lt.return();
                } finally {
                    if (Tt) throw Ct;
                }
            }
            N /= hsRanks, this.c_data[it] = rt.slice();
            var Wt = {
                x: range(0, hsRanks),
                y: rt.slice(),
                name: it,
                text: at.slice(),
                hoverinfo: "text",
                marker: {
                    color: hsColors[it]
                },
                type: "bar",
                winrate: 0,
                hsClass: it
            }, Bt = {
                x: range(0, hsRanks),
                y: rt.slice(),
                name: it,
                text: at.slice(),
                hoverinfo: "text",
                marker: {
                    color: hsColors[it]
                },
                line: {
                    width: this.lineWidth
                },
                type: "scatter",
                mode: "lines",
                winrate: 0,
                hsClass: it,
                fr: N
            };
            this.traces_bar.classes.push(Wt), this.traces_line.classes.push(Bt), this.classLegend.push({
                name: it,
                color: hsColors[it]
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
                hoverformat: ",.0%",
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
        var Mt = function(t, e) {
            return t.hsClass < e.hsClass ? -1 : t.hsClass > e.hsClass ? 1 : 0;
        }, It = function(t, e) {
            return t.fr > e.fr ? -1 : t.fr < e.fr ? 1 : 0;
        };
        this.traces_bar.classes.sort(Mt), this.traces_line.classes.sort(It), this.traces_line.classes.splice(this.maxLines), 
        this.traces_bar.decks.sort(Mt), this.traces_line.decks.sort(It), this.traces_line.decks.splice(this.maxLines), 
        this.archLegend.sort(It), this.archetypes.sort(It);
    }
    return _createClass(t, [ {
        key: "smoothLadder",
        value: function(t, e) {
            var i = [ t[0].slice() ];
            0 == e[0] && (e[0] = 1), 0 == e[1] && (e[1] = 1);
            for (var r, a, s = 1; s < hsRanks - 1; s++) {
                0 == e[s + 1] && (e[s + 1] = 1), a = e[s - 1] / e[s], r = e[s + 1] / e[s], a > 7 && (a = 7), 
                r > 7 && (r = 7), s % 5 == 0 && (r = 0), s % 5 == 1 && (a = 0);
                for (var o = 3.5 + r + a, n = [], l = 0; l < t[s].length; l++) {
                    var h = t[s][l] / e[s], d = t[s + 1][l] / e[s + 1], c = t[s - 1][l] / e[s - 1];
                    n.push((3.5 * h + d * r + c * a) / o);
                }
                i.push(n);
            }
            i.push(t[hsRanks - 1].slice());
            for (u = 0; u < i[0].length; u++) i[0][u] /= e[0];
            for (var u = 0; u < t[hsRanks - 1].length; u++) i[hsRanks - 1][u] /= e[hsRanks - 1];
            return i;
        }
    }, {
        key: "plot",
        value: function() {
            document.getElementById("chart1").innerHTML = "";
            var t, e;
            switch (this.window.hideRankFolder(), this.window.plotType) {
              case "pie":
                this.window.showRankFolder(), e = this.layout_pie, t = this.traces_pie[this.window.mode][this.window.r];
                break;

              case "number":
                return this.createTable(this.window.mode), void this.window.setGraphTitle();

              case "bar":
                e = this.layout_bar, t = this.traces_bar[this.window.mode];
                break;

              case "zoom":
                e = this.layout_bar, t = this.traces_zoom[this.window.zoomClass];
                break;

              case "line":
                e = this.layout_line, t = this.traces_line[this.window.mode];
            }
            "portrait" == MOBILE && "pie" != this.window.plotTyp && (e.width = 2 * ui.width, 
            e.height = .6 * ui.height), Plotly.newPlot("chart1", t, e, {
                displayModeBar: !1
            });
            var i = "pie" != this.window.plotType ? this.totGames : this.totGamesRanks[this.window.r];
            this.window.nrGames = i, this.window.setGraphTitle(), this.annotate(this.window.annotated), 
            this.createLegend(this.window.mode), "bar" != this.window.plotType && "zoom" != this.window.plotType || !PREMIUM || document.getElementById("chart1").on("plotly_click", this.zoomToggle.bind(this));
        }
    }, {
        key: "colorScale",
        value: function(t) {
            var e = this.window.colorScale_c1, i = this.window.colorScale_c2, r = [];
            (t /= this.window.colorScale_f) > 1 && (t = 1);
            for (var a = 0; a < 3; a++) r.push(parseInt(e[a] + (i[a] - e[a]) * t));
            return "rgb(" + r[0] + "," + r[1] + "," + r[2] + ")";
        }
    }, {
        key: "annotate",
        value: function(t) {
            var e = this.window.plotType;
            if ("pie" != e && "number" != e && "timeline" != e) {
                var i, r = {
                    bar: .5,
                    zoom: .5,
                    line: .05
                }, a = "bar" == e || "zoom" == e ? 90 : 0;
                if (t) {
                    for (var s = [], o = 0; o < hsRanks; o++) {
                        var n = {
                            x: o,
                            y: r[e],
                            xref: "x",
                            yref: "y",
                            textangle: a,
                            text: this.rankSums[o],
                            showarrow: !1,
                            bgcolor: "rgba(0,0,0,0.3)",
                            font: {
                                color: "white"
                            },
                            opacity: .8
                        };
                        s.push(n);
                    }
                    i = {
                        annotations: s
                    };
                } else i = {
                    annotations: []
                };
                Plotly.relayout("chart1", i);
            }
        }
    }, {
        key: "createTable",
        value: function(t) {
            var e = 20;
            this.archetypes.length < e && (e = this.archetypes.length), document.getElementById("chart1").innerHTML = "";
            var i = document.createElement("table");
            i.id = "numberTable";
            var r = document.createElement("tr");
            this.download[t] = [ [] ];
            var a = document.createElement("th");
            a.className = "pivot", a.innerHTML = "Rank ->", r.appendChild(a), this.download[t] += "Rank%2C";
            for (u = hsRanks - 1; u >= 0; u--) (a = document.createElement("th")).innerHTML = u > 0 ? u : "L", 
            r.appendChild(a), this.download[t] += u > 0 ? u : "L", this.download[t] += "%2C";
            if (i.appendChild(r), this.download[t] += "%0A", "decks" == t) for (l = 0; l < e; l++) {
                var s = this.archetypes[l], o = s.name + "%2C", n = document.createElement("tr");
                (c = document.createElement("td")).className = "pivot", c.style.backgroundColor = s.color, 
                c.style.color = s.fontColor, c.innerHTML = s.name, n.appendChild(c);
                for (u = hsRanks - 1; u > -1; u--) (a = document.createElement("td")).style.backgroundColor = this.colorScale(s.data[u]), 
                a.innerHTML = (100 * s.data[u]).toFixed(1) + "%", n.appendChild(a), o += s.data[u] + "%2C";
                i.appendChild(n), this.download[t] += o + "%0A";
            }
            if ("classes" == t) for (var l = 0; l < 9; l++) {
                var h = hsClasses[l], d = this.c_data[h], o = h + "%2C", n = document.createElement("tr"), c = document.createElement("td");
                c.className = "pivot", c.style.backgroundColor = hsColors[h], c.style.color = hsFontColors[h], 
                c.innerHTML = h, n.appendChild(c);
                for (var u = hsRanks - 1; u > -1; u--) (a = document.createElement("td")).style.backgroundColor = this.colorScale(d[u]), 
                a.innerHTML = (100 * d[u]).toFixed(1) + "%", n.appendChild(a), o += d[u] + "%2C";
                i.appendChild(n), this.download[t] += o + "%0A";
            }
            document.getElementById("chart1").appendChild(i), this.createNumbersFooter();
        }
    }, {
        key: "createLegend",
        value: function(t) {
            if ("zoom" != this.window.plotType) {
                this.window.clearChartFooter();
                var e, i = this.archLegend;
                "classes" == t && (e = 9), "decks" == t && (e = this.maxLegendEntries) > i.length && (e = i.length);
                for (var r = 0; r < e; r++) "classes" == t && this.window.addLegendItem(hsClasses[r]), 
                "decks" == t && this.window.addLegendItem(i[r].name);
            } else this.createZoomLegend();
        }
    }, {
        key: "createZoomLegend",
        value: function() {
            var t = this.window.zoomClass;
            this.window.clearChartFooter();
            var e = !0, i = !1, r = void 0;
            try {
                for (var a, s = this.traces_zoom[t][Symbol.iterator](); !(e = (a = s.next()).done); e = !0) {
                    var o = a.value;
                    o.fr_avg > 0 && this.window.addLegendItem(o.name);
                }
            } catch (t) {
                i = !0, r = t;
            } finally {
                try {
                    !e && s.return && s.return();
                } finally {
                    if (i) throw r;
                }
            }
        }
    }, {
        key: "createNumbersFooter",
        value: function() {
            for (var t = document.querySelector("#ladderWindow .chart-footer"); t.firstChild; ) t.removeChild(t.firstChild);
            if (PREMIUM) {
                var e = document.createElement("button");
                e.innerHTML = "Download <div class='fa fa-cloud-download'></div>", e.className = "download", 
                e.addEventListener("click", this.downloadCSV.bind(this)), t.appendChild(e);
            }
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
            this.window.plotType = "zoom";
            var e = t.points[0].data.hsClass;
            if (-1 == hsClasses.indexOf(e)) {
                var i = !0, r = !1, a = void 0;
                try {
                    for (var s, o = hsClasses[Symbol.iterator](); !(i = (s = o.next()).done); i = !0) {
                        var n = s.value;
                        if (-1 != e.indexOf(n)) {
                            this.window.zoomClass = n;
                            break;
                        }
                    }
                } catch (t) {
                    r = !0, a = t;
                } finally {
                    try {
                        !i && o.return && o.return();
                    } finally {
                        if (r) throw a;
                    }
                }
            } else this.window.zoomClass = e;
            this.plot();
        }
    } ]), t;
}(), LadderWindow = function() {
    function t(e, i, r) {
        _classCallCheck(this, t), this.window = document.querySelector("#ladderWindow"), 
        this.chartDiv = document.querySelector("#ladderWindow #chart1"), this.classDeckOptions = document.querySelector("#ladderWindow .content-header .classDeckOptions"), 
        this.nrGamesBtn = document.querySelector("#ladderWindow .content-header #nrGames"), 
        this.graphTitle = document.querySelector("#ladderWindow .graphTitle"), this.graphLabel = document.querySelector("#ladderWindow .graphLabel"), 
        this.rankFolder = document.querySelector("#ladderWindow .content-header #rankBtn"), 
        this.optionButtons = document.querySelectorAll("#ladderWindow .optionBtn"), this.questionBtn = document.querySelector("#ladderWindow .question"), 
        this.overlayDiv = document.querySelector("#ladderWindow .overlay"), this.overlayP = document.querySelector("#ladderWindow .overlayText"), 
        this.chartFooter = document.querySelector("#ladderWindow .chart-footer"), this.firebasePath = PREMIUM ? "premiumData/ladderData" : "data/ladderData", 
        this.firebaseHistoryPath = PREMIUM ? "premiumData/historyData" : "", this.overlayText = {}, 
        this.overlayText.bar = "\n        This stacked bar graph displays the class/ deck frequencies on the y-axis and the ranks on the ranked ladder on the x-axis.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>\n        Tips:<br><br>\n        • Hover over the 'number of games' label in the header to display the number of games per rank on the bar plot.<br><br>\n        • Click on one bar of any class to 'zoom in' to display all the archetypes of that class. Click again to 'zoom out'.<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.zoom = this.overlayText.bar, this.overlayText.line = "\n        This line graph displays the class/ deck frequencies on the y-axis and the ranks on the ranked ladder on the x-axis.<br><br>\n        In <span class='optionBtn'>Decks</span> mode the chart displays the 9 most frequent decks.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.pie = "\n        This pie graph displays the class/ deck frequencies as pie slices. You can vary the rank brackets in the header.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.number = "\n        This table displays the class/ deck frequencies over ladder ranks (rank 20 - Legend). You can vary the rank brackets in the header.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>\n        Click on the \"download\" button at the bottom of the graph to download the data as '.csv' file.<br><br>\n        ", 
        this.overlayText.timeline = "\n        This line graph displays the class/ deck frequencies on the y-axis and time (in hours or days) on the x-axis.<br><br>\n        If you choose 'Last Day', 'Last 6 Hours' or 'Last 12 Hours' the time unit is in 'Hours' whereas for 'Last 3 Days' etc. it's in 'Days'.<br><br>\n        The 'Hours' lines have been averaged between +/- 1 Hour to make for a smoother curve.<br><br>\n        In <span class='optionBtn'>Decks</span> mode the chart displays the 9 most frequent decks.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.fontColor = "#222", this.fontColorLight = "#999", this.overlay = !1, this.annotated = !1, 
        this.colorScale_c1 = [ 255, 255, 255 ], this.colorScale_c2 = [ 87, 125, 186 ], this.colorScale_f = .15, 
        this.archetypeColors = {
            Standard: {},
            Wild: {}
        }, this.data = {}, this.hsFormats = e, this.hsTimes = i, this.ranks = r, this.archColors = {};
        var a = !0, s = !1, o = void 0;
        try {
            for (var n, l = this.hsFormats[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
                w = n.value;
                this.archColors[w] = {};
                var h = !0, d = !1, c = void 0;
                try {
                    for (var u, y = hsClasses[Symbol.iterator](); !(h = (u = y.next()).done); h = !0) {
                        var f = u.value;
                        this.archColors[w][f] = {
                            count: 0
                        };
                    }
                } catch (t) {
                    d = !0, c = t;
                } finally {
                    try {
                        !h && y.return && y.return();
                    } finally {
                        if (d) throw c;
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
        this.fullyLoaded = !1, this.history = null, this.zoomClass = null, this.nrGames = 0;
        var m = !0, v = !1, p = void 0;
        try {
            for (var b, k = this.hsFormats[Symbol.iterator](); !(m = (b = k.next()).done); m = !0) {
                var w = b.value;
                this.data[w] = {};
                var g = !0, T = !1, C = void 0;
                try {
                    for (var x, L = this.hsTimes[Symbol.iterator](); !(g = (x = L.next()).done); g = !0) {
                        var S = x.value;
                        this.data[w][S] = null;
                    }
                } catch (t) {
                    T = !0, C = t;
                } finally {
                    try {
                        !g && L.return && L.return();
                    } finally {
                        if (T) throw C;
                    }
                }
            }
        } catch (t) {
            v = !0, p = t;
        } finally {
            try {
                !m && k.return && k.return();
            } finally {
                if (v) throw p;
            }
        }
        this.loadData(), this.setupUI(), this.renderOptions();
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.optionButtons[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) (C = r.value).addEventListener("click", this.buttonTrigger.bind(this));
            } catch (t) {
                e = !0, i = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw i;
                }
            }
            document.querySelector("#ladderWindow #formatFolder .dropdown").innerHTML = "";
            var s = !0, o = !1, n = void 0;
            try {
                for (var l, h = this.hsFormats[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                    var d = l.value;
                    (C = document.createElement("button")).className = "optionBtn folderBtn", C.innerHTML = d, 
                    C.id = d;
                    C.onclick = function(t) {
                        this.f = t.target.id, this.plot();
                    }.bind(this), document.querySelector("#ladderWindow #formatFolder .dropdown").appendChild(C);
                }
            } catch (t) {
                o = !0, n = t;
            } finally {
                try {
                    !s && h.return && h.return();
                } finally {
                    if (o) throw n;
                }
            }
            document.querySelector("#ladderWindow #timeFolder .dropdown").innerHTML = "";
            var c = !0, u = !1, y = void 0;
            try {
                for (var f, m = this.hsTimes[Symbol.iterator](); !(c = (f = m.next()).done); c = !0) {
                    var v = f.value;
                    (C = document.createElement("button")).className = "optionBtn folderBtn", C.innerHTML = btnIdToText[v], 
                    C.id = v;
                    C.onclick = function(t) {
                        this.t = t.target.id, this.plot();
                    }.bind(this), document.querySelector("#ladderWindow #timeFolder .dropdown").appendChild(C);
                }
            } catch (t) {
                u = !0, y = t;
            } finally {
                try {
                    !c && m.return && m.return();
                } finally {
                    if (u) throw y;
                }
            }
            document.querySelector("#ladderWindow #rankFolder .dropdown").innerHTML = "";
            var p = !0, b = !1, k = void 0;
            try {
                for (var w, g = this.ranks[Symbol.iterator](); !(p = (w = g.next()).done); p = !0) {
                    var T = w.value, C = document.createElement("button");
                    C.className = "optionBtn folderBtn", C.innerHTML = btnIdToText[T], C.id = T;
                    C.onclick = function(t) {
                        this.r = t.target.id, this.plot();
                    }.bind(this), document.querySelector("#ladderWindow #rankFolder .dropdown").appendChild(C);
                }
            } catch (t) {
                b = !0, k = t;
            } finally {
                try {
                    !p && g.return && g.return();
                } finally {
                    if (b) throw k;
                }
            }
            var x = PREMIUM ? "flex" : "none";
            this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this)), 
            this.classDeckOptions.style.display = x, document.querySelector("#ladderWindow .content-header .graphOptions #line").style.display = x, 
            document.querySelector("#ladderWindow .content-header .graphOptions #timeline").style.display = x, 
            this.nrGamesBtn.onclick = this.annotate.bind(this), this.optionButtons = document.querySelectorAll("#ladderWindow .optionBtn");
        }
    }, {
        key: "annotate",
        value: function() {
            "pie" != this.plotType && "number" != this.plotType && (this.annotated ? ("timeline" == this.plotType ? this.history.annotate(!1) : this.data[this.f][this.t].annotate(!1), 
            this.nrGamesBtn.classList.remove("highlighted")) : ("timeline" == this.plotType ? this.history.annotate(!0) : this.data[this.f][this.t].annotate(!0), 
            this.nrGamesBtn.classList.add("highlighted")), this.annotated = !this.annotated);
        }
    }, {
        key: "showGames",
        value: function() {
            "bar" != this.plotType && "zoom" != this.plotType && "line" != this.plotType || this.data[this.f][this.t].annotate(!0);
        }
    }, {
        key: "hideGames",
        value: function() {
            this.annotated || this.data[this.f][this.t].annotate(!1);
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
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.optionButtons[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                    var s = r.value;
                    s.classList.remove("highlighted"), s.id == this.mode && s.classList.add("highlighted"), 
                    s.id == this.plotType && s.classList.add("highlighted"), "nrGames" == s.id && this.annotated && s.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, i = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw i;
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
                var e = t.val(), i = !0, r = !1, a = void 0;
                try {
                    for (var s, o = this.hsFormats[Symbol.iterator](); !(i = (s = o.next()).done); i = !0) {
                        var n = s.value, l = !0, h = !1, d = void 0;
                        try {
                            for (var c, u = this.hsTimes[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                                var y = c.value;
                                this.data[n][y] = new Ladder(e[n][y], n, y, this);
                            }
                        } catch (t) {
                            h = !0, d = t;
                        } finally {
                            try {
                                !l && u.return && u.return();
                            } finally {
                                if (h) throw d;
                            }
                        }
                    }
                } catch (t) {
                    r = !0, a = t;
                } finally {
                    try {
                        !i && o.return && o.return();
                    } finally {
                        if (r) throw a;
                    }
                }
                this.fullyLoaded = !0, console.log("ladder loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                finishedLoading(), this.plot(), ui.hideLoader();
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
            if (this.fullyLoaded) {
                switch (this.plotType) {
                  case "bar":
                    this.nrGamesBtn.style.display = "flex", PREMIUM || (this.classDeckOptions.style.display = "none", 
                    this.mode = "classes");
                    break;

                  case "line":
                    this.nrGamesBtn.style.display = "flex";
                    break;

                  case "pie":
                    this.nrGamesBtn.style.display = "none", PREMIUM || (this.classDeckOptions.style.display = "flex");
                    break;

                  case "number":
                    this.nrGamesBtn.style.display = "none", PREMIUM || (this.classDeckOptions.style.display = "none", 
                    this.mode = "classes");
                    break;

                  case "timeline":
                    this.nrGamesBtn.style.display = "flex";
                }
                this.renderOptions(), "timeline" != this.plotType ? this.data[this.f][this.t].plot() : this.history.plot();
            }
        }
    }, {
        key: "getArchColor",
        value: function(t, e, i) {
            if (-1 != hsClasses.indexOf(e)) return {
                color: hsColors[e],
                fontColor: hsFontColors[e]
            };
            var r;
            if (t) r = e + " " + t; else {
                r = e;
                var a = !0, s = !1, o = void 0;
                try {
                    for (var n, l = hsClasses[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
                        var h = n.value;
                        if (-1 != r.indexOf(h)) {
                            t = h;
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
            return r in this.archColors[i] ? {
                color: hsArchColors[t][this.archColors[i][r]],
                fontColor: hsFontColors[t]
            } : (this.archColors[i][r] = this.archColors[i][t].count, this.archColors[i][t].count = (this.archColors[i][t].count + 1) % 5, 
            {
                color: hsArchColors[t][this.archColors[i][r]],
                fontColor: hsFontColors[t]
            });
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
            var t = "classes" == this.mode ? "Class" : "Deck", e = ([ "lastDay", "last6Hours", "last12Hours" ].indexOf(this.t), 
            btnIdToText[this.r]), i = "<span style='font-size: 80%'> ( " + this.nrGames.toLocaleString() + " games )</span>";
            switch (this.plotType) {
              case "bar":
                this.graphTitle.innerHTML = "Class Frequency vs Ranks" + i, this.graphLabel.innerHTML = "Ranks >";
                break;

              case "zoom":
                this.graphTitle.innerHTML = this.zoomClass + " Deck Frequency vs Ranks" + i, this.graphLabel.innerHTML = "Ranks >";
                break;

              case "line":
                this.graphTitle.innerHTML = t + " Frequency vs Ranks" + i, this.graphLabel.innerHTML = "Ranks >";
                break;

              case "pie":
                this.graphTitle.innerHTML = t + " Frequency of " + e + i, this.graphLabel.innerHTML = "";
                break;

              case "number":
                this.graphTitle.innerHTML = t + " Frequency vs Ranks" + i, this.graphLabel.innerHTML = "";
                break;

              case "timeline":
                this.graphTitle.innerHTML = t + " Frequency over Time" + i, this.graphLabel.innerHTML = "";
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayDiv.style.display = "block", 
            this.overlay = !0, this.overlayP.innerHTML = this.overlayText[this.plotType]);
        }
    }, {
        key: "addLegendItem",
        value: function(t) {
            var e = document.createElement("div"), i = (document.createElement("div"), document.createElement("l"), 
            this.getArchColor(null, t, this.f));
            e.className = "legend-item", e.style.fontSize = "0.8em", e.style = "background-color:" + i.color + "; color:" + i.fontColor, 
            e.id = t, e.innerHTML = t, e.onclick = function(t) {
                ui.deckLink(t.target.id, this.f);
            }, this.chartFooter.appendChild(e);
        }
    }, {
        key: "clearChartFooter",
        value: function() {
            for (;this.chartFooter.firstChild; ) this.chartFooter.removeChild(this.chartFooter.firstChild);
        }
    } ]), t;
}(), DISCORDLINK = "https://discord.gg/ZeAfz3", POLLLINK = "https://docs.google.com/forms/d/e/1FAIpQLSel6ym_rJHduxkgeimzf9HdNbBMB5Kak7Fmk0Bl2O7O8XhVGg/viewform?usp=sf_link", VSGOLDINFOLINK = "https://www.vicioussyndicate.com/membership/vs-gold/", ladder_times = [ "lastDay", "last2Weeks" ], ladder_times_premium = [ "last6Hours", "last12Hours", "lastDay", "last3Days", "lastWeek", "last2Weeks" ], ladder_ranks = [ "ranks_all" ], ladder_ranks_premium = [ "ranks_all", "ranks_L_5", "ranks_6_15" ], ladder_plotTypes = [], table_times = [ "last2Weeks" ], table_times_premium = [ "last3Days", "lastWeek", "last2Weeks" ], table_sortOptions = [ "frequency" ], table_sortOptions_premium = [ "frequency", "class", "winrate", "matchup" ], table_ranks = [ "ranks_all" ], table_ranks_premium = [ "ranks_all", "ranks_L_5", "ranks_6_15" ], hsRanks = 21, hsClasses = [ "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ], hsFormats = [ "Standard", "Wild" ], rankRange = {
    ranks_all: [ 0, 20 ],
    ranks_L: [ 0, 0 ],
    ranks_1_5: [ 1, 5 ],
    ranks_L_5: [ 0, 5 ],
    ranks_6_15: [ 6, 15 ]
}, cardDust = {
    Free: 0,
    Basic: 0,
    Common: 40,
    Rare: 100,
    Epic: 400,
    Legendary: 1600
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
}, hsColors = {
    Druid: "#795548",
    Hunter: "#689f38",
    Mage: "#4fc3f7",
    Paladin: "#ffee58",
    Priest: "#bdbdbb",
    Rogue: "#424242",
    Shaman: "#5c6bc0",
    Warlock: "#9c27b0",
    Warrior: "#f44336"
}, hsArchColors = {
    Druid: [ "#3d2a25", "#694f3f", "#543f33", "#b88230", "#d39e48" ],
    Hunter: [ "#67b35f", "#329c50", "#abda48", "#bce86a", "#1f7922" ],
    Mage: [ "#22abb1", "#74d8dd", "#38ccd8", "#a4dadc", "#b5eef0" ],
    Paladin: [ "#ffda74", "#ffc42e", "#ffee58", "#fbffaa", "#ff8f00" ],
    Priest: [ "#95a482", "#bfc6b1", "#9eb5a5", "#cad3be", "#e3e6dd" ],
    Rogue: [ "#3e4447", "#2a3231", "#4d5c5a", "#5e716f", "#0e1413" ],
    Shaman: [ "#002b8d", "#0074be", "#0052b4", "#009ec7", "#00b6e5" ],
    Warlock: [ "#d95dab", "#470f26", "#902661", "#591c55", "#c33891" ],
    Warrior: [ "#ba1419", "#f83f4a", "#ec191d", "#ea5e53", "#fc736b" ]
}, hsFontColors = {
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
    "§": "#88042d"
}, PowerWindow = function() {
    function t() {
        _classCallCheck(this, t), this.grid = document.querySelector("#powerGrid"), this.optionButtons = document.querySelectorAll("#powerWindow .optionBtn"), 
        this.questionBtn = document.querySelector("#powerWindow .question"), this.overlayDiv = document.querySelector("#powerWindow .overlay"), 
        this.overlayP = document.querySelector("#powerWindow .overlayText"), this.f = "Standard", 
        this.mode = "tiers", this.t_ladder = {
            Standard: "lastDay",
            Wild: "last2Weeks"
        }, PREMIUM && (this.t_ladder.Wild = "lastWeek"), this.t_table = "last2Weeks", this.top = 5, 
        this.minGames = 50, this.overlayText = "\n            This tab displays the best decks to be played in the respective rank brackets.<br><br>\n            <span class='optionBtn'>Tier Lists</span> shows the top 16 decks across specific rank brackets ('All Ranks', 'Rank 1-5' etc.).<br><br>\n            <span class='optionBtn'>Suggestions</span> shows the top 5 decks for every single rank until rank 20.<br><br>\n            The winrates are calculated by using the deck frequencies of the last 24 hours and the matchup table of the last week.<br><br>\n            If there are fewer than " + this.minGames + ' games in the respective category no data is displayed instead.<br><br>\n            Click on a deck to get to it\'s deck list in the "Decks" tab.<br><br>        \n        ', 
        this.data = {
            Standard: [],
            Wild: [],
            rankSums: {
                Standard: [],
                Wild: []
            }
        };
        for (e = 0; e < hsRanks; e++) this.data.Standard.push([]);
        for (var e = 0; e < hsRanks; e++) this.data.Wild.push([]);
        for (var i = 0; i < this.optionButtons.length; i++) this.optionButtons[i].addEventListener("click", this.buttonTrigger.bind(this));
        this.tierData = {}, this.tiers = [ {
            name: "All Ranks",
            games: {
                Standard: 0,
                Wild: 0
            },
            start: 0,
            end: 15
        }, {
            name: "L",
            games: {
                Standard: 0,
                Wild: 0
            },
            start: 0,
            end: 0
        }, {
            name: "1-5",
            games: {
                Standard: 0,
                Wild: 0
            },
            start: 1,
            end: 5
        }, {
            name: "6-15",
            games: {
                Standard: 0,
                Wild: 0
            },
            start: 6,
            end: 15
        } ], this.maxTierElements = PREMIUM ? 16 : 5;
        for (var r = [ "Standard", "Wild" ], a = 0; a < r.length; a++) {
            var s = r[a];
            this.tierData[s] = {};
            var o = !0, n = !1, l = void 0;
            try {
                for (var h, d = this.tiers[Symbol.iterator](); !(o = (h = d.next()).done); o = !0) {
                    var c = h.value;
                    this.tierData[s][c.name] = [];
                }
            } catch (t) {
                n = !0, l = t;
            } finally {
                try {
                    !o && d.return && d.return();
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
            var t = PREMIUM ? "inline" : "none";
            document.querySelector("#powerWindow .content-header #top").style.display = t, this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), 
            this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this));
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
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.optionButtons[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                    var s = r.value;
                    s.classList.remove("highlighted"), s.id == this.mode && s.classList.add("highlighted"), 
                    s.id == this.f && s.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, i = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw i;
                }
            }
        }
    }, {
        key: "addData",
        value: function(t) {
            var e = ladderWindow.data[t][this.t_ladder[t]].archetypes, i = tableWindow.data[t][this.t_table].ranks_all;
            this.data.rankSums[t] = ladderWindow.data[t][this.t_ladder[t]].rankSums;
            for (E = 0; E < hsRanks; E++) {
                var r = !0, a = !1, s = void 0;
                try {
                    for (var o, n = this.tiers[Symbol.iterator](); !(r = (o = n.next()).done); r = !0) (I = o.value).start <= E && I.end >= E && (I.games[t] += this.data.rankSums[t][E]);
                } catch (t) {
                    a = !0, s = t;
                } finally {
                    try {
                        !r && n.return && n.return();
                    } finally {
                        if (a) throw s;
                    }
                }
            }
            var l = !0, h = !1, d = void 0;
            try {
                for (var c, u = e[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                    var y = c.value, f = i.archetypes.indexOf(y.name);
                    if (-1 != f) for (E = 0; E < hsRanks; E++) {
                        var m = 0, v = 0, p = !0, b = !1, k = void 0;
                        try {
                            for (var w, g = e[Symbol.iterator](); !(p = (w = g.next()).done); p = !0) {
                                var T = w.value, C = i.archetypes.indexOf(T.name);
                                if (-1 != C) {
                                    var x = T.data[E];
                                    m += x, v += x * i.table[f][C];
                                }
                            }
                        } catch (t) {
                            b = !0, k = t;
                        } finally {
                            try {
                                !p && g.return && g.return();
                            } finally {
                                if (b) throw k;
                            }
                        }
                        0 != m ? v /= m : v = 0, this.data[t][E].push({
                            name: y.name,
                            wr: v,
                            fr: y.data[E],
                            color: y.color,
                            fontColor: y.fontColor
                        });
                        var L = !0, S = !1, W = void 0;
                        try {
                            for (var B, M = this.tiers[Symbol.iterator](); !(L = (B = M.next()).done); L = !0) {
                                var I = B.value, _ = this.tierData[t][I.name];
                                E == I.start && _.push({
                                    name: y.name,
                                    wr: v,
                                    fr: y.data[E],
                                    color: y.color,
                                    fontColor: y.fontColor,
                                    count: v > 0 ? 1 : 0
                                }), E > I.start && E <= I.end && (_[_.length - 1].wr += v, _[_.length - 1].count += v > 0 ? 1 : 0), 
                                E == I.end && _[_.length - 1].count > 0 && (_[_.length - 1].wr /= _[_.length - 1].count);
                            }
                        } catch (t) {
                            S = !0, W = t;
                        } finally {
                            try {
                                !L && M.return && M.return();
                            } finally {
                                if (S) throw W;
                            }
                        }
                    }
                }
            } catch (t) {
                h = !0, d = t;
            } finally {
                try {
                    !l && u.return && u.return();
                } finally {
                    if (h) throw d;
                }
            }
            for (var D = function(t, e) {
                return t.wr > e.wr ? -1 : t.wr < e.wr ? 1 : 0;
            }, E = 0; E < hsRanks; E++) this.data[t][E].sort(D);
            var q = !0, F = !1, H = void 0;
            try {
                for (var A, R = this.tiers[Symbol.iterator](); !(q = (A = R.next()).done); q = !0) {
                    I = A.value;
                    this.tierData[t][I.name].sort(D);
                }
            } catch (t) {
                F = !0, H = t;
            } finally {
                try {
                    !q && R.return && R.return();
                } finally {
                    if (F) throw H;
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
            for (var i = "1fr ", r = 0; r < this.top; r++) i += "4fr 1fr ";
            this.grid.style.gridTemplateColumns = i, this.grid.style.gridGap = "0.1rem", (h = document.createElement("div")).className = "header", 
            h.innerHTML = "Rank", this.grid.appendChild(h);
            for (r = 0; r < this.top; r++) (h = document.createElement("div")).className = "header columnTitle", 
            h.innerHTML = "Top " + (r + 1), this.grid.appendChild(h);
            for (r = 0; r < hsRanks; r++) if ((h = document.createElement("div")).className = "pivot", 
            h.innerHTML = e[r], this.grid.appendChild(h), this.data.rankSums[t][r] < this.minGames) for (a = 0; a < this.top; a++) (h = document.createElement("div")).className = "blank", 
            this.grid.appendChild(h), this.grid.appendChild(document.createElement("div")); else for (var a = 0; a < this.top; a++) {
                var s = this.data[t][r][a].name, o = (100 * this.data[t][r][a].wr).toFixed(1) + "%", n = this.data[t][r][a].color, l = this.data[t][r][a].fontColor, h = document.createElement("div"), d = document.createElement("button"), c = document.createElement("span");
                c.className = "tooltipText", c.innerHTML = "R:" + r + " #" + (a + 1) + " " + s, 
                d.className = "archBtn tooltip", d.id = s, d.style.backgroundColor = n, d.style.color = l, 
                d.innerHTML = s, d.onclick = this.pressButton.bind(this), h.classList.add("winrate"), 
                h.innerHTML = o, this.grid.appendChild(d), this.grid.appendChild(h);
            }
        }
    }, {
        key: "plotTiers",
        value: function(t) {
            for (;this.grid.firstChild; ) this.grid.removeChild(this.grid.firstChild);
            range(0, hsRanks)[0] = "L";
            for (var e = "", i = 0; i < this.tiers.length; i++) e += "4fr 1fr ";
            this.grid.style.gridTemplateColumns = e, this.grid.style.gridGap = "0.3rem";
            var r = !0, a = !1, s = void 0;
            try {
                for (var o, n = this.tiers[Symbol.iterator](); !(r = (o = n.next()).done); r = !0) {
                    y = o.value;
                    (v = document.createElement("div")).className = "header columnTitle", v.innerHTML = y.name, 
                    this.grid.appendChild(v);
                }
            } catch (t) {
                a = !0, s = t;
            } finally {
                try {
                    !r && n.return && n.return();
                } finally {
                    if (a) throw s;
                }
            }
            for (i = 0; i < this.maxTierElements; i++) {
                var l = !0, h = !1, d = void 0;
                try {
                    for (var c, u = this.tiers[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                        var y = c.value;
                        if (!(this.tierData[t][y.name].length <= i)) {
                            var f = this.tierData[t][y.name][i];
                            if (y.games[t] <= this.minGames || void 0 == f) (v = document.createElement("div")).className = "blank", 
                            this.grid.appendChild(v), this.grid.appendChild(document.createElement("div")); else {
                                var m = (100 * f.wr).toFixed(1) + "%", v = document.createElement("div"), p = document.createElement("button"), b = document.createElement("span");
                                b.className = "tooltipText", b.innerHTML = "#" + (i + 1) + " " + f.name, p.className = "archBtn tooltip", 
                                p.id = f.name, p.style.backgroundColor = f.color, p.style.color = f.fontColor, p.style.marginLeft = "0.5rem", 
                                p.innerHTML = f.name, p.onclick = this.pressButton.bind(this), v.className = "winrate", 
                                v.innerHTML = m, this.grid.appendChild(p), this.grid.appendChild(v);
                            }
                        }
                    }
                } catch (t) {
                    h = !0, d = t;
                } finally {
                    try {
                        !l && u.return && u.return();
                    } finally {
                        if (h) throw d;
                    }
                }
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayP.innerHTML = this.overlayText, 
            this.overlayDiv.style.display = "block", this.overlay = !0);
        }
    } ]), t;
}(), t0 = performance.now(), DATABASE, MOBILE = !1, powerWindow, decksWindow, tableWindow, ladderWindow, infoWindow, ui;

window.onload = function() {
    window.innerWidth <= 756 && (MOBILE = !0, console.log("mobile")), (ui = new UI()).showLoader(), 
    setupFirebase();
};

var Table = function() {
    function t(e, i, r, a, s) {
        _classCallCheck(this, t), this.DATA = e, this.f = i, this.t = r, this.r = a, this.window = s, 
        this.sortBy = "", this.numArch = this.window.top, this.bgColor = "transparent", 
        this.fontColor = "#22222", this.subplotRatio = .6, this.overallString = '<b style="font-size:130%">Overall</b>', 
        this.minGames = 20, this.whiteTile = .50000001, this.blackTile = .51, this.colorScale = [ [ 0, "#a04608" ], [ .3, "#d65900" ], [ .5, "#FFFFFF" ], [ .7, "#00a2bc" ], [ 1, "#055c7a" ] ], 
        this.currentColorScale = 0, this.colorScale2 = [ [ 0, "#a04608" ], [ .3, "#d65900" ], [ .5, "#FFFFFF" ], [ .7, "#279e27" ], [ 1, "#28733d" ] ], 
        this.colorScale2 = [ [ 0, "#000" ], [ .3, "#222" ], [ .5, "#FFFFFF" ], [ .7, "#888" ], [ 1, "#999" ] ], 
        this.colorThemes = [ this.colorScale, this.colorScale2 ], this.table = [], this.textTable = [], 
        this.frequency = [], this.archetypes = [], this.classPlusArch = [], this.winrates = [], 
        this.totGames = 0, this.download = "";
        var o = e.frequency.slice(), n = e.table.slice(), l = e.archetypes.slice();
        this.numArch > l.length && (this.numArch = l.length);
        var h = range(0, o.length);
        h.sort(function(t, e) {
            return o[t] > o[e] ? -1 : o[t] < o[e] ? 1 : 0;
        });
        for (C = 0; C < this.numArch; C++) this.table.push(fillRange(0, this.numArch, 0)), 
        this.textTable.push(fillRange(0, this.numArch, ""));
        for (C = 0; C < this.numArch; C++) {
            var d = h[C];
            this.frequency.push(o[d]), this.archetypes.push(l[d][1] + " " + l[d][0]), this.classPlusArch.push(l[d][0] + l[d][1]);
            for (x = C; x < this.numArch; x++) {
                var c = h[x], u = 0, y = 0, f = 0, m = n[d][c][0], v = n[d][c][1];
                m + v > 0 && (y = m / (m + v));
                var p = n[c][d][1], b = n[c][d][0];
                p + b > 0 && (f = p / (p + b));
                var k = m + p + v + b;
                C == x ? (y = .5, f = .5, u = .5) : u = k < this.minGames ? .5 : m + v > 0 && p + b > 0 ? (y + f) / 2 : m + v == 0 ? f : y;
                var w = l[d][1] + " " + l[d][0], g = l[c][1] + " " + l[c][0];
                this.table[x][C] = 1 - u, this.table[C][x] = u, this.totGames += k, k >= this.minGames ? (this.textTable[C][x] = w + "<br><b>vs:</b> " + g + "<br><b>wr:</b>  " + (100 * u).toFixed(1) + "%  (" + k + ")", 
                this.textTable[x][C] = g + "<br><b>vs:</b> " + w + "<br><b>wr:</b>  " + (100 * (1 - u)).toFixed(1) + "%  (" + k + ")") : (this.textTable[C][x] = w + "<br><b>vs:</b> " + g + "<br><b>wr:</b>  Not enough games", 
                this.textTable[x][C] = g + "<br><b>vs:</b> " + w + "<br><b>wr:</b>  Not enough games");
            }
        }
        for (var T = 0, C = 0; C < this.numArch; C++) T += this.frequency[C];
        0 == T && (T = 1, console.log("freqSum = 0"));
        for (C = 0; C < this.numArch; C++) {
            for (var u = 0, x = 0; x < this.numArch; x++) u += this.table[C][x] * this.frequency[x];
            this.winrates.push(u / T);
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
            for (var t = this.frequency.slice(), i = 0, r = [], a = 0; a < t.length; a++) i += t[a];
            for (a = 0; a < t.length; a++) t[a] = t[a] / i, r.push("FR: " + (100 * t[a]).toFixed(1) + "%");
            this.freqPlotData = {
                x: [ this.archetypes ],
                y: [ t ],
                text: [ r ],
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
            for (var t = this.winrates, e = this.table.concat([ t ]), i = this.archetypes.concat([ this.overallString ]), r = [], a = 0; a < e[0].length; a++) r.push(this.archetypes[a] + "<br>Overall wr: " + (100 * t[a]).toFixed(1) + "%");
            var s = this.textTable.concat([ r ]), o = [ {
                type: "heatmap",
                z: e,
                x: this.archetypes,
                y: i,
                text: s,
                hoverinfo: "text",
                colorscale: this.colorScale,
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
            this.window.annotated && o.push(this.getAnnotations()), Plotly.newPlot("chart2", o, this.layout, {
                displayModeBar: !1
            }), PREMIUM && document.getElementById("chart2").on("plotly_click", this.zoomToggle.bind(this)), 
            this.window.zoomIn && this.zoomIn(this.window.zoomArch), document.getElementById("loader").style.display = "none", 
            this.window.nrGames = this.totGames, this.window.setTotGames();
        }
    }, {
        key: "switchColorScale",
        value: function() {
            var t;
            0 == this.currentColorScale ? (t = {
                colorscale: this.colorScale2
            }, this.currentColorScale = 1) : (t = {
                colorscale: this.colorScale
            }, this.currentColorScale = 0), Plotly.update("chart2", t, [ 0 ]);
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
                for (var i = [], r = 0; r < e.length; r++) i.push("WR: " + (100 * e[r]).toFixed(1) + "%"), 
                e[r] -= .5;
                var a = {
                    type: "bar",
                    x: [ this.archetypes ],
                    y: [ e ],
                    text: [ i ],
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
            if (t == this.overallString && (e = this.numArch), -1 != e) {
                var i = {
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
                Plotly.relayout("chart2", i), this.subPlotFR(), this.subPlotWR(e);
                var r = document.querySelector("#tableWindow #matchup");
                document.querySelector("#tableWindow #winrate");
                r.style.display = "inline-block", t == this.overallString && (r.style.display = "none"), 
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
            var e = document.querySelector("#tableWindow #matchup"), i = document.querySelector("#tableWindow #winrate");
            e.style.display = "none", i.style.display = "inline-block", this.window.zoomIn = !1;
        }
    }, {
        key: "sortTableBy",
        value: function(t) {
            var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], i = this;
            if (this.sortBy != t || this.window.zoomIn) {
                var r = range(0, this.numArch), a = this.archetypes.indexOf(this.window.zoomArch);
                "winrate" == t && r.sort(function(t, e) {
                    return i.winrates[t] > i.winrates[e] ? -1 : i.winrates[t] < i.winrates[e] ? 1 : 0;
                }), "matchup" == t && r.sort(function(t, e) {
                    return i.table[a][t] > i.table[a][e] ? -1 : i.table[a][t] < i.table[a][e] ? 1 : 0;
                }), "frequency" == t && r.sort(function(t, e) {
                    return i.frequency[t] > i.frequency[e] ? -1 : i.frequency[t] < i.frequency[e] ? 1 : 0;
                }), "class" == t && r.sort(function(t, e) {
                    return i.classPlusArch[t] < i.classPlusArch[e] ? -1 : i.classPlusArch[t] > i.classPlusArch[e] ? 1 : 0;
                });
                for (var s = [], o = [], n = [], l = [], h = [], d = [], c = 0; c < i.numArch; c++) {
                    var u = r[c];
                    d.push(i.classPlusArch[u]), n.push(i.archetypes[u]), l.push(i.frequency[u]), h.push(i.winrates[u]);
                    for (var y = [], f = [], m = 0; m < i.numArch; m++) y.push(i.table[u][r[m]]), f.push(i.textTable[u][r[m]]);
                    s.push(y), o.push(f);
                }
                this.table = s, this.textTable = o, this.archetypes = n, this.classPlusArch = d, 
                this.frequency = l, this.winrates = h, this.sortBy = t, this.window.sortBy = t, 
                this.getFreqPlotData(), this.window.renderOptions(), e && this.plot();
            } else console.log("already sorted by " + t);
        }
    }, {
        key: "downloadCSV",
        value: function() {
            this.download = " %2C";
            for (e = 0; e < this.numArch; e++) this.download += this.archetypes[e] + "%2C";
            this.download += "%0A";
            for (e = 0; e < this.numArch; e++) {
                this.download += this.archetypes[e] + "%2C";
                for (var t = 0; t < this.numArch; t++) this.download += this.table[e][t] + "%2C";
                this.download += "%0A";
            }
            this.download += "Overall%2C";
            for (var e = 0; e < this.numArch; e++) this.download += this.winrates[e] + "%2C";
            var i = document.createElement("a");
            i.setAttribute("href", "data:text/plain;charset=utf-8," + this.download), i.setAttribute("download", "matchupTable.csv"), 
            i.style.display = "none", document.body.appendChild(i), i.click(), document.body.removeChild(i);
        }
    }, {
        key: "getAnnotations",
        value: function() {
            for (var t = ui.width >= 900 ? 1 : 0, e = {
                x: [],
                y: [],
                mode: "text",
                text: [],
                font: {
                    color: "black",
                    size: 8
                },
                hoverinfo: "none"
            }, i = 0; i < this.numArch; i++) {
                e.x.push(this.archetypes[i]), e.y.push(this.overallString), e.text.push((100 * this.winrates[i]).toFixed(t) + "%");
                for (var r = 0; r < this.numArch; r++) e.x.push(this.archetypes[i]), e.y.push(this.archetypes[r]), 
                e.text.push((100 * this.table[r][i]).toFixed(t) + "%");
            }
            return e;
        }
    }, {
        key: "updateColorTheme",
        value: function(t) {
            console.log("updateColorTheme class");
            var e = {
                colorscale: this.colorScale,
                showscale: !1
            };
            Plotly.restyle("chart2", e);
        }
    } ]), t;
}(), TableWindow = function() {
    function t(e, i, r, a) {
        _classCallCheck(this, t), this.firebasePath = PREMIUM ? "premiumData/tableData" : "data/tableData", 
        this.window = document.querySelector("#ladderWindow"), this.optionButtons = document.querySelectorAll("#tableWindow .optionBtn"), 
        this.questionBtn = document.querySelector("#tableWindow .question"), this.overlayDiv = document.querySelector("#tableWindow .overlay"), 
        this.overlayP = document.querySelector("#tableWindow .overlayText"), this.nrGamesP = document.querySelector("#tableWindow .nrGames"), 
        this.nrGamesBtn = document.querySelector("#tableWindow .content-header #nrGames"), 
        this.data = {}, this.hsFormats = e, this.hsTimes = i, this.ranks = r, this.sortOptions = a, 
        this.top = 16, this.annotated = !1, this.nrGames = 0, this.colorTheme = 0, this.overlayText = "\n            Here you can see how your deck on the left hand side performs against any other deck on the top. \n            The colors range  from favorable <span class='blue'>blue</span> to unfavorable <span class='red'>red</span>.<br><br>\n            The matchup table lists the top " + this.top + " most frequent decks within the selected time and rank brackets.<br><br>\n            The hover info lists the number of games recorded for that specific matchup in the (parenthesis).<br><br>\n            The 'Overall' line at the bottom shows the overall winrate of the opposing decks in the specified time and rank bracket.<br><br>\n            Sorting the table displays the most frequent/ highest winrate deck in the top left. Changing the format, time or rank brackets automatically sorts the table.<br><br>\n            <img src='Images/muSort.png'></img>\n            \n            <br><br><br><br>\n            Click on a matchup to 'zoom in'. Click again to 'zoom out'.<br><br>\n            In the zoomed in view you see only one deck on the left side.<br><br>\n            Additionally there are 2 subplots displaying the frequency of the opposing decks (brown line chart) and the specific matchup as black bar charts.<br><br>\n            Changing any parameter (Format, time, rank, sorting) keeps you zoomed into the same archetype if possible.<br><br>\n            You can additionally sort 'by Matchup' while zoomed in.<br><br>\n        ", 
        this.width = document.querySelector(".main-wrapper").offsetWidth - 40, this.height = .94 * document.querySelector("#ladderWindow .content").offsetHeight, 
        this.f = this.hsFormats[0], this.t = "last2Weeks", this.r = this.ranks[0], this.sortBy = this.sortOptions[0], 
        PREMIUM && (this.zoomIn = !1, this.zoomArch = null), this.fullyLoaded = !1, this.overlay = !1, 
        this.minGames = 1e3;
        var s = !0, o = !1, n = void 0;
        try {
            for (var l, h = this.hsFormats[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                var d = l.value;
                this.data[d] = {};
                var c = !0, u = !1, y = void 0;
                try {
                    for (var f, m = this.hsTimes[Symbol.iterator](); !(c = (f = m.next()).done); c = !0) {
                        var v = f.value;
                        this.data[d][v] = {};
                        var p = !0, b = !1, k = void 0;
                        try {
                            for (var w, g = this.ranks[Symbol.iterator](); !(p = (w = g.next()).done); p = !0) {
                                var T = w.value;
                                this.data[d][v][T] = null;
                            }
                        } catch (t) {
                            b = !0, k = t;
                        } finally {
                            try {
                                !p && g.return && g.return();
                            } finally {
                                if (b) throw k;
                            }
                        }
                    }
                } catch (t) {
                    u = !0, y = t;
                } finally {
                    try {
                        !c && m.return && m.return();
                    } finally {
                        if (u) throw y;
                    }
                }
            }
        } catch (t) {
            o = !0, n = t;
        } finally {
            try {
                !s && h.return && h.return();
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
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.hsFormats[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                    var s = r.value;
                    (x = document.createElement("button")).innerHTML = btnIdToText[s], x.id = s, x.className = "folderBtn optionBtn";
                    L = function(t) {
                        this.f = t.target.id, this.plot(), this.renderOptions();
                    };
                    x.onclick = L.bind(this), document.querySelector("#tableWindow .content-header #formatFolder .dropdown").appendChild(x);
                }
            } catch (t) {
                e = !0, i = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw i;
                }
            }
            document.querySelector("#tableWindow .content-header #timeFolder .dropdown").innerHTML = "";
            var o = !0, n = !1, l = void 0;
            try {
                for (var h, d = this.hsTimes[Symbol.iterator](); !(o = (h = d.next()).done); o = !0) {
                    var c = h.value;
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
                    !o && d.return && d.return();
                } finally {
                    if (n) throw l;
                }
            }
            document.querySelector("#tableWindow .content-header #rankFolder .dropdown").innerHTML = "";
            var u = !0, y = !1, f = void 0;
            try {
                for (var m, v = this.ranks[Symbol.iterator](); !(u = (m = v.next()).done); u = !0) {
                    var p = m.value;
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
                    !u && v.return && v.return();
                } finally {
                    if (y) throw f;
                }
            }
            document.querySelector("#tableWindow .content-header #sortFolder .dropdown").innerHTML = "";
            var b = !0, k = !1, w = void 0;
            try {
                for (var g, T = this.sortOptions[Symbol.iterator](); !(b = (g = T.next()).done); b = !0) {
                    var C = g.value, x = document.createElement("button");
                    x.innerHTML = btnIdToText[C], x.id = C, x.className = "folderBtn optionBtn";
                    var L = function(t) {
                        this.sortBy = t.target.id, this.data[this.f][this.t][this.r].sortTableBy(this.sortBy), 
                        this.renderOptions();
                    };
                    x.onclick = L.bind(this), document.querySelector("#tableWindow .content-header #sortFolder .dropdown").appendChild(x);
                }
            } catch (t) {
                k = !0, w = t;
            } finally {
                try {
                    !b && T.return && T.return();
                } finally {
                    if (k) throw w;
                }
            }
            if (this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this)), 
            this.nrGamesBtn.onclick = this.annotate.bind(this), PREMIUM) {
                document.querySelector("#tableWindow .downloadTable").addEventListener("click", function() {
                    this.data[this.f][this.t][this.r].downloadCSV();
                }.bind(this));
            }
        }
    }, {
        key: "plot",
        value: function() {
            this.fullyLoaded && this.data[this.f][this.t][this.r].plot();
        }
    }, {
        key: "annotate",
        value: function() {
            this.annotated ? this.nrGamesBtn.classList.remove("highlighted") : this.nrGamesBtn.classList.add("highlighted"), 
            this.annotated = !this.annotated, this.plot();
        }
    }, {
        key: "setTotGames",
        value: function() {
            this.nrGamesP.innerHTML = this.nrGames.toLocaleString() + " games";
        }
    }, {
        key: "renderOptions",
        value: function() {
            document.querySelector("#tableWindow #formatBtn").innerHTML = MOBILE ? btnIdToText_m[this.f] : btnIdToText[this.f], 
            document.querySelector("#tableWindow #timeBtn").innerHTML = MOBILE ? btnIdToText_m[this.t] : btnIdToText[this.t], 
            document.querySelector("#tableWindow #ranksBtn").innerHTML = MOBILE ? btnIdToText_m[this.r] : btnIdToText[this.r], 
            document.querySelector("#tableWindow #sortBtn").innerHTML = MOBILE ? btnIdToText_m[this.sortBy] : btnIdToText[this.sortBy];
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.hsTimes[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                    var s = r.value;
                    this.data[this.f][s].ranks_all.totGames < this.minGames && (document.querySelector("#tableWindow .content-header #timeFolder #" + s).style.display = "none");
                }
            } catch (t) {
                e = !0, i = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw i;
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
                var e = t.val(), i = !0, r = !1, a = void 0;
                try {
                    for (var s, o = this.hsFormats[Symbol.iterator](); !(i = (s = o.next()).done); i = !0) {
                        var n = s.value, l = !0, h = !1, d = void 0;
                        try {
                            for (var c, u = this.hsTimes[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                                var y = c.value, f = !0, m = !1, v = void 0;
                                try {
                                    for (var p, b = this.ranks[Symbol.iterator](); !(f = (p = b.next()).done); f = !0) {
                                        var k = p.value;
                                        this.data[n][y][k] = new Table(e[n][y][k], n, y, k, this);
                                    }
                                } catch (t) {
                                    m = !0, v = t;
                                } finally {
                                    try {
                                        !f && b.return && b.return();
                                    } finally {
                                        if (m) throw v;
                                    }
                                }
                            }
                        } catch (t) {
                            h = !0, d = t;
                        } finally {
                            try {
                                !l && u.return && u.return();
                            } finally {
                                if (h) throw d;
                            }
                        }
                    }
                } catch (t) {
                    r = !0, a = t;
                } finally {
                    try {
                        !i && o.return && o.return();
                    } finally {
                        if (r) throw a;
                    }
                }
                this.fullyLoaded = !0, console.log("table loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                this.renderOptions(), finishedLoading();
            }
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayP.innerHTML = this.overlayText, 
            this.overlayDiv.style.display = "block", this.overlay = !0);
        }
    }, {
        key: "switchColorScale",
        value: function() {
            this.data[this.f][this.t][this.r].switchColorScale();
        }
    }, {
        key: "updateColorTheme",
        value: function() {
            this.data[this.f][this.t][this.r].updateColorTheme(this.colorTheme), console.log("updateColorTheme");
        }
    } ]), t;
}(), UI = function() {
    function t() {
        _classCallCheck(this, t), this.tabs = document.querySelectorAll("button.tab"), this.mobileBtns = document.querySelectorAll("button.mobileBtn"), 
        this.windows = document.querySelectorAll(".tabWindow"), this.folderButtons = document.querySelectorAll(".folder-toggle"), 
        this.loader = document.getElementById("loader"), this.logo = document.querySelector("#vsLogoDiv"), 
        this.refresh = document.querySelector(".refreshArrow"), this.overlayText = document.querySelector("#overlay .overlayText"), 
        this.infoWindow = document.querySelector("#infoWindow .content .infoText"), this.getWindowSize(), 
        this.tabIdx = 0, this.activeTab = this.tabs[0], this.activeWindow = document.querySelector("#ladderWindow"), 
        this.openFolder = null, this.overlay = !1, this.loggedIn = !1;
        var e = !0, i = !1, r = void 0;
        try {
            for (var a, s = this.tabs[Symbol.iterator](); !(e = (a = s.next()).done); e = !0) a.value.addEventListener("click", this.toggleTabs.bind(this));
        } catch (t) {
            i = !0, r = t;
        } finally {
            try {
                !e && s.return && s.return();
            } finally {
                if (i) throw r;
            }
        }
        var o = !0, n = !1, l = void 0;
        try {
            for (var h, d = this.folderButtons[Symbol.iterator](); !(o = (h = d.next()).done); o = !0) h.value.addEventListener("click", this.toggleDropDown.bind(this));
        } catch (t) {
            n = !0, l = t;
        } finally {
            try {
                !o && d.return && d.return();
            } finally {
                if (n) throw l;
            }
        }
        if (MOBILE) {
            var c = !0, u = !1, y = void 0;
            try {
                for (var f, m = this.mobileBtns[Symbol.iterator](); !(c = (f = m.next()).done); c = !0) f.value.addEventListener("click", this.mobileMenu.bind(this));
            } catch (t) {
                u = !0, y = t;
            } finally {
                try {
                    !c && m.return && m.return();
                } finally {
                    if (u) throw y;
                }
            }
            detectswipe(".navbar", this.swipeTab.bind(this)), document.querySelector("#ladderWindow .content-header .nrGames").style.display = "none", 
            this.hideLoader();
        }
        this.logo.addEventListener("click", this.toggleOverlay.bind(this)), document.querySelector("#overlay").addEventListener("click", this.toggleOverlay.bind(this)), 
        this.refresh.addEventListener("click", reloadApp), window.addEventListener("orientationchange", this.getWindowSize.bind(this)), 
        window.addEventListener("resize", this.getWindowSize.bind(this)), this.infoWindow.innerHTML = infoWindowText, 
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
            for (var e = t.target.nextElementSibling, i = 0; null != e && !(e.classList.contains("dropdown") || i > 10); ) i += 1, 
            e = e.nextElementSibling;
            null != e && (e == this.openFolder ? this.openFolder = null : null != this.openFolder && (this.openFolder.classList.toggle("hidden"), 
            this.openFolder = e), e.classList.toggle("hidden"));
        }
    }, {
        key: "mobileMenu",
        value: function(t) {
            console.log("mobile menu");
            var e = t.target, i = !0, r = !1, a = void 0;
            try {
                for (var s, o = this.tabs[Symbol.iterator](); !(i = (s = o.next()).done); i = !0) {
                    var n = s.value;
                    n.id == e.id && (this.activeTab = n, this.activeWindow = document.getElementById(n.id + "Window"), 
                    this.renderTabs(), this.renderWindows());
                }
            } catch (t) {
                r = !0, a = t;
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (r) throw a;
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
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.tabs[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                    var s = r.value;
                    s != this.activeTab ? s.classList.remove("highlighted") : s.classList.add("highlighted"), 
                    MOBILE && s.classList.contains("highlighted") && (s.style.display = "inline"), MOBILE && !s.classList.contains("highlighted") && (s.style.display = "none");
                }
            } catch (t) {
                e = !0, i = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw i;
                }
            }
        }
    }, {
        key: "renderWindows",
        value: function() {
            console.log("active window", this.activeWindow.id), "decksWindow" != this.activeWindow.id || decksWindow.fullyLoaded || decksWindow.loadData();
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.windows[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                    var s = r.value;
                    s != this.activeWindow ? s.style.display = "none" : s.style.display = "inline-block";
                }
            } catch (t) {
                e = !0, i = t;
            } finally {
                try {
                    !t && a.return && a.return();
                } finally {
                    if (e) throw i;
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
            this.overlayText.innerHTML = PREMIUM ? overlayText2 : overlayText1, this.overlay ? (document.getElementById("overlay").style.display = "none", 
            this.overlay = !1) : (document.getElementById("overlay").style.display = "block", 
            this.overlay = !0);
        }
    } ]), t;
}(), overlayText1 = "\n\n<span style='font-size:200%;font-weight:bold;padding-left:2rem;'>Greetings Travelers,</span><br><br><br>\n\nWelcome to the VS Live web app where you can explore the newest Hearthstone data and find \n\nout about frequency and win rates of your favorite decks.<br><br>\n\nTo get more information on the current tab simply click on the \n\n    <div class='fa fa-question-circle' style='display:inline-block'></div>\n\nicon in the top right corner.<br><br>\n\nUpgrade to vS Gold to visit the gold version of this app. Check the link more information:<br><br><br>\n\n<button id='basicBtn'>BASIC</button>\n<img src='Images/arrow.png' class='arrow'>\n<a href=" + VSGOLDINFOLINK + " target=\"_blank\">\n<button id='premiumBtn'>GOLD</button>\n</a>\n\n<br><br>\n\nTo give feedback simply click on the discord link below:<br><br><br>\n\n<a href=" + DISCORDLINK + '\n   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n\n', overlayText2 = "\n\n<span style='font-size:200%;font-weight:bold;padding-left:2rem'>Greetings Travelers,</span><br><br><br>\n\nWelcome to the VS Live web app where you can explore the newest Hearthstone data and find \n\nout about frequency and win rates of your favorite decks.<br><br>\n\nTo get more information on the current tab simply click on the \n\n    <div class='fa fa-question-circle' style='display:inline-block'></div>\n\nicon in the top right corner.<br><br>\n\nThank you for using vS Live Gold.\n\n<br><br>\n\nTo give feedback simply click on the discord link below:<br><br><br>\n\n<a href=" + DISCORDLINK + '\n   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n\n', infoWindowText = "\n\nGreetings and thank you for checking out the VS Live Beta!<br><br>\n\n   To give feedback simply click on the discord link below:<br><br>\n   \n<a href=" + DISCORDLINK + '\n   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n';