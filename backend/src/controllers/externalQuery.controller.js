export const fetchData = async (req, res) => {
  const { type, query } = req.params;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Query parameter is required",
    });
  }

  try {
    let apiUrl = "";
    let transformedResults = [];

    switch (type) {
      case "anime":
        // Jikan API for anime
        apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          query
        )}&limit=10`;
        const animeResponse = await fetch(apiUrl);
        const animeData = await animeResponse.json();

        transformedResults =
          animeData.data?.map((anime) => ({
            title: anime.title,
            year: anime.year || anime.aired?.prop?.from?.year || "Unknown",
            imageUrl:
              anime.images?.jpg?.image_url || "https://placehold.co/90x129",
            jikanId: anime.mal_id,
            released: anime.episodes || 0,
            status: anime.status || "Unknown",
          })) || [];
        break;

      case "manga":
        // Jikan API for manga
        apiUrl = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(
          query
        )}&limit=10`;
        const mangaResponse = await fetch(apiUrl);
        const mangaData = await mangaResponse.json();

        transformedResults =
          mangaData.data?.map((manga) => ({
            title: manga.title,
            year: manga.published?.prop?.from?.year || "Unknown",
            imageUrl:
              manga.images?.jpg?.image_url || "https://placehold.co/90x129",
            jikanId: manga.mal_id,
            released: manga.chapters || 0,
            status: manga.status || "Unknown",
          })) || [];
        break;

      case "shows":
        // TheMovieDB API for TV shows
        apiUrl = `https://api.themoviedb.org/3/search/tv?api_key=1b677d7d4a3baecc4648f523113e51bd&query=${encodeURIComponent(
          query
        )}&page=1`;
        const showsResponse = await fetch(apiUrl);
        const showsData = await showsResponse.json();

        transformedResults =
          showsData.results?.map((show) => ({
            title: show.name,
            year: show.first_air_date
              ? new Date(show.first_air_date).getFullYear()
              : "Unknown",
            imageUrl: show.poster_path
              ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
              : "https://placehold.co/90x129",
            jikanId: show.id, // Using TMDB ID as jikanId for consistency
            released: 0, // Would need additional API call to get episode count
            status: show.status || "Unknown",
          })) || [];
        break;

      case "comics":
        // ComicVine API for comics
        apiUrl = `https://comicvine.gamespot.com/api/search/?api_key=ea0c843c1fd61fc7d1c3f59b941e61780f11d7a2&format=json&resources=volume&query=${encodeURIComponent(
          query
        )}&limit=20`;
        const comicsResponse = await fetch(apiUrl);
        const comicsData = await comicsResponse.json();

        transformedResults =
          comicsData.results?.map((comic) => {
            console.log(`[ExternalQuery] Comic from search:`, {
              id: comic.id,
              name: comic.name,
              api_detail_url: comic.api_detail_url,
            });
            return {
              title: comic.name,
              year: comic.start_year || "Unknown",
              imageUrl:
                comic.image?.medium_url || "https://placehold.co/90x129",
              jikanId: comic.id, // Using ComicVine ID as jikanId for consistency
              released: comic.count_of_issues || 0,
              status: "Unknown", // ComicVine doesn't provide status in search
            };
          }) || [];
        break;

      case "books":
        // Google Books API
        apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=10`;
        const booksResponse = await fetch(apiUrl);
        const booksData = await booksResponse.json();

        transformedResults =
          booksData.items?.map((book) => ({
            title: book.volumeInfo?.title || "Unknown",
            year: book.volumeInfo?.publishedDate
              ? new Date(book.volumeInfo.publishedDate).getFullYear()
              : "Unknown",
            imageUrl:
              book.volumeInfo?.imageLinks?.thumbnail ||
              book.volumeInfo?.imageLinks?.smallThumbnail ||
              "https://placehold.co/90x129",
            jikanId: book.id,
            released: book.volumeInfo?.pageCount || 0, // Total pages for books
          })) || [];
        break;

      case "games":
        // RAWG API for games
        apiUrl = `https://api.rawg.io/api/games?key=023e16f4c9fe44c4b1c498ff067eb5aa&search=${encodeURIComponent(
          query
        )}&page_size=10`;
        const gamesResponse = await fetch(apiUrl);
        const gamesData = await gamesResponse.json();

        transformedResults =
          gamesData.results?.map((game) => ({
            title: game.name,
            year: game.released
              ? new Date(game.released).getFullYear()
              : "Unknown",
            imageUrl: game.background_image || "https://placehold.co/90x129",
            jikanId: game.id,
          })) || [];
        break;

      case "movies":
        // OMDB API for movies
        apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(
          query
        )}&apikey=5bcaca7e&type=movie&page=1`;
        const moviesResponse = await fetch(apiUrl);
        const moviesData = await moviesResponse.json();

        transformedResults =
          moviesData.Search?.map((movie) => ({
            title: movie.Title,
            year: movie.Year || "Unknown",
            imageUrl:
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://placehold.co/90x129",
            jikanId: movie.imdbID,
          })) || [];
        break;

      default:
        return res.status(400).json({
          success: false,
          message:
            "Invalid media type. Supported types: anime, manga, shows, comics, books, games, movies",
        });
    }

    res.status(200).json({
      success: true,
      data: transformedResults,
      count: transformedResults.length,
    });
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data from external API",
      error: error.message,
    });
  }
};

// books - https://www.googleapis.com/books/v1/volumes?q=harry+potter
// games - https://api.rawg.io/api/games?key=023e16f4c9fe44c4b1c498ff067eb5aa&search=spider-man
// movies https://www.omdbapi.com/?s=jurassic park&apikey=5bcaca7e&type=movie
