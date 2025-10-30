import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Auth/Login';
import TrayInventorySystem from './TrayInventorySystem';

const App: React.FC = () => {
  const { user, loading, login, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return <TrayInventorySystem />;
};

export default App;

