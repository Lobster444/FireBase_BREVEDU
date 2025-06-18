import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  mode: 'add' | 'edit';
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ mode, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div>
        <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
          {mode === 'add' ? 'Add New Course' : 'Edit Course'}
        </h2>
        <p id="modal-description" className="text-lg text-gray-600 mt-1">
          {mode === 'add' 
            ? 'Create a new course with video content, AI practice, and access controls'
            : 'Update course information, AI practice settings, and access level'
          }
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-[8px] hover:bg-gray-50"
        aria-label="Close modal"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ModalHeader;