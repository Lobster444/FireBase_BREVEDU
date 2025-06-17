import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import BrevEduPlusPage from './pages/BrevEduPlusPage';
import AdminCoursesPage from './pages/AdminCoursesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/brevedu-plus" element={<BrevEduPlusPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
        </Routes>
        
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
          toastClassName="bg-primary border border-neutral-gray/30 text-text-light"
          progressClassName="bg-accent-yellow"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;