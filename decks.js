



class DecksWindow {

    constructor (DATA) {

        this.DATA = DATA
        this.descriptionBox = document.querySelector('#decksWindow .content .descriptionBox')
        this.decklists = document.querySelector('#decksWindow .content .decklists')
        this.description = document.querySelector('#decksWindow .content .descriptionBox .description')

        this.hsFormat = 'Standard'
        this.hsClass = 'Druid'
        this.hsArchetypeIdx = 0
        this.display = 'description'


        this.data = {
            Standard: {},
            Wild: {}
        }
        
        for (f of hsFormats) {
            this.data[f] = {}
            for (var hsClass of hsClasses) {
                this.data[f][hsClass] = {}
                this.data[f][hsClass].archetypes = []

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
                    }
                }
            }
        }
        this.loadClass('Druid')
    }// close constructor


    loadFormat(hsFormat) {
        this.hsFormat = hsFormat
        this.loadClass(this.hsClass)
    }

    loadClass(hsClass) {

        this.hsClass = hsClass
        if (this.display == 'description') {this.loadDescription()}
        if (this.display == 'decklists') {this.loadDecklists()}

        var archDiv = document.querySelector('#decksWindow .content .archetypes .archetypeList')
        archDiv.innerHTML = ''
        var archetypes = this.data[this.hsFormat][this.hsClass].archetypes
        //console.log(archetypes)
        for (var arch of archetypes) {
            this.insertArchetype(arch)
        }
    }

    loadDescription() {
        var d = this.data[this.hsFormat][this.hsClass]
        this.insertDescription(this.hsClass,d.text)
        this.descriptionBox.style.display = 'inline'
        this.decklists.style.display = 'none'
    }




    loadDecklists() {
        var deckWidth = '12rem'

        var deckDiv = document.querySelector('#decksWindow .content .decklists')
        deckDiv.innerHTML = ''
        
        var arch = this.data[this.hsFormat][this.hsClass].archetypes[this.hsArchetypeIdx]
        
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
        //console.log('insert description', this.description)
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
        deckTitle.innerHTML = dl.name

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










