



class LadderWindow {


    constructor(callback) {

        this.div = document.querySelector('#ladderWindow')
        this.tab = document.querySelector('#ladder.tab')
        this.chartDiv = document.querySelector('#ladderWindow #chart1')
        this.classDeckOptions = document.querySelector('#ladderWindow .content-header .classDeckOptions')
        // this.nrGamesBtn = document.querySelector('#ladderWindow .content-header #nrGames')
        this.nrGamesBtn = document.querySelector('#ladderWindow .content-header #showNumbers')
        this.graphTitle = document.querySelector('#ladderWindow .graphTitle')
        this.graphLabel = document.querySelector('#ladderWindow .graphLabel')
        this.rankFolder = document.querySelector('#ladderWindow .content-header #rankBtn')
        this.optionButtons = document.querySelectorAll('#ladderWindow .optionBtn')
        this.questionBtn = document.querySelector('#ladderWindow .question')
        this.overlayDiv = document.querySelector('#ladderWindow .overlay')
        this.overlayP = document.querySelector('#ladderWindow .overlayText')
        this.chartFooter = document.querySelector('#ladderWindow .chart-footer')
        this.firebasePath = (PREMIUM) ? 'premiumData/ladderData' : 'data/ladderData'
        this.firebaseHistoryPath = (PREMIUM) ? 'premiumData/historyData' : ''
        this.overlayText = {}

        this.overlayText.bar = `
        This stacked bar graph displays the class/ deck frequencies on the y-axis and the ranks on the ranked ladder on the x-axis.<br><br>
        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>
        Tips:<br><br>
        • Hover over the 'number of games' label in the header to display the number of games per rank on the bar plot.<br><br>
        • Click on one bar of any class to 'zoom in' to display all the archetypes of that class. Click again to 'zoom out'.<br><br>
        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>
        `
        this.overlayText.zoom = this.overlayText.bar

        this.overlayText.line = `
        This line graph displays the class/ deck frequencies on the y-axis and the ranks on the ranked ladder on the x-axis.<br><br>
        In <span class='optionBtn'>Decks</span> mode the chart displays the 9 most frequent decks.<br><br>
        Tips:<br><br>
        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>
        `

        this.overlayText.pie = `
        This pie graph displays the class/ deck frequencies as pie slices. You can vary the rank brackets in the header.<br><br>
        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>
        Tips:<br><br>
        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>
        `

        this.overlayText.number = `
        This table displays the class/ deck frequencies over ladder ranks (rank 20 - Legend). You can vary the rank brackets in the header.<br><br>
        In <span class='optionBtn'>Decks</span> mode decks with 3% or lower frequencies have been merged with the 'Other' decks of that class.<br><br>
        Click on the "download" button at the bottom of the graph to download the data as '.csv' file.<br><br>
        `

        this.overlayText.timeline = `
        This line graph displays the class/ deck frequencies on the y-axis and time (in hours or days) on the x-axis.<br><br>
        If you choose 'Last Day', 'Last 6 Hours' or 'Last 12 Hours' the time unit is in 'Hours' whereas for 'Last 3 Days' etc. it's in 'Days'.<br><br>
        The 'Hours' lines have been averaged between +/- 1 Hour to make for a smoother curve.<br><br>
        In <span class='optionBtn'>Decks</span> mode the chart displays the 9 most frequent decks.<br><br>
        Tips:<br><br>
        • Click on a class or deck button at the bottom of the graph to get to the respective description or decklist.<br><br>
        `

        this.overlayText.map = `
        The VS Meta Score aims to give a broad overview over the current state of the ladder meta.<br><br>
        Each archetype is represented as a colored dot and plotted according to its winrate (x-axis) and frequency (y-axis).
        Both axis are scaled from 0 to 1.<br><br> 
        &#8226 Frequency is scaled from 0% of the meta (0 on the plot) to the highest frequency of any archetype (1 on the plot) <br><br>
        &#8226 Winrates are scaled from the highest winrate among all archetypes (1 on the plot) to 50% - delta where delta is the 
        distance of the highest winrate above 50%<br><br>
        `




        
        this.fontColor = '#222'
        this.fontColorLight = '#999'
        this.overlay = false
        this.annotated = false

        // table
        this.colorScale_c1 = [255,255,255]
        this.colorScale_c2 = [87, 125, 186]
        this.colorScale_f = 0.15

        

        this.data = {}
        this.hsFormats = hsFormats
        this.hsTimes =  (PREMIUM) ? ladder_times_premium : ladder_times
        this.ranks =    (PREMIUM) ? ladder_ranks_premium : ladder_ranks
        this.layouts = {}
       

        // Defaults

        this.f = 'Standard'
        this.t = 'lastDay'
        this.r = 'ranks_all'
        this.plotType = 'bar'
        this.plotTypes = ['bar','line','pie','number','timeline']
        this.mode = 'classes' // classes, decks
        this.fullyLoaded = false
        this.history = {}
        this.zoomClass = null


        for (var f of this.hsFormats) {
            this.data[f] = {fullyLoaded: false}
            this.history[f] = {fullyLoaded: false}
            for (var t of this.hsTimes) {
                this.data[f][t] = null
        }}

        this.loadData('Standard', callback)
        this.setupUI()
        this.renderOptions()
    } // close Constructor


    setupUI() {
        for (var btn of this.optionButtons) { btn.addEventListener("click", this.buttonTrigger.bind(this)) }
        this.setupLayouts()

        this.dropdownFolders = {
            format: document.querySelector('#ladderWindow #formatFolder .dropdown'),
            time: document.querySelector('#ladderWindow #timeFolder .dropdown'),
            rank: document.querySelector('#ladderWindow #rankFolder .dropdown'),
        }

        let mouseOut = function(event) { 
            let e = event.toElement || event.relatedTarget;
            if (e.parentNode == this || e == this) { return }
            this.classList.add('hidden') 
        }

        for (let key in this.dropdownFolders) { 
            let folder = this.dropdownFolders[key]
            folder.innerHTML = ""
            folder.onmouseout = mouseOut
        }


        for (var f of this.hsFormats) {
            var btn = document.createElement('button')
            btn.className = 'optionBtn folderBtn'
            btn.innerHTML = f
            btn.id = f
            const trigger = function (e) {this.f = e.target.id; this.plot()}
            btn.onclick = trigger.bind(this)
            this.dropdownFolders.format.appendChild(btn)
        }

        for (let t of this.hsTimes) {
            var btn = document.createElement('button')
            btn.className = 'optionBtn folderBtn'
            btn.innerHTML = btnIdToText[t]
            btn.id = t
            let trigger = function (e) {this.t = e.target.id; this.plot()}
            btn.onclick = trigger.bind(this)
            this.dropdownFolders.time.appendChild(btn)
        }

        for (var r of this.ranks) {
            var btn = document.createElement('button')
            btn.className = 'optionBtn folderBtn'
            btn.innerHTML = btnIdToText[r]
            btn.id = r
            const trigger = function (e) { this.r = e.target.id; this.plot() }
            btn.onclick = trigger.bind(this)
            this.dropdownFolders.rank.appendChild(btn)
        }

        let disp = (PREMIUM) ? 'flex' : 'none'

        this.questionBtn.addEventListener('click',this.toggleOverlay.bind(this))
        this.overlayDiv.addEventListener('click',this.toggleOverlay.bind(this))

        this.classDeckOptions.style.display = disp

        document.querySelector('#ladderWindow .content-header .graphOptions #line').style.display = disp
        //document.querySelector('#ladderWindow .content-header .graphOptions #number').style.display = disp
        document.querySelector('#ladderWindow .content-header .graphOptions #timeline').style.display = disp
        this.nrGamesBtn.onclick = this.annotate.bind(this)

        this.optionButtons = document.querySelectorAll('#ladderWindow .optionBtn')
    }

    display(bool) {
        if (bool) {
            this.div.style.display = 'inline-block'
            this.f = app.path.hsFormat
            this.plot()

        } else {
            app.path.hsFormat = this.f
            this.div.style.display = 'none'
        }
    }

    annotate() { 
        if (this.plotType == 'pie' || this.plotType == 'number') {return}
        if (this.annotated) {
            if (this.plotType == 'timeline') { this.history[this.f].annotate(false) }
            else { this.data[this.f][this.t].annotate(false) }
            this.nrGamesBtn.classList.remove('highlighted')
        }
        else {
            if (this.plotType == 'timeline') { this.history[this.f].annotate(true) }
            else { this.data[this.f][this.t].annotate(true) }
            this.nrGamesBtn.classList.add('highlighted')
        }
        this.annotated = !this.annotated
    }

    showGames() { if (this.plotType == 'bar' || this.plotType == 'zoom' || this.plotType == 'line') {this.data[this.f][this.t].annotate(true)} }
    hideGames() { if (!this.annotated) {this.data[this.f][this.t].annotate(false) } }

    buttonTrigger(e) {

        var btnID = e.target.id

        if (btnID == 'classes')     {this.mode = 'classes'}
        if (btnID == 'decks')       {this.mode = 'decks'}

        if (btnID == 'bar')         {this.plotType = 'bar'}
        if (btnID == 'line')        {this.plotType = 'line'}
        if (btnID == 'pie')         {this.plotType = 'pie'}
        if (btnID == 'number')      {this.plotType = 'number'}
        if (btnID == 'map')         {this.plotType = 'map'}
        if (btnID == 'timeline')    {this.plotType = 'timeline'}

        if (this.plotType == 'zoom' && this.mode != 'classes') {this.plotType = 'bar'}
        
        this.plot()
    }// button Handler




    renderOptions() {

        for (let btn of this.optionButtons) { 
            btn.classList.remove('highlighted')
            if (btn.id == this.mode)                    {btn.classList.add('highlighted')}
            if (btn.id == this.plotType)                {btn.classList.add('highlighted')}
            if (btn.id == 'nrGames' && this.annotated)  {btn.classList.add('highlighted')}
        }
        document.querySelector("#ladderWindow #formatBtn").innerHTML = (MOBILE) ? btnIdToText_m[this.f] : btnIdToText[this.f]
        document.querySelector("#ladderWindow #timeBtn").innerHTML =   (MOBILE) ? btnIdToText_m[this.t] : btnIdToText[this.t]
        document.querySelector("#ladderWindow #rankBtn").innerHTML =   (MOBILE) ? btnIdToText_m[this.r] : btnIdToText[this.r]
    }


    checkLoadData(callback) {

        let back = (callback != undefined)
        console.log('checkLoadData',back,callback)

        if (!this.data[this.f].fullyLoaded) {
            let callback2 = function() { app.ui.ladderWindow.checkLoadData(callback) }
            if (back) { return this.loadData(this.f,callback2) }
            else { return false }
        }

        if (this.plotType == 'map' && !app.ui.tableWindow.data[this.f].fullyLoaded) {
            let callback2 = function() { app.ui.ladderWindow.checkLoadData(callback) }
            if (back) { return app.ui.tableWindow.loadData(this.f,callback2) }
            else { return false }
        }

        if (this.plotType == 'timeline' && !this.history[this.f].fullyLoaded && PREMIUM) {
            let callback2 = function() { app.ui.ladderWindow.checkLoadData(callback) }
            if (back) { return this.loadHistoryData(this.f,callback2) }
            else { return false }
        }

        if (this.data[this.f].fullyLoaded) {
            if (back) { return callback.apply(this) }
            else { return true }
        }
    }


    loadData(hsFormat, callback) {
        this.fullyLoaded = false
        let ref = app.fb_db.ref(this.firebasePath+'/'+hsFormat)
        let reader = function(DATA) { this.readData(DATA, hsFormat, callback) }
        ref.on('value', reader.bind(this), e => console.log('Could not load Ladder Data',e))
        
        
    }

    loadHistoryData(hsFormat,callback) {
        if (PREMIUM) {
            let ref_h = app.fb_db.ref(this.firebaseHistoryPath+'/'+hsFormat)
            let reader_h = function(DATA) { this.readHistoryData(DATA, hsFormat, callback) }
            ref_h.on('value',reader_h.bind(this), e => console.log('Could not load history data',e))
        }
    }



    readData(DATA, hsFormat, callback) {
        if (this.fullyLoaded) {return}

        let ladderData = DATA.val()
        for (let t of this.hsTimes) { this.data[hsFormat][t] = new Ladder(ladderData[t],hsFormat,t,this) }
        this.fullyLoaded = true
        this.data[hsFormat].fullyLoaded = true
        console.log('ladder loaded: '+ (performance.now()-t0).toFixed(2)+' ms')
        
        app.ui.hideLoader()
        callback.apply(this)
        this.plot()
    }
    
    readHistoryData(DATA, hsFormat, callback) { 
        this.history[hsFormat] = new History(DATA.val(),this)
        callback.apply(this)
    }



    plot () { 

        switch (this.plotType) {
            case 'bar':
                this.nrGamesBtn.style.display = 'flex'
                if (!PREMIUM) { 
                    this.classDeckOptions.style.display = 'none' 
                    this.mode = 'classes'
                }
                break

            case 'line':
                this.nrGamesBtn.style.display = 'flex'
                break

            case 'pie':
                this.nrGamesBtn.style.display = 'none'
                if (!PREMIUM) { this.classDeckOptions.style.display = 'flex' }
                break

            case 'number':
                this.nrGamesBtn.style.display = 'none'
                if (!PREMIUM) { 
                    this.classDeckOptions.style.display = 'none' 
                    this.mode = 'classes'
                }
                break

            case 'map':
                this.nrGamesBtn.style.display = 'none'
                break

            case 'timeline':
                this.nrGamesBtn.style.display = 'flex'
                break
        }

        
        this.renderOptions()

        if (!this.checkLoadData()) { 
            let callback = _ => { app.ui.ladderWindow.plot() }
            return this.checkLoadData(callback)
        }

        if (this.plotType == 'timeline') {this.history[this.f].plot(); return}
        this.data[this.f][this.t].plot();
    }


    
    

    showRankFolder() { this.rankFolder.style.display = 'flex' }
    hideRankFolder() { 
        this.rankFolder.style.display = 'none'
        let dropdown = document.querySelector('#ladderWindow #rankDropdown')
        if (!dropdown.classList.contains('hidden')) { dropdown.classList.add('hidden')}
    }

    setGraphTitle() {
        var m = (this.mode == 'classes') ? 'Class' : 'Deck'
        var time = (['lastDay','last6Hours','last12Hours'].indexOf(this.t) != -1) ? 'Hours' : 'Days'
        var rank = btnIdToText[this.r]
        let data = this.data[this.f][this.t]
        let nrGames = (this.plotType != 'pie') ? data.totGames : data.totGamesBrackets[this.r]
        var games = `<span style='font-size: 80%'> ( ${nrGames.toLocaleString()} games )</span>`
        switch (this.plotType) {
            case 'bar': 
                this.graphTitle.innerHTML = 'Class Frequency vs Ranks'+games; 
                this.graphLabel.innerHTML = 'Ranks >'
                break;
            case 'zoom':
                this.graphTitle.innerHTML = this.zoomClass+' Deck Frequency vs Ranks'+games; 
                this.graphLabel.innerHTML = 'Ranks >'
                break;
            case 'line': 
                this.graphTitle.innerHTML = m + ' Frequency vs Ranks'+games;
                this.graphLabel.innerHTML = 'Ranks >'
                break;
            case 'pie': 
                this.graphTitle.innerHTML = m + ' Frequency of '+rank+games; 
                this.graphLabel.innerHTML = ''
                break;
            case 'number': 
                this.graphTitle.innerHTML = m + ' Frequency vs Ranks'+games; 
                this.graphLabel.innerHTML = ''
                break;
            case 'timeline': 
                this.graphTitle.innerHTML = m + ' Frequency over Time'+games;
                this.graphLabel.innerHTML = ''//'Past ' + time + ' >'; 
                break;
            case 'map':
                this.graphTitle.innerHTML = 'Meta Score'+games;
                this.graphLabel.innerHTML = ''//'Past ' + time + ' >'; 
                break;
        }
    }

    toggleOverlay() {
        if (this.overlay) {this.overlayDiv.style.display = 'none'; this.overlay = false}
        else{
            this.overlayDiv.style.display = 'block'; 
            this.overlay = true
            this.overlayP.innerHTML = this.overlayText[this.plotType]
        }
    }

    addLegendItem(archName) {
        
        var legendDiv = document.createElement('div')   
        var colorSplash = document.createElement('div')
        var name = document.createElement('l')
        var colors = app.ui.getArchColor(null, archName, this.f)

        legendDiv.className = 'legend-item'
        legendDiv.style.fontSize = '0.8em'

        legendDiv.style = 'background-color:'+colors.color+'; color:'+colors.fontColor
        legendDiv.id = archName
        legendDiv.innerHTML = archName
        legendDiv.onclick = function(e) { 
            if (app.ui.decksWindow == null) { return }
            app.path.hsFormat = this.f
            //app.ui.ladderWindow.display(false)
            app.ui.deckLink(e.target.id);  
        }

        this.chartFooter.appendChild(legendDiv)
        
    }

    clearChartFooter() {
        while (this.chartFooter.firstChild) {this.chartFooter.removeChild(this.chartFooter.firstChild);}
    }

    setupLayouts() {

        let rankLabels = []
        for (let rank of range(0,hsRanks)) {
            let label = ( rank % 5 == 0 ) ? rank+'  ' : ''
            rankLabels.push(label)
        }


        // LAYOUT BAR
        this.layouts.bar = {
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
                ticktext: rankLabels,
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
        this.layouts.line = {
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
                ticktext: rankLabels,
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
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
            margin: (MOBILE) ? {l:60, r:10, b: 50, t: 0} : {l:70,r:20,b:30,t:0,},
        }



        

        // LAYOUT PIE
        this.layouts.pie = {
            showlegend: false,
            displayModeBar: false,
            autosize: true,
            textinfo: 'label+percent',
            
            hovermode: 'closest',
            
            
            plot_bgcolor: 'transparent',//this.bgColor, 
            paper_bgcolor: 'transparent',//this.bgColor,
            margin: {l:70,r:20,b:30,t:30,},
        }


        // LAYOUT MAP
        let lineLayout_dot = { color: 'rgba(50,50,50,0.5)', width: 1.5, opacity: 0.5, dash: 'dot' }
        let lineLayout = { color: 'rgba(50,50,50,0.5)', width: 1.5, opacity: 0.5 }
        this.layouts.map = {
            showlegend: false,
            hovermode: 'closest',
            displayModeBar: false,
            autosize: true,
            margin: MOBILE ? {l:10,r:10,b:35,t:0,} : {l:60,r:30,b:50,t:0,},
            xaxis: {
                range: [0,1.05],
                title: 'Winrate',
                zeroline: false,
                fixedrange: true,
                tickvals: [0,0.25,0.5,0.75,1.0],
                tickfont: {
                    family: 'Arial, bold',
                    size: 15,
                    color: this.fontColor,
                },
            },

            yaxis: { 
                range: [0, 1.05],
                title: 'Frequency',
                zeroline: false,
                fixedrange: true,
                tickvals: [0,0.25,0.5,0.75,1.0],
                tickfont: {
                    family: 'Arial, bold',
                    size: 15,
                    color: this.fontColor,
                },
            },
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
            shapes: [{  type: 'line', x0: 0.5, x1: 0.5, y0: 0.0, y1: 1.0, line: lineLayout_dot },
                     {  type: 'line', x0: 1.0, x1: 1.0, y0: 0.0, y1: 1.0, line: lineLayout },
                     {  type: 'line', x0: 0.0, x1: 1.0, y0: 0.5, y1: 0.5, line: lineLayout_dot },
                     {  type: 'line', x0: 0.0, x1: 1.0, y0: 1.0, y1: 1.0, line: lineLayout },
                     {  type: 'line', x0: 0.0, x1: 1.0, y0: 0.0, y1: 0.0, line: lineLayout },
                     {  type: 'line', x0: 0.0, x1: 0.0, y0: 0.0, y1: 1.0, line: lineLayout },
                    ],
        }

        this.layouts.number = {}
        this.layouts.zoom = this.layouts.bar
    } // setup layouts

} // close LadderWindow



















