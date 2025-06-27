import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import AdminRoute from '../components/AdminRoute';
import OfflineBanner from '../components/OfflineBanner';
import CourseModal from '../components/CourseModal';
import AdminHeader from './admin/components/AdminHeader';
import CourseFilters from './admin/components/CourseFilters';
import CourseStats from './admin/components/CourseStats';
import DragDropCourseTable from './admin/components/DragDropCourseTable';
import DragDropCourseMobileGrid from './admin/components/DragDropCourseMobileGrid';
import DeleteConfirmationModal from './admin/components/DeleteConfirmationModal';
import TavusSettingsModal from './admin/components/TavusSettingsModal';
import { useFirestoreCourses } from '../hooks/useFirestoreCourses';
import { useNetworkStatusWithUtils } from '../hooks/useNetworkStatus';
import { deleteCourse, updateCourseOrder } from '../lib/courseService';
import { notifySuccess, notifyError, notifyLoading, updateToast } from '../lib/toast';
import { Course } from '../types';
import { filterCourses, calculateCourseStats } from './admin/utils/courseHelpers';

const AdminCoursesPage: React.FC = () => {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('All');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  
  // Modal state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [showTavusSettings, setShowTavusSettings] = useState(false);

  // Network status with toast notifications
  const { isOnline, executeIfOnline } = useNetworkStatusWithUtils(true);

  // Fetch all courses (including unpublished) for admin - no access level filtering
  const { courses, loading, error } = useFirestoreCourses({ 
    publishedOnly: false,
    includeRestricted: true // Admin sees all courses regardless of access level
  });

  // Apply filters
  const filteredCourses = filterCourses(courses, {
    searchQuery,
    selectedCategory,
    selectedAccessLevel,
    showPublishedOnly
  });

  // Calculate stats
  const stats = calculateCourseStats(courses);

  // Event handlers
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

  const handleTavusSettings = () => {
    executeIfOnline(() => {
      setShowTavusSettings(true);
    }, 'Cannot access settings while offline.');
  };

  const handleSaveCourse = (course: Course) => {
    // The modal handles the actual save operation and shows toasts
    // The real-time listener will automatically update the courses list
    console.log('Course saved:', course.title);
  };

  const handleReorderCourses = async (reorderedCourses: Course[]) => {
    executeIfOnline(async () => {
      const toastId = notifyLoading('Updating course order...');
      
      try {
        // Prepare updates with new display order
        const courseUpdates = reorderedCourses.map((course, index) => ({
          id: course.id!,
          displayOrder: index + 1
        }));
        
        await updateCourseOrder(courseUpdates);
        updateToast(toastId, '✅ Course order updated successfully!', 'success');
      } catch (error: any) {
        console.error('Error updating course order:', error);
        const errorMessage = error.message || 'Failed to update course order. Please try again.';
        updateToast(toastId, `❌ ${errorMessage}`, 'error');
      }
    }, 'Cannot reorder courses while offline. Please check your connection.');
  };
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedAccessLevel('All');
    setSearchQuery('');
    setShowPublishedOnly(false);
  };

  return (
    <PageTransition type="slide">
      <AdminRoute>
        <div className="min-h-screen bg-gray-50">
          {/* Offline Banner */}
          <OfflineBanner isVisible={!isOnline} />
          
          {/* Header */}
          <div className={!isOnline ? 'mt-16' : ''}>
            <AdminHeader
              isOnline={isOnline}
              onNewCourse={handleNewCourse}
              onTavusSettings={handleTavusSettings}
            />
          </div>

          {/* Main Content */}
          <div className="max-w-screen-2xl mx-auto px-padding-medium py-padding-medium">
            {/* Filters */}
            <CourseFilters
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedAccessLevel={selectedAccessLevel}
              showPublishedOnly={showPublishedOnly}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onAccessLevelChange={setSelectedAccessLevel}
              onPublishedOnlyChange={setShowPublishedOnly}
            />

            {/* Stats */}
            <CourseStats stats={stats} />

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

            {/* Course List */}
            {!loading && !error && (
              <>
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">
                      {courses.length === 0 ? 'No courses found.' : 'No courses match your current filters.'}
                    </p>
                    {courses.length > 0 && (
                      <button
                        onClick={clearAllFilters}
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

                    {/* Desktop Table */}
                    <DragDropCourseTable
                      courses={filteredCourses}
                      isOnline={isOnline}
                      onEditCourse={handleEditCourse}
                      onDeleteCourse={setDeleteConfirm}
                      onReorderCourses={handleReorderCourses}
                    />

                    {/* Mobile Grid */}
                    <DragDropCourseMobileGrid
                      courses={filteredCourses}
                      isOnline={isOnline}
                      onEditCourse={handleEditCourse}
                      onDeleteCourse={setDeleteConfirm}
                      onReorderCourses={handleReorderCourses}
                    />
                  </>
                )}
              </>
            )}
          </div>

          {/* Modals */}
          <DeleteConfirmationModal
            isOpen={!!deleteConfirm}
            isDeleting={isDeleting}
            isOnline={isOnline}
            onConfirm={() => deleteConfirm && handleDeleteCourse(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
          />

          <CourseModal
            isOpen={showCourseModal}
            mode={modalMode}
            course={selectedCourse}
            onClose={() => setShowCourseModal(false)}
            onSave={handleSaveCourse}
          />

          <TavusSettingsModal
            isOpen={showTavusSettings}
            onClose={() => setShowTavusSettings(false)}
          />
        </div>
      </AdminRoute>
    </PageTransition>
  );
};

export default AdminCoursesPage;