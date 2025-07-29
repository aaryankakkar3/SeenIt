import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useAnimeExternalStore } from "../../store/anime.external.store";
import { useAnimeBackendStore } from "../../store/anime.backend.store";
import QueryItem from "./QueryItem";

export default function SearchModal({ isOpen, onClose, onSelectResult }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { queryResults, isSearching, getQueryResults, clearQueryResults } =
    useAnimeExternalStore();
  const { entries } = useAnimeBackendStore();

  // Clear search query and results when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      clearQueryResults();
    }
  }, [isOpen, clearQueryResults]);

  // Get user anime IDs from entries
  const userAnimeIds = entries.map((entry) => entry.jikanId);

  // Filter out already added anime
  const filteredResults = queryResults.filter(
    (result) => !userAnimeIds.includes(result.jikanId)
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
      <div className="relative z-20 w-[528px] h-[582px] bg-medium flex flex-col p-[64px] gap-[12px]">
        <div className="flex flex-row items-center justify-between">
          <div className="text-h2 text-text">Add New Anime</div>
          <X
            className="text-textmuted w-[20px] h-[20px] cursor-pointer hover:text-text"
            onClick={onClose}
          />
        </div>
        <div className="flex flex-row gap-[8px] ">
          <div className="w-[314px] h-[32px] bg-light px-[12px]">
            <input
              autoComplete="off"
              type="text"
              id="query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && getQueryResults(searchQuery)
              }
              placeholder="Search for anime"
              className="w-[100%] h-[100%] placeholder:text-textmuted focus:outline-none"
            />
          </div>
          <button
            onClick={() => getQueryResults(searchQuery)}
            disabled={isSearching}
            className="h-[32px] w-[78px] text-dark bg-primary hover:opacity-90 flex justify-center items-center font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
        <div className="h-[360px] w-[400px] bg-light flex flex-col overflow-y-auto">
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
