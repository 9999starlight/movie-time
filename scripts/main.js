const search = document.querySelector('#search')
search.addEventListener('keyup', movieSearch)
const key = '94c8d066'
const proxy = 'https://cors-anywhere.herokuapp.com'
const content = document.querySelector('.content')
let filmIDS = []
let filmId = ''
const container = document.querySelector('.container')

const closeModal = (element) => {
  element.innerHTML = ''
  close(element)
}
function movieSearch() {
  // http://www.omdbapi.com/ je veza sa apijem. ?t=(da tražim po nazivu filma. u varijabli mi je value text polja. &apikey=${key} dodajem svoj api key) 

  fetch(`${proxy}/http://www.omdbapi.com/?s=${search.value}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      console.log(data.Search)
      let lista = ''
      if (data.Search == undefined) {
        lista = `<h3>Not found...</h3>`
      } else {
        data.Search.forEach(film => {
          if (film.Poster == "N/A" || film.Poster.startsWith('http://'))
            film.Poster = 'img/noimage.jpg'
          filmId = film.imdbID
          lista += `<div class = 'film flex shadow'>
          <a href = 'https://www.imdb.com/title/${film.imdbID}' target = '_blank'><img src = '${film.Poster}' alt = 'film poster'/></a>
          <div class = 'data flex'>
          <h3>${film.Title}</h3><h5>Year: ${film.Year}</h5><h5>Type: ${film.Type}</h5>
          <input type = 'button' onclick = 'movieDetails("${filmId}")' class = 'infoBtn' value = 'More Info'>
          </div></div>`
          filmIDS.push(film.imdbID)
        });
      }
      content.innerHTML = lista
      console.log(filmIDS)
    })
  if (search.value === '') {
    filmIDS = [] // da se isprazni niz kada je izbrisana prethodna pretraga
  }
}
//let moreInfo
/*
class Movie {
  constructor(title, type, year, genre, imdbRating, plot, imdbID) {
    this.title = title;
    this.type = type;
    this.year = year;
    this.genre = genre;
    this.imdbRating = imdbRating;
    this.plot = plot;
    this.imdbID = imdbID;
  }
}*/
let movie = {}

let info = ''
function movieDetails(filmId) {
  for (let i = 0; i < filmIDS.length; i++) {
    if (filmIDS[i] == filmId) filmId = filmIDS[i]
  }
  fetch(`${proxy}/http://www.omdbapi.com/?i=${filmId}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response !== "False") {
        if (data.Poster == "N/A" || data.Poster.startsWith('http://'))
          data.Poster = 'img/noimage.jpg'
        movie = {
          title: data.Title,
          type: data.Type,
          year: data.Year,
          genre: data.Genre,
          imdbRating: data.imdbRating,
          movieID: filmId
        }
        console.log(movie)
        info = `<i class="fas fa-window-close" id = "movieX"></i>
        <div class = 'film flex shadow'>
        <div class = "info-poster flex shadow">
        <div class = "poster shadow"><img src = '${data.Poster}' alt = 'film poster' /></div>
        <div class = 'data flex'>
        <h2>${data.Title}</h2>
        <h3>Year: ${data.Year}</h3>
        <h3>Type: ${data.Type}</h3>
        <h3>Genre: ${data.Genre}</h3>
       <h3>IMDB Ratings: ${data.imdbRating}</h3>
       <button class = 'addMovieBtn'>Add to watchlist</button>
       </div>
       </div>
       <h4>Actors: ${data.Actors}</h4><h4>Awards: ${data.Awards}</h4><h4>Runtime: ${data.Runtime}</h4><h4>Country: ${data.Country}</h4><h5>Plot: ${data.Plot}</h5><h2>Director: ${data.Director}</h2><a href = 'https://www.imdb.com/title/${data.imdbID}' target = '_blank'>IMDB</a></div>`
      } else {
        info = "Not found..."
      }
      const moreInfo = document.querySelector('.more-info')
      moreInfo.innerHTML += info
      open(moreInfo)
      close(content)// da se ne vidi content odnosno onemogući biranje još modal info-a. dodaj neku boju ili nešto
      document.querySelector('#movieX').addEventListener('click', function(){closeModal(moreInfo)
        , open(content)
      });
      document.querySelector('.addMovieBtn').addEventListener('click',
      function(){addMovieToList(movie)})
    })
  //console.log(filmId)
}
//console.log(filmId)
//nekadašnji za zatvaranje ali ne valja
/*
      const closeModal = (e) => {
        if (e.target.classList.contains('container') || e.target.classList.contains('fas')){
          console.log(e.target)
          moreInfo.innerHTML = ''
          close(moreInfo)
          open(content)// vrati display filmova
      }
    }
    container.addEventListener('click', closeModal);
    document.querySelector('#movieX').addEventListener('click', closeModal);




    const closeModal = () => {
  moreInfo.innerHTML = ''
  close(moreInfo)
  open(content)// vrati display filmova
}
*/