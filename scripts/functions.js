// global selectors
const inputTitle = document.querySelector('#inputTitle');
const inputType = document.querySelector('#inputType');
const inputYear = document.querySelector('#inputYear');
const inputGenre = document.querySelector('#inputGenre');
const inputImdbRate = document.querySelector('#inputImdbRate');
const inputFilmId = document.querySelector('#inputFilmId');
const imdbLink = document.querySelector('#imdbLink');
const myRating = document.querySelector('#myRating');
const comment = document.querySelector('#comment');
const loginForm = document.querySelector('#login-form')
const signupForm = document.querySelector('#signup-form');
const createForm = document.querySelector('#create-form');

// adding firebase auth: if user signed in call functions for display links and list. Empty array from displayMovieList if user is signed out
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('movies').onSnapshot(snapshot => {
            displayMovieList(snapshot.docs);
            displayLinks(user);
        }, err => console.log(err.message));
    } else {
        displayLinks();
        displayMovieList([]);
    }
})

// adding movie to the list, display form for submit new movie if it's not already added
function addMovieToList(movie) {
    let user = firebase.auth().currentUser;
    if (!user) {
        openWarn()
        warnInfo.innerText = `You have to login or signup to add movie to your list!`
    }
    // check if movie has already added and display form
    let checkIds = true;
    const movieIds = document.querySelectorAll('.film-id');
    for (var i = 0; i < movieIds.length; i++) {
        if (movieIds[i].innerText == movie.movieID) {
            checkIds = false;
        }
    }
    if (checkIds == false) { 
        openWarn()
        warnInfo.innerText = `You have already added that item to your list`
        return;
    }
    checkIds = false;
    if (checkIds = true && user) {
        open(addNew)
        container.classList.add('darken')
        inputTitle.innerText = movie.title;
        inputType.innerText = movie.type;
        inputYear.innerText = movie.year;
        inputGenre.innerText = movie.genre;
        inputImdbRate.innerText = movie.imdbRating;
        inputFilmId.innerText = movie.movieID;
        imdbLink.innerText = movie.imdbLink;
    } 
    }

// save new Movie - submit form to firebase db, reset form for new entry
function saveNewMovie(e) {
    e.preventDefault();
    let user = firebase.auth().currentUser;
        db.collection('movies').add({
            title: inputTitle.innerText,
            type: inputType.innerText,
            year: inputYear.innerText,
            genre: inputGenre.innerText,
            imdbRate: inputImdbRate.innerText,
            filmID: inputFilmId.innerText,
            myRating: myRating.value,
            comment: comment.value,
            imdbLink: imdbLink.innerText,
            usersid: user.uid
        }).then(() => {
            createForm.reset();
            container.classList.remove('darken');
            open(main);
            close(addNew);
            closeModal(moreInfo);
            openSuccess()
            succInfo.innerText = `Added to your list`
        }).catch(err => {
            console.log(err.message);
        });
}
createForm.addEventListener('submit', saveNewMovie)
   
// SIGNUP - on submit; prevent refresh; get user info from input fields; 
// firebase createUser... method; users credentials to get user's token and generate user's id; add new user in user collection in Firebase. Errors, close and reset form
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        //console.log(cred.user);
        return db.collection('users').doc(cred.user.uid).set({
            comm: signupForm['shortComment'].value
        });
    }).then(() => {
        close(signUpFormM)
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = ''
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    });
});

// LOGOUT - prevent refresh; auth.signOut() Firebase method; close user's list
const logout = document.querySelector('#logoutLink');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    close(listDiv)
    auth.signOut().then(() => {
        console.log('user signed out');
    })
});

// LOGIN - values from form. user's credentials; close and reset form; errors
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        //console.log(cred.user);
        close(loginFormM)
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });
});