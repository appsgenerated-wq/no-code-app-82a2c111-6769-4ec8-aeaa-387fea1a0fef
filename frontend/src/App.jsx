import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import { testBackendConnection } from './services/apiService.js';
import config from './constants.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [backendConnected, setBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const manifest = new Manifest(config.BACKEND_URL);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const result = await testBackendConnection();
      setBackendConnected(result.success);
      
      if (result.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('user').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
        } catch (error) {
          console.log('No active session found.');
          setUser(null);
          setCurrentScreen('landing');
        }
      } else {
        console.error('❌ [APP] Backend connection failed.');
      }
      setIsLoading(false);
    };
    initializeApp();
  }, []);

  const login = async (email, password) => {
    await manifest.login(email, password);
    const loggedInUser = await manifest.from('user').me();
    setUser(loggedInUser);
    setCurrentScreen('dashboard');
  };

  const signup = async (email, password, name, lunarAddress) => {
    await manifest.from('user').signup({ email, password, name, lunarAddress, role: 'customer' });
    await manifest.login(email, password);
    const newUser = await manifest.from('user').me();
    setUser(newUser);
    setCurrentScreen('dashboard');
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Connecting to Lunar Network...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${backendConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {backendConnected ? '✅ Backend Connected' : '❌ Backend Disconnected'}
        </div>
      </div>
      
      {currentScreen === 'landing' || !user ? (
        <LandingPage onLogin={login} onSignup={signup} />
      ) : (
        <DashboardPage user={user} onLogout={logout} manifest={manifest} />
      )}
    </div>
  );
}

export default App;
