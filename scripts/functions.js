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

/*adding firebase auth*/

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
    console.log(checkIds)
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

// CREATE NEW MOVIE
// funkcija za submit form u db.
function saveNewMovie(e) {
    e.preventDefault();
    let user = firebase.auth().currentUser;// da se doda id dole, ko je dodao film
        // idem na kolekciju koja mi treba, metod add() u koji stavljam objekat koji dodajem. Ovde su values iz forme. Ukoliko je ime key objekta sa crticom ili više reči stavi u [] npr. title: createForm['title-hello'].value
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
            usersid: user.uid // dodala da se identify ko je dodao
        }).then(() => { // ne treba parametar jer dodajem
            // resetovanje forme
            inputTitle.innerText = '';
            inputType.innerText = '';
            inputYear.innerText = '';
            inputGenre.innerText = '';
            inputImdbRate.innerText = '';
            inputFilmId.innerText = '';
            myRating.value = '';
            comment.value = '';
            imdbLink.innerText = '';
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
   

// SIGNUP
// listener na submit forme. Prevent default da se ne bi strana refresh jer je to po defaultu i time bi nestao modal. 
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get user info. Hvatam polja upisane e-mail adrese i passworda. hvatam value iz input polja iz signup forme. Pasword mora biti minimum 6 karaktera da bi radio!
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user. Metod sa auth constantom - createUser....(ovde parametri šta uzimam: varijable za email i password). Ovo je asinhrono, vraća promise zato .then i u njegov parametar user credential (cred). 
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user);
        //kada se reši dobijam token za usera. U konzoli je user objekat sa podacima(samo sa cred. Sa cred.user pokaže odmah). Na konzoli u ff stoje podaci za tog usera i ff generiše user id. Dodajem return... da pravim novu collection automatski sa doc(user id koji je autocreated).setI({setujem property bio: hvatanje podatka iz forme na submit - signupForm['signup-bio'].value}). Dakle kreiram usera, hvatam id i stavljam usera u user collection
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
//kačim listener klik
logout.addEventListener('click', (e) => {
    e.preventDefault(); // zbog reseta
    //opeth auth const metod signOut() ne mora da se ubacuje user parametar jer je već sign up i on automatski logout usera koji je logovan. Opet je asinc pa vraća promise .then u koji stavljam poruku da je user logout, naravno mogu popup u vezi toga ili span koji se pojavi i nestane za nekoliko sekundi. posle signOut() se sve može i izbrisati jer funkcija onAuthChanged() kontroliše da li je user in ili out
    close(listDiv)
    auth.signOut().then(() => {
        console.log('user signed out');
    })
});

// LOGIN
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get user info from form. const su lokalne u svojim funkcijama da ne zbrkam sa onim gore
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log the user in. metod signIn....(parametri za login email i password). Isto kao i prethodni metodi async. cred za user info.
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        console.log(cred.user);
        // close the signup modal & reset form.
        close(loginFormM)
        loginForm.reset();
        // ukoliko je greška u unosu
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });
});

/*
const sortByAbc = (ul) => {
    const liTags = ul.getElementsByTagName('li');
    lis = [...liTags]
    console.log(lis)
    liText = lis.forEach(li => console.log(li.childNodes[1].childNodes[1].innerText))
    //console.log(lis)
    //lis.forEach(li => {
    lis.sort((a, b) => {
        a.childNodes[1].childNodes[1].innerText - b.childNodes[1].childNodes[1].innerText 
    }).forEach(li => ul.appendChild(li));
    //ul.innerHTML = sorted;
    console.log(movieList)
//})
    
    //db.collection('movies').orderBy('title').get().then(snapshot => {
      //  snapshot.docs.forEach(doc => {
            setupMovies(doc);
        //});
    //});
   // console.log(movies) 
}
document.querySelector('#btnAbc').addEventListener('click', function () { sortByAbc(movieList) });
*/