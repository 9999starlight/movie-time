// global selectors
const key = '94c8d066'
const proxy = 'https://cors-anywhere.herokuapp.com'
const content = document.querySelector('.content')
let filmIDS = []
let filmId = ''
const moreInfo = document.querySelector('.more-info')
const main = document.querySelector('.main-content')
let movie = {}
let info = '';
let action = false;
const search = document.querySelector('#search')
search.addEventListener('keyup', movieSearch)

const closeModal = (element) => {
  element.innerHTML = ''
  close(element)
}

// fetch movies from search. show/hide spinner. Get movie ID for movieDetals()
function movieSearch() {
  showSpinner()
  fetch(`${proxy}/http://www.omdbapi.com/?s=${search.value}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      hideSpinner()
      let lista = ''
      if (data.Search == undefined) {
        lista = `<h3>Not found...</h3>`
      } else {
        data.Search.forEach(film => {
          if (film.Poster == "N/A" || film.Poster.startsWith('http://'))
            film.Poster = 'img/noimage.jpg'
          filmId = film.imdbID
          lista += `<div class = 'film flex shadow center ctText mg1'>
          <a href = 'https://www.imdb.com/title/${film.imdbID}' target = '_blank'><img src = '${film.Poster}' alt = 'film poster' class = "block hoverTr" /></a>
          <div class = 'data flex center p10 fullWidth'>
          <h3>${film.Title}</h3><h5><span>Year:</span> ${film.Year}</h5><h5><span>Type:</span> ${film.Type}</h5>
          <input type = 'button' onclick = 'movieDetails("${filmId}")' class = 'infoBtn radius hoverTr white' value = 'More Info'>
          </div></div>`
          filmIDS.push(film.imdbID)
        });
      }
      content.innerHTML = lista
    })
  // empty array for new search
  if (search.value === '') {
    filmIDS = [];
  }
}

// display movie details; find matching id and show movie details; store details in movie object literal
function movieDetails(filmId) {
  showSpinner()
  // disable listener for other info buttons to prevent multiple clicks
  if(action == true) return;
  action = true;
  for (let i = 0; i < filmIDS.length; i++) {
    if (filmIDS[i] == filmId) filmId = filmIDS[i]
  }
  fetch(`${proxy}/http://www.omdbapi.com/?i=${filmId}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      hideSpinner()
      if (data.Response !== "False") {
        if (data.Poster == "N/A" || data.Poster.startsWith('http://'))
          data.Poster = 'img/noimage.jpg'
        movie = {
          title: data.Title,
          type: data.Type,
          year: data.Year,
          genre: data.Genre,
          imdbRating: data.imdbRating,
          movieID: filmId,
          imdbLink: `https://www.imdb.com/title/${data.imdbID}`
        }
        info = `<div class = 'film flex center'>
        <div class = "info-poster flex shadow center radius ctText p10 mg1">
        <a href = 'https://www.imdb.com/title/${data.imdbID}' target = '_blank'><img src = '${data.Poster}' alt = 'film poster' class = "block hoverTr" /></a>
        <div class = "data flex p10">
        <h2>${data.Title}</h2>
        <h3>Year: ${data.Year}</h3>
        <h3>Type: ${data.Type}</h3>
        <h3>Genre: ${data.Genre}</h3>
       <h3>IMDB Ratings: ${data.imdbRating}</h3>
       <button class = 'addMovieBtn radius hoverTr white'>Add to watchlist</button>
       <button class = 'back radius hoverTr white'>Back to search</button>
       </div>
       </div>
       <div class = 'data flex p10'>
       <h4>Actors: ${data.Actors}</h4><h4>Awards: ${data.Awards}</h4><h4>Runtime: ${data.Runtime}</h4><h4>Country: ${data.Country}</h4><h5>Plot: ${data.Plot}</h5><h2>Director: ${data.Director}</h2>
       </div>
       </div>`
      } else {
        info = "Not found..."
      }
      moreInfo.innerHTML += info
      open(moreInfo)
      close(main)

      document.querySelector('.back').addEventListener('click', function(){closeModal(moreInfo)
        , open(main);
      });
       // enable listeners for buttons
      action = false;
      document.querySelector('.addMovieBtn').addEventListener('click',
      function(){addMovieToList(movie)})
    })
}