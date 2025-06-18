import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Target, Download, RefreshCw } from 'lucide-react';
import { getUserTavusAnalytics, getGlobalTavusAnalytics, exportTavusAnalytics, TavusAnalytics } from '../lib/analytics';
import { useAuth } from '../contexts/AuthContext';
import { PrimaryButton, SecondaryButton } from './UIButtons';

interface TavusAnalyticsDashboardProps {
  userId?: string; // If provided, show user-specific analytics
  className?: string;
}

const TavusAnalyticsDashboard: React.FC<TavusAnalyticsDashboardProps> = ({
  userId,
  className = ''
}) => {
  const { currentUser } = useAuth();
  const [analytics, setAnalytics] = useState<TavusAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [timeRange, setTimeRange] = useState(30);
  const [exporting, setExporting] = useState(false);

  // Load analytics data
  useEffect(() => {
    loadAnalytics();
  }, [userId, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const targetUserId = userId || currentUser?.uid;
      const analyticsData = targetUserId 
        ? await getUserTavusAnalytics(targetUserId, timeRange)
        : await getGlobalTavusAnalytics(timeRange);

      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error('❌ Error loading Tavus analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const targetUserId = userId || currentUser?.uid;
      const csvData = await exportTavusAnalytics(targetUserId, timeRange);
      
      // Download CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tavus-analytics-${targetUserId ? 'user' : 'global'}-${timeRange}d.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('❌ Error exporting analytics:', err);
      setError('Failed to export analytics data');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-[16px] p-6 shadow-sm border border-gray-200 ${className}`}>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A59] mb-4"></div>
          <p className="text-lg text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-[16px] p-6 shadow-sm border border-gray-200 ${className}`}>
        <div className="text-center py-8">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <SecondaryButton onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`bg-white rounded-[16px] p-6 shadow-sm border border-gray-200 ${className}`}>
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[16px] p-6 shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-[#FF7A59]" />
            <span>AI Practice Analytics</span>
          </h3>
          <p className="text-base text-gray-600 mt-1">
            {userId ? 'Your practice session insights' : 'Global practice session insights'} 
            {' '}(Last {timeRange} days)
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF7A59]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          
          {/* Export Button */}
          <SecondaryButton
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{exporting ? 'Exporting...' : 'Export'}</span>
          </SecondaryButton>
          
          {/* Refresh Button */}
          <SecondaryButton
            onClick={loadAnalytics}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </SecondaryButton>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#FF7A59]/10 rounded-lg p-4 border border-[#FF7A59]/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FF7A59] rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageAccuracy}%</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.averageDuration / 60)}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      {analytics.popularCourses.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Courses</h4>
          <div className="space-y-3">
            {analytics.popularCourses.slice(0, 5).map((course, index) => (
              <div key={course.courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#FF7A59] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">Course {course.courseId}</p>
                    <p className="text-sm text-gray-600">{course.sessionCount} sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-gray-900">{course.completionRate}%</p>
                  <p className="text-sm text-gray-600">completion</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Engagement */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Engagement Overview</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#FF7A59]">{analytics.userEngagement.dailyActive}</p>
            <p className="text-sm text-gray-600">Daily Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#FF7A59]">{analytics.userEngagement.weeklyActive}</p>
            <p className="text-sm text-gray-600">Weekly Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#FF7A59]">{analytics.userEngagement.monthlyActive}</p>
            <p className="text-sm text-gray-600">Monthly Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TavusAnalyticsDashboard;