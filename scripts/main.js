const search = document.querySelector('#search')
search.addEventListener('keyup', movieSearch)
const key = '94c8d066'
const proxy = 'https://cors-anywhere.herokuapp.com'
const content = document.querySelector('.content')
let filmIDS = []
let filmId = ''
const container = document.querySelector('.container')
const moreInfo = document.querySelector('.more-info')

const closeModal = (element) => {
  element.innerHTML = ''
  close(element)
}

function movieSearch() {
  showSpinner()
  fetch(`${proxy}/http://www.omdbapi.com/?s=${search.value}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data)
      //console.log(data.Search)
      hideSpinner()
      let lista = ''
      if (data.Search == undefined) {
        lista = `<h3>Not found...</h3>`
      } else {
        data.Search.forEach(film => {
          if (film.Poster == "N/A" || film.Poster.startsWith('http://'))
            film.Poster = 'img/noimage.jpg'
          filmId = film.imdbID
          lista += `<div class = 'film flex shadow center'>
          <a href = 'https://www.imdb.com/title/${film.imdbID}' target = '_blank'><img src = '${film.Poster}' alt = 'film poster' class = "block hoverTr" /></a>
          <div class = 'data'>
          <h3>${film.Title}</h3><h5><span>Year:</span> ${film.Year}</h5><h5><span>Type:</span> ${film.Type}</h5>
          <input type = 'button' onclick = 'movieDetails("${filmId}")' class = 'infoBtn radius hoverTr' value = 'More Info'>
          </div></div>`
          filmIDS.push(film.imdbID)
        });
      }
      content.innerHTML = lista
    })
  if (search.value === '') {
    filmIDS = [] // da se isprazni niz kada je izbrisana prethodna pretraga
  }
}

let movie = {}
//const btnDetails = document.querySelector('.infoBtn');
let info = '';
let action = false;

function movieDetails(filmId) {
  showSpinner()
  // remove event listener sa btnDetails
  if(action == true) return;
  action = true;
// find matching id and show movie details
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
        <div class = "info-poster flex shadow center radius">
        <a href = 'https://www.imdb.com/title/${data.imdbID}' target = '_blank'><img src = '${data.Poster}' alt = 'film poster' class = "block hoverTr" /></a>
        <div class = 'data flex'>
        <h2>${data.Title}</h2>
        <h3>Year: ${data.Year}</h3>
        <h3>Type: ${data.Type}</h3>
        <h3>Genre: ${data.Genre}</h3>
       <h3>IMDB Ratings: ${data.imdbRating}</h3>
       <button class = 'addMovieBtn radius hoverTr'>Add to watchlist</button>
       <button class = 'back radius hoverTr'>Back to search</button>
       </div>
       </div>
       <div class = 'data flex'>
       <h4>Actors: ${data.Actors}</h4><h4>Awards: ${data.Awards}</h4><h4>Runtime: ${data.Runtime}</h4><h4>Country: ${data.Country}</h4><h5>Plot: ${data.Plot}</h5><h2>Director: ${data.Director}</h2>
       </div>
       </div>`
      } else {
        info = "Not found..."
      }
      moreInfo.innerHTML += info
      open(moreInfo)
      close(content)// da se ne vidi content odnosno onemogući biranje još modal info-a. dodaj neku boju ili nešto
      //close(list) zatvori div list da ne ide preko nje
      document.querySelector('.back').addEventListener('click', function(){closeModal(moreInfo)
        , open(content);
      });
      action = false; // vrati event listener sa btnDetails
      document.querySelector('.addMovieBtn').addEventListener('click',
      function(){addMovieToList(movie)})
    })
}


