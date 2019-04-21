const loginLink = document.querySelector('#loginLink')
const signUpLink = document.querySelector('#signUpLink')
const loginFormM = document.querySelector('.login')
const signUpFormM = document.querySelector('.signup')
const addNew = document.querySelector('.add-new')
const movieList = document.querySelector('#list');
const accountDetails = document.querySelector('.account');
const spinner = document.querySelector('#spinner');
const listDiv = document.querySelector('.list');
function showSpinner() {
  spinner.className = "show";
  setTimeout(() => {
    spinner.className = spinner.className.replace("show", "");
  }, 60000);
}

 function hideSpinner() {
 spinner.className = spinner.className.replace("show", "");
 }

// open and close functions
const open = (item) => item.style.display = 'flex';
const close = (item) => item.style.display = 'none';

//alerts
const alertWarn = document.querySelector('.alertWarn');
const alertSuccess = document.querySelector('.alertSuccess');
const warnInfo = document.querySelector('#warnInfo')
const succInfo = document.querySelector('#succInfo')

function openWarn(){
  open(alertWarn);
  setTimeout(function(){
    close(alertWarn);
    warnInfo.innerText = '';
  }, 4000);
}
function openSuccess(){
  open(alertSuccess);
  setTimeout(function(){
    close(alertSuccess);
    succInfo.innerText = '';
  }, 4000);
}

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

document.querySelector('#okWarn').addEventListener('click', function(){close(alertWarn)
});
document.querySelector('#okSuccess').addEventListener('click', function(){close(alertSuccess)
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
    open(listDiv)
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
        <div class="movieLiDiv flex">
        <h3>${film.title}</h3><h4>type: ${film.type}</h4><h4>year: ${film.year}</h4><h4>genre: ${film.genre}</h4>
        </div>
        <div class="show-more">
        <span>My rating:</span>
        <input type="number" value="${film.myRating}" id="ratingLi" title="Enter number between 1 and 10" min="1" max="10" placeholder = "0">
        <h4>IMDB rating: ${film.imdbRate}</h4>
        <a href = ${film.imdbLink} target = '_blank' class = "block hoverTr">IMDB details</a>
        <h4 class = "film-id">${film.filmID}</h4>
        </div>
        <div class = "text flex">
        <textarea id = "commentLi" placeholder = "Edit yor comment and click save icon to change it" title = "Edit yor comment and click save icon to change it" maxlength="200">${film.comment}</textarea>
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


    // delete movie function
    const dlt = document.querySelectorAll('.fa-trash-alt')
    dlt.forEach(dl => {
      dl.addEventListener('click', (e) => {
        //e.stopPropagation();
        let id = e.target.parentElement.parentElement.getAttribute('id');
        db.collection('movies').doc(id).delete();
        openSuccess()
        succInfo.innerText = `List item removed!`
      })
    });
   
    //SAVE COMMENT & rating CHANGES
    const saveIcon = document.querySelectorAll('.fa-save')
    saveIcon.forEach(si => {
      si.addEventListener('click', (e) => {
        let id = e.target.parentElement.parentElement.getAttribute('id');
        let commentEdit = e.target.parentElement.previousElementSibling.childNodes[1]
        let ratingLi = e.target.parentElement.previousElementSibling.previousElementSibling.childNodes[3]
        let numTest = /^(?:[1-9]|0[1-9]|10)$/
        if (!numTest.test(ratingLi.value)) {
          openWarn()
          warnInfo.innerText = `Please enter rating between 1 and 10`
        } else {
          db.collection('movies').doc(id).update({
            comment: commentEdit.value,
            myRating: ratingLi.value
          })
          openSuccess()
          succInfo.innerText = `List item updated!`
        }
    })
  })
    } 
    else {// ako nema data tj. ako nije logovan user prikaži poruku:
      movieList.innerHTML = '<h5 class="flex">Login to see your list</h5>';
    }
};
console.log(movieList)

/*
          class movieLi {
            constructor(titleLi, imdbRtLi, yearLi) {
              this.titleLi = titleLi
              this.imdbRtLi = imdbRtLi
              this.yearLi = yearLi
            }

          }
          listItem = new movieLi(film.title, film.imdbRate, film.year)
          listLi.push(listItem)
          document.querySelector('#btnAbc').addEventListener('click', function () {
            listLi.sort((a, b) => a.yearLi.localeCompare(b.yearLi))
            console.log(listLi)
          })
*/