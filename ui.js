



class UI {

    constructor () {

        this.tabs = document.querySelectorAll('button.tab');
        this.windows = document.querySelectorAll('.tabWindow');
        this.folderButtons = document.querySelectorAll('.folder-toggle');
        this.loader = document.getElementById('loader')

        this.activeTab =    document.querySelector('.tab#ladder')
        this.activeWindow = document.querySelector('#ladderWindow')
        this.openFolder = null

        for(let i=0;i<this.tabs.length;i++) { this.tabs[i].addEventListener("click", this.toggleTabs.bind(this)) }
        for(let i=0;i<this.folderButtons.length;i++) { this.folderButtons[i].addEventListener("click", this.toggleDropDown.bind(this)) }

        this.renderTabs()
        this.renderWindows()
    } // close constructor


    toggleDropDown(e) {
        var siblings = e.target.parentElement.childNodes
        var dd_folder = siblings[3] // !!

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

    renderTabs() {
        for (var tab of this.tabs) {
            if (tab != this.activeTab) {tab.classList.remove('highlighted')}
            else {tab.classList.add('highlighted')}
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





















