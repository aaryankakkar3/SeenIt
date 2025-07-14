import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAnimeExternalStore } from "../../store/anime.external.store";
import { useAnimeBackendStore } from "../../store/anime.backend.store";
import QueryItem from "./QueryItem";

export default function SearchModal({ isOpen, onClose, onSelectResult }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { queryResults, getQueryResults } = useAnimeExternalStore();
  const { entries } = useAnimeBackendStore();

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
        className="fixed inset-0 bg-dark-75 transition-opacity"
        onClick={onClose}
      />

      {/* SearchModal Content */}
      <div className="relative z-20 w-[528px] h-[582px] bg-bg flex flex-col p-[64px] gap-[12px]">
        <div className="flex flex-row items-center justify-between">
          <div className="text-h2 text-text">Add New Anime</div>
          <X
            className="text-muted w-[20px] h-[20px] cursor-pointer"
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
              className="w-[100%] h-[100%] placeholder:text-muted focus:outline-none"
            />
          </div>
          <button
            onClick={() => getQueryResults(searchQuery)}
            className="h-[32px] w-[78px] text-bg-dark bg-primary flex justify-center items-center font-semibold cursor-pointer"
          >
            Search
          </button>
        </div>
        <div className="h-[360px] w-[400px] bg-light flex flex-col overflow-y-auto">
          {filteredResults.length === 0 && queryResults.length > 0 && (
            <div className="text-muted p-4 text-center">
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
        </div>
      </div>
    </div>
  );
}
