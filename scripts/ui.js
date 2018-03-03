



class UI {

    constructor () {

        this.tabs = document.querySelectorAll('button.tab');
        this.mobileBtns = document.querySelectorAll('button.mobileBtn');
        this.windowTabs = document.querySelectorAll('.tabWindow');
        this.folderButtons = document.querySelectorAll('.folder-toggle');
        this.loader = document.getElementById('loader')
        this.logo = document.querySelector('#vsLogoDiv')
        this.overlayText = document.querySelector('#overlay .overlayText')
        
        for (let w of this.windowTabs) { w.style.display = 'none' }
        this.windowTabs[0].style.display = 'inline-block'


        this.getWindowSize()

        this.tabIdx = 0
        this.openFolder = null
        this.overlay = false
        
        this.decksWindow = null
        this.tableWindow = null
        this.ladderWindow = null
        this.powerWindow = null
        this.infoWindow = null

        this.archetypeColors = {}
        for (let f of hsFormats) { 
            this.archetypeColors[f] = {}
            for (let c of hsClasses) { this.archetypeColors[f][c] = {count:0} }
        }


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

        this.toggleOverlay()
    } // constructor

    

    toggleTabs (e) {
        if (app.phase == 0) { return }
        if (e.target != app.path.window.tab) { this.display(e.target.id+'Window') }
    }


    display(windowName) {
        console.log('load',windowName)
        if (this[windowName] == app.path.window) { return }
        if (app.path.window != null) { app.path.window.display(false) }
        app.path.window = this[windowName]
        app.path.window.display(true)
        this.renderTabs()
    }

    deckLink(arch, hsFormat) {
        app.path.arch = arch
        this.display('decksWindow')      
    }

    renderTabs() {
        for (var tab of this.tabs) { tab.classList.remove('highlighted') }
        app.path.window.tab.classList.add('highlighted')

        // if (MOBILE && tab.classList.contains('highlighted')) {tab.style.display = 'inline'}
        // if (MOBILE && !tab.classList.contains('highlighted')) {tab.style.display = 'none'}
    }
    
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

        //this.activeTab = this.tabs[this.tabIdx]
        //this.activeWindow = document.getElementById(this.activeTab.id+'Window')
        //this.renderTabs()
        //this.renderWindows()
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

    

    showLoader() { this.loader.style.display = 'block'}
    hideLoader() { this.loader.style.display = 'none' }

    toggleOverlay() {
        this.overlayText.innerHTML = PREMIUM ?  overlayText2 : overlayText1
        if (this.overlay) {document.getElementById("overlay").style.display = "none"; this.overlay = false}
        else {
            document.getElementById("overlay").style.display = "block"; 
            this.overlay = true
        }
    }

    getArchColor(hsClass, arch, hsFormat) {
        
        if (hsClasses.indexOf(arch) != -1) {return {color:hsColors[arch], fontColor: hsFontColors[arch]}}

        let archName
        if (hsClass) { archName = arch +' '+hsClass }
        else {
            archName = arch;
            for (let c of hsClasses) {if (archName.indexOf(c) != -1) {hsClass = c; break} }
        }

        if (archName in this.archetypeColors[hsFormat]) { return {color: hsArchColors[hsClass][this.archetypeColors[hsFormat][archName]], fontColor: hsFontColors[hsClass] } }
        else {
            this.archetypeColors[hsFormat][archName] = this.archetypeColors[hsFormat][hsClass].count
            let count = this.archetypeColors[hsFormat][hsClass].count
            this.archetypeColors[hsFormat][hsClass].count = (count + 1)%5
            //if (this.archetypeColors[hsFormat][hsClass].count > 4) {this.archetypeColors[hsFormat][hsClass].count = 4}
            let color = hsArchColors[hsClass][this.archetypeColors[hsFormat][archName]]
            return {color: color, fontColor: hsFontColors[hsClass]}
        }
    } // get archColor
} // close UI



const overlayText1 = `

<span style='font-size:200%;font-weight:bold;padding-left:2rem;'>Greetings Travelers,</span><br><br><br>

Welcome to the VS Live web app where you can explore the newest Hearthstone data and find 

out about frequency and win rates of your favorite decks.<br><br>

To get more information on the current tab simply click on the 

    <div class='fa fa-question-circle' style='display:inline-block'></div>

icon in the top right corner.<br><br>

Upgrade to vS Gold to visit the gold version of this app. Check the link more information:<br><br><br>

<button id='basicBtn'>BASIC</button>
<img src='Images/arrow.png' class='arrow'>
<a href=${VSGOLDINFOLINK} target="_blank">
<button id='premiumBtn'>GOLD</button>
</a>

<br><br>

To give feedback simply click on the discord link below:<br><br><br>

<a href=${DISCORDLINK}
   target="_blank"><img class='discordLogo' src="Images/discordLogo.png"></a><br><br>

`


const overlayText2 = `

<span style='font-size:200%;font-weight:bold;padding-left:2rem'>Greetings Travelers,</span><br><br><br>

Welcome to the VS Live web app where you can explore the newest Hearthstone data and find 

out about frequency and win rates of your favorite decks.<br><br>

To get more information on the current tab simply click on the 

    <div class='fa fa-question-circle' style='display:inline-block'></div>

icon in the top right corner.<br><br>

Thank you for using vS Live Gold.

<br><br>

To give feedback simply click on the discord link below:<br><br><br>

<a href=${DISCORDLINK}
   target="_blank"><img class='discordLogo' src="Images/discordLogo.png"></a><br><br>

`








