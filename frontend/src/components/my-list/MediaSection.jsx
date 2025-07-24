import { useEffect } from "react";
import Card from "./Card";
import { useAnimeBackendStore } from "../../store/anime.backend.store";
import { useMangaStore } from "../../store/manga.store";
import { useShowsStore } from "../../store/shows.store";
import { useComicsStore } from "../../store/comics.store";
import { useAnimeExternalStore } from "../../store/anime.external.store";
import { useSectionsStore } from "../../store/sections.store";
import { MEDIA_TYPES } from "../../lib/mediaConfig";

function MediaSection({ onEdit, onOpenSearchModal, thisSection }) {
  // Get the appropriate store based on section type
  const getStoreForSection = (section) => {
    switch (section) {
      case "animes":
        return useAnimeBackendStore();
      case "mangas":
        return useMangaStore();
      case "shows":
        return useShowsStore();
      case "comics":
        return useComicsStore();
      default:
        return useAnimeBackendStore();
    }
  };

  const {
    entries,
    getAnimes,
    getEntries,
    incrementEpisodes,
    decrementEpisodes,
    incrementProgress,
    decrementProgress,
  } = getStoreForSection(thisSection);
  const { clearQueryResults } = useAnimeExternalStore();
  const { deleteSection } = useSectionsStore();

  // Get media configuration for this section
  const mediaConfig = MEDIA_TYPES[thisSection] || MEDIA_TYPES.animes;

  // Fetch entries when component mounts
  useEffect(() => {
    if (thisSection === "animes") {
      getAnimes();
    } else {
      getEntries();
    }
  }, [thisSection, getAnimes, getEntries]);

  const handleAddMedia = () => {
    onOpenSearchModal(thisSection);
    clearQueryResults();
  };

  const handleRemoveSection = () => {
    if (
      window.confirm(
        `Are you sure you want to remove the "${mediaConfig.name}" section?`
      )
    ) {
      deleteSection(thisSection);
    }
  };

  // Create a modified onEdit function that includes the section type
  const handleEdit = (entry) => {
    onEdit(entry, thisSection);
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start gap-[16px]">
          <div className="text-h2 text-text capitalize">{mediaConfig.name}</div>
          <button
            onClick={handleAddMedia}
            className="text-p2 text-primary border-2 border-primary w-[105px] h-[32px] justify-center items-center flex cursor-pointer hover:bg-primary hover:text-dark transition-colors"
          >
            {mediaConfig.addButtonText}
          </button>
        </div>
        <button
          onClick={handleRemoveSection}
          className="text-p2 text-textmuted border-2 border-textmuted w-[149px] h-[32px] justify-center items-center flex cursor-pointer hover:bg-textmuted hover:text-dark transition-colors"
        >
          Remove Section
        </button>
      </div>

      <div
        className="grid gap-[12px]"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(370px, 1fr))",
        }}
      >
        {entries.map((entry, idx) => (
          <Card
            key={idx}
            entry={entry}
            onEdit={handleEdit}
            mediaConfig={mediaConfig}
            onIncrement={
              thisSection === "animes" ? incrementEpisodes : incrementProgress
            }
            onDecrement={
              thisSection === "animes" ? decrementEpisodes : decrementProgress
            }
          />
        ))}
      </div>
    </div>
  );
}

export default MediaSection;
