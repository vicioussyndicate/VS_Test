



class DecksWindow {

    constructor (DATA) {

        this.DATA = DATA
        this.descriptionBox = document.querySelector('#decksWindow .content .descriptionBox')
        this.decklists = document.querySelector('#decksWindow .content .decklists')
        this.description = document.querySelector('#decksWindow .content .descriptionBox .description')

        this.hsFormat = 'Standard'
        this.hsClass = 'Druid'
        this.hsArchetype = ''
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
        //var d = this.data[this.hsFormat][this.hsClass]
        //this.insertDescription(this.hsClass,d.text)
        this.insertDecklist('')
        this.descriptionBox.style.display = 'none'
        this.decklists.style.display = 'inline'
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

        var div = document.createElement('div')
        div.innerHTML = 'TEST TEXT'

        this.decklists.appendChild(div)
    }


} // close Decks











function setupDecks () {
    return
    var description = document.querySelector('#decksWindow .content .description')
    description.style.display = 'none'
    setDeckExplanation('Druid >> Token Druid','As one of, if not the only, deck with a favorable matchup against Jade Druid, Aggro-Token Druid has risen up in its play rate. Druid of the Swarm and Crypt Lord seem to be staples in the archetype, with many people opting to run Crazed Alchemists to turn the huge taunts into a burst of damage for a finishing blow. Crazed Alchemist also helps get through taunts with high health and low attack, and one shots Doomsayer, a fairly popular card in the current meta.')

    insertArchetype('Token Druid')
    insertArchetype('Jade Druid')
    insertArchetype('Ramp Druid')
    
    
    for (var i=0;i<30;i++) {
        insertCard('0:  Innervate  x1 '+i)
    }


}



function setDeckExplanation(title, text) {

    var explanation = document.querySelector('#decksWindow .content .description') 
    explanation.innerHTML = '<p class="title">'+title+'</p><p class="text">'+text+'</p>'

    //var video = document.querySelector('#decksWindow .content .video')
    //video.innerHTML = `<object style="width:100%;height:100%; float: none; clear: both; margin: 2px auto;" data="https://www.youtube.com/embed/WTChO0cNQbI"></object>`
}


function insertArchetype (text) {




    var el = document.querySelector('#decksWindow .content .archetypes')
    var btn = document.createElement('button')

    btn.style.backgroundColor = randomColor()
    btn.innerHTML = text
    btn.style.padding = '0.2rem'
    btn.style.marginTop = '0.2rem'
    btn.classList.add('archBtn')
    

    el.appendChild(btn)


}

function insertCard(card) {

    var el = document.querySelector('#decksWindow .content .deckLists')
    var div = document.createElement('div')

    div.style.backgroundColor = 'grey'
    div.innerHTML = card
    div.style.padding = '0.1rem'

    el.appendChild(div)

}


function setDeckCreator(title) {

    //var el = document.querySelector('#decksWindow .content .deckCreators .title')
    //el.innerHTML = title
}












var dragonPriest =
`
### Capilano's Dragon Priest
# Class: Priest
# Format: Wild
#
# 2x (1) Northshire Cleric
# 2x (1) Potion of Madness
# 2x (1) Power Word: Shield
# 2x (1) Twilight Whelp
# 2x (2) Netherspite Historian
# 2x (2) Radiant Elemental
# 2x (2) Shadow Visions
# 1x (2) Shadow Word: Pain
# 2x (2) Wyrmrest Agent
# 1x (3) Brann Bronzebeard
# 2x (3) Curious Glimmerroot
# 1x (3) Shadow Word: Death
# 2x (4) Twilight Guardian
# 2x (5) Azure Drake
# 2x (5) Blackwing Corruptor
# 2x (5) Drakonid Operative
# 1x (5) Holy Nova
#
AAEBAa0GBMkG0wrXCoUXDeUEuQbyDO4R6RKJFKQUgrUCtbsCursC0cEC2MEC2cECAA==
#
# To use this deck, copy it to your clipboard and create a new deck in Hearthstone
# https://www.vicioussyndicate.com/capilanos-dragon-priest/`