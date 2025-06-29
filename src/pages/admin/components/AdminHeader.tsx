import React from 'react';
import { Plus, Gear } from '@phosphor-icons/react';

interface AdminHeaderProps {
  isOnline: boolean;
  onNewCourse: () => void;
  onTavusSettings: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  isOnline,
  onNewCourse,
  onTavusSettings
}) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-screen-2xl mx-auto px-padding-medium py-padding-medium">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
            <p className="text-lg text-gray-600">
              Manage all courses, create new content, and control access levels
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Tavus Settings Button */}
            <button 
              onClick={onTavusSettings}
              disabled={!isOnline}
              className={`px-4 py-3 rounded-[1.2rem] text-base font-medium transition-all shadow-sm flex items-center space-x-2 ${
                isOnline 
                  ? 'bg-cobalt text-white hover:bg-[#4a4fd9]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Gear className="h-5 w-5" />
              <span>AI Settings</span>
            </button>

            <button 
              onClick={onNewCourse}
              disabled={!isOnline}
              className={`px-6 py-3 rounded-[1.2rem] text-base font-medium transition-all shadow-sm flex items-center space-x-2 ${
                isOnline 
                  ? 'bg-hyper-yellow text-black hover:bg-[#ffed4d]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>New Course</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;