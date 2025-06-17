import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import BrevEduPlusPage from './pages/BrevEduPlusPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/brevedu-plus" element={<BrevEduPlusPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;