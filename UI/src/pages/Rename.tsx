// Rename.js
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, value, setValue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 w-96">
        <h2 className="text-lg font-semibold mb-4">Enter Your Comment</h2>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter your comment here..."
          className="w-full h-24 p-2 border rounded-md resize-none mb-4"
        />
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black rounded-md px-4 py-2 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white rounded-md px-4 py-2"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
