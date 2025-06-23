import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { useAnalytics } from './hooks/useAnalytics';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import BrevEduPlusPage from './pages/BrevEduPlusPage';
import AdminCoursesPage from './pages/AdminCoursesPage';

// Analytics wrapper component
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAnalytics();
  return <>{children}</>;
};
function App() {
  return (
    <div className="font-inter antialiased font-feature-default">
      <AuthProvider>
        <Router>
          <AnalyticsWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/brevedu-plus" element={<BrevEduPlusPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
          </Routes>
          </AnalyticsWrapper>
          
          {/* Toast Container */}
          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="bg-primary border border-neutral-gray/30 text-text-light font-inter"
            progressClassName="bg-accent-yellow"
          />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;