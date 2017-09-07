


function setupDecks () {


    fillExplanation('Druid','Druid, for the most part, has settled into two major archetypes; Jade Druid, and Aggro-Token Druid. The class continues to dominate higher levels of play, with nearly 40% representation at legend and likely a higher number at the top legend ranks. Both Jade and Aggro-Token Druid have found what seems to be working for them fairly quickly, since both archetypes had a solid base to go off of from the last expansion.')

    insertArchetype('Token Druid')
    insertArchetype('Jade Druid')
    insertArchetype('Ramp Druid')
    
    for (var i=0;i<30;i++) {
        insertCard('Card '+i)
    }

}




function fillExplanation(title, text) {

    var el = document.querySelector('#decksWindow .content .explanation') 
    el.innerHTML = '<b>'+title+'</b><br><br>'+text

}


function insertArchetype (text) {




    var el = document.querySelector('#decksWindow .content .archetypes')
    var div = document.createElement('div')

    div.style.backgroundColor = randomColor()
    div.innerHTML = text
    div.style.padding = '0.1rem'
    

    el.appendChild(div)


}

function insertCard(card) {

    var el = document.querySelector('#decksWindow .content .decks')
    var div = document.createElement('div')

    div.style.backgroundColor = 'grey'
    div.innerHTML = card
    div.style.padding = '0.1rem'

    el.appendChild(div)

}


















