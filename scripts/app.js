import {
  Getdata
} from './getdata.js';

import {
  View
} from './view.js';

const getdata = new Getdata;
const view = new View;

const app = function () {
  // Initialize Firebase
  firebase.initializeApp(getdata.config);
  const auth = firebase.auth();
  const db = firebase.firestore();
  db.settings({
    timestampsInSnapshots: true
  });

  // MOVIES SEARCH
  function getMovies() {
    let searchValue = view.search.value;
    view.showLoader();
    if (searchValue !== '') {
      getdata.getSearchData(searchValue)
        .then(data => {
          view.hideLoader();
          if (data.Search == undefined) {
            view.undefinedResults();
          } else {
            view.displaySearchResults(data);
            const buttons = document.querySelectorAll('.infoBtn')
            buttons.forEach(btn => {
              btn.addEventListener('click', () => {
                movieDetails(btn.getAttribute('id'))
              })
            })
          }
        }).catch(err => {
          console.log(err.message);
          view.errMessage();
        });
    } else {
      view.hideLoader();
      view.undefinedResults();
    }
  }

  // find matching movie id and show movie details; store details
  let action = false;
  let movieData = {};

  function movieDetails(filmId) {
    view.showLoader();
    // disable listener for info buttons to prevent multiple clicks
    if (action == true) return;
    action = true;
    getdata.getDetailsData(filmId)
      .then(data => {
        view.hideLoader();
        if (data.Response !== "False") {
          if (data.Poster == "N/A" || data.Poster.startsWith('http://'))
            data.Poster = 'img/noimage.jpg';
          movieData = {
            title: data.Title,
            type: data.Type,
            year: data.Year,
            genre: data.Genre,
            imdbRating: data.imdbRating,
            movieID: filmId,
            imdbLink: `https://www.imdb.com/title/${data.imdbID}`
          }
          view.displayMovieDetails(data)
        } else {
          view.undefinedResults();
        }
        view.open(view.moreInfo);
        view.close(view.main);
        document.querySelector('.back')
          .addEventListener('click', () => {
            view.closeModal(view.moreInfo), view.open(view.main);
          });
        // enable listeners for info buttons; listener for addMovieToList;
        action = false;
        document.querySelector('.addMovieBtn')
          .addEventListener('click', () => {
            addMovieToList(movieData);
          })
      }).catch(err => {
        console.log(err.message);
        view.errMessage();
      });
  }

  /* Firebase auth functions: if user signed in call functions for
  display links and list. Empty array from usersMovieList() if signed out */
  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection('movies').onSnapshot((snapshot) => {
        usersMovieList(snapshot.docs);
        displayLinks(user);
      }, err => console.log(err.message));
    } else {
      displayLinks();
      usersMovieList([]);
    }
  });

  // DISPLAY LINKS - depends on the user status
  function displayLinks(user) {
    if (user) {
      db.collection('users').doc(user.uid).get().then((doc) => {
        view.showUserInfo(user)
      });
      view.loggedInDisplay()
    } else {
      view.loggedOutDisplay()
    }
  };

  // ADD MOVIE - check if movie has already added & user; display addNew form
  function addMovieToList(movieData) {
    let user = firebase.auth().currentUser;
    if (!user)
      view.openWarn(`Login or signup to add movie to your list!`);
    let checkIds = true;
    const movieIds = document.querySelectorAll('.film-id');
    for (let i = 0; i < movieIds.length; i++) {
      if (movieIds[i].innerText == movieData.movieID) {
        checkIds = false;
        view.openWarn(`You have already added that item to your list`);
        return;
      }
    }
    if (checkIds = true && user)
      view.showForm(movieData)
  }

  // SAVE new item - submit form to firebase db
  function saveNewMovie(e) {
    e.preventDefault();
    let user = firebase.auth().currentUser;
    db.collection('movies').add({
      title: document.querySelector('#inputTitle').innerText,
      type: document.querySelector('#inputType').innerText,
      year: document.querySelector('#inputYear').innerText,
      genre: document.querySelector('#inputGenre').innerText,
      imdbRate: document.querySelector('#inputImdbRate').innerText,
      filmID: document.querySelector('#inputFilmId').innerText,
      myRating: document.querySelector('#myRating').value,
      comment: document.querySelector('#comment').value,
      imdbLink: document.querySelector('#imdbLink').innerText,
      usersid: user.uid
    }).then(() => {
      view.createForm.reset();
      view.closeAddNew(view.addNew);
      view.open(view.main);
      view.closeModal(view.moreInfo);
      view.openSuccess(`Added to your list`);
    }).catch((err) => {
      console.log(err.message);
    });
  }

  // USER'S LIST; render, sort, update & delete list items
  function usersMovieList(data) {
    let user = firebase.auth().currentUser;
    if (data.length) {
      let output = '';
      data.forEach((doc) => {
        const film = doc.data();
        if (film.usersid == user.uid) {
          view.renderListItem(film, doc)
          output += view.li;
        }
      });
      view.movieList.innerHTML = output;

      // Sort list alfabetically
      const lis = view.movieList.querySelectorAll('.item');
      const sortByAbc = () => {
        view.movieList.innerHTML = '';
        Array.prototype.map.call(lis, function (node) {
          return {
            node: node,
            titles: node.childNodes[1].childNodes[1].innerText
          };
        }).sort((a, b) => {
          return a.titles.localeCompare(b.titles);
        }).forEach(item => {
          view.movieList.appendChild(item.node);
        });
      }
      document.querySelector('#btnAbc').addEventListener('click', sortByAbc);

      // Sort list by imdb rating
      const sortByRating = () => {
        view.movieList.innerHTML = '';
        Array.prototype.map.call(lis, function (node) {
          return {
            node: node,
            rate: node.childNodes[3].childNodes[5].childNodes[1].innerText
          };
        }).sort((a, b) => {
          return b.rate.localeCompare(a.rate);
        }).forEach((item) => {
          view.movieList.appendChild(item.node);
        });
      }
      document.querySelector('#btnRate').addEventListener('click', sortByRating);
      // DELETE item from the list and database
      const dlt = document.querySelectorAll('.fa-trash-alt');
      dlt.forEach((dl) => {
        dl.addEventListener('click', (e) => {
          let id = e.target.parentElement.parentElement.getAttribute('id');
          db.collection('movies').doc(id).delete();
          view.openSuccess(`List item removed!`);
        })
      });

      //SAVE comment & rating changes
      const saveIcon = document.querySelectorAll('.fa-save');
      saveIcon.forEach((si) => {
        si.addEventListener('click', (e) => {
          let id = e.target.parentElement.parentElement.getAttribute('id');
          let commentEdit =
            e.target.parentElement.previousElementSibling.childNodes[1];
          let ratingLi = e.target.parentElement.previousElementSibling
            .previousElementSibling.childNodes[3];
          let numTest = /^(?:[1-9]|0[1-9]|10)$/;
          if (!numTest.test(ratingLi.value)) {
            view.openWarn(`Please enter rating between 1 and 10`);
          } else {
            db.collection('movies').doc(id).update({
              myRating: ratingLi.value,
              comment: commentEdit.value
            })
            view.openSuccess(`List item updated!`)
          }
        });
      });
    }
  }

  /* SIGNUP - get user info from input fields;
users credentials to get user's token and generate user's id;
add new user in users collection in Firebase; Errors, close and reset form */
  function openSignup(e) {
    e.preventDefault();
    view.open(view.signUpFormDiv);
    view.close(view.loginFormDiv);
  }

  function createNewUser(e) {
    e.preventDefault();
    const email = view.signupForm['signup-email'].value;
    const password = view.signupForm['signup-password'].value;
    const regEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!regEmail.test(document.querySelector('#signup-email').value)) {
      view.openWarn(`You haven't entered valid e-mail, please try again!`);
      return;
    } else {
      auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        return db.collection('users').doc(cred.user.uid).set({
          comm: view.signupForm['shortComment'].value
        });
      }).then(() => {
        view.closeForm(view.signUpFormDiv, view.signupForm);
      }).catch((err) => {
        view.signupForm.querySelector('.error').innerHTML = err.message;
      });
    }
  }

  // LOGOUT - auth.signOut() Firebase method; close user's list
  function logoutUser(e) {
    e.preventDefault();
    view.close(view.listDiv);
    auth.signOut().then(() => {
      view.openSuccess(`Signed out`);
    })
  }

  // LOGIN - take values from form; check user's credentials; close/reset form
  function openLogin(e) {
    e.preventDefault();
    view.open(view.loginFormDiv);
    view.close(view.signUpFormDiv);
  }

  function loginUser(e) {
    e.preventDefault();
    const email = view.loginForm['login-email'].value;
    const password = view.loginForm['login-password'].value;
    const regEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!regEmail.test(document.querySelector('#login-email').value)) {
      view.openWarn(`You haven't entered valid e-mail, please try again!`);
      return;
    } else {
      auth.signInWithEmailAndPassword(email, password).then((cred) => {
        //console.log(cred.user);
        view.closeForm(view.loginFormDiv, view.loginForm);
      }).catch((err) => {
        view.loginForm.querySelector('.error').innerHTML = err.message;
      });
    }
  }

  // LISTENERS
  view.search.addEventListener('keyup', getMovies);
  document.querySelector('#loginLink').addEventListener('click', openLogin);
  document.querySelector('#signUpLink').addEventListener('click', openSignup);
  document.querySelector('#loginX').addEventListener('click', function () {
    view.close(view.loginFormDiv);
  });
  document.querySelector('#signupX').addEventListener('click', function () {
    view.close(view.signUpFormDiv);
  });
  document.querySelector('#okWarn').addEventListener('click', function () {
    view.close(view.alertWarn);
  });
  document.querySelector('#okSuccess').addEventListener('click', function () {
    view.close(view.alertSuccess);
  });
  document.querySelector('#cancelCreate').addEventListener('click',
    () => view.closeAddNew());
  document.querySelector('#cancelSignUp').addEventListener('click', function () {
    view.closeForm(view.signUpFormDiv, view.signupForm)
  });
  document.querySelector('#cancelLogin').addEventListener('click', function () {
    view.closeForm(view.loginFormDiv, view.loginForm)
  });
  document.querySelector('#logoutLink').addEventListener('click', logoutUser);
  view.createForm.addEventListener('submit', saveNewMovie);
  view.signupForm.addEventListener('submit', createNewUser);
  view.loginForm.addEventListener('submit', loginUser);
}
window.addEventListener('load', app);
