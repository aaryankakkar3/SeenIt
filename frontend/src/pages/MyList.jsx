import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import MediaSection from "../components/my-list/MediaSection";
import SearchModal from "../components/my-list/SearchModal";
import EditAnimeModal from "../components/my-list/EditAnimeModal";
import AddSectionModal from "../components/my-list/AddSectionModal";
import { useSectionsStore } from "../store/sections.store";

function MyList() {
  const [isSearchAnimeModalOpen, setIsSearchAnimeModalOpen] = useState(false);
  const [isEditAnimeModalOpen, setIsEditAnimeModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [selectedQueryResult, setSelectedQueryResult] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);

  const { sections, getSections } = useSectionsStore();

  // Fetch sections when component mounts
  useEffect(() => {
    getSections();
  }, [getSections]);

  // Check if sections exist
  const hasSections = sections.length > 0;

  // Function to handle opening add section modal
  const handleOpenAddSectionModal = () => {
    setIsAddSectionModalOpen(true);
  };

  // Function to close add section modal
  const handleCloseAddSectionModal = () => {
    setIsAddSectionModalOpen(false);
  };

  // Function to handle editing an entry
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setSelectedQueryResult(entry);
    setIsEditAnimeModalOpen(true);
  };

  // Function to handle opening search modal
  const handleOpenSearchModal = (sectionType) => {
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
    <div className="px-[64px] py-[32px] flex flex-col gap-[40px] min-h-screen">
      <Navbar />

      {!hasSections ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-[32px]">
          <div className="text-h1 text-text ">No sections added</div>
          <button
            onClick={handleOpenAddSectionModal}
            className="bg-primary text-dark h-[32px] w-[122px] text-p2 font-semibold cursor-pointer hover:opacity-90"
          >
            Add Section
          </button>
        </div>
      ) : (
        // Show normal content if sections exist
        <>
          <div className="flex flex-col gap-[32px]">
            {sections.map((section, index) => (
              <MediaSection
                key={index}
                onEdit={handleEdit}
                onOpenSearchModal={handleOpenSearchModal}
                thisSection={section}
              />
            ))}
            <div className="w-full flex h-fit justify-center items-center">
              <button
                onClick={handleOpenAddSectionModal}
                className="bg-primary text-dark h-[32px] w-[122px] text-p2 font-semibold cursor-pointer hover:opacity-90"
              >
                Add Section
              </button>
            </div>
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
        </>
      )}

      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={handleCloseAddSectionModal}
      />
    </div>
  );
}

export default MyList;
