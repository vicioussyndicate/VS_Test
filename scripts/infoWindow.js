class InfoWindow {
    
    constructor(callback) {

        this.div = document.querySelector('#infoWindow')
        this.tab = document.querySelector('#info.tab')
        this.infoText = document.querySelector('#infoWindow .content .infoText')
        this.text =`
                Greetings and thank you for checking out the VS Live Beta!<br><br>

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
    }

    display(bool) {
        if (bool) {
            this.div.style.display = 'inline-block'
            // check if fully loaded
            // this.plot()

        } else {
            this.div.style.display = 'none'
        }
    }


} // infoWindow