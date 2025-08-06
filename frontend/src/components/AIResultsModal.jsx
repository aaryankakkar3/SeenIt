import React from "react";
import { X } from "lucide-react";

function AIResultsModal({ isOpen, onClose, suggestions, isLoading, error }) {
  function SuggestionCard({ title, mediaType, reason }) {
    return (
      <div className="flex flex-col gap-[8px] p-[24px] bg-light w-[400px]">
        <div className="text-text text-p2 flex flex-col gap-[4px]">
          <div className="">{title}</div>
          <div className="">[{mediaType}]</div>
        </div>
        <div className="text-textmuted text-p2">{reason}</div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div>
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-dark opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative z-20 w-[90%] h-[90%] bg-medium flex flex-col p-[64px] gap-[32px]">
          <div className="flex flex-row items-center justify-between">
            <div className="text-h2 text-text">Suggestions</div>
            <X
              className="text-textmuted w-[20px] h-[20px] cursor-pointer hover:text-text"
              onClick={onClose}
            />
          </div>

          <div className="w-full h-full overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-text text-p1">
                  Getting AI suggestions...
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500 text-p1">Error: {error}</div>
              </div>
            )}

            {/* Suggestions Grid */}
            {!isLoading && !error && suggestions && suggestions.length > 0 && (
              <div
                className="grid gap-[24px]"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={index}
                    title={suggestion.title}
                    mediaType={suggestion.type}
                    reason={suggestion.reason}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading &&
              !error &&
              suggestions &&
              suggestions.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-textmuted text-p1">
                    No suggestions found.
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIResultsModal;
