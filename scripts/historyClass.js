
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
                annotations: [],
                margin: (MOBILE) ? {l:60, r:10, b: 50, t: 0} : {l:70,r:20,b:30,t:0,},
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
            document.querySelector('#ladderWindow .content-header #rankBtn').style.display = 'inline'
        
            var f = this.window.f
            var t_w = this.window.t
            var t_h = (this.window.t == 'lastDay' || this.window.t == 'last12Hours' || this.window.t == 'last6Hours') ? 'lastHours' : 'lastDays';
            const baseUnit = (t_h == 'lastHours') ? 'Hour' : 'Day';
            const t_delay = (t_h == 'lastHours') ? 1:0
            var r = this.window.r
            var m = this.window.mode
            var x = range(1,this.x[t_w]+1)
            var d = this.data[f][t_h][r][m] // data 
            var maxEntry = 0

            var traces = []
            var zeroTraces = []
            var archetypes = []
            
            var totGames = 0
            var total = d[d.length-1]['data'].slice() // last line is always the total games 
            for (var i=0;i<this.x[t_w] && i<total.length;i++) {totGames += total[i]}

            d.sort(function (a, b) { return a.avg > b.avg ? -1 : a.avg < b.avg ? 1 : 0 })
                    
            
            for (var i=0; i<this.top;i++) { 

                var colors
                var archName = d[i]['name']
                if (m=='classes') { colors = { color: hsColors[archName], fontColor: hsFontColors[archName] } }
                else { colors = this.window.getArchColor(0, archName, this.window.f) } 

                archetypes.push({name: archName, color: colors.color, fontColor: colors.fontColor})
                var y = (t_h == 'lastHours') ? this.smoothData(d[i]['data']) : d[i]['data']

                var text = []
                for (var j=t_delay;j<y.length;j++) {
                    var unit = (j>0) ? baseUnit+'s' : baseUnit;
                    text.push(`${d[i]['name']} (${(y[j]*100).toFixed(1)}% )<br>${x[j]+' '+unit} ago`)
                    if (y[j] > maxEntry) {maxEntry = y[j]}
                }
                var xrange = (t_h == 'lastHours') ? range(2,x.length+1) : range(0,x.length)

                zeroTraces.push({
                    x: xrange,
                    y: fillRange(0,y.length,0),
                    text: text,
                    line: {width: 2.5, simplify: false},
                    marker: {color: colors.color,},
                    type: 'scatter',
                    mode: 'lines',
                    hoverinfo:'text',
                })

                traces.push({
                    x: xrange,
                    y: y.slice(),
                    text: text,
                    line: {width: 2.5},
                    marker: {color: colors.color,},
                    type: 'scatter',
                    mode: 'lines',
                    hoverinfo:'text',
                })
            }
            
            var xLabels = []
            var step_hours = 3
            var step_days = 4
            if (t_h == 'lastHours') {
                var t0 = (new Date()).getHours()
                for (var i=0;i<x.length;i++) {
                    if (i%step_hours!=0 && i!=1) {xLabels.push(''); continue}
                    var ti = parseInt((t0+24-i)%24)
                    xLabels.push(ti+':00')
            }}

            if (t_h == 'lastDays') {
                for (var i=0;i<x.length;i++) {
                    if (i%step_days!=0 && i!=0) {xLabels.push(''); continue}
                    var t0 = new Date()
                    t0.setDate(t0.getDate()-i);
                    xLabels.push(t0.getDate()+'.'+(t0.getMonth()+1)+'.')
            }}

            this.layout.yaxis['range'] = [0,maxEntry*1.1]
            this.layout.xaxis['tickvals'] = range(0,x.length)
            this.layout.xaxis['ticktext'] = xLabels
            this.layout.xaxis['tickangle'] = 'xLabels', 
            this.layout.xaxis['range'] = [this.x[t_w]+1,2]       
            
            Plotly.newPlot('chart1',zeroTraces, this.layout, {displayModeBar: false,})
            this.window.setGraphTitle()
            this.createLegend(archetypes)
            this.window.setTotGames(totGames)

            // Animation

            Plotly.animate('chart1', {
                data: traces,
                traces: range(0,traces.length),
                layout: {},
              }, {
                transition: {
                  duration: 100,
                  easing: 'linear'//'cubic-in-out'
                }
              })
        }
    



        createLegend(archetypes) {

            var mode = this.window.mode
            this.window.clearChartFooter()
            
            var maxElements = 9

            if (mode=='classes') {maxElements = 9}
            if (mode=='decks') {
                maxElements = this.top;
                if (maxElements > archetypes.length) {maxElements = archetypes.length}
            }
    
            for (var i=0;i<maxElements;i++) {        
                if (mode=='classes') { this.window.addLegendItem(hsClasses[i]) }
                if (mode=='decks') { this.window.addLegendItem(archetypes[i].name) }
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
    