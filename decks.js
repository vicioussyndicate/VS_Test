



class DecksWindow {

    constructor (DATA) {
        this.archIndex = 0
        this.deckIndex = 0
        this.hsClass = 'Druid'
        /*

        // out of DATA
        this.archetypes = {
            Druid: ['Token Druid', 'Ramp Druid', 'Aggro-Token Druid', 'Jade Druid'],
            Hunter: ['Secret Hunter'],
            Mage: ['Secret Mage'],
            Paladin: ['Midrange Paladin'],
            Priest: ['Shadow Priest'],
            Rogue: ['Shadow Rogue'],
            Shaman: ['Totem Shaman'],
            Warlock: ['Zoolock'],
            Warrior: ['Control Warrior', 'Pirate Warrior']
        }


        var jadeCards = []
        for (var i=0;i<30;i++){
            jadeCards.push({name:'Innervate',cost:'0',quantity:'1'})
        }

        this.decklists = {}
        this.decklists['Token Druid'] = [{

            name: 'Zalaes Token Druid',
            cards: jadeCards,
            note: 'Note: Has removed 2 Innervates for 2 Tinyfins',

        }]

        this.setDeckExplanation('Druid','Druid, for the most part, has settled into two major archetypes; Jade Druid, and Aggro-Token Druid. The class continues to dominate higher levels of play, with nearly 40% representation at legend and likely a higher number at the top legend ranks. Both Jade and Aggro-Token Druid have found what seems to be working for them fairly quickly, since both archetypes had a solid base to go off of from the last expansion.')


        this.loadClass(this.hsClass)
        this.loadArchetype('Token Druid')
        
        */
    }// close constructor

    loadArchetype(hsClass, index) {

        var arch = {name:'Token Druid',explanation:'',color:randomColor()} //this.archetypes[hsClass][index]
        this.setDeckExplanation(arch.name, arch.explanation)
        this.set
    }


} // close Decks











function setupDecks () {

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

    var explanation = document.querySelector('#decksWindow .content .explanation') 
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

    var el = document.querySelector('#decksWindow .content .deckList')
    var div = document.createElement('div')

    div.style.backgroundColor = 'grey'
    div.innerHTML = card
    div.style.padding = '0.1rem'

    el.appendChild(div)

}


function setDeckCreator(title) {

    var el = document.querySelector('#decksWindow .content .deckCreators .title')
    el.innerHTML = title
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