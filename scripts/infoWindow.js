class InfoWindow {
    
    constructor(callback) {

        this.div = document.querySelector('#infoWindow')
        this.tab = document.querySelector('#info.tab')
        this.infoText = document.querySelector('#infoWindow .content .infoText')
        this.twitterFeed = document.querySelector('#infoWindow .content .twitterDiv')
        this.mode = 'info' // [info, twitter]
        this.text =`
                Greetings and thank you for checking out the VS Live Beta!<br><br>

                    Update 2.0 (01-04-2018):<br><br>

                    - New Power Score plot in the overview tab.<br>
                    - You can now change the color scheme in the Matchups tab.<br>
                    - Added meta simulation tool for Premium users in the Matchups tab.<br>
                    - Reworked Deck tab. Includes a deck comparison feature and a dust vs winrate plot.<br>
                    - Embeded the vicious syndicate twitter feed into the info tab.<br>
                    - App now loads less data on first load.<br>
                    - App now updates dynamically. Last update time shown in the top right corner.<br>
                    - App now has a somewhat workable mobile version.<br>
                    - Udates to lots of interface elements (new icons/ text/ colors etc.)<br>
                    - Fixes to bugs and "features".<br><br>


                    Update 16-12-2017:<br><br>
                    - App refresh button in the top right corner added<br>
                    - Chose color theme for the matchup table added<br>
                    - Outdated archetypes no longer show in the overview page<br>
                    - Fixed win rates in the win rates page when data is insufficient<br>
                    - Simulation tool in Matchup tab (VS Gold only)<br><br>

                    Update 1-3-2018:<br><br>
                    - Loading only data needed<br>
                    - Decks now show counters and best matchups<br>
                    - Decks features a Dust vs Winrate plot<br>
                    - VS Power Score in the Overview tab (map icon)<br>
                    - New icons / wordings<br><br>

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