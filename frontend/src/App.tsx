import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import UserDashboard from './components/UserDashboard';

const App: React.FC = () => {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a token in localStorage when the component mounts
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
    }
  }, []);

  const handleLogin = (token: string) => {
    setAdminToken(token); // Set the admin token after successful login
    localStorage.setItem('adminToken', token); // Store the token in localStorage
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken'); // Remove the token from localStorage
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route
            path="/admin-dashboard"
            element={
              adminToken ? (
                <AdminDashboard adminToken={adminToken} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              adminToken ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <AdminLogin onLogin={handleLogin} />
              )
            }
          />
          <Route path="/" element={<Navigate to="/user-dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;