



function setupFirebase() {
    var config = {
        apiKey: "AIzaSyAt0uIAVOFjB42_bkwrEIqhSWkMT_VmluI",
        authDomain: "data-reaper.firebaseapp.com",
        databaseURL: "https://data-reaper.firebaseio.com",
        projectId: "data-reaper",
        storageBucket: "data-reaper.appspot.com",
        messagingSenderId: "1079276848174"
    };
    //console.log(firebase)
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
        DATABASE = firebase.database()
    }
    const auth = firebase.auth()
    //const promise = auth.signInAnonymously() //auth.signInWithEmailAndPassword('vsProUser@vs.com','pw12345');

    const promise = auth.signInWithEmailAndPassword(login.email, login.pw);

    // const emailTxt = document.getElementById('emailInput')
    // const passwordTxt = document.getElementById('passwordInput')
    // const loginBtn = document.getElementById('loginBtn')
    // const logOutBtn = document.getElementById('logOutBtn')
    // const signupBtn = document.getElementById('signUpBtn')
    // const errorMsg = document.getElementById('loginErrorMsg')




    // loginBtn.addEventListener('click', e => {
    //     const email = emailTxt.value
    //     const password = passwordTxt.value
    //     const auth = firebase.auth()

    //     const promise = auth.signInWithEmailAndPassword(email,password);
    //     promise.catch(e => {console.log(e.message); errorMsg.innerHTML = 'Username or Password incorrect'})
    // });



    // signUpBtn.addEventListener('click', e => {
    //     const email = emailTxt.value
    //     const password = passwordTxt.value
    //     const auth = firebase.auth()

    //     const promise = auth.createUserWithEmailAndPassword(email,password);
    //     promise.then(user => saveUser(user))
    //     promise.catch(e => {console.log(e.message); errorMsg.innerHTML = 'invalid email'})
    // });



    // logOutBtn.addEventListener('click', e => { firebase.auth().signOut() });


    promise.then(user => {
    //firebase.auth().onAuthStateChanged(user => {

        if (ui.loggedIn) {return}
        //console.log('User logged in: '+ (performance.now()-t0).toFixed(2)+' ms')


        if (user) {
            //console.log('user logged in:',user)
            ui.loggedIn = true
            
            
            var ref = DATABASE.ref('premiumUsers/'+user.uid)
            ref.on('value',     d => {
                if(!d.val() && PREMIUM) {console.log('PERMISSION ERROR',d.val())}
                loadFireData()}, e => console.log('Could not load User Data',e))
            console.log('user login '+(performance.now()-t0).toFixed(2)+' ms, Premium:',PREMIUM)
            // logOutBtn.classList.remove('hidden')
            // signUpBtn.classList.add('hidden')
            // loginBtn.classList.add('hidden')
            // errorMsg.innerHTML = ''
        } else {
            console.log('not logged in')
            ui.loggedIn = true
            // logOutBtn.classList.add('hidden')
            // loginBtn.classList.remove('hidden')
            // signUpBtn.classList.remove('hidden')
            //PREMIUM = false
            loadFireData()
        }
    })
};




function saveUser(user) {
    console.log(user)
    firebase.database().ref('users/'+user.uid).set({
        username: user.displayName,
        email: user.email,
        status: 'premium',
    });

    var userRole = {}
    userRole[user.uid] = true
    firebase.database().ref('premiumUsers').set(userRole);
}


function loadFireData() {
    if (PREMIUM) {
        console.log('load Premium')
        ladderWindow = new LadderWindow(hsFormats, ladder_times_premium, ladder_ranks_premium)
        tableWindow = new TableWindow(hsFormats, table_times_premium, table_ranks_premium, table_sortOptions_premium)
    } else {
        console.log('load basic')

        //PREMIUM = false
        ladderWindow = new LadderWindow(hsFormats, ladder_times, ladder_ranks)
        tableWindow = new TableWindow(hsFormats, table_times, table_ranks, table_sortOptions)
    }

}