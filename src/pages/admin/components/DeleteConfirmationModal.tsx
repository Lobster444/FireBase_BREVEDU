import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  isOnline: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  isDeleting,
  isOnline,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-headspace-2xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Course</h3>
          <p className="text-base text-gray-600">
            Are you sure you want to delete this course? This action cannot be undone.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-headspace-lg text-base font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting || !isOnline}
            className={`flex-1 px-4 py-3 rounded-headspace-lg text-base font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2 ${
              isOnline 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete Course'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;