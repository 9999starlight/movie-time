const loginLink = document.querySelector('#loginLink')
const signUpLink = document.querySelector('#signUpLink')
const loginFormM = document.querySelector('.login')
const signUpFormM = document.querySelector('.signup')
const addNew = document.querySelector('.add-new')
const movieList = document.querySelector('#list');
const accountDetails = document.querySelector('.account');


// open and close functions
const open = (item) => item.style.display = 'flex';
const close = (item) => item.style.display = 'none';
// opening-closing login, signup & create forms
const openLogin = (e) => {
    e.preventDefault();
    open(loginFormM);
    close(signUpFormM);
}

const openSignup = (e) => {
    e.preventDefault();
    open(signUpFormM);
    close(loginFormM);
}
loginLink.addEventListener('click', openLogin);
signUpLink.addEventListener('click', openSignup);
document.querySelector('#loginX').addEventListener('click', function(){close(loginFormM)
});
document.querySelector('#signupX').addEventListener('click', function(){close(signUpFormM)
});

const closeAddNew = () => {
    close(addNew);
    container.classList.remove('darken');
}
document.querySelector('#cancelCreate').addEventListener('click', closeAddNew);




// DOM - hvatam ul gde ću renderovati li: movieList gore
// šta da mi prikazuje u zavisnosti od statusa. Selektujem sve gde je prikaz za linkove u meniju za login i logout da se prikažu ili ne. Sve linkove po defaultu staviti da se display none u style da se ne bi pojavljivali na refresh. kada je logged in ili out za funkciju setupUI():

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
// Poziva se iz auth.onStateChanged funkcije. User kao parametar i provera da li je in ili out. Ovo je za linkove za login i logout da se prikažu ili ne:
const setupUI = (user) => {
  if (user) { // ako je logovan: VIDI ŠTA STAVITI DA SE DISPLAY!!!
    db.collection('users').doc(user.uid).get().then(doc => {
        const detailsInfo = `
        <div class = "flex">Logged in user: ${user.email}</div>
      `;
      accountDetails.innerHTML = detailsInfo;
    });
    // display linkova. Za svaki item:
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else { // ako nije logovan
// očisti
    accountDetails.innerHTML = '';
    // prikaz linkova
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};


// SETUP MOVIES. uzima data koje dobija iz funkcije u auth.js i render ga u ul. Ovu funkciju zovem da doda film iz api i da prikaže poruku ako user nije logovan.

// OVDE STAVITI DA SE PRIKAZUJU SAMO USERS'S LIST?

const setupMovies = (data) => {
  let user = firebase.auth().currentUser;// da se doda id dole, ko je dodao film
  // ako ima data tj. ako je logovan user prikaži:
  if (data.length) {
      let output = '';
      data.forEach(doc => {
        // hvatam doc iz baze. konstanta za svaki item. šaljem pre toga podatke u bazu iz apija koji je added.
        const film = doc.data();
        // dodala sam ovaj if da vidi samo svoju listu
        if (film.usersid == user.uid) {
          const li = `
      <li id = '${doc.id}'>
        <div class="movieLiDiv flex"><h3>${film.title}</h3><h4>type: ${film.type}</h4><h4>year: ${film.year}</h4>
        </div>
        <div class="show-more"><h4>genre: ${film.genre}</h4><h4>imdb rating: ${film.imdbRate}
        <h4>${film.filmID}</h4><h4>my rating: ${film.myRating}</h4><p>comment: ${film.comment}</p>
        <button class = "btnAddInfo radius" id = "btnAddInfo" title = "Click for more info">More</button>
        <i class="far fa-trash-alt"></i>
        </div>
      </li>
    `;
          output += li;
          //console.log(film.usersid)
          //console.log(user.uid)
          console.log(film)
        }
      });
    movieList.innerHTML = output
    // delete movie function
    const dlt = document.querySelectorAll('.fa-trash-alt')
    dlt.forEach(dl => {
      dl.addEventListener('click', (e) => {
        //e.stopPropagation();
        let id = e.target.parentElement.parentElement.getAttribute('id');
        db.collection('movies').doc(id).delete();
        alert('deleted!')
    })
});
    } 
 
    else {// ako nema data tj. ako nije logovan user prikaži poruku:
      movieList.innerHTML = '<h5 class="flex">Login to see your list</h5>';
    }
};
console.log(movieList)

/*
funkcija za alert messages da se prikazuje sa timeout:
const infoMessage = document.querySelector('.infoMessage');
open(infoMessage);
setTimeout(function(){
  close(infoMessage);
}, 3000);

*/
