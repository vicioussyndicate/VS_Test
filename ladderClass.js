




class Ladder {

    constructor (DATA,f,t) {

        this.maxLegendEntries = 9
        this.maxLines = 10

        this.DATA = DATA
        this.f = f
        this.t = t

        this.zoomIn = false
        this.zoomIdx = null

        this.archetypes = []

        this.a_data = {} // to display in the table
        this.c_data = {} // !! rename archetypes c_data

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
            //autosize: true,
            //width: '50%',
            //heigth: 100,
		    hovermode: 'closest',
		    xaxis: {
                //title: 'Rank',
                tickfont: {
				    family: 'Arial, bold',
				    size: 15,
                    color: 'white',
			    },
                visible: true, 
                showgrid: false,
                tickvals: range(0,hsRanks),
			    ticktext: this.rankLabels,
                ticklen: 5,
                tickcolor: 'transparent',
                hoverformat: '.1%',
                range: [21,-1],
                color: 'white',
                fixedrange: true,
                zeroline: false,
                autorange: 'reversed',
            },
		    yaxis: {
			    showgrid: false,
			    tickfont: {
				    family: 'Arial, bold',
				    size: 16,
			    },
                ticklen: 5,
                tickcolor: 'transparent',
                fixedrange: true,
                zeroline: false,
			    color: '#999',
                tickformat: ',.0%',
		    },
            
		    plot_bgcolor: "#555",
            paper_bgcolor: "#555",
            margin: {l:60,r:30,b:35,t:0,},
	    }








        this.layout_line = {
		    showlegend: false,
		    displayModeBar: false,
            autosize: true,
		    hovermode: 'closest',
		    xaxis: {
                //title: 'Rank',
                tickfont: {
				    family: 'Arial, bold',
				    size: 12,
                    color: '#999',
			    },
                visible: true, 
                showgrid: true,
                tickvals: range(0,hsRanks),
			    ticktext: this.rankLabels,
                hoverformat: '.1%',
                range: [21,-1],
                color: 'white',
                fixedrange: true,
                zeroline: false,
                autorange: 'reversed',
            },
		    yaxis: {
			    tickfont: {
				    family: 'Arial, bold',
				    size: 19,
			    },
                ticklen: 12,
                tickcolor: 'transparent',
                tickformat: ',.0%',
                fixedrange: true,

                //zeroline: false,
			    color: '#999',
		    },
		    plot_bgcolor: "#555",
            paper_bgcolor: "#555",
            margin: {l:70,r:20,b:30,t:0,},
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
            if (ui.ladder.dispMode == 'decks') {this.createTable('decks'); return}
            if (ui.ladder.dispMode == 'classes') {this.createTable('classes'); return}
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

        //var windowInfo = document.querySelectorAll('#ladderWindow .windowInfo')[0]    
        //windowInfo.innerHTML = btnIdToText[this.f]+" - "+btnIdToText[this.t]+" <br/><span>("+this.totGames.toLocaleString()+" games)</span>"

        if (ui.ladder.dispMode == 'decks') {this.createArchLegend()}
        if (ui.ladder.dispMode == 'classes') {this.createClassLegend()}
        document.getElementById('chart1').on('plotly_click', this.zoomToggle)
    }


    colorScale(x) {
        var c1 = [255,255,255]
        var c2 = [87, 125, 186]

        x /= 0.15

        var c3 = []
        c3.push(c1[0]+(c2[0]-c1[0])*x)
        c3.push(c1[1]+(c2[1]-c1[1])*x)
        c3.push(c1[2]+(c2[2]-c1[2])*x)
        
        return 'rgb('+c3[0]+','+c3[1]+','+c3[2]+')'
    }


    createTable (mode) {

        var maxArch = 20
        if (this.archetypes.length < maxArch) {maxArch = this.archetypes.length}

        document.getElementById('chart1').innerHTML = ""
        
        var table = `<table style="width:100%">`
        table += `<tr><th class="pivot">Rank -></th>`

        for (var i=20;i>0;i--) {table += `<th>${i}</th>`}
        table += `<th>L</th></tr>`

        if (mode == 'decks') {
            for (var j=0; j<maxArch; j++) {
                var arch = this.archetypes[j]
                table += `<tr><td class="pivot">${arch.name}</td>`
                for (var i=hsRanks-1;i>-1;i--) {table += `<td style="background-color:${this.colorScale(arch.data[i])};">${arch.data[i].toFixed(3)}</td>`}
                table += `</tr>`
            }
        } 
        else {
            for (var j=0; j<9; j++) {
                var hsClass = hsClasses[j]
                var data = this.c_data[hsClass]
                table += `<tr><td class="pivot">${hsClass}</td>`
                for (var i=hsRanks-1;i>-1;i--) {
                    
                    table += `<td style="background-color:${this.colorScale(data[i])};">${data[i].toFixed(2)}</td>`
                }
                table += `</tr>`
            }   
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

            var legendDiv = document.createElement('div')   
            var colorSplash = document.createElement('div')
            var archName = document.createElement('l')     

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

















