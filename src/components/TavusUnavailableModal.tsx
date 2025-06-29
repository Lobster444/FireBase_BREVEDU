import React from 'react';
import { X, MessageCircle, AlertTriangle } from 'lucide-react';

interface TavusUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TavusUnavailableModal: React.FC<TavusUnavailableModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-[1.6rem] w-full max-w-md shadow-xl overflow-hidden border border-black/5">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-black/5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">
                Temporarily Unavailable
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-button icon-button-gray p-2 rounded-[0.8rem]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-10 w-10 text-gold" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">
              AI Conversations Currently Disabled
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              AI conversations are currently disabled by the administrator. 
              This may be due to maintenance or high usage. Please try again later.
            </p>
            
            <div className="bg-gold/10 border border-gold/20 rounded-[1.2rem] p-6 mb-8">
              <p className="text-sm text-gold">
                <strong>What you can do:</strong>
              </p>
              <ul className="text-sm text-gold/80 mt-2 space-y-1 text-left">
                <li>• Watch the video lesson content</li>
                <li>• Check back later for AI practice</li>
                <li>• Explore other courses in the meantime</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gold text-white px-6 py-4 rounded-[1.2rem] text-lg font-medium hover:bg-[#a87600] transition-all"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusUnavailableModal;