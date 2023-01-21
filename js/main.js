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
    fetch(encodeURI(API_URL + query))
        .then((res) => res.json())
        .then((data) => {
            let rows = generateTable(data);
            updateDOM(rows);
        });
}

// Generates table rows for each movie in a list of movies
function generateTable(data) {
    let rows = `${data.map((movie) => (
        `<tr data-id=${movie._id} data-bs-toggle="modal" data-bs-target="#movieModal">
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.plot ? movie.plot : 'N/A'}</td>
            <td>${movie.rated ? movie.rated : 'N/A'}</td>
            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2,'0')}</td>
        </tr>`
    )).join('')}`;
    return rows;
}

// Adds an array of table rows to the movies table
function updateDOM(rows) {
    document.querySelector('tbody').innerHTML = rows;
    // Add event handlers to rows
    document.querySelectorAll('tbody tr').forEach((tr) => {
        tr.addEventListener("click", onRowClick);
    });

    document.querySelector('#curr-page').innerHTML = page;
}

function onRowClick(event) {
    let row = event.target.parentElement;   // Is returning the <td> for some reason
    console.log(row);
    fetch(encodeURI(API_URL + "/api/movies/" + row.getAttribute('data-id')))
        .then((res) => res.json())
        .then((movie) => {
            console.log(movie);
            document.querySelector('.modal-title').innerHTML = movie.title;
            document.querySelector('.modal-body').innerHTML = 
            `<img class="img-fluid w-100"
            src="${movie.poster ? movie.poster : ""}"><br><br>
            <strong>Directed By:</strong> ${movie.directors}<br><br>
            <p>${movie.fullplot}</p>
            <strong>Cast:</strong> ${movie.cast ? movie.cast : 'N/A'}<br><br>
            <strong>Awards:</strong> ${movie.awards.text}<br>
            <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)`
            
            //document.querySelector('.modal').addEventListener
            let myModal = new bootstrap.Modal(document.getElementById('movieModal'), {
                backdrop: false, // default true - "static" indicates that clicking on the backdrop will not close the modal window
                keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
                focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
            });
              
            myModal.show();
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadMovieData();
    document.getElementById('modalClose').addEventListener('click', (e) => {
        document.querySelector('body').classList.remove('modal-open');
        document.querySelector('body').style.overflow = null;
    });
});