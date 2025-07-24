import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAnimeBackendStore } from "../../store/anime.backend.store";
import { useMangaStore } from "../../store/manga.store";
import { useShowsStore } from "../../store/shows.store";
import { useComicsStore } from "../../store/comics.store";
import { useAnimeExternalStore } from "../../store/anime.external.store";
import { MEDIA_TYPES } from "../../lib/mediaConfig";
import { toast } from "react-hot-toast";

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

  // Get the appropriate store functions based on current section
  const animeStore = useAnimeBackendStore();
  const mangaStore = useMangaStore();
  const showsStore = useShowsStore();
  const comicsStore = useComicsStore();

  // Get the correct store and functions based on section
  const getStoreFunctions = (section) => {
    switch (section) {
      case "animes":
        return {
          createEntry: animeStore.createAnime,
          editEntry: animeStore.editAnime,
          deleteEntry: animeStore.deleteAnime,
        };
      case "mangas":
        return {
          createEntry: mangaStore.createEntry,
          editEntry: mangaStore.editEntry,
          deleteEntry: mangaStore.deleteEntry,
        };
      case "shows":
        return {
          createEntry: showsStore.createEntry,
          editEntry: showsStore.editEntry,
          deleteEntry: showsStore.deleteEntry,
        };
      case "comics":
        return {
          createEntry: comicsStore.createEntry,
          editEntry: comicsStore.editEntry,
          deleteEntry: comicsStore.deleteEntry,
        };
      default:
        return {
          createEntry: animeStore.createAnime,
          editEntry: animeStore.editAnime,
          deleteEntry: animeStore.deleteAnime,
        };
    }
  };

  const { createEntry, editEntry, deleteEntry } =
    getStoreFunctions(currentSection);

  const { clearQueryResults } = useAnimeExternalStore();

  // Get media configuration for current section
  const mediaConfig = MEDIA_TYPES[currentSection] || MEDIA_TYPES.animes;

  const statusOptions = ["Planned", "Active", "Completed", "Dropped"];

  // Determine if we're editing an existing entry or adding a new one
  const isEditing = editingEntry !== null;
  const modalData = isEditing ? editingEntry : selectedQueryResult;

  // Destructure the selected query result or editing entry
  const {
    title,
    year,
    imageUrl,
    episodesTotal,
    chaptersTotal,
    issuesTotal,
    animeStatus,
    mangaStatus,
    showStatus,
    comicStatus,
  } = modalData || {};

  // Get the correct values based on media type
  const totalCount =
    modalData?.[mediaConfig.releasedField] || episodesTotal || 0;
  const mediaStatus =
    modalData?.[mediaConfig.statusField] || animeStatus || "Unknown";

  // Pre-fill form when editing existing entry
  useEffect(() => {
    if (isEditing && editingEntry) {
      setSelectedStatus(editingEntry.yourStatus || "Planned");
      const watchedValue =
        editingEntry[mediaConfig.watchedField] ||
        editingEntry.episodesWatched ||
        0;
      setWatchedEp(watchedValue.toString());
      setRating(editingEntry.rating?.toString() || "0");
    } else {
      // Reset form for new entry
      setSelectedStatus("Planned");
      setWatchedEp("");
      setRating("0");
    }
  }, [isEditing, editingEntry, isOpen, selectedQueryResult, mediaConfig]);

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
      const mediaData = {
        ...modalData,
        yourStatus: selectedStatus,
        [mediaConfig.watchedField]: parseInt(watchedEp) || 0,
        rating: parseFloat(rating) || 0,
      };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 transition-opacity" onClick={onCloseAll} />

      {/* EditAnimeModal Content */}
      <div className="relative z-60 w-[884px] h-[580px] bg-medium flex flex-col p-[64px] gap-[32px]">
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
        <div className="flex flex-row h-[381px] w-[756px] gap-[32px]">
          <img src={imageUrl} className="h-[381px] w-[267px]" />
          <div className="flex flex-col h-[381px] w-[457px] gap-[32px]">
            <div className="flex flex-col gap-[16px] text-textmuted text-p2">
              <div className="flex flex-col gap-[6px]">
                <div className="font-semibold">Name</div>
                <div className="bg-light w-full h-[40px] px-[12px] flex items-center">
                  {title || "Unknown Title"}
                </div>
              </div>
              <div className="flex flex-row gap-[12px] w-full">
                <div className="flex flex-col gap-[6px] w-full">
                  <div className="font-semibold">Year</div>
                  <div className="bg-light w-full h-[40px] px-[12px] flex items-center">
                    {year || "Unknown"}
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] w-full">
                  <div className="font-semibold">Status</div>
                  <div className="bg-light w-full h-[40px] px-[12px] flex items-center">
                    {mediaStatus}
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-[12px] w-full">
                <div className="flex flex-col gap-[6px] w-full text-text">
                  <div className="font-semibold">Your Status</div>
                  <div className="flex flex-row gap-[12px]">
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

              <div className="flex flex-row gap-[12px] w-full">
                <div className="flex flex-col gap-[6px] w-full">
                  <div className="font-semibold">
                    Released {mediaConfig.releasedLabel}
                  </div>
                  <div className="bg-light w-full h-[40px] px-[12px] flex items-center">
                    {totalCount || "Unknown"}
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] w-full text-text">
                  <div className="font-semibold">
                    {mediaConfig.watchedLabel}
                  </div>
                  <div className="w-full h-[40px] bg-light px-[12px]">
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
                <div className="flex flex-col gap-[6px] w-full text-text">
                  <div className="font-semibold">Rating</div>
                  <div className="w-full h-[40px] bg-light px-[12px]">
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
              </div>
            </div>
            <div className="w-full h-[40px] flex flex-row gap-[12px]">
              <button
                onClick={handleSubmit}
                className="bg-primary w-full h-[40px] text-dark hover:opacity-90 font-semibold flex justify-center items-center cursor-pointer"
              >
                {isEditing
                  ? `Update ${mediaConfig.name}`
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
                  Delete {mediaConfig.name}
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
