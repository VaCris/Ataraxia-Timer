import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { registerSW } from 'virtual:pwa-register'
import { store } from '@store/index'
import App from '@/App'
import './index.css'
import { startVersionGuard } from '@/shared/version/startVersionGuard'

const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_, registration) {
    startVersionGuard(registration)

    if (registration) {
      setInterval(() => {
        registration.update()
      }, 30 * 60 * 1000)
    }
  },
  onRegisterError(error) {
    console.error(error)
  },
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