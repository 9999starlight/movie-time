// create form

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

/*firebase*/

auth.onAuthStateChanged(user => {
    // kada je loged in
    if (user) {
        db.collection('movies').onSnapshot(snapshot => {
            //zovem ovo da renderuje ako je user logovan, tj. poziva setUpmovies funkciju iz display.js
            setupMovies(snapshot.docs);
            setupUI(user); // poziva funkciju iz display.js šta da prikaže od linkova
        }, err => console.log(err.message)); // da uhvati grešku u konzoli
        //console.log('user logged in: ', user);
    } else { // kada nije logovan da bude prazan data array iz funkcije setUpmovies()
        setupUI(); // poziva funkciju iz display.js šta da prikaže od linkova, ovde bez parametra jer nije logovan
        setupMovies([]);
        //console.log('user logged out');
    }
})

function addMovieToList(movie) {
    let user = firebase.auth().currentUser;
    if (!user) {
        alert('You have to login or signup to add movie to your list!')
    }
    // proveri da li je film već dodat i display forme
    checkIds = true;
    const movieIds = document.querySelectorAll('.film-id');
    for (var i = 0; i < movieIds.length; i++) {
        if (movieIds[i].innerText == movie.movieID) {
            checkIds = false;
        }
    }
    console.log(checkIds)
    if (checkIds == false) { 
        alert('you have already added that item to your list')
        return;
    }
    checkIds = false;
    if (checkIds = true) {
        open(addNew)
        container.classList.add('darken')
        inputTitle.value = movie.title;
        inputType.value = movie.type;
        inputYear.value = movie.year;
        inputGenre.value = movie.genre;
        inputImdbRate.value = movie.imdbRating;
        inputFilmId.value = movie.movieID;
        imdbLink.value = movie.imdbLink;
    } 
    }

// CREATE NEW MOVIE
// funkcija za submit form u db.
function saveNewMovie(e) {
    e.preventDefault();
    let user = firebase.auth().currentUser;// da se doda id dole, ko je dodao film
        // idem na kolekciju koja mi treba, metod add() u koji stavljam objekat koji dodajem. Ovde su values iz forme u []. 
        db.collection('movies').add({
            title: inputTitle.value,
            type: inputType.value,
            year: inputYear.value,
            genre: inputGenre.value,
            imdbRate: inputImdbRate.value,
            filmID: inputFilmId.value,
            myRating: myRating.value,
            comment: comment.value,
            imdbLink: imdbLink.value,
            usersid: user.uid // dodala da se identify ko je dodao
        }).then(() => { // ne treba parametar jer dodajem
            // resetovanje forme
            inputTitle.value = '';
            inputType.value = '';
            inputYear.value = '';
            inputGenre.value = '';
            inputImdbRate.value = '';
            inputFilmId.value = '';
            myRating.value = '';
            comment.value = '';
            imdbLink.value = '';
            container.classList.remove('darken');
            open(content);
            close(addNew);
            closeModal(moreInfo);
            alert('added to your list')
        }).catch(err => {
            console.log(err.message);
        });
}
createForm.addEventListener('submit', saveNewMovie)
   

// SIGNUP
// hvatam FORMU u const gore
// listener na submit forme. Prevent default da se ne bi strana refresh jer je to po defaultu i time bi nestao modal. 
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get user info. Hvatam polja upisane e-mail adrese i passworda. hvatam value iz input polja iz signup forme. Pasword mora biti minimum 6 karaktera da bi radio! Uradi valid!!!
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user. Metod sa auth constantom - createUser....(ovde parametri šta uzimam: varijable za email i password). Ovo je asinhrono, vraća promise zato .then i u njegov parametar user credential (cred). 
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user);
        //kada se reši dobijam token za usera. U konzoli je user objekat sa podacima(samo sa cred. Sa cred.user pokaže odmah). Na konzoli u ff stoje podaci za tog usera i ff generiše user id. Dodajem return... da pravim novu collection automatski sa doc(user id koji je autocreated).setI({setujem property comm: hvatanje podatka iz forme na submit - signupForm['signup-comm'].value}). Dakle kreiram usera, hvatam id i stavljam usera u user collection
        return db.collection('users').doc(cred.user.uid).set({
            comm: signupForm['shortComment'].value
        });
    }).then(() => {
        // close the signup modal & reset form. 
        close(signUpFormM)
        // resetovanje forme, čišćenje polja
        signupForm.reset();
        // ukoliko je greška u unosu
        signupForm.querySelector('.error').innerHTML = ''
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    });
});

// LOGOUT. Klik na link logout okida funkciju.. Hvatam a iz navbara:
const logout = document.querySelector('#logoutLink');
// listener klik
logout.addEventListener('click', (e) => {
    e.preventDefault(); // zbog reseta
    //opeth auth const metod signOut() ne mora da se ubacuje user parametar jer je već sign up i on automatski logout usera koji je logovan. Opet je asinc pa vraća promise .then u koji stavljam poruku da je user logout, naravno mogu popup u vezi toga ili span koji se pojavi i nestane za nekoliko sekundi. posle signOut() se sve može i izbrisati jer funkcija onAuthChanged() kontroliše da li je user in ili out
    alert('user logged out');
    auth.signOut().then(() => {
        console.log('user signed out');
    })
});

// LOGIN
// hvatam formu za login i kačim submit listener:

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get user info. Iz dva inputa u formi hvatam podatke. const su lokalne u svojim funkcijama
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log the user in. Opet auth const metod signIn....(parametri za login email i password). Isto kao i prethodni metodi async. cred za user info.
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        console.log(cred.user);
        // očisti i reset.
        close(loginFormM)
        loginForm.reset();
        // ukoliko je greška u unosu
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });
});
