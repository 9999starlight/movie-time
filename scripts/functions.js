// open and close functions
const open = (item) => item.style.display = 'flex';
const close = (item) => item.style.display = 'none';

const loginLink = document.querySelector('#loginLink')
const signUpLink = document.querySelector('#signUpLink')
const loginForm = document.querySelector('.login')
const signUpForm = document.querySelector('.signup')
const createForm = document.querySelector('.add-new')

// opening-closing login, signup & create forms
const openLogin = (e) => {
    e.preventDefault();
    open(loginForm);
    close(signUpForm);
}

const openSignup = (e) => {
    e.preventDefault();
    open(signUpForm);
    close(loginForm);
}
loginLink.addEventListener('click', openLogin);
signUpLink.addEventListener('click', openSignup);
document.querySelector('#loginX').addEventListener('click', function(){close(loginForm)
});
document.querySelector('#signupX').addEventListener('click', function(){close(signUpForm)
});
document.querySelector('#add-newX').addEventListener('click', function(){close(createForm)
});

// create form

const inputTitle = document.querySelector('#inputTitle');
const inputType = document.querySelector('#inputType');
const inputYear = document.querySelector('#inputYear');
const inputGenre = document.querySelector('#inputGenre');
const inputImdbRate = document.querySelector('#inputImdbRate');
const inputFilmId = document.querySelector('#inputFilmId');
//const inputPlot = document.querySelector('#inputPlot');
const myRating = document.querySelector('#myRating');
const comment = document.querySelector('#comment');

function addMovieToList() {
    open(createForm);
    close(content);
    inputTitle.value = movie.title;
    inputType.value = movie.type;
    inputYear.value = movie.year;
    inputGenre.value = movie.genre;
    inputImdbRate.value = movie.imdbRating;
    inputFilmId.value = movie.movieID;
}

// funkcija za submit form u db. Za sada samo stavljam da prazni formu.
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
/*ovde funkcija za dodavanje u db ovde*/
    
    // resetovanje forme
    inputTitle.value = '';
    inputType.value = '';
    inputYear.value = '';
    inputGenre.value = '';
    inputImdbRate.value = '';
    inputFilmId.value = '';
    open(content);
    close(createForm)
    /*
    e.preventDefault();
    // idem na kolekciju koja mi treba, metod add() u koji stavljam objekat koji dodajem. Ovde su values iz forme. Ukoliko je ime key objekta sa crticom ili više reči stavi u [] npr. title: createForm['title-hello'].value
    db.collection('guides').add({
      title: createForm['title'].value,
      content: createForm['content'].value
    }).then(() => {// ne treba parametar jer dodajem
      createForm.reset();
    }).catch(err => {
      console.log(err.message);
    });
    */
  });

