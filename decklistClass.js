

class Decklist {

    constructor (dl,hsClass) {

        this.hsClass = hsClass

        this.cards = []
        this.cardNames = []

        this.deckBox = document.createElement('div')
        this.deckBox.className = 'deckBox'
        
        this.deckTitle = document.createElement('div')
        this.deckTitle.className = 'deckTitle'
        this.deckTitle.innerHTML = '<p>'+dl.name+'</p>'
        this.deckTitle.style.backgroundColor = hsColors[this.hsClass]
        this.deckTitle.style.color = hsFontColors[this.hsClass]


        this.decklist = document.createElement('div')
        this.decklist.className = 'decklist'

        for (var card of dl.cards) {

            this.cardNames.push(card.name)

            var c = new CardDiv(card)
            this.cards.push(c)
            this.decklist.appendChild(c.div)
        }

        this.copyBtn = document.createElement('buttton')
        this.copyBtn.innerHTML = 'Copy To Clipboard'
        this.copyBtn.className = 'copyDL'
        this.copyBtn.id = 'dl'+randint(0,10000000) // unique button id for clipboard
        
        
        this.deckBox.appendChild(this.deckTitle)
        this.deckBox.appendChild(this.decklist)
        this.deckBox.appendChild(this.copyBtn)

        new Clipboard('#'+this.copyBtn.id, {
            text: function(trigger) {
                return dl.deckCode 
            }
        });
    }


}// decklist




class CardDiv {


    constructor (card) {
        this.name = card.name
        this.cost = card.manaCost
        this.quantity = card.quantity

        this.div = document.createElement('div')
        this.div.className = 'card'
        this.div.style.display = 'block'

        var costContainer = document.createElement('div')
        costContainer.className = 'costContainer'

        var hex = document.createElement('div')
        hex.className = 'hex'
        hex.innerHTML = `&#11042`

        var cost = document.createElement('div')
        cost.innerHTML = this.cost
        cost.className = 'cost'
        if (this.cost >= 10) {
            cost.style.fontSize = '75%'
            cost.style.paddingLeft = '0.2rem'
            cost.style.paddingTop = '0.35rem'
        }

        var name = document.createElement('div')
        name.innerHTML = this.name
        name.className = 'name'

        var quantity = document.createElement('div')
        quantity.innerHTML = (this.quantity > 1) ? 'x'+this.quantity : ''
        quantity.className = 'quantity'

        costContainer.appendChild(hex)
        costContainer.appendChild(cost)
        this.div.appendChild(costContainer)
        this.div.appendChild(name)
        this.div.appendChild(quantity)
    }


}