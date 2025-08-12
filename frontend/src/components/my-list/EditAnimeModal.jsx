import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAnimeStore } from "../../store/anime.store";
import { useMangaStore } from "../../store/manga.store";
import { useShowsStore } from "../../store/shows.store";
import { useComicsStore } from "../../store/comics.store";
import { useBookStore } from "../../store/books.store";
import { useGameStore } from "../../store/games.store";
import { useMovieStore } from "../../store/movies.store";
import { useExternalStore } from "../../store/external.store";
import { MEDIA_TYPES } from "../../lib/mediaConfig";
import { toast } from "react-hot-toast";

// Move component functions outside to prevent recreation on every render
function YearBox({ year }) {
  return (
    <div className="flex flex-col gap-[6px] w-full min-w-0">
      <div className="font-semibold truncate w-full">Year</div>
      <div className="bg-light w-full h-[40px] px-[12px] flex items-center">
        {year || "Unknown"}
      </div>
    </div>
  );
}

function StatusBox({ mediaStatus }) {
  return (
    <div className="flex flex-col gap-[6px] w-full min-w-0">
      <div className="font-semibold truncate w-full">Status</div>
      <div className="bg-light w-full h-[40px] px-[12px] flex items-center">
        <div className="truncate w-full">{mediaStatus}</div>
      </div>
    </div>
  );
}

function ReleasedBox({ mediaConfig, totalCount }) {
  return (
    <div className="flex flex-col gap-[6px] w-full min-w-0">
      <div className="font-semibold truncate w-full">
        Released {mediaConfig.releasedLabel}
      </div>
      <div className="bg-light w-full h-[40px] px-[12px] flex items-center min-w-0">
        {totalCount || "Unknown"}
      </div>
    </div>
  );
}

function ConsumedBox({
  mediaConfig,
  watchedEp,
  handleEpisodesWatchedChange,
  handleSubmit,
  totalCount,
}) {
  return (
    <div className="flex flex-col gap-[6px] w-full min-w-0 text-text">
      <div className="font-semibold truncate w-full">
        {mediaConfig.consumedLabel}
      </div>
      <div className="w-full h-[40px] bg-light px-[12px] min-w-0">
        <input
          autoComplete="off"
          type="number"
          value={watchedEp}
          onChange={handleEpisodesWatchedChange}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          id="episodesWatched"
          min="0"
          max={totalCount > 0 ? totalCount : undefined}
          placeholder={`0 - ${totalCount || "?"}`}
          className="w-[100%] h-[100%] placeholder:text-textmuted focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

function RatingBox({ rating, handleRatingChange, handleSubmit }) {
  return (
    <div className="flex flex-col gap-[6px] w-full min-w-0 text-text">
      <div className="font-semibold truncate w-full">Rating</div>
      <div className="w-full h-[40px] bg-light px-[12px] min-w-0">
        <input
          autoComplete="off"
          type="number"
          id="rating"
          onChange={handleRatingChange}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          value={rating}
          min="0"
          max="5"
          step="0.1"
          placeholder="0 - 5"
          className="w-[100%] h-[100%] placeholder:text-textmuted focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

function ProgressBox({ progress, handleProgressChange, handleSubmit }) {
  return (
    <div className="flex flex-col gap-[6px] w-full min-w-0 text-text">
      <div className="font-semibold truncate w-full">Progress %</div>
      <div className="w-full h-[40px] bg-light px-[12px]">
        <input
          autoComplete="off"
          type="number"
          value={progress}
          onChange={handleProgressChange}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          min="0"
          max="100"
          placeholder="0 - 100"
          className="w-[100%] h-[100%] placeholder:text-textmuted focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

function DivOne({
  currentSection,
  year,
  mediaStatus,
  rating,
  handleRatingChange,
  handleSubmit,
  watchedEp,
  handleEpisodesWatchedChange,
}) {
  if (
    currentSection === "animes" ||
    currentSection === "mangas" ||
    currentSection === "shows" ||
    currentSection === "comics"
  ) {
    return (
      <div className="flex flex-row gap-[12px] w-full min-w-0">
        <YearBox year={year} />
        <StatusBox mediaStatus={mediaStatus} />
      </div>
    );
  } else if (currentSection === "games") {
    return (
      <div className="flex flex-row gap-[12px] w-full min-w-0">
        <YearBox year={year} />
        <RatingBox
          rating={rating}
          handleRatingChange={handleRatingChange}
          handleSubmit={handleSubmit}
        />
        <ProgressBox
          progress={watchedEp}
          handleProgressChange={handleEpisodesWatchedChange}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  } else {
    return (
      <div className="flex flex-row gap-[12px] w-full min-w-0">
        <YearBox year={year} />
        <RatingBox
          rating={rating}
          handleRatingChange={handleRatingChange}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }
}

function DivTwo({
  currentSection,
  mediaConfig,
  totalCount,
  watchedEp,
  handleEpisodesWatchedChange,
  handleSubmit,
  rating,
  handleRatingChange,
}) {
  if (
    currentSection === "animes" ||
    currentSection === "mangas" ||
    currentSection === "shows" ||
    currentSection === "comics"
  ) {
    return (
      <div className="flex flex-row gap-[12px] w-full min-w-0">
        <ReleasedBox mediaConfig={mediaConfig} totalCount={totalCount} />
        <ConsumedBox
          mediaConfig={mediaConfig}
          watchedEp={watchedEp}
          handleEpisodesWatchedChange={handleEpisodesWatchedChange}
          handleSubmit={handleSubmit}
          totalCount={totalCount}
        />
        <RatingBox
          rating={rating}
          handleRatingChange={handleRatingChange}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  } else if (currentSection === "books") {
    return (
      <div className="flex flex-row gap-[12px] w-full min-w-0">
        <ReleasedBox mediaConfig={mediaConfig} totalCount={totalCount} />
        <ConsumedBox
          mediaConfig={mediaConfig}
          watchedEp={watchedEp}
          handleEpisodesWatchedChange={handleEpisodesWatchedChange}
          handleSubmit={handleSubmit}
          totalCount={totalCount}
        />
      </div>
    );
  }
}

export default function EditAnimeModal({
  isOpen,
  onClose,
  editingEntry,
  selectedQueryResult,
  onCloseAll,
  currentSection,
}) {
  const [selectedStatus, setSelectedStatus] = useState("Planned");
  const [rating, setRating] = useState(0);
  const [watchedEp, setWatchedEp] = useState("");
  const [enhancedData, setEnhancedData] = useState(null);

  // Get the appropriate store functions based on current section
  const animeStore = useAnimeStore();
  const mangaStore = useMangaStore();
  const showsStore = useShowsStore();
  const comicsStore = useComicsStore();
  const bookStore = useBookStore();
  const gameStore = useGameStore();
  const movieStore = useMovieStore();

  // Get the correct store and functions based on section
  const getStoreFunctions = (section) => {
    switch (section) {
      case "animes":
        return {
          createEntry: animeStore.createEntry,
          editEntry: animeStore.editEntry,
          deleteEntry: animeStore.deleteEntry,
          preFetchCache: animeStore.preFetchCache,
        };
      case "mangas":
        return {
          createEntry: mangaStore.createEntry,
          editEntry: mangaStore.editEntry,
          deleteEntry: mangaStore.deleteEntry,
          preFetchCache: mangaStore.preFetchCache,
        };
      case "shows":
        return {
          createEntry: showsStore.createEntry,
          editEntry: showsStore.editEntry,
          deleteEntry: showsStore.deleteEntry,
          preFetchCache: showsStore.preFetchCache,
        };
      case "comics":
        return {
          createEntry: comicsStore.createEntry,
          editEntry: comicsStore.editEntry,
          deleteEntry: comicsStore.deleteEntry,
          preFetchCache: comicsStore.preFetchCache,
        };
      case "books":
        return {
          createEntry: bookStore.createEntry,
          editEntry: bookStore.editEntry,
          deleteEntry: bookStore.deleteEntry,
          preFetchCache: bookStore.preFetchCache,
        };
      case "games":
        return {
          createEntry: gameStore.createEntry,
          editEntry: gameStore.editEntry,
          deleteEntry: gameStore.deleteEntry,
          preFetchCache: gameStore.preFetchCache,
        };
      case "movies":
        return {
          createEntry: movieStore.createEntry,
          editEntry: movieStore.editEntry,
          deleteEntry: movieStore.deleteEntry,
          preFetchCache: movieStore.preFetchCache,
        };
      default:
        return {
          createEntry: animeStore.createEntry,
          editEntry: animeStore.editEntry,
          deleteEntry: animeStore.deleteEntry,
          preFetchCache: animeStore.preFetchCache,
        };
    }
  };

  const { createEntry, editEntry, deleteEntry } =
    getStoreFunctions(currentSection);

  const { clearQueryResults } = useExternalStore();

  // Get media configuration for current section
  const mediaConfig = MEDIA_TYPES[currentSection] || MEDIA_TYPES.animes;

  const statusOptions = ["Planned", "Active", "Completed", "Dropped"];

  // Determine if we're editing an existing entry or adding a new one
  const isEditing = editingEntry !== null;
  const modalData = isEditing
    ? editingEntry
    : enhancedData || selectedQueryResult;

  // Destructure the selected query result or editing entry
  const {
    title,
    year,
    imageUrl,
    released,
    status,
    // Legacy field names for backward compatibility
    episodesTotal,
    chaptersTotal,
    issuesTotal,
    animeStatus,
    mangaStatus,
    showStatus,
    comicStatus,
  } = modalData || {};

  // Get the correct values based on media type (check new standardized fields first)
  const totalCount = modalData?.released || episodesTotal || 0;
  const mediaStatus = modalData?.status || animeStatus || "Unknown";

  // Pre-fill form when editing existing entry
  useEffect(() => {
    if (isEditing && editingEntry) {
      setSelectedStatus(editingEntry.yourStatus || "Planned");
      // Get the correct consumed/progress value based on media type
      let watchedValue = 0;
      if (mediaConfig.consumedField === "progress") {
        watchedValue = editingEntry.progress || 0;
      } else if (mediaConfig.consumedField === "consumed") {
        watchedValue = editingEntry.consumed || 0;
      } else {
        // Fallback for legacy field names
        watchedValue = editingEntry[mediaConfig.consumedField] || 0;
      }
      setWatchedEp(watchedValue.toString());
      setRating(editingEntry.rating?.toString() || "0");
    } else {
      // Reset form for new entry
      setSelectedStatus("Planned");
      setWatchedEp("");
      setRating("0");
    }
  }, [isEditing, editingEntry, isOpen, selectedQueryResult, mediaConfig]);

  // Pre-fetch cache data for shows and comics when selectedQueryResult changes
  useEffect(() => {
    const preFetchCacheData = async () => {
      // Only pre-fetch for shows and comics, and only when we have a selectedQueryResult (not editing)
      if (
        !isEditing &&
        selectedQueryResult &&
        (currentSection === "shows" || currentSection === "comics") &&
        selectedQueryResult.jikanId
      ) {
        console.log(
          "Pre-fetching cache data for:",
          selectedQueryResult.jikanId,
          "Section:",
          currentSection
        );
        console.log("Selected query result:", selectedQueryResult);
        const storeFunctions = getStoreFunctions(currentSection);
        if (storeFunctions.preFetchCache) {
          try {
            const cachedData = await storeFunctions.preFetchCache(
              selectedQueryResult.jikanId
            );
            console.log(
              "Pre-fetch completed successfully, cached data:",
              cachedData
            );
            if (cachedData) {
              // Merge the cached data with the original selectedQueryResult
              const enhanced = {
                ...selectedQueryResult,
                ...cachedData,
              };
              setEnhancedData(enhanced);
              console.log("Enhanced data set:", enhanced);
              console.log("Modal data will now be:", enhanced);
            }
          } catch (error) {
            console.error("Pre-fetch failed:", error);
          }
        } else {
          console.log("No preFetchCache function found");
        }
      } else {
        console.log("Pre-fetch conditions not met:", {
          isEditing,
          hasSelectedResult: !!selectedQueryResult,
          currentSection,
          hasJikanId: selectedQueryResult?.jikanId,
        });
        // Reset enhanced data when not applicable
        setEnhancedData(null);
      }
    };

    preFetchCacheData();
  }, [selectedQueryResult, currentSection, isEditing]);

  // Frontend validation
  const validateInput = () => {
    const watchedEpNum = parseInt(watchedEp) || 0;
    const ratingNum = parseFloat(rating) || 0;
    const errors = [];

    if (watchedEpNum < 0) {
      errors.push(`${mediaConfig.watchedLabel} cannot be negative`);
    }

    if (totalCount > 0 && watchedEpNum > totalCount) {
      errors.push(
        `${
          mediaConfig.watchedLabel
        } cannot exceed total ${mediaConfig.releasedLabel.toLowerCase()} (${totalCount})`
      );
    }

    if (ratingNum < 0 || ratingNum > 5) {
      errors.push("Rating must be between 0 and 5");
    }

    return errors;
  };

  // Handle episodes watched input with validation
  const handleEpisodesWatchedChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setWatchedEp(value);

      // Auto-complete logic
      const watchedNum = parseInt(value) || 0;
      if (
        totalCount > 0 &&
        watchedNum >= totalCount &&
        selectedStatus !== "Completed"
      ) {
        setSelectedStatus("Completed");
        setWatchedEp(totalCount.toString());
      }
    }
  };

  // Handle rating input with validation
  const handleRatingChange = (e) => {
    const value = e.target.value;

    // Allow empty input or numbers between 0 and 5
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) &&
        parseFloat(value) >= 0 &&
        parseFloat(value) <= 5)
    ) {
      setRating(value);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate input before submission
    const validationErrors = validateInput();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    try {
      // Prepare media data with correct field mapping
      const mediaData = {
        ...modalData,
        yourStatus: selectedStatus,
        rating: parseFloat(rating) || 0,
      };

      // Map the progress field based on media type
      if (mediaConfig.consumedField === "progress") {
        // For games - use progress field (0-100%)
        mediaData.progress = parseInt(watchedEp) || 0;
      } else if (mediaConfig.consumedField === "consumed") {
        // For books and other media - use consumed field
        mediaData.consumed = parseInt(watchedEp) || 0;
      }

      if (isEditing) {
        await editEntry(editingEntry._id, mediaData);
      } else {
        await createEntry(mediaData);
        // Clear search results and reset form when adding new entry
        clearQueryResults();
      }

      onCloseAll();
    } catch (error) {
      console.error(`Error saving ${mediaConfig.name.toLowerCase()}:`, error);
      toast.error(`Failed to save ${mediaConfig.name.toLowerCase()}.`);
    }
  };

  // Handle status change with auto-fill episodes
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (status === "Completed" && totalCount > 0) {
      setWatchedEp(totalCount.toString());
    }
  };

  if (!isOpen || !modalData) return null;

  let imageHeight = "h-[381px]";
  if (currentSection === "movies" || currentSection === "games") {
    if (window.innerWidth <= 1024) {
      imageHeight = "h-[355px]";
    } else {
      imageHeight = "h-[300px]";
    }
  } else {
    if (window.innerWidth <= 1024) {
      imageHeight = "h-[433px]";
    } else {
      imageHeight = "h-[381px]";
    }
  }

  // h-[433px]

  return (
    <div className="overflow-y-auto fixed inset-0 z-50 flex items-center justify-center max-sm:items-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark opacity-75 transition-opacity"
        onClick={onCloseAll}
      />

      {/* EditAnimeModal Content */}
      <div className="relative z-60 bg-medium flex flex-col p-[64px] gap-[32px] max-md:w-full max-md:p-[32px] max-sm:overflow-y-auto justify-center max-sm:justify-start">
        <div className="flex flex-row justify-between">
          <div className="text-h2 text-text">
            {isEditing
              ? `Edit ${mediaConfig.name}`
              : `Add New ${mediaConfig.name}`}
          </div>
          <X
            className="text-textmuted w-[20px] h-[20px] cursor-pointer hover:text-text"
            onClick={onCloseAll}
          />
        </div>
        <div className="flex flex-row gap-[32px] max-md:gap-[16px] w-full max-sm:flex-col">
          <img
            src={imageUrl}
            className={`object-cover aspect-[267/381] ${imageHeight} max-sm:w-full max-sm:h-auto max-sm:object-contain max-sm:aspect-auto`}
          />
          <div className="flex flex-col gap-[32px] h-fit w-full max-sm:flex-shrink-0">
            <div className="flex flex-col gap-[16px] text-textmuted text-p2">
              <div className="flex flex-col gap-[6px]">
                <div className="font-semibold">Name</div>
                <div className="bg-light w-full h-[40px] px-[12px] flex items-center">
                  {title || "Unknown Title"}
                </div>
              </div>
              <DivOne
                currentSection={currentSection}
                year={year}
                mediaStatus={mediaStatus}
                rating={rating}
                handleRatingChange={handleRatingChange}
                handleSubmit={handleSubmit}
                watchedEp={watchedEp}
                handleEpisodesWatchedChange={handleEpisodesWatchedChange}
              />

              {/* YourStatus Bar */}
              <div className="flex flex-row gap-[12px] w-full">
                <div className="flex flex-col gap-[6px] w-full text-text">
                  <div className="font-semibold">Your Status</div>
                  <div className="flex flex-row max-md:grid max-md:grid-cols-2 gap-[12px]">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`bg-light w-full h-[40px] px-[12px] flex items-center cursor-pointer hover:border-text transition-colors ${
                          selectedStatus === status
                            ? "border-2 border-text"
                            : "border-2 border-transparent"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <DivTwo
                currentSection={currentSection}
                mediaConfig={mediaConfig}
                totalCount={totalCount}
                watchedEp={watchedEp}
                handleEpisodesWatchedChange={handleEpisodesWatchedChange}
                handleSubmit={handleSubmit}
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
            </div>
            <div className="w-full h-[40px] flex flex-row gap-[12px]">
              <button
                onClick={handleSubmit}
                className="bg-primary w-full h-[40px] text-dark hover:opacity-90 font-semibold flex justify-center items-center cursor-pointer"
              >
                {isEditing
                  ? `Update ${mediaConfig.displayName}`
                  : mediaConfig.addButtonText}
              </button>

              {isEditing && (
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete this ${mediaConfig.name.toLowerCase()}?`
                      )
                    ) {
                      try {
                        await deleteEntry(editingEntry._id);
                        onCloseAll();
                      } catch (error) {
                        console.error(
                          `Error deleting ${mediaConfig.name.toLowerCase()}:`,
                          error
                        );
                        toast.error(
                          `Failed to delete ${mediaConfig.name.toLowerCase()}.`
                        );
                      }
                    }
                  }}
                  className="bg-red-600 w-full h-[40px] text-white font-semibold flex justify-center items-center cursor-pointer hover:opacity-90"
                >
                  Delete {mediaConfig.displayName}
                </button>
              )}

              <button
                onClick={onClose}
                className="bg-light w-full border-2 border-transparent hover:border-text h-[40px] text-text flex justify-center items-center cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
