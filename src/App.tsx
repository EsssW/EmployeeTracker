import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthPage } from './components/AuthPage';
import { RegistrationPage } from './components/RegistrationPage';
import { Dashboard } from './components/Dashboard';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const { currentPage, isAuthenticated } = state;

  if (!isAuthenticated) {
    if (currentPage === 'registration') {
      return <RegistrationPage />;
    }
    return <AuthPage />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;