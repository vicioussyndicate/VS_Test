


class History {

    constructor(DATA,window) {
        
        this.window = window
        this.data = DATA
        this.bgColor = 'transparent'
        this.gridcolor = 'white'//this.window.fontColorLight
        
        this.layout = {
		    showlegend: false,
		    displayModeBar: false,
            autosize: true,
		    hovermode: 'closest',
		    xaxis: {
                tickfont: {
				    family: 'Arial, bold',
				    size: 15,
                    color: this.window.fontColor,
                },
                tickcolor: 'transparent',
                visible: true, 
                showgrid: true,
                gridcolor: this.gridcolor,
                color: this.window.fontColor,
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
                gridcolor: this.gridcolor,
                fixedrange: true,
			    color: this.window.fontColorLight,
		    },
		    plot_bgcolor: this.bgColor, 
            paper_bgcolor: this.bgColor,
            margin: {l:70,r:20,b:30,t:0,},
        }
        
        this.top = 9
        this.x = {
            'last6Hours': 6,
            'last12Hours':12,
            'lastDay': 24,
            'last3Days':3,
            'lastWeek': 7,
            'last2Weeks':14,
            'last3Weeks':21,
            'lastMonth':30,
        }
    }
    
    
    plot() {
        
        this.window.chartDiv.innerHTML = ""
        var f = this.window.f
        var t_w = this.window.t
        var t_h = (this.window.t == 'lastDay' || this.window.t == 'last12Hours' || this.window.t == 'last6Hours') ? 'lastHours' : 'lastDays';
        const baseUnit = (t_h == 'lastHours') ? 'Hour' : 'Day';
        var r = this.window.r
        var m = this.window.mode

        var traces = []
        var archetypes = []
        var d = this.data[f][t_h][r][m]
        d.sort(function (a, b) { return a.avg > b.avg ? -1 : a.avg < b.avg ? 1 : 0 })
        var x = range(1,this.x[t_w]+1)        
        
        for (var i=0; i<this.top;i++) { 
            var y = (t_h == 'lastHours') ? this.smoothData(d[i]['data']) : d[i]['data']
            var text = []
            for (var j=0;j<y.length;j++) {
                var unit = (j>0) ? baseUnit+'s' : baseUnit;
                text.push(`${d[i]['name']} (${(y[j]*100).toFixed(1)}% )<br>${x[j]+' '+unit} ago`)
            }
            var trace = {
                x: x.slice(),
                y: y.slice(),
                text: text,
                type: 'scatter',
                hoverinfo:'text',
            }
            traces.push(trace)
        }
        
        /*
        Plotly.animate('graph', {
            data: data,
            traces: [0,1],
            layout: {}
          }, {
            transition: {
              duration: 500,
              easing: 'cubic-in-out'
            }
          })*/
        
        
        
        Plotly.newPlot('chart1',traces, this.layout, {displayModeBar: false,})
        this.createLegend()

    }

    createLegend() {
        var mode = this.window.mode
        var chartFooter = document.querySelector('#ladderWindow .chart-footer')
        while (chartFooter.firstChild) {chartFooter.removeChild(chartFooter.firstChild);}
        
        var maxElements
        var legend = this.window.data[this.window.f][this.window.t].archLegend
        if (mode=='classes') {maxElements = 9}
        if (mode=='decks') {
            maxElements = this.top;
            if (maxElements > legend.length) {maxElements = legend.length}
        }

        for (var i=0;i<maxElements;i++) {

            var legendDiv = document.createElement('div')   
            var colorSplash = document.createElement('div')
            var archName = document.createElement('l')     

            legendDiv.className = 'ladder-legend'
            legendDiv.style.fontSize = '0.8em'
        
            if (mode=='classes') {

                var hsClass = hsClasses[i]
                legendDiv.style = 'background-color:'+hsColors[hsClass]
                legendDiv.id = hsClass
                legendDiv.innerHTML = hsClass
                legendDiv.onclick = function(e) { ui.deckLink(e.target.id,this.window.f);  }
            }

            if (mode=='decks') {

                var l = legend[i]
                legendDiv.style = 'background-color:'+l.color
                legendDiv.id = l.name
                legendDiv.innerHTML = l.name
                legendDiv.onclick = function(e) { ui.deckLink(e.target.id,this.window.f);  }
            }


            chartFooter.appendChild(legendDiv)

        }
    }

    smoothData(Data) {
        var data_smoothed = []
        const w = 0.3


        for (var i=0; i<Data.length;i++) {
            var w_tot = 0
            var d = 0

            if (i > 0)              {d += Data[i-1]*w; w_tot += w}
            if (i < Data.length-1)  {d += Data[i+1]*w; w_tot += w}

            d += Data[i]*(1-w_tot)
            data_smoothed.push(d)
        }

        return data_smoothed
    }
}








class Ladder {

    constructor (DATA,f,t,window) {

        this.maxLegendEntries = 9
        this.maxLines = 10 // max archetypes shown for the line chart

        //this.bgColor = 'rgba(255,255,255,0.5)'
        //this.bgColor = 'rgba(0,0,0,0.05)'
        this.bgColor = 'transparent'
        this.fontColor = window.fontColor
        this.fontColorLight = window.fontColorLight
        this.lineWidth = 2.5

        this.DATA = DATA
        this.f = f
        this.t = t
        this.window = window
        this.days
        this.fr_min = 0.03

      

        switch (t) {
            case 'lastDay': this.days = 24; break;
            case 'lastWeek': this.days = 7; break;
            case 'lastMonth': this.days = 30; break;
        }

        this.zoomIn = false
        this.zoomIdx = null

        this.archetypes = []
        this.c_data = {}

        this.traces_bar =   {classes: [], decks:[]}
        this.traces_line =  {classes: [], decks:[]}
        this.traces_pie =   {classes: {}, decks:{}}        

        this.archLegend = []
        this.classLegend = []
        this.totGames = 0
        this.totGamesRanks = {}

        this.rankLabels = []

        this.tiers = [
            {name:'All Ranks',
            buttonId: 'ranks_all',
            start:0,
            end: 15},
            {name:'L',
            buttonId: 'ranks_L',
            start: 0,
            end: 0},
            {name:'1-5',
            buttonId: 'ranks_1_5',
            start: 1,
            end: 5},
            {name:'6-15',
            buttonId: 'ranks_6_15',
            start: 6,
            end: 15},
        ]
        this.tier = this.tiers[0]
        this.rankFolder = document.querySelector('#ladderWindow .content-header #rankBtn')
        this.rankFolder.style.display = 'none'
        this.dropdownDiv = document.querySelector('#ladderWindow .content-header #rankDropdown')
        this.dropdownDiv.innerHTML = ''

        for (var tier of this.tiers) {

            this.totGamesRanks[tier.name] = 0

            // var button = document.createElement('button')
            // var clickButton = function (e) {
            //     for (var t of this.tiers) {
            //         if (t.buttonId == e.target.id) {
            //             this.tier = t
            //             this.plot()
            //             this.window.r = t.buttonId
            //             this.window.renderOptions()
            // }}}
            
            // button.id = tier.buttonId
            // button.className = 'optionBtn folderBtn'
            // button.innerHTML = tier.name
            // button.onclick = clickButton.bind(this)

            // this.dropdownDiv.appendChild(button)
            

            var trace_decks = {
                values: [],
                labels:[],
                marker: {colors: []},
                textfont: {color: []},
                hoverinfo: 'label+percent',
                insidetextfont: {color:'white'},
                outsidetextfont: {color:'transparent'},
                text: [],
                type:'pie',
            }

            var color_classes = []
            // var fontColor_classes = [] // doesnt work :(
            for (hsClass of hsClasses) { color_classes.push(hsColors[hsClass])}

            var trace_classes =  {
                values: fillRange(0,hsClasses.length,0),
                labels: hsClasses.slice(),
                marker: {colors:color_classes},
                hoverinfo: 'label+percent',
                insidetextfont: {color: 'white'},
                outsidetextfont: {color:'#222'},
                text: hsClasses.slice(),
                type: 'pie',
            }

            this.traces_pie['decks'][tier.name] = [trace_decks]
            this.traces_pie['classes'][tier.name] = [trace_classes]
            
        }


        var ARCHETYPES =    DATA.archetypes
        var rankSums =      DATA.gamesPerRank
        var rankData =      this.smoothLadder(DATA.rankData,rankSums.slice())
        var classRankData = []
        


        // Process ClassRankData  -> Should include classRankData in data file
        for (var i=0;i<hsRanks;i++) {

            if (i%5==0) {this.rankLabels.push(i+'  ')}
            else {this.rankLabels.push('')}

            this.totGames += rankSums[i]
            
            for (var tier of this.tiers) {
                if (i >= tier.start && i <= tier.end) { this.totGamesRanks[tier.name] += rankSums[i] }
            }
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
            var archFR_line = [] // without merging 
            var archTxt = []
            var fr_avg = 0
            var archName = ARCHETYPES[i][1] + " " + ARCHETYPES[i][0].replace('§', '');
            var classIdx = hsClasses.indexOf(ARCHETYPES[i][0])
            var color = colorStringRange(hsColors[ARCHETYPES[i][0]],45)

            for (var rank=0;rank<hsRanks;rank++) {
                var fr = rankData[rank][i]
                archFR_line.push(fr)                
                archTxt.push(`<b>${archName}     </b><br>freq: ${(fr*100).toFixed(1)}%`)

                // Merge
                if (fr < this.fr_min && i>9) {
                    this.traces_bar.decks[classIdx].y[rank] += fr
                    fr = 0
                }
                
                fr_avg += fr
                archFR.push(fr)
             
                
                

                for (var tier of this.tiers) {
                    if (rank == tier.start) {
                        
                        this.traces_pie['decks'][tier.name][0].values.push(fr)
                        this.traces_pie['decks'][tier.name][0].labels.push(archName)
                        this.traces_pie['decks'][tier.name][0].marker.colors.push(color)
                        //push fontColor!!
                    }
                    if (rank > tier.start && rank <= tier.end) {
                        this.traces_pie['decks'][tier.name][0].values[i] += fr
                    }
                    if (rank == tier.end) {
                        this.traces_pie.decks[tier.name][0].values[i] /= (tier.end - tier.start + 1)
                        this.traces_pie['decks'][tier.name][0].text.push(archName)

                        // Merge Pie
                        var fr_pie = this.traces_pie.decks[tier.name][0].values[i]
                        if (fr_pie <this.fr_min && i>9) {
                            this.traces_pie.decks[tier.name][0].values[i] = 0
                            this.traces_pie.decks[tier.name][0].values[classIdx] += fr_pie
                        } 
                    }
                }
            } // for ranks

            fr_avg /= hsRanks



            var arch_bar = {
                x:range(0,hsRanks),
                y:archFR.slice(),
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
                y: archFR_line.slice(),
                name: archName,
                text: archTxt,
                hoverinfo: 'text',
                orientation: 'h',
                marker: {color: color,},
                line: {width: this.lineWidth},
                type: 'scatter',
                mode: 'lines',
                winrate: 0,
                hsClass: ARCHETYPES[i][0]+ARCHETYPES[i][1],
                fr: fr_avg,
            }


            this.traces_bar.decks.push(arch_bar)
            this.traces_line.decks.push(arch_line)

            this.archLegend.push({name: archName, hsClass: ARCHETYPES[i][0], color: color, fontColor: hsFontColors[ARCHETYPES[i][0]], fr: fr_avg})
            this.archetypes.push({name:archName,fr:fr_avg, data: archFR, color: color, fontColor: hsFontColors[ARCHETYPES[i][0]]})

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

                for (var tier of this.tiers) {
                    if (rank >= tier.start && rank <= tier.end) { this.traces_pie['classes'][tier.name][0].values[i] += fr }
                    if (rank == tier.end) { this.traces_pie['classes'][tier.name][0].values[i] /= (tier.end-tier.start +1) }
                }
            }
            
            fr_avg /= hsRanks
            this.c_data[hsClass] = classFR.slice()

             

            var class_bar = {
                x: range(0,hsRanks),
                y: classFR.slice(),
                name: hsClass,
                text: classTxt.slice(),
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
                line: {width: this.lineWidth},
                type: 'scatter',
                mode: 'lines',
                winrate: 0,
                hsClass: hsClass,
                fr: fr_avg,
             }


            this.traces_bar.classes.push(class_bar)
            this.traces_line.classes.push(class_line)
            this.traces_bar.decks.push(arch_bar)
            this.traces_line.decks.push(arch_line)

            this.classLegend.push({name:hsClass, color: hsColors[hsClass]})
        }// close for Classes
        





        // LAYOUT BAR
        this.layout_bar = {
		    barmode: 'stack',
		    showlegend: false,
		    displayModeBar: false,
		    hovermode: 'closest',
		    xaxis: {
                //title: 'Ranks',
                tickfont: {
				    family: 'Arial, bold',
				    size: 15,
                    color: this.fontColor,
			    },
                visible: true, 
                showgrid: false,
                tickvals: range(0,hsRanks),
			    ticktext: this.rankLabels,
                ticklen: 5,
                tickcolor: 'transparent',
                hoverformat: '.1%',
                range: [21,-1],
                color: this.fontColor,
                fixedrange: true,
                zeroline: false,
                autorange: 'reversed',
            },
		    yaxis: {
                title: '[ % ]  of  Meta',
			    showgrid: false,
			    tickfont: {
				    family: 'Arial, bold',
				    size: 16,
			    },
                ticklen: 5,
                tickcolor: 'transparent',
                showticklabels: false,
                fixedrange: true,
                zeroline: false,
			    color: this.fontColorLight,
                tickformat: ',.0%',
		    },
            
		    plot_bgcolor: 'transparent',//this.bgColor,
            paper_bgcolor: 'transparent',//this.bgColor,
            margin: {l:60,r:30,b:35,t:0,},
	    }



        // LAYOUT LINE
        this.layout_line = {
            //title: 'Class Frequency per Rank',
		    showlegend: false,
		    displayModeBar: false,
            autosize: true,
		    hovermode: 'closest',
		    xaxis: {
                tickfont: {
				    family: 'Arial, bold',
				    size: 15,
                    color: this.fontColor,
			    },
                visible: true, 
                showgrid: true,
                tickvals: range(0,hsRanks),
			    ticktext: this.rankLabels,
                hoverformat: '.1%',
                range: [21,-1],
                color: this.fontColor,
                fixedrange: true,
                zeroline: false,
                autorange: 'reversed',
            },
		    yaxis: {
			    tickfont: {
				    family: 'Arial, bold',
				    size: 19,
			    },
                showgrid: true,
                ticklen: 12,
                tickcolor: 'transparent',
                tickformat: ',.0%',
                fixedrange: true,
			    color: this.fontColorLight,
		    },
		    plot_bgcolor: 'transparent',//this.bgColor,
            paper_bgcolor: this.bgColor,//this.bgColor2,
            margin: {l:70,r:20,b:30,t:0,},
        }



        

        // LAYOUT Pie
        this.layout_pie = {
		    showlegend: false,
		    displayModeBar: false,
            autosize: true,
            textinfo: 'label+percent',
            
		    hovermode: 'closest',
            
		    
		    plot_bgcolor: 'transparent',//this.bgColor, 
            paper_bgcolor: 'transparent',//this.bgColor,
            margin: {l:70,r:20,b:30,t:30,},
        }


       
        var classSort = function (a, b) { return a.hsClass < b.hsClass ? -1 : a.hsClass > b.hsClass ? 1 : 0; }
        var freqSort = function (a,b) { return a.fr > b.fr ? -1 : a.fr < b.fr ? 1 : 0;}

        this.traces_bar.classes.sort(classSort)
        this.traces_line.classes.sort(freqSort)
        this.traces_line.classes.splice(this.maxLines)
        
        this.traces_bar.decks.sort(classSort)
        this.traces_line.decks.sort(freqSort)
        this.traces_line.decks.splice(this.maxLines)
        
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
        this.rankFolder.style.display = 'none'


        if (this.window.plotType == 'pie') {
            this.rankFolder.style.display = 'flex'
            layout = this.layout_pie
            data = this.traces_pie[this.window.mode][this.tier.name]
        }

        if (this.window.plotType == 'number') {
            this.createTable(this.window.mode)
            return
        }

        if (this.window.plotType == 'bar') {
            layout = this.layout_bar
            data = this.traces_bar[this.window.mode]
        }

        if (this.window.plotType == 'line') {
            layout = this.layout_line
            data = this.traces_line[this.window.mode]
        }

        Plotly.newPlot('chart1',data, layout, {displayModeBar: false,})



        var windowInfo = document.querySelector('#ladderWindow .nrGames')
        var totGames = (this.window.plotType != 'pie') ? this.totGames : this.totGamesRanks[this.tier.name]    
        windowInfo.innerHTML = totGames.toLocaleString()+" games"

        if (this.window.mode == 'decks') {this.createLegend('decks')}
        if (this.window.mode == 'classes') {this.createLegend('classes')}
    }


    colorScale(x) {
        var c1 = [255,255,255]
        var c2 = [87, 125, 186]
        var c3 = []

        x /= 0.15
        if (x>1) {x = 1}

        for (var i=0;i<3;i++) {c3.push((c1[i]+(c2[i]-c1[i])*x).toFixed(0))}
        return 'rgb('+c3[0]+','+c3[1]+','+c3[2]+')'
    }




    // createTable2 (mode) {

    //     var maxArch = 20
    //     if (this.archetypes.length < maxArch) {maxArch = this.archetypes.length}

    //     document.getElementById('chart1').innerHTML = ""
        
    //     var table = `<table style="width:100%">`
    //     table += `<tr><th class="pivot">Rank -></th>`

    //     for (var i=20;i>0;i--) {table += `<th>${i}</th>`}
    //     table += `<th>L</th></tr>`

    //     if (mode == 'decks') {
    //         for (var j=0; j<maxArch; j++) {
    //             var arch = this.archetypes[j]
    //             table += `<tr><td class="pivot" style="background-color:${arch.color}">${arch.name}</td>`
    //             for (var i=hsRanks-1;i>-1;i--) {table += `<td style="background-color:${this.colorScale(arch.data[i])};">${(arch.data[i]*100).toFixed(1)}%</td>`}
    //             table += `</tr>`
    //         }
    //     } 

    //     else {
    //         for (var j=0; j<9; j++) {
    //             var hsClass = hsClasses[j]
    //             var data = this.c_data[hsClass]
    //             table += `<tr><td class="pivot" style="background-color:${hsColors[hsClass]}">${hsClass}</td>`
    //             for (var i=hsRanks-1;i>-1;i--) { table += `<td style="background-color:${this.colorScale(data[i])};">${(data[i]*100).toFixed(1)}%</td>` }
    //             table += `</tr>`
    //         }   
    //     }
    //     table += `</table>`
    //     document.getElementById('chart1').innerHTML = table

    //     this.createNumbersFooter()
    // }



    createTable(mode) {

        var maxArch = 20
        if (this.archetypes.length < maxArch) {maxArch = this.archetypes.length}
        document.getElementById('chart1').innerHTML = ""
        
        var table = document.createElement('table')
        table.style.width = '100%'
        var headerRow = document.createElement('tr')

        var item = document.createElement('th')
        item.className = 'pivot'
        item.innerHTML = 'Rank ->'
        headerRow.appendChild(item)

        for (var i=hsRanks-1;i>=0;i--) {
            var item = document.createElement('th')
            item.innerHTML = (i>0) ? i : 'L'
            headerRow.appendChild(item)
        }
        table.appendChild(headerRow)

        if (mode == 'decks') {
            for (var j=0; j<maxArch; j++) {
                var arch = this.archetypes[j]
                var row = document.createElement('tr')
                var pivot = document.createElement('td')
                pivot.className = 'pivot'
                pivot.style.backgroundColor = arch.color
                pivot.style.color = arch.fontColor
                pivot.innerHTML = arch.name
                row.appendChild(pivot)
                for (var i=hsRanks-1;i>-1;i--) {
                    var item = document.createElement('td')
                    item.style.backgroundColor = this.colorScale(arch.data[i])
                    item.innerHTML = (arch.data[i]*100).toFixed(1) + '%'
                    row.appendChild(item)
                }
                table.appendChild(row)
            }
        }

        if (mode == 'classes') {
            for (var j=0; j<9; j++) {
                var hsClass = hsClasses[j]
                var data = this.c_data[hsClass]
                var row = document.createElement('tr')
                var pivot = document.createElement('td')
                pivot.className = 'pivot'
                pivot.style.backgroundColor = hsColors[hsClass]
                pivot.style.color = hsFontColors[hsClass]
                pivot.innerHTML = hsClass
                row.appendChild(pivot)
                for (var i=hsRanks-1;i>-1;i--) {
                    var item = document.createElement('td')
                    item.style.backgroundColor = this.colorScale(data[i])
                    item.innerHTML = (data[i]*100).toFixed(1) + '<span style="color=#999">%</span>'
                    row.appendChild(item)
                }
                table.appendChild(row)
            }   
        }
        
        
        document.getElementById('chart1').appendChild(table)
        this.createNumbersFooter()
    }

    createLegend(mode) {
        var chartFooter = document.querySelector('#ladderWindow .chart-footer')
        while (chartFooter.firstChild) {chartFooter.removeChild(chartFooter.firstChild);}
        
        var maxElements
        var legend = this.archLegend
        if (mode=='classes') {maxElements = 9}
        if (mode=='decks') {
            maxElements = this.maxLegendEntries;
            if (maxElements > legend.length) {maxElements = legend.length}
        }

        for (var i=0;i<maxElements;i++) {

            var legendDiv = document.createElement('div')   
            var colorSplash = document.createElement('div')
            var archName = document.createElement('l')     

            legendDiv.className = 'ladder-legend'
            legendDiv.style.fontSize = '0.8em'
        
            if (mode=='classes') {

                var hsClass = hsClasses[i]
                legendDiv.style = 'background-color:'+hsColors[hsClass]+'; color:'+hsFontColors[hsClass]
                legendDiv.id = hsClass
                legendDiv.innerHTML = hsClass
                legendDiv.onclick = function(e) { ui.deckLink(e.target.id,this.f);  }
            }

            if (mode=='decks') {

                var l = legend[i]
                legendDiv.style = 'background-color:'+l.color+'; color:'+hsFontColors[l.hsClass]
                legendDiv.id = l.name
                legendDiv.innerHTML = l.name
                legendDiv.onclick = function(e) { ui.deckLink(e.target.id,this.f);  }
            }


            chartFooter.appendChild(legendDiv)

        }
    }



    createNumbersFooter() {
        var chartFooter = document.querySelector('#ladderWindow .chart-footer')
        while (chartFooter.firstChild) {chartFooter.removeChild(chartFooter.firstChild);}

        var div = document.createElement('div')
        var csvBtn = document.createElement('button')
        var clipboardBtn = document.createElement('button')

        clipboardBtn.innerHTML = "Copy to Clipboard <div class='fa fa-clipboard'></div>"
        clipboardBtn.style = "background-color:#92fc64;color: black; padding:0.2rem;margin:0.2rem;font-size:0.8rem;text-align:center;"
        clipboardBtn.className = 'copyNumbers'
        csvBtn.innerHTML = "Download as csv <div class='fa fa-cloud-download'></div>"
        csvBtn.style = "background-color:#57a1c1; padding:0.2rem;font-size:0.8rem;text-align:center;"

        div.style = "font-size:2rem;"

        div.appendChild(csvBtn)
        div.appendChild(clipboardBtn)

        chartFooter.appendChild(div)

        new Clipboard('.copyNumbers', {
            text: function(trigger) {
                return 'hello'
            }
        });
    }


    zoomToggle (data) {
        var hsClass = data.points[0].data.hsClass
    }

}// class Ladder


















