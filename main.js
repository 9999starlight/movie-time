const search = document.querySelector('#search')
search.addEventListener('keyup', pretragaFilm)
const key = '94c8d066'
const content = document.querySelector('.content')
let filmIDS = []
let filmId = ''

function pretragaFilm() {
  // http://www.omdbapi.com/ je veza sa apijem. ?t=(da tražim po nazivu filma. u varijabli mi je value text polja. &apikey=${key} dodajem svoj api key) 

  fetch(`http://www.omdbapi.com/?s=${search.value}&apikey=${key}`)
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
          <div class = 'data'>
          <h3>${film.Title}</h3><h4>Year: ${film.Year}</h4><h4>Type: ${film.Type}</h4>
          <input type = 'button' onclick = 'prikazFilma("${filmId}")' value = 'More Info'>
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
let info = ''
function prikazFilma(filmId) {
  for (let i = 0; i < filmIDS.length; i++) {
    if (filmIDS[i] == filmId) filmId = filmIDS[i]
  }
  fetch(`http://www.omdbapi.com/?i=${filmId}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response !== "False") {
        if (data.Poster == "N/A" || data.Poster.startsWith('http://'))
          data.Poster = 'img/noimage.jpg'
        info = `<i class="fas fa-window-close"></i>
        <div class = 'film flex shadow'>
        <div class = "info-poster flex shadow">
        <div class = "poster shadow"><img src = '${data.Poster}' alt = 'film poster' /></div>
        <div class = 'data flex'>
        <h2>${data.Title}</h2>
        <h3>Year: ${data.Year}</h3>
        <h3>Type: ${data.Type}</h3>
        <h3>Genre: ${data.Genre}</h3>
       <h3>IMDB Ratings: ${data.imdbRating}</h3>
       </div>
       </div>
       <h4>Actors: ${data.Actors}</h4><h4>Awards: ${data.Awards}</h4><h4>Runtime: ${data.Runtime}</h4><h4>Country: ${data.Country}</h4><h5>Plot: ${data.Plot}</h5><h2>Director: ${data.Director}</h2><a href = 'https://www.imdb.com/title/${data.imdbID}' target = '_blank'>IMDB</a></div>`
      } else {
        info = "Not found..."
      }
      const moreInfo = document.querySelector('.more-info')
      moreInfo.innerHTML += info
      moreInfo.style.display = 'flex'
      content.style.display = 'none'// da se ne vidi content odnosno onemogući biranje još modal info-a. dodaj neku boju ili nešto
      const close = () => {
        moreInfo.innerHTML = ''
        moreInfo.style.display = 'none'
        content.style.display = 'flex'// vrati display filmova
      }
      document.querySelector('.fas').addEventListener('click', close);
      //window.addEventListener('click', close);
    })
}
