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
    // toggle user UI elements. Za svaki item:
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else { // ako nije logovan
// clear account info u popup accountDetails
    accountDetails.innerHTML = '';
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};


// SETUP MOVIES. uzima data koje dobija iz funkcije u auth.js i render ga u ul. Ovu funkciju bih morala verovatno da zovem da doda film iz api i da prikaže poruku ako user nije logovan.
const setupMovies = (data) => {
  // ako ima data tj. ako je logovan user prikaži:
  if (data.length) {
    let output = '';
    data.forEach(doc => {
      // hvatam doc iz baze. konstanta za svaki item. šaljem pre toga podatke u bazu iz apija koji je added.
      const film = doc.data();
      const li = `
      <li>
        <div class="movieLiDiv"><h3>${film.title}</h3><h4>${film.type}</h4><h4>${film.year}</h4></div>
        <div class="show-more"><h4>${film.genre}</h4><h4>${film.imdbRate}
        <h4>${film.filmID}</h4><h4>${film.myRating}</h4><p>${film.comment}</p></div>
      </li>
    `;
      output += li;
    });
    movieList.innerHTML = output
  } else {// ako nema data tj. ako nije logovan user prikaži poruku:
      movieList.innerHTML = '<h5 class="flex">Login to view movies</h5>';
  }
};
console.log(movieList)