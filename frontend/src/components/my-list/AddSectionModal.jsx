import { X } from "lucide-react";
import { useSectionsStore } from "../../store/sections.store";
import { AVAILABLE_SECTIONS, MEDIA_TYPES } from "../../lib/mediaConfig";

export default function AddSectionModal({ isOpen, onClose }) {
  const { sections, addSection } = useSectionsStore();

  // Get sections that haven't been added yet
  const availableSections = AVAILABLE_SECTIONS.filter(
    (section) => !sections.includes(section)
  );

  const handleAddSection = (sectionKey) => {
    addSection(sectionKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark opacity-75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-20 w-[400px] bg-medium flex flex-col p-[32px] gap-[16px]">
        <div className="flex flex-row items-center justify-between">
          <div className="text-h2 text-text">Add Section</div>
          <X
            className="text-textmuted w-[20px] h-[20px] cursor-pointer hover:text-text"
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          {availableSections.length === 0 ? (
            <div className="text-textmuted text-center py-4">
              All sections have been added
            </div>
          ) : (
            availableSections.map((sectionKey) => (
              <button
                key={sectionKey}
                onClick={() => handleAddSection(sectionKey)}
                className="text-left p-3 text-text border border-textmuted hover:bg-textmuted hover:text-dark transition-colors"
              >
                {MEDIA_TYPES[sectionKey].name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
