




class Ladder {

    constructor (DATA,f,t,window) {

        this.maxLegendEntries = 9
        this.maxLines = 10 // max archetypes shown for the line chart

        this.bgColor = 'transparent'
        this.fontColor = '#222'

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

        this.traces_bar = {classes: [], decks:[]}
        this.traces_class_bar = []

        this.traces_line = {classes: [], decks:[]}
        this.traces_class_line = []

        this.traces_pie = {classes: {}, decks:{}}
        
        this.traces_time = {classes: [], decks:[]}
        this.traces_class_time = []

        this.archLegend = []
        this.classLegend = []
        this.totGames = 0

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

            var button = document.createElement('button')
            var clickButton = function () {this.tier = tier; this.plot()}
            button.className = 'button#'+tier.buttonId+'.optionBtn.folderBtn'
            button.onclick = clickButton.bind(this)

            this.dropdownDiv.appendChild(button)
            

            var trace_decks = {
                values: [],
                labels:[],
                marker: {colors: []},
                hoverinfo: 'label+percent',
                insidetextfont: {color:'white'},
                outsidetextfont: {color:'transparent'},
                text: [],
                type:'pie',
            }

            var color_classes = []
            for (hsClass of hsClasses) { color_classes.push(hsColors[hsClass]) }

            var trace_classes =  {
                values: fillRange(0,hsClasses.length,0),
                labels: hsClasses.slice(),
                marker: {colors:color_classes},
                hoverinfo: 'label+percent',
                insidetextfont: {color:'black'},
                outsidetextfont: {color:'white'},
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


            //archtimeline
            var archT = []
            for (var j=0; j<this.days;j++) { archT.push(Math.random()) }

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
                type: 'scatter',
                winrate: 0,
                hsClass: ARCHETYPES[i][0]+ARCHETYPES[i][1],
                fr: fr_avg,
            }

            var arch_time = {
                x: range(0,this.days),
                y: archT,
                name: archName,
                //text: 'name+x',
                hoverinfo: 'name+x',
                orientation: 'h',
                marker: {color: color,},
                type: 'scatter',
                winrate: 0,
                hsClass: ARCHETYPES[i][0]+ARCHETYPES[i][1],
                fr: fr_avg,
            }

            this.traces_bar.decks.push(arch_bar)
            this.traces_line.decks.push(arch_line)
            this.traces_time.decks.push(arch_time)

            this.archLegend.push({name: archName, color: color, fr: fr_avg})
            this.archetypes.push({name:archName,fr:fr_avg, data: archFR, color: color})

        } // close for ARCHETYPES
                
        
        // Where is the fr loss?
        var frSum = 0
        for (var tr of this.traces_bar.decks) {frSum += tr.y[0]}
        console.log('freq Sum = ',frSum)

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

             //classTime
             var classT = []
             for (var j=0; j<this.days;j++) { classT.push(Math.random()) }


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

             var class_time = {
                x: range(0,this.days),
                y: classT,
                name: hsClass,
                hoverinfo: 'name+x',
                orientation: 'h',
                marker: {color: hsColors[hsClass],},
                type: 'scatter',
                winrate: 0,
                hsClass: hsClass,
                fr: fr_avg,
            }

            this.traces_bar.classes.push(arch_bar)
            this.traces_line.classes.push(arch_line)
            this.traces_time.classes.push(arch_time)

            this.traces_class_bar.push(class_bar)
            this.traces_class_line.push(class_line)
            this.traces_class_time.push(class_time)
            this.classLegend.push({name:hsClass, color: hsColors[hsClass]})
        }// close for Classes
        





        // LAYOUT BAR
        this.layout_bar = {
		    barmode: 'stack',
		    showlegend: false,
		    displayModeBar: false,
		    hovermode: 'closest',
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
			    color: this.fontColor,
                tickformat: ',.0%',
		    },
            
		    plot_bgcolor: this.bgColor,
            paper_bgcolor: this.bgColor,
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

                //zeroline: false,
			    color: this.fontColor,
		    },
		    plot_bgcolor: this.bgColor,
            paper_bgcolor: this.bgColor,//this.bgColor2,
            margin: {l:70,r:20,b:30,t:0,},
        }



        // LAYOUT TIME
        this.layout_time = {
            title: 'Class Frequency over the last 14 days',
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
                tickcolor: 'transparent',
                visible: true, 
                showgrid: true,
                hoverformat: '.1%',
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
                ticklen: 12,
                tickcolor: 'transparent',
                tickformat: ',.0%',
                fixedrange: true,
			    color: this.fontColor,
		    },
		    plot_bgcolor: this.bgColor, 
            paper_bgcolor: this.bgColor,
            margin: {l:70,r:20,b:30,t:0,},
        }

        // LAYOUT Pie
        this.layout_pie = {
		    showlegend: false,
		    displayModeBar: false,
            autosize: true,
            textinfo: 'label+percent',
            
		    hovermode: 'closest',
            
		    
		    plot_bgcolor: this.bgColor, 
            paper_bgcolor: this.bgColor,
            margin: {l:70,r:20,b:30,t:30,},
        }


       
        var classSort = function (a, b) { return a.hsClass < b.hsClass ? -1 : a.hsClass > b.hsClass ? 1 : 0; }
        var freqSort = function (a,b) { return a.fr > b.fr ? -1 : a.fr < b.fr ? 1 : 0;}

        this.traces_class_bar.sort(classSort)
        this.traces_class_line.sort(freqSort)
        this.traces_class_line.splice(this.maxLines)

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
        console.log('plot ladder')
        document.getElementById('chart1').innerHTML = ""
        var data, layout
        this.rankFolder.style.display = 'none'

        if (this.window.plotType == 'timeline') {
            this.rankFolder.style.display = 'flex'
            layout = this.layout_time
            if (this.window.mode == 'decks') {data = this.traces_time.decks }//this.traces_arch_time}
            if (this.window.mode == 'classes') {data = this.traces_class_time}
        }

        if (this.window.plotType == 'pie') {
            this.rankFolder.style.display = 'flex'
            layout = this.layout_pie
            data = this.traces_pie[this.window.mode][this.tier.name]
        }

        if (this.window.plotType == 'number') {
            if (this.window.mode == 'decks') {this.createTable('decks'); return}
            if (this.window.mode == 'classes') {this.createTable('classes'); return}
        }

        if (this.window.plotType == 'bar') {
            layout = this.layout_bar
            if (this.window.mode == 'decks') {data = this.traces_bar.decks }//this.traces_arch_bar}
            if (this.window.mode == 'classes') {data = this.traces_class_bar}
        }

        if (this.window.plotType == 'line') {
            layout = this.layout_line
            if (this.window.mode == 'decks') {data = this.traces_line.decks }//this.traces_arch_line}
            if (this.window.mode == 'classes') {data = this.traces_class_line}
        }

        Plotly.newPlot('chart1',data, layout, {displayModeBar: false,})



        var windowInfo = document.querySelector('#ladderWindow .nrGames')    
        windowInfo.innerHTML = this.totGames.toLocaleString()+" games"

        if (this.window.mode == 'decks') {this.createLegend('decks')}
        if (this.window.mode == 'classes') {this.createLegend('classes')}
        //document.getElementById('chart1').on('plotly_click', this.zoomToggle.bind(this))
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
                table += `<tr><td class="pivot" style="background-color:${arch.color}">${arch.name}</td>`
                for (var i=hsRanks-1;i>-1;i--) {table += `<td style="background-color:${this.colorScale(arch.data[i])};">${(arch.data[i]*100).toFixed(1)}%</td>`}
                table += `</tr>`
            }
        } 

        else {
            for (var j=0; j<9; j++) {
                var hsClass = hsClasses[j]
                var data = this.c_data[hsClass]
                table += `<tr><td class="pivot" style="background-color:${hsColors[hsClass]}">${hsClass}</td>`
                for (var i=hsRanks-1;i>-1;i--) { table += `<td style="background-color:${this.colorScale(data[i])};">${(data[i]*100).toFixed(1)}%</td>` }
                table += `</tr>`
            }   
        }
        table += `</table>`
        document.getElementById('chart1').innerHTML = table

        this.createNumbersFooter()
    }


    createLegend(mode) {
        var contentFooter_ladder = document.querySelector('#ladderWindow .content-footer')
        while (contentFooter_ladder.firstChild) {contentFooter_ladder.removeChild(contentFooter_ladder.firstChild);}
        
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
                colorSplash.style = 'background-color:'+hsColors[hsClass]+';height:15px;width:30px;margin:0 auto 0.7em auto;'
                archName.innerHTML = hsClass
                legendDiv.id = hsClass
                legendDiv.onclick = function(e) { toggleMainTabs({target:document.querySelector('#decks.tab')}); console.log(e) }
            }

            if (mode=='decks') {

                var l = legend[i]
                colorSplash.style = 'background-color:'+l.color+';height:15px;width:30px;margin:0 auto 0.7em auto;'
                archName.innerHTML = l.name
                legendDiv.id = l.name
                legendDiv.onclick = function(e) { toggleMainTabs({target:document.querySelector('#decks.tab')}); console.log(e) }
            }

            legendDiv.appendChild(colorSplash)
            legendDiv.appendChild(archName)
            

            contentFooter_ladder.appendChild(legendDiv)

        }
    }



    createNumbersFooter() {
        var contentFooter_ladder = document.querySelector('#ladderWindow .content-footer')
        while (contentFooter_ladder.firstChild) {contentFooter_ladder.removeChild(contentFooter_ladder.firstChild);}

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

        contentFooter_ladder.appendChild(div)

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


















