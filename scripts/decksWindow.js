



class DecksWindow {

    constructor (hsFormats) {

        this.hsFormats = hsFormats

        //this.sidebarLeft = document.querySelector('#decksWindow .content .sidebar.left .archetypeList')
        //this.sidebarRight1 = document.querySelector('#decksWindow .content .sidebar.right .archetypeList')
        this.chartDiv = document.querySelector('#decksWindow .content .chart')
        this.descriptionBox = document.querySelector('#decksWindow .content .descriptionBox')
        this.decksDiv = document.querySelector('#decksWindow .content .decklists')
        this.description = document.querySelector('#decksWindow .content .descriptionBox .description')
        this.overlayDiv = document.querySelector('#decksWindow .overlay')
        this.overlayP = document.querySelector('#decksWindow .overlayText')
        this.questionBtn = document.querySelector('#decksWindow .question')

        this.subWindows = [this.descriptionBox, this.decksDiv ,this.chartDiv] // depending on mode

        let sb1 = document.querySelector('#decksWindow .content .sidebar.left')
        let sb2 = document.querySelector('#decksWindow .content .sidebar.right1')
        let sb3 = document.querySelector('#decksWindow .content .sidebar.right2')

        this.sidebarLeft = new Sidebar(sb1,'Archetypes')
        this.sidebarRightTop = new Sidebar(sb2,'Best vs')
        this.sidebarRightBot = new Sidebar(sb3,'Worst vs')


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
        for (var oBtn of this.optionButtons) { oBtn.addEventListener("click", this.buttonTrigger.bind(this)) }



        // Defaults
        this.f = 'Standard'
        this.hsClass = 'Druid'
        this.hsArch = null
        this.mode = 'description' // decklists, description, overview
        this.deckWidth = '12rem'
        this.fullyLoaded = false
        this.overlay = false

        this.MU_table = {}
        this.MU_archNames = {}
        this.MU_fr = {}
        this.MU_wr = {}
        this.data = {}

        let t_longest = tableWindow.hsTimes.slice(-1)[0]
        let r_all = ladder_ranks[0]

        for (let f of this.hsFormats) {
            let tw = tableWindow.data[f][t_longest][r_all]
            this.data[f] = {}
            this.data[f]['data'] =  tw.DATA
            this.MU_archNames[f] =  tw.freqPlotData.x[0]
            this.MU_table[f] =      tw.table
            this.MU_fr[f] =         tw.freqPlotData.y[0]
            this.MU_wr[f] =         matrixXvector(this.MU_table[f],this.MU_fr[f])
        }

        this.decklists = []
        this.allArchetypes = {} // all archetypes for Standard and Wild
        
        for (var f of this.hsFormats) {
            this.allArchetypes[f] = []
            for (var hsClass of hsClasses) {
                this.data[f][hsClass] = {}
                this.data[f][hsClass].archetypes = []
                this.data[f][hsClass].text = ''
        }}

        this.renderOptions()

        this.questionBtn.addEventListener('click',this.toggleOverlay.bind(this))
        this.overlayDiv.addEventListener('click',this.toggleOverlay.bind(this))

    }// close constructor


    

    buttonTrigger(e) {
        
        var btnID = e.target.id

        if (e.target.classList.contains('archBtn')) { this.deckLink(btnID, this.f) }

        if (hsClasses.indexOf(btnID) != -1) {
            this.hsArch = null
            this.loadClass(btnID)
        }        

        if (btnID == 'overview')    {this.plotDustWr()}

        if (btnID == 'decklists')   {this.loadDecklists()}
        if (btnID == 'description') {this.loadDescription()}

        if (btnID == 'Standard')    {this.loadFormat('Standard')}
        if (btnID == 'Wild')        {this.loadFormat('Wild')}
        
        this.renderWindows()
        this.renderOptions()   
    }


    renderWindows() {
        for (let w of this.subWindows) { w.style.display = 'none'}
        switch(this.mode) {
            case 'description':
                this.descriptionBox.style.display = 'inline'
                break;
            case 'decklists':
                this.decksDiv.style.display = 'grid'
                break;
            case 'overview':
                this.chartDiv.style.display = 'inline-block'
                break;
        }
    }

    renderOptions() {
         for (var btn of this.optionButtons) { 
            btn.classList.remove('highlighted')
            if (btn.id == this.mode) {btn.classList.add('highlighted')}
        }
        
        for (var btn of this.archButtons) { 
            btn.classList.remove('highlighted')
            if (this.hsArch != null) { if (btn.id == this.hsArch.name) {btn.classList.add('highlighted')} }
        }

        document.querySelector("#decksWindow #formatBtn").innerHTML =   btnIdToText[this.f]
        document.querySelector("#decksWindow #classBtn").innerHTML =    this.hsClass
    }






    // Load DATA

    loadData() {
        var ref = DATABASE.ref(this.firebasePath)
        ref.on('value', this.readData.bind(this), e => console.log('Could not load Deck Data',e))
    } 


    readData(DATA) {
        if (this.fullyLoaded) {return}
        var DATA = DATA.val()
        
        for (var f of this.hsFormats) {
            for (var hsClass of hsClasses) {
                this.data[f][hsClass].text = DATA[f][hsClass].text

                var keys = Object.keys(DATA[f][hsClass].archetypes)
                for (var key of keys) {

                    let wr = 0
                    let fr = 0
                    let mu_idx = this.MU_archNames[f].indexOf(key)
                    if (mu_idx >= 0) {wr = this.MU_wr[f][mu_idx]; fr = this.MU_fr[f][mu_idx]}

                    let archetype = { name:key, hsClass:hsClass, hsFormat:f,  decklists:[], wr: wr, fr: fr, }
                    this.allArchetypes[f].push(archetype)
                    this.data[f][hsClass].archetypes.push(archetype)


                    let idx = this.data[f][hsClass].archetypes.length -1

                    let arch = DATA[f][hsClass].archetypes[key]
                    let deckKeys = Object.keys(arch)
                    for (let deckKey of deckKeys) {
                        let decklist  = new Decklist(arch[deckKey], hsClass, this)
                        this.data[f][hsClass].archetypes[idx].decklists.push(decklist)
        }}}}
        this.fullyLoaded = true
        console.log('decks loaded: '+ (performance.now()-t0).toFixed(2)+' ms')
        this.plot()
    }// add Data





    deckLink(archName, hsFormat = 'Standard') {

        if (!this.fullyLoaded) { this.loadData() }

        var hsClass
        var hsArch
        this.mode = 'decklists'
        this.f = hsFormat

        for (var c of hsClasses) {

            if (archName.indexOf(c) != -1) {hsClass = c}

            var archetypes = this.data[hsFormat][c].archetypes
            for (var a of archetypes) { if (a.name == archName) { hsClass = c; hsArch = a; break } } 
        }
        
        if (hsClass == undefined) { hsClass = 'Druid'}
        if (hsArch == undefined)  { hsArch = null; this.mode = 'description' }
        
        this.hsClass = hsClass
        this.hsArch = hsArch
        

        this.plot()
        this.renderOptions()
    }




    
    // LOAD FUNCTIONS

    // plot -> load format -> load Class -> load description/ decks



    plot() { 
        if (!this.fullyLoaded) {return}
        if (this.mode == 'overview') {}
        this.loadFormat(this.f) 
    }


    loadFormat(hsFormat) { this.f = hsFormat; this.loadClass(this.hsClass) }

    loadClass(hsClass) {

        this.hsClass = hsClass

        if (this.mode == 'description') {this.loadDescription()}
        if (this.mode == 'decklists') {this.loadDecklists()}

        this.sidebarLeft.loadClass(this.data[this.f][this.hsClass])
        //this.sidebarRightTop.loadClass(this.data[this.f][this.hsClass])
        //this.sidebarRightBot.loadClass(this.data[this.f][this.hsClass])
        // for (var arch of archetypes) { 
        //     let archBtn = this.addArchetypeBtn(arch)
        //     this.sidebarLeft.append(archBtn)
        // }
        
        var archetypes = this.data[this.f][this.hsClass].archetypes
        if (archetypes.length > 0 && this.hsArch == null) {this.hsArch = archetypes[0]}
    }



    loadDescription() {

        this.mode = 'description'
        this.renderWindows()

        var d = this.data[this.f][this.hsClass]
        this.addDescription(this.hsClass,d.text)
    }

    addDescription(title,text) {
        this.description.innerHTML = '<p class="title">'+title+'</p><p class="text">'+text+'</p>'
    }



    loadDecklists() {
        this.mode = 'decklists'
        this.renderWindows()
        this.decklists = []

        this.decksDiv.innerHTML = ''

        if (this.hsArch == null) {this.hsArch = this.data[this.f][this.hsClass].archetypes[0]}
        if (this.hsArch == undefined) {this.hsArch = null; return}
        
        var deckCards = []
        var gridTemplateColumns = ''
        for (var dl of this.hsArch.decklists) {
            
            gridTemplateColumns += this.deckWidth + ' '
            this.decklists.push(dl)
            this.decksDiv.appendChild(dl.div)
        }
        
        this.decksDiv.style.gridTemplateColumns = gridTemplateColumns
        this.loadDecklistsMatchups(this.hsArch) // load deck list matchups
    } 

    findArch(archName) {
        for (let hsClass of hsClasses) {
            for (let a of this.data[this.f][hsClass].archetypes) {
                if (a.name == archName) { return a }
        }}
    }

    loadDecklistsMatchups(hsArch) { // load deck matchups in right sidebar
        let wr = hsArch.wr
        let top = 3
        var topArch = []
        var botArch = []

        if (wr > 0) { // normal
            let matrix = this.MU_table[this.f]
            let archNames = this.MU_archNames[this.f]
            let idx = archNames.indexOf(hsArch.name)
            if (idx == -1) { hsArch.wr = 0; this.loadDecklistsMatchups(hsArch) }

            // best matchups
            for (let t=0; t<top; t++) {
                let mu_min = 0.48 // maxval
                let mu_max = 0.52 // minval
                topArch.push(null)
                botArch.push(null)

                for (let i=0; i<archNames.length; i++) {
                    console.log('mu:',matrix[idx][i])
                    if (matrix[idx][i] > mu_max ) { //&& topArch.indexOf(archNames[i]) != -1) {
                        if (topArch.indexOf(archNames[i]) == -1) { break } // ?????
                        console.log('-- Succes!',topArch)
                        topArch[t] = archNames[i]
                        console.log(topArch)
                        mu_max = matrix[idx][i] 
                    }

                    if (matrix[idx][i] < mu_min && botArch.indexOf(archNames[i]) != -1) {
                        console.log('Success 2')
                        botArch[t] = archNames[i]
                        mu_min = matrix[idx][i]
                    }
            }}


            this.sidebarRightTop.removeBtn()
            this.sidebarRightBot.removeBtn()
            console.log('matchups:',topArch,botArch)

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
        } 
        // if wr > 0
        // else {

        //     let matrix =        this.data[this.f].DATA.table
        //     let archetypes =    this.data[this.f].DATA.archetypes
        //     let idx = null
            

        //     for (let i=0;i<archetypes.length;i++) {
        //         if (archetypes[i][1]+' '+archetypes[i][0] == hsArch) {
        //             idx = i
        //             break  
        //     }}
        //     if (idx == null) { return }

        //     let sortArr = []

        //     let wr = 0
        //     for (let i=0; i<archetypes.length; i++) {
        //         let m1 = matrix[idx][i][0]
        //         let m2 = matrix[idx][i][1]
        //         let m3 = matrix[i][idx][0]
        //         let m4 = matrix[i][idx][1]

        //         if (m1 == 0 && m2 == 0) { m2 = 1 }
        //         if (m3 == 0 && m4 == 0) { m4 = 1 }

        //         wr = (m1/(m1+m2) + m3/(m3+m4))/2
        //         if (m1+m2+m3+m4 < 20) { wr = 0 }
        //         if (i == idx) { wr = 0.5 }

        //         sortArr.push({arch: archetypes[i], wr: wr})
        //     }

        //     var sortByWr = function (a,b) {return a.wr > b.wr ? -1: a.wr < b.wr ? 1 : 0 ;}
        //     sortArr.sort(sortByWr)

        //     for (let i=0;i<top;i++) {
        //         if (sortArr[i].wr < 0.52) { continue }
        //         let btn = this.addArchetypeBtn(sortArr[i].arch)
        //         let archetype = { name:key, hsClass:hsClass, hsFormat:f,  decklists:[], wr: wr, fr: fr, }
        //     }

        //     for (let i=sortArr.length-1; i > sortArr.length - bottom ;i--) {
        //         let a = sortArr[i]
        //         if (a.wr > 0.48) { continue }

        //         let archName = a.arch[1]+' '+a.arch[0]
        //         if (allArchetypes.indexOf(archName) == -1) {
        //             let archetype = { name: archName, hsClass: a.arch[0], hsFormat: this.f,  decklists:[], wr: a.wr, fr: 0}
        //             let btn = this.addArchetypeBtn(a.arch)
        //         }
        //         else { btn = allArchetypes[archName]}


        //         this.sidebar.appendChild(btn)
        //     }
        // }// else wr ==0 
    }

    highlight(e) {

        var eType = e.type
        if (eType == 'mouseover') {
            var cardName = e.target.id
            var decklistName = e.target.parentElement.parentElement.id
            for (var dl of this.decklists) {
                if (dl.name == decklistName) {continue}
                dl.highlight(cardName)
            }
        } else {
            var decklistName = e.target.parentElement.parentElement.id
            for (var dl of this.decklists) { 
                if (dl.name == decklistName) {continue}
                dl.highlight(cardName) }
        }        
    }



    plotDustWr() {

        this.mode = 'overview'
        this.renderWindows()
          

        let archetypes = this.allArchetypes[this.f]

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
                    x: [dl.dust],
                    y: [a.wr],
                    text: `<b>${dl.name}</b><br>Winrate: ${(a.wr*100).toFixed(2)}%<br>Dust Cost: ${dl.dust}`,
                    hoverinfo: 'text',
                    name: dl.name,
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                        color: hsColors[a.hsClass],
                        size: 15,
                        line: { color: '#3e3e3e80', width: 1},
                    }
                })
            }
        }
        console.log('traces:',traces)

        let layout = {
            autosize: true,
            showlegend: false,
            hovermode: 'closest',
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
            displayModeBar: false,
            xaxis: {
                title: 'Dust Cost',
                range: [minCost*0.9,maxCost*1.1],
            },
            yaxis: {
                tickformat: ',.0%',
                title: 'Winrate',
            },
            shapes: [{

                type: 'line',
                x0: minCost,
                y0: 0.5,
                x1: maxCost,
                y1: 0.5,
                line: {
                    color: 'rgba(50,50,50,0.5)',
                    width: 1.5,
                    dash: 'dot',
                    opacity: 0.5,
                }
            }],
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




    loadOverviewSidebar() {

    }


    // addArchetypeBtn(arch) {
        
    //     let archBtnDiv = document.createElement('div')
    //     archBtnDiv.className = 'archBtnDiv'

    //     let archBtn = document.createElement('div')
    //     archBtn.style.backgroundColor = hsColors[arch.hsClass]
    //     archBtn.style.color = hsFontColors[arch.hsClass]
    //     archBtn.innerHTML = arch.name
    //     archBtn.id = arch.name
    //     archBtn.className = 'archBtn'
    //     archBtn.addEventListener("click", this.buttonTrigger.bind(this))

    //     let wrDiv = document.createElement('div')
    //     let wr = 'Tier '+tier_classifier(arch.wr) //arch.wr ? (arch.wr*100).toFixed(1)+'%' : '?'
    //     wrDiv.className = 'wrDiv'
    //     wrDiv.innerHTML = wr

    //     archBtnDiv.appendChild(archBtn)
    //     archBtnDiv.appendChild(wrDiv)
        
    //     this.archButtons.push(archBtnDiv)
    //     return archBtnDiv
    // }

    toggleOverlay() {
        if (this.overlay) {this.overlayDiv.style.display = 'none'; this.overlay = false}
        else{
            this.overlayP.innerHTML = this.overlayText
            this.overlayDiv.style.display = 'block'; 
            this.overlay = true}
    }


} // close Decks










