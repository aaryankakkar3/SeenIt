import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useAnimeBackendStore } from "../store/anime.backend.store";
import { useAnimeExternalStore } from "../store/anime.external.store";
import Card from "../components/my-list/Card";
import SearchModal from "../components/my-list/SearchModal";
import EditAnimeModal from "../components/my-list/EditAnimeModal";

function MyList() {
  const [isSearchAnimeModalOpen, setIsSearchAnimeModalOpen] = useState(false);
  const [isEditAnimeModalOpen, setIsEditAnimeModalOpen] = useState(false);
  const [selectedQueryResult, setSelectedQueryResult] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);

  const { entries, getAnimes } = useAnimeBackendStore();
  const { clearQueryResults } = useAnimeExternalStore();

  // Fetch anime entries when component mounts
  useEffect(() => {
    getAnimes();
  }, [getAnimes]);

  // Function to handle editing an entry
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setSelectedQueryResult(entry);
    setIsEditAnimeModalOpen(true);
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
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-row items-center justify-start gap-[16px]">
            <div className="text-h2 text-text">Anime</div>
            <button
              onClick={() => {
                setIsSearchAnimeModalOpen(true);
                clearQueryResults();
              }}
              className="text-card text-muted border-2 w-[105px] h-[32px] justify-center items-center flex cursor-pointer hover:bg-text-muted hover:text-bg-dark"
            >
              Add Anime
            </button>
          </div>
          <div
            className="grid gap-[12px]"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(370px, 1fr))",
            }}
          >
            {entries.map((entry, idx) => (
              <Card key={idx} entry={entry} onEdit={handleEdit} />
            ))}
          </div>
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
    </div>
  );
}

export default MyList;
