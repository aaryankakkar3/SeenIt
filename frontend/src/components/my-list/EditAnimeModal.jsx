import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAnimeBackendStore } from "../../store/anime.backend.store";
import { toast } from "react-hot-toast";

export default function EditAnimeModal({
  isOpen,
  onClose,
  editingEntry,
  selectedQueryResult,
  onCloseAll,
}) {
  const [selectedStatus, setSelectedStatus] = useState("Planned");
  const [rating, setRating] = useState(0);
  const [watchedEp, setWatchedEp] = useState("");
  const { createAnime, editAnime, deleteAnime } = useAnimeBackendStore();

  const statusOptions = ["Planned", "Active", "Completed", "Dropped"];

  // Determine if we're editing an existing entry or adding a new one
  const isEditing = editingEntry !== null;
  const modalData = isEditing ? editingEntry : selectedQueryResult;

  // Destructure the selected query result or editing entry
  const { title, year, imageUrl, episodesTotal, animeStatus } = modalData || {};

  // Pre-fill form when editing existing entry
  useEffect(() => {
    if (isEditing && editingEntry) {
      setSelectedStatus(editingEntry.yourStatus || "Planned");
      setWatchedEp(editingEntry.episodesWatched?.toString() || "");
      setRating(editingEntry.rating?.toString() || "0");
    } else {
      setSelectedStatus("Planned");
      setWatchedEp("");
      setRating("0");
    }
  }, [isEditing, editingEntry]);

  // Frontend validation
  const validateInput = () => {
    const watchedEpNum = parseInt(watchedEp) || 0;
    const ratingNum = parseFloat(rating) || 0;
    const errors = [];

    if (watchedEpNum < 0) {
      errors.push("Episodes watched cannot be negative");
    }

    if (episodesTotal > 0 && watchedEpNum > episodesTotal) {
      errors.push(
        `Episodes watched cannot exceed total episodes (${episodesTotal})`
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
        episodesTotal > 0 &&
        watchedNum >= episodesTotal &&
        selectedStatus !== "Completed"
      ) {
        setSelectedStatus("Completed");
        setWatchedEp(episodesTotal.toString());
        toast.success("Status automatically set to Completed!");
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

  // Handle status change with auto-fill episodes
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (status === "Completed" && episodesTotal > 0) {
      setWatchedEp(episodesTotal.toString());
      toast.success("Episodes watched automatically set to total episodes!");
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
            {isEditing ? "Edit Anime" : "Add New Anime"}
          </div>
          <X
            className="text-textmuted w-[20px] h-[20px] cursor-pointer"
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
                    {animeStatus || "Unknown"}
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
                        className={`bg-light w-full h-[40px] px-[12px] flex items-center cursor-pointer hover:bg-light transition-colors ${
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
                  <div className="font-semibold">Released Ep</div>
                  <div className="bg-light w-full h-[40px] px-[12px] flex items-center">
                    {episodesTotal || "Unknown"}
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] w-full text-text">
                  <div className="font-semibold">Watched Ep</div>
                  <div className="w-full h-[40px] bg-light px-[12px]">
                    <input
                      autoComplete="off"
                      type="number"
                      value={watchedEp}
                      onChange={handleEpisodesWatchedChange}
                      id="episodesWatched"
                      min="0"
                      max={episodesTotal || undefined}
                      placeholder={`0 - ${episodesTotal || "?"}`}
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
                onClick={async () => {
                  // Validate input before submission
                  const validationErrors = validateInput();
                  if (validationErrors.length > 0) {
                    validationErrors.forEach((error) => toast.error(error));
                    return;
                  }

                  try {
                    const animeData = {
                      ...modalData,
                      yourStatus: selectedStatus,
                      episodesWatched: parseInt(watchedEp) || 0,
                      rating: parseFloat(rating) || 0,
                    };

                    if (isEditing) {
                      await editAnime(editingEntry._id, animeData);
                      toast.success("Anime updated successfully!");
                    } else {
                      await createAnime(animeData);
                      toast.success("Anime added successfully!");
                    }

                    onCloseAll();
                  } catch (error) {
                    console.error("Error saving anime:", error);
                    toast.error("Failed to save anime. Please try again.");
                  }
                }}
                className="bg-primary w-full h-[40px] text-dark font-semibold flex justify-center items-center cursor-pointer"
              >
                {isEditing ? "Update Anime" : "Add Anime"}
              </button>

              {isEditing && (
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this anime?"
                      )
                    ) {
                      try {
                        await deleteAnime(editingEntry._id);
                        toast.success("Anime deleted successfully!");
                        onCloseAll();
                      } catch (error) {
                        console.error("Error deleting anime:", error);
                        toast.error(
                          "Failed to delete anime. Please try again."
                        );
                      }
                    }
                  }}
                  className="bg-red-500 w-full h-[40px] text-white font-semibold flex justify-center items-center cursor-pointer hover:bg-red-600"
                >
                  Delete Anime
                </button>
              )}

              <button
                onClick={onClose}
                className="bg-light w-full h-[40px] text-text flex justify-center items-center cursor-pointer"
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
