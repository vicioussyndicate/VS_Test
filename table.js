



// ---------------------------- TABLE -------------------------------- // ------------------------------------ TABLE ------------------------- // 

// Contents:
// 1. Make Table
// 2. Plot Table
// 3. Plot Freq
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

    var FR =            DATA_table[f][t][r].imported.frequency
    var TABLE =         DATA_table[f][t][r].imported.table
    var ARCHETYPES =    DATA_table[f][t][r].imported.archetypes
    


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
            textTable[i][j] =

`
${hero}<br>
<b>vs:</b> ${opp}<br>
<b>wr:</b>  ${(wr*100).toFixed(0)}%  (${totGames})
`           
           textTable[j][i] = 
`
${opp}<br>
<b>vs:</b> ${hero}<br>
<b>wr:</b>  ${((1-wr)*100).toFixed(0)}%  (${totGames})
` 

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

        yaxis2: {
            visible: false,
            showticklabels: false,
            fixedrange: true,
            domain: [0, 0.01],
            anchor: 'x',
        },
    }

    // CopyStuff over
    console.log('make Table archetype sorted by fr?:',archetypes)
    DATA_table[f][t][r].table = table
    DATA_table[f][t][r].textTable = textTable
    DATA_table[f][t][r].archetypes = archetypes
    DATA_table[f][t][r].archetypes_sorted = archetypes.slice()
    DATA_table[f][t][r].frequency_sorted = frequency.slice()
    DATA_table[f][t][r].frequency = frequency
    DATA_table[f][t][r].classPlusArch = classPlusArch
    DATA_table[f][t][r].winrates = winrates
    DATA_table[f][t][r].layout = layout
}

























// 2. Plot Table
// -------------

function plotTable(f,t,r) {
    
    var data = [{
        type: 'heatmap',
        z: DATA_table[f][t][r].table,
        x: DATA_table[f][t][r].archetypes,
        y: DATA_table[f][t][r].archetypes,
        text: DATA_table[f][t][r].textTable,
        hoverinfo: 'text',
        colorscale: colorscale_Table,
        showscale: false,
    }]

    // Default Frequency Trace
    var trace_Freq_Default = {
        visible: false,	
        x: DATA_table[f][t][r].archetypes_sorted,
        y: range(0,DATA_table[f][t][r].archetypes.length),
        xaxis: 'x',
        yaxis: 'y2',
        type: 'line',
        hoverinfo: 'x+y',
    }
    data.push(trace_Freq_Default)

    Plotly.newPlot('chart2',data,DATA_table[f][t][r].layout,{displayModeBar: false})
    document.getElementById('chart2').on('plotly_click', zoomToggle)
}


















// 3. Plot Freq
// -------------

function plotTableFreq(f,t,r) {

    var freqSum = 0
    var freq = DATA_table[f][t][r].frequency_sorted.slice()
    var arch_sorted = DATA_table[f][t][r].archetypes_sorted

    for (f of freq) {freqSum+=f}
    for (var i=0;i<freq.length;i++) {freq[i] = freq[i]/freqSum}

    console.log('plotTable',arch_sorted)

    var update_Freq = {
        x: [arch_sorted],
        y: [freq],
        visible:true,
        hoverinfo: 'y',
    }
    Plotly.restyle('chart2',update_Freq,1)
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
    console.log('zoomin',f,t,r,arch,DATA_table[f][t][r])
    var archetypes_sorted = DATA_table[f][t][r].archetypes_sorted
    var idx = archetypes_sorted.indexOf(arch)
    var layout = {
        yaxis: {range: [idx-0.5, idx+0.5],fixedrange:true,color:'white',tickcolor:'white'},
        yaxis2: {
            domain: [0, 0.5],
            visible: false,
            fixedrange: true,
        },
    }
    
    Plotly.relayout('chart2',layout)
    plotTableFreq(f,t,r)
    
    ui.table.zoomIn = true
    ui.table.zoomIdx = arch
}








function zoomOut (numArch) {
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
    Plotly.restyle('chart2',{visible:false},1)
        
    ui.table.zoomIn = false
}






















// 5. Sort Table
// -------------

function sortTableBy(what,newPlot=false) {
    if (ui.table.sortBy == what && !newPlot) {console.log('already sorted by '+what);return}

    var f = ui.table.f
    var t = ui.table.t
    var r = ui.table.r
    ui.table.sortBy = what

    
    var data = DATA_table[f][t][r]

    
    var numArch = data.archetypes.length
    var idxs = range(0,numArch)
    
    var sortByWR = function (a, b) { return data.winrates[a] > data.winrates[b] ? -1 : data.winrates[a] < data.winrates[b] ? 1 : 0; }
    var sortByFR = function (a, b) { return data.frequency[a] > data.frequency[b] ? -1 : data.frequency[a] < data.frequency[b] ? 1 : 0; }
    var sortByClass = function (a, b) { return data.classPlusArch[a] < data.classPlusArch[b] ? -1 : data.classPlusArch[a] > data.classPlusArch[b] ? 1 : 0; }

    if (what==undefined) {what = choice(['winrate','frequency','class'])}

    if (what == 'winrate') {idxs.sort(sortByWR)}
    if (what == 'frequency') {idxs.sort(sortByFR)}
    if (what == 'class') {idxs.sort(sortByClass)}
    

    let table = []
    let textTable = []
    var archetypes = []
    var frequency = []

    for (var i=0;i<numArch;i++) {
        var idx = idxs[i]

        archetypes.push(data.archetypes[idx])
        frequency.push(data.frequency[idx])
        
        var tableRow = []
        var textTableRow = []
        for (var j=0;j<numArch;j++) {
            tableRow.push(data.table[idx][idxs[j]])
            textTableRow.push(data.textTable[idx][idxs[j]])
        }
        table.push(tableRow)
        textTable.push(textTableRow)
    }
   

   
    var data_plot = [{
        z: table,
        x: archetypes,
        y: archetypes,
        text: textTable,
        hoverinfo: 'text',
        type: 'heatmap',
        colorscale: colorscale_Table,
        showscale: false,
    }]
    // Default Frequency Trace
    var trace_freq = {
        visible: false,	
        x: archetypes,
        y: range(0,archetypes.length),
        xaxis: 'x',
        yaxis: 'y2',
        type: 'line',
        hoverinfo: 'x+y',
    }

    

    data_plot.push(trace_freq)

    var t0 = performance.now();
    Plotly.newPlot('chart2',data_plot,data.layout,{displayModeBar: false})
    document.getElementById('chart2').on('plotly_click', zoomToggle)
    
    var t1 = performance.now()
    console.log(what+" sort of Table took "+(t1-t0).toFixed(2)+" ms")

    

    DATA_table[f][t][r].archetypes_sorted = archetypes
    DATA_table[f][t][r].frequency_sorted = frequency

    if (ui.table.zoomIn) {zoomOut(archetypes.length)}//zoomIn(ui.table.zoomIdx)}
}


















function changeTable(f,t,r) {

    if (ui.table.f == f && ui.table.t == t && ui.table.r == r) {console.log('already plotted');return}
    
    ui.table.f = f
    ui.table.t = t
    ui.table.r = r
    
    if (ui.table.sortBy != 'frequency') {sortTableBy(ui.table.sortBy,true)}
    else {plotTable(f,t,r)} 
}













