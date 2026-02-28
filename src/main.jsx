import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { Provider } from 'react-redux'
import { store } from './store'

registerSW({
  immediate: true,
  onRegistered() { },
  onRegisterError() { }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)