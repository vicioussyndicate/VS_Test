


class TableWindow {


    constructor(hsFormats, hsTimes, table_ranks, sortOptions) {


        this.firebasePath = (PREMIUM) ? 'premiumData/tableData' : 'data/tableData'
        this.window = document.querySelector('#ladderWindow')
        this.optionButtons = document.querySelectorAll('#tableWindow .optionBtn')
        this.data = {}
        this.hsFormats = hsFormats
        this.hsTimes = hsTimes
        this.ranks = table_ranks
        this.sortOptions = sortOptions //['frequency','winrate','matchup','class']


        // Defaults

        this.width = document.querySelector('.main-wrapper').offsetWidth -40
        this.height = parseInt(this.width*0.5)
        console.log(this.height)

        this.f = this.hsFormats[0] 
        this.t = this.hsTimes[0] 
        this.r = this.ranks[0] 
        this.sortBy = this.sortOptions[0] //'class' // class, frequency, winrate, matchup
        this.zoomIn = false
        this.zoomArch = null
        this.fullyLoaded = false
        this.minGames = 1000


        for (var f of this.hsFormats) {
            this.data[f] = {}
            for (var t of this.hsTimes) {
                this.data[f][t] = {}
                for (var r of this.ranks) {
                    this.data[f][t][r] = null
        }}}

        

        this.loadData()
        this.setupUI()
        //this.renderOptions()
    } // close Constructor


    setupUI() {

        //for (let i=0;i<this.optionButtons.length;i++) { this.optionButtons[i].addEventListener("click", this.buttonTrigger.bind(this)) }

        document.querySelector('#tableWindow .content-header #formatFolder .dropdown').innerHTML = ''
        for (var f of this.hsFormats) {
            var btn = document.createElement('button')
            btn.innerHTML = btnIdToText[f]
            btn.id = f
            btn.className = 'folderBtn optionBtn'
            var trigger = function (e) {this.f = e.target.id; this.plot(); this.renderOptions()}
            btn.onclick = trigger.bind(this)
            document.querySelector('#tableWindow .content-header #formatFolder .dropdown').appendChild(btn)
        }

        document.querySelector('#tableWindow .content-header #timeFolder .dropdown').innerHTML = ''
        for (var t of this.hsTimes) {
            var btn = document.createElement('button')
            btn.innerHTML = btnIdToText[t]
            btn.id = t
            btn.className = 'folderBtn optionBtn'
            var trigger = function (e) {this.t = e.target.id; this.plot(); this.renderOptions()}
            btn.onclick = trigger.bind(this)
            document.querySelector('#tableWindow .content-header #timeFolder .dropdown').appendChild(btn)
        }

        document.querySelector('#tableWindow .content-header #rankFolder .dropdown').innerHTML = ''
        for (var r of this.ranks) {
            var btn = document.createElement('button')
            btn.innerHTML = btnIdToText[r]
            btn.id = r
            btn.className = 'folderBtn optionBtn'
            var trigger = function (e) {this.r = e.target.id; this.plot(); this.renderOptions()}
            btn.onclick = trigger.bind(this)
            document.querySelector('#tableWindow .content-header #rankFolder .dropdown').appendChild(btn)
        }

        document.querySelector('#tableWindow .content-header #sortFolder .dropdown').innerHTML = ''
        for (var s of this.sortOptions) {
            var btn = document.createElement('button')
            btn.innerHTML = btnIdToText[s]
            btn.id = s
            btn.className = 'folderBtn optionBtn'
            var trigger = function (e) {
                this.sortBy = e.target.id; 
                this.data[this.f][this.t][this.r].sortTableBy(this.sortBy)
                this.renderOptions()
            }
            btn.onclick = trigger.bind(this)
            document.querySelector('#tableWindow .content-header #sortFolder .dropdown').appendChild(btn)
        }

    }


    plot () { this.data[this.f][this.t][this.r].plot() }
    
    renderOptions() {
        
        document.querySelector("#tableWindow #formatBtn").innerHTML =    btnIdToText[this.f]
        document.querySelector("#tableWindow #timeBtn").innerHTML =      btnIdToText[this.t]
        document.querySelector("#tableWindow #ranksBtn").innerHTML =     btnIdToText[this.r]
        document.querySelector("#tableWindow #sortBtn").innerHTML =      btnIdToText[this.sortBy]

        for (var t of this.hsTimes) {
            if (this.data[this.f][t]['ranks_all'].totGames < this.minGames) {
                document.querySelector('#tableWindow .content-header #timeFolder #'+t).style.display = 'none'
            }
        }
    }

    loadData() {

        var ref = DATABASE.ref(this.firebasePath)
        ref.on('value',this.readData.bind(this), e => console.log('Could not load Table Data',e))

    } // load Data



    readData(DATA) {

        var tableData = DATA.val()
        for (var f of this.hsFormats) {
            for (var t of this.hsTimes) {
                for (var r of this.ranks) {
                    this.data[f][t][r] = new Table(tableData[f][t][r],f,t,r,this)
        }}}
        this.fullyLoaded = true
        console.log('table loaded: '+ (performance.now()-t0).toFixed(2)+' ms')
        this.renderOptions()
        finishedLoading()
    }// add Data

} // close LadderWindow

