import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { Provider } from 'react-redux';
import { store } from './store';

registerSW({
  immediate: true,
  onRegistered(r) {
    console.log('PWA: Service Worker successfully registered');
  },
  onRegisterError(error) {
    console.error('PWA: Error registering the Service Worker', error);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* ELIMINAR <AuthProvider> Y SU CIERRE </AuthProvider> */}
          <App />
        {/* ELIMINAR </AuthProvider> */}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)