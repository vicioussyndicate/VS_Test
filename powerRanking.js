


class PowerWindow {

    constructor () {

        this.t_ladder = 'lastDay'
        this.t_table = 'lastWeek'
        this.top = 5
        this.grid = document.querySelector('#powerGrid')

        this.data = [] // [rank0=[{name: druid, wr: x, fr: x}]]
        for (var rank=0; rank<hsRanks;rank++) {this.data.push([])}

        var ladder_std = DATA_L['Standard'][this.t_ladder].archetypes
        var ladder_wild = DATA_L['Wild'][this.t_table].archetypes
        var table_std = DATA_T['Standard'][this.t_table]['ranks_all']
        var table_wild = DATA_T['Wild'][this.t_table]['ranks_all']




        for (var arch of ladder_std) {

            var idx = table_std.archetypes.indexOf(arch.name)
            if (idx == -1) {continue}

            for (var rank=0; rank<hsRanks;rank++) {

                var totFreq = 0
                var totWr = 0

                for (var opp of ladder_std) {

                    var idxOpp = table_std.archetypes.indexOf(opp.name)
                    if (idxOpp == -1) {continue}

                    var freqOpp = opp.data[rank]
                    var mu = table_std.table[idx][idxOpp]

                    totFreq += freqOpp
                    totWr += freqOpp * mu                
                }

                if (totFreq != 0) {totWr /= totFreq}
                else {totWr = 0}

                this.data[rank].push({name:arch.name, wr:totWr, fr:arch.data[rank], color: arch.color})
            } // close for ranks
        } // close for arch


        var sortByWr = function (a,b) { return a.wr > b.wr ? -1 : a.wr < b.wr ? 1 : 0; }
        for (var rank=0;rank<hsRanks;rank++) { this.data[rank].sort(sortByWr) }







        var ranks = range(0,hsRanks)
        ranks[0] = 'L'
    
        var columnTemplate = '1fr '
        for (var i=0;i<this.top;i++) {columnTemplate += '4fr 1fr '}

        this.grid.style.gridTemplateColumns = columnTemplate
        this.grid.style.gridTemplateRows = 'auto'


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
                var archName = this.data[i][j].name
                var wr = (100*this.data[i][j].wr).toFixed(1)+ '%'
                var color = this.data[i][j].color

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

    }// close Constructor

    pressButton(e) {
        console.log('pressed button',e)
    }


    plotTop() {

    }

    plotTiers() {

    }


} // close PowerRanking class



function clickbutton (e) {
    toggleMainTabs({target:document.querySelector('#decks.tab')})
}
