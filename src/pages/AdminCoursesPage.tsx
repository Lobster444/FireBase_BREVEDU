import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, AlertCircle, Shield, Settings, MessageCircle } from 'lucide-react';
import AdminRoute from '../components/AdminRoute';
import OfflineBanner from '../components/OfflineBanner';
import CourseModal from '../components/CourseModal';
import { useFirestoreCourses } from '../hooks/useFirestoreCourses';
import { useNetworkStatusWithUtils } from '../hooks/useNetworkStatus';
import { deleteCourse } from '../lib/courseService';
import { notifySuccess, notifyError, notifyLoading, updateToast } from '../lib/toast';
import { Course, AccessLevel } from '../types';

const AdminCoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('All');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Course Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);

  // NEW: Tavus Settings Modal State
  const [showTavusSettings, setShowTavusSettings] = useState(false);

  // Network status with toast notifications
  const { isOnline, executeIfOnline } = useNetworkStatusWithUtils(true);

  // Fetch all courses (including unpublished) for admin - no access level filtering
  const { courses, loading, error } = useFirestoreCourses({ 
    publishedOnly: false,
    includeRestricted: true // Admin sees all courses regardless of access level
  });

  const categories = ['All', 'Tech', 'Business', 'Health', 'Personal', 'Creative'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const accessLevels = ['All', 'anonymous', 'free', 'premium'];

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    const matchesAccessLevel = selectedAccessLevel === 'All' || (course.accessLevel || 'free') === selectedAccessLevel;
    const matchesPublished = !showPublishedOnly || course.published;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesAccessLevel && matchesPublished;
  });

  const handleDeleteCourse = async (courseId: string) => {
    if (!courseId) return;
    
    executeIfOnline(async () => {
      setIsDeleting(true);
      const toastId = notifyLoading('Deleting course...');
      
      try {
        await deleteCourse(courseId);
        updateToast(toastId, '✅ Course deleted successfully!', 'success');
        setDeleteConfirm(null);
      } catch (error: any) {
        console.error('Error deleting course:', error);
        const errorMessage = error.message || 'Failed to delete course. Please try again.';
        updateToast(toastId, `❌ ${errorMessage}`, 'error');
      } finally {
        setIsDeleting(false);
      }
    }, 'Cannot delete course while offline. Please check your connection.');
  };

  const handleNewCourse = () => {
    executeIfOnline(() => {
      setModalMode('add');
      setSelectedCourse(undefined);
      setShowCourseModal(true);
    }, 'Cannot create new course while offline.');
  };

  const handleEditCourse = (course: Course) => {
    executeIfOnline(() => {
      setModalMode('edit');
      setSelectedCourse(course);
      setShowCourseModal(true);
    }, 'Cannot edit course while offline.');
  };

  const handleCloseCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(undefined);
  };

  const handleSaveCourse = (course: Course) => {
    // The modal handles the actual save operation and shows toasts
    // The real-time listener will automatically update the courses list
    console.log('Course saved:', course.title);
  };

  // NEW: Handle Tavus settings
  const handleTavusSettings = () => {
    executeIfOnline(() => {
      setShowTavusSettings(true);
    }, 'Cannot access settings while offline.');
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle Firestore Timestamp
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString();
      }
      // Handle regular Date
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString();
      }
      // Handle string dates
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  // Get access level display info
  const getAccessLevelInfo = (level: AccessLevel | undefined) => {
    const accessLevel = level || 'free';
    switch (accessLevel) {
      case 'anonymous':
        return {
          label: 'Anonymous',
          color: 'text-gray-700',
          bgColor: 'bg-gray-100',
          icon: '🌐'
        };
      case 'free':
        return {
          label: 'Free',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          icon: '👤'
        };
      case 'premium':
        return {
          label: 'Premium',
          color: 'text-purple-700',
          bgColor: 'bg-purple-100',
          icon: '💎'
        };
      default:
        return {
          label: 'Free',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          icon: '👤'
        };
    }
  };

  // NEW: Get AI practice status for course
  const getAIPracticeStatus = (course: Course) => {
    const hasLegacyUrl = !!course.tavusConversationUrl;
    const hasContext = !!(course.conversationalContext || course.tavusConversationalContext);
    
    if (hasContext) {
      return {
        status: 'dynamic',
        label: 'Dynamic AI',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
        icon: '🤖'
      };
    } else if (hasLegacyUrl) {
      return {
        status: 'legacy',
        label: 'Legacy URL',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
        icon: '🔗'
      };
    } else {
      return {
        status: 'none',
        label: 'No AI',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: '❌'
      };
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Offline Banner */}
        <OfflineBanner isVisible={!isOnline} />
        
        {/* Header */}
        <div className={`border-b border-gray-200 bg-white ${!isOnline ? 'mt-16' : ''}`}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
                <p className="text-lg text-gray-600">
                  Manage all courses, create new content, and control access levels
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* NEW: Tavus Settings Button */}
                <button 
                  onClick={handleTavusSettings}
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
                  onClick={handleNewCourse}
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

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-[#FF7A59] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Additional Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#FF7A59]"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedAccessLevel}
                    onChange={(e) => setSelectedAccessLevel(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#FF7A59]"
                  >
                    <option value="All">All Access Levels</option>
                    <option value="anonymous">Anonymous</option>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={showPublishedOnly}
                    onChange={(e) => setShowPublishedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-[#FF7A59] focus:ring-[#FF7A59]/20"
                  />
                  <span>Published only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-[#FF7A59]">{courses.length}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-emerald-600">{courses.filter(c => c.published).length}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{courses.filter(c => !c.published).length}</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{courses.filter(c => (c.accessLevel || 'free') === 'premium').length}</div>
              <div className="text-sm text-gray-600">Premium Only</div>
            </div>
            {/* NEW: AI Practice Stats */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {courses.filter(c => c.conversationalContext || c.tavusConversationalContext || c.tavusConversationUrl).length}
              </div>
              <div className="text-sm text-gray-600">AI Practice</div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A59] mb-4"></div>
              <p className="text-lg text-gray-600">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="text-base">{error}</span>
              </div>
            </div>
          )}

          {/* Courses Table/Grid */}
          {!loading && !error && (
            <>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600 mb-4">
                    {courses.length === 0 ? 'No courses found.' : 'No courses match your current filters.'}
                  </p>
                  {courses.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedDifficulty('All');
                        setSelectedAccessLevel('All');
                        setSearchQuery('');
                        setShowPublishedOnly(false);
                      }}
                      className="text-[#FF7A59] hover:text-[#FF8A6B] transition-colors underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-lg text-gray-600">
                      Showing {filteredCourses.length} of {courses.length} courses
                    </p>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block bg-white rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-gray-900">Course</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-900">Category</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-900">Difficulty</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-900">Access Level</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-900">AI Practice</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-900">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-900">Created</th>
                          <th className="text-right p-4 text-sm font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((course) => {
                          const accessInfo = getAccessLevelInfo(course.accessLevel);
                          const aiPracticeInfo = getAIPracticeStatus(course);
                          return (
                            <tr key={course.id} className="border-t border-gray-200 hover:bg-gray-50">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={course.thumbnailUrl}
                                    alt={course.title}
                                    className="w-16 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <div className="text-base font-medium text-gray-900 line-clamp-1">
                                      {course.title}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {course.duration}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                  {course.category}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-sm text-gray-900">
                                  {course.difficulty}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`text-sm px-2 py-1 rounded flex items-center space-x-1 w-fit ${accessInfo.color} ${accessInfo.bgColor}`}>
                                  <span>{accessInfo.icon}</span>
                                  <span>{accessInfo.label}</span>
                                </span>
                              </td>
                              {/* NEW: AI Practice Column */}
                              <td className="p-4">
                                <span className={`text-sm px-2 py-1 rounded flex items-center space-x-1 w-fit ${aiPracticeInfo.color} ${aiPracticeInfo.bgColor}`}>
                                  <span>{aiPracticeInfo.icon}</span>
                                  <span>{aiPracticeInfo.label}</span>
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  {course.published ? (
                                    <>
                                      <Eye className="h-4 w-4 text-emerald-600" />
                                      <span className="text-sm text-emerald-600">Published</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="h-4 w-4 text-purple-600" />
                                      <span className="text-sm text-purple-600">Draft</span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-sm text-gray-600">
                                  {formatDate(course.createdAt)}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-end space-x-2">
                                  <button 
                                    onClick={() => handleEditCourse(course)}
                                    disabled={!isOnline}
                                    className={`p-2 rounded-lg transition-colors ${
                                      isOnline 
                                        ? 'text-[#FF7A59] hover:bg-[#FF7A59]/10' 
                                        : 'text-gray-400 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => setDeleteConfirm(course.id!)}
                                    disabled={!isOnline}
                                    className={`p-2 rounded-lg transition-colors ${
                                      isOnline 
                                        ? 'text-red-500 hover:bg-red-50' 
                                        : 'text-gray-400 cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4">
                    {filteredCourses.map((course) => {
                      const accessInfo = getAccessLevelInfo(course.accessLevel);
                      const aiPracticeInfo = getAIPracticeStatus(course);
                      return (
                        <div key={course.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start space-x-3 mb-3">
                            <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="w-20 h-12 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-1">
                                {course.title}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                <span>{course.duration}</span>
                                <span>•</span>
                                <span>{course.category}</span>
                                <span>•</span>
                                <span>{course.difficulty}</span>
                              </div>
                              <div className="flex items-center space-x-2 flex-wrap gap-1">
                                <span className={`text-xs px-2 py-1 rounded flex items-center space-x-1 ${accessInfo.color} ${accessInfo.bgColor}`}>
                                  <span>{accessInfo.icon}</span>
                                  <span>{accessInfo.label}</span>
                                </span>
                                <span className={`text-xs px-2 py-1 rounded flex items-center space-x-1 ${aiPracticeInfo.color} ${aiPracticeInfo.bgColor}`}>
                                  <span>{aiPracticeInfo.icon}</span>
                                  <span>{aiPracticeInfo.label}</span>
                                </span>
                                {course.published ? (
                                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center space-x-1">
                                    <Eye className="h-3 w-3" />
                                    <span>Published</span>
                                  </span>
                                ) : (
                                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded flex items-center space-x-1">
                                    <EyeOff className="h-3 w-3" />
                                    <span>Draft</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleEditCourse(course)}
                              disabled={!isOnline}
                              className={`p-2 rounded-lg transition-colors ${
                                isOnline 
                                  ? 'text-[#FF7A59] hover:bg-[#FF7A59]/10' 
                                  : 'text-gray-400 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(course.id!)}
                              disabled={!isOnline}
                              className={`p-2 rounded-lg transition-colors ${
                                isOnline 
                                  ? 'text-red-500 hover:bg-red-50' 
                                  : 'text-gray-400 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
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
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCourse(deleteConfirm)}
                  disabled={isDeleting || !isOnline}
                  className={`flex-1 px-4 py-3 rounded-lg text-base font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2 ${
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
        )}

        {/* Course Modal */}
        <CourseModal
          isOpen={showCourseModal}
          mode={modalMode}
          course={selectedCourse}
          onClose={handleCloseCourseModal}
          onSave={handleSaveCourse}
        />

        {/* NEW: Tavus Settings Modal */}
        <TavusSettingsModal
          isOpen={showTavusSettings}
          onClose={() => setShowTavusSettings(false)}
        />
      </div>
    </AdminRoute>
  );
};

// NEW: Tavus Settings Modal Component
const TavusSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    replica_id: '',
    persona_id: '',
    api_key: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen) {
      loadTavusSettings();
    }
  }, [isOpen]);

  const loadTavusSettings = async () => {
    setLoading(true);
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const settingsRef = doc(db, 'settings', 'tavus');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        setSettings({
          replica_id: data.replica_id || '',
          persona_id: data.persona_id || '',
          api_key: data.api_key || ''
        });
      }
    } catch (error) {
      console.error('Error loading Tavus settings:', error);
      notifyError('Failed to load Tavus settings');
    } finally {
      setLoading(false);
    }
  };

  const saveTavusSettings = async () => {
    setSaving(true);
    const toastId = notifyLoading('Saving Tavus settings...');
    
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const settingsRef = doc(db, 'settings', 'tavus');
      await setDoc(settingsRef, {
        replica_id: settings.replica_id.trim(),
        persona_id: settings.persona_id.trim(),
        api_key: settings.api_key.trim(),
        updatedAt: new Date().toISOString()
      });
      
      updateToast(toastId, '✅ Tavus settings saved successfully!', 'success');
      onClose();
    } catch (error) {
      console.error('Error saving Tavus settings:', error);
      updateToast(toastId, '❌ Failed to save Tavus settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <span>Tavus AI Settings</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Replica ID *
              </label>
              <input
                type="text"
                value={settings.replica_id}
                onChange={(e) => setSettings(prev => ({ ...prev, replica_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                placeholder="Enter Tavus replica ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Persona ID *
              </label>
              <input
                type="text"
                value={settings.persona_id}
                onChange={(e) => setSettings(prev => ({ ...prev, persona_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                placeholder="Enter Tavus persona ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                API Key *
              </label>
              <input
                type="password"
                value={settings.api_key}
                onChange={(e) => setSettings(prev => ({ ...prev, api_key: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                placeholder="Enter Tavus API key"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These settings are used for all dynamic AI conversations. 
                Make sure to use valid Tavus credentials.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                disabled={saving}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveTavusSettings}
                disabled={saving || !settings.replica_id || !settings.persona_id || !settings.api_key}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoursesPage;