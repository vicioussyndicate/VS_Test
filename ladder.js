


// ---------------------------- LADDER -------------------------------- // ------------------------------------ LADDE ------------------------- // 

function makeLadder(f,t) {
    
    var archetypes = []
    var ARCHETYPES =    DATA_ladder[f][t].imported.archetypes
    var rankSums =      DATA_ladder[f][t].imported.gamesPerRank
    var rankData =      DATA_ladder[f][t].imported.rankData // form : [rank0 = [ #games arch1, #games arch2, ...   ], ranks1 = [#games arch1, ....], ...]
    var classRankData = []
    var legend = []
    var totGames = 0
    var numArch = ARCHETYPES.length
    var visiblePerRank = fillRange(0,hsRanks,0)
    var rankData = smoothLadder(rankData,rankSums.slice())

   

    // Process RankData and ClassRankData  -> Should include classRankData in data file
    for (var i=0;i<hsRanks;i++) {
        if (rankSums[i] == 0) {continue}

        totGames += rankSums[i]
        var classRankRow = fillRange(0,9,0)

        for (var j=0;j<rankData[i].length;j++) {

            var idx_class = hsClasses.indexOf(ARCHETYPES[j][0])
            if (idx_class >= 0) {classRankRow[idx_class] += rankData[i][j]}
            
            
            if (rankData[i][j] < ladder_xmin && j > 9) { // check if the rank data is beneath the threshhold
                rankData[i][idx_class] += rankData[i][j]
                rankData[i][j] = 0
            }
        }
        classRankData.push(classRankRow)
    }



    // normalize classRankData and purify 'Other' classes    
    for (var i=0;i<hsRanks;i++) {
        var tempSum = 0
        for (var j=0;j<9;j++) {
            tempSum += classRankData[i][j] // normalizing classrankdata
            if (rankData[i][j] > 0 && rankData[i][j] < ladder_xmin) {   // putting 'Other Class' which are smaller than ladder_xmin
                rankData[i][9] += rankData[i][j]                        // into the 'Other Other' class
                rankData[i][j] = 0
            }
        }
        if (tempSum==0) {continue}
        for (var j=0;j<9;j++) {classRankData[i][j] /= tempSum}
    }



    
    // Initialize and add the traces to data and classData

    var data = []
    var classData = []

    for (var rank=0;rank<hsRanks;rank++) {

        var classWR = fillRange(0,9,0)
        var classCount = fillRange(0,9,0)

        for (var i=0;i<ARCHETYPES.length;i++) {
            
            var fr = rankData[rank][i]
            if (fr>0) {visiblePerRank[rank] += 1}
            else{continue}
            
            
            var arch = ARCHETYPES[i][1] + " " + ARCHETYPES[i][0].replace('§', '');
            var color = colorStringRange(hsColors[ARCHETYPES[i][0]],45)
            var name = arch
            var idx_arch = archetypes.indexOf(arch)
            var text = `<b>${name}     </b><br>freq: ${(fr*100).toFixed(1)}%`

            if (idx_arch == -1) {archetypes.push(arch); legend.push({name: name, fr:rankData[rank][i],color:color})}
            else {legend[idx_arch].fr += rankData[rank][i]; color = legend[idx_arch].color}
            
            var trace = {
                x:[fr],
                y:[rank],
                name: name,
                text: text,
                hoverinfo: 'text',
                orientation: 'h',
                marker: {color: color,},
                type: 'bar',
                winrate: 0,
                hsClass: ARCHETYPES[i][0],
            }
            data.push(trace)
        }

        // push Class Data
        for (var i=0;i<9;i++) {
            if (classCount[i] == 0) {classCount[i] = 1}
            var fr = classRankData[rank][i]
            var name = hsClasses[i]
            var text = name+" "+(fr*100).toFixed(2)+"%"
            var color = hsColorScale(name,fr)
        
            var trace = {
                x:[fr],
                y:[rank],
                name: name,
                text: text,
                hoverinfo: 'text',
                orientation: 'h',
                marker: {color: color},
                type: 'bar',
                winrate: 0,
                hsClass: name,
            }
            classData.push(trace)
        }
    }

    
    // true winrates
    var vprSum = 0
    for (var rank=0;rank<hsRanks;rank++) {
        for (var i=0;i<visiblePerRank[rank];i++) {

            var trace = data[i+vprSum]
            var arch = trace.name
            var winrate = 0
            var totFR = 0

            var table = DATA_table[f]['lastMonth']['ranks_all']  // once enough data -> adjust for time and rank
            var idx_i = table.archetypes.indexOf(arch) // idx on table

            if (idx_i != -1) { // check that arch exists on matchup table!
                for (var j=0;j<ARCHETYPES.length;j++) {

                    var arch_opp = ARCHETYPES[j][1]+" "+ARCHETYPES[j][0]
                    idx_j = table.archetypes.indexOf(arch_opp)

                    if (idx_j != -1) {
                        var fr = rankData[rank][j]
                        winrate += table.table[idx_i][idx_j] * fr
                        totFR += fr
                    }
                }
                if (totFR == 0) {totFR = 1}
                winrate /= totFR
                trace.text += " wr: "+(winrate*100).toFixed(1)+"%"
                trace.winrate = winrate
            }
        }
        vprSum += visiblePerRank[rank]
    }
    
	var rankLabels = ['L ']; 
    for (var i=1;i<hsRanks;i++) {
        if (i%5==0) {rankLabels.push(i+' ')}
        else{rankLabels.push('')}
    }

	
	var layout = {
		barmode: 'stack',
		showlegend: false,
		displayModeBar: false,
        width: 790, // 790
		hovermode: 'closest',
		xaxis: {
            visible: true, 
            showgrid: false,
            hoverformat: '.1%',
            color: 'transparent',
            fixedrange: true,
        },
		yaxis: {
			showgrid: false,
			tickvals: range(0,hsRanks),
			ticktext: rankLabels,
			tickfont: {
				family: 'Arial, bold',
				size: 19,
			},
            autorange: 'reversed',
            fixedrange: true,
			color: 'white',
		},
		plot_bgcolor: "#222",
        paper_bgcolor: "#222",
        margin: {l:35,r:0,b:0,t:0,},
	}
    
    legend.sort( function (a, b) { return a.fr > b.fr ? -1 : a.fr < b.fr ? 1 : 0; } )


    DATA_ladder[f][t].data = data
    DATA_ladder[f][t].classData = classData
    DATA_ladder[f][t].archetypes = archetypes
    DATA_ladder[f][t].numArch = archetypes.length
    DATA_ladder[f][t].visiblePerRank = visiblePerRank
    
    DATA_ladder[f][t].layout = layout
    DATA_ladder[f][t].legend = legend
    DATA_ladder[f][t].totGames = totGames
}













function smoothLadder(data,sums) {

    var data_new = [data[0].slice()]
    
    if (sums[0] == 0) {sums[0] = 1}
    if (sums[1] == 0) {sums[1] = 1}


    const w_rank = 3.5
    var w_lower, w_upper
    
    for (var rank=1; rank<hsRanks-1; rank++) {

        if (sums[rank+1] == 0) {sums[rank+1] = 1}
        
        w_upper = sums[rank-1]/sums[rank]
        w_lower = sums[rank+1]/sums[rank]
        if (w_upper > 2*w_rank) {w_upper = 2*w_rank}
        if (w_lower > 2*w_rank) {w_lower = 2*w_rank}

        if (rank%5 == 0) { w_lower = 0} // no smoothing across rank borders
        if (rank%5 == 1) { w_upper = 0}

        var w_tot = w_rank + w_lower + w_upper

        var dataRow = []
        for (var j=0; j<data[rank].length; j++) {

            var d =         data[rank][j]/sums[rank]
            var d_lower =   data[rank+1][j]/sums[rank+1]
            var d_upper =   data[rank-1][j]/sums[rank-1]

            dataRow.push( (d * w_rank + d_lower * w_lower + d_upper * w_upper) / w_tot ) 
        }
        data_new.push(dataRow)
    }

    data_new.push(data[hsRanks-1].slice())
    
    for (var i=0;i<data_new[0].length;i++) { data_new[0][i] /= sums[0] }
    for (var i=0;i<data[hsRanks-1].length;i++) {data_new[hsRanks-1][i] /= sums[hsRanks-1]}

    return data_new
}









// Plot

function plotLadder(f,t) {
    
    Plotly.newPlot('chart1',DATA_ladder[f][t].data, DATA_ladder[f][t].layout, {displayModeBar: false,})
    createLadderLegend(f,t)
    var windowInfo = document.querySelectorAll('#ladderWindow .windowInfo')[0]    
    windowInfo.innerHTML = btnIdToText[f]+" - "+btnIdToText[t]+" <br/><span>("+DATA_ladder[f][t].totGames.toLocaleString()+" games)</span>"
    ui.ladder.plotted = true
    document.getElementById('chart1').on('plotly_click', zoomToggle_Ladder)

    hideLoader()
}

function plotClassLadder(f,t) {
    Plotly.newPlot('chart3',DATA_ladder[f][t].classData,DATA_ladder[f][t].layout,{displayModeBar: false,})
    var windowInfo = document.querySelectorAll('#classLadderWindow .windowInfo')[0]    
    windowInfo.innerHTML = btnIdToText[f]+" - "+btnIdToText[t]+" <br/><span>("+DATA_ladder[f][t].totGames.toLocaleString()+" games)</span>"
    ui.classLadder.plotted = true
    document.getElementById('chart3').on('plotly_click', zoomToggle_Ladder)

    hideLoader()
}










// Create Plot Legends

function createLadderLegend(f,t) { 
     
    var contentFooter_ladder = document.querySelectorAll('#ladderWindow .content-footer')[0]
    while (contentFooter_ladder.firstChild) {contentFooter_ladder.removeChild(contentFooter_ladder.firstChild);}

    var maxElements = 9
    var legend = DATA_ladder[f][t].legend
    if (maxElements > legend.length) {maxElements = legend.length}

    for (var i=0;i<maxElements;i++) {

        var l = legend[i]

        var legendDiv = document.createElement('div')   // parent
        var colorSplash = document.createElement('div') // child 1
        var archName = document.createElement('l')      // child 2

        legendDiv.className = 'ladder-legend'
        legendDiv.style.fontSize = '0.8em'
        colorSplash.style = 'background-color:'+l.color+';height:15px;width:30px;margin:0 auto 0.7em auto;'
        archName.innerHTML = l.name

        legendDiv.appendChild(colorSplash)
        legendDiv.appendChild(archName)

        contentFooter_ladder.appendChild(legendDiv)        
    }

}







function createClassLadderLegend() {

    var contentFooter_classLadder = document.querySelectorAll('#classLadderWindow .content-footer')[0]

    for (var i=0;i<9;i++) {
        var hsClass = hsClasses[i]

        var legendDiv =     document.createElement('div') // parent
        var colorSplash =   document.createElement('div') // child 1
        var className =     document.createElement('p') // child 2

        legendDiv.className = 'classLadder-legend'
        colorSplash.style = 'background-color:'+hsColors[hsClass]+';height:15px;width:30px;margin:0 auto;'
        className.style.marginTop = '0.3em'
        className.innerHTML = hsClass

        legendDiv.appendChild(colorSplash)
        legendDiv.appendChild(className)
        contentFooter_classLadder.appendChild(legendDiv)
    }
}










// ZOOM

function zoomToggle_Ladder(data) {
    
    var f = ui.ladder.f
    var t = ui.ladder.t
    
    var rank = data.points[0].y
    
    if (ui.ladder.zoomIn == false) {zoomIn_Ladder(f,t,rank)}
    else { zoomOut_Ladder()}
}





function zoomIn_Ladder(f,t,rank) {
    console.log('zoomIn')
    var y_low = rank-2.5
    var y_up = rank + 2.5

    if (y_low<0) {y_low = -0.5; y_up = 5.5}
    if (y_up>hsRanks-1) {y_up = hsRanks-0.5; y_low = 14.5 }

    var layout = {
        yaxis: {range: [y_up,y_low],fixedrange:true,color:'white',dtick:1.0,},
    }
    if (ui.windows.activeID == 'ladderWindow') {Plotly.relayout('chart1',layout)}
    if (ui.windows.activeID == 'classLadderWindow') {Plotly.relayout('chart3',layout)}
    

    ui.ladder.zoomIn = true
    ui.ladder.zoomIdx = rank
}








function zoomOut_Ladder () {
        console.log('zoomOut')

    var rankLabels = ['L ']; 
    for (var i=1;i<hsRanks;i++) {
        if (i%5==0) {rankLabels.push(i+' ')}
        else{rankLabels.push('')}
    }
    
    var layout = {
        yaxis:{	
            range:[hsRanks-0.5,-0.5],
            color: 'white',
            fixedrange: true,
            tickvals: range(0,hsRanks),
			ticktext: rankLabels,
			tickfont: {
				family: 'Arial, bold',
				size: 19,
			},
            
        },
    }
    if (ui.windows.activeID == 'ladderWindow') {Plotly.relayout('chart1',layout)}
    if (ui.windows.activeID == 'classLadderWindow') {Plotly.relayout('chart3',layout)}

    ui.ladder.zoomIn = false
}
























// -----    SORT FUNCTIONS   -----//



function sortLadderBy(what,plot=true) {
        showLoader () 
    
    var traceMoveTo = []
    var t = ui.ladder.t
    var f = ui.ladder.f
    var DATA = DATA_ladder[f][t]
    var numArch = DATA.numArch
    var vpr = DATA.visiblePerRank
    var vprSum = 0
    ui.ladder.sortBy = what
    console.log('sort ladder by what',ui.ladder.sortBy)
    DATA_ladder[f][t].sortBy = what


    for (var i=0;i<hsRanks;i++) {

        var idx0 = vprSum
        var idx1 = vprSum + vpr[i]
        vprSum += vpr[i]

        var DATA_ladder_rank = DATA.data.slice(idx0, idx1)
        
        var indices = getIndicesSortedBy(DATA_ladder_rank,what)
        
        if      (what == 'class')       {DATA_ladder_rank.sort(classSort)}
        else if (what == 'frequency')   {DATA_ladder_rank.sort(frSort)}
        else if (what == 'winrate')     {DATA_ladder_rank.sort(wrSort)}

        else {console.log("sortLadderBy() Error: 'what' invalid"); return}


        for (var j=0;j<indices.length;j++) {indices[j] += idx0}

        var DATA_ladder_below = DATA.data.slice(0,idx0).concat(DATA_ladder_rank)
        var DATA_ladder_above = DATA.data.slice(idx1,DATA.data.length)
        DATA.data = DATA_ladder_below.concat(DATA_ladder_above)
        
        traceMoveTo = traceMoveTo.concat(indices)
    }

    if (plot) { 
        var oldtraces = range(0,vprSum)
        Plotly.moveTraces('chart1', range(0,vprSum),traceMoveTo)
        var sortInfo = document.querySelectorAll('#ladderWindow .sortInfo')[0]
        var text = 'Highest '+what+"<br/><span>"+'▼'+"</span>"
        if (what == 'class') {text = ''}
        sortInfo.innerHTML = text
        hideLoader()
    }
}



function wrSort(a,b) { return a.winrate < b.winrate ? -1 : a.winrate > b.winrate ? 1 : 0; }
function frSort(a,b) { return a.x[0] < b.x[0] ? -1 : a.x[0] > b.x[0] ? 1 : 0; }
function classSort(a,b) { return a.hsClass+a.hsArch < b.hsClass+b.hsArch ? -1 : a.hsClass+a.hsArch > b.hsClass+b.hsArch ? 1 : 0; }




function getIndicesSortedBy(arr,what) {
    var indices = []
    var toSort = []

    if (what=='class')      {for (var i=0;i<arr.length;i++) {indices.push(i); toSort.push(arr[i].hsClass+arr[i].hsArch)}}
    if (what=='frequency')  {for (var i=0;i<arr.length;i++) {indices.push(i); toSort.push(arr[i].x[0])}}
    if (what=='winrate')    {for (var i=0;i<arr.length;i++) {indices.push(i); toSort.push(arr[i].winrate)}}

    indices.sort(function (a, b) { return toSort[a] < toSort[b] ? -1 : toSort[a] > toSort[b] ? 1 : 0; });

    var indices_target = []
    for (var i=0;i<indices.length;i++) {indices_target.push(indices.indexOf(i))}
    return indices_target
}













function sortClassLadderBy(what) {

        showLoader () 

    var traceMoveTo = []
    var t = ui.classLadder.t
    var f = ui.classLadder.f
    ui.classLadder.sortBy = what
    DATA_ladder[f][t].sortBy = what

    var DATA = DATA_ladder[f][t]
    var numArch = 9

    for (var i=0;i<hsRanks;i++) {
        var DATA_ladder_rank = DATA.classData.slice(i*numArch, (i+1)*numArch)
        var indices = getIndicesSortedBy(DATA_ladder_rank,what)
        
        if      (what == 'class')       {DATA_ladder_rank.sort(classSort)}
        else if (what == 'frequency')   {DATA_ladder_rank.sort(frSort)}
        else if (what == 'winrate')     {DATA_ladder_rank.sort(wrSort)} 

        else {console.log("sortLadderBy() Error: 'what' invalid"); return}


        for (var j=0;j<indices.length;j++) {indices[j] += i*numArch}
        var DATA_ladder_below = DATA.classData.slice(0,i*numArch).concat(DATA_ladder_rank)
        var DATA_ladder_above = DATA.classData.slice((i+1)*numArch,DATA.classData.length)
        DATA.classData = DATA_ladder_below.concat(DATA_ladder_above)
        
        traceMoveTo = traceMoveTo.concat(indices)
    }
    Plotly.moveTraces('chart3', range(0,21*numArch),traceMoveTo);
    hideLoader()
}













function changeLadder(f,t) {
    if (ui.ladder.f == f && ui.ladder.t == t) {console.log('ladder already plotted');return}

    showLoader () 
    ui.ladder.f = f
    ui.ladder.t = t

    if (ui.ladder.sortBy != DATA_ladder[f][t].sortBy) {sortLadderBy(ui.ladder.sortBy,plot=false)}
    plotLadder(f,t)
}

function changeClassLadder(f,t) {
    if (ui.classLadder.f == f && ui.classLadder.t == t) {console.log('ladder already plotted');return}

    showLoader () 
    ui.classLadder.f = f
    ui.classLadder.t = t
    if (ui.classLadder.sortBy != DATA_ladder[f][t].sortBy) {sortClassLadderBy(ui.classLadder.sortBy)}
    plotClassLadder(f,t)
}















