



class UI {

    constructor () {

        this.tabs = document.querySelectorAll('button.tab');
        this.mobileBtns = document.querySelectorAll('button.mobileBtn');
        this.windows = document.querySelectorAll('.tabWindow');
        this.folderButtons = document.querySelectorAll('.folder-toggle');
        this.loader = document.getElementById('loader')
        this.logo = document.querySelector('#vsLogoDiv')
        this.overlayText = document.querySelector('#overlay .overlayText')
        this.infoWindow = document.querySelector('#infoWindow .content .infoText')

        this.getWindowSize()

        this.tabIdx = 0
        this.activeTab =    this.tabs[0]
        this.activeWindow = document.querySelector('#ladderWindow')
        this.openFolder = null
        this.overlay = false
        this.loggedIn = false

        for(var tab of this.tabs) { tab.addEventListener("click", this.toggleTabs.bind(this)) }
        for(var fBtn of this.folderButtons) { fBtn.addEventListener("click", this.toggleDropDown.bind(this)) }

        if (MOBILE) {

            for(var mBtn of this.mobileBtns) { mBtn.addEventListener("click", this.mobileMenu.bind(this)) }
            detectswipe('.navbar',this.swipeTab.bind(this))
            document.querySelector('#ladderWindow .content-header .nrGames').style.display = 'none'
            this.hideLoader()
        }


        this.logo.addEventListener('click', this.toggleOverlay.bind(this))
        document.querySelector('#overlay').addEventListener('click', this.toggleOverlay.bind(this))


        window.addEventListener('orientationchange', this.getWindowSize.bind(this));
        window.addEventListener('resize', this.getWindowSize.bind(this))

        this.infoWindow.innerHTML = infoWindowText

        this.renderTabs()
        this.renderWindows()
        this.toggleOverlay()
    } // close constructor

    getWindowSize() {
        this.width = parseInt(Math.max(document.documentElement.clientWidth, window.innerWidth || 0))
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        if (MOBILE) {
            if (this.height/this.width >= 1) {MOBILE = 'portrait'}
            else {MOBILE = 'landscape'}
        }
    }


    swipeTab(e,d) {
        if (d == 'r') {
            this.tabIdx -= 1
            if (this.tabIdx < 0) {this.tabIdx = this.tabs.length -1}
        }
        if (d == 'l') {
            this.tabIdx += 1
            if (this.tabIdx >= this.tabs.length) {this.tabIdx = 0}
        }

        this.activeTab = this.tabs[this.tabIdx]
        this.activeWindow = document.getElementById(this.activeTab.id+'Window')
        this.renderTabs()
        this.renderWindows()
    }



    toggleDropDown(e) {
        
        var nextSibling = e.target.nextElementSibling 
        var count = 0
        while (nextSibling != null) { if (nextSibling.classList.contains('dropdown') || count > 10) {break}; count += 1; nextSibling = nextSibling.nextElementSibling }
        if (nextSibling == null) {return}
        
        if (nextSibling == this.openFolder) {this.openFolder = null}
        else if (this.openFolder != null) {
            this.openFolder.classList.toggle('hidden');
            this.openFolder = nextSibling
        }

        nextSibling.classList.toggle('hidden')
    }

    mobileMenu(e) {
        console.log('mobile menu')
        var btn = e.target
        for (var tab of this.tabs) {
            if (tab.id == btn.id) {
                this.activeTab = tab
                this.activeWindow = document.getElementById(tab.id+'Window')
                this.renderTabs()
                this.renderWindows()
            }
        }       
    }


    toggleTabs (e) {

        this.activeTab = e.target
        this.activeWindow = document.getElementById(e.target.id+'Window')

        this.renderTabs()
        this.renderWindows()

    }

    deckLink(arch, hsFormat) {
        this.activeTab = document.querySelector('.navbar #decks.tab')
        this.activeWindow = document.getElementById('decksWindow')
        this.renderTabs()
        this.renderWindows()        
        decksWindow.deckLink(arch, hsFormat)
    }

    renderTabs() {
        for (var tab of this.tabs) {
            if (tab != this.activeTab) {tab.classList.remove('highlighted')}
            else {tab.classList.add('highlighted')}

            if (MOBILE && tab.classList.contains('highlighted')) {tab.style.display = 'inline'}
            if (MOBILE && !tab.classList.contains('highlighted')) {tab.style.display = 'none'}
        }
    }

    renderWindows() {
        for (var w of this.windows) {
            if (w != this.activeWindow) {w.style.display = 'none'}
            else {w.style.display = 'inline-block'}
        }
    }

    showLoader() { this.loader.style.display = 'block' }
    hideLoader() { this.loader.style.display = 'none' }

    toggleOverlay() {
        this.overlayText.innerHTML = PREMIUM ?  overlayText2 : overlayText1
        if (this.overlay) {document.getElementById("overlay").style.display = "none"; this.overlay = false}
        else {
            document.getElementById("overlay").style.display = "block"; 
            this.overlay = true
            //document.querySelector('#overlay #basicBtn').addEventListener('click',reloadBasic)
            //document.querySelector('#overlay #premiumBtn').addEventListener('click',reloadPremium)
        }
    }

    

} // close UI




const overlayText1 = `

<span style='font-size:180%;padding-left:2rem'>Greetings Travelers,</span><br><br><br>

Welcome to the VS Live web app where you can explore the newest Hearthstone data and find 

out about frequency and win rates of your favorite decks.<br><br>

To get more information on the current tab simply click on the 

    <div class='fa fa-question-circle' style='display:inline-block'></div>

icon in the top right corner.<br><br>

Upgrade to vS Gold to visit the gold version of this app. Check the link more inforomation:<br><br><br>

<button id='basicBtn'>BASIC</button>
<img src='Images/arrow.png' class='arrow'>
<a href="https://www.vicioussyndicate.com/membership/ad-free-viewing/" target="_blank">
<button id='premiumBtn'>GOLD</button>
</a>

<br><br><br>

To give feedback simply click on the discord link below:<br><br><br>

<a href="https://discordapp.com/channels/147167584666517505/147167584666517505"
   target="_blank"><img class='redditLogo' src="Images/discordLogo.png"></a><br><br>

`


const overlayText2 = `

<span style='font-size:180%;padding-left:2rem'>Greetings Travelers,</span><br><br><br>

Welcome to the VS Live web app where you can explore the newest Hearthstone data and find 

out about frequency and win rates of your favorite decks.<br><br>

To get more information on the current tab simply click on the 

    <div class='fa fa-question-circle' style='display:inline-block'></div>

icon in the top right corner.<br><br>

Thank you for using vS Live Gold.

<br><br><br>

To give feedback simply click on the discord link below:<br><br><br>

<a href="https://discordapp.com/channels/147167584666517505/147167584666517505"
   target="_blank"><img class='redditLogo' src="Images/discordLogo.png"></a><br><br>


`


const infoWindowText = `

Greetings and thank you for checking out the VS Live Beta!<br><br>

To give feedback simply click on the discord link below:<br><br><br>

<a href="https://discordapp.com/channels/147167584666517505/147167584666517505"
   target="_blank"><img class='redditLogo' src="Images/discordLogo.png"></a><br><br>
`





