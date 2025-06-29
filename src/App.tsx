import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import FontLoader from './components/FontLoader';
import { useAnalytics } from './hooks/useAnalytics';
import ScrollToTop from './components/ScrollToTop';
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
    <FontLoader>
      <div className="font-sans antialiased">
        <AuthProvider>
          <Router>
            <ScrollToTop />
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
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName="bg-white border border-black/5 text-black font-sans rounded-[0.8rem] shadow-lg"
              progressClassName="bg-hyper-yellow"
            />
          </Router>
        </AuthProvider>
      </div>
    </FontLoader>
  );
}

export default App;