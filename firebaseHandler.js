



function setupFirebase() {
    var config = {
        apiKey: "AIzaSyCDn9U08D4Lzhrbfz2MSy2rws_D02eH3HA",
        authDomain: "testproject-a0746.firebaseapp.com",
        databaseURL: "https://testproject-a0746.firebaseio.com",
        projectId: "testproject-a0746",
        storageBucket: "testproject-a0746.appspot.com",
        messagingSenderId: "826197220845"
    };
    firebase.initializeApp(config);
    DATABASE = firebase.database()
    


    const emailTxt = document.getElementById('emailInput')
    const passwordTxt = document.getElementById('passwordInput')
    const loginBtn = document.getElementById('loginBtn')
    const logOutBtn = document.getElementById('logOutBtn')
    const signupBtn = document.getElementById('signUpBtn')
    const errorMsg = document.getElementById('loginErrorMsg')




    loginBtn.addEventListener('click', e => {
        const email = emailTxt.value
        const password = passwordTxt.value
        const auth = firebase.auth()

        const promise = auth.signInWithEmailAndPassword(email,password);
        promise.catch(e => {console.log(e.message); errorMsg.innerHTML = 'Username or Password incorrect'})
    });



    signUpBtn.addEventListener('click', e => {
        const email = emailTxt.value
        const password = passwordTxt.value
        const auth = firebase.auth()

        const promise = auth.createUserWithEmailAndPassword(email,password);
        promise.then(user => saveUser(user))
        promise.catch(e => {console.log(e.message); errorMsg.innerHTML = 'invalid email'})
    });



    logOutBtn.addEventListener('click', e => { firebase.auth().signOut() });



    firebase.auth().onAuthStateChanged(user => {

        if (user) {
            console.log('user logged in:',user)

            var ref = DATABASE.ref('users/'+user.uid)
            ref.on('value',function (u) {USER = u.val()}, function () {console.log('Could not load User Data')})
            
            
            logOutBtn.classList.remove('hidden')
            signUpBtn.classList.add('hidden')
            loginBtn.classList.add('hidden')
            errorMsg.innerHTML = ''
        } else {
            console.log('not logged in')
            logOutBtn.classList.add('hidden')
            loginBtn.classList.remove('hidden')
            signUpBtn.classList.remove('hidden')

            USER = undefined
        }

        loadFireData()
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
    if (USER) {
        console.log('load USER',USER.status)
        if (USER.status == 'premium') {
            
            tableWindow = new TableWindow(hsFormats, table_times, table_ranks)
        }

        else if (USER.status == 'contributor') {
            tableWindow = new TableWindow(hsFormats, table_times, table_ranks)
            ladderWindow = new LadderWindow(hsFormats, ladder_times, ladder_ranks)
            decksWindow = new DecksWindow(hsFormats)
        }
    }
    else {
        tableWindow = new TableWindow(hsFormats, table_times, table_ranks)
        ladderWindow = new LadderWindow(hsFormats, ladder_times, ladder_ranks)
        decksWindow = new DecksWindow(hsFormats)
    }

}