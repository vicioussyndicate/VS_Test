




class Ladder {

    constructor (DATA,f,t) {

        this.plotWidth = 790
        this.maxLegendEntries = 9
        this.maxLines = 10

        this.DATA = DATA
        this.f = f
        this.t = t

        this.zoomIn = false
        this.zoomIdx = null

        this.archetypes = []

        this.a_data = {} // to display in the table
        this.c_data = {}

        this.traces_arch_bar = []
        this.traces_class_bar = []

        this.traces_arch_line = []
        this.traces_class_line = []
        
        this.archLegend = []
        this.classLegend = []
        this.totGames = 0


        var ARCHETYPES =    DATA.archetypes
        var rankSums =      DATA.gamesPerRank
        var rankData =      this.smoothLadder(DATA.rankData,rankSums.slice())
        this.rankLabels = []
        var classRankData = []
        


        // Process ClassRankData  -> Should include classRankData in data file
        for (var i=0;i<hsRanks;i++) {

            if (i%5==0) {this.rankLabels.push(i+'  ')}
            else {this.rankLabels.push('')}

            this.totGames += rankSums[i]
            var classRankRow = [0,0,0,0,0,0,0,0,0]

            for (var j=0;j<rankData[i].length;j++) {
                var idx_class = hsClasses.indexOf(ARCHETYPES[j][0])
                if (idx_class != -1) {classRankRow[idx_class] += rankData[i][j]}
            }
            classRankData.push(classRankRow)
        }

        this.rankLabels[0] = 'L  '



        // Arch Traces
        for (var i=0;i<ARCHETYPES.length;i++) {

            var archFR = []
            var archTxt = []
            var fr_avg = 0
            var archName = ARCHETYPES[i][1] + " " + ARCHETYPES[i][0].replace('§', '');

            for (var rank=0;rank<hsRanks;rank++) {
                var fr = rankData[rank][i]
                archTxt.push(`<b>${archName}     </b><br>freq: ${(fr*100).toFixed(1)}%`)
                archFR.push(fr)
                fr_avg += fr
            }
            fr_avg /= hsRanks
            

            var color = colorStringRange(hsColors[ARCHETYPES[i][0]],45)

            var arch_bar = {
                x:range(0,hsRanks),
                y:archFR,
                name: archName,
                text: archTxt,
                hoverinfo: 'text',
                marker: {color: color,},
                type: 'bar',
                winrate: 0,
                hsClass: ARCHETYPES[i][0]+ARCHETYPES[i][1],
            }
            
            var arch_line = {
                x: range(0,hsRanks),
                y: archFR,
                name: archName,
                text: archTxt,
                hoverinfo: 'text',
                orientation: 'h',
                marker: {color: color,},
                type: 'scatter',
                winrate: 0,
                hsClass: ARCHETYPES[i][0]+ARCHETYPES[i][1],
                fr: fr_avg,
            }

            this.traces_arch_bar.push(arch_bar)
            this.traces_arch_line.push(arch_line)
            this.archLegend.push({name: archName, color: color, fr: fr_avg})
            this.a_data[archName] = archFR
            this.archetypes.push({name:archName,fr:fr_avg, data: archFR})

        } // close for ARCHETYPES
                


        // Class Traces
        for (var i=0;i<9;i++) {
            var hsClass = hsClasses[i]
            var classFR = []
            var classTxt = []
            var fr_avg = 0

            for (var rank=0;rank<hsRanks;rank++) {                
                var fr = classRankData[rank][i]
                classFR.push(fr)
                classTxt.push(hsClass+" "+(fr*100).toFixed(2)+"%")
                fr_avg += fr
            }
            
            fr_avg /= hsRanks
            this.c_data[hsClass] = classFR.slice()

            var class_bar = {
                x: range(0,hsRanks),
                y: classFR,
                name: hsClass,
                text: classTxt,
                hoverinfo: 'text',
                marker: {color: hsColors[hsClass]},
                type: 'bar',
                winrate: 0,
                hsClass: hsClass,
             }

            var class_line = {
                x:range(0,hsRanks),
                y:classFR,
                name: hsClass,
                text: classTxt,
                hoverinfo: 'text',
                marker: {color: hsColors[hsClass]},
                type: 'scatter',
                winrate: 0,
                hsClass: hsClass,
                fr: fr_avg,
             }

            this.traces_class_bar.push(class_bar)
            this.traces_class_line.push(class_line)
            this.classLegend.push({name:hsClass, color: hsColors[hsClass]})
        }// close for Classes
        



        this.layout_bar = {
		    barmode: 'stack',
		    showlegend: false,
		    displayModeBar: false,
            width: this.plotWidth,
		    hovermode: 'closest',
		    xaxis: {
                visible: true, 
                showgrid: false,
                tickvals: range(0,hsRanks),
			    ticktext: this.rankLabels,
                hoverformat: '.1%',
                color: 'transparent',
                fixedrange: true,
            },
		    yaxis: {
			    showgrid: false,
			    tickfont: {
				    family: 'Arial, bold',
				    size: 19,
			    },
                //autorange: 'reversed',
                fixedrange: true,
			    color: 'white',
		    },
		    plot_bgcolor: "#555",
            paper_bgcolor: "#555",
            margin: {l:35,r:0,b:15,t:0,},
	    }


        this.layout_line = {
            //barmode: 'stack',
		    showlegend: false,
		    displayModeBar: false,
            width: this.plotWidth,
		    hovermode: 'closest',
		    xaxis: {
                visible: true, 
                showgrid: true,
                hoverformat: '.1%',
                color: 'white',
                fixedrange: true,
                autorange: 'reversed',
            },
		    yaxis: {
			    //showgrid: false,
			    tickfont: {
				    family: 'Arial, bold',
				    size: 19,
			    },
                fixedrange: true,
			    color: 'white',
		    },
		    plot_bgcolor: "#555",
            paper_bgcolor: "#555",
            margin: {l:35,r:0,b:0,t:0,},
        }


       
        var classSort = function (a, b) { return a.hsClass < b.hsClass ? -1 : a.hsClass > b.hsClass ? 1 : 0; }
        var freqSort = function (a,b) { return a.fr > b.fr ? -1 : a.fr < b.fr ? 1 : 0;}

        this.traces_class_bar.sort(classSort)
        this.traces_class_line.sort(freqSort)
        this.traces_class_line.splice(this.maxLines)
        
        this.traces_arch_bar.sort(classSort)
        this.traces_arch_line.sort(freqSort)
        this.traces_arch_line.splice(this.maxLines)
        
        this.archLegend.sort(freqSort)
        this.archetypes.sort(freqSort)
    }// close constructor

    

    // Smooth Data
    smoothLadder (data,sums) {
            
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
    }// close smoothLadder












    plot() {
        document.getElementById('chart1').innerHTML = ""
        var data, layout

        if (ui.ladder.plotMode == 'number') {
            if (ui.ladder.dispMode = 'decks') {this.createArchTable(); return}
            if (ui.ladder.dispMode = 'classes') {this.createClassTable(); return}
        }

        if (ui.ladder.plotMode == 'bar') {
            layout = this.layout_bar
            if (ui.ladder.dispMode == 'decks') {data = this.traces_arch_bar}
            if (ui.ladder.dispMode == 'classes') {data = this.traces_class_bar}
        }

        if (ui.ladder.plotMode == 'line') {
            layout = this.layout_line
            if (ui.ladder.dispMode == 'decks') {data = this.traces_arch_line}
            if (ui.ladder.dispMode == 'classes') {data = this.traces_class_line}
        }

        Plotly.newPlot('chart1',data, layout, {displayModeBar: false,})

        var windowInfo = document.querySelectorAll('#ladderWindow .windowInfo')[0]    
        windowInfo.innerHTML = btnIdToText[this.f]+" - "+btnIdToText[this.t]+" <br/><span>("+this.totGames.toLocaleString()+" games)</span>"

        if (ui.ladder.dispMode == 'decks') {this.createArchLegend()}
        if (ui.ladder.dispMode == 'classes') {this.createClassLegend()}
        document.getElementById('chart1').on('plotly_click', this.zoomToggle)
    }




    createClassTable () { 
        
        document.getElementById('chart1').innerHTML = ""
        
        var table = `<table style="width:100%">`
        table += `<tr><th></th>`

        for (var i=20;i>0;i--) {table += `<th>${i}</th>`}
        table += `<th>L</th></tr>`


        for (var j=0; j<9; j++) {

            table += `<tr><td>${hsClasses[j]}</td>`

            for (var i=0;i<hsRanks;i++) {
                table += `<td>${randint(0,100)}</td>`
            }
            table += `</tr>`
        }

        table += `</table>`

        console.log(table)
        document.getElementById('chart1').innerHTML = table
    }







    createArchTable () {

        var maxArch = 20
        if (this.archetypes.length < maxArch) {maxArch = this.archetypes.length}

        document.getElementById('chart1').innerHTML = ""
        
        var table = `<table style="width:100%">`
        table += `<tr><th>Rank -></th>`

        for (var i=20;i>0;i--) {table += `<th>${i}</th>`}
        table += `<th>L</th></tr>`


        for (var j=0; j<maxArch; j++) {
            var arch = this.archetypes[j]
            table += `<tr><td>${arch.name}</td>`
            for (var i=20;i>-1;i--) {table += `<td>${(arch.data[i]*100).toFixed(0)}</td>`}
            table += `</tr>`
        }

        table += `</table>`
        document.getElementById('chart1').innerHTML = table
    }


    createClassLegend() {
        var contentFooter_ladder = document.querySelectorAll('#ladderWindow .content-footer')[0]
        while (contentFooter_ladder.firstChild) {contentFooter_ladder.removeChild(contentFooter_ladder.firstChild);}

        for (var i=0;i<9;i++) {
            
            var hsClass = hsClasses[i]

            var legendDiv = document.createElement('div')   
            var colorSplash = document.createElement('div') 
            var archName = document.createElement('l')     

            legendDiv.className = 'ladder-legend'
            legendDiv.style.fontSize = '0.8em'
            colorSplash.style = 'background-color:'+hsColors[hsClass]+';height:15px;width:30px;margin:0 auto 0.7em auto;'
            archName.innerHTML = hsClass

            legendDiv.appendChild(colorSplash)
            legendDiv.appendChild(archName)

            contentFooter_ladder.appendChild(legendDiv)        
        }
    }

    createArchLegend() {

        var contentFooter_ladder = document.querySelectorAll('#ladderWindow .content-footer')[0]
        while (contentFooter_ladder.firstChild) {contentFooter_ladder.removeChild(contentFooter_ladder.firstChild);}

        var maxElements = this.maxLegendEntries
        var legend = this.archLegend
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




    zoomToggle (data) {
        var hsClass = data.points[0].data.hsClass
    }

}// class Ladder



function zoomToggle(data) {
    console.log(data)
}

















