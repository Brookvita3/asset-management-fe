import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AssetTypes } from './components/AssetTypes';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { isAuthenticated, getCurrentUser, logoutAPI } from './services/authAPI';
import { User } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const user = getCurrentUser();
        setCurrentUser(user);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    // After successful login, get user from localStorage
    const user = getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = () => {
    // Clear localStorage and reset state
    logoutAPI();
    setCurrentUser(null);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!currentUser) {
    return (
      <BrowserRouter>
        <Login onLogin={handleLoginSuccess} />
        <Toaster position="top-right" />
      </BrowserRouter>
    );
  }

  // Show main app if authenticated
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider currentUser={currentUser}>
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <AssetTypes />
          </Layout>
        </AuthProvider>
      </SettingsProvider>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
