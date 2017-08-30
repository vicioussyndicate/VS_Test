


// ---------------------------- LADDER -------------------------------- // ------------------------------------ LADDE ------------------------- // 

function makeLadder(f,t) {
    
    var archetypes = []
    var ARCHETYPES =    DATA_ladder[f][t].imported.archetypes
    var rankSums =      DATA_ladder[f][t].imported.gamesPerRank
    var rankData =      DATA_ladder[f][t].imported.rankData // form : [rank0 = [ #games arch1, #games arch2, ...   ], ranks1 = [#games arch1, ....], ...]
    var classRankData = []
    var totGames = 0
    var numArch = ARCHETYPES.length
    var visiblePerRank = fillRange(0,hsRanks,0)

    //for (var arch of ARCHETYPES) {archetypes.push({C: arch[0], A: arch[1], color: colorStringRange(hsColors[arch[0]],45)})}
   



    // Initialize classRankData, normalize and purify rankData -> rankData/rankSum and x > ladder_xmin
    for (var i=0;i<hsRanks;i++) {
        if (rankSums[i] == 0) {continue}

        totGames += rankSums[i]
        var classRankRow = fillRange(0,9,0)


        for (var j=0;j<rankData[i].length;j++) {

            rankData[i][j] /= rankSums[i]

            var hsClass = ARCHETYPES[j][0]
            var idx_class = hsClasses.indexOf(hsClass)
            if (idx_class >= 0) {classRankRow[idx_class] += rankData[i][j]}
            
            
            if (rankData[i][j] < ladder_xmin && j > 9) { // check if the rank data is beneath the threshhold
                var classIdx = hsClasses.indexOf(hsClass) // add data to 'Class Other'
                rankData[i][classIdx] += rankData[i][j]
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
            if (archetypes.indexOf(arch) == -1) {archetypes.push(arch)}
            var name = arch
            var text = `<b>${name}     </b><br>freq: ${(fr*100).toFixed(1)}%`
            
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
                hsArch: ARCHETYPES[i][1],
            }
            data.push(trace)

            var idx_class = hsClasses.indexOf(arch.C)
            if (idx_class >= 0) {
                classCount[idx_class] += 1
                classWR[idx_class] += winrate
            }  
        }

        // push Class Data
        for (var i=0;i<9;i++) {
            if (classCount[i] == 0) {classCount[i] = 1}
            var fr = classRankData[rank][i]
            var wr = classWR[i]
            var name = hsClasses[i]
            var text = name+" "+wr.toFixed(2)+" "+fr.toFixed(2)
            var color = hsColors[name]

        
            var trace = {
                x:[fr],
                y:[rank],
                name: hsClasses[i],
                text: text,
                hoverinfo: 'text',
                orientation: 'h',
                marker: {color: color},
                type: 'bar',
                
                winrate: wr,
                hsClass: name,
                hsArch: '',
            }
            classData.push(trace)
        }
    }
    //console.log('before wr calc',data,visiblePerRank)
    console.log('before wr',f,t,archetypes)

    /*
    // true winrates
    var vprSum = 0
    for (var rank=0;rank<hsRanks;rank++) {
        for (var i=0;i<visiblePerRank[rank];i++) {

            var trace = data[i+vprSum]
            //console.log('idx trace',i+vprSum)
            var arch = trace.name
            var winrate = 0
            var totFR = 0

            //console.log('wr calc',i,trace)
            var table = DATA_table[f]['lastMonth']['ranks_all']
            var idx_i = table.archetypes.indexOf(arch) // idx on table
            console.log('name',arch,idx_i)
            if (idx_i != -1) { // idx exist on match table!
                for (var j=0;j<archetypes.length;j++) {

                    idx_j = table.archetypes.indexOf(archetypes[j])
                    idx_A = null

                    for (var x=0;x<ARCHETYPES.length;x++) {
                        if (ARCHETYPES[x][1]+" "+ARCHETYPES[x][0]==arch) {idx_A = x; break}
                    }

                    console.log('idxs:',idx_j,idx_i,idx_A)
                    if (idx_j != -1 && idx_A != null) {
                        var fr = rankData[rank][idx_A]
                        winrate += table.table[idx_i][idx_j] * fr
                        //console.log('wr:',rank,i,j,table.table[idx_i][idx_j] * fr) // !!! idx_i in rankData means that we assume the same archetype order
                        totFR += fr
                }   }
                winrate /= totFR
                trace.text += " wr: "+(winrate*100).toFixed(1)+"%"
                trace.winrate = winrate
            }
        }
        vprSum += visiblePerRank[rank]
    }*/
    
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
            //side: 'right',
			color: 'white',
		},
		plot_bgcolor: "#222",
        paper_bgcolor: "#222",
        margin: {l:35,r:0,b:0,t:0,},
	}
    
    DATA_ladder[f][t].data = data
    DATA_ladder[f][t].classData = classData
    DATA_ladder[f][t].layout = layout
    DATA_ladder[f][t].numArch = archetypes.length
    DATA_ladder[f][t].archetypes = archetypes
    DATA_ladder[f][t].totGames = totGames
    DATA_ladder[f][t].visiblePerRank = visiblePerRank
    //console.log('hey there',f,t,visiblePerRank,'tests')
}



function initLadder() {
}



function smoothLadder(data) {

    const w_rank = 3.5
    var w_lower = 0 // weight of lower rank
    var w_upper = 0 // weight of upper rank
    
    for (var i=1;i<data.length-1;i++) {

        var upperRank = data[i-1]
        var lowerRank = data[i+1]

        if (data[i].sum > 0) {
            w_upper = data[i-1].sum/data[i].sum
            w_lower = data[i+1].sum/data[i].sum
            // Limits:
            if (w_upper > 2*w_rank) {w_upper = 2*w_rank}
            if (w_lower > 2*w_rank) {w_lower = 2*w_rank}
        } else {
            w_upper = 1
            w_lower = 1
        }

        var w_tot = w_rank + w_lower + w_upper
        // weight data_chart
        for (var j=0;j<9;j++) {
            data[i].data_chart[j+1] = (data[i].data_chart[j+1]*w_rank + lowerRank[j+1]*w_lower + upperRank[j+1]*w_upper)/w_tot
        }
    }
    return data
}









// Plot

function plotLadder(f,t) {
    
    Plotly.newPlot('chart1',DATA_ladder[f][t].data, DATA_ladder[f][t].layout, {displayModeBar: false,})
    createLadderLegend(f,t)
    var windowInfo = document.querySelectorAll('#ladderWindow .windowInfo')[0]    
    windowInfo.innerHTML = btnIdToText[f]+" "+btnIdToText[t]+" <br/><span>("+DATA_ladder[f][t].totGames+")</span>"
    ui.ladder.plotted = true
}

function plotClassLadder(f,t) {
    Plotly.newPlot('chart3',DATA_ladder[f][t].classData,DATA_ladder[f][t].layout,{displayModeBar: false,})
    var windowInfo = document.querySelectorAll('#classLadderWindow .windowInfo')[0]    
    windowInfo.innerHTML = f+" "+t+" <br/><span>("+DATA_ladder[f][t].totGames+")</span>"
    ui.classLadder.plotted = true
}




// Create Plot Legends

function createLadderLegend(f,t) {
     
    var contentFooter_ladder = document.querySelectorAll('#ladderWindow .content-footer')[0]

    while (contentFooter_ladder.firstChild) {contentFooter_ladder.removeChild(contentFooter_ladder.firstChild);}

    var maxElements = 9
    var countElements = 0
    var DATA = DATA_ladder[f][t]
    var numArch = DATA.numArch
    var vpr = DATA.visiblePerRank
    var rank = 16 // at what rank to sample archetypes?
    var xmin = 0.05

    var archetypes = DATA_table[f]['lastMonth']['ranks_all'].archetypesLadder // sorted by frequency
    for (var x=0;x<archetypes.length;x++) {
        for (var i=0;i<vpr[0];i++) {

            var arch = DATA.data[i+numArch]

            if (arch.name != archetypes[x]) {continue}

            var legendDiv = document.createElement('div') // parent
            var colorSplash = document.createElement('div') // child 1
            var archName = document.createElement('l') // child 2


            legendDiv.className = 'ladder-legend'
            legendDiv.style.fontSize = '0.8em'
            colorSplash.style = 'background-color:'+arch.marker.color+';height:15px;width:30px;margin:0 auto 0.7em auto;'
            archName.innerHTML = arch.name

            legendDiv.appendChild(colorSplash)
            legendDiv.appendChild(archName)

            contentFooter_ladder.appendChild(legendDiv)
            
            countElements += 1
            if (countElements >= maxElements) {break}
        }
        if (countElements >= maxElements) {break}
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
















// -----    SORT FUNCTIONS   -----//



// function sortLadderBy(what,plot=true) {
    
//     var traceMoveTo = []
//     var t = ui.ladder.t
//     var f = ui.ladder.f
//     var DATA = DATA_ladder[f][t]
//     var numArch = DATA.numArch
//     var vpr = DATA.visiblePerRank
//     ui.ladder.sortBy = what
//     DATA_ladder[f][t].sortBy = what


//     for (var i=0;i<hsRanks;i++) {

//         var DATA_ladder_rank = DATA.data.slice(i*numArch, (i+1)*numArch)
//         var indices = getIndicesSortedBy(DATA_ladder_rank,what)
        
//         if      (what == 'class')       {DATA_ladder_rank.sort(classSort)}
//         else if (what == 'frequency')   {DATA_ladder_rank.sort(frSort)}
//         else if (what == 'winrate')     {DATA_ladder_rank.sort(wrSort)}

//         else {console.log("sortLadderBy() Error: 'what' invalid"); return}


//         for (var j=0;j<indices.length;j++) {indices[j] += i*numArch}

//         var DATA_ladder_below = DATA.data.slice(0,i*numArch).concat(DATA_ladder_rank)
//         var DATA_ladder_above = DATA.data.slice((i+1)*numArch,DATA.data.length)
//         DATA.data = DATA_ladder_below.concat(DATA_ladder_above)
        
//         traceMoveTo = traceMoveTo.concat(indices)
//     }
    
//     if (plot) { 
//         Plotly.moveTraces('chart1', range(0,21*numArch),traceMoveTo)
//         var sortInfo = document.querySelectorAll('#ladderWindow .sortInfo')[0]
//         var text = 'Highest '+what+"<br/><span>"+'▼'+"</span>"
//         if (what == 'class') {text = ''}
//         sortInfo.innerHTML = text
//     }
    
// }

function sortLadderBy(what,plot=true) {
    
    var traceMoveTo = []
    var t = ui.ladder.t
    var f = ui.ladder.f
    var DATA = DATA_ladder[f][t]
    var numArch = DATA.numArch
    var vpr = DATA.visiblePerRank
    var vprSum = 0
    ui.ladder.sortBy = what
    DATA_ladder[f][t].sortBy = what


    for (var i=0;i<hsRanks;i++) {

        var idx0 = vprSum
        var idx1 = vprSum + vpr[i]
        //console.log('sortby',what,i,idx0,idx1,vprSum)
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
}













function changeLadder(f,t) {
    
    if (ui.ladder.f == f && ui.ladder.t == t) {console.log('ladder already plotted');return}

    ui.ladder.f = f
    ui.ladder.t = t

    if (ui.ladder.sortBy != DATA_ladder[f][t].sortBy) {sortLadderBy(ui.ladder.sortBy,plot=false)}
    plotLadder(f,t)
}

function changeClassLadder(f,t) {
    if (ui.classLadder.f == f && ui.classLadder.t == t) {console.log('ladder already plotted');return}
    ui.classLadder.f = f
    ui.classLadder.t = t
    if (ui.classLadder.sortBy != DATA_ladder[f][t].sortBy) {sortClassLadderBy(ui.classLadder.sortBy)}
    plotClassLadder(f,t)
}















