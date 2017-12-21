


class Ladder {

    constructor (DATA,f,t,window) {

        this.maxLegendEntries = 9
        this.maxLines = 10 // max archetypes shown for the line chart

        this.bgColor = 'transparent'
        this.fontColor = window.fontColor
        this.fontColorLight = window.fontColorLight
        this.lineWidth = 2.7
        this.fr_min = 0.03

        this.DATA = DATA
        this.f = f
        this.t = t
        this.window = window
        
        this.archetypes = []
        this.c_data = {}

        this.traces_bar =   {classes: [], decks:[]}
        this.traces_line =  {classes: [], decks:[]}
        this.traces_zoom =  {}
        this.traces_pie =   {classes: {}, decks:{}}      

        this.archLegend = []
        this.classLegend = []
        this.totGames = 0
        this.totGamesRanks = {}
        this.download = {classes:'',decks:''}

        this.rankLabels = []
        this.tiers = []

        for (var r of this.window.ranks) {
            this.tiers.push({
                name: btnIdToText[r],
                buttonId: r,
                start: rankRange[r][0],
                end: rankRange[r][1],
            })
        }

        this.tier = this.tiers[0]

        for (var hsClass of hsClasses) {this.traces_zoom[hsClass] = []}

        for (var tier of this.tiers) {

            this.totGamesRanks[tier.buttonId] = 0

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

            this.traces_pie['decks'][tier.buttonId] = [trace_decks]
            this.traces_pie['classes'][tier.buttonId] = [trace_classes]
            
        }







        var ARCHETYPES =    DATA.archetypes
        var rankSums =      DATA.gamesPerRank
        this.rankSums = DATA.gamesPerRank
        var rankData =      this.smoothLadder(DATA.rankData,rankSums.slice())
        var classRankData = this.smoothLadder(DATA.classRankData,rankSums.slice())
        


        // Game Sums and rank labels
        for (var i=0;i<hsRanks;i++) {
            if (i%5==0) {this.rankLabels.push(i+'  ')}
            else {this.rankLabels.push('')}
            this.totGames += rankSums[i]
            for (var tier of this.tiers) {
                if (i >= tier.start && i <= tier.end) { this.totGamesRanks[tier.buttonId] += rankSums[i] }
            }
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
            var color = this.window.getArchColor(ARCHETYPES[i][0],ARCHETYPES[i][1],this.f)            
            var fontColor = color.fontColor
            color = color.color

            // var color = hsColors[ARCHETYPES[i][0]]
            // var fontColor = hsFontColors[ARCHETYPES[i][0]]


            for (var rank=0;rank<hsRanks;rank++) {
                var fr = rankData[rank][i]
                archFR_line.push(fr)                
                archTxt.push(`<b>${archName}     </b><br>freq: ${(fr*100).toFixed(1)}%`)

                // Merge
                if (fr < this.fr_min && i>8) {
                    this.traces_bar.decks[classIdx].y[rank] += fr
                    fr = 0
                }
                
                fr_avg += fr
                archFR.push(fr)
             
                
                

                for (var tier of this.tiers) {
                    if (rank == tier.start) {
                        
                        this.traces_pie['decks'][tier.buttonId][0].values.push(fr)
                        this.traces_pie['decks'][tier.buttonId][0].labels.push(archName)
                        this.traces_pie['decks'][tier.buttonId][0].marker.colors.push(color)
                    }
                    if (rank > tier.start && rank <= tier.end) {
                        this.traces_pie['decks'][tier.buttonId][0].values[i] += fr
                    }
                    if (rank == tier.end) {
                        this.traces_pie.decks[tier.buttonId][0].values[i] /= (tier.end - tier.start + 1)
                        this.traces_pie['decks'][tier.buttonId][0].text.push(archName)

                        // Merge Pie
                        var fr_pie = this.traces_pie.decks[tier.buttonId][0].values[i]
                        if (fr_pie <this.fr_min && i>8) {
                            this.traces_pie.decks[tier.buttonId][0].values[i] = 0
                            this.traces_pie.decks[tier.buttonId][0].values[classIdx] += fr_pie
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
                marker: {color: color,
                    //line: {color: '#ebebeb',width: 1}
                },
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

            this.archLegend.push({name: archName, hsClass: ARCHETYPES[i][0], color: color, fontColor: fontColor, fr: fr_avg})
            this.archetypes.push({name:archName, hsClass: ARCHETYPES[i][0], fr:fr_avg, data: archFR_line.slice(), color: color, fontColor: fontColor})

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
                    if (rank >= tier.start && rank <= tier.end) { this.traces_pie['classes'][tier.buttonId][0].values[i] += fr }
                    if (rank == tier.end) { this.traces_pie['classes'][tier.buttonId][0].values[i] /= (tier.end-tier.start +1) }
                }
            }

            // push zoom traces
            var fr_tot = fillRange(0,hsRanks,0)
            for (var a of this.archetypes) {
                if (a.hsClass != hsClass) {continue}
                var text = []
                var overall = []
                var fr_avg = 0
                for (var rank=0;rank<hsRanks;rank++) { fr_tot[rank] += a.data[rank]; text.push(''); overall.push(a.data[rank]); fr_avg += a.data[rank] }
                var bar_zoom = {
                    x: range(0,hsRanks),
                    y: a.data.slice(),
                    name: a.name,
                    text: text,
                    hoverinfo: 'text',
                    marker: {color: a.color},
                    type: 'bar',
                    winrate: 0,
                    hsClass: hsClass,
                    overall: overall,
                    fr_avg: fr_avg/hsRanks,
                }

                this.traces_zoom[hsClass].push(bar_zoom)
            }

            for (var a of this.traces_zoom[hsClass]) {
                for (var rank=0;rank<hsRanks;rank++) { 
                    a.y[rank] /= (fr_tot[rank]>0) ? fr_tot[rank] : 1
                    a.text[rank] = a.name+'<br>'+(100*a.y[rank]).toFixed(1)+'% of '+a.hsClass+'<br>'+(100*a.overall[rank]).toFixed(1)+'% overall'
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
                y:classFR.slice(),
                name: hsClass,
                text: classTxt.slice(),
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

            this.classLegend.push({name:hsClass, color: hsColors[hsClass]})
        }// close for Classes
        





        // LAYOUT BAR
        this.layout_bar = {
		    barmode: 'stack',
		    showlegend: false,
		    displayModeBar: false,
            hovermode: 'closest',
            annotations: [],
		    xaxis: {
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
                hoverformat: ',.0%',
                visible: !MOBILE, // not visible if mobile view
		    },
		    plot_bgcolor: 'transparent',//this.bgColor,
            paper_bgcolor: 'transparent',//this.bgColor,
            margin: MOBILE ? {l:10,r:10,b:35,t:0,} : {l:60,r:30,b:35,t:0,},
        }



        // LAYOUT LINE
        this.layout_line = {
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
            margin: (MOBILE) ? {l:60, r:10, b: 50, t: 0} : {l:70,r:20,b:30,t:0,},
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
        this.window.hideRankFolder()


        switch(this.window.plotType) {
        
            case 'pie':
                this.window.showRankFolder()
                layout = this.layout_pie
                data = this.traces_pie[this.window.mode][this.window.r]
                break
            
            case 'number':
                this.createTable(this.window.mode)
                this.window.setGraphTitle()
                return
        
            case 'bar':
                layout = this.layout_bar
                data = this.traces_bar[this.window.mode]
                break
                
            case 'zoom':
                layout = this.layout_bar
                data = this.traces_zoom[this.window.zoomClass]
                break
                
            case 'line':
                layout = this.layout_line
                data = this.traces_line[this.window.mode]
                break
        }


        /*
        if (this.window.plotType == 'pie') {
            this.window.showRankFolder()
            layout = this.layout_pie
            data = this.traces_pie[this.window.mode][this.window.r]
        }

        if (this.window.plotType == 'number') {
            this.createTable(this.window.mode)
            this.window.setGraphTitle()
            this.window.nrGames = this.totGames 
            this.window.setGraphTitle()
            return
        }

        if (this.window.plotType == 'bar') {
            layout = this.layout_bar
            data = this.traces_bar[this.window.mode]
        }

        if (this.window.plotType == 'zoom') {
            layout = this.layout_bar
            data = this.traces_zoom[this.window.zoomClass]
        }

        if (this.window.plotType == 'line') {
            layout = this.layout_line
            data = this.traces_line[this.window.mode]
        }*/

        if (MOBILE == 'portrait' && this.window.plotTyp != 'pie') {
            layout.width = ui.width*2
            layout.height = ui.height*0.6
        }


        Plotly.newPlot('chart1',data, layout, {displayModeBar: false,})
        

        var totGames = (this.window.plotType != 'pie') ? this.totGames : this.totGamesRanks[this.window.r]
        this.window.nrGames = totGames 
        this.window.setGraphTitle()

        this.annotate(this.window.annotated)

        this.createLegend(this.window.mode)
        if ((this.window.plotType == 'bar' || this.window.plotType == 'zoom') && PREMIUM) {
            document.getElementById('chart1').on('plotly_click', this.zoomToggle.bind(this))
        }
    }


    colorScale(x) {
        var c1 = this.window.colorScale_c1
        var c2 = this.window.colorScale_c2
        var c3 = []

        x /= this.window.colorScale_f
        if (x>1) {x = 1}

        for (var i=0;i<3;i++) {c3.push(parseInt(c1[i]+(c2[i]-c1[i])*x))}
        return 'rgb('+c3[0]+','+c3[1]+','+c3[2]+')'
    }


    annotate(bool) {
        var plotType = this.window.plotType
        if (plotType == 'pie' || plotType == 'number' || plotType == 'timeline') {return}
        var update
        var heights = {
            bar: 0.5,
            zoom: 0.5,
            line: 0.05,
        }
        var textangle = (plotType == 'bar' || plotType == 'zoom') ? 90:0
        if (bool) {
            var annotations = []
            for (var i=0;i<hsRanks;i++) {
                var ann = {
                    x: i,
                    y: heights[plotType],
                    xref: 'x',
                    yref: 'y',
                    textangle: textangle,
                    text: this.rankSums[i],
                    showarrow: false,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    font: {color:'white'},
                    opacity: 0.8
                }
                annotations.push(ann)
            }
            update = { annotations: annotations};
        }
        else {update = { annotations: []};}

        Plotly.relayout('chart1', update)
    }




    createTable(mode) {

        var maxArch = 20
        if (this.archetypes.length < maxArch) {maxArch = this.archetypes.length}
        document.getElementById('chart1').innerHTML = ""
        
        var table = document.createElement('table')
        table.id = 'numberTable'
        var headerRow = document.createElement('tr')
        this.download[mode] = [[]]

        var item = document.createElement('th')
        item.className = 'pivot'
        item.innerHTML = 'Rank ->'
        headerRow.appendChild(item)
        this.download[mode] += 'Rank%2C'
        

        for (var i=hsRanks-1;i>=0;i--) {
            var item = document.createElement('th')
            item.innerHTML = (i>0) ? i : 'L'
            headerRow.appendChild(item)
            this.download[mode] += (i>0) ? i : 'L'
            this.download[mode] += '%2C'
        }
        table.appendChild(headerRow)
        this.download[mode] += '%0A'

        if (mode == 'decks') {
            for (var j=0; j<maxArch; j++) {
                var arch = this.archetypes[j]
                var row_dl = arch.name + '%2C'
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
                    row_dl += arch.data[i] + '%2C'
                }
                table.appendChild(row)
                this.download[mode] += row_dl+`%0A`
            }
        }

        if (mode == 'classes') {
            for (var j=0; j<9; j++) {
                var hsClass = hsClasses[j]
                var data = this.c_data[hsClass]
                var row_dl = hsClass + '%2C'
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
                    item.innerHTML = (data[i]*100).toFixed(1) + '%'
                    row.appendChild(item)
                    row_dl += data[i] + '%2C'
                }
                table.appendChild(row)
                this.download[mode] += row_dl+`%0A`
            }   
        }
        
        
        document.getElementById('chart1').appendChild(table)
        this.createNumbersFooter()
    }


    createLegend(mode) {

        if (this.window.plotType == 'zoom') {this.createZoomLegend(); return}

        this.window.clearChartFooter()
        
        var maxElements
        var legend = this.archLegend
        if (mode=='classes') {maxElements = 9}
        if (mode=='decks') {
            maxElements = this.maxLegendEntries;
            if (maxElements > legend.length) {maxElements = legend.length}
        }



        for (var i=0;i<maxElements;i++) {

            if (mode=='classes') { this.window.addLegendItem(hsClasses[i]) }
            if (mode=='decks') { this.window.addLegendItem(legend[i].name) }
        }
    }


    createZoomLegend() {
        var hsClass = this.window.zoomClass
        this.window.clearChartFooter()
        for (var arch of this.traces_zoom[hsClass]) { if (arch.fr_avg > 0) { this.window.addLegendItem(arch.name) } }
    }


    createNumbersFooter() {
        var chartFooter = document.querySelector('#ladderWindow .chart-footer')
        while (chartFooter.firstChild) {chartFooter.removeChild(chartFooter.firstChild);}

        if (!PREMIUM) {return}
            
        var csvBtn = document.createElement('button')
        
        csvBtn.innerHTML = "Download <div class='fa fa-cloud-download'></div>"
        csvBtn.className = 'download'
        csvBtn.addEventListener('click',this.downloadCSV.bind(this))
        chartFooter.appendChild(csvBtn)
    }

    
    downloadCSV() {
        var dlink = document.createElement('a')
        dlink.setAttribute('href', 'data:text/plain;charset=utf-8,' + this.download[this.window.mode])
        dlink.setAttribute('download', 'ladder.csv');
        dlink.style.display = 'none';
        document.body.appendChild(dlink);
        dlink.click();
        document.body.removeChild(dlink);
    }

    zoomToggle (data) {

        if (this.window.plotType == 'zoom') {
            this.window.plotType = 'bar'
            this.plot()
            return
        }

        this.window.plotType = 'zoom'
        var zoomClass = data.points[0].data.hsClass
        if (hsClasses.indexOf(zoomClass) == -1) {
            for (var c of hsClasses) {
                if (zoomClass.indexOf(c) != -1) {
                    this.window.zoomClass = c
                    break 
        }}}
        else {this.window.zoomClass = zoomClass}
        this.plot()
    }

}// class Ladder


















