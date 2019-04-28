# movie-time
movie API search, quiz and list


MOVIE TIME
Application for searching and storing movies and tv series info in registred user's list with movie trivia questions quiz. Responsive design (flexbox) alows appropriate display for all devices like mobiles, tablets, monitors and TV sets.

Front end - HTML5, CSS3, javaScript - no libraries or frameworks

Back end - Firebase Firestore database - https://firebase.google.com/ - free plan limited to 1gb total stored data, simultaneous connections 100, 10gb/month bandwidth, document writes 20K/day, document reads 50k/day, document deletes 20k/day. 

Code validation
HTML5 & CSS validation - W3C validation service https://www.w3.org/
javaScript validation - https://www.jslint.com/

Application description

Search alows user to browse for movies, series or games by typing in search field. Click on “more info” button enables detailed info about actors, plot, etc. Only registred users can create, read, update and delete item on their list. 

Fetching data from movie database - OMDB API http://www.omdbapi.com/ - free plan is limited with 1,000 daily requests. OMDB allows "search" paramether which displays 10 movies max, with basic info. When user clicks on ‘more info’ button, search is by "id" paramether which alows user to see detailed info for selected movie. OMDB doesn't allow more detailed search for example by year or directors only to prevent too many requests. 

main.js shows functions for fetching data from OMDB API.

authentication.js includes functions and Firebase Firestore methods for creating new user, ‘login’, ‘sign up’ or ‘logout’ and calls functions from display.js for rendering UI data depending on if user is logged in or not.

User can sign up with an e-mail and password adding 20 characters max for alias or comment. For the purpose of this school project, user can sign up with any valid e-mail form so e-mail becomes his/hers username with no request to validate email by recieving e-mail verification request from server. That email and password (minimum 6 characters) enables user’s login later on. Registered users are alowed to see their own list only. Form for adding new item to the list alows user to enter some comment or rating right away or do it later - user's list allows user to edit or enter comment (max 200 characters) and their own rating (1-10) and save changes. Firebase Firestore method ‘db.collection('movies').onSnapshot()’ immediately updates database and user's list. display.js also contains functions for list display, sorting it alfabetically or by IMDB rating. All alerts displaying warning or success are shown for 4 seconds.

Quiz

Movie trivia questions are fetched from Open Trivia Database API https://opentdb.com/ which doesn’t require api key. Open Trivia selects 20 random questions from their base with no duplication in one play. Every question values 1 point. If user clicks on field and then next question, if the answer is correct that field is colored green for 1 second and quiz continues to the next question. If answer is incorrect selected field is colored red and correct answer is bordered with green. Timer for quiz is set for 10 minutes. At the end user sees the score/percentage and have a choice to play again.
