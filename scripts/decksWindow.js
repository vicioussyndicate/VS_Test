



class DecksWindow {

    constructor (callback) {

        this.hsFormats = hsFormats

        //this.sidebar = document.querySelector('#decksWindow .content .sidebar.left .archetypeList')
        //this.sidebarRight1 = document.querySelector('#decksWindow .content .sidebar.right .archetypeList')
        this.div = document.querySelector('#decksWindow')
        this.tab = document.querySelector('#decks.tab')
        this.chartDiv = document.querySelector('#decksWindow .content .chart')
        this.descriptionBox = document.querySelector('#decksWindow .content .descriptionBox')
        this.decksDiv = document.querySelector('#decksWindow .content .decklists')
        this.description = document.querySelector('#decksWindow .content .descriptionBox .description')
        this.overlayDiv = document.querySelector('#decksWindow .overlay')
        this.overlayP = document.querySelector('#decksWindow .overlayText')
        this.questionBtn = document.querySelector('#decksWindow .question')

        this.subWindows = [this.descriptionBox, this.decksDiv ,this.chartDiv] // depending on mode
        
        let sb1 = document.querySelector('#decksWindow .content .sidebar.left')
        this.sidebar = new Sidebar(sb1,'Archetypes')


        this.overlayText = `
            Select <span class='optionBtn'>Description</span> to see the latest report on that class.
            Select <span class='optionBtn'>Deck Lists</span> to see the latest deck lists on that class.<br><br>
            Select any archetype on the left side to see all the decklists of that archetype.<br><br>
            Hover over the deck title to copy or get more information on that decklist.<br><br>
            <img src='Images/clickOnDeckTitle.png'><br><br>
            Tips:<br><br>
            • When you hover over a card of a decklist it highlights all cards with the same name in the other decklists.<br><br>
        `



        this.firebasePath = 'deckData'

        this.archButtons = []
        this.optionButtons = document.querySelectorAll('#decksWindow .optionBtn')
        for (let btn of this.optionButtons) { btn.onclick = this.buttonTrigger.bind(this) }



        // Defaults
        this.f = 'Standard'
        this.hsClass = 'Druid'
        this.hsArch = null
        this.mode = 'description' // decklists, description, dustWr
        this.deckWidth = '12rem'
        this.fullyLoaded = true
        this.overlay = false
        this.table_time = table_times[0]
        this.table_rank = table_ranks[0]

        this.mu = {}
        this.data = {}
        this.decklists = []
        this.archetypes = {}
        
        for (let f of this.hsFormats) {
            this.data[f] = { fullyLoaded: false }
            this.archetypes[f] = []
            this.mu[f] = { table: {}, archNames: {}, fr: {}, wr: {}, fullyLoaded: false }
            for (let hsClass of hsClasses) {
                this.data[f][hsClass] = {}
                this.data[f][hsClass].archetypes = []
                this.data[f][hsClass].text = ''
        }}

        this.setupUI()
        this.questionBtn.addEventListener('click',this.toggleOverlay.bind(this))
        this.overlayDiv.addEventListener('click',this.toggleOverlay.bind(this))

        if (callback != undefined) { callback() }
    }// close constructor



    setupUI() {
        this.dropdownFolders = {
            format: document.querySelector('#decksWindow .content-header #formatFolder .dropdown'),
            class: document.querySelector('#decksWindow .content-header #classFolder .dropdown'),
        }

        let mouseOut = function(event) { 
            let e = event.toElement || event.relatedTarget;
            if (e.parentNode == this || e == this) { return }
            this.classList.add('hidden') 
        }

        for (let key in this.dropdownFolders) { 
            let folder = this.dropdownFolders[key]
            folder.onmouseout = mouseOut
        }

        this.infoBtn = document.querySelector('#decksWindow .content-header #info')
        this.compareBtn = document.querySelector('#decksWindow .content-header #compare')
        this.infoBtn.active = false
        this.compareBtn.active = false

        this.selection = {}
        this.selection.div = document.querySelector('#decksWindow .selectionWrapper')
        this.selection.buttonWrapper = document.querySelector('#decksWindow .selectionWrapper .buttonWrapper')
        this.selection.buttons = []


        let fontColors = {
            Druid: '#ab8476',
            Hunter: '#689f38',
            Mage: '#4fc3f7',
            Paladin: '#ffee58',
            Priest: '#e6e6e6',
            Rogue: '#989090',
            Shaman: '#7786da',
            Warlock: '#bc4bd0',
            Warrior: '#f44336',
            Meta: 'white',
            Random: 'white',
        }


        for (let hsClass of hsClasses) {
            let btn = this.createSelectionBtn(hsClass, hsClass)
            btn.style.backgroundColor = '#454c57'
            btn.style.color = fontColors[hsClass]
            btn.style.backgroundColor = fontColors[hsClass]
            btn.onclick = this.buttonTrigger.bind(this)
            this.selection.buttonWrapper.appendChild(btn)
            this.selection.buttons.push(btn)
        }

        for (let extra of ['Meta','Random']) {
            let btn = this.createSelectionBtn(extra,extra)
            btn.className += ' special'
            btn.style.backgroundColor = 'black'
            btn.style.color = fontColors[extra]
            btn.onclick = this.buttonTrigger.bind(this)
            this.selection.buttonWrapper.appendChild(btn)
            this.selection.buttons.push(btn)
        }

    }



    createSelectionBtn(title, idName) {
        let btn = document.createElement('div')
        btn.className = 'selectionBtn'
        btn.innerHTML = title
        btn.id = idName
        return btn
    }




    



    display(bool) { // gateway to this tab
        if (bool) {
            this.div.style.display = 'inline-block'
            this.f = app.path.hsFormat
            this.plot()
        } else {
            app.path.hsFormat = this.f
            this.div.style.display = 'none'
        }
    }



    plot() { 
        if (!this.checkLoadData()) { return this.checkLoadData(_=>{ app.ui.decksWindow.plot() }) }

        this.renderWindows()
        this.renderOptions()

        switch(this.mode) {
            case 'description':
                this.plotDescriptions()
                break

            case 'decklists':
                this.plotDecklists()
                break

            case 'dustWr':
                this.plotDustWr()
                break
        }   
    }


    






    

    buttonTrigger(e) {
        
        var btnID = e.target.id

        // class button
        if (hsClasses.indexOf(btnID) != -1) { this.loadClass(btnID) }

        // archetype button
        if (e.target.classList.contains('archBtn')) { 
            this.hsArch = this.findArch(btnID)
            if (this.hsArch != null) { 
                this.sidebar.removeBtn()
                this.hsClass = this.hsArch.hsClass 
            } 
            this.mode = 'decklists'
        }


        switch (btnID) {
            case 'Standard':
                this.f = 'Standard'
                break

            case 'Wild':
                this.f = 'Wild'
                break

            case 'Meta':
                this.hsClass = 'Meta'
                this.hsArch = null
                this.loadDecks('Meta')
                break

            case 'Random':
                this.hsClass = 'Random'
                this.hsArch = null
                this.loadDecks('Random')
                break

            case 'info':
                this.info(!this.infoBtn.active)
                return 
                break

            case 'compare':
                this.compare(!this.compareBtn.active)
                return
                break

            case 'description':
                this.mode = 'description'
                break

            case 'decklists':
                this.mode = 'decklists'
                break

            case 'dustWr':
                this.mode = 'dustWr'
                break
        }

        this.plot() 
    }




    loadDecks(w) {
        if (!this.checkLoadData()) { return this.checkLoadData(_=>{ app.ui.decksWindow.loadDecks(w) }) }

        this.decklists = []
        this.compare(false)
        this.sidebar.removeBtn()

        let wrSort = function (a,b) {return a.wr > b.wr ? -1: a.wr < b.wr ? 1 : 0 }
        
        if (w == 'Random') { this.archetypes[this.f] = shuffle(this.archetypes[this.f]) }
        else { this.archetypes[this.f].sort(wrSort) }


        if (w == 'Class') {
            if (hsClasses.indexOf(this.hsClass) == -1) { this.hsClass = hsClasses[0] }

            for (let a of this.archetypes[this.f]) {
                if ( a.hsClass != this.hsClass ) { continue }
                this.sidebar.addArchBtn(a)
        }}


        if (w == 'Meta' || w == 'Random') {
            for (let a of this.archetypes[this.f].slice(0,5)) { 
                if (a.decklists.length == 0) { continue }
                this.decklists.push(choice(a.decklists))
                this.sidebar.addArchBtn(a)
        }}

    }

    compare(bool) {

        this.compareBtn.active = bool
        this.renderOptions()

        if (!bool) { // remove comparison
            for (let dl of this.decklists) { dl.declassify()}
            return
        }

        let cards = []
        let numDl = this.decklists.length

        for (let idx1 of range(0,numDl)) {
            for (let card of this.decklists[idx1].cards) {

                if (cards.indexOf(card.name) != -1 ) { continue } // card has been classified already
                cards.push(card.name)

                let allDecksHave1 = true
                let allDecksHave2 = true
                let someDecksDontHave1or2 = false
                let only1DeckHas1or2 = true

                if ( card.quantity == 1) { allDecksHave2 = false }

                for (let idx2 of range(0,numDl)) {
                    if (idx1 == idx2) { continue }
                    let numCard = this.decklists[idx2].findCard(card.name)

                    if (numCard == 0) { allDecksHave2 = false; allDecksHave1 = false }
                    if (numCard == 1) { allDecksHave2 = false; only1DeckHas1or2 = false }
                    if (numCard >= 2) { only1DeckHas1or2 = false }
                }

                if (!only1DeckHas1or2 && !allDecksHave1) { someDecksDontHave1or2 = true }

                let classification = ''
                if (allDecksHave1) { classification = 'core_x1' }
                if (allDecksHave2) { classification = 'core_x2' }
                if (someDecksDontHave1or2) { classification = 'some'}
                if (only1DeckHas1or2) { classification = 'unique'}
                
                for (let dl of this.decklists) { dl.classify(card.name, classification) }
            }
        }
    }

    info(bool) { 
        this.infoBtn.active = bool
        for (let dl of this.decklists) { dl.toggleInfo(bool) } 
        this.renderOptions()
    }

    renderWindows() {
        for (let w of this.subWindows) { w.style.display = 'none'}
        switch(this.mode) {
            case 'description':
                this.descriptionBox.style.display = 'inline-block'
                break;
            case 'decklists':
                this.decksDiv.style.display = 'inline-block'
                break;
            case 'dustWr':
                this.chartDiv.style.display = 'inline-block'
                break;
        }
    }


    renderOptions() {

        // show or hide info and compare option
        if (this.mode == 'decklists') { document.querySelector('#decksWindow .displayOptions').style.display = 'flex' }
        else {  document.querySelector('#decksWindow .displayOptions').style.display = 'none' }


        for (var btn of this.optionButtons) { 
            btn.classList.remove('highlighted')
            if (btn.id == this.mode) {btn.classList.add('highlighted')}
        }

        for (let btn of this.selection.buttons) {
            btn.classList.remove('highlighted')
            if (btn.id == this.hsClass) { btn.classList.add('highlighted') }
        }


        // highlight info and compare option
        for (let btn of [this.infoBtn, this.compareBtn]) {
            btn.classList.remove('highlighted')
            if (btn.active) { btn.classList.add('highlighted')}
        }
        
        // highlight archetype button
        if (this.mode == 'decklists') { this.sidebar.highlight(this.hsArch) }
        else { this.sidebar.highlight() }
        

        document.querySelector("#decksWindow #formatBtn").innerHTML = btnIdToText[this.f]
    }






    // Load DATA

    checkLoadData(callback) {

        let back = (callback != undefined)

        if (!app.ui.tableWindow.data[this.f].fullyLoaded) {
            let callback2 = function() { app.ui.decksWindow.checkLoadData(callback) }
            if (back) { return app.ui.tableWindow.loadData(this.f, callback2)}
            else { return false }
        }

        if (app.ui.tableWindow.data[this.f].fullyLoaded && !this.mu[this.f].fullyLoaded) { this.loadWinrate() }

        if (!this.data[this.f].fullyLoaded) {
            let callback2 = function() { app.ui.decksWindow.checkLoadData(callback) }
            if (back) { return this.loadData(this.f, callback2)}
            else { return false }
        }

        if (this.data[this.f].fullyLoaded && app.ui.tableWindow.data[this.f].fullyLoaded) {
            if (back) { return callback.apply(this) }
            else { return true }
        }
    }




    loadWinrate() {
        let tw = app.ui.tableWindow.data[this.f][this.table_time][this.table_rank]
        if (tw == null) { console.log('ERROR table undefined'); return }
        
        this.mu[this.f].table =      tw.table
        this.mu[this.f].archNames =  tw.freqPlotData.x[0]
        this.mu[this.f].fr =         tw.freqPlotData.y[0]
        this.mu[this.f].wr =         tw.winrates
        this.mu[this.f].fullyLoaded = true
    }


    loadData(hsFormat,callback) {
        this.fullyLoaded = false
        let ref = app.fb_db.ref(this.firebasePath+'/'+hsFormat)
        let reader = function (DATA) { this.readData(DATA,hsFormat,callback) }
        ref.on('value', reader.bind(this), e => console.log('Could not load Deck Data',e))
    } 


    readData(DATA,hsFormat,callback) {
        if (this.fullyLoaded) {return}
        let data = DATA.val()
        let f = hsFormat



        for (let hsClass of hsClasses) {
            this.data[f][hsClass].archetypes = [] // delete existing
            this.data[f][hsClass].text = data[hsClass].text
            if (!('archetypes' in data[hsClass])) { continue } // sometimes a class has 0 archetypes
            //let keys = Object.keys(data[hsClass].archetypes)
            for (let key in data[hsClass].archetypes) {

                let wr = 0
                let fr = 0
                let mu_idx = this.mu[f].archNames.indexOf(key)
                if (mu_idx >= 0) {wr = this.mu[f].wr[mu_idx]; fr = this.mu[f].fr[mu_idx]}

                let archetype = { name:key, hsClass:hsClass, hsFormat:f,  decklists:[], wr: wr, fr: fr, }
                this.archetypes[f].push(archetype)
                this.data[f][hsClass].archetypes.push(archetype)

                let idx = this.data[f][hsClass].archetypes.length -1

                let arch = data[hsClass].archetypes[key]
                let deckKeys = Object.keys(arch)
                for (let deckKey of deckKeys) {
                    let decklist  = new Decklist(arch[deckKey], hsClass, this)
                    this.data[f][hsClass].archetypes[idx].decklists.push(decklist)
        }}}
        this.fullyLoaded = true
        this.data[f].fullyLoaded = true
        console.log('decks loaded: '+ (performance.now()-t0).toFixed(2)+' ms')
        callback.apply(this)
    }// add Data



    
   

   

    deckLink(archName) {

        this.mode = 'decklists'
        this.f = app.path.hsFormat
        this.div.style.display = 'inline-block'

        if (!this.checkLoadData()) { return this.checkLoadData(_=>{ app.ui.decksWindow.deckLink(archName) }) }

        this.hsArch = this.findArch(archName)
        this.hsClass = (this.hsClass != undefined) ? this.hsArch.hsClass : 'Druid'

        if (this.hsArch == undefined) {
            for (let a of this.archetypes[this.f]) { 
                if (a.name == archName) { this.hsClass = c; this.hsArch = a; break } 
            }
        }
        
        if (this.hsArch == undefined) {
            this.mode = 'description'
            for (var c of hsClasses) {
                if (archName.indexOf(c) != -1) { this.hsClass = c; break }
            }
        }

        this.loadDecks('Class')
        this.display(true)
    }




    loadClass(hsClass) {

        this.hsClass = hsClass
        this.archetypes[this.f].sort(wrSort)
        for (let a of this.archetypes[this.f]) {
            if (a.hsClass == this.hsClass && a.decklists.length > 0) { this.hsArch = a; break}
        }
        this.sidebar.highlight(this.hsArch)
        this.loadDecks('Class')
    }



    plotDescriptions() {
        if (hsClasses.indexOf(this.hsClass) == -1) { this.hsClass = hsClasses[0] }
        // if hsclass == meta -> load/ link meta report
        var d = this.data[this.f][this.hsClass]
        this.description.innerHTML = '<p class="title">'+this.hsClass+'</p><p class="text">'+d.text+'</p>'
    }

    


    plotDecklists() {

        this.infoBtn.active = false
        this.compare(false)

        this.archetypes[this.f].sort(wrSort)

        // load decklists
        if (hsClasses.indexOf(this.hsClass) != -1) {

            if (this.hsArch == null) {
                for (let a of this.archetypes[this.f]) { 
                    if (a.hsClass == this.hsClass && a.decklists.length > 0) { this.hsArch = a; break}
                }
                if (this.hsArch == null) { return } // did not find archetype
            }
            this.decklists = this.hsArch.decklists
        } 

        this.decksDiv.innerHTML = ''
        for (var dl of this.decklists) { this.decksDiv.appendChild(dl.div) }
    } 


    findArch(archName) {
        for (let hsClass of hsClasses) {
            for (let a of this.archetypes[this.f]) {
                if (a.name == archName) { return a }
        }}
        return undefined
    }


    plotDecklistsMatchups(hsArch) { // load deck matchups in right sidebar
        let f = this.f
        let wr = hsArch.wr
        let top = 3
        let topArch = []
        let botArch = []
        this.sidebarRightTop.removeBtn()
        this.sidebarRightBot.removeBtn()

        if (wr > 0) { // normal
            let table = this.mu[f].table
            let archNames = this.mu[f].archNames
            let idx = archNames.indexOf(hsArch.name)
            if (idx == -1) { hsArch.wr = 0; this.plotDecklistsMatchups(hsArch); return }

            let row = table[idx].slice()
            row.sort()
            top = Math.min(top,row.length)

            for (let t of range(0,top)) {
                let mu = row[row.length-1-t]
                let idx2 = table[idx].indexOf(mu)
                topArch.push(archNames[idx2])

                mu = row[t]
                idx2 = table[idx].indexOf(mu)
                botArch.push(archNames[idx2])
            }

            // add to sidebar
            for (let archName of topArch) {
                if (archName == null) { continue }
                let arch = this.findArch(archName)
                this.sidebarRightTop.addArchBtn(arch)
            }

            for (let archName of botArch) {
                if (archName == null) { continue }
                let arch = this.findArch(archName)
                this.sidebarRightBot.addArchBtn(arch)
            }
        } else {
            // check raw data for more
        }
    }

    highlight(e) {

        if (e.type == 'mouseover') {
            let cardName = e.target.id
            let decklistName = e.target.parentElement.parentElement.id
            for (let dl of this.decklists) {
                if (dl.name == decklistName) {continue}
                dl.highlight(cardName)
            }
        } else {
            var decklistName = e.target.parentElement.parentElement.id
            for (var dl of this.decklists) { 
                if (dl.name == decklistName) {continue}
                dl.highlight() }
        }        
    }



    plotDustWr() {

        let archetypes = this.archetypes[this.f]
        if (archetypes.length == 0) { return }
        
        let traces = []
        let x = []
        let y = []
        let labels = []
        let minCost = 30*1600
        let maxCost = 0

        for (let a of archetypes) {
            if (a.wr == 0) { continue }
            for (let dl of a.decklists) {
                if (dl.dust < minCost) {minCost = dl.dust}
                if (dl.dust > maxCost) {maxCost = dl.dust}
                traces.push({
                    x: [a.wr],
                    y: [dl.dust],
                    text: `<b>${dl.name}</b><br>Winrate: ${(a.wr*100).toFixed(2)}%<br>Dust Cost: ${dl.dust}`,
                    hoverinfo: 'text',
                    name: dl.name,
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        color: hsColors[a.hsClass],
                        size: 15,
                        line: { color: '#00000059', width: 2.2},
                    }
                })
            }
        }

        let layout_line = { color: 'rgba(50,50,50,0.5)', width: 1.5, dash: 'dot', opacity: 0.5 }
        let layout = {
            showlegend: false,
            hovermode: 'closest',
            displayModeBar: false,
            autosize: true,
            margin: MOBILE ? {l:10,r:10,b:35,t:0,} : {l:60,r:30,b:50,t:0,},
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'white',
            yaxis: {
                title: 'Dust Cost',
                range: [minCost*0.9,maxCost*1.1],
                fixedrange: true,
            },
            xaxis: {
                tickformat: ',.0%',
                title: 'Winrate',
                fixedrange: true,
            },
            shapes: [{ type: 'line', y0: minCost, x0: 0.5, y1: maxCost*1.1, x1: 0.5, line: layout_line}],
            margin: {r:0,t:0},
        }

        Plotly.newPlot('chart3', traces, layout);
        let clickHandler = function (e) {
            console.log('clickHandler:',e)
            let p = e.points[0]
            let name = p.data.name
            console.log(name)
        }
        document.getElementById('chart3').on('plotly_click', clickHandler.bind(this))
    }// plot dust vs wr


    toggleOverlay() {
        if (this.overlay) {this.overlayDiv.style.display = 'none'; this.overlay = false}
        else{
            this.overlayP.innerHTML = this.overlayText
            this.overlayDiv.style.display = 'block'; 
            this.overlay = true}
    }


} // close Decks










