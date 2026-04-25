const API_KEY = "49f2dde9";
const searchResults = document.getElementById("search-results");
const form = document.getElementById("film-form");
const titleElement = document.querySelector("#title");
const directorElement = document.querySelector("#director");
const urlElement = document.querySelector("#url");
const cardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.getElementById("clear-films");
const searchInput = document.getElementById("search");
const toggleDarkButton = document.getElementById("toggle-dark");
const filterButtons = document.querySelectorAll(".filter-btn");
const movieSearchInput = document.getElementById("movie-search");
const searchMovieButton = document.getElementById("search-movie-btn");

let currentFilter = "all";
let currentSearchText = "";
window.selectedMovieYear = "Bilinmiyor";

eventListeners();

function eventListeners() {
  form.addEventListener("submit", addFilm);

  document.addEventListener("DOMContentLoaded", function () {
    UI.refreshFilms(getVisibleFilms());
  });

  cardBody.addEventListener("click", handleFilmActions);
  clearButton.addEventListener("click", clearAllFilms);
  searchInput.addEventListener("keyup", handleSearch);
  toggleDarkButton.addEventListener("click", toggleDarkMode);

  filterButtons.forEach(button => {
    button.addEventListener("click", changeFilter);
  });

  searchMovieButton.addEventListener("click", searchMovieFromAPI);
}

function addFilm(e) {
  e.preventDefault();

  const title = titleElement.value.trim();
  const director = directorElement.value.trim();
  const url = urlElement.value.trim();

  if (title === "" || director === "" || url === "") {
    UI.displayMessage("Please fill in all fields...", "danger");
    return;
  }

  const newFilm = new Film(
    title,
    director,
    url,
    window.selectedMovieYear || "Bilinmiyor"
  );

  if (Storage.isFilmExists(newFilm)) {
    UI.displayMessage("This movie has already been added...", "warning");
    return;
  }

  Storage.addFilmToStorage(newFilm);
UI.refreshFilms(getVisibleFilms());
UI.displayMessage("Movie added successfully...", "success");

UI.clearInputs(titleElement, directorElement, urlElement);
movieSearchInput.value = "";
window.selectedMovieYear = "Bilinmiyor";
searchResults.innerHTML = "";
}

function handleFilmActions(e) {
  const target = e.target;
  const filmId = Number(target.dataset.id);

  if (target.classList.contains("delete-film")) {
    e.preventDefault();
    Storage.deleteFilmFromStorage(filmId);
    UI.refreshFilms(getVisibleFilms());
    UI.displayMessage("Movie deleted successfully...", "success");
  }

  if (target.classList.contains("toggle-favorite")) {
    e.preventDefault();
    Storage.toggleFavorite(filmId);
    UI.refreshFilms(getVisibleFilms());
    UI.displayMessage("Favorite status updated...", "info");
  }

  if (target.classList.contains("toggle-status")) {
    e.preventDefault();
    Storage.toggleStatus(filmId);
    UI.refreshFilms(getVisibleFilms());
    UI.displayMessage("Movie status updated...", "info");
  }

  if (target.classList.contains("star")) {
    const rating = Number(target.dataset.rating);
    Storage.updateRating(filmId, rating);
    UI.refreshFilms(getVisibleFilms());
    UI.displayMessage("Rating updated...", "info");
  }
}

function clearAllFilms(e) {
  e.preventDefault();

  if (confirm("Are you sure?")) {
    Storage.clearAllFilmsFromStorage();
    UI.clearAllFilmsFromUI();
    UI.updateFilmCount(0);
    UI.displayMessage("All movies deleted successfully...", "success");
  }
}

function handleSearch(e) {
  currentSearchText = e.target.value.toLowerCase().trim();
  UI.refreshFilms(getVisibleFilms());
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function changeFilter(e) {
  const filter = e.target.dataset.filter;
  currentFilter = filter;
  UI.setActiveFilterButton(filter);
  UI.refreshFilms(getVisibleFilms());
}

function getVisibleFilms() {
  let films = Storage.getFilmsFromStorage();

  if (currentFilter === "watchlist") {
    films = films.filter(film => film.status === "watchlist");
  }

  if (currentFilter === "watched") {
    films = films.filter(film => film.status === "watched");
  }

  if (currentFilter === "favorites") {
    films = films.filter(film => film.favorite === true);
  }

  if (currentSearchText !== "") {
    films = films.filter(film => {
      const combinedText = `${film.title} ${film.director}`.toLowerCase();
      return combinedText.includes(currentSearchText);
    });
  }

  return films;
}

  async function searchMovieFromAPI() {
  const movieName = movieSearchInput.value.trim();

  if (movieName === "") {
    UI.displayMessage("Please enter a movie name...", "warning");
    return;
  }

  try {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(movieName)}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      searchResults.innerHTML = "";
      titleElement.value = "";
      directorElement.value = "";
      urlElement.value = "";
      window.selectedMovieYear = "Bilinmiyor";

      UI.displayMessage(data.Error || "Movie not found...", "danger");
      return;
    }

    renderSearchResults(data.Search);
  } catch (error) {
    console.error("API ERROR:", error);
    UI.displayMessage("An API error occurred...", "danger");
  }
}
function renderSearchResults(movies) {
  searchResults.innerHTML = "";

  movies.slice(0, 6).forEach(movie => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "list-group-item list-group-item-action";

    item.innerHTML = `
      <div class="d-flex align-items-center">
        <img
          src="${movie.Poster !== "N/A" ? movie.Poster : "https://dummyimage.com/50x70/cccccc/000000&text=No+Image"}"
          alt="${movie.Title}"
          width="50"
          height="70"
          style="object-fit: cover; margin-right: 12px;"
        />
        <div class="text-left">
          <strong>${movie.Title}</strong><br>
          <small>${movie.Year}</small>
        </div>
      </div>
    `;

    item.addEventListener("click", function () {
      selectMovie(movie.imdbID);
    });

    searchResults.appendChild(item);
  });
}async function selectMovie(imdbID) {
  try {
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "False") {
      UI.displayMessage("Film detayları alınamadı...", "danger");
      return;
    }

    titleElement.value = data.Title || "";
    directorElement.value = data.Director || "";
    urlElement.value =
      data.Poster && data.Poster !== "N/A"
        ? data.Poster
        : "https://dummyimage.com/90x120/cccccc/000000&text=No+Image";

    window.selectedMovieYear = data.Year || "Bilinmiyor";

    searchResults.innerHTML = "";
    UI.displayMessage("Movie selected and form filled successfully...", "success");
  } catch (error) {
    console.error("SELECT MOVIE ERROR:", error);
    UI.displayMessage("Film seçilirken hata oluştu...", "danger");
  }
}