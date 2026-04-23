class Storage {
  static addFilmToStorage(newFilm) {
    const films = this.getFilmsFromStorage();
    films.push(newFilm);
    localStorage.setItem("films", JSON.stringify(films));
  }

  static getFilmsFromStorage() {
    return JSON.parse(localStorage.getItem("films")) || [];
  }

  static isFilmExists(newFilm) {
    return this.getFilmsFromStorage().some(
      film => film.title.toLowerCase() === newFilm.title.toLowerCase()
    );
  }

  static deleteFilmFromStorage(filmId) {
    const films = this.getFilmsFromStorage().filter(
      film => film.id !== filmId
    );
    localStorage.setItem("films", JSON.stringify(films));
  }

  static clearAllFilmsFromStorage() {
    localStorage.removeItem("films");
  }

  static toggleFavorite(filmId) {
    const films = this.getFilmsFromStorage().map(film => {
      if (film.id === filmId) {
        film.favorite = !film.favorite;
      }
      return film;
    });

    localStorage.setItem("films", JSON.stringify(films));
  }

  static toggleStatus(filmId) {
    const films = this.getFilmsFromStorage().map(film => {
      if (film.id === filmId) {
        film.status = film.status === "watchlist" ? "watched" : "watchlist";
      }
      return film;
    });

    localStorage.setItem("films", JSON.stringify(films));
  }

  static updateRating(filmId, rating) {
    const films = this.getFilmsFromStorage().map(film => {
      if (film.id === filmId) {
        film.rating = rating;
      }
      return film;
    });

    localStorage.setItem("films", JSON.stringify(films));
  }
}