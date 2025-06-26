import React from 'react';
import { Save, Loader2 } from 'lucide-react';

interface ModalFooterProps {
  mode: 'add' | 'edit';
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  mode,
  isSubmitting,
  onClose,
  onSubmit
}) => {
  return (
    <div className="flex items-center justify-end space-x-4 pt-6 mt-6 border-t border-gray-100">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-[10px] text-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        onClick={onSubmit}
        className="bg-[#002fa7] text-white px-6 py-3 rounded-[10px] text-lg font-medium hover:bg-[#FF8A6B] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.1)] disabled:opacity-50 flex items-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{mode === 'add' ? 'Creating...' : 'Updating...'}</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>{mode === 'add' ? 'Create Course' : 'Update Course'}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ModalFooter;