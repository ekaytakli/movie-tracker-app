class Film {
  constructor(title, director, url, year = "Bilinmiyor") {
    this.id = Date.now();
    this.title = title;
    this.director = director;
    this.url = url;
    this.year = year;
    this.status = "watchlist";
    this.favorite = false;
    this.rating = 0;
    this.createdAt = new Date().toISOString();
  }
}