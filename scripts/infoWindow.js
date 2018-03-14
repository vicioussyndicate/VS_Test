class InfoWindow {
    
    constructor(callback) {

        this.div = document.querySelector('#infoWindow')
        this.tab = document.querySelector('#info.tab')
        this.infoText = document.querySelector('#infoWindow .content .infoText')
        this.twitterFeed = document.querySelector('#infoWindow .content .twitterDiv')
        this.mode = 'info' // [info, twitter]
        this.text =`
                Greetings and thank you for checking out the vS Live!<br><br>

                    Update 2018-03-01:<br><br>
                    - Loading only data needed<br>
                    - Decks now show counters and best matchups<br>
                    - Decks features a Dust vs Winrate plot<br>
                    - vS Power Score in the Overview tab (map icon)<br>
                    - New icons / wordings<br><br>

                    Update 2017-12-16:<br><br>
                    - App refresh button in the top right corner added<br>
                    - Chose color theme for the matchup table added<br>
                    - Outdated archetypes no longer show in the overview page<br>
                    - Fixed win rates in the win rates page when data is insufficient<br>
                    - Simulation tool in Matchup tab (vS Gold only)<br><br>

                   To give feedback simply click on the discord link below:<br><br>
                   
                <a href=${DISCORDLINK}
                   target="_blank"><img class='discordLogo' src="Images/discordLogo.png"></a><br><br>
                `
    
        this.infoText.innerHTML = this.text
        this.setupUI()
    }

    setupUI() {
        this.infoBtn = document.querySelector('#infoWindow .content-header #info.optionBtn')
        this.twitterBtn = document.querySelector('#infoWindow .content-header #twitter.optionBtn')

        this.buttons = [this.infoBtn, this.twitterBtn]
        for (let btn of this.buttons) { btn.onclick = this.buttonTrigger.bind(this) }
        this.renderOptions()
    }

    buttonTrigger(e) {
        let btnID = e.target.id
        // console.log(btnID,e)
        this.mode = btnID
        this.plot()
    }


    renderOptions() {
        for (let btn of this.buttons) { btn.classList.remove('highlighted') }
        switch(this.mode) {
            case 'info':
                this.infoBtn.classList.add('highlighted')
                break
            case 'twitter':
                this.twitterBtn.classList.add('highlighted')
                break
        }
    }

    display(bool) {
        if (bool) {
            this.div.style.display = 'inline-block'
            this.plot()

        } else {
            this.div.style.display = 'none'
        }
    }

    plot() {
        switch(this.mode) {
            case 'info':
                this.infoText.style.display = 'block'
                this.twitterFeed.style.display = 'none'
                break

            case 'twitter':
                this.infoText.style.display = 'none'
                this.twitterFeed.style.display = 'block'
                break
        }
        this.renderOptions()
    }

} // infoWindow
