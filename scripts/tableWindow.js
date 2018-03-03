


class TableWindow {


    constructor(callback) {


        this.div = document.querySelector('#tableWindow')
        this.tab = document.querySelector('#table.tab')
        this.optionButtons = document.querySelectorAll('#tableWindow .optionBtn')
        this.questionBtn = document.querySelector('#tableWindow .question')
        this.overlayDiv = document.querySelector('#tableWindow .overlay')
        this.overlayP = document.querySelector('#tableWindow .overlayText')
        this.nrGamesP = document.querySelector('#tableWindow .nrGames')
        //this.nrGamesBtn = document.querySelector('#tableWindow .content-header #nrGames')
        this.nrGamesBtn = document.querySelector('#tableWindow .content-header #showNumbers')

        this.firebasePath = (PREMIUM) ? 'premiumData/tableData' : 'data/tableData'

        this.data = {}
        this.mode = 'matchup' // simulation
        this.hsFormats = hsFormats
        this.hsTimes = (PREMIUM) ? table_times_premium : table_times
        this.ranks =   (PREMIUM) ? table_ranks_premium : table_ranks
        this.sortOptions = (PREMIUM) ? table_sortOptions_premium : table_sortOptions //['frequency','winrate','matchup','class']
        this.numArch = 16 // table_numArch
        this.annotated = false
        this.nrGames = 0
        this.colorTheme = 0 // 0: red blue,  1: red green 2: grey

        this.overlayText = `
            Here you can see how your deck on the left hand side performs against any other deck on the top. 
            The colors range  from favorable <span class='blue'>blue</span> to unfavorable <span class='red'>red</span>.<br><br>
            The matchup table lists the top ${this.numArch} most frequent decks within the selected time and rank brackets.<br><br>
            The hover info lists the number of games recorded for that specific matchup in the (parenthesis).<br><br>
            The 'Overall' line at the bottom shows the overall winrate of the opposing decks in the specified time and rank bracket.<br><br>
            Sorting the table displays the most frequent/ highest winrate deck in the top left. Changing the format, time or rank brackets automatically sorts the table.<br><br>
            <img src='Images/muSort.png'></img>
            
            <br><br><br><br>
            Click on a matchup to 'zoom in'. Click again to 'zoom out'.<br><br>
            In the zoomed in view you see only one deck on the left side.<br><br>
            Additionally there are 2 subplots displaying the frequency of the opposing decks (brown line chart) and the specific matchup as black bar charts.<br><br>
            Changing any parameter (Format, time, rank, sorting) keeps you zoomed into the same archetype if possible.<br><br>
            You can additionally sort 'by Matchup' while zoomed in.<br><br>
        `
        
        // Defaults

        this.width = document.querySelector('.main-wrapper').offsetWidth -40
        this.height = document.querySelector('#ladderWindow .content').offsetHeight*0.94

        this.f = this.hsFormats[0] 
        this.t = 'last2Weeks' //this.hsTimes[0] 
        this.r = this.ranks[0] 
        this.sortBy = this.sortOptions[0] //'class' // class, frequency, winrate, matchup
        if (PREMIUM) {
            this.zoomIn = false
            this.zoomArch = null
        }
        this.fullyLoaded = false
        this.overlay = false
        this.minGames = 1000


        for (var f of this.hsFormats) {
            this.data[f] = {fullyLoaded: false}
            for (var t of this.hsTimes) {
                this.data[f][t] = {}
                for (var r of this.ranks) {
                    this.data[f][t][r] = null
        }}}
        
        this.loadData('Standard',callback)
        this.setupUI()
    } // close Constructor


    setupUI() {

        //for (let i=0;i<this.optionButtons.length;i++) { this.optionButtons[i].addEventListener("click", this.buttonTrigger.bind(this)) }

        this.dropdownFolders = {
            format: document.querySelector('#tableWindow .content-header #formatFolder .dropdown'),
            time: document.querySelector('#tableWindow .content-header #timeFolder .dropdown'),
            rank: document.querySelector('#tableWindow .content-header #rankFolder .dropdown'),
            sort: document.querySelector('#tableWindow .content-header #sortFolder .dropdown'),
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
            console.log(folder)
        }


        for (var f of this.hsFormats) {
            var btn = document.createElement('button')
            btn.innerHTML = btnIdToText[f]
            btn.id = f
            btn.className = 'folderBtn optionBtn'
            var trigger = function (e) {this.f = e.target.id; this.plot()}
            btn.onclick = trigger.bind(this)
            this.dropdownFolders.format.appendChild(btn)
        }

        for (var t of this.hsTimes) {
            var btn = document.createElement('button')
            btn.innerHTML = btnIdToText[t]
            btn.id = t
            btn.className = 'folderBtn optionBtn'
            var trigger = function (e) {this.t = e.target.id; this.plot()}
            btn.onclick = trigger.bind(this)
            this.dropdownFolders.time.appendChild(btn)
        }

        for (var r of this.ranks) {
            var btn = document.createElement('button')
            btn.innerHTML = btnIdToText[r]
            btn.id = r
            btn.className = 'folderBtn optionBtn'
            var trigger = function (e) {this.r = e.target.id; this.plot()}
            btn.onclick = trigger.bind(this)
            this.dropdownFolders.rank.appendChild(btn)
        }

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
            this.dropdownFolders.sort.appendChild(btn)
        }

        
        this.questionBtn.addEventListener('click',this.toggleOverlay.bind(this))
        this.overlayDiv.addEventListener('click',this.toggleOverlay.bind(this))
        this.nrGamesBtn.onclick = this.annotate.bind(this)
        let changeColors = function () {this.updateColorTheme()}
        //document.querySelector('#tableWindow .changeColorBtn').addEventListener('click',changeColors.bind(this))
        document.querySelector('#tableWindow #changeColor').addEventListener('click',changeColors.bind(this))

        if (PREMIUM) {
            let equilibrium = function () {this.equilibrium()}
            document.querySelector('#tableWindow .equilibriumBtn').addEventListener('click',equilibrium.bind(this))

            let dlCSV = function () {this.data[this.f][this.t][this.r].downloadCSV()}
            document.querySelector('#tableWindow .downloadBtn').addEventListener('click',dlCSV.bind(this))
        }
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

    checkLoadData(callback) {
        if (!this.data[this.f].fullyLoaded) {
            if (callback == undefined) { return false }
            else { this.loadData(this.f, callback) }
        } 
        else { return (callback == undefined) ? true : callback.apply(this) }
    }

    plot () { 
        if (!this.fullyLoaded) {return}
        if (!this.checkLoadData()) { 
            this.renderOptions()
            return this.checkLoadData( _ => { app.ui.tableWindow.plot() }) 
        }
        this.data[this.f][this.t][this.r].plot()
        this.renderOptions()
    }
    
    annotate() { 
        if (this.annotated) {
            //this.data[this.f][this.t][this.r].annotate(false); 
            this.nrGamesBtn.classList.remove('highlighted') }
        else {
            //this.data[this.f][this.t][this.r].annotate(true); 
            this.nrGamesBtn.classList.add('highlighted') }
        this.annotated = !this.annotated        
        this.plot()
    }

    setTotGames() { this.nrGamesP.innerHTML = this.nrGames.toLocaleString()+" games" }

    
    renderOptions() {
        
        // ui.path.hsFormat = this.f
        // ui.path.time = this.t
        // ui.path.ranks = this.r

        document.querySelector("#tableWindow #formatBtn").innerHTML = (MOBILE) ? btnIdToText_m[this.f] : btnIdToText[this.f]
        document.querySelector("#tableWindow #timeBtn").innerHTML =   (MOBILE) ? btnIdToText_m[this.t] : btnIdToText[this.t]
        document.querySelector("#tableWindow #ranksBtn").innerHTML =  (MOBILE) ? btnIdToText_m[this.r] : btnIdToText[this.r]
        document.querySelector("#tableWindow #sortBtn").innerHTML =   (MOBILE) ? btnIdToText_m[this.sortBy] : btnIdToText[this.sortBy]

        for (var t of this.hsTimes) {
            if (this.data[this.f][t]['ranks_all'].totGames < this.minGames) {
                document.querySelector('#tableWindow .content-header #timeFolder #'+t).style.display = 'none'
            }
        }
    }


    loadData(hsFormat, callback) {
        var ref = app.fb_db.ref(this.firebasePath+'/'+hsFormat)
        let loader = function(Data) { this.readData(Data, hsFormat, callback) }
        ref.on('value',loader.bind(this), e => console.log('Could not load Table Data',e))

    } // load Data



    readData(DATA, hsFormat,callback) {
        var tableData = DATA.val()

        for (var t of this.hsTimes) {
            for (var r of this.ranks) {
                this.data[hsFormat][t][r] = new Table(tableData[t][r],hsFormat,t,r,this)
        }}

        this.fullyLoaded = true
        this.data[hsFormat].fullyLoaded = true
        console.log('table loaded: '+ (performance.now()-t0).toFixed(2)+' ms')
        this.renderOptions()
        callback.apply(this)
    }// add Data

    toggleOverlay() {
        if (this.overlay) {this.overlayDiv.style.display = 'none'; this.overlay = false}
        else{
            this.overlayP.innerHTML = this.overlayText
            this.overlayDiv.style.display = 'block'; 
            this.overlay = true}
    }

    updateColorTheme() { 
        MU_COLOR_IDX = (MU_COLOR_IDX + 1) % 3
        this.data[this.f][this.t][this.r].plot();
    }
    equilibrium() { this.data[this.f][this.t][this.r].equilibrium() }

} // close LadderWindow

