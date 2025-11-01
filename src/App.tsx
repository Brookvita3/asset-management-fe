import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AssetTypes } from './components/AssetTypes';
import { Layout } from './components/Layout';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import { mockUsers } from './lib/mockData';
 
export default function App() {
  // Use a mock admin user so header/sidebar render correctly
  const currentUser = mockUsers[0];
 
  const handleLogout = () => {
    // no-op for simplified app
    console.log('logout');
  };
 
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider currentUser={currentUser}>
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <AssetTypes />
          </Layout>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}