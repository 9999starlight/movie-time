/* UI functions & settings */
export class View {
  constructor() {
    this.container = document.querySelector('.container');
    this.search = document.querySelector('#search');
    this.content = document.querySelector('.content');
    this.loader = document.querySelector('#loader');
    this.moreInfo = document.querySelector('.more-info');
    this.main = document.querySelector('.main-content');
    this.addNew = document.querySelector('.add-new');
    this.loginFormDiv = document.querySelector('.login');
    this.signUpFormDiv = document.querySelector('.signup');
    this.loggedOutLinks = document.querySelectorAll('.logged-out');
    this.loggedInLinks = document.querySelectorAll('.logged-in');
    this.loginForm = document.querySelector('#login-form');
    this.signupForm = document.querySelector('#signup-form');
    this.createForm = document.querySelector('#create-form');
    this.accountDetails = document.querySelector('.account');
    this.listDiv = document.querySelector('.list');
    this.movieList = document.querySelector('#list');
    this.alertWarn = document.querySelector('.alertWarn');
    this.alertSuccess = document.querySelector('.alertSuccess');
    this.warnInfo = document.querySelector('#warnInfo');
    this.succInfo = document.querySelector('#succInfo');
    this.detailsInfo = '';
    this.li = '';
  }

  showUserInfo(user) {
    this.detailsInfo = `<div class = "flex">${user.email}</div>`;
    this.accountDetails.innerHTML = this.detailsInfo;
  }

  loggedInDisplay() {
    this.open(this.listDiv);
    this.loggedInLinks.forEach(link => this.open(link));
    this.loggedOutLinks.forEach(link => this.close(link));
  }

  loggedOutDisplay() {
    this.accountDetails.innerHTML = '';
    this.loggedInLinks.forEach(link => this.close(link));
    this.loggedOutLinks.forEach(link => this.open(link));
  }

  // show or hide loader
  showLoader() {
    this.loader.className = "show";
    setTimeout(() => {
      this.loader.className = this.loader.className.replace("show", "");
    }, 30000);
  }

  hideLoader() {
    this.loader.className = this.loader.className.replace("show", "");
  }

  undefinedResults() {
    this.content.innerHTML = `<h3>...</h3>`;
  }

  errMessage() {
    this.content.innerHTML = `
    <h3>Request failed, please try again later!</h3>`;
  }

  open(item) {
    item.style.display = 'flex';
  }

  close(item) {
    item.style.display = 'none';
  }

  closeModal(element) {
    element.innerHTML = '';
    this.close(element);
  }

  displaySearchResults(data) {
    let lista = '';
    data.Search.forEach(film => {
      if (film.Poster == "N/A" || film.Poster.startsWith('http://'))
        film.Poster = 'img/noimage.jpg'
      lista += `<div class = 'film flex shadow center ctText mg1'>
               <a href = 'https://www.imdb.com/title/${film.imdbID}'
               target = '_blank'><img src = '${film.Poster}'
               alt = 'film poster' class = "block hoverTr" /></a>
               <div class = 'data flex center p10 fullWidth'>
               <h3>${film.Title}</h3>
               <h5><span>Year:</span> ${film.Year}</h5>
               <h5><span>Type:</span> ${film.Type}</h5>
               <input type = 'button' id = "${film.imdbID}"
               class = 'infoBtn radius hoverTr white btnFont' value = 'More Info'>
               </div></div>`
    });
    this.content.innerHTML = lista;
  }

  displayMovieDetails(data) {
    let info = '';
    info = `<div class = 'film flex center'>
      <div class = "info-poster flex shadow center radius ctText mg1">
      <a href = 'https://www.imdb.com/title/${data.imdbID}' target = '_blank'>
      <img src = '${data.Poster}' alt = 'film poster' class = "block hoverTr" /></a>
      <div class = "data flex p10">
      <h2>${data.Title}</h2>
      <h3>Year: ${data.Year}</h3>
      <h3>Type: ${data.Type}</h3>
      <h3>Genre: ${data.Genre}</h3>
      <h3>IMDB Rating: ${data.imdbRating}</h3>
      <button class = 'addMovieBtn radius hoverTr white btnFont'>
      Add to watchlist</button>
      <button class = 'back radius hoverTr white btnFont'>
      Back to search</button>
      </div>
      </div>
      <div class = 'data flex p10'>
      <h4>Actors: ${data.Actors}</h4>
      <h4>Awards: ${data.Awards}</h4>
      <h4>Runtime: ${data.Runtime}</h4>
      <h4>Country: ${data.Country}</h4>
      <h5>Plot: ${data.Plot}</h5>
      <h2>Director: ${data.Director}</h2>
      </div>
      </div>`;
    this.moreInfo.innerHTML += info;
  }

  renderListItem(film, doc) {
    this.li = `
            <li id = '${doc.id}' class = "item">
              <div class="movieLiDiv flex ctText">
              <h3>${film.title}</h3>
              <h4>type: ${film.type}</h4>
              <h4>year: ${film.year}</h4>
              <h4>genre: ${film.genre}</h4>
              </div>
              <div class="show-more ctText">
              <span>My rating:</span>
              <input type="number" value="${film.myRating}" id="ratingLi"
              class = "white p10"
              title="Enter number between 1 and 10 and click save icon"
              min="1" max="10">
              <h4>IMDB rating: <span>${film.imdbRate}</span></h4>
              <a href = ${film.imdbLink} target = '_blank'
              class = "block hoverTr">IMDB details</a>
              <h4 class = "film-id">${film.filmID}</h4>
              </div>
              <div class = "text flex ctText">
              <textarea id = "commentLi" class = "white p10"
              placeholder = "Edit yor comment and click save icon"
              title = "Edit yor comment and click save icon"
              maxlength="200">${film.comment}</textarea>
              </div>
              <div class = "ctText">
              <i class="far fa-save hoverTr" title = "SAVE CHANGES"></i>
              <i class="far fa-trash-alt hoverTr" title = "DELETE"></i>
              </div>
            </li>
          `;
  }

  //display form for submit new movie
  showForm(movieData) {
    this.open(this.addNew);
    this.container.classList.add('darken');
    document.querySelector('#inputTitle').innerText = movieData.title;
    document.querySelector('#inputType').innerText = movieData.type;
    document.querySelector('#inputYear').innerText = movieData.year;
    document.querySelector('#inputGenre').innerText = movieData.genre;
    document.querySelector('#inputImdbRate').innerText = movieData.imdbRating;
    document.querySelector('#inputFilmId').innerText = movieData.movieID;
    document.querySelector('#imdbLink').innerText = movieData.imdbLink;
  }

  // alerts
  openWarn(info) {
    this.warnInfo.innerText = info;
    this.open(this.alertWarn);
    setTimeout(() => {
      this.close(this.alertWarn);
      info = '';
    }, 4000);
  }

  openSuccess(info) {
    this.succInfo.innerText = info;
    this.open(this.alertSuccess);
    setTimeout(() => {
      this.close(this.alertSuccess);
      info = '';
    }, 3000);
  }

  // cancel/close forms
  closeAddNew() {
    this.close(this.addNew);
    this.container.classList.remove('darken');
  }

  closeForm(formDiv, form) {
    this.close(formDiv);
    form.reset();
    form.querySelector('.error').innerHTML = '';
  }
}