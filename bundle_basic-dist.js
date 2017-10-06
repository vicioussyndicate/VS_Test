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
        }), console.log(t, "user login " + (performance.now() - t0).toFixed(2) + " ms, Premium:", PREMIUM)) : (console.log("not logged in"), 
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

function reloadPremium() {
    PREMIUM || (ui.showLoader(), ui.loggedIn = !1, setupFirebase());
}

function reloadBasic() {
    PREMIUM && (ui.showLoader(), ui.loggedIn = !1, setupFirebase());
}

function finishedLoading() {
    tableWindow.fullyLoaded && ladderWindow.fullyLoaded && (powerWindow = new PowerWindow(), 
    decksWindow = new DecksWindow(hsFormats), powerWindow.plot(), tableWindow.plot(), 
    ui.fullyLoaded = !0, ui.hideLoader(), console.log("App initializing took " + (performance.now() - t0) + " ms."));
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
        var w = document.createElement("p");
        w.className = "author", w.innerHTML = "Author: " + e.author, this.deckinfo.appendChild(w);
        var k = document.createElement("p");
        if (k.className = "timestamp", k.innerHTML = "created " + e.timestamp, this.deckinfo.appendChild(k), 
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
    a.style.paddingLeft = "0.2rem", a.style.paddingTop = "0.35rem");
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
        this.questionBtn = document.querySelector("#decksWindow .question"), this.overlayText = "\n            Select <span class='optionBtn'>Description</span> to see the latest Data Reaper Report article on that class.\n            Select <span class='optionBtn'>Deck Lists</span> to see the latest Data Reaper Report deck lists on that class.<br><br>\n            Select any archetype on the left side to see all the decklists of that archetype.<br><br>\n            Tips:<br><br>\n            • When you hover over a card of a decklist it highlights all cards with the same name in the other decklists.<br><br>\n            • Hover over the decklist title to reveal the 'copy' and 'info' options.<br><br>\n            • 'copy' copies the deckcode to your clipboard.<br><br>\n            • 'info' shows information on the mana curve, cardtypes and more.\n        ", 
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
                                        var w = p.value;
                                        this.data[o][u].archetypes.push({
                                            name: w,
                                            hsClass: u,
                                            hsFormat: o,
                                            decklists: []
                                        });
                                        var k = this.data[o][u].archetypes.length - 1, g = t[o][u].archetypes[w], T = Object.keys(g), C = !0, x = !1, L = void 0;
                                        try {
                                            for (var S, W = T[Symbol.iterator](); !(C = (S = W.next()).done); C = !0) {
                                                var _ = S.value;
                                                g[_];
                                                this.data[o][u].archetypes[k].decklists.push(g[_]);
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
            var e, i, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Standard";
            this.mode = "decklists", this.f = r;
            var a = !0, s = !1, o = void 0;
            try {
                for (var n, l = hsClasses[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
                    var h = n.value;
                    -1 != t.indexOf(h) && (e = h);
                    var d = this.data[r][h].archetypes, c = !0, u = !1, y = void 0;
                    try {
                        for (var f, m = d[Symbol.iterator](); !(c = (f = m.next()).done); c = !0) {
                            var v = f.value;
                            if (v.name == t) {
                                e = h, i = v;
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
            void 0 == e && (e = "Druid"), void 0 == i && (i = null, this.mode = "description"), 
            this.hsClass = e, this.hsArch = i, this.plot(), this.renderOptions();
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
            for (var t = this.window.f, e = this.window.t, i = "lastDay" == this.window.t || "last12Hours" == this.window.t || "last6Hours" == this.window.t ? "lastHours" : "lastDays", r = "lastHours" == i ? "Hour" : "Day", a = this.window.r, s = this.window.mode, o = range(1, this.x[e] + 1), n = this.data[t][i][a][s], l = 0, h = [], d = [], c = [], u = 0, y = n[n.length - 1].data.slice(), f = 0; f < this.x[e] && f < y.length; f++) u += y[f];
            n.sort(function(t, e) {
                return t.avg > e.avg ? -1 : t.avg < e.avg ? 1 : 0;
            });
            for (f = 0; f < this.top; f++) {
                var m, v = n[f].name;
                m = "classes" == s ? {
                    color: hsColors[v],
                    fontColor: hsFontColors[v]
                } : this.window.getArchColor(0, v, this.window.f), c.push({
                    name: v,
                    color: m.color,
                    fontColor: m.fontColor
                });
                for (var p = "lastHours" == i ? this.smoothData(n[f].data) : n[f].data, b = [], w = 0; w < p.length; w++) {
                    var k = w > 0 ? r + "s" : r;
                    b.push(n[f].name + " (" + (100 * p[w]).toFixed(1) + "% )<br>" + o[w] + " " + k + " ago"), 
                    p[w] > l && (l = p[w]);
                }
                var g = "lastHours" == i ? range(1, o.length + 1) : range(0, o.length);
                d.push({
                    x: g,
                    y: fillRange(0, p.length, 0),
                    text: b,
                    line: {
                        width: 2.5,
                        simplify: !1
                    },
                    marker: {
                        color: m.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                }), h.push({
                    x: g,
                    y: p.slice(),
                    text: b,
                    line: {
                        width: 2.5
                    },
                    marker: {
                        color: m.color
                    },
                    type: "scatter",
                    mode: "lines",
                    hoverinfo: "text"
                });
            }
            var T = [];
            if ("lastHours" == i) for (var C = new Date().getHours(), f = 0; f < o.length; f++) if (f % 3 == 0 || 1 == f) {
                var x = parseInt((C + 24 - f) % 24);
                T.push(x + ":00");
            } else T.push("");
            if ("lastDays" == i) for (var C = new Date(), f = 0; f < o.length; f++) f % 4 == 0 || 0 == f ? (C.setDate(C.getDate() - 1), 
            T.push(C.getDate() + "." + C.getMonth() + ".")) : T.push("");
            this.layout.yaxis.range = [ 0, 1.1 * l ], this.layout.xaxis.tickvals = range(0, o.length), 
            this.layout.xaxis.ticktext = T, this.layout.xaxis.tickangle = "xLabels", this.layout.xaxis.range = [ this.x[e] + 1, 2 ], 
            Plotly.newPlot("chart1", d, this.layout, {
                displayModeBar: !1
            }), this.window.setGraphTitle(), this.createLegend(c), this.window.setTotGames(u), 
            Plotly.animate("chart1", {
                data: h,
                traces: range(0, h.length),
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
        key: "smoothData",
        value: function(t) {
            for (var e = [], i = 0; i < t.length; i++) {
                var r = 0, a = 0;
                i > 0 && (a += .3 * t[i - 1], r += .3), i < t.length - 1 && (a += .3 * t[i + 1], 
                r += .3), a += t[i] * (1 - r), e.push(a);
            }
            return e;
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
            for (var w, k = this.tiers[Symbol.iterator](); !(v = (w = k.next()).done); v = !0) {
                var g = w.value;
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
                    for (var W, _ = hsClasses[Symbol.iterator](); !(x = (W = _.next()).done); x = !0) it = W.value, 
                    C.push(hsColors[it]);
                } catch (t) {
                    L = !0, S = t;
                } finally {
                    try {
                        !x && _.return && _.return();
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
                !v && k.return && k.return();
            } finally {
                if (p) throw b;
            }
        }
        var B = e.archetypes, D = e.gamesPerRank;
        this.rankSums = e.gamesPerRank;
        for (var I = this.smoothLadder(e.rankData, D.slice()), E = this.smoothLadder(e.classRankData, D.slice()), q = 0; q < hsRanks; q++) {
            q % 5 == 0 ? this.rankLabels.push(q + "  ") : this.rankLabels.push(""), this.totGames += D[q];
            var H = !0, A = !1, F = void 0;
            try {
                for (var R, O = this.tiers[Symbol.iterator](); !(H = (R = O.next()).done); H = !0) q >= (g = R.value).start && q <= g.end && (this.totGamesRanks[g.buttonId] += D[q]);
            } catch (t) {
                A = !0, F = t;
            } finally {
                try {
                    !H && O.return && O.return();
                } finally {
                    if (A) throw F;
                }
            }
        }
        this.rankLabels[0] = "L  ";
        for (q = 0; q < B.length; q++) {
            var P = [], z = [], N = [], G = 0, U = B[q][1] + " " + B[q][0].replace("§", ""), Y = hsClasses.indexOf(B[q][0]), X = this.window.getArchColor(B[q][0], B[q][1], this.f), V = X.fontColor;
            X = X.color;
            for (st = 0; st < hsRanks; st++) {
                ot = I[st][q];
                z.push(ot), N.push("<b>" + U + "     </b><br>freq: " + (100 * ot).toFixed(1) + "%"), 
                ot < this.fr_min && q > 8 && (this.traces_bar.decks[Y].y[st] += ot, ot = 0), G += ot, 
                P.push(ot);
                var j = !0, Z = !1, K = void 0;
                try {
                    for (var J, Q = this.tiers[Symbol.iterator](); !(j = (J = Q.next()).done); j = !0) if (st == (g = J.value).start && (this.traces_pie.decks[g.buttonId][0].values.push(ot), 
                    this.traces_pie.decks[g.buttonId][0].labels.push(U), this.traces_pie.decks[g.buttonId][0].marker.colors.push(X)), 
                    st > g.start && st <= g.end && (this.traces_pie.decks[g.buttonId][0].values[q] += ot), 
                    st == g.end) {
                        this.traces_pie.decks[g.buttonId][0].values[q] /= g.end - g.start + 1, this.traces_pie.decks[g.buttonId][0].text.push(U);
                        var $ = this.traces_pie.decks[g.buttonId][0].values[q];
                        $ < this.fr_min && q > 8 && (this.traces_pie.decks[g.buttonId][0].values[q] = 0, 
                        this.traces_pie.decks[g.buttonId][0].values[Y] += $);
                    }
                } catch (t) {
                    Z = !0, K = t;
                } finally {
                    try {
                        !j && Q.return && Q.return();
                    } finally {
                        if (Z) throw K;
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
                    color: X
                },
                type: "bar",
                winrate: 0,
                hsClass: B[q][0] + B[q][1]
            }, et = {
                x: range(0, hsRanks),
                y: z.slice(),
                name: U,
                text: N,
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
                hsClass: B[q][0] + B[q][1],
                fr: G
            };
            this.traces_bar.decks.push(tt), this.traces_line.decks.push(et), this.archLegend.push({
                name: U,
                hsClass: B[q][0],
                color: X,
                fontColor: V,
                fr: G
            }), this.archetypes.push({
                name: U,
                hsClass: B[q][0],
                fr: G,
                data: z.slice(),
                color: X,
                fontColor: V
            });
        }
        for (q = 0; q < 9; q++) {
            for (var it = hsClasses[q], rt = [], at = [], G = 0, st = 0; st < hsRanks; st++) {
                var ot = E[st][q];
                rt.push(ot), at.push(it + " " + (100 * ot).toFixed(2) + "%"), G += ot;
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
                for (var vt, pt = this.archetypes[Symbol.iterator](); !(yt = (vt = pt.next()).done); yt = !0) if ((xt = vt.value).hsClass == it) {
                    for (st = 0; st < hsRanks; st++) ut[st] += xt.data[st];
                    var bt = {
                        x: range(0, hsRanks),
                        y: xt.data.slice(),
                        name: xt.name,
                        text: xt.name,
                        hoverinfo: "text",
                        marker: {
                            color: xt.color
                        },
                        type: "bar",
                        winrate: 0,
                        hsClass: it
                    };
                    this.traces_zoom[it].push(bt);
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
            var wt = !0, kt = !1, gt = void 0;
            try {
                for (var Tt, Ct = this.traces_zoom[it][Symbol.iterator](); !(wt = (Tt = Ct.next()).done); wt = !0) for (var xt = Tt.value, st = 0; st < hsRanks; st++) xt.y[st] /= ut[st] > 0 ? ut[st] : 1;
            } catch (t) {
                kt = !0, gt = t;
            } finally {
                try {
                    !wt && Ct.return && Ct.return();
                } finally {
                    if (kt) throw gt;
                }
            }
            G /= hsRanks, this.c_data[it] = rt.slice();
            var Lt = {
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
            }, St = {
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
                fr: G
            };
            this.traces_bar.classes.push(Lt), this.traces_line.classes.push(St), this.classLegend.push({
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
        var Wt = function(t, e) {
            return t.hsClass < e.hsClass ? -1 : t.hsClass > e.hsClass ? 1 : 0;
        }, _t = function(t, e) {
            return t.fr > e.fr ? -1 : t.fr < e.fr ? 1 : 0;
        };
        this.traces_bar.classes.sort(Wt), this.traces_line.classes.sort(_t), this.traces_line.classes.splice(this.maxLines), 
        this.traces_bar.decks.sort(Wt), this.traces_line.decks.sort(_t), this.traces_line.decks.splice(this.maxLines), 
        this.archLegend.sort(_t), this.archetypes.sort(_t);
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
            if (this.window.hideRankFolder(), "pie" == this.window.plotType && (this.window.showRankFolder(), 
            e = this.layout_pie, t = this.traces_pie[this.window.mode][this.window.r]), "number" == this.window.plotType) return this.createTable(this.window.mode), 
            void this.window.setGraphTitle();
            "bar" == this.window.plotType && (e = this.layout_bar, t = this.traces_bar[this.window.mode]), 
            "zoom" == this.window.plotType && (e = this.layout_bar, t = this.traces_zoom[this.window.zoomClass]), 
            "line" == this.window.plotType && (e = this.layout_line, t = this.traces_line[this.window.mode]), 
            "portrait" == MOBILE && "pie" != this.window.plotTyp && (e.width = 2 * ui.width, 
            e.height = .6 * ui.height), Plotly.newPlot("chart1", t, e, {
                displayModeBar: !1
            }), this.window.setGraphTitle();
            var i = "pie" != this.window.plotType ? this.totGames : this.totGamesRanks[this.window.r];
            this.window.setTotGames(i), this.createLegend(this.window.mode), "bar" != this.window.plotType && "zoom" != this.window.plotType || !PREMIUM || document.getElementById("chart1").on("plotly_click", this.zoomToggle.bind(this));
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
            var e;
            if (t) {
                for (var i = [], r = 0; r < hsRanks; r++) {
                    var a = {
                        x: r,
                        y: .5,
                        xref: "x",
                        yref: "y",
                        textangle: 90,
                        text: this.rankSums[r],
                        showarrow: !1,
                        bgcolor: "rgba(0,0,0,0.3)",
                        font: {
                            color: "white"
                        },
                        opacity: .8
                    };
                    i.push(a);
                }
                e = {
                    annotations: i
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
                    this.window.addLegendItem(o.name);
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
            var e = document.createElement("button");
            e.innerHTML = "Download <div class='fa fa-cloud-download'></div>", e.className = "download", 
            e.addEventListener("click", this.downloadCSV.bind(this)), t.appendChild(e);
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
        this.totGamesDiv = document.querySelector("#ladderWindow .content-header .nrGames"), 
        this.graphTitle = document.querySelector("#ladderWindow .graphTitle"), this.graphLabel = document.querySelector("#ladderWindow .graphLabel"), 
        this.rankFolder = document.querySelector("#ladderWindow .content-header #rankBtn"), 
        this.optionButtons = document.querySelectorAll("#ladderWindow .optionBtn"), this.questionBtn = document.querySelector("#ladderWindow .question"), 
        this.overlayDiv = document.querySelector("#ladderWindow .overlay"), this.overlayP = document.querySelector("#ladderWindow .overlayText"), 
        this.chartFooter = document.querySelector("#ladderWindow .chart-footer"), this.firebasePath = PREMIUM ? "premiumData/ladderData" : "data/ladderData", 
        this.firebaseHistoryPath = PREMIUM ? "premiumData/historyData" : "", this.overlayText = {}, 
        this.overlayText.bar = "\n        This stacked bar graph displays the class/ deck frequencies on the y-axis and the ranks on the ranked ladder on the x-axis.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' deck of that class.<br><br>\n        Tips:<br><br>\n        • Hover over the 'number of games' label in the header to display the number of games per rank on the bar plot.<br><br>\n        • Click on one bar of any class to 'zoom in' to display all the archetypes of that class. Click again to 'zoom out'.<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.zoom = this.overlayText.bar, this.overlayText.line = "\n        This line graph displays the class/ deck frequencies on the y-axis and the ranks on the ranked ladder on the x-axis.<br><br>\n        In <span class='optionBtn'>Decks</span> mode the chart displays the 9 most frequent decks.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.pie = "\n        This pie graph displays the class/ deck frequencies as pie slices. You can vary the rank brackets in the header.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' deck of that class.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.overlayText.number = "\n        This table displays the class/ deck frequencies over ladder ranks (rank 20 - Legend). You can vary the rank brackets in the header.<br><br>\n        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' deck of that class.<br><br>\n        Click on the \"download\" button at the bottom of the graph to download the data as '.csv' file.<br><br>\n        ", 
        this.overlayText.timeline = "\n        This line graph displays the class/ deck frequencies on the y-axis and time (in hours or days) on the x-axis.<br><br>\n        If you choose 'Last Day', 'Last 6 Hours' or 'Last 12 Hours' the time unit is in 'Hours' whereas for 'Last 3 Days' etc. it's in 'Days'.<br><br>\n        The 'Hours' lines have been averaged between +/- 1 Hour to make for a smoother curve.<br><br>\n        In <span class='optionBtn'>Decks</span> mode the chart displays the 9 most frequent decks.<br><br>\n        Tips:<br><br>\n        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>\n        ", 
        this.fontColor = "#222", this.fontColorLight = "#999", this.overlay = !1, this.colorScale_c1 = [ 255, 255, 255 ], 
        this.colorScale_c2 = [ 87, 125, 186 ], this.colorScale_f = .15, this.archetypeColors = {
            Standard: {},
            Wild: {}
        }, this.data = {}, this.hsFormats = e, this.hsTimes = i, this.ranks = r, this.archColors = {};
        var a = !0, s = !1, o = void 0;
        try {
            for (var n, l = this.hsFormats[Symbol.iterator](); !(a = (n = l.next()).done); a = !0) {
                k = n.value;
                this.archColors[k] = {};
                var h = !0, d = !1, c = void 0;
                try {
                    for (var u, y = hsClasses[Symbol.iterator](); !(h = (u = y.next()).done); h = !0) {
                        var f = u.value;
                        this.archColors[k][f] = {
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
        this.fullyLoaded = !1, this.history = null, this.zoomClass = null;
        var m = !0, v = !1, p = void 0;
        try {
            for (var b, w = this.hsFormats[Symbol.iterator](); !(m = (b = w.next()).done); m = !0) {
                var k = b.value;
                this.data[k] = {};
                var g = !0, T = !1, C = void 0;
                try {
                    for (var x, L = this.hsTimes[Symbol.iterator](); !(g = (x = L.next()).done); g = !0) {
                        var S = x.value;
                        this.data[k][S] = null;
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
                !m && w.return && w.return();
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
            var p = !0, b = !1, w = void 0;
            try {
                for (var k, g = this.ranks[Symbol.iterator](); !(p = (k = g.next()).done); p = !0) {
                    var T = k.value, C = document.createElement("button");
                    C.className = "optionBtn folderBtn", C.innerHTML = btnIdToText[T], C.id = T;
                    C.onclick = function(t) {
                        this.r = t.target.id, this.plot();
                    }.bind(this), document.querySelector("#ladderWindow #rankFolder .dropdown").appendChild(C);
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
            this.classDeckOptions.style.display = x, document.querySelector("#ladderWindow .content-header .graphOptions #line").style.display = x, 
            document.querySelector("#ladderWindow .content-header .graphOptions #number").style.display = x, 
            document.querySelector("#ladderWindow .content-header .graphOptions #timeline").style.display = x, 
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
            var t = !0, e = !1, i = void 0;
            try {
                for (var r, a = this.optionButtons[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                    var s = r.value;
                    s.classList.remove("highlighted"), s.id == this.mode && s.classList.add("highlighted"), 
                    s.id == this.plotType && s.classList.add("highlighted");
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
            this.fullyLoaded && (PREMIUM || ("pie" == this.plotType && (this.classDeckOptions.style.display = "inline"), 
            "bar" == this.plotType && (this.classDeckOptions.style.display = "none", this.mode = "classes")), 
            this.renderOptions(), "timeline" != this.plotType ? this.data[this.f][this.t].plot() : this.history.plot());
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
            } : (this.archColors[i][r] = this.archColors[i][t].count, this.archColors[i][t].count += 1, 
            this.archColors[i][t].count > 4 && (this.archColors[i][t].count = 4), {
                color: hsArchColors[t][this.archColors[i][r]],
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
            var t = "classes" == this.mode ? "Class" : "Deck", e = ([ "lastDay", "last6Hours", "last12Hours" ].indexOf(this.t), 
            btnIdToText[this.r]);
            switch (this.plotType) {
              case "bar":
                this.graphTitle.innerHTML = "Class Frequency vs Ranks", this.graphLabel.innerHTML = "Ranks >";
                break;

              case "line":
                this.graphTitle.innerHTML = t + " Frequency vs Ranks", this.graphLabel.innerHTML = "Ranks >";
                break;

              case "pie":
                this.graphTitle.innerHTML = t + " Frequency of " + e, this.graphLabel.innerHTML = "";
                break;

              case "number":
                this.graphTitle.innerHTML = t + " Frequency vs Ranks", this.graphLabel.innerHTML = "";
                break;

              case "timeline":
                this.graphTitle.innerHTML = t + " Frequency over Time", this.graphLabel.innerHTML = "";
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
}(), ladder_times = [ "lastDay", "last2Weeks" ], ladder_times_premium = [ "last6Hours", "last12Hours", "lastDay", "last3Days", "lastWeek", "last2Weeks" ], ladder_ranks = [ "ranks_all" ], ladder_ranks_premium = [ "ranks_all", "ranks_L_5", "ranks_6_15" ], ladder_plotTypes = [], table_times = [ "last2Weeks" ], table_times_premium = [ "last3Days", "lastWeek", "last2Weeks" ], table_sortOptions = [ "frequency" ], table_sortOptions_premium = [ "frequency", "class", "winrate", "matchup" ], table_ranks = [ "ranks_all" ], table_ranks_premium = [ "ranks_all", "ranks_L_5", "ranks_6_15" ], hsRanks = 21, hsClasses = [ "Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior" ], hsFormats = [ "Standard", "Wild" ], rankRange = {
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
}, colorscale_Table = [ [ 0, "#a04608" ], [ .3, "#d65900" ], [ .5, "#FFFFFF" ], [ .7, "#00a2bc" ], [ 1, "#055c7a" ] ], hsColors = {
    Druid: "#674f3a",
    Hunter: "#b0c404",
    Mage: "#83d8df",
    Paladin: "#ffe551",
    Priest: "#cacfb3",
    Rogue: "#1e291f",
    Shaman: "#0b72ca",
    Warlock: "#892667",
    Warrior: "#ec4441"
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
}, PowerWindow = function() {
    function t() {
        _classCallCheck(this, t), this.grid = document.querySelector("#powerGrid"), this.optionButtons = document.querySelectorAll("#powerWindow .optionBtn"), 
        this.questionBtn = document.querySelector("#powerWindow .question"), this.overlayDiv = document.querySelector("#powerWindow .overlay"), 
        this.overlayP = document.querySelector("#powerWindow .overlayText"), this.f = "Standard", 
        this.mode = "tiers", this.t_ladder = "lastDay", this.t_table = "last2Weeks", this.top = 5, 
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
            var e = ladderWindow.data[t][this.t_ladder].archetypes, i = tableWindow.data[t][this.t_table].ranks_all;
            this.data.rankSums[t] = ladderWindow.data[t][this.t_ladder].rankSums;
            for (E = 0; E < hsRanks; E++) {
                var r = !0, a = !1, s = void 0;
                try {
                    for (var o, n = this.tiers[Symbol.iterator](); !(r = (o = n.next()).done); r = !0) (B = o.value).start <= E && B.end >= E && (B.games[t] += this.data.rankSums[t][E]);
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
                        var m = 0, v = 0, p = !0, b = !1, w = void 0;
                        try {
                            for (var k, g = e[Symbol.iterator](); !(p = (k = g.next()).done); p = !0) {
                                var T = k.value, C = i.archetypes.indexOf(T.name);
                                if (-1 != C) {
                                    var x = T.data[E];
                                    m += x, v += x * i.table[f][C];
                                }
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
                        0 != m ? v /= m : v = 0, this.data[t][E].push({
                            name: y.name,
                            wr: v,
                            fr: y.data[E],
                            color: y.color,
                            fontColor: y.fontColor
                        });
                        var L = !0, S = !1, W = void 0;
                        try {
                            for (var _, M = this.tiers[Symbol.iterator](); !(L = (_ = M.next()).done); L = !0) {
                                var B = _.value, D = this.tierData[t][B.name];
                                E == B.start && D.push({
                                    name: y.name,
                                    wr: v,
                                    fr: y.data[E],
                                    color: y.color,
                                    fontColor: y.fontColor
                                }), E > B.start && E <= B.end && (D[D.length - 1].wr += v), E == B.end && (D[D.length - 1].wr /= B.end - B.start + 1);
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
            for (var I = function(t, e) {
                return t.wr > e.wr ? -1 : t.wr < e.wr ? 1 : 0;
            }, E = 0; E < hsRanks; E++) this.data[t][E].sort(I);
            var q = !0, H = !1, A = void 0;
            try {
                for (var F, R = this.tiers[Symbol.iterator](); !(q = (F = R.next()).done); q = !0) {
                    B = F.value;
                    this.tierData[t][B.name].sort(I);
                }
            } catch (t) {
                H = !0, A = t;
            } finally {
                try {
                    !q && R.return && R.return();
                } finally {
                    if (H) throw A;
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
                        var y = c.value, f = this.tierData[t][y.name][i];
                        if (y.games[t] <= this.minGames || void 0 == f) (v = document.createElement("div")).className = "blank", 
                        this.grid.appendChild(v), this.grid.appendChild(document.createElement("div")); else {
                            var m = (100 * f.wr).toFixed(1) + "%", v = document.createElement("div"), p = document.createElement("button"), b = document.createElement("span");
                            b.className = "tooltipText", b.innerHTML = "#" + (i + 1) + " " + f.name, p.className = "archBtn tooltip", 
                            p.id = f.name, p.style.backgroundColor = f.color, p.style.color = f.fontColor, p.style.marginLeft = "0.5rem", 
                            p.innerHTML = f.name, p.onclick = this.pressButton.bind(this), v.className = "winrate", 
                            v.innerHTML = m, this.grid.appendChild(p), this.grid.appendChild(v);
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
        this.minGames = 20, this.table = [], this.textTable = [], this.frequency = [], this.archetypes = [], 
        this.classPlusArch = [], this.winrates = [], this.totGames = 0, this.download = "";
        var o = e.frequency.slice(), n = e.table.slice(), l = e.archetypes.slice();
        this.numArch > l.length && (this.numArch = l.length);
        var h = range(0, o.length);
        h.sort(function(t, e) {
            return o[t] > o[e] ? -1 : o[t] < o[e] ? 1 : 0;
        }), h.splice(this.numArch);
        for (T = 0; T < this.numArch; T++) this.table.push(fillRange(0, this.numArch, 0)), 
        this.textTable.push(fillRange(0, this.numArch, ""));
        for (T = 0; T < this.numArch; T++) {
            var d = h[T];
            this.frequency.push(o[d]), this.archetypes.push(l[d][1] + " " + l[d][0]), this.classPlusArch.push(l[d][0] + l[d][1]);
            for (x = T; x < this.numArch; x++) {
                var c = h[x], u = 0, y = 0, f = n[d][c][0], m = n[d][c][1];
                f + m > 0 && (u = f / (f + m));
                var v = n[c][d][1], p = n[c][d][0];
                v + p > 0 && (y = v / (v + p));
                var b = f + v + m + p;
                T == x && (u = .5, y = .5);
                C = 0;
                C = b < this.minGames ? .5 : f + m > 0 && v + p > 0 ? (u + y) / 2 : f + m == 0 ? y : u;
                var w = l[d][1] + " " + l[d][0], k = l[c][1] + " " + l[c][0];
                this.table[T][x] = C, this.table[x][T] = 1 - C, this.totGames += b, b >= this.minGames ? (this.textTable[T][x] = w + "<br><b>vs:</b> " + k + "<br><b>wr:</b>  " + (100 * C).toFixed(0) + "%  (" + b + ")", 
                this.textTable[x][T] = k + "<br><b>vs:</b> " + w + "<br><b>wr:</b>  " + (100 * (1 - C)).toFixed(0) + "%  (" + b + ")") : (this.textTable[T][x] = w + "<br><b>vs:</b> " + k + "<br><b>wr:</b>  Not enough games", 
                this.textTable[x][T] = k + "<br><b>vs:</b> " + w + "<br><b>wr:</b>  Not enough games");
            }
        }
        for (var g = 0, T = 0; T < this.numArch; T++) g += this.frequency[T];
        0 == g && (g = 1, console.log("freqSum = 0"));
        for (T = 0; T < this.numArch; T++) {
            for (var C = 0, x = 0; x < this.numArch; x++) C += this.table[T][x] * this.frequency[x];
            this.winrates.push(C / g);
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
            }), PREMIUM && document.getElementById("chart2").on("plotly_click", this.zoomToggle.bind(this)), 
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
            for (t = 0; t < this.numArch; t++) this.download += this.archetypes[t] + "%2C";
            this.download += "%0A";
            for (var t = 0; t < this.numArch; t++) {
                this.download += this.archetypes[t] + "%2C";
                for (var e = 0; e < this.numArch; e++) this.download += this.table[t][e] + "%2C";
                this.download += "%0A";
            }
            var i = document.createElement("a");
            i.setAttribute("href", "data:text/plain;charset=utf-8," + this.download), i.setAttribute("download", "matchupTable.csv"), 
            i.style.display = "none", document.body.appendChild(i), i.click(), document.body.removeChild(i);
        }
    } ]), t;
}(), TableWindow = function() {
    function t(e, i, r, a) {
        _classCallCheck(this, t), this.firebasePath = PREMIUM ? "premiumData/tableData" : "data/tableData", 
        this.window = document.querySelector("#ladderWindow"), this.optionButtons = document.querySelectorAll("#tableWindow .optionBtn"), 
        this.questionBtn = document.querySelector("#tableWindow .question"), this.overlayDiv = document.querySelector("#tableWindow .overlay"), 
        this.overlayP = document.querySelector("#tableWindow .overlayText"), this.data = {}, 
        this.hsFormats = e, this.hsTimes = i, this.ranks = r, this.sortOptions = a, this.top = 16, 
        this.overlayText = "\n            Here you can see how your deck on the left hand side performs against any other deck on the top. \n            The colors range  from favorable <span class='blue'>blue</span> to unfavorable <span class='red'>red</span>.<br><br>\n            The matchup table lists the top " + this.top + " most frequent decks within the selected time and rank brackets.<br><br>\n            The hover info lists the number of games recorded for that specific matchup in the (parenthesis).<br><br>\n            The 'Overall' line at the bottom shows the overall winrate of the opposing decks in the specified time and rank bracket.<br><br>\n            Sorting the table displays the most frequent/ highest winrate deck in the top left. Changing the format, time or rank brackets automatically sorts the table.<br><br>\n            <img src='Images/muSort.png'></img>\n            \n            <br><br><br><br>\n            Click on a matchup to 'zoom in'. Click again to 'zoom out'.<br><br>\n            In the zoomed in view you see only one deck on the left side.<br><br>\n            Additionally there are 2 subplots displaying the frequency of the opposing decks (brown line chart) and the specific matchup as black bar charts.<br><br>\n            Changing any parameter (Format, time, rank, sorting) keeps you zoomed into the same archetype if possible.<br><br>\n            You can additionally sort 'by Matchup' while zoomed in.<br><br>\n        ", 
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
                        var p = !0, b = !1, w = void 0;
                        try {
                            for (var k, g = this.ranks[Symbol.iterator](); !(p = (k = g.next()).done); p = !0) {
                                var T = k.value;
                                this.data[d][v][T] = null;
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
            var b = !0, w = !1, k = void 0;
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
                w = !0, k = t;
            } finally {
                try {
                    !b && T.return && T.return();
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
            this.fullyLoaded && this.data[this.f][this.t][this.r].plot();
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
                                        var w = p.value;
                                        this.data[n][y][w] = new Table(e[n][y][w], n, y, w, this);
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
    } ]), t;
}(), UI = function() {
    function t() {
        _classCallCheck(this, t), this.tabs = document.querySelectorAll("button.tab"), this.mobileBtns = document.querySelectorAll("button.mobileBtn"), 
        this.windows = document.querySelectorAll(".tabWindow"), this.folderButtons = document.querySelectorAll(".folder-toggle"), 
        this.loader = document.getElementById("loader"), this.logo = document.querySelector("#vsLogoDiv"), 
        this.overlayText = document.querySelector("#overlay .overlayText"), this.getWindowSize(), 
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
            this.overlayText.innerHTML = overlayText1, this.overlay ? (document.getElementById("overlay").style.display = "none", 
            this.overlay = !1) : (document.getElementById("overlay").style.display = "block", 
            this.overlay = !0);
        }
    } ]), t;
}(), overlayText1 = "\n\n<span style='font-size:180%;padding-left:2rem'>Greetings Travelers,</span><br><br><br>\n\nWelcome to the VS Live web app where you can explore the newest Hearthstone data and find \n\nout about frequncey and winrates of your favorite decks.<br><br>\n\nTo get more information on the current tab simply click on the \n\n    <div class='fa fa-question-circle' style='display:inline-block'></div>\n\nicon in the top right corner.<br><br>\n\nThis app is currently in BETA. That's why until the <span class='highlight'>15. 10. 2017</span> you can check out the Premium version for free:<br><br><br>\n\n<button id='basicBtn'>BASIC</button>\n<img src='Images/arrow.png' class='arrow'>\n<button id='premiumBtn'>PREMIUM</button>\n\n<br><br><br>\n\nTo give feedback simply click on the reddit link below:<br><br><br>\n\n<a href=\"https://www.reddit.com/r/ViciousSyndicate/comments/6yqj62/vs_live_web_app_feedback_thread/\"\n   target=\"_blank\"><img class='redditLogo' src=\"Images/redditLogo.png\"></a><br><br>\n\n\n";