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


// SETUP MOVIES

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
        <div class="movieLiDiv flex">
        <h3>${film.title}</h3><h4>type: ${film.type}</h4><h4>year: ${film.year}</h4><h4>genre: ${film.genre}</h4>
        </div>
        <div class="show-more">
        <h4>imdb rating: ${film.imdbRate}</h4>
        <h4 class = "film-id">${film.filmID}</h4>
        <h4>my rating: ${film.myRating}</h4>
        <a href = ${film.imdbLink} target = '_blank' class = "block hoverTr">IMDB details</a>
        </div>
        <div class = "text flex">
        <textarea id = "commentLi">My comment: ${film.comment}</textarea>
        </div>
        <div>
        
        <i class="far fa-save hoverTr" title = "SAVE CHANGES"></i>
        <i class="far fa-trash-alt hoverTr" title = "DELETE"></i>
        </div>
      </li>
    `;
          output += li;
        }
      });
    movieList.innerHTML = output

    const dlt = document.querySelectorAll('.fa-trash-alt')
    dlt.forEach(dl => {
      dl.addEventListener('click', (e) => {
        //e.stopPropagation();
        let id = e.target.parentElement.parentElement.getAttribute('id');
        db.collection('movies').doc(id).delete();
        alert('deleted!')
      }) 

    });
    const saveIcon = document.querySelectorAll('.fa-save')

    saveIcon.forEach(si => {
      si.addEventListener('click', (e) => {
        let id = e.target.parentElement.parentElement.getAttribute('id');
        let commentEdit = e.target.parentElement.previousElementSibling.childNodes[1]
        db.collection('movies').doc(id).update({
          comment: commentEdit.value
        })
        alert('saved')
    })
  })
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


