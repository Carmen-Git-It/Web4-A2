var page = 1;
const perPage = 10;
const API_URL = "https://inquisitive-lamb-costume.cyclic.app"

// Loads the movie data from the external API
function loadMovieData(title = null) {
    let query = "/api/movies?page=" + page + "&perPage=" + perPage;
    if (title !== null) {
        query += "&title=" + title;
        // Grab the pagination element
        let pagination = document.getElementsByClassName("pagination");
        pagination[0].classList.add("d-none");
    }
    else {
        let pagination = document.getElementsByClassName("pagination");
        pagination[0].classList.remove("d-none");
    }
    fetch(API_URL + query)
        .then((res) => {res.json()})
        .then((data) => {
            let rows = generateTable(data);
            addTable(rows);
        });
}

// Generates table rows for each movie in a list of movies
function generateTable(data) {
    let rows = `${data.map(movie => {
        `<tr data-id=${movie._id}>
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.plot ? movie.plot : 'N/A'}</td>
            <td>${movie.rated ? movie.rated : 'N/A'}</td>
            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2,'0')}</td>
        </tr>`
    })}`
    return rows;
}

// Adds an an array of table rows to the movies table
function addTable(rows) {

}