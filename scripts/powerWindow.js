


class PowerWindow {

    constructor () {

        this.div = document.querySelector('#powerWindow')
        this.tab = document.querySelector('#power.tab')
        this.grid = document.querySelector('#powerGrid')
        this.optionButtons = document.querySelectorAll('#powerWindow .optionBtn')
        this.questionBtn = document.querySelector('#powerWindow .question')
        this.overlayDiv = document.querySelector('#powerWindow .overlay')
        this.overlayP = document.querySelector('#powerWindow .overlayText')
        

        this.f = 'Standard'
        this.mode = 'brackets'
        this.t_ladder = {Standard: 'lastDay', Wild: 'last2Weeks'}
        if (PREMIUM) {this.t_ladder.Wild = 'lastWeek'}
        this.t_table = 'last2Weeks'
        this.maxElementsPerRank = 5
        this.maxElementsPerBracket = (PREMIUM) ? 16 : 5
        this.minGames = 50
        
        this.overlayText = `
            This tab displays the best decks to be played in the respective rank brackets.<br><br>
            <span class='optionBtn'>Tier Lists</span> shows the top 16 decks across specific rank brackets ('All Ranks', 'Rank 1-5' etc.).<br><br>
            <span class='optionBtn'>Suggestions</span> shows the top 5 decks for every single rank until rank 20.<br><br>
            The winrates are calculated by using the deck frequencies of the last 24 hours and the matchup table of the last week.<br><br>
            If there are fewer than ${this.minGames} games in the respective category no data is displayed instead.<br><br>
            Click on a deck to get to it's deck list in the "Decks" tab.<br><br>        
        `

        this.rankData = {rankSums: {}, fullyLoaded: {}} // {Standard:[], Wild:[], rankSums: {Standard:[], Wild:[]}}
        for (let f of hsFormats) {
            this.rankData[f] = []
            for (let rank of range(0,hsRanks)) { this.rankData[f].push([]) }
            this.rankData.rankSums[f] = []
            this.rankData.fullyLoaded[f] = false
        }

        this.bracketData = {}
        this.rankBrackets = [
            {name:'All Ranks',  games:{}, start: 0, end: 15},
            {name:'L',          games:{}, start: 0, end: 0},
            {name:'1-4',        games:{}, start: 1, end: 4},
            {name:'5-14',       games:{}, start: 5, end: 14},
        ]

        
        for (let f of hsFormats) {
            this.bracketData[f] = {}
            for (let bracket of this.rankBrackets) { 
                bracket.games[f] = 0
                this.bracketData[f][bracket.name] = [] 
        }}

        this.overlay = false
        this.addData('Standard',_=>{})
        this.setupUI()
        this.renderOptions()
    }// constructor


    setupUI() {
        for (let i=0;i<this.optionButtons.length;i++) { this.optionButtons[i].addEventListener("click", this.buttonTrigger.bind(this)) }
        let disp = (PREMIUM) ? 'inline':'none'
        document.querySelector('#powerWindow .content-header #brackets').style.display = disp
        this.questionBtn.addEventListener('click',this.toggleOverlay.bind(this))
        this.overlayDiv.addEventListener('click',this.toggleOverlay.bind(this))
    }

    buttonTrigger(e) {

        var btnID = e.target.id

        if (btnID == 'Standard')    {this.f = 'Standard'}
        if (btnID == 'Wild')        {this.f = 'Wild'}

        if (btnID == 'ranks')       {this.mode = 'ranks'}
        if (btnID == 'brackets')    {this.mode = 'brackets'}
        
        this.plot()
        this.renderOptions()
    }// buttonTrigger

    pressButton(e) {
        app.ui.powerWindow.display(false)
        app.ui.decksWindow.deckLink(e.target.id) 
    }


    renderOptions() {
        for (var btn of this.optionButtons) { 
            btn.classList.remove('highlighted')

            if (btn.id == this.mode) {btn.classList.add('highlighted')}
            if (btn.id == this.f) {btn.classList.add('highlighted')}
        }
    }




    addData (f,callback) {
        let ladderData = app.ui.ladderWindow.data[f][this.t_ladder[f]]
        let tableData = app.ui.tableWindow.data[f][this.t_table]['ranks_all']

        let ladderArchetypes = ladderData.archetypes
        let tableArchetypes = tableData.archetypes
        let table = tableData.table
        let rankSums = app.ui.ladderWindow.data[f][this.t_ladder[f]].rankSums
        
        this.rankData.rankSums[f] = app.ui.ladderWindow.data[f][this.t_ladder[f]].rankSums
        for (let rank of range(0,hsRanks)) {
            for (let bracket of this.rankBrackets) {
                if (bracket.start <= rank && bracket.end >= rank) { bracket.games[f] += this.rankData.rankSums[f][rank] }
        }}

        for (let arch of ladderArchetypes) {

            let idx = tableArchetypes.indexOf(arch.name)
            if (idx == -1) { continue }

            for (let rank of range(0,hsRanks)) {

                let totFreq = 0
                let totWr = 0

                for (let opp of ladderArchetypes) {

                    let idxOpp = tableArchetypes.indexOf(opp.name)
                    if (idxOpp == -1) { continue }

                    let freqOpp = opp.fr_ranks[rank]
                    let mu = table[idx][idxOpp]
                    totFreq += freqOpp
                    totWr += freqOpp * mu                
                }

                totWr = (totFreq > 0) ? totWr/totFreq : 0

                this.rankData[f][rank].push({name:arch.name, wr:totWr, fr: arch.fr_ranks[rank], color: arch.color, fontColor: arch.fontColor})
                for (var bracket of this.rankBrackets) {
                    let data = this.bracketData[f][bracket.name]
                    if (rank == bracket.start) {data.push({name:arch.name, wr: totWr, fr: arch.fr_ranks[rank], color: arch.color, fontColor: arch.fontColor, count:(totWr>0)?1:0})}
                    if (rank > bracket.start && rank <= bracket.end) { data[data.length-1].wr += totWr; data[data.length-1].count += (totWr>0)?1:0 }
                    if (rank == bracket.end && data[data.length-1].count > 0) { data[data.length-1].wr /= data[data.length-1].count }
                }

            } // close for ranks
        } // close for arch


        let sortByWr = function (a,b) { return a.wr > b.wr ? -1 : a.wr < b.wr ? 1 : 0; }
        for (let rank of range(0,hsRanks)) { this.rankData[f][rank].sort(sortByWr) }
        for (let bracket of this.rankBrackets) { this.bracketData[f][bracket.name].sort(sortByWr) }
        this.rankData.fullyLoaded[f] = true
        if (callback != undefined) { return callback.apply(this) }
    } // close add Data



    checkLoadData(callback) {

        let back = (callback != undefined)
        console.log('checkLoadData',back,callback)

        if (this.rankData.fullyLoaded[this.f]) {
            // all loaded
            return (back) ?  callback.apply(this) : true
        }

        if (!app.ui.ladderWindow.data[this.f].fullyLoaded) {
            console.log('load ladder data from power window')
            let callback2 = function() { app.ui.powerWindow.checkLoadData(callback) }
            if (back) { return app.ui.ladderWindow.loadData(this.f, callback2) }
            else { return false }
        }

        if (!app.ui.tableWindow.data[this.f].fullyLoaded) {
            console.log('load table data from power window')
            let callback2 = function() { app.ui.powerWindow.checkLoadData(callback) }
            if (back) { return app.ui.tableWindow.loadData(this.f, callback2) }
            else { return false }       
        }

        if (app.ui.ladderWindow.data[this.f].fullyLoaded && app.ui.tableWindow.data[this.f].fullyLoaded) {
            console.log('all checks ok')
            this.addData(this.f, callback)   
        }
    }



    plot() {
        if (!this.checkLoadData()) { 
            this.renderOptions()
            return this.checkLoadData( _ => { app.ui.powerWindow.plot() }) 
        }
        this.renderOptions()
        if (this.mode == 'ranks') {this.plotRanks(this.f)}
        if (this.mode == 'brackets') {this.plotBrackets(this.f)}
    }

    display(bool) {
        if (bool) {
            this.div.style.display = 'inline-block'
            this.f = app.path.hsFormat
            this.plot()

        } else {
            this.div.style.display = 'none'
            app.path.hsFormat = this.f
        }
    }

    plotRanks (f) {

        while (this.grid.firstChild) {this.grid.removeChild(this.grid.firstChild);}
        
        let ranks = range(0,hsRanks)
        ranks[0] = 'L'
    
        let columnTemplate = '1fr '
        for (let i of range(0,this.maxElementsPerRank)) {columnTemplate += '4fr 1fr '}

        this.grid.style.gridTemplateColumns = columnTemplate
        this.grid.style.gridGap = '0.1rem'


        var div = document.createElement('div')
        div.className = 'header'
        div.innerHTML = 'Rank'
        this.grid.appendChild(div)



        //Header
        for (var i=0;i<this.maxElementsPerRank;i++) { 
            var div = document.createElement('div')
            div.className = 'header columnTitle'
            div.innerHTML = 'Top '+(i+1)
            this.grid.appendChild(div)
        }

debugger;
        for (var i=0;i<hsRanks;i++) {

            var div = document.createElement('div')
            div.className = 'pivot'
            div.innerHTML = ranks[i]
            this.grid.appendChild(div)

            if (this.rankData.rankSums[f][i] < this.minGames) { 
                for (var j=0;j<this.maxElementsPerRank;j++) { 
                    var div = document.createElement('div')
                    div.className = 'blank'
                    this.grid.appendChild(div)
                    this.grid.appendChild(document.createElement('div')) 
                }
                continue
            }

            for (var j=0;j<this.maxElementsPerRank;j++) {
                var archName = this.rankData[f][i][j].name
                var wr = (100*this.rankData[f][i][j].wr).toFixed(1)+ '%'
                var color = this.rankData[f][i][j].color
                var fontColor = this.rankData[f][i][j].fontColor

                var div = document.createElement('div')
                var btn = document.createElement('button')
                var tooltip = document.createElement('span')
                
                tooltip.className = 'tooltipText'
                tooltip.innerHTML = 'R:'+(i)+' #'+(j+1)+' '+archName
                
                btn.className = 'archBtn tooltip'
                btn.id = archName
                btn.style.backgroundColor = color
                btn.style.color = fontColor
                btn.innerHTML = archName
                //btn.appendChild(tooltip)
                btn.onclick = this.pressButton.bind(this)

                div.classList.add('winrate')
                div.innerHTML = wr

                this.grid.appendChild(btn)
                this.grid.appendChild(div)
            }
        }
        //this.grid.innerHTML = gridHTML
    }// close plotRanks






    plotBrackets (f) {
    
        while (this.grid.firstChild) {this.grid.removeChild(this.grid.firstChild);}
        
        let ranks = range(0,hsRanks)
        ranks[0] = 'L'
    
        let columnTemplate = ''
        for (let b of this.rankBrackets) { columnTemplate += '4fr 1fr ' }

        this.grid.style.gridTemplateColumns = columnTemplate
        this.grid.style.gridGap = '0.3rem'

        //Header
        for (let bracket of this.rankBrackets) { 
            var div = document.createElement('div')
            div.className = 'header columnTitle'
            div.innerHTML = bracket.name
            this.grid.appendChild(div)
        }


        for (let i = 0; i < this.maxElementsPerBracket; i++ ) {

            for (let bracket of this.rankBrackets) {

                if (this.bracketData[f][bracket.name].length <= i) {continue}

                let arch = this.bracketData[f][bracket.name][i]

                // if (bracket.games[f] <= this.minGames || arch == undefined) { 
                //     let div = document.createElement('div')
                //     div.className = 'blank'
                //     this.grid.appendChild(div)
                //     this.grid.appendChild(document.createElement('div'))
                //     continue
                // }
                
                if (bracket.games[f] <= this.minGames || arch == undefined) { 
                    if(bracket.games[f] <= this.minGames)
                    {
                        if(bracket.name == "L")
                        {
                            bracket.games = this.rankBrackets[2].games;
                            if(bracket.games[f] <= this.minGames )
                            {
                                bracket.games = this.rankBrackets[3].games;
                            }
                        }
                        if(bracket.name == "1-4")
                        {
                            bracket.games = this.rankBrackets[3].games;                            
                        }
                    }
                    if (bracket.games[f] <= this.minGames || arch == undefined) { 
                        let div = document.createElement('div')
                        div.className = 'blank'
                        this.grid.appendChild(div)
                        this.grid.appendChild(document.createElement('div'))
                        continue
                        }
                }

                

                let wr = (100*arch.wr).toFixed(1)+ '%'

                let div = document.createElement('div')
                let btn = document.createElement('button')
                let tooltip = document.createElement('span')

                


                tooltip.className = 'tooltipText'
                tooltip.innerHTML = '#'+(i+1)+' '+arch.name

                btn.className = 'archBtn tooltip'
                btn.id = arch.name
                btn.style.backgroundColor = arch.color
                btn.style.color = arch.fontColor
                btn.style.marginLeft = '0.5rem'
                btn.innerHTML = arch.name
                //btn.appendChild(tooltip)
                btn.onclick = this.pressButton.bind(this)

                div.className = 'winrate'
                div.innerHTML = wr

                this.grid.appendChild(btn)
                this.grid.appendChild(div)
            }
        }
    } // close plot Tiers


    toggleOverlay() {
        if (this.overlay) {this.overlayDiv.style.display = 'none'; this.overlay = false}
        else{
            this.overlayP.innerHTML = this.overlayText
            this.overlayDiv.style.display = 'block'; 
            this.overlay = true}
    }
    

} // close PowerRanking class

