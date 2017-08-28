// ---------------------------- LADDER -------------------------------- // ------------------------------------ LADDE ------------------------- // 

function makeLadder(f,t) {
    
	
    
    var archetypes = []
    var rankData = DATA_ladder[f][t].imported.rankData
    var classRankData = []
    var rankSums = DATA_ladder[f][t].imported.gamesPerRank
    var ARCHETYPES = DATA_ladder[f][t].imported.archetypes

    var numArch = ARCHETYPES.length
    for (var arch of ARCHETYPES) {archetypes.push({C: arch[0], A: arch[1], color: randomColor()})}
   
    
    for (var i=0;i<hsRanks;i++) {
        if (rankSums[i] == 0) {continue}

        var classRankRow = fillRange(0,9,0)

        for (var j=0;j<rankData[i].length;j++) {

            rankData[i][j] /= rankSums[i]

            var arch = archetypes[j]
            var idx_class = hsClasses.indexOf(arch.C)
            if (idx_class >= 0) {classRankRow[idx_class] += rankData[i][j]}

            if (rankData[i][j] < ladder_xmin && j > 9) { // check if the rank data is beneath the threshhold
                var classIdx = hsClasses.indexOf(arch.C) // add data to 'Class Other'
                rankData[i][classIdx] += rankData[i][j]
                rankData[i][j] = 0
            }
        }
        classRankData.push(classRankRow)
    }
    
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



    


    var data = []
    var classData = []

    for (var rank=0;rank<hsRanks;rank++) {

        var classWR = fillRange(0,9,0)
        var classCount = fillRange(0,9,0)

        for (var i=0;i<archetypes.length;i++) {
            
            var arch = archetypes[i]
            var fr = rankData[rank][i]
            var name = arch.A+" "+arch.C
            var idx_table = DATA_table[f]['lastMonth']['ranks_all'].archetypes.indexOf(name)
            var idx_class = hsClasses.indexOf(arch.C)

            var winrate = 0.5
            if (idx_table != -1) {winrate = DATA_table[f]['lastMonth']['ranks_all'].winrates[idx_table]}
            else {winrate = 0}

            if (idx_class >= 0) {
                classCount[idx_class] += 1
                classWR[idx_class] += winrate
            }  
            

            var trace = {
                visible: fr > 0,
                x:[fr],
                y:[rank],
                name: name,
                text: name+" "+winrate.toFixed(2),
                hoverinfo: 'text',
                orientation: 'h',
                marker: {color: arch.color,},
                type: 'bar',
                
                winrate: winrate,
                hsClass: arch.C,
                hsArch: arch.A,
            }
            data.push(trace)
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


    

  
	// Create PlotLables
	var rankLabels = ['L ']; 
    for (var i=1;i<hsRanks;i++) {
        if (i%5==0) {rankLabels.push(i+' ')}
        else{rankLabels.push('')}
    }
	
	var layout = {
		barmode: 'stack',
		showlegend: false,
		displayModeBar: false,
		autosize: true,
        width: '100%',
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
			color: 'white',
		},
		plot_bgcolor: "#222",
        paper_bgcolor: "#222",
		margin: {
            l: 35,
            r: 10,
            b: 10,
            t: 10
        },
	}
    
    DATA_ladder[f][t].data = data
    DATA_ladder[f][t].classData = classData
    DATA_ladder[f][t].layout = layout
    DATA_ladder[f][t].numArch = numArch
}


















function plotLadder(f,t) {

    Plotly.newPlot('chart1',DATA_ladder[f][t].data, DATA_ladder[f][t].layout, {displayModeBar: false,})
    ui.ladder.f = f
    ui.ladder.t = t
}

function plotClassLadder(f,t) {
    Plotly.newPlot('chart3',DATA_ladder[f][t].classData,DATA_ladder[f][t].layout,{displayModeBar: false,})
    ui.classLadder.f = f
    ui.classLadder.t = t
}
























// -----    SORT FUNCTIONS   -----//



function sortLadderBy(what) {
    
    var traceMoveTo = []
    var t = ui.ladder.t
    var f = ui.ladder.f
    var DATA = DATA_ladder[f][t]
    var numArch = DATA.numArch


    for (var i=0;i<hsRanks;i++) {
        var DATA_ladder_rank = DATA.data.slice(i*numArch, (i+1)*numArch)

        var indices = getIndicesSortedBy(DATA_ladder_rank,what)
        
        if      (what == 'class')       {DATA_ladder_rank.sort(classSort)}
        else if (what == 'frequency')   {DATA_ladder_rank.sort(frSort)}
        else if (what == 'winrate')     {DATA_ladder_rank.sort(wrSort)} 

        else {console.log("sortLadderBy() Error: 'what' invalid"); return}

        for (var j=0;j<indices.length;j++) {indices[j] += i*numArch}

        var DATA_ladder_below = DATA.data.slice(0,i*numArch).concat(DATA_ladder_rank)
        var DATA_ladder_above = DATA.data.slice((i+1)*numArch,DATA.data.length)

        DATA.data = DATA_ladder_below.concat(DATA_ladder_above)
        
        traceMoveTo = traceMoveTo.concat(indices)
    }

    Plotly.moveTraces('chart1', range(0,21*numArch),traceMoveTo);
    
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
    //console.log('change ladder to',f,t)
    
    if (ui.ladder.f == f && ui.ladder.t == t) {console.log('ladder already plotted');return}
    plotLadder(f,t)
}

function changeClassLadder(f,t) {
    if (ui.classLadder.f == f && ui.classLadder.t == t) {console.log('ladder already plotted');return}
    plotClassLadder(f,t)
}
