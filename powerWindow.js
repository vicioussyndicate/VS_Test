


class PowerWindow {

    constructor () {


        this.grid = document.querySelector('#powerGrid')

        this.f = 'Standard'
        this.mode = 'tiers'
        this.t_ladder = 'lastDay'
        this.t_table = 'lastWeek'
        this.top = 5
        

        this.data = {Standard:[], Wild:[]} // [rank0=[{name: druid, wr: x, fr: x}]]
        for (var rank=0; rank<hsRanks;rank++) {this.data['Standard'].push([])}
        for (var rank=0; rank<hsRanks;rank++) {this.data['Wild'].push([])}

        this.tierData = {}
        this.tiers = [
            {name:'All Ranks',
            start:0,
            end: 15},
            {name:'L',
            start: 0,
            end: 0},
            {name:'1-5',
            start: 1,
            end: 5},
            {name:'6-15',
            start: 6,
            end: 15},
        ]
        this.maxTierElements = 20
        for (var f of ['Standard','Wild']) {
            this.tierData[f] = {}
            for (var tier of this.tiers) {
                this.tierData[f][tier.name] = []
            }
        }

        this.addData('Standard')
        this.addData('Wild')
        //this.setupUI()
        this.plotTiers('Standard')
        
    }// close constructor




    setupUI() {

        this.optionButtons = document.querySelectorAll('#powerWindow .optionBtn')
        for (let i=0;i<this.optionButtons.length;i++) { this.optionButtons[i].addEventListener("click", this.buttonTrigger.bind(this)) }

    } // setup UI



    buttonTrigger(e) {

        var btnID = e.target.id

        if (btnID == 'Standard')    {this.f = 'Standard'}
        if (btnID == 'Wild')        {this.f = 'Wild'}

        if (btnID == 'top')         {this.mode = 'top'}
        if (btnID == 'tiers')       {this.mode = 'tiers'}
        
        this.plot()
    }// button Handler





    addData (f) {

        var ladder = DATA_L[f][this.t_ladder].archetypes
        var table = DATA_T[f][this.t_table]['ranks_all']
        

        for (var arch of ladder) {

            var idx = table.archetypes.indexOf(arch.name)
            if (idx == -1) {continue}

            for (var rank=0; rank<hsRanks;rank++) {

                var totFreq = 0
                var totWr = 0

                for (var opp of ladder) {

                    var idxOpp = table.archetypes.indexOf(opp.name)
                    if (idxOpp == -1) {continue}

                    var freqOpp = opp.data[rank]
                    var mu = table.table[idx][idxOpp]
                    totFreq += freqOpp
                    totWr += freqOpp * mu                
                }

                if (totFreq != 0) {totWr /= totFreq}
                else {totWr = 0}

                this.data[f][rank].push({name:arch.name, wr:totWr, fr:arch.data[rank], color: arch.color})

                for (var tier of this.tiers) {
                    var data = this.tierData[f][tier.name]
                    if (rank == tier.start) {data.push({name:arch.name, wr:totWr, fr:arch.data[rank], color: arch.color})}
                    if (rank > tier.start && rank <= tier.end) { data[data.length-1].wr += totWr }
                    if (rank == tier.end) { data[data.length-1].wr /= (tier.end - tier.start +1) }
                }


            } // close for ranks
        } // close for arch


        var sortByWr = function (a,b) { return a.wr > b.wr ? -1 : a.wr < b.wr ? 1 : 0; }
        for (var rank=0;rank<hsRanks;rank++) { this.data[f][rank].sort(sortByWr) }
        for (var tier of this.tiers) { this.tierData[f][tier.name].sort(sortByWr) }
    } // close add Data






    plot() {

        var f = ui.power.f
        var mode = ui.power.dispMode

        if (mode == 'top') {this.plotTop(f)}
        if (mode == 'tiers') {this.plotTiers(f)}
    }

    plotTop (f) {

        while (this.grid.firstChild) {this.grid.removeChild(this.grid.firstChild);}
        
        var ranks = range(0,hsRanks)
        ranks[0] = 'L'
    
        var columnTemplate = '1fr '
        for (var i=0;i<this.top;i++) {columnTemplate += '4fr 1fr '}

        this.grid.style.gridTemplateColumns = columnTemplate
        this.grid.style.gridTemplateRows = 'auto'
        this.grid.style.gridGap = '0.1rem'


        var div = document.createElement('div')
        div.className = 'header'
        div.innerHTML = 'Rank'
        this.grid.appendChild(div)



        //Header
        for (var i=0;i<this.top;i++) { 
            var div = document.createElement('div')
            div.className = 'header columnTitle'
            div.innerHTML = 'Top '+(i+1)
            this.grid.appendChild(div)
        }


        for (var i=0;i<hsRanks;i++) {
            var div = document.createElement('div')
            div.className = 'pivot'
            div.innerHTML = ranks[i]
            this.grid.appendChild(div)


            for (var j=0;j<this.top;j++) {
                var archName = this.data[f][i][j].name
                var wr = (100*this.data[f][i][j].wr).toFixed(1)+ '%'
                var color = this.data[f][i][j].color

                var div = document.createElement('div')
                var btn = document.createElement('button')

                btn.className = 'archBtn'
                btn.id = archName
                btn.style.backgroundColor = color
                btn.innerHTML = archName
                btn.onclick = this.pressButton.bind(this)

                div.classList.add('winrate')
                div.innerHTML = wr

                this.grid.appendChild(btn)
                this.grid.appendChild(div)
            }
        }
        //this.grid.innerHTML = gridHTML
    }// close plotTop






    plotTiers (f) {
    
        while (this.grid.firstChild) {this.grid.removeChild(this.grid.firstChild);}
        
        var ranks = range(0,hsRanks)
        ranks[0] = 'L'
    
        var columnTemplate = ''
        for (var i=0;i<this.tiers.length;i++) {columnTemplate += '4fr 1fr '}

        this.grid.style.gridTemplateColumns = columnTemplate
        this.grid.style.gridTemplateRows = 'auto'
        this.grid.style.gridGap = '0.3rem'

        //Header
        for (var tier of this.tiers) { 
            var div = document.createElement('div')
            div.className = 'header columnTitle'
            div.innerHTML = tier.name
            this.grid.appendChild(div)
        }


        for (var i=0;i<this.maxTierElements;i++) {

            for (var tier of this.tiers) {
                
                var arch = this.tierData[f][tier.name][i]
                if (arch == undefined) {
                    this.grid.appendChild(document.createElement('div'))
                    this.grid.appendChild(document.createElement('div'))
                    continue
                }

                var wr = (100*arch.wr).toFixed(1)+ '%'
                var color = arch.color

                var div = document.createElement('div')
                var btn = document.createElement('button')

                btn.className = 'archBtn'
                btn.id = arch.name
                btn.style.backgroundColor = color
                btn.style.marginLeft = '0.5rem'
                btn.innerHTML = arch.name
                btn.onclick = this.pressButton.bind(this)

                div.className = 'winrate'
                div.innerHTML = wr

                this.grid.appendChild(btn)
                this.grid.appendChild(div)
            }
        }
        //this.grid.innerHTML = gridHTML
    } // close plot Tiers



    pressButton(e) {
        console.log('pressed button',e)
        toggleMainTabs({target:document.querySelector('#decks.tab')})
    }

} // close PowerRanking class
