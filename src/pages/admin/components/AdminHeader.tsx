import React from 'react';
import { Plus, Settings } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-6 py-6">
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
              className={`px-4 py-3 rounded-lg text-base font-medium transition-all shadow-sm flex items-center space-x-2 ${
                isOnline 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>AI Settings</span>
            </button>

            <button 
              onClick={onNewCourse}
              disabled={!isOnline}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-all shadow-sm flex items-center space-x-2 ${
                isOnline 
                  ? 'bg-[#FF7A59] text-white hover:bg-[#FF8A6B]' 
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