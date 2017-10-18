




class Table {

    constructor(DATA,f,t,r,window) {
       
        this.DATA = DATA
        this.f = f
        this.t = t
        this.r = r
        this.window = window

        this.sortBy = ''
        this.numArch = (f == 'Standard') ? this.window.top : this.window.top;
        this.bgColor = 'transparent'
        this.fontColor = '#22222'
        this.subplotRatio = 0.6
        this.overallString = '<b style="font-size:130%">Overall</b>'
        this.minGames = 20
        this.whiteTile = 0.50000001
        this.blackTile = 0.51
        this.colorScale =  [
            [0, '#a04608'],
            [0.3, '#d65900'],
            [0.5, '#FFFFFF'],
            // [this.whiteTile, '#FFFFFF'],
            // [this.blackTile, '#222222'],
            // [this.blackTile+0.0000001,'#FFFFFF'],
            [0.7,'#00a2bc'],
            [1, '#055c7a']
        ];


        this.table = []
        this.textTable = []
        this.frequency = []
        this.archetypes = []
        this.classPlusArch = [] // needed for Class Sort
        this.winrates = []
        this.totGames = 0
        this.download = ''

        
        
        
        var FR =            DATA.frequency.slice()
        var TABLE =         DATA.table.slice()
        var ARCHETYPES =    DATA.archetypes.slice()
        if (this.numArch > ARCHETYPES.length) {this.numArch = ARCHETYPES.length}    
    

        // Take only the most common
        var idx_f = range(0,FR.length)
        idx_f.sort(function (a, b) { return FR[a] > FR[b] ? -1 : FR[a] < FR[b] ? 1 : 0; });
        //idx_f.splice(0,this.numArch)

        for (var i=0;i<this.numArch;i++) {
            this.table.push(fillRange(0,this.numArch,0))
            this.textTable.push(fillRange(0,this.numArch,''))
        }

        // Process Data
        for (var i=0;i<this.numArch;i++) {
        
            var x = idx_f[i]
        
            this.frequency.push(FR[x])
            this.archetypes.push(ARCHETYPES[x][1]+" "+ARCHETYPES[x][0])
            this.classPlusArch.push(ARCHETYPES[x][0]+ARCHETYPES[x][1])
                
        
            for (var j=i;j<this.numArch;j++) {
        
                var y = idx_f[j]
                var wr = 0

                var wr1 = 0
                var wr2 = 0
    
                var w1 = TABLE[x][y][0]
                var l1 = TABLE[x][y][1]
                if (w1 + l1 > 0) {wr1 = w1/(w1+l1)}
    
                var w2 = TABLE[y][x][1]
                var l2 = TABLE[y][x][0]
                if (w2 + l2 > 0) {wr2 = w2/(w2+l2)}

                var totGames = w1+w2+l1+l2
        
                //if (i==j) {wr1 = this.blackTile; wr2 = this.blackTile; wr = this.blackTile} // wr = 50%
                if (i==j) {wr1 = 0.5; wr2 = 0.5; wr = 0.5} 
                else {
                    
                    //if (totGames < this.minGames) {wr = this.whiteTile}
                    if (totGames < this.minGames) {wr = 0.5}
                    else if (w1+l1 > 0 && w2+l2 > 0) {wr = (wr1+wr2)/2}
                    else if (w1+l1 == 0) {wr = wr2}
                    else {wr = wr1}
                }

                    
                var hero =  ARCHETYPES[x][1]+" "+ARCHETYPES[x][0]
                var opp = ARCHETYPES[y][1]+" "+ARCHETYPES[y][0]
                    
                this.table[j][i] = 1-wr
                this.table[i][j] = wr
                this.totGames += totGames
                if (totGames >= this.minGames) {
                    this.textTable[i][j] =`${hero}<br><b>vs:</b> ${opp}<br><b>wr:</b>  ${(wr*100).toFixed(1)}%  (${totGames})`           
                    this.textTable[j][i] =`${opp}<br><b>vs:</b> ${hero}<br><b>wr:</b>  ${((1-wr)*100).toFixed(1)}%  (${totGames})`
                } else {
                    this.textTable[i][j] =`${hero}<br><b>vs:</b> ${opp}<br><b>wr:</b>  Not enough games`           
                    this.textTable[j][i] =`${opp}<br><b>vs:</b> ${hero}<br><b>wr:</b>  Not enough games`
                }
        
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
                tickangle: 45,
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
            margin: {l: 120, r: 0, b: 30, t: 100 },
            width: (MOBILE) ? ui.width*2 : this.window.width,
            height: (MOBILE) ?  ui.height*0.8 : this.window.height,

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
        if (this.sortBy == '' || this.sortBy != this.window.sortBy) {this.sortTableBy(this.window.sortBy, false)}

        var overallWR = this.winrates
        var table = this.table.concat([overallWR])
        var arch = this.archetypes.concat([this.overallString])
        var textRow = []
        for (var i=0;i<table[0].length;i++) { textRow.push(`${this.archetypes[i]}<br>Overall wr: ${(100*overallWR[i]).toFixed(1)}%`) }
        var textTable = this.textTable.concat([textRow])


        
        var trace_Table = {
            type: 'heatmap',
            z: table,
            x: this.archetypes,
            y: arch,
            text: textTable,
            hoverinfo: 'text',
            colorscale: this.colorScale,
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
        if (this.window.annotated) {data.push(this.getAnnotations())}

        Plotly.newPlot('chart2',data,this.layout,{displayModeBar: false})
        if (PREMIUM) {
            document.getElementById('chart2').on('plotly_click', this.zoomToggle.bind(this))
        }

        if (this.window.zoomIn) {this.zoomIn(this.window.zoomArch)}
        document.getElementById('loader').style.display = 'none'

        this.window.nrGames = this.totGames
        this.window.setTotGames()
       
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
            marker: { color: '#222' },
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
    
        if (arch == this.overallString)  {idx = this.numArch}
        if (idx == -1)          {this.zoomOut(); return}
    
        var layout = {
            yaxis: {range: [idx-0.5, idx+0.5],fixedrange:true,color:this.fontColor,tickcolor:this.fontColor},
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
        if (arch == this.overallString) { OptMU.style.display = 'none' }
    
        this.window.zoomIn = true
        this.window.zoomArch = arch
    }



    zoomOut () {
        var layout_zoomOut = {
            yaxis:{	
                range:[this.numArch+0.5,-0.5],
                color: this.fontColor,
                tickcolor: this.fontColor,
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
        
    
        this.table = table
        this.textTable = textTable
        this.archetypes = archetypes
        this.classPlusArch = classPlusArch
        this.frequency  = frequency
        this.winrates  = winrates
        this.sortBy = what
        this.window.sortBy = what
        this.getFreqPlotData()
        this.window.renderOptions()
        
        if (plot) { this.plot() }
    } // close SortBy    

    downloadCSV() {
        this.download = ' %2C'
        for (var i=0;i<this.numArch;i++) { this.download += this.archetypes[i]+'%2C' }
        this.download += '%0A'
        for (var i=0;i<this.numArch;i++) {
            this.download += this.archetypes[i] + '%2C'
            for (var j=0;j<this.numArch;j++) { this.download += this.table[i][j] + '%2C' }
            this.download += '%0A'
        }

        // Overall
        this.download += 'Overall%2C'
        for (var i=0;i<this.numArch;i++) { this.download += this.winrates[i] + '%2C' }

        var dlink = document.createElement('a')
        dlink.setAttribute('href', 'data:text/plain;charset=utf-8,' + this.download)
        dlink.setAttribute('download', 'matchupTable.csv');
        dlink.style.display = 'none';
        document.body.appendChild(dlink);
        dlink.click();
        document.body.removeChild(dlink);
    }    

    

    getAnnotations() {

        var toFixed = (ui.width >= 900 ) ? 1:0
        
        var tr = {
            x: [],
            y: [],
            mode: 'text',
            text: [],
            font: {
                color:'black',
                size: 8,
            },
            hoverinfo: 'none',
            //opacity: 0.8,
        }
        for (var i=0;i<this.numArch;i++) {

            tr.x.push(this.archetypes[i])
            tr.y.push(this.overallString)
            tr.text.push((100*this.winrates[i]).toFixed(toFixed)+'%')

            for (var j=0;j<this.numArch;j++) {
                tr.x.push(this.archetypes[i])
                tr.y.push(this.archetypes[j])
                tr.text.push((100*this.table[j][i]).toFixed(toFixed)+'%')
        }}

        return tr
    }

}// close Table










