import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useAnimeBackendStore } from "../store/anime.backend.store";
import MediaSection from "../components/my-list/MediaSection";
import SearchModal from "../components/my-list/SearchModal";
import EditAnimeModal from "../components/my-list/EditAnimeModal";
import { useSectionsStore } from "../store/sections.store";

function MyList() {
  const [isSearchAnimeModalOpen, setIsSearchAnimeModalOpen] = useState(false);
  const [isEditAnimeModalOpen, setIsEditAnimeModalOpen] = useState(false);
  const [selectedQueryResult, setSelectedQueryResult] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);

  const { getAnimes } = useAnimeBackendStore();
  const { sections, getSections, addSection, deleteSection } =
    useSectionsStore();

  // Fetch anime entries and sections when component mounts
  useEffect(() => {
    getAnimes();
  }, [getAnimes]);

  useEffect(() => {
    getSections();
  }, [getSections]);

  // Function to handle editing an entry
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setSelectedQueryResult(entry);
    setIsEditAnimeModalOpen(true);
  };

  // Function to handle opening search modal
  const handleOpenSearchModal = () => {
    setIsSearchAnimeModalOpen(true);
  };

  // Function to handle selecting a query result from search
  const handleSelectQueryResult = (queryResult) => {
    setSelectedQueryResult(queryResult);
    setEditingEntry(null);
    setIsEditAnimeModalOpen(true);
  };

  // Function to close search modal
  const handleCloseSearchModal = () => {
    setIsSearchAnimeModalOpen(false);
  };

  // Function to close edit modal only
  const handleCloseEditModal = () => {
    setIsEditAnimeModalOpen(false);
    setEditingEntry(null);
  };

  // Function to close all modals
  const handleCloseAllModals = () => {
    setIsEditAnimeModalOpen(false);
    setIsSearchAnimeModalOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="p-[64px] flex flex-col gap-[40px]">
      <Navbar />
      <div className="flex flex-col gap-[32px]">
        <MediaSection
          onEdit={handleEdit}
          onOpenSearchModal={handleOpenSearchModal}
        />
      </div>

      <SearchModal
        isOpen={isSearchAnimeModalOpen}
        onClose={handleCloseSearchModal}
        onSelectResult={handleSelectQueryResult}
      />

      <EditAnimeModal
        isOpen={isEditAnimeModalOpen}
        onClose={handleCloseEditModal}
        onCloseAll={handleCloseAllModals}
        editingEntry={editingEntry}
        selectedQueryResult={selectedQueryResult}
      />
    </div>
  );
}

export default MyList;
