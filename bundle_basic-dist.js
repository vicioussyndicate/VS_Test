"use strict";

function _defineProperty(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}

function tier_classifier(t) {
    return t < .47 ? 4 : t < .5 ? 3 : t < .52 ? 2 : 1;
}

function choice(t) {
    return t[Math.floor(Math.random() * t.length)];
}

function randint(t, e) {
    return t = Math.ceil(t), e = Math.floor(e), Math.floor(Math.random() * (e - t)) + t;
}

function range(t, e) {
    for (var a = [], i = t; i < e; i++) a.push(i);
    return a;
}

function fillRange(t, e, a) {
    for (var i = [], r = t; r < e; r++) i.push(a);
    return i;
}

function shuffle(t) {
    for (var e, a, i = t.length; 0 !== i; ) a = Math.floor(Math.random() * i), e = t[i -= 1], 
    t[i] = t[a], t[a] = e;
    return t;
}

function normalize(t) {
    var e = 0, a = !0, i = !1, r = void 0;
    try {
        for (var s, n = t[Symbol.iterator](); !(a = (s = n.next()).done); a = !0) {
            var o = s.value;
            e += Math.abs(o);
        }
    } catch (t) {
        i = !0, r = t;
    } finally {
        try {
            !a && n.return && n.return();
        } finally {
            if (i) throw r;
        }
    }
    if (1 == e || 0 == e) return t;
    for (var l = 0; l < t.length; l++) t[l] /= e;
    return t;
}

function matrixXvector(t, e) {
    for (var a = [], i = normalize(e), r = 0; r < e.length; r++) {
        for (var s = 0, n = 0; n < e.length; n++) s += i[n] * t[r][n];
        a.push(s);
    }
    return a;
}

function detectswipe(t, e) {
    var a = {};
    a.sX = 0, a.sY = 0, a.eX = 0, a.eY = 0;
    var i = "", r = document.querySelector(t);
    r.addEventListener("touchstart", function(t) {
        var e = t.touches[0];
        a.sX = e.screenX, a.sY = e.screenY;
    }, !1), r.addEventListener("touchmove", function(t) {
        t.preventDefault();
        var e = t.touches[0];
        a.eX = e.screenX, a.eY = e.screenY;
    }, !1), r.addEventListener("touchend", function(r) {
        (a.eX - 30 > a.sX || a.eX + 30 < a.sX) && a.eY < a.sY + 60 && a.sY > a.eY - 60 && a.eX > 0 ? i = a.eX > a.sX ? "r" : "l" : (a.eY - 50 > a.sY || a.eY + 50 < a.sY) && a.eX < a.sX + 30 && a.sX > a.eX - 30 && a.eY > 0 && (i = a.eY > a.sY ? "d" : "u"), 
        "" != i && "function" == typeof e && e(t, i), i = "", a.sX = 0, a.sY = 0, a.eX = 0, 
        a.eY = 0;
    }, !1);
}

function myfunction(t, e) {
    alert("you swiped on element with id '" + t + "' to " + e + " direction");
}

var app, _createClass = function() {
    function t(t, e) {
        for (var a = 0; a < e.length; a++) {
            var i = e[a];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), 
            Object.defineProperty(t, i.key, i);
        }
    }
    return function(e, a, i) {
        return a && t(e.prototype, a), i && t(e, i), e;
    };
}(), App = function() {
    function t() {
        _classCallCheck(this, t), this.ui = new UI(), this.ui.showLoader(), this.path = {
            window: null,
            hsFormat: "Standard",
            windowIdx: 0,
            mode: "",
            ranks: "all",
            time: "last2Weeks",
            arch: null
        }, this.fb_db = null, this.fb_loggedIn = !1, this.phase = 0, this.setupFirebase();
    }
    return _createClass(t, [ {
        key: "setupFirebase",
        value: function() {
            var t = this;
            this.fb_config = {
                apiKey: "AIzaSyAt0uIAVOFjB42_bkwrEIqhSWkMT_VmluI",
                authDomain: "data-reaper.firebaseapp.com",
                databaseURL: "https://data-reaper.firebaseio.com",
                projectId: "data-reaper",
                storageBucket: "data-reaper.appspot.com",
                messagingSenderId: "1079276848174"
            }, firebase.apps.length || (firebase.initializeApp(this.fb_config), this.fb_db = firebase.database());
            firebase.auth().signInWithEmailAndPassword(login.email, login.pw).then(function(e) {
                if (!t.ui.loggedIn) if (e) {
                    t.ui.loggedIn = !0;
                    t.fb_db.ref("premiumUsers/" + e.uid).on("value", function(e) {
                        !e.val() && PREMIUM && console.log("PERMISSION ERROR", e.val()), t.load(0);
                    }, function(t) {
                        return console.log("Could not load User Data", t);
                    });
                } else console.log("not logged in"), t.ui.loggedIn = !0, t.load(0);
            });
        }
    }, {
        key: "load",
        value: function(t) {
            var e = function() {};
            switch (t) {
              case 0:
                e = function() {
                    app.load(1);
                }, this.ui.ladderWindow = new LadderWindow(e), this.ui.tableWindow = new TableWindow(e), 
                this.ui.infoWindow = new InfoWindow(e);
                break;

              case 1:
                if (!this.ui.tableWindow.fullyLoaded || !this.ui.ladderWindow.fullyLoaded) return;
                if (this.phase >= 2) return this.ui.updateTime(), void console.log("RELOAD");
                this.phase = 1, this.path.window = this.ui.ladderWindow, this.ui.display("ladderWindow"), 
                e = function() {
                    app.load(2);
                }, this.ui.powerWindow = new PowerWindow(e), this.ui.decksWindow = new DecksWindow(e);
                break;

              case 2:
                this.phase = 2, console.log("loaded");
            }
        }
    }, {
        key: "reload",
        value: function() {}
    } ]), t;
}(), PREMIUM = !1, login = {
    email: "freeUser@vs.com",
    pw: "eva8r_PM2#H-F?B&"
}, Decklist = function() {
    function t(e, a, i) {
        _classCallCheck(this, t), this.name = e.name, this.hsClass = a, this.window = i, 
        this.cards = [], this.cardNames = [], this.dust = 0, this.manaBin = fillRange(0, 11, 0), 
        this.showInfo = !1, this.div = document.createElement("div"), this.div.className = "deckBox", 
        this.div.id = e.name, this.deckTitle = document.createElement("div"), this.deckTitle.className = "deckTitle", 
        this.deckTitle.innerHTML = "<p>" + e.name + "</p>", this.deckTitle.style.backgroundColor = hsColors[this.hsClass], 
        this.deckTitle.style.color = hsFontColors[this.hsClass];
        var r = document.createElement("div");
        r.className = "titleHover", this.infoBtn = document.createElement("div"), this.infoBtn.className = "titleHover-content", 
        this.infoBtn.innerHTML = "info", this.infoBtn.style.float = "right", this.infoBtn.addEventListener("click", this.toggleInfo.bind(this)), 
        this.copyBtn = document.createElement("div"), this.copyBtn.className = "titleHover-content", 
        this.copyBtn.innerHTML = "copy", this.copyBtn.style.float = "left", this.copyBtn.id = "dl" + randint(0, 1e9), 
        r.appendChild(this.copyBtn), r.appendChild(this.infoBtn), this.deckTitle.appendChild(r), 
        new Clipboard("#" + this.copyBtn.id, {
            text: function(t) {
                return e.deckCode;
            }
        }), this.decklist = document.createElement("div"), this.decklist.className = "decklist", 
        this.decklist.id = e.name;
        var s = {
            Free: 0,
            Basic: 0,
            Common: 0,
            Rare: 0,
            Epic: 0,
            Legendary: 0
        }, n = !0, o = !1, l = void 0;
        try {
            for (var h, d = e.cards[Symbol.iterator](); !(n = (h = d.next()).done); n = !0) {
                var c = h.value;
                this.cardNames.push(c.name), s[c.rarity] += 1;
                var u = new CardDiv(c);
                u.hoverDiv.onmouseover = this.window.highlight.bind(this.window), u.hoverDiv.onmouseout = this.window.highlight.bind(this.window), 
                this.cards.push(u), this.dust += u.dust * u.quantity;
                var y = u.cost >= 10 ? 10 : u.cost;
                this.manaBin[y] += parseInt(u.quantity), this.decklist.appendChild(u.div);
            }
        } catch (t) {
            o = !0, l = t;
        } finally {
            try {
                !n && d.return && d.return();
            } finally {
                if (o) throw l;
            }
        }
        this.deckinfo = document.createElement("div"), this.deckinfo.className = "decklist deckinfo", 
        this.deckinfo.id = e.name;
        var f = document.createElement("p");
        f.innerHTML = "Manacurve", f.className = "manacurve", this.deckinfo.appendChild(f), 
        this.chart = document.createElement("div"), this.chartId = "chartId:" + randint(0, 1e8), 
        this.chart.id = this.chartId, this.chart.className = "manaChart", this.deckinfo.appendChild(this.chart);
        var p = document.createElement("div"), v = document.createElement("p");
        v.innerHTML = this.dust + "  ", v.className = "dustInfo";
        var m = document.createElement("img");
        m.src = "Images/dust.png", m.className = "dustImg";
        var b = document.createElement("p");
        b.innerHTML = "L: " + s.Legendary + " E: " + s.Epic + " \n                                R: " + s.Rare + " C: " + s.Common + " \n                                B: " + (s.Basic + s.Free), 
        b.className = "dustInfo", p.appendChild(v), p.appendChild(m), this.deckinfo.appendChild(p);
        var k = document.createElement("p");
        k.className = "cardtypes";
        var w = "";
        e.cardTypes.Minion >= 10 ? w += e.cardTypes.Minion + " Minions<br>" : 1 == e.cardTypes.Minion ? w += e.cardTypes.Minion + "  Minion<br>" : w += e.cardTypes.Minion + "  Minions<br>", 
        e.cardTypes.Spell >= 10 ? w += e.cardTypes.Spell + " Spells<br>" : 1 == e.cardTypes.Spell ? w += e.cardTypes.Spell + "  Spell<br>" : w += e.cardTypes.Spell + "  Spells<br>", 
        e.cardTypes.Weapon && (w += e.cardTypes.Weapon + "  Weapons<br>"), e.cardTypes.Hero && (w += e.cardTypes.Hero + "  Hero<br>"), 
        k.innerHTML = w, this.deckinfo.appendChild(k);
        var g = document.createElement("p");
        g.className = "author", g.innerHTML = "Author: " + e.author, this.deckinfo.appendChild(g);
        var x = document.createElement("p");
        if (x.className = "timestamp", x.innerHTML = "Updated " + e.timestamp, this.deckinfo.appendChild(x), 
        "" != e.gameplay) {
            var L = document.createElement("a");
            L.href = "https://www.reddit.com/r/ViciousSyndicate/comments/6yqj62/vs_live_web_app_feedback_thread/", 
            L.target = "_blank", L.className = "gameplay", L.innerHTML = "Gameplay", this.deckinfo.appendChild(L);
        }
        this.div.appendChild(this.deckTitle), this.div.appendChild(this.decklist), this.div.appendChild(this.deckinfo);
    }
    return _createClass(t, [ {
        key: "highlight",
        value: function(t) {
            var e = 0, a = !0, i = !1, r = void 0;
            try {
                for (var s, n = this.cards[Symbol.iterator](); !(a = (s = n.next()).done); a = !0) {
                    var o = s.value, l = 0;
                    o.name + "x1" == t && (l = 1, e = 1), o.name + "x2" == t && (l = 2, e = 2), 0 != l ? l == o.quantity ? o.div.classList.add("highlighted") : o.div.classList.add("half-highlighted") : (o.div.classList.remove("highlighted"), 
                    o.div.classList.remove("half-highlighted"));
                }
            } catch (t) {
                i = !0, r = t;
            } finally {
                try {
                    !a && n.return && n.return();
                } finally {
                    if (i) throw r;
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
            };
            Plotly.newPlot(this.chartId, [ t ], {
                margin: {
                    l: 15,
                    r: 10,
                    b: 25,
                    t: 0
                }
            }, {
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
    var a = document.createElement("div");
    a.className = "costContainer";
    var i = document.createElement("div");
    i.className = "hex " + this.rarity, i.innerHTML = "&#11042";
    var r = document.createElement("div");
    r.innerHTML = this.cost, r.className = "cost", this.cost >= 10 && (r.style.fontSize = "75%", 
    r.style.paddingLeft = "0.2rem");
    var s = document.createElement("div");
    s.innerHTML = this.name, s.className = "name";
    var n;
    this.quantity > 1 && ((n = document.createElement("div")).innerHTML = "x" + this.quantity, 
    n.className = "quantity"), a.appendChild(i), a.appendChild(r), this.div.appendChild(a), 
    this.div.appendChild(s), this.quantity > 1 && this.div.appendChild(n), this.div.appendChild(this.hoverDiv);
}, Sidebar = function() {
    function t(e, a, i) {
        _classCallCheck(this, t), this.div = e, this.titleDiv = document.createElement("div"), 
        this.titleDiv.className = "title", this.setTitle(a), this.div.appendChild(this.titleDiv), 
        this.archBtnsDiv = document.createElement("div"), this.archBtnsDiv.className = "archBtnList", 
        this.div.appendChild(this.archBtnsDiv), this.archList = [], this.archBtns = [], 
        this.hidden = !1;
    }
    return _createClass(t, [ {
        key: "setTitle",
        value: function(t) {
            this.titleDiv.innerHTML = t;
        }
    }, {
        key: "loadClass",
        value: function(t) {
            this.removeBtn(), this.archetypes = t.archetypes;
            var e = !0, a = !1, i = void 0;
            try {
                for (var r, s = this.archetypes[Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
                    var n = r.value;
                    this.addArchBtn(n);
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !e && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
        }
    }, {
        key: "addArchBtn",
        value: function(t) {
            if (void 0 != t) {
                var e = document.createElement("div");
                e.className = "archBtnWrapper", e.id = t.name;
                var a = document.createElement("div");
                a.id = t.name, a.className = "archBtn", a.style.color = hsFontColors[t.hsClass], 
                a.style.backgroundColor = hsColors[t.hsClass], a.innerHTML = t.name;
                var i = this;
                a.addEventListener("click", function(e) {
                    i.highlight(t.name), app.ui.decksWindow.buttonTrigger(e);
                }.bind(app.ui.decksWindow)), e.appendChild(a);
                var r = document.createElement("div");
                r.className = "wrDiv", r.innerHTML = "Tier " + tier_classifier(t.wr), e.appendChild(r), 
                this.archBtns.push(e), this.archBtnsDiv.appendChild(e);
            }
        }
    }, {
        key: "highlight",
        value: function(t) {
            var e = !0, a = !1, i = void 0;
            try {
                for (var r, s = this.archBtns[Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
                    var n = r.value;
                    n.id != t || n.classList.contains("highlighted") ? n.classList.remove("highlighted") : n.classList.add("highlighted");
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !e && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
        }
    }, {
        key: "removeBtn",
        value: function() {
            for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, e = 0; e < this.archBtns.length; e++) {
                var a = this.archList[e], i = this.archBtns[e];
                if (null == t) return this.archBtnsDiv.innerHTML = "", void (this.archList = []);
                if (a.name == t) return this.archList.del(a), void this.archBtnsDiv.removeChild(i);
            }
        }
    }, {
        key: "hide",
        value: function() {
            this.hidden || (this.div.classList.add("hidden"), this.hidden = !1);
        }
    }, {
        key: "show",
        value: function() {
            this.div.classList.remove("hidden"), this.hidden = !0;
        }
    } ]), t;
}(), ArchBtn = function t() {
    _classCallCheck(this, t), this.div = document.createElement("div");
}, DecksWindow = function() {
    function t(e) {
        _classCallCheck(this, t), this.hsFormats = hsFormats, this.div = document.querySelector("#decksWindow"), 
        this.tab = document.querySelector("#decks.tab"), this.chartDiv = document.querySelector("#decksWindow .content .chart"), 
        this.descriptionBox = document.querySelector("#decksWindow .content .descriptionBox"), 
        this.decksDiv = document.querySelector("#decksWindow .content .decklists"), this.description = document.querySelector("#decksWindow .content .descriptionBox .description"), 
        this.overlayDiv = document.querySelector("#decksWindow .overlay"), this.overlayP = document.querySelector("#decksWindow .overlayText"), 
        this.questionBtn = document.querySelector("#decksWindow .question"), this.subWindows = [ this.descriptionBox, this.decksDiv, this.chartDiv ];
        var a = document.querySelector("#decksWindow .content .sidebar.left"), i = document.querySelector("#decksWindow .content .sidebar.right1"), r = document.querySelector("#decksWindow .content .sidebar.right2");
        this.sidebarLeft = new Sidebar(a, "Archetypes"), this.sidebarRightTop = new Sidebar(i, "Best vs"), 
        this.sidebarRightBot = new Sidebar(r, "Worst vs"), this.overlayText = "\n            Select <span class='optionBtn'>Description</span> to see the latest report on that class.\n            Select <span class='optionBtn'>Deck Lists</span> to see the latest deck lists on that class.<br><br>\n            Select any archetype on the left side to see all the decklists of that archetype.<br><br>\n            Hover over the deck title to copy or get more information on that decklist.<br><br>\n            <img src='Images/clickOnDeckTitle.png'><br><br>\n            Tips:<br><br>\n            • When you hover over a card of a decklist it highlights all cards with the same name in the other decklists.<br><br>\n        ", 
        this.firebasePath = "deckData", this.archButtons = [], this.optionButtons = document.querySelectorAll("#decksWindow .optionBtn");
        var s = !0, n = !1, o = void 0;
        try {
            for (var l, h = this.optionButtons[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                l.value.addEventListener("click", this.buttonTrigger.bind(this));
            }
        } catch (t) {
            n = !0, o = t;
        } finally {
            try {
                !s && h.return && h.return();
            } finally {
                if (n) throw o;
            }
        }
        this.f = "Standard", this.hsClass = "Druid", this.hsArch = null, this.mode = "description", 
        this.deckWidth = "12rem", this.fullyLoaded = !0, this.overlay = !1, this.table_time = table_times[0], 
        this.table_rank = table_ranks[0], this.mu = {}, this.data = {}, this.decklists = [], 
        this.archetypes = {};
        var d = !0, c = !1, u = void 0;
        try {
            for (var y, f = this.hsFormats[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                var p = y.value;
                this.data[p] = {
                    fullyLoaded: !1
                }, this.archetypes[p] = [], this.mu[p] = {
                    table: {},
                    archNames: {},
                    fr: {},
                    wr: {},
                    fullyLoaded: !1
                };
                var v = !0, m = !1, b = void 0;
                try {
                    for (var k, w = hsClasses[Symbol.iterator](); !(v = (k = w.next()).done); v = !0) {
                        var g = k.value;
                        this.data[p][g] = {}, this.data[p][g].archetypes = [], this.data[p][g].text = "";
                    }
                } catch (t) {
                    m = !0, b = t;
                } finally {
                    try {
                        !v && w.return && w.return();
                    } finally {
                        if (m) throw b;
                    }
                }
            }
        } catch (t) {
            c = !0, u = t;
        } finally {
            try {
                !d && f.return && f.return();
            } finally {
                if (c) throw u;
            }
        }
        this.setupUI(), this.renderOptions(), this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), 
        this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this)), e.apply(this);
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            this.dropdownFolders = {
                format: document.querySelector("#decksWindow .content-header #formatFolder .dropdown"),
                class: document.querySelector("#decksWindow .content-header #classFolder .dropdown")
            };
            var t = function(t) {
                var e = t.toElement || t.relatedTarget;
                e.parentNode != this && e != this && this.classList.add("hidden");
            };
            for (var e in this.dropdownFolders) {
                this.dropdownFolders[e].onmouseout = t;
            }
        }
    }, {
        key: "plot",
        value: function() {
            if (!this.checkLoadData()) return this.checkLoadData(function(t) {
                app.ui.decksWindow.plot();
            });
            if (!this.data[this.f].fullyLoaded) return this.loadFormat(this.f);
            switch (this.mode) {
              case "overview":
                this.plotDustWr();
                break;

              case "decklists":
                this.loadDecklists();
                break;

              case "description":
                this.loadDescription();
            }
            this.renderOptions();
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (console.log("first display"), this.div.style.display = "inline-block", this.f = app.path.hsFormat, 
            this.plot()) : (app.path.hsFormat = this.f, this.div.style.display = "none");
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            "Standard" != e && "Wild" != e || (this.f = e, this.plot()), t.target.classList.contains("archBtn") && (this.hsArch = this.findArch(e), 
            void 0 != this.hsArch ? this.hsClass != this.hsArch.hsClass ? (this.hsClass = this.hsArch.hsClass, 
            this.loadClass(this.hsClass)) : this.loadDecklists() : console.log("ERROR: archbtn not found", t)), 
            -1 != hsClasses.indexOf(e) && (this.hsArch = null, this.loadClass(e)), "overview" == e && this.plotDustWr(), 
            "decklists" == e && this.loadDecklists(), "description" == e && this.loadDescription(), 
            this.renderWindows(), this.renderOptions();
        }
    }, {
        key: "renderWindows",
        value: function() {
            var t = !0, e = !1, a = void 0;
            try {
                for (var i, r = this.subWindows[Symbol.iterator](); !(t = (i = r.next()).done); t = !0) {
                    i.value.style.display = "none";
                }
            } catch (t) {
                e = !0, a = t;
            } finally {
                try {
                    !t && r.return && r.return();
                } finally {
                    if (e) throw a;
                }
            }
            switch (this.mode) {
              case "description":
                this.descriptionBox.style.display = "inline";
                break;

              case "decklists":
                this.decksDiv.style.display = "grid";
                break;

              case "overview":
                this.chartDiv.style.display = "inline-block";
            }
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, a = void 0;
            try {
                for (var i, r = this.optionButtons[Symbol.iterator](); !(t = (i = r.next()).done); t = !0) {
                    (d = i.value).classList.remove("highlighted"), d.id == this.mode && d.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, a = t;
            } finally {
                try {
                    !t && r.return && r.return();
                } finally {
                    if (e) throw a;
                }
            }
            var s = !0, n = !1, o = void 0;
            try {
                for (var l, h = this.archButtons[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                    var d;
                    (d = l.value).classList.remove("highlighted"), null != this.hsArch && d.id == this.hsArch.name && d.classList.add("highlighted");
                }
            } catch (t) {
                n = !0, o = t;
            } finally {
                try {
                    !s && h.return && h.return();
                } finally {
                    if (n) throw o;
                }
            }
            document.querySelector("#decksWindow #formatBtn").innerHTML = btnIdToText[this.f], 
            document.querySelector("#decksWindow #classBtn").innerHTML = this.hsClass;
        }
    }, {
        key: "checkLoadData",
        value: function(t) {
            var e = void 0 != t;
            if (console.log("checkLoadData", e, t), !app.ui.tableWindow.data[this.f].fullyLoaded) {
                console.log("check 1");
                return !!e && app.ui.tableWindow.loadData(this.f, function() {
                    app.ui.decksWindow.checkLoadData(t);
                });
            }
            if (app.ui.tableWindow.data[this.f].fullyLoaded && !this.mu[this.f].fullyLoaded && this.loadWinrate(), 
            !this.data[this.f].fullyLoaded) {
                console.log("check 2");
                return !!e && this.loadData(this.f, function() {
                    app.ui.decksWindow.checkLoadData(t);
                });
            }
            if (this.data[this.f].fullyLoaded && app.ui.tableWindow.data[this.f].fullyLoaded) return console.log("all checks clear"), 
            !e || t.apply(this);
        }
    }, {
        key: "loadWinrate",
        value: function() {
            var t = app.ui.tableWindow.data[this.f][this.table_time][this.table_rank];
            null != t ? (this.mu[this.f].table = t.table, this.mu[this.f].archNames = t.freqPlotData.x[0], 
            this.mu[this.f].fr = t.freqPlotData.y[0], this.mu[this.f].wr = t.winrates, this.mu[this.f].fullyLoaded = !0) : console.log("ERROR table undefined");
        }
    }, {
        key: "loadData",
        value: function(t, e) {
            this.fullyLoaded = !1;
            app.fb_db.ref(this.firebasePath + "/" + t).on("value", function(a) {
                this.readData(a, t, e);
            }.bind(this), function(t) {
                return console.log("Could not load Deck Data", t);
            });
        }
    }, {
        key: "readData",
        value: function(t, e, a) {
            if (!this.fullyLoaded) {
                var i = t.val(), r = e, s = !0, n = !1, o = void 0;
                try {
                    for (var l, h = hsClasses[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                        var d = l.value;
                        if (this.data[r][d].archetypes = [], this.data[r][d].text = i[d].text, "archetypes" in i[d]) for (var c in i[d].archetypes) {
                            var u = 0, y = 0, f = this.mu[r].archNames.indexOf(c);
                            f >= 0 && (u = this.mu[r].wr[f], y = this.mu[r].fr[f]);
                            var p = {
                                name: c,
                                hsClass: d,
                                hsFormat: r,
                                decklists: [],
                                wr: u,
                                fr: y
                            };
                            this.archetypes[r].push(p), this.data[r][d].archetypes.push(p);
                            var v = this.data[r][d].archetypes.length - 1, m = i[d].archetypes[c], b = Object.keys(m), k = !0, w = !1, g = void 0;
                            try {
                                for (var x, L = b[Symbol.iterator](); !(k = (x = L.next()).done); k = !0) {
                                    var C = x.value, T = new Decklist(m[C], d, this);
                                    this.data[r][d].archetypes[v].decklists.push(T);
                                }
                            } catch (t) {
                                w = !0, g = t;
                            } finally {
                                try {
                                    !k && L.return && L.return();
                                } finally {
                                    if (w) throw g;
                                }
                            }
                        }
                    }
                } catch (t) {
                    n = !0, o = t;
                } finally {
                    try {
                        !s && h.return && h.return();
                    } finally {
                        if (n) throw o;
                    }
                }
                this.fullyLoaded = !0, this.data[r].fullyLoaded = !0, console.log("decks loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                a.apply(this);
            }
        }
    }, {
        key: "deckLink",
        value: function(t) {
            if (this.mode = "decklists", this.f = app.path.hsFormat, this.div.style.display = "inline-block", 
            !this.checkLoadData()) {
                return this.checkLoadData(function(e) {
                    app.ui.decksWindow.deckLink(t);
                });
            }
            var e = void 0, a = void 0;
            if (this.hsArch = this.findArch(t), void 0 == this.hsArch) {
                var i = !0, r = !1, s = void 0;
                try {
                    for (var n, o = hsClasses[Symbol.iterator](); !(i = (n = o.next()).done); i = !0) {
                        var l = n.value;
                        if (-1 != t.indexOf(l)) {
                            this.hsClass = l;
                            break;
                        }
                    }
                } catch (t) {
                    r = !0, s = t;
                } finally {
                    try {
                        !i && o.return && o.return();
                    } finally {
                        if (r) throw s;
                    }
                }
                void 0 == this.hsClass && (this.hsClass = "Druid"), this.hsArch = this.data[this.f][this.hsClass].archetypes[0];
            }
            var h = !0, d = !1, c = void 0;
            try {
                for (var u, y = hsClasses[Symbol.iterator](); !(h = (u = y.next()).done); h = !0) {
                    var f = u.value;
                    -1 != t.indexOf(f) && (e = f);
                    var p = this.data[this.f][f].archetypes, v = !0, m = !1, b = void 0;
                    try {
                        for (var k, w = p[Symbol.iterator](); !(v = (k = w.next()).done); v = !0) {
                            var g = k.value;
                            if (g.name == t) {
                                e = f, a = g;
                                break;
                            }
                        }
                    } catch (t) {
                        m = !0, b = t;
                    } finally {
                        try {
                            !v && w.return && w.return();
                        } finally {
                            if (m) throw b;
                        }
                    }
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
            void 0 == e && (e = "Druid"), void 0 == a && (a = null, this.mode = "description"), 
            this.hsClass = e, this.hsArch = a, this.display(!0), this.renderOptions();
        }
    }, {
        key: "loadFormat",
        value: function(t) {
            if (this.f = t, !this.data[t].fullyLoaded) {
                return this.loadData(t, function() {
                    app.ui.decksWindow.loadFormat(t);
                });
            }
            this.loadClass(this.hsClass);
        }
    }, {
        key: "loadClass",
        value: function(t) {
            this.hsClass = t, "description" == this.mode && this.loadDescription(), "decklists" == this.mode && this.loadDecklists();
            var e = this.data[this.f][this.hsClass];
            this.sidebarLeft.loadClass(e), e.archetypes.length > 0 && null == this.hsArch && (this.hsArch = e.archetypes[0]), 
            this.sidebarLeft.highlight(this.hsArch.name);
        }
    }, {
        key: "loadDescription",
        value: function() {
            this.mode = "description", this.renderWindows();
            var t = this.data[this.f][this.hsClass];
            this.description.innerHTML = '<p class="title">' + this.hsClass + '</p><p class="text">' + t.text + "</p>";
        }
    }, {
        key: "loadDecklists",
        value: function() {
            if (this.mode = "decklists", this.renderWindows(), this.decklists = [], this.decksDiv.innerHTML = "", 
            null == this.hsArch && (this.hsArch = this.data[this.f][this.hsClass].archetypes[0]), 
            void 0 != this.hsArch) {
                var t = "", e = !0, a = !1, i = void 0;
                try {
                    for (var r, s = this.hsArch.decklists[Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
                        var n = r.value;
                        t += this.deckWidth + " ", this.decklists.push(n), this.decksDiv.appendChild(n.div);
                    }
                } catch (t) {
                    a = !0, i = t;
                } finally {
                    try {
                        !e && s.return && s.return();
                    } finally {
                        if (a) throw i;
                    }
                }
                this.decksDiv.style.gridTemplateColumns = t, this.loadDecklistsMatchups(this.hsArch);
            } else this.hsArch = null;
        }
    }, {
        key: "findArch",
        value: function(t) {
            var e = !0, a = !1, i = void 0;
            try {
                for (var r, s = hsClasses[Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
                    var n = r.value, o = !0, l = !1, h = void 0;
                    try {
                        for (var d, c = this.data[this.f][n].archetypes[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                            var u = d.value;
                            if (u.name == t) return u;
                        }
                    } catch (t) {
                        l = !0, h = t;
                    } finally {
                        try {
                            !o && c.return && c.return();
                        } finally {
                            if (l) throw h;
                        }
                    }
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !e && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
        }
    }, {
        key: "loadDecklistsMatchups",
        value: function(t) {
            var e = this.f, a = t.wr, i = 3, r = [], s = [];
            if (this.sidebarRightTop.removeBtn(), this.sidebarRightBot.removeBtn(), a > 0) {
                var n = this.mu[e].table, o = this.mu[e].archNames, l = o.indexOf(t.name);
                if (-1 == l) return t.wr = 0, void this.loadDecklistsMatchups(t);
                var h = n[l].slice();
                h.sort(), i = Math.min(i, h.length);
                var d = !0, c = !1, u = void 0;
                try {
                    for (var y, f = range(0, i)[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                        var p = y.value, v = h[h.length - 1 - p], m = n[l].indexOf(v);
                        r.push(o[m]), v = h[p], m = n[l].indexOf(v), s.push(o[m]);
                    }
                } catch (t) {
                    c = !0, u = t;
                } finally {
                    try {
                        !d && f.return && f.return();
                    } finally {
                        if (c) throw u;
                    }
                }
                var b = !0, k = !1, w = void 0;
                try {
                    for (var g, x = r[Symbol.iterator](); !(b = (g = x.next()).done); b = !0) {
                        var L = g.value;
                        if (null != L) {
                            var C = this.findArch(L);
                            this.sidebarRightTop.addArchBtn(C);
                        }
                    }
                } catch (t) {
                    k = !0, w = t;
                } finally {
                    try {
                        !b && x.return && x.return();
                    } finally {
                        if (k) throw w;
                    }
                }
                var T = !0, S = !1, D = void 0;
                try {
                    for (var B, W = s[Symbol.iterator](); !(T = (B = W.next()).done); T = !0) {
                        var M = B.value;
                        if (null != M) {
                            var _ = this.findArch(M);
                            this.sidebarRightBot.addArchBtn(_);
                        }
                    }
                } catch (t) {
                    S = !0, D = t;
                } finally {
                    try {
                        !T && W.return && W.return();
                    } finally {
                        if (S) throw D;
                    }
                }
            }
        }
    }, {
        key: "highlight",
        value: function(t) {
            if ("mouseover" == t.type) {
                var e = t.target.id, a = t.target.parentElement.parentElement.id, i = !0, r = !1, s = void 0;
                try {
                    for (var n, o = this.decklists[Symbol.iterator](); !(i = (n = o.next()).done); i = !0) {
                        (y = n.value).name != a && y.highlight(e);
                    }
                } catch (t) {
                    r = !0, s = t;
                } finally {
                    try {
                        !i && o.return && o.return();
                    } finally {
                        if (r) throw s;
                    }
                }
            } else {
                a = t.target.parentElement.parentElement.id;
                var l = !0, h = !1, d = void 0;
                try {
                    for (var c, u = this.decklists[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                        var y;
                        (y = c.value).name != a && y.highlight(e);
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
        key: "plotDustWr",
        value: function() {
            var t = this.archetypes[this.f];
            if (0 != t.length) {
                this.mode = "overview", this.renderWindows();
                var e = [], a = 48e3, i = 0, r = !0, s = !1, n = void 0;
                try {
                    for (var o, l = t[Symbol.iterator](); !(r = (o = l.next()).done); r = !0) {
                        var h = o.value;
                        if (0 != h.wr) {
                            var d = !0, c = !1, u = void 0;
                            try {
                                for (var y, f = h.decklists[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                                    var p = y.value;
                                    p.dust < a && (a = p.dust), p.dust > i && (i = p.dust), e.push({
                                        x: [ h.wr ],
                                        y: [ p.dust ],
                                        text: "<b>" + p.name + "</b><br>Winrate: " + (100 * h.wr).toFixed(2) + "%<br>Dust Cost: " + p.dust,
                                        hoverinfo: "text",
                                        name: p.name,
                                        mode: "markers",
                                        type: "scatter",
                                        marker: {
                                            color: hsColors[h.hsClass],
                                            size: 15,
                                            line: {
                                                color: "black",
                                                width: 2.2
                                            }
                                        }
                                    });
                                }
                            } catch (t) {
                                c = !0, u = t;
                            } finally {
                                try {
                                    !d && f.return && f.return();
                                } finally {
                                    if (c) throw u;
                                }
                            }
                        }
                    }
                } catch (t) {
                    s = !0, n = t;
                } finally {
                    try {
                        !r && l.return && l.return();
                    } finally {
                        if (s) throw n;
                    }
                }
                var v = _defineProperty({
                    showlegend: !1,
                    hovermode: "closest",
                    displayModeBar: !1,
                    autosize: !0,
                    margin: MOBILE ? {
                        l: 10,
                        r: 10,
                        b: 35,
                        t: 0
                    } : {
                        l: 60,
                        r: 30,
                        b: 50,
                        t: 0
                    },
                    plot_bgcolor: "transparent",
                    paper_bgcolor: "white",
                    yaxis: {
                        title: "Dust Cost",
                        range: [ .9 * a, 1.1 * i ],
                        fixedrange: !0
                    },
                    xaxis: {
                        tickformat: ",.0%",
                        title: "Winrate",
                        fixedrange: !0
                    },
                    shapes: [ {
                        type: "line",
                        y0: a,
                        x0: .5,
                        y1: 1.1 * i,
                        x1: .5,
                        line: {
                            color: "rgba(50,50,50,0.5)",
                            width: 1.5,
                            dash: "dot",
                            opacity: .5
                        }
                    } ]
                }, "margin", {
                    r: 0,
                    t: 0
                });
                Plotly.newPlot("chart3", e, v);
                document.getElementById("chart3").on("plotly_click", function(t) {
                    console.log("clickHandler:", t);
                    var e = t.points[0].data.name;
                    console.log(e);
                }.bind(this));
            }
        }
    }, {
        key: "loadOverviewSidebar",
        value: function() {}
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayP.innerHTML = this.overlayText, 
            this.overlayDiv.style.display = "block", this.overlay = !0);
        }
    } ]), t;
}(), History = function() {
    function t(e, a) {
        _classCallCheck(this, t), this.window = a, this.data = e, this.bgColor = "transparent", 
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
            last6Hours: 24,
            last12Hours: 24,
            lastDay: 24,
            last3Days: 14,
            lastWeek: 14,
            last2Weeks: 14,
            last3Weeks: 21,
            lastMonth: 30
        }, this.r2r = {
            ranks_all: "ranks_all",
            ranks_L_5: "ranks_1_4",
            ranks_6_15: "ranks_5_14"
        }, this.fullyLoaded = !0;
    }
    return _createClass(t, [ {
        key: "plot",
        value: function() {
            this.window.chartDiv.innerHTML = "", document.querySelector("#ladderWindow .content-header #rankBtn").style.display = "inline";
            this.window.f;
            var t = this.window.t, e = "lastDay" == t || "last12Hours" == t || "last6Hours" == t ? "lastHours" : "lastDays", a = "lastHours" == e ? "Hour" : "Day", i = "lastHours" == e ? 2 : 0, r = this.timeFrame[t], s = this.r2r[this.window.r], n = this.window.mode, o = range(i, r);
            console.log("plot History", e, s, n), console.log(this.data), console.log(this.data[e]), 
            console.log(this.data[e][s]);
            var l = this.data[e][s][n], h = 0, d = [], c = [], u = [], y = 0;
            this.annotations = [];
            for (var f = l[l.length - 1].data.slice(), p = i; p < r && p < f.length; p++) {
                y += f[p];
                var v = {
                    x: p,
                    y: .05,
                    xref: "x",
                    yref: "y",
                    text: f[p],
                    showarrow: !1,
                    bgcolor: "rgba(0,0,0,0.3)",
                    font: {
                        color: "white"
                    },
                    opacity: .8
                };
                this.annotations.push(v);
            }
            var m = l.slice().sort(function(t, e) {
                return t.avg > e.avg ? -1 : t.avg < e.avg ? 1 : 0;
            });
            for (p = 0; p < this.top; p++) {
                var b, k = m[p].name;
                b = "classes" == n ? {
                    color: hsColors[k],
                    fontColor: hsFontColors[k]
                } : app.ui.getArchColor(0, k, this.window.f), u.push({
                    name: k,
                    color: b.color,
                    fontColor: b.fontColor
                });
                var w = "lastHours" == e ? this.smoothData(m[p].data) : m[p].data.slice();
                w = w.slice(i, r);
                for (var g = [], x = 0; x < o.length; x++) {
                    var L = x > 0 ? a + "s" : a;
                    g.push(m[p].name + " (" + (100 * w[x]).toFixed(1) + "% )<br>" + o[x] + " " + L + " ago"), 
                    w[x] > h && (h = w[x]);
                }
                c.push({
                    x: o.slice(),
                    y: fillRange(0, w.length, 0),
                    text: g,
                    line: {
                        width: 2.5,
                        simplify: !1
                    },
                    marker: {
                        color: b.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                }), d.push({
                    x: o.slice(),
                    y: w.slice(),
                    text: g,
                    line: {
                        width: 2.5
                    },
                    marker: {
                        color: b.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                });
            }
            var C = [];
            if ("lastHours" == e) {
                var T = new Date().getHours();
                for (p = 0; p < o.length; p++) if (p % 3 == 0 || 1 == p) {
                    var S = parseInt((T + 24 - o[p]) % 24);
                    C.push(S + ":00");
                } else C.push("");
            }
            if ("lastDays" == e) for (p = 0; p < o.length; p++) if (p % 4 == 0 || 0 == p) {
                (T = new Date()).setDate(T.getDate() - p), C.push(T.getDate() + "." + (T.getMonth() + 1) + ".");
            } else C.push("");
            this.layout.yaxis.range = [ 0, 1.1 * h ], this.layout.xaxis.tickvals = range(i, o.length + i), 
            this.layout.xaxis.ticktext = C, Plotly.newPlot("chart1", c, this.layout, {
                displayModeBar: !1
            }), this.window.nrGames = y, this.window.setGraphTitle(), this.createLegend(u), 
            this.annotate(this.window.annotated), Plotly.animate("chart1", {
                data: d,
                traces: range(0, d.length),
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
            var a = 9;
            "classes" == e && (a = 9), "decks" == e && (a = this.top) > t.length && (a = t.length);
            for (var i = 0; i < a; i++) "classes" == e && this.window.addLegendItem(hsClasses[i]), 
            "decks" == e && this.window.addLegendItem(t[i].name);
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
            for (var e = t.slice(), a = [], i = 0; i < e.length; i++) {
                var r = 0, s = 0;
                i > 0 && (s += .3 * e[i - 1], r += .3), i < e.length - 1 && (s += .3 * e[i + 1], 
                r += .3), s += e[i] * (1 - r), a.push(s);
            }
            return a;
        }
    } ]), t;
}(), InfoWindow = function() {
    function t(e) {
        _classCallCheck(this, t), this.div = document.querySelector("#infoWindow"), this.tab = document.querySelector("#info.tab"), 
        this.infoText = document.querySelector("#infoWindow .content .infoText"), this.twitterFeed = document.querySelector("#infoWindow .content .twitterDiv"), 
        this.mode = "info", this.text = "\n                Greetings and thank you for checking out the VS Live Beta!<br><br>\n\n                    Update 16-12-2017:<br><br>\n                    - App refresh button in the top right corner added<br>\n                    - Chose color theme for the matchup table added<br>\n                    - Outdated archetypes no longer show in the overview page<br>\n                    - Fixed win rates in the win rates page when data is insufficient<br>\n                    - Simulation tool in Matchup tab (VS Gold only)<br><br>\n\n                    Update 1-3-2018:<br><br>\n                    - Loading only data needed<br>\n                    - Decks now show counters and best matchups<br>\n                    - Decks features a Dust vs Winrate plot<br>\n                    - VS Power Score in the Overview tab (map icon)<br>\n                    - New icons / wordings<br><br>\n\n                   To give feedback simply click on the discord link below:<br><br>\n                   \n                <a href=" + DISCORDLINK + '\n                   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n                ', 
        this.infoText.innerHTML = this.text, this.setupUI();
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            this.infoBtn = document.querySelector("#infoWindow .content-header #info.optionBtn"), 
            this.twitterBtn = document.querySelector("#infoWindow .content-header #twitter.optionBtn"), 
            this.buttons = [ this.infoBtn, this.twitterBtn ];
            var t = !0, e = !1, a = void 0;
            try {
                for (var i, r = this.buttons[Symbol.iterator](); !(t = (i = r.next()).done); t = !0) {
                    i.value.onclick = this.buttonTrigger.bind(this);
                }
            } catch (t) {
                e = !0, a = t;
            } finally {
                try {
                    !t && r.return && r.return();
                } finally {
                    if (e) throw a;
                }
            }
            this.renderOptions();
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            this.mode = e, this.plot();
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, a = void 0;
            try {
                for (var i, r = this.buttons[Symbol.iterator](); !(t = (i = r.next()).done); t = !0) {
                    i.value.classList.remove("highlighted");
                }
            } catch (t) {
                e = !0, a = t;
            } finally {
                try {
                    !t && r.return && r.return();
                } finally {
                    if (e) throw a;
                }
            }
            switch (this.mode) {
              case "info":
                this.infoBtn.classList.add("highlighted");
                break;

              case "twitter":
                this.twitterBtn.classList.add("highlighted");
            }
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (this.div.style.display = "inline-block", this.plot()) : this.div.style.display = "none";
        }
    }, {
        key: "plot",
        value: function() {
            switch (this.mode) {
              case "info":
                this.infoText.style.display = "block", this.twitterFeed.style.display = "none";
                break;

              case "twitter":
                this.infoText.style.display = "none", this.twitterFeed.style.display = "block";
            }
            this.renderOptions();
        }
    } ]), t;
}(), Ladder = function() {
    function t(e, a, i, r) {
        _classCallCheck(this, t), this.maxLegendEntries = 9, this.maxLines = 10, this.lineWidth = 2.7, 
        this.fr_min = .03, this.DATA = e, this.f = a, this.t = i, this.window = r, this.archetypes = [], 
        this.classFr = {}, this.totGames = 0, this.totGamesBrackets = {}, this.download = {
            classes: "",
            decks: ""
        }, this.traces = {
            bar: {
                classes: [],
                decks: []
            },
            line: {
                classes: [],
                decks: []
            },
            zoom: {},
            pie: {
                classes: [],
                decks: []
            },
            map: {}
        };
        var s = !0, n = !1, o = void 0;
        try {
            for (var l, h = hsClasses[Symbol.iterator](); !(s = (l = h.next()).done); s = !0) {
                var d = l.value;
                this.traces.zoom[d] = [];
            }
        } catch (t) {
            n = !0, o = t;
        } finally {
            try {
                !s && h.return && h.return();
            } finally {
                if (n) throw o;
            }
        }
        this.rankBrackets = [];
        var c = !0, u = !1, y = void 0;
        try {
            for (var f, p = this.window.ranks[Symbol.iterator](); !(c = (f = p.next()).done); c = !0) {
                var v = f.value;
                this.traces.map[v] = null, this.rankBrackets.push({
                    name: v,
                    start: rankRange[v][0],
                    end: rankRange[v][1]
                });
            }
        } catch (t) {
            u = !0, y = t;
        } finally {
            try {
                !c && p.return && p.return();
            } finally {
                if (u) throw y;
            }
        }
        this.bracket = this.rankBrackets[0];
        var m = !0, b = !1, k = void 0;
        try {
            for (var w, g = this.rankBrackets[Symbol.iterator](); !(m = (w = g.next()).done); m = !0) {
                var x = w.value;
                this.totGamesBrackets[x.name] = 0;
                var L = [], C = !0, T = !1, S = void 0;
                try {
                    for (var D, B = hsClasses[Symbol.iterator](); !(C = (D = B.next()).done); C = !0) kt = D.value, 
                    L.push(hsColors[kt]);
                } catch (t) {
                    T = !0, S = t;
                } finally {
                    try {
                        !C && B.return && B.return();
                    } finally {
                        if (T) throw S;
                    }
                }
                var W = {
                    values: fillRange(0, hsClasses.length, 0),
                    labels: hsClasses.slice(),
                    marker: {
                        colors: L
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
                this.traces.pie.decks[x.name] = [ {
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
                } ], this.traces.pie.classes[x.name] = [ W ];
            }
        } catch (t) {
            b = !0, k = t;
        } finally {
            try {
                !m && g.return && g.return();
            } finally {
                if (b) throw k;
            }
        }
        var M = e.archetypes, _ = e.gamesPerRank;
        this.rankSums = e.gamesPerRank;
        for (var q = this.smoothLadder(e.rankData, _.slice()), E = this.smoothLadder(e.classRankData, _.slice()), I = 0; I < hsRanks; I++) {
            this.totGames += _[I];
            var F = !0, R = !1, H = void 0;
            try {
                for (var A, O = this.rankBrackets[Symbol.iterator](); !(F = (A = O.next()).done); F = !0) {
                    I >= (Ft = A.value).start && I <= Ft.end && (this.totGamesBrackets[Ft.name] += _[I]);
                }
            } catch (t) {
                R = !0, H = t;
            } finally {
                try {
                    !F && O.return && O.return();
                } finally {
                    if (R) throw H;
                }
            }
        }
        for (var P = 0; P < M.length; P++) {
            var z = [], N = [], G = {}, U = [], X = 0, Y = M[P][1] + " " + M[P][0].replace("§", ""), V = hsClasses.indexOf(M[P][0]), K = app.ui.getArchColor(M[P][0], M[P][1], this.f), j = K.fontColor, Z = K.color, J = !0, Q = !1, $ = void 0;
            try {
                for (var tt, et = range(0, hsRanks)[Symbol.iterator](); !(J = (tt = et.next()).done); J = !0) {
                    var at = tt.value, it = q[at][P];
                    N.push(it), U.push("<b>" + Y + "     </b><br>freq: " + (100 * it).toFixed(1) + "%"), 
                    it < this.fr_min && P > 8 && (this.traces.bar.decks[V].y[at] += it, it = 0), X += it, 
                    z.push(it);
                    var rt = !0, st = !1, nt = void 0;
                    try {
                        for (var ot, lt = this.rankBrackets[Symbol.iterator](); !(rt = (ot = lt.next()).done); rt = !0) {
                            var ht = ot.value;
                            if (at == ht.start && (this.traces.pie.decks[ht.name][0].values.push(it), this.traces.pie.decks[ht.name][0].labels.push(Y), 
                            this.traces.pie.decks[ht.name][0].marker.colors.push(Z)), at > ht.start && at <= ht.end && (this.traces.pie.decks[ht.name][0].values[P] += it), 
                            at == ht.end) {
                                this.traces.pie.decks[ht.name][0].values[P] /= ht.end - ht.start + 1, this.traces.pie.decks[ht.name][0].text.push(Y), 
                                G[ht.name] = this.traces.pie.decks[ht.name][0].values[P];
                                var dt = this.traces.pie.decks[ht.name][0].values[P];
                                dt < this.fr_min && P > 8 && (this.traces.pie.decks[ht.name][0].values[P] = 0, this.traces.pie.decks[ht.name][0].values[V] += dt);
                            }
                        }
                    } catch (t) {
                        st = !0, nt = t;
                    } finally {
                        try {
                            !rt && lt.return && lt.return();
                        } finally {
                            if (st) throw nt;
                        }
                    }
                }
            } catch (t) {
                Q = !0, $ = t;
            } finally {
                try {
                    !J && et.return && et.return();
                } finally {
                    if (Q) throw $;
                }
            }
            X /= hsRanks;
            var ct = {
                x: range(0, hsRanks),
                y: z.slice(),
                name: Y,
                text: U,
                hoverinfo: "text",
                marker: {
                    color: Z
                },
                type: "bar",
                winrate: 0,
                hsClass: M[P][0] + M[P][1]
            }, ut = {
                x: range(0, hsRanks),
                y: N.slice(),
                name: Y,
                text: U,
                hoverinfo: "text",
                orientation: "h",
                marker: {
                    color: Z
                },
                line: {
                    width: this.lineWidth
                },
                type: "scatter",
                mode: "lines",
                winrate: 0,
                hsClass: M[P][0] + M[P][1],
                fr: X
            };
            this.traces.bar.decks.push(ct), this.traces.line.decks.push(ut);
            var yt = {
                name: Y,
                hsClass: M[P][0],
                fr: X,
                fr_ranks: N.slice(),
                fr_brackets: G,
                color: Z,
                fontColor: j
            };
            this.archetypes.push(yt);
        }
        var ft = !0, pt = !1, vt = void 0;
        try {
            for (var mt, bt = range(0, 9)[Symbol.iterator](); !(ft = (mt = bt.next()).done); ft = !0) {
                I = mt.value;
                var kt = hsClasses[I], wt = [], gt = [], xt = 0, Lt = !0, Ct = !1, Tt = void 0;
                try {
                    for (var St, Dt = range(0, hsRanks)[Symbol.iterator](); !(Lt = (St = Dt.next()).done); Lt = !0) {
                        var Bt = St.value, Wt = E[Bt][I];
                        wt.push(Wt), gt.push(kt + " " + (100 * Wt).toFixed(2) + "%"), xt += Wt;
                        var Mt = !0, _t = !1, qt = void 0;
                        try {
                            for (var Et, It = this.rankBrackets[Symbol.iterator](); !(Mt = (Et = It.next()).done); Mt = !0) {
                                var Ft;
                                Bt >= (Ft = Et.value).start && Bt <= Ft.end && (this.traces.pie.classes[Ft.name][0].values[I] += Wt), 
                                Bt == Ft.end && (this.traces.pie.classes[Ft.name][0].values[I] /= Ft.end - Ft.start + 1);
                            }
                        } catch (t) {
                            _t = !0, qt = t;
                        } finally {
                            try {
                                !Mt && It.return && It.return();
                            } finally {
                                if (_t) throw qt;
                            }
                        }
                    }
                } catch (t) {
                    Ct = !0, Tt = t;
                } finally {
                    try {
                        !Lt && Dt.return && Dt.return();
                    } finally {
                        if (Ct) throw Tt;
                    }
                }
                var Rt = fillRange(0, hsRanks, 0), Ht = !0, At = !1, Ot = void 0;
                try {
                    for (var Pt, zt = this.archetypes[Symbol.iterator](); !(Ht = (Pt = zt.next()).done); Ht = !0) {
                        var Nt = Pt.value;
                        if (Nt.hsClass == kt) {
                            var Gt = [], Ut = !0, Xt = !1, Yt = void 0;
                            try {
                                for (var Vt, Kt = range(0, hsRanks)[Symbol.iterator](); !(Ut = (Vt = Kt.next()).done); Ut = !0) {
                                    var jt = Vt.value;
                                    Rt[jt] += Nt.fr_ranks[jt], Gt.push("");
                                }
                            } catch (t) {
                                Xt = !0, Yt = t;
                            } finally {
                                try {
                                    !Ut && Kt.return && Kt.return();
                                } finally {
                                    if (Xt) throw Yt;
                                }
                            }
                            var Zt = {
                                x: range(0, hsRanks),
                                y: Nt.fr_ranks.slice(),
                                name: Nt.name,
                                text: Gt,
                                hoverinfo: "text",
                                marker: {
                                    color: Nt.color
                                },
                                type: "bar",
                                winrate: 0,
                                hsClass: kt,
                                overall: Nt.fr_ranks.slice(),
                                fr_avg: Nt.fr
                            };
                            this.traces.zoom[kt].push(Zt);
                        }
                    }
                } catch (t) {
                    At = !0, Ot = t;
                } finally {
                    try {
                        !Ht && zt.return && zt.return();
                    } finally {
                        if (At) throw Ot;
                    }
                }
                var Jt = !0, Qt = !1, $t = void 0;
                try {
                    for (var te, ee = this.traces.zoom[kt][Symbol.iterator](); !(Jt = (te = ee.next()).done); Jt = !0) for (var ae = te.value, ie = 0; ie < hsRanks; ie++) ae.y[ie] /= Rt[ie] > 0 ? Rt[ie] : 1, 
                    ae.text[ie] = ae.name + "<br>" + (100 * ae.y[ie]).toFixed(1) + "% of " + ae.hsClass + "<br>" + (100 * ae.overall[ie]).toFixed(1) + "% overall";
                } catch (t) {
                    Qt = !0, $t = t;
                } finally {
                    try {
                        !Jt && ee.return && ee.return();
                    } finally {
                        if (Qt) throw $t;
                    }
                }
                xt /= hsRanks, this.classFr[kt] = wt.slice();
                var re = {
                    x: range(0, hsRanks),
                    y: wt.slice(),
                    name: kt,
                    text: gt.slice(),
                    hoverinfo: "text",
                    marker: {
                        color: hsColors[kt]
                    },
                    type: "bar",
                    winrate: 0,
                    hsClass: kt
                }, se = {
                    x: range(0, hsRanks),
                    y: wt.slice(),
                    name: kt,
                    text: gt.slice(),
                    hoverinfo: "text",
                    marker: {
                        color: hsColors[kt]
                    },
                    line: {
                        width: this.lineWidth
                    },
                    type: "scatter",
                    mode: "lines",
                    winrate: 0,
                    hsClass: kt,
                    fr: xt
                };
                this.traces.bar.classes.push(re), this.traces.line.classes.push(se);
            }
        } catch (t) {
            pt = !0, vt = t;
        } finally {
            try {
                !ft && bt.return && bt.return();
            } finally {
                if (pt) throw vt;
            }
        }
        var ne = function(t, e) {
            return t.hsClass < e.hsClass ? -1 : t.hsClass > e.hsClass ? 1 : 0;
        }, oe = function(t, e) {
            return t.fr > e.fr ? -1 : t.fr < e.fr ? 1 : 0;
        };
        this.traces.bar.classes.sort(ne), this.traces.line.classes.sort(oe), this.traces.line.classes.splice(this.maxLines), 
        this.traces.bar.decks.sort(ne), this.traces.line.decks.sort(oe), this.traces.line.decks.splice(this.maxLines), 
        this.archetypes.sort(oe);
    }
    return _createClass(t, [ {
        key: "smoothLadder",
        value: function(t, e) {
            var a = [ t[0].slice() ];
            0 == e[0] && (e[0] = 1), 0 == e[1] && (e[1] = 1);
            for (var i, r, s = 1; s < hsRanks - 1; s++) {
                0 == e[s + 1] && (e[s + 1] = 1), r = e[s - 1] / e[s], i = e[s + 1] / e[s], r > 7 && (r = 7), 
                i > 7 && (i = 7), s % 5 == 0 && (i = 0), s % 5 == 1 && (r = 0);
                for (var n = 3.5 + i + r, o = [], l = 0; l < t[s].length; l++) {
                    var h = t[s][l] / e[s], d = t[s + 1][l] / e[s + 1], c = t[s - 1][l] / e[s - 1];
                    o.push((3.5 * h + d * i + c * r) / n);
                }
                a.push(o);
            }
            a.push(t[hsRanks - 1].slice());
            for (var u = 0; u < a[0].length; u++) a[0][u] /= e[0];
            for (u = 0; u < t[hsRanks - 1].length; u++) a[hsRanks - 1][u] /= e[hsRanks - 1];
            return a;
        }
    }, {
        key: "plot",
        value: function() {
            document.getElementById("chart1").innerHTML = "", this.window.hideRankFolder(), 
            this.window.setGraphTitle();
            var t = this.window.plotType, e = this.window.layouts[t], a = void 0;
            switch (t) {
              case "pie":
                this.window.showRankFolder(), a = this.traces.pie[this.window.mode][this.window.r];
                break;

              case "number":
                return void this.createTable(this.window.mode);

              case "bar":
                a = this.traces.bar[this.window.mode];
                break;

              case "zoom":
                a = this.traces.zoom[this.window.zoomClass];
                break;

              case "line":
                a = this.traces.line[this.window.mode];
                break;

              case "map":
                this.window.showRankFolder(), a = this.traces.map[this.window.r], this.window.mode = "decks", 
                this.window.renderOptions(), null == a && (a = this.loadMap());
            }
            "portrait" == MOBILE && "pie" != this.window.plotTyp && (e.width = 2 * ui.width, 
            e.height = .6 * ui.height), Plotly.newPlot("chart1", a, e, {
                displayModeBar: !1
            }), this.annotate(this.window.annotated), this.createLegend(this.window.mode), "bar" != this.window.plotType && "zoom" != this.window.plotType || !PREMIUM || document.getElementById("chart1").on("plotly_click", this.zoomToggle.bind(this));
        }
    }, {
        key: "colorScale",
        value: function(t) {
            var e = this.window.colorScale_c1, a = this.window.colorScale_c2, i = [];
            (t /= this.window.colorScale_f) > 1 && (t = 1);
            for (var r = 0; r < 3; r++) i.push(parseInt(e[r] + (a[r] - e[r]) * t));
            return "rgb(" + i[0] + "," + i[1] + "," + i[2] + ")";
        }
    }, {
        key: "annotate",
        value: function(t) {
            var e = this.window.plotType;
            if ("pie" != e && "number" != e && "timeline" != e && "map" != e) {
                var a, i = {
                    bar: .5,
                    zoom: .5,
                    line: .05
                }, r = "bar" == e || "zoom" == e ? 90 : 0;
                if (t) {
                    for (var s = [], n = 0; n < hsRanks; n++) {
                        var o = {
                            x: n,
                            y: i[e],
                            xref: "x",
                            yref: "y",
                            textangle: r,
                            text: this.rankSums[n],
                            showarrow: !1,
                            bgcolor: "rgba(0,0,0,0.3)",
                            font: {
                                color: "white"
                            },
                            opacity: .8
                        };
                        s.push(o);
                    }
                    a = {
                        annotations: s
                    };
                } else a = {
                    annotations: []
                };
                Plotly.relayout("chart1", a);
            }
        }
    }, {
        key: "loadMap",
        value: function() {
            var t = this.window.r, e = app.ui.tableWindow.data[this.f][table_times[0]][table_ranks[0]];
            null == e && console.log("ERROR table not loaded for Meta Score"), this.traces.map[t] = [];
            var a = e.table, i = e.archetypes, r = this.archetypes, s = 0, n = 0, o = !0, l = !1, h = void 0;
            try {
                for (var d, c = this.archetypes[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                    var u = d.value, y = i.indexOf(u.name);
                    if (-1 != y) {
                        var f = 0, p = 0, v = !0, m = !1, b = void 0;
                        try {
                            for (var k, w = r[Symbol.iterator](); !(v = (k = w.next()).done); v = !0) {
                                var g = k.value, x = i.indexOf(g.name);
                                if (-1 != x) {
                                    var L = a[y][x], C = g.fr_brackets[t];
                                    p += L * C, f += C;
                                }
                            }
                        } catch (t) {
                            m = !0, b = t;
                        } finally {
                            try {
                                !v && w.return && w.return();
                            } finally {
                                if (m) throw b;
                            }
                        }
                        var T = u.fr_brackets[t];
                        p = f > 0 ? p / f : 0, s = Math.max(p, s), n = Math.max(T, n), this.traces.map[t].push({
                            name: u.name,
                            type: "scatter",
                            fr: T,
                            wr: p,
                            hoverinfo: "text",
                            mode: "markers",
                            marker: {
                                size: 15,
                                line: {
                                    size: 0
                                },
                                color: u.color
                            }
                        });
                    }
                }
            } catch (t) {
                l = !0, h = t;
            } finally {
                try {
                    !o && c.return && c.return();
                } finally {
                    if (l) throw h;
                }
            }
            var S = !0, D = !1, B = void 0;
            try {
                for (var W, M = this.traces.map[t][Symbol.iterator](); !(S = (W = M.next()).done); S = !0) {
                    var _ = W.value;
                    _.x = [ (_.wr + s - 1) / (2 * s - 1) ], _.y = [ _.fr / n ];
                    var q = (_.x[0] + _.y[0]) / 2;
                    _.text = "<b>" + _.name + "<br>Meta:</b> " + q.toFixed(2) + "<br><b>WR:</b> " + _.wr.toFixed(2) + " <b>Freq:</b> " + (100 * _.fr).toFixed(0) + "%";
                }
            } catch (t) {
                D = !0, B = t;
            } finally {
                try {
                    !S && M.return && M.return();
                } finally {
                    if (D) throw B;
                }
            }
            return this.traces.map[t];
        }
    }, {
        key: "createTable",
        value: function(t) {
            var e = 20;
            this.archetypes.length < e && (e = this.archetypes.length), document.getElementById("chart1").innerHTML = "";
            var a = document.createElement("table");
            a.id = "numberTable";
            var i = document.createElement("tr");
            this.download[t] = [ [] ];
            (u = document.createElement("th")).className = "pivot", u.innerHTML = "Rank ->", 
            i.appendChild(u), this.download[t] += "Rank%2C";
            for (var r = hsRanks - 1; r >= 0; r--) {
                (u = document.createElement("th")).innerHTML = r > 0 ? r : "L", i.appendChild(u), 
                this.download[t] += r > 0 ? r : "L", this.download[t] += "%2C";
            }
            if (a.appendChild(i), this.download[t] += "%0A", "decks" == t) for (var s = 0; s < e; s++) {
                var n = this.archetypes[s], o = n.name + "%2C", l = document.createElement("tr");
                (h = document.createElement("td")).className = "pivot", h.style.backgroundColor = n.color, 
                h.style.color = n.fontColor, h.innerHTML = n.name, l.appendChild(h);
                for (r = hsRanks - 1; r > -1; r--) {
                    (u = document.createElement("td")).style.backgroundColor = this.colorScale(n.fr_ranks[r]), 
                    u.innerHTML = (100 * n.fr_ranks[r]).toFixed(1) + "%", l.appendChild(u), o += n.fr_ranks[r] + "%2C";
                }
                a.appendChild(l), this.download[t] += o + "%0A";
            }
            if ("classes" == t) for (s = 0; s < 9; s++) {
                var h, d = hsClasses[s], c = this.classFr[d];
                o = d + "%2C", l = document.createElement("tr");
                (h = document.createElement("td")).className = "pivot", h.style.backgroundColor = hsColors[d], 
                h.style.color = hsFontColors[d], h.innerHTML = d, l.appendChild(h);
                for (r = hsRanks - 1; r > -1; r--) {
                    var u;
                    (u = document.createElement("td")).style.backgroundColor = this.colorScale(c[r]), 
                    u.innerHTML = (100 * c[r]).toFixed(1) + "%", l.appendChild(u), o += c[r] + "%2C";
                }
                a.appendChild(l), this.download[t] += o + "%0A";
            }
            document.getElementById("chart1").appendChild(a), this.createNumbersFooter();
        }
    }, {
        key: "createLegend",
        value: function(t) {
            if ("zoom" != this.window.plotType) {
                this.window.clearChartFooter();
                var e = this.archetypes, a = "classes" == t ? this.maxLegendEntries : 9;
                a > e.length && (a = e.length);
                var i = !0, r = !1, s = void 0;
                try {
                    for (var n, o = range(0, a)[Symbol.iterator](); !(i = (n = o.next()).done); i = !0) {
                        var l = n.value;
                        "classes" == t && this.window.addLegendItem(hsClasses[l]), "decks" == t && this.window.addLegendItem(e[l].name);
                    }
                } catch (t) {
                    r = !0, s = t;
                } finally {
                    try {
                        !i && o.return && o.return();
                    } finally {
                        if (r) throw s;
                    }
                }
            } else this.createZoomLegend();
        }
    }, {
        key: "createZoomLegend",
        value: function() {
            var t = this.window.zoomClass;
            this.window.clearChartFooter();
            var e = !0, a = !1, i = void 0;
            try {
                for (var r, s = this.traces.zoom[t][Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
                    var n = r.value;
                    n.fr_avg > 0 && this.window.addLegendItem(n.name);
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !e && s.return && s.return();
                } finally {
                    if (a) throw i;
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
                var a = !0, i = !1, r = void 0;
                try {
                    for (var s, n = hsClasses[Symbol.iterator](); !(a = (s = n.next()).done); a = !0) {
                        var o = s.value;
                        if (-1 != e.indexOf(o)) {
                            this.window.zoomClass = o;
                            break;
                        }
                    }
                } catch (t) {
                    i = !0, r = t;
                } finally {
                    try {
                        !a && n.return && n.return();
                    } finally {
                        if (i) throw r;
                    }
                }
            } else this.window.zoomClass = e;
            this.plot();
        }
    } ]), t;
}(), LadderWindow = function() {
    function t(e) {
        _classCallCheck(this, t), this.div = document.querySelector("#ladderWindow"), this.tab = document.querySelector("#ladder.tab"), 
        this.chartDiv = document.querySelector("#ladderWindow #chart1"), this.classDeckOptions = document.querySelector("#ladderWindow .content-header .classDeckOptions"), 
        this.nrGamesBtn = document.querySelector("#ladderWindow .content-header #showNumbers"), 
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
        this.overlayText.map = "\n        The VS Meta Score aims to give a broad overview over the current state of the ladder meta.<br><br>\n        Each archetype is represented as a colored dot and plotted according to its winrate (x-axis) and frequency (y-axis).\n        Both axis are scaled from 0 to 1.<br><br> \n        &#8226 Frequency is scaled from 0% of the meta (0 on the plot) to the highest frequency of any archetype (1 on the plot) <br><br>\n        &#8226 Winrates are scaled from the highest winrate among all archetypes (1 on the plot) to 50% - delta where delta is the \n        distance of the highest winrate above 50%<br><br>\n        ", 
        this.fontColor = "#222", this.fontColorLight = "#999", this.overlay = !1, this.annotated = !1, 
        this.colorScale_c1 = [ 255, 255, 255 ], this.colorScale_c2 = [ 87, 125, 186 ], this.colorScale_f = .15, 
        this.data = {}, this.hsFormats = hsFormats, this.hsTimes = PREMIUM ? ladder_times_premium : ladder_times, 
        this.ranks = PREMIUM ? ladder_ranks_premium : ladder_ranks, this.layouts = {}, this.f = "Standard", 
        this.t = "lastDay", this.r = "ranks_all", this.plotType = "bar", this.plotTypes = [ "bar", "line", "pie", "number", "timeline" ], 
        this.mode = "classes", this.fullyLoaded = !1, this.history = {}, this.zoomClass = null;
        var a = !0, i = !1, r = void 0;
        try {
            for (var s, n = this.hsFormats[Symbol.iterator](); !(a = (s = n.next()).done); a = !0) {
                var o = s.value;
                this.data[o] = {
                    fullyLoaded: !1
                }, this.history[o] = {
                    fullyLoaded: !1
                };
                var l = !0, h = !1, d = void 0;
                try {
                    for (var c, u = this.hsTimes[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                        var y = c.value;
                        this.data[o][y] = null;
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
            i = !0, r = t;
        } finally {
            try {
                !a && n.return && n.return();
            } finally {
                if (i) throw r;
            }
        }
        this.loadData("Standard", e), this.setupUI(), this.renderOptions();
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            var t = !0, e = !1, a = void 0;
            try {
                for (var i, r = this.optionButtons[Symbol.iterator](); !(t = (i = r.next()).done); t = !0) {
                    (T = i.value).addEventListener("click", this.buttonTrigger.bind(this));
                }
            } catch (t) {
                e = !0, a = t;
            } finally {
                try {
                    !t && r.return && r.return();
                } finally {
                    if (e) throw a;
                }
            }
            this.setupLayouts(), this.dropdownFolders = {
                format: document.querySelector("#ladderWindow #formatFolder .dropdown"),
                time: document.querySelector("#ladderWindow #timeFolder .dropdown"),
                rank: document.querySelector("#ladderWindow #rankFolder .dropdown")
            };
            var s = function(t) {
                var e = t.toElement || t.relatedTarget;
                e.parentNode != this && e != this && this.classList.add("hidden");
            };
            for (var n in this.dropdownFolders) {
                var o = this.dropdownFolders[n];
                o.innerHTML = "", o.onmouseout = s;
            }
            var l = !0, h = !1, d = void 0;
            try {
                for (var c, u = this.hsFormats[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                    var y = c.value;
                    (T = document.createElement("button")).className = "optionBtn folderBtn", T.innerHTML = y, 
                    T.id = y;
                    T.onclick = function(t) {
                        this.f = t.target.id, this.plot();
                    }.bind(this), this.dropdownFolders.format.appendChild(T);
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
            var f = !0, p = !1, v = void 0;
            try {
                for (var m, b = this.hsTimes[Symbol.iterator](); !(f = (m = b.next()).done); f = !0) {
                    var k = m.value;
                    (T = document.createElement("button")).className = "optionBtn folderBtn", T.innerHTML = btnIdToText[k], 
                    T.id = k;
                    T.onclick = function(t) {
                        this.t = t.target.id, this.plot();
                    }.bind(this), this.dropdownFolders.time.appendChild(T);
                }
            } catch (t) {
                p = !0, v = t;
            } finally {
                try {
                    !f && b.return && b.return();
                } finally {
                    if (p) throw v;
                }
            }
            var w = !0, g = !1, x = void 0;
            try {
                for (var L, C = this.ranks[Symbol.iterator](); !(w = (L = C.next()).done); w = !0) {
                    var T, S = L.value;
                    (T = document.createElement("button")).className = "optionBtn folderBtn", T.innerHTML = btnIdToText[S], 
                    T.id = S;
                    T.onclick = function(t) {
                        this.r = t.target.id, this.plot();
                    }.bind(this), this.dropdownFolders.rank.appendChild(T);
                }
            } catch (t) {
                g = !0, x = t;
            } finally {
                try {
                    !w && C.return && C.return();
                } finally {
                    if (g) throw x;
                }
            }
            var D = PREMIUM ? "flex" : "none";
            this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this)), 
            this.classDeckOptions.style.display = D, document.querySelector("#ladderWindow .content-header .graphOptions #line").style.display = D, 
            document.querySelector("#ladderWindow .content-header .graphOptions #timeline").style.display = D, 
            this.nrGamesBtn.onclick = this.annotate.bind(this), this.optionButtons = document.querySelectorAll("#ladderWindow .optionBtn");
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (this.div.style.display = "inline-block", this.f = app.path.hsFormat, this.plot()) : (app.path.hsFormat = this.f, 
            this.div.style.display = "none");
        }
    }, {
        key: "annotate",
        value: function() {
            "pie" != this.plotType && "number" != this.plotType && (this.annotated ? ("timeline" == this.plotType ? this.history[this.f].annotate(!1) : this.data[this.f][this.t].annotate(!1), 
            this.nrGamesBtn.classList.remove("highlighted")) : ("timeline" == this.plotType ? this.history[this.f].annotate(!0) : this.data[this.f][this.t].annotate(!0), 
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
            "map" == e && (this.plotType = "map"), "timeline" == e && (this.plotType = "timeline"), 
            "zoom" == this.plotType && "classes" != this.mode && (this.plotType = "bar"), this.plot();
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, a = void 0;
            try {
                for (var i, r = this.optionButtons[Symbol.iterator](); !(t = (i = r.next()).done); t = !0) {
                    var s = i.value;
                    s.classList.remove("highlighted"), s.id == this.mode && s.classList.add("highlighted"), 
                    s.id == this.plotType && s.classList.add("highlighted"), "nrGames" == s.id && this.annotated && s.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, a = t;
            } finally {
                try {
                    !t && r.return && r.return();
                } finally {
                    if (e) throw a;
                }
            }
            document.querySelector("#ladderWindow #formatBtn").innerHTML = MOBILE ? btnIdToText_m[this.f] : btnIdToText[this.f], 
            document.querySelector("#ladderWindow #timeBtn").innerHTML = MOBILE ? btnIdToText_m[this.t] : btnIdToText[this.t], 
            document.querySelector("#ladderWindow #rankBtn").innerHTML = MOBILE ? btnIdToText_m[this.r] : btnIdToText[this.r];
        }
    }, {
        key: "checkLoadData",
        value: function(t) {
            var e = void 0 != t;
            if (console.log("checkLoadData", e, t), !this.data[this.f].fullyLoaded) {
                return !!e && this.loadData(this.f, function() {
                    app.ui.ladderWindow.checkLoadData(t);
                });
            }
            if ("map" == this.plotType && !app.ui.tableWindow.data[this.f].fullyLoaded) {
                return !!e && app.ui.tableWindow.loadData(this.f, function() {
                    app.ui.ladderWindow.checkLoadData(t);
                });
            }
            if ("timeline" == this.plotType && !this.history[this.f].fullyLoaded && PREMIUM) {
                return !!e && this.loadHistoryData(this.f, function() {
                    app.ui.ladderWindow.checkLoadData(t);
                });
            }
            if (this.data[this.f].fullyLoaded) return !e || t.apply(this);
        }
    }, {
        key: "loadData",
        value: function(t, e) {
            this.fullyLoaded = !1;
            app.fb_db.ref(this.firebasePath + "/" + t).on("value", function(a) {
                this.readData(a, t, e);
            }.bind(this), function(t) {
                return console.log("Could not load Ladder Data", t);
            });
        }
    }, {
        key: "loadHistoryData",
        value: function(t, e) {
            if (PREMIUM) {
                app.fb_db.ref(this.firebaseHistoryPath + "/" + t).on("value", function(a) {
                    this.readHistoryData(a, t, e);
                }.bind(this), function(t) {
                    return console.log("Could not load history data", t);
                });
            }
        }
    }, {
        key: "readData",
        value: function(t, e, a) {
            if (!this.fullyLoaded) {
                var i = t.val(), r = !0, s = !1, n = void 0;
                try {
                    for (var o, l = this.hsTimes[Symbol.iterator](); !(r = (o = l.next()).done); r = !0) {
                        var h = o.value;
                        this.data[e][h] = new Ladder(i[h], e, h, this);
                    }
                } catch (t) {
                    s = !0, n = t;
                } finally {
                    try {
                        !r && l.return && l.return();
                    } finally {
                        if (s) throw n;
                    }
                }
                this.fullyLoaded = !0, this.data[e].fullyLoaded = !0, console.log("ladder loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
                app.ui.hideLoader(), a.apply(this), this.plot();
            }
        }
    }, {
        key: "readHistoryData",
        value: function(t, e, a) {
            this.history[e] = new History(t.val(), this), a.apply(this);
        }
    }, {
        key: "plot",
        value: function() {
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

              case "map":
                this.nrGamesBtn.style.display = "none";
                break;

              case "timeline":
                this.nrGamesBtn.style.display = "flex";
            }
            if (this.renderOptions(), !this.checkLoadData()) {
                return this.checkLoadData(function(t) {
                    app.ui.ladderWindow.plot();
                });
            }
            "timeline" != this.plotType ? this.data[this.f][this.t].plot() : this.history[this.f].plot();
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
            var t = document.querySelector("#ladderWindow #rankDropdown");
            t.classList.contains("hidden") || t.classList.add("hidden");
        }
    }, {
        key: "setGraphTitle",
        value: function() {
            var t = "classes" == this.mode ? "Class" : "Deck", e = ([ "lastDay", "last6Hours", "last12Hours" ].indexOf(this.t), 
            btnIdToText[this.r]), a = this.data[this.f][this.t], i = "<span style='font-size: 80%'> ( " + ("pie" != this.plotType ? a.totGames : a.totGamesBrackets[this.r]).toLocaleString() + " games )</span>";
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
                break;

              case "map":
                this.graphTitle.innerHTML = "Meta Score" + i, this.graphLabel.innerHTML = "";
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
            var e = document.createElement("div"), a = (document.createElement("div"), document.createElement("l"), 
            app.ui.getArchColor(null, t, this.f));
            e.className = "legend-item", e.style.fontSize = "0.8em", e.style = "background-color:" + a.color + "; color:" + a.fontColor, 
            e.id = t, e.innerHTML = t, e.onclick = function(t) {
                null != app.ui.decksWindow && (app.path.hsFormat = this.f, app.ui.deckLink(t.target.id));
            }, this.chartFooter.appendChild(e);
        }
    }, {
        key: "clearChartFooter",
        value: function() {
            for (;this.chartFooter.firstChild; ) this.chartFooter.removeChild(this.chartFooter.firstChild);
        }
    }, {
        key: "setupLayouts",
        value: function() {
            var t = [], e = !0, a = !1, i = void 0;
            try {
                for (var r, s = range(0, hsRanks)[Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
                    var n = r.value, o = n % 5 == 0 ? n + "  " : "";
                    t.push(o);
                }
            } catch (t) {
                a = !0, i = t;
            } finally {
                try {
                    !e && s.return && s.return();
                } finally {
                    if (a) throw i;
                }
            }
            this.layouts.bar = {
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
                    ticktext: t,
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
            }, this.layouts.line = {
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
                    ticktext: t,
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
                paper_bgcolor: "transparent",
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
            }, this.layouts.pie = {
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
            var l = {
                color: "rgba(50,50,50,0.5)",
                width: 1.5,
                opacity: .5,
                dash: "dot"
            }, h = {
                color: "rgba(50,50,50,0.5)",
                width: 1.5,
                opacity: .5
            };
            this.layouts.map = {
                showlegend: !1,
                hovermode: "closest",
                displayModeBar: !1,
                autosize: !0,
                margin: MOBILE ? {
                    l: 10,
                    r: 10,
                    b: 35,
                    t: 0
                } : {
                    l: 60,
                    r: 30,
                    b: 50,
                    t: 0
                },
                xaxis: {
                    range: [ 0, 1.05 ],
                    title: "Winrate",
                    zeroline: !1,
                    fixedrange: !0,
                    tickvals: [ 0, .25, .5, .75, 1 ],
                    tickfont: {
                        family: "Arial, bold",
                        size: 15,
                        color: this.fontColor
                    }
                },
                yaxis: {
                    range: [ 0, 1.05 ],
                    title: "Frequency",
                    zeroline: !1,
                    fixedrange: !0,
                    tickvals: [ 0, .25, .5, .75, 1 ],
                    tickfont: {
                        family: "Arial, bold",
                        size: 15,
                        color: this.fontColor
                    }
                },
                plot_bgcolor: "transparent",
                paper_bgcolor: "transparent",
                shapes: [ {
                    type: "line",
                    x0: .5,
                    x1: .5,
                    y0: 0,
                    y1: 1,
                    line: l
                }, {
                    type: "line",
                    x0: 1,
                    x1: 1,
                    y0: 0,
                    y1: 1,
                    line: h
                }, {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    y0: .5,
                    y1: .5,
                    line: l
                }, {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    y0: 1,
                    y1: 1,
                    line: h
                }, {
                    type: "line",
                    x0: 0,
                    x1: 1,
                    y0: 0,
                    y1: 0,
                    line: h
                }, {
                    type: "line",
                    x0: 0,
                    x1: 0,
                    y0: 0,
                    y1: 1,
                    line: h
                } ]
            }, this.layouts.number = {}, this.layouts.zoom = this.layouts.bar;
        }
    } ]), t;
}(), DISCORDLINK = "https://discordapp.com/invite/0oxwpa5Mtc2VA2xC", POLLLINK = "https://docs.google.com/forms/d/e/1FAIpQLSel6ym_rJHduxkgeimzf9HdNbBMB5Kak7Fmk0Bl2O7O8XhVGg/viewform?usp=sf_link", VSGOLDINFOLINK = "https://www.vicioussyndicate.com/membership/vs-gold/", ladder_times = [ "lastDay", "last2Weeks" ], ladder_times_premium = [ "last6Hours", "last12Hours", "lastDay", "last3Days", "lastWeek", "last2Weeks" ], ladder_ranks = [ "ranks_all" ], ladder_ranks_premium = [ "ranks_all", "ranks_L", "ranks_1_4", "ranks_5_14" ], ladder_plotTypes = [], table_times = [ "last2Weeks" ], table_times_premium = [ "last3Days", "lastWeek", "last2Weeks" ], table_sortOptions = [ "frequency", "winrate" ], table_sortOptions_premium = [ "frequency", "winrate", "matchup" ], table_numArch = 16, table_ranks = [ "ranks_all" ], table_ranks_premium = [ "ranks_all", "ranks_L", "ranks_1_4", "ranks_5_14" ], MU_COLOR_IDX = 0, hsRanks = 21, hsClasses = [ "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ], hsFormats = [ "Standard", "Wild" ], rankRange = {
    ranks_all: [ 0, 20 ],
    ranks_L: [ 0, 0 ],
    ranks_1_5: [ 1, 5 ],
    ranks_1_4: [ 1, 4 ],
    ranks_L_5: [ 0, 5 ],
    ranks_6_15: [ 6, 15 ],
    ranks_5_14: [ 5, 14 ]
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
    ranks_1_4: "Ranks 1-4",
    ranks_1_5: "Ranks 1-5",
    ranks_L_5: "Ranks L-5",
    ranks_6_15: "Ranks 6-15",
    ranks_5_14: "Ranks 5-14",
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
        _classCallCheck(this, t), this.div = document.querySelector("#powerWindow"), this.tab = document.querySelector("#power.tab"), 
        this.grid = document.querySelector("#powerGrid"), this.optionButtons = document.querySelectorAll("#powerWindow .optionBtn"), 
        this.questionBtn = document.querySelector("#powerWindow .question"), this.overlayDiv = document.querySelector("#powerWindow .overlay"), 
        this.overlayP = document.querySelector("#powerWindow .overlayText"), this.f = "Standard", 
        this.mode = "brackets", this.t_ladder = {
            Standard: "lastDay",
            Wild: "last2Weeks"
        }, PREMIUM && (this.t_ladder.Wild = "lastWeek"), this.t_table = "last2Weeks", this.maxElementsPerRank = 5, 
        this.maxElementsPerBracket = PREMIUM ? 16 : 5, this.minGames = 50, this.overlayText = "\n            This tab displays the best decks to be played in the respective rank brackets.<br><br>\n            <span class='optionBtn'>Tier Lists</span> shows the top 16 decks across specific rank brackets ('All Ranks', 'Rank 1-5' etc.).<br><br>\n            <span class='optionBtn'>Suggestions</span> shows the top 5 decks for every single rank until rank 20.<br><br>\n            The winrates are calculated by using the deck frequencies of the last 24 hours and the matchup table of the last week.<br><br>\n            If there are fewer than " + this.minGames + ' games in the respective category no data is displayed instead.<br><br>\n            Click on a deck to get to it\'s deck list in the "Decks" tab.<br><br>        \n        ', 
        this.rankData = {
            rankSums: {},
            fullyLoaded: {}
        };
        var e = !0, a = !1, i = void 0;
        try {
            for (var r, s = hsFormats[Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
                var n = r.value;
                this.rankData[n] = [];
                var o = !0, l = !1, h = void 0;
                try {
                    for (var d, c = range(0, hsRanks)[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                        d.value;
                        this.rankData[n].push([]);
                    }
                } catch (t) {
                    l = !0, h = t;
                } finally {
                    try {
                        !o && c.return && c.return();
                    } finally {
                        if (l) throw h;
                    }
                }
                this.rankData.rankSums[n] = [], this.rankData.fullyLoaded[n] = !1;
            }
        } catch (t) {
            a = !0, i = t;
        } finally {
            try {
                !e && s.return && s.return();
            } finally {
                if (a) throw i;
            }
        }
        this.bracketData = {}, this.rankBrackets = [ {
            name: "All Ranks",
            games: {},
            start: 0,
            end: 15
        }, {
            name: "L",
            games: {},
            start: 0,
            end: 0
        }, {
            name: "1-5",
            games: {},
            start: 1,
            end: 5
        }, {
            name: "6-15",
            games: {},
            start: 6,
            end: 15
        } ];
        var u = !0, y = !1, f = void 0;
        try {
            for (var p, v = hsFormats[Symbol.iterator](); !(u = (p = v.next()).done); u = !0) {
                var m = p.value;
                this.bracketData[m] = {};
                var b = !0, k = !1, w = void 0;
                try {
                    for (var g, x = this.rankBrackets[Symbol.iterator](); !(b = (g = x.next()).done); b = !0) {
                        var L = g.value;
                        L.games[m] = 0, this.bracketData[m][L.name] = [];
                    }
                } catch (t) {
                    k = !0, w = t;
                } finally {
                    try {
                        !b && x.return && x.return();
                    } finally {
                        if (k) throw w;
                    }
                }
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
        this.overlay = !1, this.addData("Standard", function(t) {}), this.setupUI(), this.renderOptions();
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            for (var t = 0; t < this.optionButtons.length; t++) this.optionButtons[t].addEventListener("click", this.buttonTrigger.bind(this));
            var e = PREMIUM ? "inline" : "none";
            document.querySelector("#powerWindow .content-header #brackets").style.display = e, 
            this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this));
        }
    }, {
        key: "buttonTrigger",
        value: function(t) {
            var e = t.target.id;
            "Standard" == e && (this.f = "Standard"), "Wild" == e && (this.f = "Wild"), "ranks" == e && (this.mode = "ranks"), 
            "brackets" == e && (this.mode = "brackets"), this.plot(), this.renderOptions();
        }
    }, {
        key: "pressButton",
        value: function(t) {
            app.ui.powerWindow.display(!1), app.ui.decksWindow.deckLink(t.target.id);
        }
    }, {
        key: "renderOptions",
        value: function() {
            var t = !0, e = !1, a = void 0;
            try {
                for (var i, r = this.optionButtons[Symbol.iterator](); !(t = (i = r.next()).done); t = !0) {
                    var s = i.value;
                    s.classList.remove("highlighted"), s.id == this.mode && s.classList.add("highlighted"), 
                    s.id == this.f && s.classList.add("highlighted");
                }
            } catch (t) {
                e = !0, a = t;
            } finally {
                try {
                    !t && r.return && r.return();
                } finally {
                    if (e) throw a;
                }
            }
        }
    }, {
        key: "addData",
        value: function(t, e) {
            var a = app.ui.ladderWindow.data[t][this.t_ladder[t]], i = app.ui.tableWindow.data[t][this.t_table].ranks_all, r = a.archetypes, s = i.archetypes, n = i.table;
            app.ui.ladderWindow.data[t][this.t_ladder[t]].rankSums;
            this.rankData.rankSums[t] = app.ui.ladderWindow.data[t][this.t_ladder[t]].rankSums;
            var o = !0, l = !1, h = void 0;
            try {
                for (var d, c = range(0, hsRanks)[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                    var u = d.value, y = !0, f = !1, p = void 0;
                    try {
                        for (var v, m = this.rankBrackets[Symbol.iterator](); !(y = (v = m.next()).done); y = !0) {
                            var b = v.value;
                            b.start <= u && b.end >= u && (b.games[t] += this.rankData.rankSums[t][u]);
                        }
                    } catch (t) {
                        f = !0, p = t;
                    } finally {
                        try {
                            !y && m.return && m.return();
                        } finally {
                            if (f) throw p;
                        }
                    }
                }
            } catch (t) {
                l = !0, h = t;
            } finally {
                try {
                    !o && c.return && c.return();
                } finally {
                    if (l) throw h;
                }
            }
            var k = !0, w = !1, g = void 0;
            try {
                for (var x, L = r[Symbol.iterator](); !(k = (x = L.next()).done); k = !0) {
                    var C = x.value, T = s.indexOf(C.name);
                    if (-1 != T) {
                        var S = !0, D = !1, B = void 0;
                        try {
                            for (var W, M = range(0, hsRanks)[Symbol.iterator](); !(S = (W = M.next()).done); S = !0) {
                                var _ = W.value, q = 0, E = 0, I = !0, F = !1, R = void 0;
                                try {
                                    for (var H, A = r[Symbol.iterator](); !(I = (H = A.next()).done); I = !0) {
                                        var O = H.value, P = s.indexOf(O.name);
                                        if (-1 != P) {
                                            var z = O.fr_ranks[_];
                                            q += z, E += z * n[T][P];
                                        }
                                    }
                                } catch (t) {
                                    F = !0, R = t;
                                } finally {
                                    try {
                                        !I && A.return && A.return();
                                    } finally {
                                        if (F) throw R;
                                    }
                                }
                                E = q > 0 ? E / q : 0, this.rankData[t][_].push({
                                    name: C.name,
                                    wr: E,
                                    fr: C.fr_ranks[_],
                                    color: C.color,
                                    fontColor: C.fontColor
                                });
                                var N = !0, G = !1, U = void 0;
                                try {
                                    for (var X, Y = this.rankBrackets[Symbol.iterator](); !(N = (X = Y.next()).done); N = !0) {
                                        var V = X.value, K = this.bracketData[t][V.name];
                                        _ == V.start && K.push({
                                            name: C.name,
                                            wr: E,
                                            fr: C.fr_ranks[_],
                                            color: C.color,
                                            fontColor: C.fontColor,
                                            count: E > 0 ? 1 : 0
                                        }), _ > V.start && _ <= V.end && (K[K.length - 1].wr += E, K[K.length - 1].count += E > 0 ? 1 : 0), 
                                        _ == V.end && K[K.length - 1].count > 0 && (K[K.length - 1].wr /= K[K.length - 1].count);
                                    }
                                } catch (t) {
                                    G = !0, U = t;
                                } finally {
                                    try {
                                        !N && Y.return && Y.return();
                                    } finally {
                                        if (G) throw U;
                                    }
                                }
                            }
                        } catch (t) {
                            D = !0, B = t;
                        } finally {
                            try {
                                !S && M.return && M.return();
                            } finally {
                                if (D) throw B;
                            }
                        }
                    }
                }
            } catch (t) {
                w = !0, g = t;
            } finally {
                try {
                    !k && L.return && L.return();
                } finally {
                    if (w) throw g;
                }
            }
            var j = function(t, e) {
                return t.wr > e.wr ? -1 : t.wr < e.wr ? 1 : 0;
            }, Z = !0, J = !1, Q = void 0;
            try {
                for (var $, tt = range(0, hsRanks)[Symbol.iterator](); !(Z = ($ = tt.next()).done); Z = !0) {
                    var et = $.value;
                    this.rankData[t][et].sort(j);
                }
            } catch (t) {
                J = !0, Q = t;
            } finally {
                try {
                    !Z && tt.return && tt.return();
                } finally {
                    if (J) throw Q;
                }
            }
            var at = !0, it = !1, rt = void 0;
            try {
                for (var st, nt = this.rankBrackets[Symbol.iterator](); !(at = (st = nt.next()).done); at = !0) {
                    var ot = st.value;
                    this.bracketData[t][ot.name].sort(j);
                }
            } catch (t) {
                it = !0, rt = t;
            } finally {
                try {
                    !at && nt.return && nt.return();
                } finally {
                    if (it) throw rt;
                }
            }
            if (this.rankData.fullyLoaded[t] = !0, void 0 != e) return e.apply(this);
        }
    }, {
        key: "checkLoadData",
        value: function(t) {
            var e = void 0 != t;
            if (console.log("checkLoadData", e, t), this.rankData.fullyLoaded[this.f]) return !e || t.apply(this);
            if (!app.ui.ladderWindow.data[this.f].fullyLoaded) {
                console.log("load ladder data from power window");
                return !!e && app.ui.ladderWindow.loadData(this.f, function() {
                    app.ui.powerWindow.checkLoadData(t);
                });
            }
            if (!app.ui.tableWindow.data[this.f].fullyLoaded) {
                console.log("load table data from power window");
                return !!e && app.ui.tableWindow.loadData(this.f, function() {
                    app.ui.powerWindow.checkLoadData(t);
                });
            }
            app.ui.ladderWindow.data[this.f].fullyLoaded && app.ui.tableWindow.data[this.f].fullyLoaded && (console.log("all checks ok"), 
            this.addData(this.f, t));
        }
    }, {
        key: "plot",
        value: function() {
            if (!this.checkLoadData()) return this.renderOptions(), this.checkLoadData(function(t) {
                app.ui.powerWindow.plot();
            });
            this.renderOptions(), "ranks" == this.mode && this.plotRanks(this.f), "brackets" == this.mode && this.plotBrackets(this.f);
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (this.div.style.display = "inline-block", this.f = app.path.hsFormat, this.plot()) : (this.div.style.display = "none", 
            app.path.hsFormat = this.f);
        }
    }, {
        key: "plotRanks",
        value: function(t) {
            for (;this.grid.firstChild; ) this.grid.removeChild(this.grid.firstChild);
            var e = range(0, hsRanks);
            e[0] = "L";
            var a = "1fr ", i = !0, r = !1, s = void 0;
            try {
                for (var n, o = range(0, this.maxElementsPerRank)[Symbol.iterator](); !(i = (n = o.next()).done); i = !0) {
                    n.value;
                    a += "4fr 1fr ";
                }
            } catch (t) {
                r = !0, s = t;
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (r) throw s;
                }
            }
            this.grid.style.gridTemplateColumns = a, this.grid.style.gridGap = "0.1rem";
            (f = document.createElement("div")).className = "header", f.innerHTML = "Rank", 
            this.grid.appendChild(f);
            for (var l = 0; l < this.maxElementsPerRank; l++) {
                (f = document.createElement("div")).className = "header columnTitle", f.innerHTML = "Top " + (l + 1), 
                this.grid.appendChild(f);
            }
            for (l = 0; l < hsRanks; l++) {
                if ((f = document.createElement("div")).className = "pivot", f.innerHTML = e[l], 
                this.grid.appendChild(f), this.rankData.rankSums[t][l] < this.minGames) for (var h = 0; h < this.maxElementsPerRank; h++) {
                    (f = document.createElement("div")).className = "blank", this.grid.appendChild(f), 
                    this.grid.appendChild(document.createElement("div"));
                } else for (h = 0; h < this.maxElementsPerRank; h++) {
                    var d = this.rankData[t][l][h].name, c = (100 * this.rankData[t][l][h].wr).toFixed(1) + "%", u = this.rankData[t][l][h].color, y = this.rankData[t][l][h].fontColor, f = document.createElement("div"), p = document.createElement("button"), v = document.createElement("span");
                    v.className = "tooltipText", v.innerHTML = "R:" + l + " #" + (h + 1) + " " + d, 
                    p.className = "archBtn tooltip", p.id = d, p.style.backgroundColor = u, p.style.color = y, 
                    p.innerHTML = d, p.onclick = this.pressButton.bind(this), f.classList.add("winrate"), 
                    f.innerHTML = c, this.grid.appendChild(p), this.grid.appendChild(f);
                }
            }
        }
    }, {
        key: "plotBrackets",
        value: function(t) {
            for (;this.grid.firstChild; ) this.grid.removeChild(this.grid.firstChild);
            range(0, hsRanks)[0] = "L";
            var e = "", a = !0, i = !1, r = void 0;
            try {
                for (var s, n = this.rankBrackets[Symbol.iterator](); !(a = (s = n.next()).done); a = !0) {
                    s.value;
                    e += "4fr 1fr ";
                }
            } catch (t) {
                i = !0, r = t;
            } finally {
                try {
                    !a && n.return && n.return();
                } finally {
                    if (i) throw r;
                }
            }
            this.grid.style.gridTemplateColumns = e, this.grid.style.gridGap = "0.3rem";
            var o = !0, l = !1, h = void 0;
            try {
                for (var d, c = this.rankBrackets[Symbol.iterator](); !(o = (d = c.next()).done); o = !0) {
                    var u = d.value, y = document.createElement("div");
                    y.className = "header columnTitle", y.innerHTML = u.name, this.grid.appendChild(y);
                }
            } catch (t) {
                l = !0, h = t;
            } finally {
                try {
                    !o && c.return && c.return();
                } finally {
                    if (l) throw h;
                }
            }
            for (var f = 0; f < this.maxElementsPerBracket; f++) {
                var p = !0, v = !1, m = void 0;
                try {
                    for (var b, k = this.rankBrackets[Symbol.iterator](); !(p = (b = k.next()).done); p = !0) {
                        var w = b.value;
                        if (!(this.bracketData[t][w.name].length <= f)) {
                            var g = this.bracketData[t][w.name][f];
                            if (w.games[t] <= this.minGames || void 0 == g) {
                                var x = document.createElement("div");
                                x.className = "blank", this.grid.appendChild(x), this.grid.appendChild(document.createElement("div"));
                            } else {
                                var L = (100 * g.wr).toFixed(1) + "%", C = document.createElement("div"), T = document.createElement("button"), S = document.createElement("span");
                                S.className = "tooltipText", S.innerHTML = "#" + (f + 1) + " " + g.name, T.className = "archBtn tooltip", 
                                T.id = g.name, T.style.backgroundColor = g.color, T.style.color = g.fontColor, T.style.marginLeft = "0.5rem", 
                                T.innerHTML = g.name, T.onclick = this.pressButton.bind(this), C.className = "winrate", 
                                C.innerHTML = L, this.grid.appendChild(T), this.grid.appendChild(C);
                            }
                        }
                    }
                } catch (t) {
                    v = !0, m = t;
                } finally {
                    try {
                        !p && k.return && k.return();
                    } finally {
                        if (v) throw m;
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
}(), t0 = performance.now(), MOBILE = !1;

window.onload = function() {
    window.innerWidth <= 756 && (MOBILE = !0, console.log("mobile")), app = new App();
};

var Table = function() {
    function t(e, a, i, r, s) {
        _classCallCheck(this, t), this.DATA = e, this.f = a, this.t = i, this.r = r, this.window = s, 
        this.sortBy = "", this.numArch = this.window.numArch, this.bgColor = "transparent", 
        this.fontColor = "#22222", this.subplotRatio = .6, this.overallString = '<b style="font-size:130%">Overall</b>', 
        this.minGames = 20, this.whiteTile = .50000001, this.blackTile = .51;
        if (this.colorScales = [ [ [ 0, "#a04608" ], [ .3, "#d65900" ], [ .5, "#FFFFFF" ], [ .7, "#00a2bc" ], [ 1, "#055c7a" ] ], [ [ 0, "#a04608" ], [ .3, "#d65900" ], [ .5, "#FFFFFF" ], [ .7, "#279e27" ], [ 1, "#28733d" ] ], [ [ 0, "#000" ], [ .3, "#222" ], [ .5, "#FFFFFF" ], [ .7, "#888" ], [ 1, "#999" ] ] ], 
        this.table = [], this.textTable = [], this.frequency = [], this.archetypes = [], 
        this.classPlusArch = [], this.winrates = [], this.totGames = 0, this.download = "", 
        void 0 == e) return console.log("table no data:", this.f, this.t, this.r), void (this.numArch = 0);
        var n = e.frequency.slice(), o = e.table.slice(), l = e.archetypes.slice();
        this.numArch = Math.min(this.numArch, l.length);
        var h = range(0, n.length);
        h.sort(function(t, e) {
            return n[t] > n[e] ? -1 : n[t] < n[e] ? 1 : 0;
        });
        for (var d = 0; d < this.numArch; d++) this.table.push(fillRange(0, this.numArch, 0)), 
        this.textTable.push(fillRange(0, this.numArch, ""));
        for (d = 0; d < this.numArch; d++) {
            var c = h[d];
            this.frequency.push(n[c]), this.archetypes.push(l[c][1] + " " + l[c][0]), this.classPlusArch.push(l[c][0] + l[c][1]);
            for (var u = d; u < this.numArch; u++) {
                var y = h[u], f = 0, p = 0, v = 0, m = o[c][y][0], b = o[c][y][1];
                m + b > 0 && (p = m / (m + b));
                var k = o[y][c][1], w = o[y][c][0];
                k + w > 0 && (v = k / (k + w));
                var g = m + k + b + w;
                d == u ? (p = .5, v = .5, f = .5) : f = g < this.minGames ? .5 : m + b > 0 && k + w > 0 ? (p + v) / 2 : m + b == 0 ? v : p;
                var x = l[c][1] + " " + l[c][0], L = l[y][1] + " " + l[y][0];
                this.table[u][d] = 1 - f, this.table[d][u] = f, this.totGames += g, g >= this.minGames ? (this.textTable[d][u] = x + "<br><b>vs:</b> " + L + "<br><b>wr:</b>  " + (100 * f).toFixed(1) + "%  (" + g + ")", 
                this.textTable[u][d] = L + "<br><b>vs:</b> " + x + "<br><b>wr:</b>  " + (100 * (1 - f)).toFixed(1) + "%  (" + g + ")") : (this.textTable[d][u] = x + "<br><b>vs:</b> " + L + "<br><b>wr:</b>  Not enough games", 
                this.textTable[u][d] = L + "<br><b>vs:</b> " + x + "<br><b>wr:</b>  Not enough games");
            }
        }
        var C = 0;
        for (d = 0; d < this.numArch; d++) C += this.frequency[d];
        0 == C && (C = 1, console.log("freqSum = 0"));
        for (d = 0; d < this.numArch; d++) {
            for (f = 0, u = 0; u < this.numArch; u++) f += this.table[d][u] * this.frequency[u];
            this.winrates.push(f / C);
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
            width: MOBILE ? 2 * app.ui.width : this.window.width,
            height: MOBILE ? .8 * app.ui.height : this.window.height,
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
            t = this.frequency.slice();
            for (var a = 0, i = [], r = 0; r < t.length; r++) a += t[r];
            for (r = 0; r < t.length; r++) t[r] = t[r] / a, i.push("FR: " + (100 * t[r]).toFixed(1) + "%");
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
            if ("simulation" == this.window.mode) return this.simulation();
            "" != this.sortBy && this.sortBy == this.window.sortBy || this.sortTableBy(this.window.sortBy, !1);
            for (var t = this.table.concat([ this.winrates ]), e = this.archetypes.concat([ this.overallString ]), a = [], i = this.textTable.concat([ a ]), r = 0; r < t[0].length; r++) a.push(this.archetypes[r] + "<br>Overall wr: " + (100 * this.winrates[r]).toFixed(1) + "%");
            var s = {
                type: "heatmap",
                z: t,
                x: this.archetypes,
                y: e,
                text: i,
                hoverinfo: "text",
                colorscale: this.colorScales[MU_COLOR_IDX],
                showscale: !1
            }, n = {
                visible: !1,
                x: this.archetypes,
                y: range(0, this.numArch),
                xaxis: "x",
                yaxis: "y2",
                type: "line",
                hoverinfo: "x+y"
            }, o = {
                visible: !1,
                x: this.archetypes,
                y: range(0, this.numArch),
                xaxis: "x",
                yaxis: "y2",
                type: "line",
                hoverinfo: "x+y"
            }, l = {
                x: [],
                y: [],
                text: [],
                mode: "text",
                font: {
                    color: "#9c9c9c",
                    size: 8
                },
                hoverinfo: "none"
            }, h = !0, d = !1, c = void 0;
            try {
                for (var u, y = range(0, this.numArch)[Symbol.iterator](); !(h = (u = y.next()).done); h = !0) {
                    var f = u.value;
                    l.x.push(this.archetypes[f]), l.y.push(this.archetypes[f]), l.text.push(" X ");
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
            var p = [ s, n, o ];
            this.window.annotated ? p.push(this.getAnnotations()) : p.push(l), Plotly.newPlot("chart2", p, this.layout, {
                displayModeBar: !1
            }), PREMIUM && document.getElementById("chart2").on("plotly_click", this.zoomToggle.bind(this)), 
            this.window.zoomIn && this.zoomIn(this.window.zoomArch), document.getElementById("loader").style.display = "none", 
            this.window.nrGames = this.totGames, this.window.setTotGames();
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
                for (var a = [], i = 0; i < e.length; i++) a.push("WR: " + (100 * e[i]).toFixed(1) + "%"), 
                e[i] -= .5;
                var r = {
                    type: "bar",
                    x: [ this.archetypes ],
                    y: [ e ],
                    text: [ a ],
                    visible: !0,
                    hoverinfo: "text",
                    marker: {
                        color: "#222"
                    }
                };
                Plotly.restyle("chart2", r, 2);
            }
        }
    }, {
        key: "zoomToggle",
        value: function(t) {
            console.log("click", t);
            var e = t.points.length, a = t.points[e - 1].y;
            0 == this.window.zoomIn ? this.zoomIn(a) : this.zoomOut();
        }
    }, {
        key: "zoomIn",
        value: function(t) {
            var e = this.archetypes.indexOf(t);
            if (t == this.overallString && (e = this.numArch), -1 != e) {
                var a = {
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
                Plotly.relayout("chart2", a), this.subPlotFR(), this.subPlotWR(e);
                var i = document.querySelector("#tableWindow #matchup");
                document.querySelector("#tableWindow #winrate");
                i.style.display = "inline-block", t == this.overallString && (i.style.display = "none"), 
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
            var e = document.querySelector("#tableWindow #matchup"), a = document.querySelector("#tableWindow #winrate");
            e.style.display = "none", a.style.display = "inline-block", this.window.zoomIn = !1;
        }
    }, {
        key: "sortTableBy",
        value: function(t) {
            var e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
            if (this.sortBy != t || this.window.zoomIn) {
                var a = range(0, this.numArch), i = this.archetypes.indexOf(this.window.zoomArch), r = this;
                "winrate" == t && a.sort(function(t, e) {
                    return r.winrates[t] > r.winrates[e] ? -1 : r.winrates[t] < r.winrates[e] ? 1 : 0;
                }), "matchup" == t && a.sort(function(t, e) {
                    return r.table[i][t] > r.table[i][e] ? -1 : r.table[i][t] < r.table[i][e] ? 1 : 0;
                }), "frequency" == t && a.sort(function(t, e) {
                    return r.frequency[t] > r.frequency[e] ? -1 : r.frequency[t] < r.frequency[e] ? 1 : 0;
                }), "class" == t && a.sort(function(t, e) {
                    return r.classPlusArch[t] < r.classPlusArch[e] ? -1 : r.classPlusArch[t] > r.classPlusArch[e] ? 1 : 0;
                });
                var s = [], n = [], o = [], l = [], h = [], d = [], c = !0, u = !1, y = void 0;
                try {
                    for (var f, p = range(0, this.numArch)[Symbol.iterator](); !(c = (f = p.next()).done); c = !0) {
                        var v = a[f.value];
                        d.push(this.classPlusArch[v]), o.push(this.archetypes[v]), l.push(this.frequency[v]), 
                        h.push(this.winrates[v]);
                        var m = [], b = [], k = !0, w = !1, g = void 0;
                        try {
                            for (var x, L = range(0, this.numArch)[Symbol.iterator](); !(k = (x = L.next()).done); k = !0) {
                                var C = x.value;
                                m.push(this.table[v][a[C]]), b.push(this.textTable[v][a[C]]);
                            }
                        } catch (t) {
                            w = !0, g = t;
                        } finally {
                            try {
                                !k && L.return && L.return();
                            } finally {
                                if (w) throw g;
                            }
                        }
                        s.push(m), n.push(b);
                    }
                } catch (t) {
                    u = !0, y = t;
                } finally {
                    try {
                        !c && p.return && p.return();
                    } finally {
                        if (u) throw y;
                    }
                }
                this.table = s, this.textTable = n, this.archetypes = o, this.classPlusArch = d, 
                this.frequency = l, this.winrates = h, this.sortBy = t, this.window.sortBy = t, 
                this.getFreqPlotData(), this.window.renderOptions(), e && this.plot();
            } else console.log("already sorted by " + t);
        }
    }, {
        key: "downloadCSV",
        value: function() {
            this.download = " %2C";
            for (var t = 0; t < this.numArch; t++) this.download += this.archetypes[t] + "%2C";
            this.download += "%0A";
            for (t = 0; t < this.numArch; t++) {
                this.download += this.archetypes[t] + "%2C";
                for (var e = 0; e < this.numArch; e++) this.download += this.table[t][e] + "%2C";
                this.download += "%0A";
            }
            this.download += "Overall%2C";
            for (t = 0; t < this.numArch; t++) this.download += this.winrates[t] + "%2C";
            this.download += "Frequency%2C";
            for (t = 0; t < this.numArch; t++) this.download += this.freqPlotData.y[t] + "%2C";
            var a = document.createElement("a");
            a.setAttribute("href", "data:text/plain;charset=utf-8," + this.download), a.setAttribute("download", "matchupTable.csv"), 
            a.style.display = "none", document.body.appendChild(a), a.click(), document.body.removeChild(a);
        }
    }, {
        key: "getAnnotations",
        value: function() {
            var t = app.ui.width >= 900 ? 1 : 0, e = {
                x: [],
                y: [],
                text: [],
                mode: "text",
                font: {
                    color: "black",
                    size: 8
                },
                hoverinfo: "none"
            }, a = !0, i = !1, r = void 0;
            try {
                for (var s, n = range(0, this.numArch)[Symbol.iterator](); !(a = (s = n.next()).done); a = !0) {
                    var o = s.value;
                    e.x.push(this.archetypes[o]), e.y.push(this.overallString), e.text.push((100 * this.winrates[o]).toFixed(t) + "%");
                    for (var l = 0; l < this.numArch; l++) {
                        e.x.push(this.archetypes[o]), e.y.push(this.archetypes[l]);
                        var h = o == l ? " X " : (100 * this.table[l][o]).toFixed(t) + "%";
                        e.text.push(h);
                    }
                }
            } catch (t) {
                i = !0, r = t;
            } finally {
                try {
                    !a && n.return && n.return();
                } finally {
                    if (i) throw r;
                }
            }
            return e;
        }
    }, {
        key: "simulation",
        value: function() {
            app.ui.showLoader(), this.window.mode = "simulation";
            var t = this.freqPlotData, e = t.x[0], a = t.y[0], i = 0, r = !0, s = !1, n = void 0;
            try {
                for (var o, l = a[Symbol.iterator](); !(r = (o = l.next()).done); r = !0) {
                    i += o.value;
                }
            } catch (t) {
                s = !0, n = t;
            } finally {
                try {
                    !r && l.return && l.return();
                } finally {
                    if (s) throw n;
                }
            }
            for (var h = this.table, d = {
                title: "Meta Simulation",
                xaxis: {
                    type: "log",
                    autorange: !0,
                    title: "Iteration step of simulation (logarithmically)",
                    opacity: .5
                },
                yaxis: {
                    range: [ 0, 1 ],
                    title: "Share of Meta",
                    opacity: .5
                },
                hovermode: "closest",
                plot_bgcolor: "transparent",
                paper_bgcolor: this.bgColor
            }, c = [], u = 0; u < e.length; u++) c.push({
                idx: u,
                itt: 0,
                name: e[u],
                fr: a[u] / i,
                trace: [],
                wr: .5
            });
            for (var y = 0; y < 5e4; y++) this.eq_wr(c, h), this.eq_fr(c);
            for (var f = [], p = 0; p < c.length; p++) {
                var v = c[p], m = app.ui.getArchColor(null, v.name, this.f).color, b = {
                    name: v.name,
                    x: range(0, 5e4),
                    y: v.trace,
                    fill: "tonexty",
                    fillcolor: m,
                    type: "scatter",
                    mode: "none",
                    marker: {
                        size: 0,
                        line: {
                            size: 0
                        }
                    }
                };
                f.push(b);
            }
            Plotly.newPlot("chart2", this.stackedArea(f), d), app.ui.hideLoader();
        }
    }, {
        key: "stackedArea",
        value: function(t) {
            for (var e = 1; e < t.length; e++) for (var a = 0; a < Math.min(t[e].y.length, t[e - 1].y.length); a++) t[e].y[a] += t[e - 1].y[a];
            return t;
        }
    }, {
        key: "eq_wr",
        value: function(t, e) {
            for (var a = 0; a < t.length; a++) {
                t[a].wr = 0;
                for (var i = 0; i < t.length; i++) t[a].wr += e[a][i] * t[i].fr;
            }
        }
    }, {
        key: "eq_fr",
        value: function(t) {
            t.sort(function(t, e) {
                return t.wr < e.wr ? -1 : t.wr > e.wr ? 1 : 0;
            });
            for (var e = 0; e < t.length; e++) t[e].trace.push(t[e].fr);
            for (var a = 0; a < t.length; a++) {
                var i = t[a];
                if (!(i.wr > .5)) {
                    var r = i.fr * (.5 - i.wr) * .1;
                    r = i.fr - r >= 1e-4 ? r : i.fr - 1e-4, i.fr -= r;
                    for (var s = r / (t.length - a - 1), n = a + 1; n < t.length; n++) t[n].fr += s;
                }
            }
            t.sort(function(t, e) {
                return t.idx < e.idx ? -1 : t.idx > e.idx ? 1 : 0;
            });
        }
    } ]), t;
}(), TableWindow = function() {
    function t(e) {
        _classCallCheck(this, t), this.div = document.querySelector("#tableWindow"), this.tab = document.querySelector("#table.tab"), 
        this.optionButtons = document.querySelectorAll("#tableWindow .optionBtn"), this.questionBtn = document.querySelector("#tableWindow .question"), 
        this.overlayDiv = document.querySelector("#tableWindow .overlay"), this.overlayP = document.querySelector("#tableWindow .overlayText"), 
        this.nrGamesP = document.querySelector("#tableWindow .nrGames"), this.nrGamesBtn = document.querySelector("#tableWindow .content-header #showNumbers"), 
        this.simulationBtn = document.querySelector("#tableWindow .equilibriumBtn"), this.firebasePath = PREMIUM ? "premiumData/tableData" : "data/tableData", 
        this.data = {}, this.mode = "matchup", this.hsFormats = hsFormats, this.hsTimes = PREMIUM ? table_times_premium : table_times, 
        this.ranks = PREMIUM ? table_ranks_premium : table_ranks, this.sortOptions = PREMIUM ? table_sortOptions_premium : table_sortOptions, 
        this.numArch = 16, this.annotated = !1, this.nrGames = 0, this.colorTheme = 0, this.overlayText = {}, 
        this.overlayText.matchup = "\n            Here you can see how your deck on the left hand side performs against any other deck on the top. \n            The colors range  from favorable <span class='blue'>blue</span> to unfavorable <span class='red'>red</span>.<br><br>\n            The matchup table lists the top " + this.numArch + " most frequent decks within the selected time and rank brackets.<br><br>\n            The hover info lists the number of games recorded for that specific matchup in the (parenthesis).<br><br>\n            The 'Overall' line at the bottom shows the overall winrate of the opposing decks in the specified time and rank bracket.<br><br>\n            Sorting the table displays the most frequent/ highest winrate deck in the top left. Changing the format, time or rank brackets automatically sorts the table.<br><br>\n            <img src='Images/muSort.png'></img>\n            \n            <br><br><br><br>\n            Click on a matchup to 'zoom in'. Click again to 'zoom out'.<br><br>\n            In the zoomed in view you see only one deck on the left side.<br><br>\n            Additionally there are 2 subplots displaying the frequency of the opposing decks (brown line chart) and the specific matchup as black bar charts.<br><br>\n            Changing any parameter (Format, time, rank, sorting) keeps you zoomed into the same archetype if possible.<br><br>\n            You can additionally sort 'by Matchup' while zoomed in.<br><br>\n        ", 
        this.overlayText.simulation = "\n            The simulation simulates the meta if all players would rationally switch from weaker to stronger decks according to the current meta.<br><br>\n            &#8226 The x axis shows the simulation over time (simulation steps)<br>\n            &#8226 The y axis shows the percentage of the meta an archetype occupies at a particular time.<br><br>\n            Click on any button to go back to the Matchup chart.\n        ", 
        this.width = document.querySelector(".main-wrapper").offsetWidth - 40, this.height = .94 * document.querySelector("#ladderWindow .content").offsetHeight, 
        this.f = this.hsFormats[0], this.t = "last2Weeks", this.r = this.ranks[0], this.sortBy = this.sortOptions[0], 
        this.zoomIn = !1, this.zoomArch = null, this.fullyLoaded = !1, this.overlay = !1, 
        this.minGames = 1e3;
        var a = !0, i = !1, r = void 0;
        try {
            for (var s, n = this.hsFormats[Symbol.iterator](); !(a = (s = n.next()).done); a = !0) {
                var o = s.value;
                this.data[o] = {
                    fullyLoaded: !1
                };
                var l = !0, h = !1, d = void 0;
                try {
                    for (var c, u = this.hsTimes[Symbol.iterator](); !(l = (c = u.next()).done); l = !0) {
                        var y = c.value;
                        this.data[o][y] = {};
                        var f = !0, p = !1, v = void 0;
                        try {
                            for (var m, b = this.ranks[Symbol.iterator](); !(f = (m = b.next()).done); f = !0) {
                                var k = m.value;
                                this.data[o][y][k] = null;
                            }
                        } catch (t) {
                            p = !0, v = t;
                        } finally {
                            try {
                                !f && b.return && b.return();
                            } finally {
                                if (p) throw v;
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
            i = !0, r = t;
        } finally {
            try {
                !a && n.return && n.return();
            } finally {
                if (i) throw r;
            }
        }
        this.loadData("Standard", e), this.setupUI();
    }
    return _createClass(t, [ {
        key: "setupUI",
        value: function() {
            this.dropdownFolders = {
                format: document.querySelector("#tableWindow .content-header #formatFolder .dropdown"),
                time: document.querySelector("#tableWindow .content-header #timeFolder .dropdown"),
                rank: document.querySelector("#tableWindow .content-header #rankFolder .dropdown"),
                sort: document.querySelector("#tableWindow .content-header #sortFolder .dropdown")
            };
            var t = function(t) {
                var e = t.toElement || t.relatedTarget;
                e.parentNode != this && e != this && this.classList.add("hidden");
            };
            for (var e in this.dropdownFolders) {
                var a = this.dropdownFolders[e];
                a.innerHTML = "", a.onmouseout = t;
            }
            var i = !0, r = !1, s = void 0;
            try {
                for (var n, o = this.hsFormats[Symbol.iterator](); !(i = (n = o.next()).done); i = !0) {
                    var l = n.value;
                    (D = document.createElement("button")).innerHTML = btnIdToText[l], D.id = l, D.className = "folderBtn optionBtn";
                    var h = function(t) {
                        this.f = t.target.id, this.plot();
                    };
                    D.onclick = h.bind(this), this.dropdownFolders.format.appendChild(D);
                }
            } catch (t) {
                r = !0, s = t;
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (r) throw s;
                }
            }
            var d = !0, c = !1, u = void 0;
            try {
                for (var y, f = this.hsTimes[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                    var p = y.value;
                    (D = document.createElement("button")).innerHTML = btnIdToText[p], D.id = p, D.className = "folderBtn optionBtn";
                    h = function(t) {
                        this.t = t.target.id, this.plot();
                    };
                    D.onclick = h.bind(this), this.dropdownFolders.time.appendChild(D);
                }
            } catch (t) {
                c = !0, u = t;
            } finally {
                try {
                    !d && f.return && f.return();
                } finally {
                    if (c) throw u;
                }
            }
            var v = !0, m = !1, b = void 0;
            try {
                for (var k, w = this.ranks[Symbol.iterator](); !(v = (k = w.next()).done); v = !0) {
                    var g = k.value;
                    (D = document.createElement("button")).innerHTML = btnIdToText[g], D.id = g, D.className = "folderBtn optionBtn";
                    h = function(t) {
                        this.r = t.target.id, this.plot();
                    };
                    D.onclick = h.bind(this), this.dropdownFolders.rank.appendChild(D);
                }
            } catch (t) {
                m = !0, b = t;
            } finally {
                try {
                    !v && w.return && w.return();
                } finally {
                    if (m) throw b;
                }
            }
            var x = !0, L = !1, C = void 0;
            try {
                for (var T, S = this.sortOptions[Symbol.iterator](); !(x = (T = S.next()).done); x = !0) {
                    var D, B = T.value;
                    (D = document.createElement("button")).innerHTML = btnIdToText[B], D.id = B, D.className = "folderBtn optionBtn";
                    h = function(t) {
                        this.sortBy = t.target.id, this.data[this.f][this.t][this.r].sortTableBy(this.sortBy), 
                        this.renderOptions();
                    };
                    D.onclick = h.bind(this), this.dropdownFolders.sort.appendChild(D);
                }
            } catch (t) {
                L = !0, C = t;
            } finally {
                try {
                    !x && S.return && S.return();
                } finally {
                    if (L) throw C;
                }
            }
            if (this.questionBtn.addEventListener("click", this.toggleOverlay.bind(this)), this.overlayDiv.addEventListener("click", this.toggleOverlay.bind(this)), 
            this.nrGamesBtn.onclick = this.annotate.bind(this), document.querySelector("#tableWindow #changeColor").onclick = this.updateColorTheme.bind(this), 
            PREMIUM) {
                this.simulationBtn.onclick = this.simulation.bind(this);
                document.querySelector("#tableWindow .downloadBtn").addEventListener("click", function() {
                    this.data[this.f][this.t][this.r].downloadCSV();
                }.bind(this));
            }
        }
    }, {
        key: "display",
        value: function(t) {
            t ? (this.div.style.display = "inline-block", this.f = app.path.hsFormat, this.plot()) : (this.div.style.display = "none", 
            app.path.hsFormat = this.f);
        }
    }, {
        key: "checkLoadData",
        value: function(t) {
            return this.data[this.f].fullyLoaded ? void 0 == t || t.apply(this) : void 0 != t && void this.loadData(this.f, t);
        }
    }, {
        key: "plot",
        value: function() {
            if ("none" != this.div.style.display) {
                if (!this.checkLoadData()) return this.renderOptions(), this.checkLoadData(function(t) {
                    app.ui.tableWindow.plot();
                });
                this.data[this.f][this.t][this.r].plot(), this.renderOptions();
            }
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
        }
    }, {
        key: "loadData",
        value: function(t, e) {
            app.fb_db.ref(this.firebasePath + "/" + t).on("value", function(a) {
                this.readData(a, t, e);
            }.bind(this), function(t) {
                return console.log("Could not load Table Data", t);
            });
        }
    }, {
        key: "readData",
        value: function(t, e, a) {
            var i = t.val(), r = !0, s = !1, n = void 0;
            try {
                for (var o, l = this.hsTimes[Symbol.iterator](); !(r = (o = l.next()).done); r = !0) {
                    var h = o.value, d = !0, c = !1, u = void 0;
                    try {
                        for (var y, f = this.ranks[Symbol.iterator](); !(d = (y = f.next()).done); d = !0) {
                            var p = y.value;
                            this.data[e][h][p] = new Table(i[h][p], e, h, p, this);
                        }
                    } catch (t) {
                        c = !0, u = t;
                    } finally {
                        try {
                            !d && f.return && f.return();
                        } finally {
                            if (c) throw u;
                        }
                    }
                }
            } catch (t) {
                s = !0, n = t;
            } finally {
                try {
                    !r && l.return && l.return();
                } finally {
                    if (s) throw n;
                }
            }
            this.fullyLoaded = !0, this.data[e].fullyLoaded = !0, console.log("table loaded: " + (performance.now() - t0).toFixed(2) + " ms"), 
            this.renderOptions(), a.apply(this);
        }
    }, {
        key: "toggleOverlay",
        value: function() {
            this.overlay ? (this.overlayDiv.style.display = "none", this.overlay = !1) : (this.overlayP.innerHTML = this.overlayText[this.mode], 
            this.overlayDiv.style.display = "block", this.overlay = !0);
        }
    }, {
        key: "updateColorTheme",
        value: function() {
            MU_COLOR_IDX = (MU_COLOR_IDX + 1) % 3, this.data[this.f][this.t][this.r].plot();
        }
    }, {
        key: "simulation",
        value: function() {
            var t = document.querySelector("#tableWindow .chartFooterBtn.equilibrium");
            "simulation" == this.mode ? (t.classList.remove("highlighted"), this.mode = "matchup") : (t.classList.add("highlighted"), 
            this.mode = "simulation"), this.plot();
        }
    } ]), t;
}(), UI = function() {
    function t() {
        _classCallCheck(this, t), this.tabs = document.querySelectorAll("button.tab"), this.mobileBtns = document.querySelectorAll("button.mobileBtn"), 
        this.windowTabs = document.querySelectorAll(".tabWindow"), this.folderButtons = document.querySelectorAll(".folder-toggle"), 
        this.loader = document.getElementById("loader"), this.logo = document.querySelector("#vsLogoDiv"), 
        this.overlayText = document.querySelector("#overlay .overlayText"), this.updateTimeDiv = document.querySelector("#updateTime");
        var e = !0, a = !1, i = void 0;
        try {
            for (var r, s = this.windowTabs[Symbol.iterator](); !(e = (r = s.next()).done); e = !0) {
                r.value.style.display = "none";
            }
        } catch (t) {
            a = !0, i = t;
        } finally {
            try {
                !e && s.return && s.return();
            } finally {
                if (a) throw i;
            }
        }
        this.windowTabs[0].style.display = "inline-block", this.getWindowSize(), this.tabIdx = 0, 
        this.openFolder = null, this.overlay = !1, this.decksWindow = null, this.tableWindow = null, 
        this.ladderWindow = null, this.powerWindow = null, this.infoWindow = null, this.archetypeColors = {};
        var n = !0, o = !1, l = void 0;
        try {
            for (var h, d = hsFormats[Symbol.iterator](); !(n = (h = d.next()).done); n = !0) {
                var c = h.value;
                this.archetypeColors[c] = {};
                var u = !0, y = !1, f = void 0;
                try {
                    for (var p, v = hsClasses[Symbol.iterator](); !(u = (p = v.next()).done); u = !0) {
                        var m = p.value;
                        this.archetypeColors[c][m] = {
                            count: 0
                        };
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
            }
        } catch (t) {
            o = !0, l = t;
        } finally {
            try {
                !n && d.return && d.return();
            } finally {
                if (o) throw l;
            }
        }
        var b = !0, k = !1, w = void 0;
        try {
            for (var g, x = this.tabs[Symbol.iterator](); !(b = (g = x.next()).done); b = !0) {
                g.value.addEventListener("click", this.toggleTabs.bind(this));
            }
        } catch (t) {
            k = !0, w = t;
        } finally {
            try {
                !b && x.return && x.return();
            } finally {
                if (k) throw w;
            }
        }
        var L = !0, C = !1, T = void 0;
        try {
            for (var S, D = this.folderButtons[Symbol.iterator](); !(L = (S = D.next()).done); L = !0) {
                S.value.addEventListener("click", this.toggleDropDown.bind(this));
            }
        } catch (t) {
            C = !0, T = t;
        } finally {
            try {
                !L && D.return && D.return();
            } finally {
                if (C) throw T;
            }
        }
        if (MOBILE) {
            var B = !0, W = !1, M = void 0;
            try {
                for (var _, q = this.mobileBtns[Symbol.iterator](); !(B = (_ = q.next()).done); B = !0) {
                    _.value.addEventListener("click", this.mobileMenu.bind(this));
                }
            } catch (t) {
                W = !0, M = t;
            } finally {
                try {
                    !B && q.return && q.return();
                } finally {
                    if (W) throw M;
                }
            }
            detectswipe(".navbar", this.swipeTab.bind(this)), document.querySelector("#ladderWindow .content-header .nrGames").style.display = "none", 
            this.hideLoader();
        }
        this.logo.addEventListener("click", this.toggleOverlay.bind(this)), document.querySelector("#overlay").addEventListener("click", this.toggleOverlay.bind(this)), 
        window.addEventListener("orientationchange", this.getWindowSize.bind(this)), window.addEventListener("resize", this.getWindowSize.bind(this)), 
        this.toggleOverlay(), this.updateTime();
    }
    return _createClass(t, [ {
        key: "toggleTabs",
        value: function(t) {
            0 != app.phase && t.target != app.path.window.tab && this.display(t.target.id + "Window");
        }
    }, {
        key: "display",
        value: function(t) {
            console.log("load", t), this[t] != app.path.window && (null != app.path.window && app.path.window.display(!1), 
            app.path.window = this[t], app.path.window.display(!0), this.renderTabs());
        }
    }, {
        key: "deckLink",
        value: function(t) {
            app.path.arch = t, console.log("Decklink", t), null != app.path.window && app.path.window.display(!1), 
            app.path.window = this.decksWindow, this.decksWindow.deckLink(t), this.renderTabs();
        }
    }, {
        key: "renderTabs",
        value: function() {
            var t = !0, e = !1, a = void 0;
            try {
                for (var i, r = this.tabs[Symbol.iterator](); !(t = (i = r.next()).done); t = !0) {
                    i.value.classList.remove("highlighted");
                }
            } catch (t) {
                e = !0, a = t;
            } finally {
                try {
                    !t && r.return && r.return();
                } finally {
                    if (e) throw a;
                }
            }
            app.path.window.tab.classList.add("highlighted");
        }
    }, {
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
            "l" == e && (this.tabIdx += 1, this.tabIdx >= this.tabs.length && (this.tabIdx = 0));
        }
    }, {
        key: "updateTime",
        value: function() {
            var t = new Date(), e = t.getMinutes();
            e < 10 && (e = "0" + e), this.updateTimeDiv.innerHTML = t.getHours() + ":" + e;
        }
    }, {
        key: "toggleDropDown",
        value: function(t) {
            for (var e = t.target.nextElementSibling, a = 0; null != e && !(e.classList.contains("dropdown") || a > 10); ) a += 1, 
            e = e.nextElementSibling;
            null != e && (e == this.openFolder ? this.openFolder = null : null != this.openFolder && (this.openFolder.classList.toggle("hidden"), 
            this.openFolder = e), e.classList.toggle("hidden"));
        }
    }, {
        key: "mobileMenu",
        value: function(t) {
            console.log("mobile menu");
            var e = t.target, a = !0, i = !1, r = void 0;
            try {
                for (var s, n = this.tabs[Symbol.iterator](); !(a = (s = n.next()).done); a = !0) {
                    var o = s.value;
                    o.id == e.id && (this.activeTab = o, this.activeWindow = document.getElementById(o.id + "Window"), 
                    this.renderTabs(), this.renderWindows());
                }
            } catch (t) {
                i = !0, r = t;
            } finally {
                try {
                    !a && n.return && n.return();
                } finally {
                    if (i) throw r;
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
    }, {
        key: "getArchColor",
        value: function(t, e, a) {
            if (-1 != hsClasses.indexOf(e)) return {
                color: hsColors[e],
                fontColor: hsFontColors[e]
            };
            var i = void 0;
            if (t) i = e + " " + t; else {
                i = e;
                var r = !0, s = !1, n = void 0;
                try {
                    for (var o, l = hsClasses[Symbol.iterator](); !(r = (o = l.next()).done); r = !0) {
                        var h = o.value;
                        if (-1 != i.indexOf(h)) {
                            t = h;
                            break;
                        }
                    }
                } catch (t) {
                    s = !0, n = t;
                } finally {
                    try {
                        !r && l.return && l.return();
                    } finally {
                        if (s) throw n;
                    }
                }
            }
            if (i in this.archetypeColors[a]) return {
                color: hsArchColors[t][this.archetypeColors[a][i]],
                fontColor: hsFontColors[t]
            };
            this.archetypeColors[a][i] = this.archetypeColors[a][t].count;
            var d = this.archetypeColors[a][t].count;
            this.archetypeColors[a][t].count = (d + 1) % 5;
            return {
                color: hsArchColors[t][this.archetypeColors[a][i]],
                fontColor: hsFontColors[t]
            };
        }
    } ]), t;
}(), overlayText1 = "\n\n<span style='font-size:200%;font-weight:bold;padding-left:2rem;'>Greetings Travelers,</span><br><br><br>\n\nWelcome to the VS Live web app where you can explore the newest Hearthstone data and find \n\nout about frequency and win rates of your favorite decks.<br><br>\n\nTo get more information on the current tab simply click on the \n\n    <div class='fa fa-question-circle' style='display:inline-block'></div>\n\nicon in the top right corner.<br><br>\n\nUpgrade to vS Gold to visit the gold version of this app. Check the link more information:<br><br><br>\n\n<button id='basicBtn'>BASIC</button>\n<img src='Images/arrow.png' class='arrow'>\n<a href=" + VSGOLDINFOLINK + " target=\"_blank\">\n<button id='premiumBtn'>GOLD</button>\n</a>\n\n<br><br>\n\nTo give feedback simply click on the discord link below:<br><br><br>\n\n<a href=" + DISCORDLINK + '\n   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n\n', overlayText2 = "\n\n<span style='font-size:200%;font-weight:bold;padding-left:2rem'>Greetings Travelers,</span><br><br><br>\n\nWelcome to the VS Live web app where you can explore the newest Hearthstone data and find \n\nout about frequency and win rates of your favorite decks.<br><br>\n\nTo get more information on the current tab simply click on the \n\n    <div class='fa fa-question-circle' style='display:inline-block'></div>\n\nicon in the top right corner.<br><br>\n\nThank you for using vS Live Gold.\n\n<br><br>\n\nTo give feedback simply click on the discord link below:<br><br><br>\n\n<a href=" + DISCORDLINK + '\n   target="_blank"><img class=\'discordLogo\' src="Images/discordLogo.png"></a><br><br>\n\n';