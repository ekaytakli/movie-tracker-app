class UI {
  static addFilmToUI(newFilm) {
    const filmList = document.getElementById("films");
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = this.createFilmCard(newFilm);
    filmList.appendChild(card);
  }

  static createFilmCard(film) {
    const statusBadge =
      film.status === "watched"
        ? `<span class="badge badge-success">Watched</span>`
        : `<span class="badge badge-warning">Watchlist</span>`;

    const favoriteBadge = film.favorite
      ? `<span class="badge badge-danger">♥ Favorite</span>`
      : `<span class="badge badge-secondary">Normal</span>`;

    const statusButtonText =
      film.status === "watched" ? "Move to Watchlist" : "Mark as Watched";

    const favoriteButtonText =
      film.favorite ? "Remove Favorite" : "Add Favorite";

    const stars = Array.from({ length: 5 }, (_, i) => {
      return `<span class="star ${
        i < film.rating ? "filled" : ""
      }" data-id="${film.id}" data-rating="${i + 1}">★</span>`;
    }).join("");

    return `
      <div class="movie-poster-wrapper">
        <img
          src="${film.url}"
          class="movie-poster"
          onerror="this.src='https://dummyimage.com/220x320/cccccc/000000&text=No+Image'"
        >
      </div>

      <div class="movie-card-body">
        <h3 class="movie-title">${film.title}</h3>
        <p class="movie-year">${film.year || "Unknown"}</p>
        <p class="movie-director">${film.director}</p>

        <div class="movie-badges">
          ${statusBadge}
          ${favoriteBadge}
        </div>

        <div class="movie-rating">
          ${stars}
        </div>

        <div class="action-buttons">
          <button class="btn btn-sm btn-success mb-2 toggle-status" data-id="${film.id}">
            ${statusButtonText}
          </button>

          <button class="btn btn-sm btn-warning mb-2 toggle-favorite" data-id="${film.id}">
            ${favoriteButtonText}
          </button>

          <button class="btn btn-sm btn-danger delete-film" data-id="${film.id}">
            Delete
          </button>
        </div>
      </div>
    `;
  }

  static clearInputs(title, director, url) {
    title.value = "";
    director.value = "";
    url.value = "";
  }

  static displayMessage(message, type) {
    const cardBody = document.querySelector(".card-body");

    const div = document.createElement("div");
    div.className = `alert alert-${type}`;
    div.textContent = message;

    cardBody.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, 1500);
  }

  static loadAllFilms(films) {
    const filmList = document.getElementById("films");
    filmList.innerHTML = "";

    films.forEach(film => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = UI.createFilmCard(film);
      filmList.appendChild(card);
    });
  }

  static refreshFilms(filteredFilms = null) {
    const films = filteredFilms || Storage.getFilmsFromStorage();
    this.loadAllFilms(films);
    this.updateFilmCount(films.length);
  }

  static deleteFilmFromUI(element) {
    const card = element.closest(".movie-card");
    if (card) {
      card.remove();
    }
  }

  static clearAllFilmsFromUI() {
    const filmList = document.getElementById("films");
    filmList.innerHTML = "";
  }

  static updateFilmCount(count = null) {
    const filmCountElement = document.getElementById("film-count");

    if (filmCountElement) {
      const total =
        count !== null
          ? count
          : document.querySelectorAll("#films .movie-card").length;

      filmCountElement.textContent = total;
    }
  }

  static setActiveFilterButton(filter) {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {
      button.classList.remove("active");

      if (button.dataset.filter === filter) {
        button.classList.add("active");
      }
    });
  }
}