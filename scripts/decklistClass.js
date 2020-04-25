class Decklist {
  constructor(dl, hsClass, window) {
    this.name = dl.name;

    this.hsClass = hsClass;
    this.window = window;

    this.cards = [];
    this.dust = 0;
    this.manaBin = fillRange(0, 11, 0);
    this.showInfo = false;

    this.div = document.createElement("div");
    this.div.className = "deckBox";
    this.div.id = dl.name;

    this.deckTitle = document.createElement("div");
    this.deckTitle.className = "deckTitle";
    this.deckTitle.innerHTML = "<p>" + dl.name + "</p>";
    this.deckTitle.style.backgroundColor = hsColors[this.hsClass];
    this.deckTitle.style.color = hsFontColors[this.hsClass];

    let titleHover = document.createElement("div");
    titleHover.className = "titleHover";

    this.infoBtn = document.createElement("div");
    this.infoBtn.className = "titleHover-content right";
    this.infoBtn.innerHTML = "info";
    this.infoBtn.onclick = this.toggleInfo.bind(this);

    this.copyBtn = document.createElement("div");
    this.copyBtn.className = "titleHover-content left";
    this.copyBtn.innerHTML = "copy";
    this.copyBtn.id = "dl" + randint(0, 1000000000);

    titleHover.appendChild(this.copyBtn);
    titleHover.appendChild(this.infoBtn);
    this.deckTitle.appendChild(titleHover);

    new Clipboard("#" + this.copyBtn.id, {
      text: function (trigger) {
        return dl.deckCode;
      },
    });

    // Cards

    this.decklist = document.createElement("div");
    this.decklist.className = "decklist";
    this.decklist.id = dl.name;
    let rarityDistribution = {}; // common: 0, rare: 0, etc
    for (let rarity in cardDust) {
      rarityDistribution[rarity] = 0;
    }

    for (let card of dl.cards) {
      rarityDistribution[card.rarity] += 1;

      let c = new CardDiv(card);
      if (!MOBILE) {
        c.hoverDiv.onmouseover = this.window.highlight.bind(this.window);
        c.hoverDiv.onmouseout = this.window.highlight.bind(this.window);
      }
      this.cards.push(c);
      this.dust += c.dust * c.quantity;
      let cost = Math.min(c.cost, 10);
      this.manaBin[cost] += parseInt(c.quantity);
      this.decklist.appendChild(c.div);
    }

    // Info

    this.deckinfo = document.createElement("div");
    this.deckinfo.className = "decklist deckinfo";
    this.deckinfo.id = dl.name;

    let chartTitle = document.createElement("p");
    chartTitle.innerHTML = "Manacurve";
    chartTitle.className = "manacurve";
    this.deckinfo.appendChild(chartTitle);

    this.chart = document.createElement("div");
    //this.chartId = 'chartId:' + randint(0,100000000)
    this.chart.id = "chartId_" + randint(0, 100000000); //this.chartId
    this.chart.className = "manaChart";
    this.deckinfo.appendChild(this.chart);

    let dustDiv = document.createElement("div");
    dustDiv.className = "dustDiv";
    let dustInfo = document.createElement("p");
    dustInfo.innerHTML = this.dust + "  ";
    dustInfo.className = "dustInfo";
    let dustImg = document.createElement("img");
    dustImg.src = "Images/dust.png";
    dustImg.className = "dustImg";

    dustDiv.appendChild(dustInfo);
    dustDiv.appendChild(dustImg);
    for (let rarity in cardDust) {
      let p = document.createElement("p");
      p.className = "dustInfo";
      p.innerHTML = rarityDistribution[rarity];

      let gem = document.createElement("img");
      gem.className = "dustImg";
      gem.src = "Images/dust.png"; // replace with rarity gems

      dustDiv.appendChild(p);
      dustDiv.appendChild(gem);
    }

    this.deckinfo.appendChild(dustDiv);

    let cardTypes = document.createElement("p");
    cardTypes.className = "cardtypes";
    let text = "";
    for (let key in dl.cardTypes) {
      let num = dl.cardTypes[key];
      text += num;
      text += num >= 10 ? " " : "  ";
      text += key;
      text += num > 1 || num == 0 ? "s<br>" : "<br>";
    }

    cardTypes.innerHTML = text;
    this.deckinfo.appendChild(cardTypes);

    // var winrate = document.createElement('p')
    // winrate.className = 'winrate'
    // winrate.innerHTML = 'Win Rate: '+ dl.wr
    // this.deckinfo.appendChild(winrate)

    let author = document.createElement("p");
    author.className = "author";
    author.innerHTML = "Author: " + dl.author;
    this.deckinfo.appendChild(author);

    var timeStamp = document.createElement("p");
    timeStamp.className = "timestamp";
    timeStamp.innerHTML = "Updated " + dl.timestamp;
    this.deckinfo.appendChild(timeStamp);

    this.div.appendChild(this.deckTitle);
    this.div.appendChild(this.decklist);
    this.div.appendChild(this.deckinfo);
  }

  findCard(cardName) {
    for (let card of this.cards) {
      if (card.name == cardName) {
        return card.quantity;
      }
    }
    return 0;
  }

  classify(cardName, clf) {
    // adds classifier to card className for the 'compare' mode
    for (let card of this.cards) {
      if (card.name == cardName) {
        switch (clf) {
          case "core_x1":
            if (card.rarity == "Legendary") {
              card.classify("core");
              break;
            }
            if (card.quantity == 1) {
              card.classify("core");
              break;
            }
            if (card.quantity == 2) {
              card.classify("semiCore");
              break;
            }
            break;

          case "core_x2":
            card.classify("core");
            break;

          case "some":
            card.classify("");
            break;

          case "unique":
            card.classify("unique");
            break;
        }
        break;
      }
    }
  }

  // removes classifier className
  declassify() {
    for (let card of this.cards) {
      card.classify("");
    }
  }

  highlight(cardName) {
    for (let c of this.cards) {
      let hl = 0;
      if (c.name + "x1" == cardName) {
        hl = 1;
      }
      if (c.name + "x2" == cardName) {
        hl = 2;
      }

      if (hl == 0) {
        c.div.classList.remove("highlighted");
        c.div.classList.remove("half-highlighted");
        continue;
      }

      if (hl == c.quantity) {
        c.div.classList.add("highlighted");
      } else {
        c.div.classList.add("half-highlighted");
      }
    }
  }

  toggleInfo(bool) {
    if (bool != true && bool != false) {
      bool = !this.showInfo;
    }

    if (!bool) {
      this.decklist.style.display = "block";
      this.deckinfo.style.display = "none";
      this.infoBtn.innerHTML = "info";
      this.showInfo = false;
    } else {
      this.decklist.style.display = "none";
      this.deckinfo.style.display = "block";
      this.infoBtn.innerHTML = "cards";
      this.showInfo = true;
      this.plot();
    }
  }

  plot() {
    var trace = {
      x: range(0, this.manaBin.length),
      y: this.manaBin,
      type: "bar",
    };
    var layout = {
      xaxis: { fixedrange: true },
      yaxis: { fixedrange: true },
      margin: { l: 16, r: 11, b: 25, t: 0 },
    };
    Plotly.newPlot(this.chart.id, [trace], layout, { displayModeBar: false });
  }
} // decklist

// CardDiv as decklist item
class CardDiv {
  constructor(card) {
    this.name = card.name;
    this.cost = card.manaCost;
    this.quantity = card.quantity;
    this.rarity = card.rarity;
    this.dust = cardDust[this.rarity];

    this.div = document.createElement("div");
    this.div.className = "card";
    this.div.id = this.name;

    this.hoverDiv = document.createElement("div");
    this.hoverDiv.className = "hoverDiv";
    this.hoverDiv.id = this.name + "x" + this.quantity;

    let costContainer = document.createElement("div");
    costContainer.className = "costContainer";

    let hex = document.createElement("div");
    hex.className = "hex " + this.rarity;
    hex.innerHTML = `&#11042`;

    let cost = document.createElement("div");
    cost.innerHTML = this.cost;
    cost.className = this.cost >= 10 ? "cost high" : "cost";

    let name = document.createElement("div");
    name.innerHTML = this.name;
    name.className = "name";

    let quantity;
    if (this.quantity > 1) {
      quantity = document.createElement("div");
      quantity.innerHTML = "x" + this.quantity;
      quantity.className = "quantity";
    }

    costContainer.appendChild(hex);
    costContainer.appendChild(cost);
    this.div.appendChild(costContainer);
    this.div.appendChild(name);
    if (this.quantity > 1) {
      this.div.appendChild(quantity);
    }
    this.div.appendChild(this.hoverDiv);
  }

  classify(classification) {
    this.div.classList.remove("core");
    this.div.classList.remove("semiCore");
    this.div.classList.remove("unique");

    if (classification == "") {
      return;
    }
    this.div.classList.add(classification);
  }
} // class Card

class Sidebar {
  constructor(div, title, options) {
    this.div = div;
    this.titleDiv = document.createElement("div");
    this.titleDiv.className = "title";
    this.setTitle(title);
    this.div.appendChild(this.titleDiv);
    this.maxEntries = 5;

    this.archBtnsDiv = document.createElement("div");
    this.archBtnsDiv.className = "archBtnList";
    this.div.appendChild(this.archBtnsDiv);

    this.archBtns = []; // list of btnDiv
  }

  setTitle(title) {
    this.titleDiv.innerHTML = title;
  }

  addArchBtn(hsArch) {
    if (hsArch == undefined || this.archBtns.length >= this.maxEntries) {
      return;
    }

    let btnWrapper = document.createElement("div");
    btnWrapper.className = "archBtnWrapper";
    btnWrapper.id = hsArch.name;

    let btn = document.createElement("div");
    btn.id = hsArch.name;
    btn.className = "archBtn";
    btn.style.color = hsFontColors[hsArch.hsClass];
    btn.style.backgroundColor = hsColors[hsArch.hsClass];
    btn.innerHTML = hsArch.name;

    let trigger = function (e) {
      app.ui.decksWindow.buttonTrigger(e);
    };
    btn.onclick = trigger.bind(app.ui.decksWindow);

    /* removed tier text 
    let wrDiv = document.createElement("div");
    wrDiv.className = "wrDiv";
    //wrDiv.innerHTML = (100*hsArch.wr).toFixed(1)+'%'
    wrDiv.innerHTML = "Tier " + tier_classifier(hsArch.wr);

    //btnWrapper.appendChild(wrDiv);
    */
    btnWrapper.appendChild(btn);

    this.archBtns.push(btnWrapper);
    this.archBtnsDiv.appendChild(btnWrapper);
  }

  highlight(arch) {
    let archName = arch != null ? arch.name : "";
    for (let btn of this.archBtns) {
      if (btn.id == archName) {
        if (!btn.classList.contains("highlighted")) {
          btn.classList.add("highlighted");
        }
      } else {
        btn.classList.remove("highlighted");
      }
    }
  }

  removeBtn(archName = null) {
    for (let i = 0; i < this.archBtns.length; i++) {
      let btn = this.archBtns[i];

      if (archName == null) {
        this.archBtnsDiv.innerHTML = "";
        this.archBtns = [];
        return;
      }
    }
  } // remove Btn
} // Sidebar
