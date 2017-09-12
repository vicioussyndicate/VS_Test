


class TableWindow {


    constructor(hsFormats, hsTimes, table_ranks) {

        this.window = document.querySelector('#ladderWindow')
        this.optionButtons = document.querySelectorAll('#tableWindow .optionBtn')
        this.data = {}
        this.hsFormats = hsFormats
        this.hsTimes = hsTimes
        this.ranks = table_ranks


        // Defaults

        this.width = document.querySelector('.main-wrapper').offsetWidth -9
        this.height = 560

        this.f = 'Standard'
        this.t = 'lastWeek'
        this.r = 'ranks_all'
        this.sortBy = 'class' // class, frequency, winrate, matchup
        this.zoomIn = false
        this.zoomArch = null
        this.fullyLoaded = false


        for (var f of this.hsFormats) {
            this.data[f] = {}
            for (var t of this.hsTimes) {
                this.data[f][t] = {}
                for (var r of this.ranks) {
                    this.data[f][t][r] = null
        }}}

        

        this.loadData()

        for (let i=0;i<this.optionButtons.length;i++) { this.optionButtons[i].addEventListener("click", this.buttonTrigger.bind(this)) }
    } // close Constructor




    buttonTrigger(e) {

        var btnID = e.target.id

        if (btnID == 'lastWeek')    {this.t = 'lastWeek'}
        if (btnID == 'lastMonth')   {this.t = 'lastMonth'}

        if (btnID == 'Standard')    {this.f = 'Standard'}
        if (btnID == 'Wild')        {this.f = 'Wild'}

        if (btnID == 'ranks_all')   {this.r = 'ranks_all'}
        if (btnID == 'ranks_L_5')   {this.r = 'ranks_L_5'}
        if (btnID == 'ranks_6_15')  {this.r = 'ranks_6_15'}
        
        var data = this.data[this.f][this.t][this.r]

        if (btnID == 'class')       {data.sortTableBy('class'); return}
        if (btnID == 'frequency')   {data.sortTableBy('frequency');return}
        if (btnID == 'winrate')     {data.sortTableBy('winrate');return}
        if (btnID == 'matchup')     {data.sortTableBy('matchup');return}
        
        data.plot()
    }// button Handler

    plot () { this.data[this.f][this.t][this.r] }
        

    loadData() {

        var ref = DATABASE.ref('tableData')
        ref.on('value',this.addData.bind(this), function () {console.log('Could not load Table Data')})

    } // load Data



    addData(DATA) {

        var tableData = DATA.val()
        
        for (var f of this.hsFormats) {
            for (var t of this.hsTimes) {
                for (var r of this.ranks) {
                    var key = Object.keys(tableData[f][t][r])[0]
                    this.data[f][t][r] = new Table(tableData[f][t][r][key],f,t,r,this)
        }}}
        this.fullyLoaded = true
        console.log('table loaded: '+ (performance.now()-t0).toFixed(2)+' ms')
        finishedLoading()
    }// add Data

} // close LadderWindow

