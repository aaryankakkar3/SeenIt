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
            episodesTotal: anime.episodes || 0,
            animeStatus: anime.status || "Unknown",
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
            chaptersTotal: manga.chapters || 0,
            mangaStatus: manga.status || "Unknown",
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
            episodesTotal: 0, // Would need additional API call to get episode count
            showStatus: show.status || "Unknown",
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
          comicsData.results?.map((comic) => ({
            title: comic.name,
            year: comic.start_year || "Unknown",
            imageUrl: comic.image?.medium_url || "https://placehold.co/90x129",
            jikanId: comic.id, // Using ComicVine ID as jikanId for consistency
            issuesTotal: comic.count_of_issues || 0,
            comicStatus: "Unknown", // ComicVine doesn't provide status in search
          })) || [];
        break;

      default:
        return res.status(400).json({
          success: false,
          message:
            "Invalid media type. Supported types: anime, manga, shows, comics",
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
