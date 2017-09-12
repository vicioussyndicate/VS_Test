




class Table {

    constructor(DATA,f,t,r,window) {
       
        this.DATA = DATA
        this.f = f
        this.t = t
        this.r = r
        this.window = window

        this.sortBy = ''
        this.numArch = (f == 'Standard') ? 20 : 20;
        this.bgColor = 'transparent'
        this.fontColor = '#22222'
        this.subplotRatio = 0.6
        this.width = document.querySelector('.main-wrapper').offsetWidth -40
        this.height = 560

        this.table = []
        this.textTable = []
        this.frequency = []
        this.archetypes = []
        this.classPlusArch = [] // needed for Class Sort
        this.winrates = []
        this.totGames = 0

        
        
        for (var i=0;i<this.numArch;i++) {
            this.table.push(fillRange(0,this.numArch,0))
            this.textTable.push(fillRange(0,this.numArch,''))
        }
    
    
        var FR =            DATA.frequency.slice()
        var TABLE =         DATA.table.slice()
        var ARCHETYPES =    DATA.archetypes.slice()
        
    
    
        // Take only the most common
        var idx_f = range(0,FR.length)
        idx_f.sort(function (a, b) { return FR[a] > FR[b] ? -1 : FR[a] < FR[b] ? 1 : 0; });
        idx_f.splice(this.numArch)

        // Process Data
        for (var i=0;i<this.numArch;i++) {
        
            var x = idx_f[i]
        
            this.frequency.push(FR[x])
            this.archetypes.push(ARCHETYPES[x][1]+" "+ARCHETYPES[x][0])
            this.classPlusArch.push(ARCHETYPES[x][0]+ARCHETYPES[x][1])
                
        
            for (var j=i;j<this.numArch;j++) {
        
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
                    
                this.table[i][j] = wr
                this.table[j][i] = 1-wr
                this.totGames += totGames
                this.textTable[i][j] =`${hero}<br><b>vs:</b> ${opp}<br><b>wr:</b>  ${(wr*100).toFixed(0)}%  (${totGames})`           
                this.textTable[j][i] =`${opp}<br><b>vs:</b> ${hero}<br><b>wr:</b>  ${((1-wr)*100).toFixed(0)}%  (${totGames})` 
        
            }
        }// close Process Data

        // Calculate Winrates
        var freqSum = 0;
    
        for (var i=0;i<this.numArch;i++) {freqSum += this.frequency[i]}
        if (freqSum == 0) {freqSum = 1; console.log('freqSum = 0');}

        for (var i=0;i<this.numArch;i++) {
            var wr = 0
            for (var j=0;j<this.numArch;j++) {wr += this.table[i][j]*this.frequency[j]}
            this.winrates.push(wr/freqSum)
        }
        
    
        this.layout = {
            showlegend: false,
            xaxis: {side: 'top',
                showgrid: false,
                tickcolor: this.fontColor,
                color: this.fontColor,
                gridcolor:this.fontColor,
                fixedrange: true,
            },
            yaxis: {
                autorange: 'reversed',
                tickcolor: this.fontColor, 
                color:this.fontColor, 
                gridcolor:this.fontColor,
                fixedrange: true,
            },
            plot_bgcolor: "transparent",
            paper_bgcolor: this.bgColor,
            margin: {l: 120, r: 30, b: 30, t: 100 },
            width: this.width,
            height: this.height,
            //autosize: true,

            yaxis2: {
                visible: false,
                showticklabels: false,
                fixedrange: true,
                domain: [0, 0.01],
                anchor: 'x',
            },
        }
    
        this.getFreqPlotData()
    }// close constructor


    getFreqPlotData(freq, archetypes) {

        var freq = this.frequency.slice()        
        var freqSum = 0
        var text = []
    
        for (var i=0;i<freq.length;i++) {freqSum+=freq[i]}
        for (var i=0;i<freq.length;i++) {
            freq[i] = freq[i]/freqSum
            text.push("FR: "+(100*freq[i]).toFixed(1)+"%")
        }
    
    
        this.freqPlotData = {
            x: [this.archetypes],
            y: [freq],
            text: [text],
            visible:true,
            hoverinfo: 'text',
            marker: {
                color: '#a3a168',
            },
        }
    }

    

    plot() {

        var overallWR = this.winrates
        var table = this.table.concat([overallWR])
        var arch = this.archetypes.concat(['Overall'])
        var textRow = []
        for (var i=0;i<table[0].length;i++) {textRow.push("Overall WR: "+(100*overallWR[i]).toFixed(1)+"%")}
        var textTable = this.textTable.concat([textRow])


        
        var trace_Table = {
            type: 'heatmap',
            z: table,
            x: this.archetypes,
            y: arch,
            text: textTable,
            hoverinfo: 'text',
            colorscale: colorscale_Table,
            showscale: false,
        }

        // Default Frequency Trace
        var trace_FR = {
            visible: false,	
            x: this.archetypes,
            y: range(0,this.numArch),
            xaxis: 'x',
            yaxis: 'y2',
            type: 'line',
            hoverinfo: 'x+y',
        }
        
        var trace_WR = {
            visible: false,	
            x: this.archetypes,
            y: range(0,this.numArch),
            xaxis: 'x',
            yaxis: 'y2',
            type: 'line',
            hoverinfo: 'x+y',
        }
        
        var data = [trace_Table,trace_FR,trace_WR]

        Plotly.newPlot('chart2',data,this.layout,{displayModeBar: false})
        document.getElementById('chart2').on('plotly_click', this.zoomToggle.bind(this))

        if (this.window.zoomIn) {this.zoomIn(this.window.zoomArch)}
        document.getElementById('loader').style.display = 'none'

        var windowInfo = document.querySelector('#tableWindow .nrGames')    
        windowInfo.innerHTML = this.totGames.toLocaleString()+" games"
    }




    subPlotFR() { Plotly.restyle('chart2',this.freqPlotData,1) }

    subPlotWR (idx) {
        var wr
    
        if (idx == -1 || idx >= this.numArch) {wr = this.winrates.slice()}
        else {wr = this.table[idx].slice()}
            
        if (idx > this.numArch) {return}
        
        var text = []
        for (var i=0;i<wr.length;i++) {text.push("WR: "+(100*wr[i]).toFixed(1)+"%"); wr[i]-= 0.5}
    
        var wrPlotData = {
            type: 'bar',
            x: [this.archetypes],
            y: [wr],
            text: [text],
            visible: true,
            hoverinfo:'text',
            marker: {
                color: '#222',
            },
        }
        
        Plotly.restyle('chart2',wrPlotData,2)
    }

    zoomToggle (data) {
        var arch = data.points[0].y
        if (this.window.zoomIn == false) { this.zoomIn(arch) }
        else { this.zoomOut()}
    }

    

    zoomIn (arch) {
        var idx = this.archetypes.indexOf(arch)
    
        if (arch == 'Overall')  {idx = this.numArch}
        if (idx == -1)          {this.zoomOut(); return}
    
        var layout = {
            yaxis: {range: [idx-0.5, idx+0.5],fixedrange:true,color:'white',tickcolor:'white'},
            yaxis2: {
                domain: [0, this.subplotRatio],
                visible: false,
                fixedrange: true,
            },
        }
    
        Plotly.relayout('chart2',layout)
        this.subPlotFR()
        this.subPlotWR(idx)

        var OptMU = document.querySelector('#tableWindow #matchup')
        var OptWR = document.querySelector('#tableWindow #winrate')
        OptMU.style.display = 'inline-block'
        if (arch == 'Overall') { OptWR.style.display = 'none' }
    
        this.window.zoomIn = true
        this.window.zoomArch = arch
    }



    zoomOut () {
        var layout_zoomOut = {
            yaxis:{	
                range:[this.numArch+0.5,-0.5],
                color: 'white',
                tickcolor: 'white',
                fixedrange: true,
            },
            yaxis2: {domain: [0, 0.01], visible: false, fixedrange:true},
        }
        Plotly.relayout('chart2',layout_zoomOut);
        Plotly.restyle('chart2',{visible:false},[1,2])

        var OptMU = document.querySelector('#tableWindow #matchup')
        var OptWR = document.querySelector('#tableWindow #winrate')
        OptMU.style.display = 'none'
        OptWR.style.display = 'inline-block'
            
        this.window.zoomIn = false
    }




    sortTableBy (what, plot=true) {        
        var self = this

        if (this.sortBy == what && !this.window.zoomIn) {console.log('already sorted by '+what);return}
        
        var idxs = range(0,this.numArch)
        var zoomIdx = this.archetypes.indexOf(this.window.zoomArch)

        var sortByMU = function (a,b) {return self.table[zoomIdx][a] > self.table[zoomIdx][b] ? -1: self.table[zoomIdx][a] < self.table[zoomIdx][b] ? 1 : 0 ;}
        var sortByWR = function (a, b) { return self.winrates[a] > self.winrates[b] ? -1 : self.winrates[a] < self.winrates[b] ? 1 : 0; }
        var sortByFR = function (a, b) { return self.frequency[a] > self.frequency[b] ? -1 : self.frequency[a] < self.frequency[b] ? 1 : 0; }
        var sortByClass = function (a, b) { return self.classPlusArch[a] < self.classPlusArch[b] ? -1 : self.classPlusArch[a] > self.classPlusArch[b] ? 1 : 0; }

        if (what == 'winrate') {idxs.sort(sortByWR)}
        if (what == 'matchup') {idxs.sort(sortByMU)}
        if (what == 'frequency') {idxs.sort(sortByFR)}
        if (what == 'class') {idxs.sort(sortByClass)}
        

        var table = []
        var textTable = []
        var archetypes = []
        var frequency = []
        var winrates = []
        var classPlusArch = []

        for (var i=0;i<self.numArch;i++) {
            var idx = idxs[i]
            
            classPlusArch.push(self.classPlusArch[idx])
            archetypes.push(self.archetypes[idx])
            frequency.push(self.frequency[idx])
            winrates.push(self.winrates[idx])
            
            
            var tableRow = []
            var textTableRow = []

            for (var j=0;j<self.numArch;j++) {
                tableRow.push( self.table[idx][idxs[j]] )
                textTableRow.push( self.textTable[idx][idxs[j]] )
            }
            table.push(tableRow)
            textTable.push(textTableRow)
        }
        
        var el = document.querySelector('#tableWindow .content-header #sortBtn')
        el.innerHTML = what
    
        this.table = table
        this.textTable = textTable
        this.archetypes = archetypes
        this.classPlusArch = classPlusArch
        this.frequency  = frequency
        this.winrates  = winrates
        this.sortBy = what
        this.window.sortBy = what
        this.getFreqPlotData()
        
        if (plot) { this.plot() }
    } // close SortBy    
}// close Table
