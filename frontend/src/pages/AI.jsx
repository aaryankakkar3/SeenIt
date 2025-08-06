import Navbar from "../components/Navbar";
import { useRef, useEffect, useState } from "react";
import { useOpenAIStore } from "../store/openaiapi.store";
import { useAnimeStore } from "../store/anime.store";
import { useMangaStore } from "../store/manga.store";
import { useShowsStore } from "../store/shows.store";
import { useComicsStore } from "../store/comics.store";
import { useBookStore } from "../store/books.store";
import { useGameStore } from "../store/games.store";
import { useMovieStore } from "../store/movies.store";
import AIResultsModal from "../components/AIResultsModal";

function AI() {
  const textareaRef = useRef(null);

  // Store functions
  const { getAISuggestions, isLoading, suggestions, error, clearSuggestions } =
    useOpenAIStore();

  // Media stores for pre-fetching logged data
  const animeStore = useAnimeStore();
  const mangaStore = useMangaStore();
  const showsStore = useShowsStore();
  const comicsStore = useComicsStore();
  const booksStore = useBookStore();
  const gamesStore = useGameStore();
  const moviesStore = useMovieStore();

  // State management
  const [context, setContext] = useState("");
  const [selectedMediaTypes, setSelectedMediaTypes] = useState([]);
  const [genresWanted, setGenresWanted] = useState([]);
  const [genresUnwanted, setGenresUnwanted] = useState([]);
  const [useLoggedData, setUseLoggedData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loggedData, setLoggedData] = useState(null);
  const [isLoadingLoggedData, setIsLoadingLoggedData] = useState(true);

  // Media types and genres data
  const mediaTypes = [
    "Anime",
    "Manga",
    "Shows",
    "Movies",
    "Games",
    "Books",
    "Comics",
  ];

  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Animation",
    "Documentary",
    "Crime",
    "Historical",
    "Musical",
    "War",
    "Western",
    "Biography",
    "Family",
    "Sport",
    "Supernatural",
    "Psychological",
    "Slice of Life",
    "Mecha",
    "Isekai",
    "School",
    "Military",
    "Magic",
    "Vampire",
    "Zombie",
    "Post-Apocalyptic",
    "Cyberpunk",
  ];

  const handleTextareaChange = (e) => {
    const textarea = e.target;
    const value = e.target.value;

    // Enforce 300 character limit
    if (value.length <= 300) {
      setContext(value);
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set height to scrollHeight to fit content
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  const handleTextareaInput = (e) => {
    handleTextareaChange(e);
  };

  // Auto-resize on mount for placeholder text
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, []);

  // Pre-fetch all logged data when component mounts
  useEffect(() => {
    const fetchAllLoggedData = async () => {
      try {
        setIsLoadingLoggedData(true);

        // Fetch data from all media stores in parallel
        await Promise.all([
          animeStore.getEntries(),
          mangaStore.getEntries(),
          showsStore.getEntries(),
          comicsStore.getEntries(),
          booksStore.getEntries(),
          gamesStore.getEntries(),
          moviesStore.getEntries(),
        ]);

        // Compile the logged data into a structured object
        const compiledLoggedData = {
          animes: animeStore.entries.map((entry) => ({
            title: entry.title,
            status: entry.status,
            progress: entry.progress,
            total: entry.totalEpisodes,
            genres: entry.genres || [],
            year: entry.year || null,
          })),
          manga: mangaStore.entries.map((entry) => ({
            title: entry.title,
            status: entry.status,
            progress: entry.progress,
            total: entry.totalChapters,
            genres: entry.genres || [],
            year: entry.year || null,
          })),
          shows: showsStore.entries.map((entry) => ({
            title: entry.title,
            status: entry.status,
            progress: entry.progress,
            total: entry.totalEpisodes,
            genres: entry.genres || [],
            year: entry.year || null,
          })),
          comics: comicsStore.entries.map((entry) => ({
            title: entry.title,
            status: entry.status,
            progress: entry.progress,
            total: entry.totalIssues,
            genres: entry.genres || [],
            year: entry.year || null,
          })),
          movies: moviesStore.entries.map((entry) => ({
            title: entry.title,
            status: entry.status,
            genres: entry.genres || [],
            year: entry.year || null,
          })),
          books: booksStore.entries.map((entry) => ({
            title: entry.title,
            status: entry.status,
            progress: entry.progress,
            total: entry.totalPages,
            genres: entry.genres || [],
            year: entry.year || null,
          })),
          games: gamesStore.entries.map((entry) => ({
            title: entry.title,
            status: entry.status,
            genres: entry.genres || [],
            year: entry.year || null,
          })),
        };

        setLoggedData(compiledLoggedData);
        console.log("Logged data fetched and cached:", compiledLoggedData);
      } catch (error) {
        console.error("Error fetching logged data:", error);
        setLoggedData(null);
      } finally {
        setIsLoadingLoggedData(false);
      }
    };

    fetchAllLoggedData();
  }, []);

  const handleMediaTypeClick = (mediaType) => {
    setSelectedMediaTypes((prev) =>
      prev.includes(mediaType)
        ? prev.filter((type) => type !== mediaType)
        : [...prev, mediaType]
    );
  };

  const handleGenreClick = (genre) => {
    if (genresWanted.includes(genre)) {
      // If wanted, move to unwanted
      setGenresWanted((prev) => prev.filter((g) => g !== genre));
      setGenresUnwanted((prev) => [...prev, genre]);
    } else if (genresUnwanted.includes(genre)) {
      // If unwanted, remove from both (unselected)
      setGenresUnwanted((prev) => prev.filter((g) => g !== genre));
    } else {
      // If unselected, add to wanted
      setGenresWanted((prev) => [...prev, genre]);
    }
  };

  const getGenreStyle = (genre) => {
    if (genresWanted.includes(genre)) {
      return "bg-primary text-dark cursor-pointer";
    } else if (genresUnwanted.includes(genre)) {
      return "bg-red-500 text-white cursor-pointer";
    } else {
      return "cursor-pointer hover:bg-light";
    }
  };

  const getMediaTypeStyle = (mediaType) => {
    return selectedMediaTypes.includes(mediaType)
      ? "bg-primary text-dark cursor-pointer"
      : "cursor-pointer hover:bg-light";
  };

  const handleGetSuggestions = async () => {
    const data = {
      context: context,
      mediaTypes: selectedMediaTypes,
      genresWanted: genresWanted,
      genresUnwanted: genresUnwanted,
      loggedData: useLoggedData && loggedData ? loggedData : false,
    };

    console.log("Sending data to AI suggestions:", data);

    const result = await getAISuggestions(data);

    // Show modal regardless of success/failure to display results or error
    if (result) {
      setShowModal(true);
    }
  };

  return (
    <div className="px-[64px] py-[32px] flex flex-col gap-[40px] ">
      <Navbar />
      <div className="flex flex-col gap-[32px] ">
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-row justify-between items-center">
            <div className="text-h2">Give Us Context</div>
            <div className="text-textmuted text-p2">{context.length}/300</div>
          </div>
          <div className="p-[16px] border border-text ">
            <textarea
              ref={textareaRef}
              placeholder="Use this only to give extra details that aren't covered by the filters below- like a specific mood, pacing, media you've really liked, or anything you want us to avoid."
              className="w-full bg-transparent focus:outline-none placeholder:text-textmuted overflow-hidden resize-none"
              onInput={handleTextareaInput}
              value={context}
              maxLength={300}
              rows={1}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[16px]">
          <div className="text-h2">Filters</div>
          <div className="flex flex-row gap-[16px] w-full">
            <div className="w-[33%] border border-textmuted flex flex-col gap-[8px] p-[16px]">
              <div className="text-text text-p1 ">Media Type</div>
              <div className="flex flex-col text-text text-p2 gap-[4px]">
                {mediaTypes.map((mediaType) => (
                  <div
                    key={mediaType}
                    className={`px-[8px] py-[4px] rounded transition-colors ${getMediaTypeStyle(
                      mediaType
                    )}`}
                    onClick={() => handleMediaTypeClick(mediaType)}
                  >
                    {mediaType}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[67%] border border-textmuted flex flex-col gap-[8px] p-[16px]">
              <div className="text-text text-p1 ">Genres</div>
              <div className="grid grid-cols-4 text-text text-p2 gap-[4px]">
                {genres.map((genre) => (
                  <div
                    key={genre}
                    className={`px-[8px] py-[4px] rounded transition-colors ${getGenreStyle(
                      genre
                    )}`}
                    onClick={() => handleGenreClick(genre)}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-[8px] items-center">
          <div className="text-text text-p1">
            Do you want to use your logged data to improve suggestions?
          </div>
          {isLoadingLoggedData && (
            <div className="text-textmuted text-p2 italic">
              (Loading logged data...)
            </div>
          )}
          <button
            className={`h-[20px] w-[20px] border cursor-pointer transition-colors ${
              useLoggedData
                ? "bg-primary border-primary"
                : "border-textmuted hover:border-text"
            } ${isLoadingLoggedData ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setUseLoggedData(!useLoggedData)}
            disabled={isLoadingLoggedData}
          >
            {useLoggedData && (
              <div className="text-dark text-center leading-none text-sm font-bold">
                ✓
              </div>
            )}
          </button>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            type="submit"
            onClick={handleGetSuggestions}
            disabled={isLoading}
            className="px-[16px] py-[8px] w-fit h-fit text-p1  bg-primary flex justify-center items-center text-dark font-semibold cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Getting Suggestions..." : "Get Suggestions"}
          </button>
        </div>
      </div>
      <AIResultsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        suggestions={suggestions}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default AI;
