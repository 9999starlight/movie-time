// global selectors
const container = document.querySelector('.container');
const loginLink = document.querySelector('#loginLink');
const signUpLink = document.querySelector('#signUpLink');
const loginFormDiv = document.querySelector('.login');
const signUpFormDiv = document.querySelector('.signup');
const addNew = document.querySelector('.add-new');
const movieList = document.querySelector('#list');
const accountDetails = document.querySelector('.account');
const loader = document.querySelector('#loader');
const listDiv = document.querySelector('.list');
const alertWarn = document.querySelector('.alertWarn');
const alertSuccess = document.querySelector('.alertSuccess');
const warnInfo = document.querySelector('#warnInfo');
const succInfo = document.querySelector('#succInfo');

// show or hide loader
function showLoader() {
  loader.className = "show";
  setTimeout(() => {
    loader.className = loader.className.replace("show", "");
  }, 60000);
}

function hideLoader() {
  loader.className = loader.className.replace("show", "");
}

// openning and closing functions and alerts
const open = (item) => item.style.display = 'flex';
const close = (item) => item.style.display = 'none';

const closeModal = (element) => {
  element.innerHTML = ''
  close(element)
}

function openWarn() {
  open(alertWarn);
  setTimeout(function () {
    close(alertWarn);
    warnInfo.innerText = '';
  }, 4000);
}

function openSuccess() {
  open(alertSuccess);
  setTimeout(function () {
    close(alertSuccess);
    succInfo.innerText = '';
  }, 4000);
}

// opening-closing login, signup & create forms
const openLogin = (e) => {
  e.preventDefault();
  open(loginFormDiv);
  close(signUpFormDiv);
}
loginLink.addEventListener('click', openLogin);

const openSignup = (e) => {
  e.preventDefault();
  open(signUpFormDiv);
  close(loginFormDiv);
}
signUpLink.addEventListener('click', openSignup);

// closing forms and alerts
document.querySelector('#loginX').addEventListener('click', function () {
  close(loginFormDiv)
});
document.querySelector('#signupX').addEventListener('click', function () {
  close(signUpFormDiv)
});

document.querySelector('#okWarn').addEventListener('click', function () {
  close(alertWarn)
});
document.querySelector('#okSuccess').addEventListener('click', function () {
  close(alertSuccess)
});

const closeAddNew = () => {
  close(addNew);
  container.classList.remove('darken');
}
document.querySelector('#cancelCreate').addEventListener('click', closeAddNew);

// hamburger menu
/*
function menuMobile(e) {
  e.preventDefault()
  const nav = document.querySelector("#nav");
  if (nav.style.display == 'none') {
    nav.style.display == 'block'
  } else {
    nav.style.display == 'none'
  }
}
document.querySelector('.fa-bars').addEventListener('click', menuMobile)
*/

// display links - depends on the user status from auth.onStateChanged function
const displayLinks = (user) => {
  const loggedOutLinks = document.querySelectorAll('.logged-out');
  const loggedInLinks = document.querySelectorAll('.logged-in');
  if (user) {
    db.collection('users').doc(user.uid).get().then(doc => {
      const detailsInfo = `
        <div class = "flex">${user.email}</div>
      `;
      accountDetails.innerHTML = detailsInfo;
    });
    open(listDiv)
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    accountDetails.innerHTML = '';
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};

/* taking data from auth, check if user is logged, catching doc from firebase; rendering movieList ul - functions for sorting, saving and deleting list items */
const displayMovieList = (data) => {
  let user = firebase.auth().currentUser;
  if (data.length) {
    let output = '';
    data.forEach(doc => {
      const film = doc.data();
      if (film.usersid == user.uid) {
        const li = `
          <li id = '${doc.id}' class = "item">
            <div class="movieLiDiv flex ctText">
            <h3>${film.title}</h3>
            <h4>type: ${film.type}</h4>
            <h4>year: ${film.year}</h4>
            <h4>genre: ${film.genre}</h4>
            </div>
            <div class="show-more ctText">
            <span>My rating:</span>
            <input type="number" value="${film.myRating}" id="ratingLi" class = "white p10" title="Enter number between 1 and 10" min="1" max="10" placeholder = "0">
            <h4>IMDB rating: <span>${film.imdbRate}</span></h4>
            <a href = ${film.imdbLink} target = '_blank' class = "block hoverTr">IMDB details</a>
            <h4 class = "film-id">${film.filmID}</h4>
            </div>
            <div class = "text flex ctText">
            <textarea id = "commentLi" class = "white p10" placeholder = "Edit yor comment and click save icon to change it" title = "Edit yor comment and click save icon to change it" maxlength="200">${film.comment}</textarea>
            </div>
            <div class = "ctText">
            <i class="far fa-save hoverTr" title = "SAVE CHANGES"></i>
            <i class="far fa-trash-alt hoverTr" title = "DELETE"></i>
            </div>
          </li>
        `;
        output += li;
      }
    });
    movieList.innerHTML = output

    // Sorting list alfabetically
    const lis = movieList.querySelectorAll('.item');
    const sortByAbc = () => {
      movieList.innerHTML = ''
      Array.prototype.map.call(lis, function (node) {
        return {
          node: node,
          titles: node.childNodes[1].childNodes[1].innerText
        };
      }).sort((a, b) => {
        return a.titles.localeCompare(b.titles);
      }).forEach(item => {
        movieList.appendChild(item.node)
      })
    }
    document.querySelector('#btnAbc').addEventListener('click', sortByAbc)

    // SORT LIST BY IMDB RATING
    const sortByRating = () => {
      movieList.innerHTML = ''
      Array.prototype.map.call(lis, function (node) {
        return {
          node: node,
          rate: node.childNodes[3].childNodes[5].childNodes[1].innerText
        };
      }).sort((a, b) => {
        return b.rate.localeCompare(a.rate);
      }).forEach(item => {
        movieList.appendChild(item.node)
      })
    }
    document.querySelector('#btnRate').addEventListener('click', sortByRating)

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

    //SAVE comment & rating changes
    const saveIcon = document.querySelectorAll('.fa-save')
    saveIcon.forEach(si => {
      si.addEventListener('click', (e) => {
        let id = e.target.parentElement.parentElement.getAttribute('id');
        let commentEdit = e.target.parentElement.previousElementSibling.childNodes[1];
        let ratingLi = e.target.parentElement.previousElementSibling.previousElementSibling.childNodes[3];
        let numTest = /^(?:[1-9]|0[1-9]|10)$/;
        if (!numTest.test(ratingLi.value)) {
          openWarn();
          warnInfo.innerText = `Please enter rating between 1 and 10`
        } else {
          db.collection('movies').doc(id).update({
            comment: commentEdit.value,
            myRating: ratingLi.value
          })
          openSuccess()
          succInfo.innerText = `List item updated!`;
        }
      })
    })
  } else {
    movieList.innerHTML = '<h5 class="flex">Login to see your list</h5>';
  }
};
// console.log(movieList)

/*
document.addEventListener('keyup', function(e) {
  let keyCode = e.keyCode;
  if (keyCode === 27) {
    close(item)
  }
});
*/