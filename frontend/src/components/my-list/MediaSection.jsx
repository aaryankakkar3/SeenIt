import { useEffect } from "react";
import Card from "./Card";
import { useAnimeStore } from "../../store/anime.store";
import { useMangaStore } from "../../store/manga.store";
import { useShowsStore } from "../../store/shows.store";
import { useComicsStore } from "../../store/comics.store";
import { useBookStore } from "../../store/books.store";
import { useGameStore } from "../../store/games.store";
import { useMovieStore } from "../../store/movies.store";
import { useExternalStore } from "../../store/external.store";
import { useSectionsStore } from "../../store/sections.store";
import { MEDIA_TYPES } from "../../lib/mediaConfig";
function MediaSection({ onEdit, onOpenSearchModal, thisSection }) {
  // Get the appropriate store based on section type
  const getStoreForSection = (section) => {
    switch (section) {
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

  const { entries, getEntries, incrementProgress, decrementProgress } =
    getStoreForSection(thisSection);
  const { clearQueryResults } = useExternalStore();
  const { deleteSection } = useSectionsStore();

  // Get media configuration for this section
  const mediaConfig = MEDIA_TYPES[thisSection] || MEDIA_TYPES.animes;

  // Fetch entries when component mounts
  useEffect(() => {
    getEntries();
  }, [thisSection, getEntries]);

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
            className="text-p2 text-primary border-2 border-primary px-[12px] py-[6px] justify-center items-center flex cursor-pointer hover:bg-primary hover:text-dark transition-colors"
          >
            <span className="sm:hidden">+</span>
            <span className="max-sm:hidden">{mediaConfig.addButtonText}</span>
          </button>
        </div>
        <button
          onClick={handleRemoveSection}
          className="text-p2 text-textmuted border-2 border-textmuted px-[12px] max-sm:px-[6px] py-[6px] justify-center items-center flex cursor-pointer hover:bg-textmuted hover:text-dark transition-colors"
        >
          Remove Section
        </button>
      </div>

      <div className="grid gap-[12px] max-md:gap-[24px] grid-cols-[repeat(auto-fill,minmax(370px,1fr))] max-md:grid-cols-[repeat(auto-fill,minmax(133px,1fr))]">
        {entries.map((entry, idx) => (
          <Card
            key={idx}
            entry={entry}
            onEdit={handleEdit}
            mediaConfig={mediaConfig}
            onIncrement={incrementProgress}
            onDecrement={decrementProgress}
          />
        ))}
      </div>
    </div>
  );
}

export default MediaSection;
