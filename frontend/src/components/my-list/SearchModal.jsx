import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useExternalStore } from "../../store/external.store";
import { useAnimeStore } from "../../store/anime.store";
import { useMangaStore } from "../../store/manga.store";
import { useShowsStore } from "../../store/shows.store";
import { useComicsStore } from "../../store/comics.store";
import { useBookStore } from "../../store/books.store";
import { useGameStore } from "../../store/games.store";
import { useMovieStore } from "../../store/movies.store";
import { MEDIA_TYPES } from "../../lib/mediaConfig";
import QueryItem from "./QueryItem";

export default function SearchModal({
  isOpen,
  onClose,
  onSelectResult,
  mediaType = "animes",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { queryResults, isSearching, getQueryResults, clearQueryResults } =
    useExternalStore();

  // Get the appropriate store based on media type
  const getStoreForMediaType = (type) => {
    switch (type) {
      case "animes":
        return useAnimeStore();
      case "mangas":
        return useMangaStore();
      case "shows":
        return useShowsStore();
      case "comics":
        return useComicsStore();
      case "books":
        return useBookStore();
      case "games":
        return useGameStore();
      case "movies":
        return useMovieStore();
      default:
        return useAnimeStore();
    }
  };

  const { entries } = getStoreForMediaType(mediaType);

  // Get media configuration
  const mediaConfig = MEDIA_TYPES[mediaType] || MEDIA_TYPES.animes;

  // Convert mediaType to API type based on backend expectations
  const getApiType = (type) => {
    switch (type) {
      case "animes":
        return "anime";
      case "mangas":
        return "manga";
      case "shows":
        return "shows";
      case "comics":
        return "comics";
      case "books":
        return "books";
      case "games":
        return "games";
      case "movies":
        return "movies";
      default:
        return "anime";
    }
  };

  const apiType = getApiType(mediaType);

  // Clear search query and results when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      clearQueryResults();
    }
  }, [isOpen, clearQueryResults]);

  // Get user entry IDs from entries
  const userEntryIds = entries.map((entry) => entry.jikanId);

  // Filter out already added entries
  const filteredResults = queryResults.filter(
    (result) => !userEntryIds.includes(result.jikanId)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* SearchModal Content */}
      <div className="relative z-20 w-[528px] h-[582px] max-sm:w-full max-sm:h-full max-sm:p-[32px] bg-medium flex flex-col p-[64px] gap-[12px]">
        <div className="flex flex-row items-center justify-between">
          <div className="text-h2 text-text">Add New {mediaConfig.name}</div>
          <X
            className="text-textmuted w-[20px] h-[20px] cursor-pointer hover:text-text"
            onClick={onClose}
          />
        </div>
        <div className="flex flex-row gap-[8px] ">
          <div className="w-full h-[32px] bg-light px-[12px]">
            <input
              autoComplete="off"
              type="text"
              id="query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && getQueryResults(searchQuery, apiType)
              }
              placeholder={`Search for ${mediaConfig.name.toLowerCase()}`}
              className="w-[100%] h-[100%] placeholder:text-textmuted focus:outline-none"
            />
          </div>
          <button
            onClick={() => getQueryResults(searchQuery, apiType)}
            disabled={isSearching}
            className="px-[12px] py-[6px] text-dark bg-primary hover:opacity-90 flex justify-center items-center font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
        <div className="h-[360px] w-[400px] max-sm:h-full max-sm:w-full p-[12px] bg-light flex flex-col overflow-y-auto gap-[4px]">
          {isSearching ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-textmuted" />
            </div>
          ) : (
            <>
              {filteredResults.length === 0 && queryResults.length > 0 && (
                <div className="text-textmuted p-4 text-center">
                  All search results are already in your list
                </div>
              )}
              {filteredResults.map((queryResult, idx) => (
                <QueryItem
                  key={idx}
                  queryResult={queryResult}
                  onSelect={onSelectResult}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
