



class DecksWindow {

    constructor (hsFormats) {

        this.hsFormats = hsFormats

        this.archDiv = document.querySelector('#decksWindow .content .archetypes .archetypeList')
        this.descriptionBox = document.querySelector('#decksWindow .content .descriptionBox')
        this.decksDiv = document.querySelector('#decksWindow .content .decklists')
        this.description = document.querySelector('#decksWindow .content .descriptionBox .description')
        this.overlayDiv = document.querySelector('#decksWindow .overlay')
        this.overlayP = document.querySelector('#decksWindow .overlayText')
        this.questionBtn = document.querySelector('#decksWindow .question')

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
        this.mode = 'description' // decklists, description
        this.deckWidth = '12rem'
        this.fullyLoaded = false
        this.overlay = false


        this.decklists = []
        this.data = {}
        
        for (var f of this.hsFormats) {
            this.data[f] = {}
            for (var hsClass of hsClasses) {
                this.data[f][hsClass] = {}
                this.data[f][hsClass].archetypes = []
                this.data[f][hsClass].text = ''
        }}

        this.renderOptions()

        this.questionBtn.addEventListener('click',this.toggleOverlay.bind(this))
        this.overlayDiv.addEventListener('click',this.toggleOverlay.bind(this))

        //this.loadData() // only load when switching to decks
    }// close constructor






    buttonTrigger(e) {
        
        var btnID = e.target.id

        if (e.target.classList.contains('archBtn')) { this.deckLink(btnID, this.f) }

        if (hsClasses.indexOf(btnID) != -1) {
            this.hsArch = null
            this.loadClass(btnID)
        }        

        if (btnID == 'decklists')   {this.loadDecklists()}
        if (btnID == 'description') {this.loadDescription()}

        if (btnID == 'Standard')    {this.loadFormat('Standard')}
        if (btnID == 'Wild')        {this.loadFormat('Wild')}
        
        this.renderOptions()   
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
                    
                    this.data[f][hsClass].archetypes.push({name:key, hsClass:hsClass, hsFormat:f,  decklists:[]})
                    var idx = this.data[f][hsClass].archetypes.length -1

                    var arch = DATA[f][hsClass].archetypes[key]
                    var deckKeys = Object.keys(arch)
                    for (var deckKey of deckKeys) {
                        var decklist = arch[deckKey]
                        this.data[f][hsClass].archetypes[idx].decklists.push(arch[deckKey])
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
        this.loadFormat(this.f) }


    loadFormat(hsFormat) { this.f = hsFormat; this.loadClass(this.hsClass) }


    loadClass(hsClass) {

        this.hsClass = hsClass

        if (this.mode == 'description') {this.loadDescription()}
        if (this.mode == 'decklists') {this.loadDecklists()}

        
        this.archDiv.innerHTML = ''
        var archetypes = this.data[this.f][this.hsClass].archetypes

        for (var arch of archetypes) { this.addArchetypeBtn(arch) }
        
        if (archetypes.length > 0 && this.hsArch == null) {this.hsArch = archetypes[0]}
    }



    loadDescription() {

        this.mode = 'description'
        var d = this.data[this.f][this.hsClass]
        this.addDescription(this.hsClass,d.text)
        this.descriptionBox.style.display = 'inline'
        this.decksDiv.style.display = 'none'
    }




    loadDecklists() {

        this.mode = 'decklists'
        this.decklists = []

        this.decksDiv.innerHTML = ''

        if (this.hsArch == null) {this.hsArch = this.data[this.f][this.hsClass].archetypes[0]}
        if (this.hsArch == undefined) {this.hsArch = null; return}
        
        var deckCards = []
        var gridTemplateColumns = ''
        for (var dl of this.hsArch.decklists) {
            
            gridTemplateColumns += this.deckWidth + ' '
            var decklist = new Decklist(dl, this.hsClass, this)
            this.decklists.push(decklist)
            this.decksDiv.appendChild(decklist.div)
        }
        
        this.descriptionBox.style.display = 'none'
        this.decksDiv.style.display = 'grid'
        this.decksDiv.style.gridTemplateColumns = gridTemplateColumns
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

    highlightUnique() {

    }


    addDescription(title,text) {
        this.description.innerHTML = '<p class="title">'+title+'</p><p class="text">'+text+'</p>'
    }



    addArchetypeBtn(arch) {
        
        var btn = document.createElement('button')
        
        btn.style.backgroundColor = hsColors[arch.hsClass]
        btn.style.color = hsFontColors[arch.hsClass]
        btn.innerHTML = arch.name
        btn.id = arch.name
        btn.style.padding = '0.2rem'
        btn.style.marginTop = '0.2rem'
        btn.className = 'archBtn'

        btn.addEventListener("click", this.buttonTrigger.bind(this))
        this.archButtons.push(btn)

        this.archDiv.appendChild(btn)
    }

    toggleOverlay() {
        if (this.overlay) {this.overlayDiv.style.display = 'none'; this.overlay = false}
        else{
            this.overlayP.innerHTML = this.overlayText
            this.overlayDiv.style.display = 'block'; 
            this.overlay = true}
    }


} // close Decks










