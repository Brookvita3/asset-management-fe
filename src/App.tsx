import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Assets } from './components/Assets';
import { AssetTypes } from './components/AssetTypes';
import { Users } from './components/Users';
import { Departments } from './components/Departments';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { UserProfile } from './components/UserProfile';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { mockUsers } from './lib/mockData';
import { User, UserRole } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Convert date strings back to Date objects
        user.createdAt = new Date(user.createdAt);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    // Find a user with the specified role
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // Show login page if not authenticated
  if (!currentUser) {
    return (
      <BrowserRouter>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider currentUser={currentUser}>
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route 
                path="/asset-types" 
                element={
                  currentUser.role === UserRole.ADMIN 
                    ? <AssetTypes /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/users" 
                element={
                  currentUser.role === UserRole.ADMIN 
                    ? <Users /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/departments" 
                element={
                  currentUser.role === UserRole.ADMIN 
                    ? <Departments /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route path="/reports" element={<Reports />} />
              <Route 
                path="/settings" 
                element={
                  currentUser.role === UserRole.ADMIN 
                    ? <Settings /> 
                    : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <UserProfile 
                    currentUser={currentUser} 
                    onUpdateProfile={handleUpdateProfile}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
