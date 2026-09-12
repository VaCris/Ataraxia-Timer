import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { registerSW } from 'virtual:pwa-register'
import '@/shared/utils/console-suppress'
import '@/infrastructure/api/openapi-init'
import { store } from '@store/index'
import App from '@/App'
import { startVersionGuard } from '@/shared/version/startVersionGuard'
import './index.css'
import './styles/ux-hardening.css'
import './styles/settings-light.css'

registerSW({
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
