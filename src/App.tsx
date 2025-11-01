import React from 'react';
import { AssetTypes } from './components/AssetTypes';

export default function App() {
  // Minimal app: only render AssetTypes component
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <AssetTypes />
    </div>
  );
}
