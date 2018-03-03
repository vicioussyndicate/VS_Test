

class App {

    constructor() {

        this.ui = new UI()
        this.ui.showLoader()

        this.path = {
            window: null,
            hsFormat: 'Standard',
            windowIdx: 0,
            mode: '',
            ranks: 'all',
            time: 'last2Weeks',
            arch: null,
        }

        this.fb_db = null
        this.fb_loggedIn = false
        this.phase = 0 // loading phase
        this.setupFirebase()

        document.querySelector('.refreshArrow').addEventListener('click', this.reload.bind(this))
    } // constructor



    setupFirebase() {
        this.fb_config = {
            apiKey: "AIzaSyAt0uIAVOFjB42_bkwrEIqhSWkMT_VmluI",
            authDomain: "data-reaper.firebaseapp.com",
            databaseURL: "https://data-reaper.firebaseio.com",
            projectId: "data-reaper",
            storageBucket: "data-reaper.appspot.com",
            messagingSenderId: "1079276848174"
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(this.fb_config);
            this.fb_db = firebase.database()
        }

        let auth = firebase.auth()
        let promise = auth.signInWithEmailAndPassword(login.email, login.pw);

        promise.then(user => {

            if (this.ui.loggedIn) {return}
            if (user) {
                this.ui.loggedIn = true
                let ref = this.fb_db.ref('premiumUsers/'+user.uid)
                ref.on('value', d => {  if ( !d.val() && PREMIUM ) { console.log('PERMISSION ERROR',d.val()) }
                                        this.load(0)
                                     }, 
                                e => console.log('Could not load User Data',e)
                        )
            } else {
                console.log('not logged in')
                this.ui.loggedIn = true
                this.load(0)
            }
        })
    } // setup Firebase



    load(phase) {

        let callback = function () {}
        switch (phase) {
            case 0:
                callback = function () { app.load(1) }
                this.ui.ladderWindow = new LadderWindow(callback)
                this.ui.tableWindow = new TableWindow(callback)
                this.ui.infoWindow = new InfoWindow(callback)
                break

            case 1:
                if ( !this.ui.tableWindow.fullyLoaded || !this.ui.ladderWindow.fullyLoaded) {return}
                this.phase = 1
                this.path.window = this.ui.ladderWindow
                this.ui.display('ladderWindow')

                callback = function () { app.load(2) }
                this.ui.powerWindow = new PowerWindow(callback)
                this.ui.decksWindow = new DecksWindow(callback)
                break

            case 2:
                this.phase = 2
                console.log('loaded')
                break
        }
    } // load



    reload() {
        
        //this.path = this.ui.path
        //this.setupFirebase()
    }

}