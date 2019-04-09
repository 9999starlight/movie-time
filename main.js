
const search = document.querySelector('#search')
search.addEventListener('keyup', pretragaFilm)
const key = '94c8d066'
const content = document.querySelector('.content')
let buttons
let filmTitles = []
let filmTitle = ''
function pretragaFilm() {
  // http://www.omdbapi.com/ je veza sa apijem. ?t=(da tražim po nazivu filma. u varijabli mi je value text polja. &apikey=${key} dodajem svoj api key) 

  fetch(`http://www.omdbapi.com/?s=${search.value}&apikey=${key}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      console.log(data.Search)
      let lista = ''
      if (data.Search == undefined) {
        lista = `<h3>Movie not found...</h3>`
      } else {
        data.Search.forEach(film => {
          if (film.Poster == "N/A") {
            film.Poster = 'img/noimage.jpg'
          }
          filmTitle = film.Title
          lista += `<div class = 'film flex'><div><a href = 'https://www.imdb.com/title/${film.imdbID}' target = '_blank'><img src = '${film.Poster}' /></a></div><h2>${film.Title}</h2><h3>Year: ${film.Year}</h3><h3>Type: ${film.Type}</h3><input type = 'button' onclick = 'prikazFilma("${filmTitle}")' value = 'More Info'></div>`
          filmTitles.push(film.Title)
        });
      }
      content.innerHTML = lista
      console.log(filmTitles)
    })
}

// rešiti da li da se otvara na link na target blank ili da se promeni div ili da bude u popup-u
// takođe uraditi ipak  po id zbog mogućnosti istog imena
let lista = ''
function prikazFilma(filmTitle) {
  for (let i = 0; i < filmTitles.length; i++){
    if (filmTitles[i] == filmTitle) {
  filmTitle = filmTitles[i]
}
  }
    fetch(`http://www.omdbapi.com/?t=${filmTitle}&apikey=${key}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response !== "False") {
          lista = `<div class = 'film flex'><div class = 'poster'><img src = '${data.Poster}'</div></div><h2>${data.Title}</h2><h3>Year: ${data.Year}</h3><h3>Type: ${data.Type}</h3><h3>Genre: ${data.Genre}</h3><h4>Actors: ${data.Actors}</h4><h4>Awards: ${data.Awards}</h4><h5>Plot: ${data.Plot}</h5><h2>Director: ${data.Director}</h2><a href = 'https://www.imdb.com/title/${data.imdbID}' target = '_blank'>IMDB</a></div>`
        } else {
          lista = "Movie not found"
          }
          content.innerHTML = lista
        })
      }
