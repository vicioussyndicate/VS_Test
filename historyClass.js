
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
            document.querySelector('#ladderWindow .content-header #rankBtn').style.display = 'inline'
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
            
            /* // Animation
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
    