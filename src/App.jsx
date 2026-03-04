import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PomodoroProvider } from '@context/PomodoroContext';
import { MusicProvider } from '@context/MusicContext';
import { AudioProvider } from './context/AudioContext';
import { AuthProvider } from './context/AuthContext';
import Dashboard from '@components/layout/Dashboard';
import SpotifyCallback from '@components/auth/SpotifyCallback';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '12px',
          },
        }}
      />
      <AudioProvider>
        <PomodoroProvider>
          <MusicProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/callback" element={<SpotifyCallback />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </MusicProvider>
        </PomodoroProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;