



class DecksWindow {

    constructor (hsFormats) {

        //this.DATA = DATA
        this.hsFormats = hsFormats


        this.descriptionBox = document.querySelector('#decksWindow .content .descriptionBox')
        this.decklists = document.querySelector('#decksWindow .content .decklists')
        this.description = document.querySelector('#decksWindow .content .descriptionBox .description')
        this.optionButtons = document.querySelectorAll('#decksWindow .optionBtn')
        for (let i=0;i<this.optionButtons.length;i++) { this.optionButtons[i].addEventListener("click", this.buttonTrigger.bind(this)) }

        this.f = 'Standard'
        this.hsClass = 'Druid'
        this.hsArchetypeIdx = 0
        this.display = 'description'
        this.fullyLoaded = false


        this.data = {}
        
        for (var f of this.hsFormats) {
            this.data[f] = {}
            for (var hsClass of hsClasses) {
                this.data[f][hsClass] = {}
                this.data[f][hsClass].archetypes = []
                this.data[f][hsClass].text = ''
        }}

        this.loadData()
        this.renderOptions()
    }// close constructor




    buttonTrigger(e) {

        var btnID = e.target.id

        if (btnID == 'Druid')       {this.loadClass('Druid')}
        if (btnID == 'Hunter')      {this.loadClass('Hunter')}
        if (btnID == 'Mage')        {this.loadClass('Mage')}
        if (btnID == 'Paladin')     {this.loadClass('Paladin')}
        if (btnID == 'Priest')      {this.loadClass('Priest')}
        if (btnID == 'Rogue')       {this.loadClass('Rogue')}
        if (btnID == 'Shaman')      {this.loadClass('Shaman')}
        if (btnID == 'Warlock')     {this.loadClass('Warlock')}
        if (btnID == 'Warrior')     {this.loadClass('Warrior')}

        if (btnID == 'decklists')   {this.loadDecklists()}
        if (btnID == 'description') {this.loadDescription()}

        if (btnID == 'Standard')    {this.loadFormat('Standard')}
        if (btnID == 'Wild')        {this.loadFormat('Wild')}
        
        this.renderOptions()   
    }

    renderOptions() {
         for (var btn of this.optionButtons) { 
            btn.classList.remove('highlighted')
            if (btn.id == this.display) {btn.classList.add('highlighted')}
        }

        document.querySelector("#decksWindow #formatBtn").innerHTML =   btnIdToText[this.f]
        document.querySelector("#decksWindow #classBtn").innerHTML =    this.hsClass

    }

    plot() { this.loadClass(this.hsClass) }



    loadData() {

        var ref = DATABASE.ref('deckData')
        ref.on('value',this.addData.bind(this), function () {console.log('Could not load Ladder Data')})

    } // load Data



    addData(DATA) {

        var DATA = DATA.val()
        
        for (var f of this.hsFormats) {
            for (var hsClass of hsClasses) {

                var key = Object.keys(DATA[f][hsClass].text)[0]
                this.data[f][hsClass].text = DATA[f][hsClass].text[key]


                var keys = Object.keys(DATA[f][hsClass].archetypes)
                for (var key of keys) {
                    
                    this.data[f][hsClass].archetypes.push({name:key, decklists:[]})
                    var idx = this.data[f][hsClass].archetypes.length -1

                    var arch = DATA[f][hsClass].archetypes[key]
                    var deckKeys = Object.keys(arch)
                    for (var deckKey of deckKeys) {
                        var decklist = arch[deckKey]
                        this.data[f][hsClass].archetypes[idx].decklists.push(arch[deckKey])
        }}}}
        this.fullyLoaded = true
        console.log('decks loaded: '+ (performance.now()-t0).toFixed(2)+' ms')
        finishedLoading()
    }// add Data









    loadFormat(hsFormat) {
        this.f = hsFormat
        this.loadClass(this.hsClass)
    }

    loadClass(hsClass) {

        this.hsClass = hsClass
        if (this.display == 'description') {this.loadDescription()}
        if (this.display == 'decklists') {this.loadDecklists()}

        var archDiv = document.querySelector('#decksWindow .content .archetypes .archetypeList')
        archDiv.innerHTML = ''
        var archetypes = this.data[this.f][this.hsClass].archetypes
        //console.log(archetypes)
        for (var arch of archetypes) {
            this.insertArchetype(arch)
        }
    }

    loadDescription() {
        var d = this.data[this.f][this.hsClass]
        this.insertDescription(this.hsClass,d.text)
        this.descriptionBox.style.display = 'inline'
        this.decklists.style.display = 'none'
    }




    loadDecklists() {
        var deckWidth = '12rem'

        var deckDiv = document.querySelector('#decksWindow .content .decklists')
        deckDiv.innerHTML = ''
        
        var arch = this.data[this.f][this.hsClass].archetypes[this.hsArchetypeIdx]
        
        var gridTemplateColumns = ''
        for (var dl of arch.decklists) {
            gridTemplateColumns += deckWidth + ' '
            this.insertDecklist(dl)
        }
        
        this.descriptionBox.style.display = 'none'
        this.decklists.style.display = 'grid'
        deckDiv.style.gridTemplateColumns = gridTemplateColumns
        deckDiv.style.gridGap = '0.5rem'
    }

    insertDescription(title,text) {
        this.description.innerHTML = '<p class="title">'+title+'</p><p class="text">'+text+'</p>'
    }

    insertArchetype(arch) {
        var archDiv = document.querySelector('#decksWindow .content .archetypes .archetypeList')

        var btn = document.createElement('button')
        
        btn.style.backgroundColor = randomColor()
        btn.innerHTML = arch.name
        btn.style.padding = '0.2rem'
        btn.style.marginTop = '0.2rem'
        btn.className = 'archBtn'

        archDiv.appendChild(btn)

    }


    insertDecklist(dl) {

        var deckDiv = document.querySelector('#decksWindow .content .decklists')

        var deckBox = document.createElement('div')
        deckBox.className = 'deckBox'

        var deckTitle = document.createElement('div')
        deckTitle.className = 'deckTitle'
        deckTitle.innerHTML = '<p>'+dl.name+'</p>'

        var decklist = document.createElement('div')
        decklist.className = 'decklist'

        for (var card of dl.cards) {
            var cardDiv = document.createElement('div')
            cardDiv.className = 'card'
            cardDiv.innerHTML = card.manaCost+' '+card.name+' '+card.quantity
            cardDiv.style.display = 'block'
            decklist.appendChild(cardDiv)
        }

        var copyBtn = document.createElement('buttton')
        copyBtn.innerHTML = 'Copy To Clipboard'
        copyBtn.className = 'copyDL'
        copyBtn.id = 'dl'+randint(0,100000)
        
        
        deckBox.appendChild(deckTitle)
        deckBox.appendChild(decklist)
        deckBox.appendChild(copyBtn)
        deckDiv.appendChild(deckBox)

        new Clipboard('#'+copyBtn.id, {
            text: function(trigger) {
                return dl.deckCode 
            }
        });
    }


} // close Decks










