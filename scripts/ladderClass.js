class Ladder {
  constructor(DATA, f, t, window) {
    this.maxLegendEntries = 10;
    this.maxLines = 10; // max archetypes shown for the line chart

    this.lineWidth = 2.7;
    this.fr_min = 0.03;

    this.DATA = DATA;
    this.f = f;
    this.t = t;
    this.window = window;

    this.archetypes = [];
    this.classFr = {}; // ??
    this.totGames = 0;
    this.totGamesBrackets = {}; // needs bracket in name
    this.download = { classes: "", decks: "" };

    this.traces = {
      bar: { classes: [], decks: [] },
      line: { classes: [], decks: [] },
      zoom: {},
      pie: { classes: [], decks: [] },
      map: {},
    };

    for (let hsClass of hsClasses) {
      this.traces.zoom[hsClass] = [];
    }

    // Bracket setup
    this.rankBrackets = [];
    for (var r of this.window.ranks) {
      this.traces.map[r] = null;
      this.rankBrackets.push({
        name: r, //btnIdToText[r],
        start: rankRange[r][0],
        end: rankRange[r][1],
      });
    }

    this.bracket = this.rankBrackets[0]; // current bracket

    for (let bracket of this.rankBrackets) {
      this.totGamesBrackets[bracket.name] = 0;

      let color_classes = [];
      for (hsClass of hsClasses) {
        color_classes.push(hsColors[hsClass]);
      }

      var trace_classes = {
        values: fillRange(0, hsClasses.length, 0),
        labels: hsClasses.slice(),
        marker: { colors: color_classes },
        hoverinfo: "label+percent",
        insidetextfont: { color: "white" },
        outsidetextfont: { color: "#222" },
        text: hsClasses.slice(),
        type: "pie",
      };

      let trace_decks = {
        values: [],
        labels: [],
        marker: { colors: [] },
        textfont: { color: [] },
        hoverinfo: "label+percent",
        insidetextfont: { color: "white" },
        outsidetextfont: { color: "transparent" },
        text: [],
        type: "pie",
      };

      this.traces.pie["decks"][bracket.name] = [trace_decks];
      this.traces.pie["classes"][bracket.name] = [trace_classes];
    }

    let ARCHETYPES = DATA.archetypes;
    let rankSums = DATA.gamesPerRank;
    this.rankSums = DATA.gamesPerRank;
    let rankData = this.smoothLadder(DATA.rankData, rankSums.slice());
    let classRankData = this.smoothLadder(DATA.classRankData, rankSums.slice());

    // Game Sums
    for (var i = 0; i < hsRanks; i++) {
      this.totGames += rankSums[i];
      for (var bracket of this.rankBrackets) {
        if (i >= bracket.start && i <= bracket.end) {
          this.totGamesBrackets[bracket.name] += rankSums[i];
        }
      }
    }

    // Arch Traces
    for (let i = 0; i < ARCHETYPES.length; i++) {
      let archFr = [];
      let archFr_raw = []; // without merging
      let archFr_brackets = {};
      let archTxt = [];
      let fr_avg = 0;
      let archName = ARCHETYPES[i][1] + " " + ARCHETYPES[i][0].replace("§", "");
      let classIdx = hsClasses.indexOf(ARCHETYPES[i][0]);
      let uiColor = app.ui.getArchColor(
        ARCHETYPES[i][0],
        ARCHETYPES[i][1],
        this.f
      );
      let fontColor = uiColor.fontColor;
      let color = uiColor.color;

      for (let rank of range(0, hsRanks)) {
        let fr = rankData[rank][i];
        archFr_raw.push(fr);
        archTxt.push(
          `<b>${archName}     </b><br>freq: ${(fr * 100).toFixed(1)}%`
        );

        // Merge
        if (fr < this.fr_min && i > 9) {
          // changed constant 8 to 9 for comparison with i
          //console.log(this.traces.bar.decks[classIdx]);
          this.traces.bar.decks[classIdx].y[rank] += fr;
          fr = 0;
        }
        fr_avg += fr;
        archFr.push(fr);

        for (let bracket of this.rankBrackets) {
          if (rank == bracket.start) {
            // !!! bracket.name < bracket.name
            this.traces.pie["decks"][bracket.name][0].values.push(fr);
            this.traces.pie["decks"][bracket.name][0].labels.push(archName);
            this.traces.pie["decks"][bracket.name][0].marker.colors.push(color);
          }
          if (rank > bracket.start && rank <= bracket.end) {
            this.traces.pie["decks"][bracket.name][0].values[i] += fr;
          }
          if (rank == bracket.end) {
            this.traces.pie.decks[bracket.name][0].values[i] /=
              bracket.end - bracket.start + 1;
            this.traces.pie["decks"][bracket.name][0].text.push(archName);
            archFr_brackets[bracket.name] = this.traces.pie.decks[
              bracket.name
            ][0].values[i];

            // Merge Pie
            var fr_pie = this.traces.pie.decks[bracket.name][0].values[i];
            if (fr_pie < this.fr_min && i > 8) {
              this.traces.pie.decks[bracket.name][0].values[i] = 0;
              this.traces.pie.decks[bracket.name][0].values[classIdx] += fr_pie;
            }
          }
        }
      } // for ranks

      fr_avg /= hsRanks;

      var arch_bar = {
        x: range(0, hsRanks),
        y: archFr.slice(),
        name: archName,
        text: archTxt,
        hoverinfo: "text",
        marker: { color: color },
        type: "bar",
        winrate: 0,
        hsClass: ARCHETYPES[i][0] + ARCHETYPES[i][1],
      };

      var arch_line = {
        x: range(0, hsRanks),
        y: archFr_raw.slice(),
        name: archName,
        text: archTxt,
        hoverinfo: "text",
        orientation: "h",
        marker: { color: color },
        line: { width: this.lineWidth },
        type: "scatter",
        mode: "lines",
        winrate: 0,
        hsClass: ARCHETYPES[i][0] + ARCHETYPES[i][1],
        fr: fr_avg,
      };

      this.traces.bar.decks.push(arch_bar);
      this.traces.line.decks.push(arch_line);

      let archetype = {
        name: archName,
        hsClass: ARCHETYPES[i][0],
        fr: fr_avg,
        fr_ranks: archFr_raw.slice(),
        fr_brackets: archFr_brackets,
        color: color,
        fontColor: fontColor,
      };

      this.archetypes.push(archetype);
    } // close for ARCHETYPES

    // Class Traces
    for (var i of range(0, hsClasses.length)) {
      //kj 9-> hsClasses.length
      var hsClass = hsClasses[i];
      var classFR = [];
      var classTxt = [];
      var fr_avg = 0;

      for (let rank of range(0, hsRanks)) {
        let fr = classRankData[rank][i];
        classFR.push(fr);
        classTxt.push(hsClass + " " + (fr * 100).toFixed(2) + "%");
        fr_avg += fr;

        for (var bracket of this.rankBrackets) {
          if (rank >= bracket.start && rank <= bracket.end) {
            this.traces.pie["classes"][bracket.name][0].values[i] += fr;
          }
          if (rank == bracket.end) {
            this.traces.pie["classes"][bracket.name][0].values[i] /=
              bracket.end - bracket.start + 1;
          }
        }
      }

      // push zoom traces
      let fr_tot = fillRange(0, hsRanks, 0);
      for (let a of this.archetypes) {
        if (a.hsClass != hsClass) {
          continue;
        }
        var text = [];
        for (let rank of range(0, hsRanks)) {
          fr_tot[rank] += a.fr_ranks[rank];
          text.push("");
        }

        var bar_zoom = {
          x: range(0, hsRanks),
          y: a.fr_ranks.slice(),
          name: a.name,
          text: text,
          hoverinfo: "text",
          marker: { color: a.color },
          type: "bar",
          winrate: 0,
          hsClass: hsClass,
          overall: a.fr_ranks.slice(),
          fr_avg: a.fr,
        };

        this.traces.zoom[hsClass].push(bar_zoom);
      }

      for (var a of this.traces.zoom[hsClass]) {
        for (var rank = 0; rank < hsRanks; rank++) {
          a.y[rank] /= fr_tot[rank] > 0 ? fr_tot[rank] : 1;
          a.text[rank] =
            a.name +
            "<br>" +
            (100 * a.y[rank]).toFixed(1) +
            "% of " +
            a.hsClass +
            "<br>" +
            (100 * a.overall[rank]).toFixed(1) +
            "% overall";
        }
      }

      fr_avg /= hsRanks;
      this.classFr[hsClass] = classFR.slice();

      var class_bar = {
        x: range(0, hsRanks),
        y: classFR.slice(),
        name: hsClass,
        text: classTxt.slice(),
        hoverinfo: "text",
        marker: { color: hsColors[hsClass] },
        type: "bar",
        winrate: 0,
        hsClass: hsClass,
      };

      var class_line = {
        x: range(0, hsRanks),
        y: classFR.slice(),
        name: hsClass,
        text: classTxt.slice(),
        hoverinfo: "text",
        marker: { color: hsColors[hsClass] },
        line: { width: this.lineWidth },
        type: "scatter",
        mode: "lines",
        winrate: 0,
        hsClass: hsClass,
        fr: fr_avg,
      };

      this.traces.bar.classes.push(class_bar);
      this.traces.line.classes.push(class_line);

      //this.classLegend.push({name:hsClass, color: hsColors[hsClass]})
    } // close for Classes

    let classSort = function (a, b) {
      return a.hsClass < b.hsClass ? -1 : a.hsClass > b.hsClass ? 1 : 0;
    };
    let freqSort = function (a, b) {
      return a.fr > b.fr ? -1 : a.fr < b.fr ? 1 : 0;
    };

    this.traces.bar.classes.sort(classSort);
    this.traces.line.classes.sort(freqSort);
    this.traces.line.classes.splice(this.maxLines);

    this.traces.bar.decks.sort(classSort);
    this.traces.line.decks.sort(freqSort);
    this.traces.line.decks.splice(this.maxLines);

    this.archetypes.sort(freqSort);
  } // close constructor

  // Smooth Data
  smoothLadder(data, sums) {
    var data_new = [data[0].slice()];

    if (sums[0] == 0) {
      sums[0] = 1;
    }
    if (sums[1] == 0) {
      sums[1] = 1;
    }

    const w_rank = 3.5;
    var w_lower, w_upper;

    for (var rank = 1; rank < hsRanks - 1; rank++) {
      if (sums[rank + 1] == 0) {
        sums[rank + 1] = 1;
      }

      w_upper = sums[rank - 1] / sums[rank];
      w_lower = sums[rank + 1] / sums[rank];
      if (w_upper > 2 * w_rank) {
        w_upper = 2 * w_rank;
      }
      if (w_lower > 2 * w_rank) {
        w_lower = 2 * w_rank;
      }

      if (rank % 5 == 0) {
        w_lower = 0;
      } // no smoothing across rank borders
      if (rank % 5 == 1) {
        w_upper = 0;
      }

      var w_tot = w_rank + w_lower + w_upper;

      var dataRow = [];
      for (var j = 0; j < data[rank].length; j++) {
        var d = data[rank][j] / sums[rank];

        var d_lower = data[rank + 1][j] / sums[rank + 1];

        //console.log(sums[rank + 1]);

        var d_upper = data[rank - 1][j] / sums[rank - 1];

        dataRow.push(
          (d * w_rank + d_lower * w_lower + d_upper * w_upper) / w_tot
        );
      }
      data_new.push(dataRow);
    }

    data_new.push(data[hsRanks - 1].slice());

    for (var i = 0; i < data_new[0].length; i++) {
      data_new[0][i] /= sums[0];
    }
    for (var i = 0; i < data[hsRanks - 1].length; i++) {
      data_new[hsRanks - 1][i] /= sums[hsRanks - 1];
    }

    return data_new;
  } // close smoothLadder

  plot() {
    document.getElementById("chart1").innerHTML = "";
    this.window.hideRankFolder();
    this.window.setGraphTitle();

    let plotType = this.window.plotType;
    let layout = this.window.layouts[plotType];
    let data;

    switch (plotType) {
      case "pie":
        this.window.showRankFolder();
        data = this.traces.pie[this.window.mode][this.window.r];
        break;

      case "number":
        this.createTable(this.window.mode);
        return;

      case "bar":
        data = this.traces.bar[this.window.mode];
        break;

      case "zoom":
        data = this.traces.zoom[this.window.zoomClass];
        break;

      case "line":
        data = this.traces.line[this.window.mode];
        break;

      case "map":
        this.window.showRankFolder();
        data = this.traces.map[this.window.r];
        this.window.mode = "decks";
        this.window.renderOptions();
        if (data == null) {
          data = this.loadMap();
        }
    }

    if (MOBILE == "portrait" && this.window.plotTyp != "pie") {
      layout.width = app.ui.width * 2;
      layout.height = app.ui.height * 0.6;
    }

    Plotly.newPlot("chart1", data, layout, { displayModeBar: false });
    this.annotate(this.window.annotated);
    this.createLegend(this.window.mode);

    // Add zoom function
    if (
      (this.window.plotType == "bar" || this.window.plotType == "zoom") &&
      PREMIUM
    ) {
      document
        .getElementById("chart1")
        .on("plotly_click", this.zoomToggle.bind(this));
    }
  }

  colorScale(x) {
    var c1 = this.window.colorScale_c1;
    var c2 = this.window.colorScale_c2;
    var c3 = [];

    x /= this.window.colorScale_f;
    if (x > 1) {
      x = 1;
    }

    for (var i = 0; i < 3; i++) {
      c3.push(parseInt(c1[i] + (c2[i] - c1[i]) * x));
    }
    return "rgb(" + c3[0] + "," + c3[1] + "," + c3[2] + ")";
  }

  annotate(bool) {
    var plotType = this.window.plotType;
    if (
      plotType == "pie" ||
      plotType == "number" ||
      plotType == "timeline" ||
      plotType == "map"
    ) {
      return;
    }
    var update;
    var heights = {
      bar: 0.5,
      zoom: 0.5,
      line: 0.05,
    };
    var textangle = plotType == "bar" || plotType == "zoom" ? 90 : 0;
    if (bool) {
      var annotations = [];
      for (var i = 0; i < hsRanks; i++) {
        var ann = {
          x: i,
          y: heights[plotType],
          xref: "x",
          yref: "y",
          textangle: textangle,
          text: this.rankSums[i],
          showarrow: false,
          bgcolor: "rgba(0,0,0,0.3)",
          font: { color: "white" },
          opacity: 0.8,
        };
        annotations.push(ann);
      }
      update = { annotations: annotations };
    } else {
      update = { annotations: [] };
    }
    Plotly.relayout("chart1", update);
  }

  loadMap() {
    let r = this.window.r;
    let tableData =
      app.ui.tableWindow.data[this.f][table_times[0]][table_ranks[0]];
    if (tableData == null) {
      console.log("ERROR table not loaded for Meta Score");
    }
    //     let callback = function() { app.ui.ladderWindow.plot() }
    //     app.ui.tableWindow.data.load('Wild',callback)
    // }

    this.traces.map[r] = [];
    let table = tableData.table;
    let tableArchetypes = tableData.archetypes;
    let ladderArchetypes = this.archetypes;

    let wrMax = 0;
    let frMax = 0;

    for (let arch of this.archetypes) {
      let idx1 = tableArchetypes.indexOf(arch.name);
      if (idx1 == -1) {
        continue;
      }

      let frTot = 0;
      let wrTot = 0;

      for (let opp of ladderArchetypes) {
        let idx2 = tableArchetypes.indexOf(opp.name);
        if (idx2 == -1) {
          continue;
        }

        let mu = table[idx1][idx2];
        let fr = opp.fr_brackets[r];

        wrTot += mu * fr;
        frTot += fr;
      }

      let fr = arch.fr_brackets[r];
      wrTot = frTot > 0 ? wrTot / frTot : 0;
      wrMax = Math.max(wrTot, wrMax);
      frMax = Math.max(fr, frMax);

      this.traces.map[r].push({
        name: arch.name,
        type: "scatter",
        fr: fr,
        wr: wrTot,
        hoverinfo: "text",
        mode: "markers",
        marker: {
          size: 15,
          line: { size: 0 },
          color: arch.color,
        },
      });
    }

    for (let a of this.traces.map[r]) {
      a.x = [(a.wr + wrMax - 1) / (2 * wrMax - 1)];
      a.y = [a.fr / frMax];
      let score = (a.x[0] + a.y[0]) / 2;
      a.text = `<b>${a.name}<br>Meta:</b> ${score.toFixed(
        2
      )}<br><b>WR:</b> ${a.wr.toFixed(2)} <b>Freq:</b> ${(a.fr * 100).toFixed(
        0
      )}%`;
    }
    return this.traces.map[r];
  } // load Map

  createTable(mode) {
    let maxArch = 20;
    if (this.archetypes.length < maxArch) {
      maxArch = this.archetypes.length;
    }
    document.getElementById("chart1").innerHTML = "";

    var table = document.createElement("table");
    table.id = "numberTable";
    var headerRow = document.createElement("tr");
    this.download[mode] = [[]];

    var item = document.createElement("th");
    item.className = "pivot";
    item.innerHTML = "Rank ->";
    headerRow.appendChild(item);
    this.download[mode] += "Rank%2C";

    for (var i = hsRanks - 1; i >= 0; i--) {
      var item = document.createElement("th");
      //item.innerHTML = i > 0 ? i : "L";
      item.innerHTML = rankLabels[i];
      headerRow.appendChild(item);
      //this.download[mode] += i > 0 ? i : "L";
      this.download[mode] += rankLabels[i];
      this.download[mode] += "%2C";
    }
    table.appendChild(headerRow);
    this.download[mode] += "%0A";

    if (mode == "decks") {
      for (var j = 0; j < maxArch; j++) {
        var arch = this.archetypes[j];
        var row_dl = arch.name + "%2C";
        var row = document.createElement("tr");
        var pivot = document.createElement("td");
        pivot.className = "pivot";
        pivot.style.backgroundColor = arch.color;
        pivot.style.color = arch.fontColor;
        pivot.innerHTML = arch.name;
        row.appendChild(pivot);
        for (var i = hsRanks - 1; i > -1; i--) {
          var item = document.createElement("td");
          item.style.backgroundColor = this.colorScale(arch.fr_ranks[i]);
          item.innerHTML = (arch.fr_ranks[i] * 100).toFixed(1) + "%";
          row.appendChild(item);
          row_dl += arch.fr_ranks[i] + "%2C";
        }
        table.appendChild(row);
        this.download[mode] += row_dl + `%0A`;
      }
    }

    if (mode == "classes") {
      for (var j = 0; j < hsClasses.length; j++) {
        //kj 9-> hsClasses.length
        var hsClass = hsClasses[j];
        var data = this.classFr[hsClass];
        var row_dl = hsClass + "%2C";
        var row = document.createElement("tr");
        var pivot = document.createElement("td");
        pivot.className = "pivot";
        pivot.style.backgroundColor = hsColors[hsClass];
        pivot.style.color = hsFontColors[hsClass];
        pivot.innerHTML = hsClass;
        row.appendChild(pivot);
        for (var i = hsRanks - 1; i > -1; i--) {
          var item = document.createElement("td");
          item.style.backgroundColor = this.colorScale(data[i]);
          item.innerHTML = (data[i] * 100).toFixed(1) + "%";
          row.appendChild(item);
          row_dl += data[i] + "%2C";
        }
        table.appendChild(row);
        this.download[mode] += row_dl + `%0A`;
      }
    }

    document.getElementById("chart1").appendChild(table);
    this.createNumbersFooter();
  }

  createLegend(mode) {
    if (this.window.plotType == "zoom") {
      this.createZoomLegend();
      return;
    }
    this.window.clearChartFooter();

    let archetypes = this.archetypes;

    let maxElements = mode == "classes" ? this.maxLegendEntries : 10;
    if (maxElements > archetypes.length) {
      maxElements = archetypes.length;
    }

    for (let i of range(0, maxElements)) {
      if (mode == "classes") {
        this.window.addLegendItem(hsClasses[i]);
      }
      if (mode == "decks") {
        this.window.addLegendItem(archetypes[i].name);
      }
    }
  }

  createZoomLegend() {
    var hsClass = this.window.zoomClass;
    this.window.clearChartFooter();
    for (var arch of this.traces.zoom[hsClass]) {
      if (arch.fr_avg > 0) {
        this.window.addLegendItem(arch.name);
      }
    }
  }

  createNumbersFooter() {
    var chartFooter = document.querySelector("#ladderWindow .chart-footer");
    while (chartFooter.firstChild) {
      chartFooter.removeChild(chartFooter.firstChild);
    }

    if (!PREMIUM) {
      return;
    }

    var csvBtn = document.createElement("button");

    csvBtn.innerHTML = "Download <div class='fa fa-cloud-download'></div>";
    csvBtn.className = "download";
    csvBtn.addEventListener("click", this.downloadCSV.bind(this));
    chartFooter.appendChild(csvBtn);
  }

  downloadCSV() {
    var dlink = document.createElement("a");
    dlink.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + this.download[this.window.mode]
    );
    dlink.setAttribute("download", "ladder.csv");
    dlink.style.display = "none";
    document.body.appendChild(dlink);
    dlink.click();
    document.body.removeChild(dlink);
  }

  zoomToggle(data) {
    if (this.window.plotType == "zoom") {
      this.window.plotType = "bar";
      this.plot();
      return;
    }

    this.window.plotType = "zoom";
    var zoomClass = data.points[0].data.hsClass;
    if (hsClasses.indexOf(zoomClass) == -1) {
      for (var c of hsClasses) {
        if (zoomClass.indexOf(c) != -1) {
          this.window.zoomClass = c;
          break;
        }
      }
    } else {
      this.window.zoomClass = zoomClass;
    }
    this.plot();
  }
} // class Ladder
