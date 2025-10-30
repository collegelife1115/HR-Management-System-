import React, { useState, useEffect } from "react";

// Simple "X" icon for closing
const IconClose = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TemplateModal = ({ isOpen, onClose, content, isLoading }) => {
  const [copyButtonText, setCopyButtonText] = useState("Copy to Clipboard");

  // Reset button text when content changes
  useEffect(() => {
    setCopyButtonText("Copy to Clipboard");
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopyButtonText("Copied!");
  };

  if (!isOpen) return null;

  return (
    // Modal Backdrop
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white w-full max-w-2xl h-[80vh] m-4 rounded-lg shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">AI Generated Template</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <IconClose />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isLoading ? (
            <p>Generating your template...</p>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {content}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleCopy}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {copyButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
