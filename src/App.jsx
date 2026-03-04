import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PomodoroProvider } from '@context/PomodoroContext';
import { MusicProvider } from '@context/MusicContext';
import { AudioProvider } from './context/AudioContext';
import Dashboard from '@components/layout/Dashboard';
import SpotifyCallback from '@components/auth/SpotifyCallback';

function App() {
  return (
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
  );
}

export default App;