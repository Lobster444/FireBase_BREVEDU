import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, AlertCircle, Shield } from 'lucide-react';
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

  // Network status with toast notifications
  const { isOnline, executeIfOnline } = useNetworkStatusWithUtils(true);

  // Fetch all courses (including unpublished) for admin
  const { courses, loading, error } = useFirestoreCourses({ 
    publishedOnly: false 
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
          color: 'text-neutral-gray',
          bgColor: 'bg-neutral-gray/20',
          icon: '🌐'
        };
      case 'free':
        return {
          label: 'Free',
          color: 'text-accent-yellow',
          bgColor: 'bg-accent-yellow/20',
          icon: '👤'
        };
      case 'premium':
        return {
          label: 'Premium',
          color: 'text-accent-purple',
          bgColor: 'bg-accent-purple/20',
          icon: '💎'
        };
      default:
        return {
          label: 'Free',
          color: 'text-accent-yellow',
          bgColor: 'bg-accent-yellow/20',
          icon: '👤'
        };
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-primary">
        {/* Offline Banner */}
        <OfflineBanner isVisible={!isOnline} />
        
        {/* Header */}
        <div className={`border-b border-neutral-gray/20 ${!isOnline ? 'mt-16' : ''}`}>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-h1 text-text-light mb-2">Course Management</h1>
                <p className="text-body text-text-secondary">
                  Manage all courses, create new content, and control access levels
                </p>
              </div>
              
              <button 
                onClick={handleNewCourse}
                disabled={!isOnline}
                className={`px-6 py-3 rounded-lg text-link font-medium transition-all shadow-button flex items-center space-x-2 ${
                  isOnline 
                    ? 'bg-accent-purple text-text-dark hover:bg-accent-deep-purple' 
                    : 'bg-neutral-gray/50 text-neutral-gray cursor-not-allowed opacity-50'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span>New Course</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-neutral-gray/10 rounded-lg p-6 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-gray" />
              <input
                type="text"
                placeholder="Search courses by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg text-text-light placeholder-neutral-gray focus:outline-none focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20"
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
                    className={`px-4 py-2 rounded-lg text-small font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-accent-yellow text-text-dark'
                        : 'bg-neutral-gray/20 text-text-light hover:bg-neutral-gray/30'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Additional Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-neutral-gray" />
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg px-3 py-2 text-small text-text-light focus:outline-none focus:border-accent-yellow"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-neutral-gray" />
                  <select
                    value={selectedAccessLevel}
                    onChange={(e) => setSelectedAccessLevel(e.target.value)}
                    className="bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg px-3 py-2 text-small text-text-light focus:outline-none focus:border-accent-yellow"
                  >
                    <option value="All">All Access Levels</option>
                    <option value="anonymous">Anonymous</option>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 text-small text-text-light">
                  <input
                    type="checkbox"
                    checked={showPublishedOnly}
                    onChange={(e) => setShowPublishedOnly(e.target.checked)}
                    className="rounded border-neutral-gray/30 text-accent-yellow focus:ring-accent-yellow/20"
                  />
                  <span>Published only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-neutral-gray/10 rounded-lg p-4">
              <div className="text-h3 text-accent-yellow">{courses.length}</div>
              <div className="text-small text-text-secondary">Total Courses</div>
            </div>
            <div className="bg-neutral-gray/10 rounded-lg p-4">
              <div className="text-h3 text-accent-green">{courses.filter(c => c.published).length}</div>
              <div className="text-small text-text-secondary">Published</div>
            </div>
            <div className="bg-neutral-gray/10 rounded-lg p-4">
              <div className="text-h3 text-accent-purple">{courses.filter(c => !c.published).length}</div>
              <div className="text-small text-text-secondary">Drafts</div>
            </div>
            <div className="bg-neutral-gray/10 rounded-lg p-4">
              <div className="text-h3 text-neutral-gray">{courses.filter(c => (c.accessLevel || 'free') === 'premium').length}</div>
              <div className="text-small text-text-secondary">Premium Only</div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-yellow mb-4"></div>
              <p className="text-body text-text-secondary">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="text-body">{error}</span>
              </div>
            </div>
          )}

          {/* Courses Table/Grid */}
          {!loading && !error && (
            <>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-body text-text-secondary mb-4">
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
                      className="text-accent-yellow hover:text-accent-green transition-colors underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-body text-text-secondary">
                      Showing {filteredCourses.length} of {courses.length} courses
                    </p>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block bg-neutral-gray/10 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-gray/20">
                        <tr>
                          <th className="text-left p-4 text-small font-medium text-text-light">Course</th>
                          <th className="text-left p-4 text-small font-medium text-text-light">Category</th>
                          <th className="text-left p-4 text-small font-medium text-text-light">Difficulty</th>
                          <th className="text-left p-4 text-small font-medium text-text-light">Access Level</th>
                          <th className="text-left p-4 text-small font-medium text-text-light">Status</th>
                          <th className="text-left p-4 text-small font-medium text-text-light">Created</th>
                          <th className="text-right p-4 text-small font-medium text-text-light">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((course) => {
                          const accessInfo = getAccessLevelInfo(course.accessLevel);
                          return (
                            <tr key={course.id} className="border-t border-neutral-gray/20 hover:bg-neutral-gray/5">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={course.thumbnailUrl}
                                    alt={course.title}
                                    className="w-16 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <div className="text-body font-medium text-text-light line-clamp-1">
                                      {course.title}
                                    </div>
                                    <div className="text-small text-text-secondary">
                                      {course.duration}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-small text-neutral-gray bg-neutral-gray/20 px-2 py-1 rounded">
                                  {course.category}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-small text-text-light">
                                  {course.difficulty}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`text-small px-2 py-1 rounded flex items-center space-x-1 w-fit ${accessInfo.color} ${accessInfo.bgColor}`}>
                                  <span>{accessInfo.icon}</span>
                                  <span>{accessInfo.label}</span>
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center space-x-2">
                                  {course.published ? (
                                    <>
                                      <Eye className="h-4 w-4 text-accent-green" />
                                      <span className="text-small text-accent-green">Published</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="h-4 w-4 text-accent-purple" />
                                      <span className="text-small text-accent-purple">Draft</span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-small text-text-secondary">
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
                                        ? 'text-accent-yellow hover:bg-accent-yellow/20' 
                                        : 'text-neutral-gray cursor-not-allowed opacity-50'
                                    }`}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => setDeleteConfirm(course.id!)}
                                    disabled={!isOnline}
                                    className={`p-2 rounded-lg transition-colors ${
                                      isOnline 
                                        ? 'text-red-400 hover:bg-red-400/20' 
                                        : 'text-neutral-gray cursor-not-allowed opacity-50'
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
                      return (
                        <div key={course.id} className="bg-neutral-gray/10 rounded-lg p-4">
                          <div className="flex items-start space-x-3 mb-3">
                            <img
                              src={course.thumbnailUrl}
                              alt={course.title}
                              className="w-20 h-12 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-body font-medium text-text-light line-clamp-2 mb-1">
                                {course.title}
                              </h3>
                              <div className="flex items-center space-x-2 text-small text-text-secondary mb-2">
                                <span>{course.duration}</span>
                                <span>•</span>
                                <span>{course.category}</span>
                                <span>•</span>
                                <span>{course.difficulty}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-x-small px-2 py-1 rounded flex items-center space-x-1 ${accessInfo.color} ${accessInfo.bgColor}`}>
                                  <span>{accessInfo.icon}</span>
                                  <span>{accessInfo.label}</span>
                                </span>
                                {course.published ? (
                                  <span className="text-x-small text-accent-green bg-accent-green/20 px-2 py-1 rounded flex items-center space-x-1">
                                    <Eye className="h-3 w-3" />
                                    <span>Published</span>
                                  </span>
                                ) : (
                                  <span className="text-x-small text-accent-purple bg-accent-purple/20 px-2 py-1 rounded flex items-center space-x-1">
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
                                  ? 'text-accent-yellow hover:bg-accent-yellow/20' 
                                  : 'text-neutral-gray cursor-not-allowed opacity-50'
                              }`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(course.id!)}
                              disabled={!isOnline}
                              className={`p-2 rounded-lg transition-colors ${
                                isOnline 
                                  ? 'text-red-400 hover:bg-red-400/20' 
                                  : 'text-neutral-gray cursor-not-allowed opacity-50'
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
          <div className="fixed inset-0 bg-primary/80 backdrop-blur-ios flex items-center justify-center z-50 p-4">
            <div className="bg-primary border border-neutral-gray/30 rounded-2xl w-full max-w-md p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-h3 text-text-light mb-2">Delete Course</h3>
                <p className="text-body text-text-secondary">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 border border-neutral-gray/30 text-text-light px-4 py-3 rounded-lg text-body font-medium hover:bg-neutral-gray/20 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCourse(deleteConfirm)}
                  disabled={isDeleting || !isOnline}
                  className={`flex-1 px-4 py-3 rounded-lg text-body font-medium transition-all disabled:opacity-50 flex items-center justify-center space-x-2 ${
                    isOnline 
                      ? 'bg-red-400 text-white hover:bg-red-500' 
                      : 'bg-neutral-gray/50 text-neutral-gray cursor-not-allowed'
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
      </div>
    </AdminRoute>
  );
};

export default AdminCoursesPage;