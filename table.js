



// ---------------------------- TABLE -------------------------------- // ------------------------------------ TABLE ------------------------- // 

// Contents:
// 1. Make Table
// 2. Plot Table
// 3. Subplots
// 4. ZoomIn/ Out/ Toggle
// 5. Sort Table

















// 1. Make Table
// -------------

function makeTable(f,t,r) {
    

    var numArch = numArch_table_std
    
    var table = []
    var textTable = []
    var frequency = []
    var archetypes = []
    var classPlusArch = []
    

    if (f == 'Wild') {numArch = numArch_table_wild}
    
    for (var i=0;i<numArch;i++) {
        var row = []
        var textRow = []

        for (var j=0;j<numArch;j++) {
            row.push(0)
            textRow.push('')}

        table.push(row)
        textTable.push(textRow)
    }


    // Copy Data

    var FR =            DATA_table[f][t][r].imported.frequency.slice()
    var TABLE =         DATA_table[f][t][r].imported.table.slice()
    var ARCHETYPES =    DATA_table[f][t][r].imported.archetypes.slice()
    


    // Take only the most common
    var idx_f = range(0,FR.length)
    idx_f.sort(function (a, b) { return FR[a] > FR[b] ? -1 : FR[a] < FR[b] ? 1 : 0; });
    idx_f.splice(numArch)


    
    

    // Process Data
    for (var i=0;i<numArch;i++) {

        var x = idx_f[i]

        frequency.push(FR[x])
        archetypes.push(ARCHETYPES[x][1]+" "+ARCHETYPES[x][0])
        classPlusArch.push(ARCHETYPES[x][0]+ARCHETYPES[x][1])
        

        for (var j=i;j<numArch;j++) {

            var y = idx_f[j]

            var wr1 = 0
            var wr2 = 0

            var w1 = TABLE[x][y][0]
            var l1 = TABLE[x][y][1]
            if (w1 + l1 > 0) {wr1 = w1/(w1+l1)}

            var w2 = TABLE[y][x][1]
            var l2 = TABLE[y][x][0]
            if (w2 + l2 > 0) {wr2 = w2/(w2+l2)}

            if (i==j) {wr1 = 0.5; wr2 = 0.5}


            var wr = 0
            if (wr1 > 0 && wr2 > 0) {wr = (wr1+wr2)/2}
            else if (wr1 == 0) {wr = wr2}
            else {wr = wr1}
            
            var totGames = w1+w2+l1+l2
            var hero =  ARCHETYPES[x][1]+" "+ARCHETYPES[x][0]
            var opp = ARCHETYPES[y][1]+" "+ARCHETYPES[y][0]
            
            table[i][j] = wr
            table[j][i] = 1-wr
            textTable[i][j] =`${hero}<br><b>vs:</b> ${opp}<br><b>wr:</b>  ${(wr*100).toFixed(0)}%  (${totGames})`           
            textTable[j][i] =`${opp}<br><b>vs:</b> ${hero}<br><b>wr:</b>  ${((1-wr)*100).toFixed(0)}%  (${totGames})` 

        }
    }
    

    // Calculate Winrates
    var winrates = []
    var freqSum = 0;
    
    for (var i=0;i<numArch;i++) {freqSum += frequency[i]}
    if (freqSum == 0) {freqSum = 1; console.log('freqSum = 0');}

    for (var i=0;i<numArch;i++) {
        var wr = 0
        for (var j=0;j<numArch;j++) {wr += table[i][j]*frequency[j]}
        winrates.push(wr/freqSum)
    }
        
    
        
    const layout = {
        showlegend: false,
        xaxis: {side: 'top',
            showgrid: false,
            tickcolor: 'white',
            color: 'white',
            gridcolor:'white',
            fixedrange: true,
            },
        yaxis: {
            autorange: 'reversed',
            tickcolor: 'white', 
            color:'white', 
            gridcolor:'white',
            fixedrange: true,
            },
        plot_bgcolor: "transparent",
        paper_bgcolor: "#222",
        margin: {
            l: 120,
            r: 30,
            b: 30,
            t: 100
        },
        width: 800,

        yaxis2: {
            visible: false,
            showticklabels: false,
            fixedrange: true,
            domain: [0, 0.01],
            anchor: 'x',
        },
    }
    

    DATA_table[f][t][r].table = table
    DATA_table[f][t][r].textTable = textTable
    DATA_table[f][t][r].archetypes = archetypes
    
    
    DATA_table[f][t][r].frequency = frequency
    DATA_table[f][t][r].classPlusArch = classPlusArch
    DATA_table[f][t][r].winrates = winrates
    
    
    
    DATA_table[f][t][r].layout = layout
    DATA_table[f][t][r].freqPlotData = getFreqPlotData(frequency.slice(),archetypes.slice())
    
    sortTableBy('frequency',plot=false,ftr={f:f,t:t,r:r})   
}

























// 2. Plot Table
// -------------

function plotTable(f,t,r) {

    ui.table.f = f
    ui.table.t = t
    ui.table.r = r
    
    var TABLE = DATA_table[f][t][r].table // ??
    var overallWR = DATA_table[f][t][r].winrates
    var table = TABLE.concat([overallWR])
    var arch = DATA_table[f][t][r].archetypes.concat(['Overall'])
    var textRow = []
    for (var i=0;i<table[0].length;i++) {textRow.push("Overall WR: "+(100*overallWR[i]).toFixed(1)+"%")}
    var textTable = DATA_table[f][t][r].textTable.concat([textRow])


    
    var trace_Table = {
        type: 'heatmap',
        z: table,
        x: DATA_table[f][t][r].archetypes,
        y: arch,
        text: textTable,
        hoverinfo: 'text',
        colorscale: colorscale_Table,
        showscale: false,
    }

    // Default Frequency Trace
    var trace_FR = {
        visible: false,	
        x: DATA_table[f][t][r].archetypes,
        y: range(0,DATA_table[f][t][r].archetypes.length),
        xaxis: 'x',
        yaxis: 'y2',
        type: 'line',
        hoverinfo: 'x+y',
    }
    
    var trace_WR = {
        visible: false,	
        x: DATA_table[f][t][r].archetypes,
        y: range(0,DATA_table[f][t][r].archetypes.length),
        xaxis: 'x',
        yaxis: 'y2',
        type: 'line',
        hoverinfo: 'x+y',
    }
    
    data = [trace_Table,trace_FR,trace_WR]

    Plotly.newPlot('chart2',data,DATA_table[f][t][r].layout,{displayModeBar: false})
    document.getElementById('chart2').on('plotly_click', zoomToggle)

    if (ui.table.zoomIn) {zoomIn(f,t,r,ui.table.zoomArch)}
}


















// 3. SubPlots
// -------------



function plotFreq(f,t,r) {
    Plotly.restyle('chart2',DATA_table[f][t][r].freqPlotData,1)
}

function getFreqPlotData(freq,arch) {

    var freqSum = 0
    var text = []

    for (var i=0;i<freq.length;i++) {freqSum+=freq[i]}
    for (var i=0;i<freq.length;i++) {
        freq[i] = freq[i]/freqSum
        text.push("FR: "+(100*freq[i]).toFixed(1)+"%")
    }


    var freqPlotData = {
        x: [arch],
        y: [freq],
        text: [text],
        visible:true,
        hoverinfo: 'text',
    }
    return freqPlotData
}





function subplotWR (f,t,r,idx) {
    var wr

    if (idx == -1 || idx >= DATA_table[f][t][r].archetypes.length) {wr = DATA_table[f][t][r].winrates.slice()}
    else {wr =    DATA_table[f][t][r].table[idx].slice()}

    var arch  = DATA_table[f][t][r].archetypes.slice()
    
    if (idx > arch.length) {return}
    
    var text = []
    for (var i=0;i<wr.length;i++) {text.push("WR: "+(100*wr[i]).toFixed(1)+"%"); wr[i]-= 0.5}

    var wrPlotData = {
        type: 'bar',
        x: [arch],
        y: [wr],
        text: [text],
        visible: true,
        hoverinfo:'text',
        marker: {
            color: '#2a9fc1',
            // line: {
            //     color: '#84d6ee',
            //     width: 1.5
            //   }
          },
    }
    
    
    Plotly.restyle('chart2',wrPlotData,2)
}








// 4. Zoom
// -------

function zoomToggle(data) {
    
    var f = ui.table.f
    var t = ui.table.t
    var r = ui.table.r
    var arch = data.points[0].y
    var numArch = DATA_table[f][t][r].archetypes.length

    if (ui.table.zoomIn == false) {zoomIn(f,t,r,arch)}
    else { zoomOut(numArch)}
}





function zoomIn(f,t,r,arch) {

    var archetypes = DATA_table[f][t][r].archetypes
    var idx =       archetypes.indexOf(arch)

    if (arch == 'Overall')  {idx = DATA_table[f][t][r].archetypes.length}
    if (idx == -1)          {zoomOut(archetypes.length); return}

    var layout = {
        yaxis: {range: [idx-0.5, idx+0.5],fixedrange:true,color:'white',tickcolor:'white'},
        yaxis2: {
            domain: [0, 0.5],
            visible: false,
            fixedrange: true,
        },
    }

    Plotly.relayout('chart2',layout)
    plotFreq(f,t,r)
    subplotWR(f,t,r,idx)

    ui.table.zoomIn = true
    ui.table.zoomArch = arch
}








function zoomOut (numArch) {
    numArch += 1 // because of the overall row
    var layout_zoomOut = {
        yaxis:{	
            range:[numArch-0.5,-0.5],
            color: 'white',
            tickcolor: 'white',
            fixedrange: true,
        },
        yaxis2: {domain: [0, 0.01], visible: false,fixedrange:true},
    }
    Plotly.relayout('chart2',layout_zoomOut);
    Plotly.restyle('chart2',{visible:false},[1,2])
        
    ui.table.zoomIn = false
}






















// 5. Sort Table
// -------------

function sortTableBy(what,plot=true,ftr=null) {
    if (ui.table.sortBy == what && ui.fullyLoaded) {console.log('already sorted by '+what);return}
    
    var f,t,r
    if (ftr==null) {f = ui.table.f; t = ui.table.t; r = ui.table.r; ui.table.sortBy = what}
    else {f = ftr.f; t = ftr.t; r = ftr.r;}
    
    

    
    var data = DATA_table[f][t][r]

    
    var numArch = data.archetypes.length
    var idxs = range(0,numArch)
    
    var sortByWR = function (a, b) { return data.winrates[a] > data.winrates[b] ? -1 : data.winrates[a] < data.winrates[b] ? 1 : 0; }
    var sortByFR = function (a, b) { return data.frequency[a] > data.frequency[b] ? -1 : data.frequency[a] < data.frequency[b] ? 1 : 0; }
    var sortByClass = function (a, b) { return data.classPlusArch[a] < data.classPlusArch[b] ? -1 : data.classPlusArch[a] > data.classPlusArch[b] ? 1 : 0; }


    if (what == 'winrate') {idxs.sort(sortByWR)}
    if (what == 'frequency') {idxs.sort(sortByFR)}
    if (what == 'class') {idxs.sort(sortByClass)}
    

    let table = []
    let textTable = []
    var archetypes = []
    var frequency = []
    var winrates = []
    var classPlusArch = []

    for (var i=0;i<numArch;i++) {
        var idx = idxs[i]
        
        classPlusArch.push(data.classPlusArch[idx])
        archetypes.push(data.archetypes[idx])
        frequency.push(data.frequency[idx])
        winrates.push(data.winrates[idx])
        
        
        var tableRow = []
        var textTableRow = []
        for (var j=0;j<numArch;j++) {
            tableRow.push(data.table[idx][idxs[j]])
            textTableRow.push(data.textTable[idx][idxs[j]])
        }
        table.push(tableRow)
        textTable.push(textTableRow)
    }
    
   
    DATA_table[f][t][r].table = table
    DATA_table[f][t][r].archetypes = archetypes
    DATA_table[f][t][r].classPlusArch = classPlusArch
    DATA_table[f][t][r].frequency  = frequency
    DATA_table[f][t][r].winrates  = winrates
    DATA_table[f][t][r].freqPlotData = getFreqPlotData(frequency,archetypes)

    // Archetypes sorted by frequency stored for creating ladder plot legend
    if (what == 'frequency' && t == 'lastMonth' && DATA_table[f][t][r].archetypesLadder == null) {
        DATA_table[f][t][r].archetypesLadder = archetypes.slice()
    } 
    
    
    if (plot) { 
        plotTable(f,t,r)
    }
    return
}


















function changeTable(f,t,r) {

    if (ui.table.f == f && ui.table.t == t && ui.table.r == r) {console.log('already plotted');return}
    
    ui.table.f = f
    ui.table.t = t
    ui.table.r = r
    
    plotTable(f,t,r)
}













