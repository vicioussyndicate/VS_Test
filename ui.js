



class UI {

    constructor () {

        this.tabs = document.querySelectorAll('button.tab');
        this.windows = document.querySelectorAll('.tabWindow');
        this.folderButtons = document.querySelectorAll('.folder-toggle');
        this.loader = document.getElementById('loader')

        this.tabIdx = 0
        this.activeTab =    this.tabs[0] //document.querySelector('.tab#ladder')
        this.activeWindow = document.querySelector('#ladderWindow')
        this.openFolder = null

        for(let i=0;i<this.tabs.length;i++) { this.tabs[i].addEventListener("click", this.toggleTabs.bind(this)) }
        for(let i=0;i<this.folderButtons.length;i++) { this.folderButtons[i].addEventListener("click", this.toggleDropDown.bind(this)) }
        if (MOBILE) {detectswipe('.navbar',this.swipeTab.bind(this))}

        this.renderTabs()
        this.renderWindows()
    } // close constructor


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
        var siblings = e.target.parentElement.childNodes
        var dd_folder = siblings[3] // !! TODO

        //for (s of siblings) { if (s.class = 'dropdown' || s.class == 'dropdown hidden') {dd_folder = s; break} }
        
        if (dd_folder == this.openFolder) {this.openFolder = null}
        else if (this.openFolder != null) {
            this.openFolder.classList.toggle('hidden');
            this.openFolder = dd_folder
        }

        dd_folder.classList.toggle('hidden')
    }



    toggleTabs (e) {

        this.activeTab = e.target
        this.activeWindow = document.getElementById(e.target.id+'Window')

        this.renderTabs()
        this.renderWindows()

    }

    deckLink(arch, hsFormat) {
        this.activeTab = document.querySelector('.navbar #decks')
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

} // close UI







function overlay() {
    if (ui.overlay) {document.getElementById("overlay").style.display = "none"; ui.overlay = false}
    else {document.getElementById("overlay").style.display = "block"; ui.overlay = true}
    
}













