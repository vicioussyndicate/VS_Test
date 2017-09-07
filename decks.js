



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


    setDeckExplanation('Druid >> Token Druid','As one of, if not the only, deck with a favorable matchup against Jade Druid, Aggro-Token Druid has risen up in its play rate. Druid of the Swarm and Crypt Lord seem to be staples in the archetype, with many people opting to run Crazed Alchemists to turn the huge taunts into a burst of damage for a finishing blow. Crazed Alchemist also helps get through taunts with high health and low attack, and one shots Doomsayer, a fairly popular card in the current meta.')

    insertArchetype('Token Druid')
    insertArchetype('Jade Druid')
    insertArchetype('Ramp Druid')
    
    for (var i=0;i<30;i++) {
        insertCard('0:  Innervate  x1 '+i)
    }


}




function setDeckExplanation(title, text) {

    var el = document.querySelector('#decksWindow .content .explanation') 
    el.innerHTML = '<b>'+title+'</b><br><br>'+text

}


function insertArchetype (text) {




    var el = document.querySelector('#decksWindow .content .archetypes')
    var btn = document.createElement('button')

    btn.style.backgroundColor = randomColor()
    btn.innerHTML = text
    btn.style.padding = '0.2rem'
    btn.style.marginTop = '0.2rem'
    

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















