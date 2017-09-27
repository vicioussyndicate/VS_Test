

class Decklist {

    constructor (dl,hsClass,window) {

        this.name = dl.name

        this.hsClass = hsClass
        this.window = window

        this.cards = []
        this.cardNames = []

        this.div = document.createElement('div')
        this.div.className = 'deckBox'
        this.div.id = dl.name
        
        this.deckTitle = document.createElement('div')
        this.deckTitle.className = 'deckTitle'
        this.deckTitle.innerHTML = '<p>'+dl.name+'</p>'
        this.deckTitle.style.backgroundColor = hsColors[this.hsClass]
        this.deckTitle.style.color = hsFontColors[this.hsClass]


        this.decklist = document.createElement('div')
        this.decklist.className = 'decklist'
        this.decklist.id = dl.name

        for (var card of dl.cards) {

            this.cardNames.push(card.name)

            var c = new CardDiv(card)
            c.hoverDiv.onmouseover = this.window.highlight.bind(this.window)
            c.hoverDiv.onmouseout = this.window.highlight.bind(this.window)
            this.cards.push(c)
            this.decklist.appendChild(c.div)
        }

        this.copyBtn = document.createElement('buttton')
        this.copyBtn.innerHTML = 'Copy To Clipboard'
        this.copyBtn.className = 'copyDL'
        this.copyBtn.id = 'dl'+randint(0,10000000) // unique button id for clipboard
        
        
        this.div.appendChild(this.deckTitle)
        this.div.appendChild(this.decklist)
        this.div.appendChild(this.copyBtn)

        new Clipboard('#'+this.copyBtn.id, {
            text: function(trigger) {
                return dl.deckCode 
            }
        });
    }

    highlight(cardName) {
        for (var c of this.cards) {
            if (c.name == cardName) { c.div.classList.add('highlighted')}
            else { c.div.classList.remove('highlighted')}
        }   
    }


}// decklist




class CardDiv {


    constructor (card) {
        this.name = card.name
        this.cost = card.manaCost
        this.quantity = card.quantity

        this.div = document.createElement('div')
        this.div.className = 'card'
        this.div.id = this.name
        this.div.style.display = 'block'

        this.hoverDiv = document.createElement('div')
        this.hoverDiv.className = 'hoverDiv'
        this.hoverDiv.id = this.name

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

        var quantity
        if (this.quantity > 1) {
            quantity = document.createElement('div')
            quantity.innerHTML = 'x'+this.quantity
            quantity.className = 'quantity'
        }

        costContainer.appendChild(hex)
        costContainer.appendChild(cost)
        this.div.appendChild(costContainer)
        this.div.appendChild(name)
        if (this.quantity > 1) {this.div.appendChild(quantity)}
        this.div.appendChild(this.hoverDiv)


    }


}