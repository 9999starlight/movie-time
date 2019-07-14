export class Getdata {
  constructor() {
    this.key = '94c8d066';
    this.proxy = 'https://cors-anywhere.herokuapp.com';
    // firebase firestore config details
    this.config = {
      apiKey: "AIzaSyA7GNvPEIFYuJla-M0d41mIXmKMe1yXA4M",
      authDomain: "movie-time-1259d.firebaseapp.com",
      databaseURL: "https://movie-time-1259d.firebaseio.com",
      projectId: "movie-time-1259d"
    };
  }
  // get movie data from omdb api
  async getSearchData(search) {
    const moviesResponse =
      await fetch(`${this.proxy}/http://www.omdbapi.com/?s=${search}&apikey=${this.key}`);
    const searchResults = await moviesResponse.json();
    return searchResults;
  }

  async getDetailsData(filmId) {
    const detailsResponse =
      await fetch(`${this.proxy}/http://www.omdbapi.com/?i=${filmId}&apikey=${this.key}`);
    const detailsResult = await detailsResponse.json();
    return detailsResult;
  }
}